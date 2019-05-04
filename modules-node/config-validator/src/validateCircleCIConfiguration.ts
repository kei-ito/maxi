import * as path from 'path';
import * as assert from 'assert';
import {IMAXIJSCircleCIConfig, IMAXIJSConfigYMLWorkflow, IMAXIJSConfigYMLWorkflowJob} from './types';

const getJobConfiguration = (
    workflow: IMAXIJSConfigYMLWorkflow | undefined,
    jobName: string,
): IMAXIJSConfigYMLWorkflowJob | null => {
    const jobConfiguration = workflow && workflow.jobs.find((job) => typeof job[jobName] === 'object');
    return jobConfiguration && jobConfiguration[jobName] || null;
};

export const validateCircleCIConfiguration = async (
    circleCIConfiguration: IMAXIJSCircleCIConfig,
    packageDirectoryList: Array<string>,
): Promise<void> => {
    packageDirectoryList.forEach((packageDirectory) => {
        const directoryName = path.basename(packageDirectory);
        const testJobName = `test-${directoryName}`;
        const job = circleCIConfiguration.jobs[testJobName];
        if (job) {
            assert.deepEqual(
                job.steps,
                [
                    {'attach_workspace': {at: '.'}},
                    {run: `npx lerna run test --parallel --scope @maxi-js/${directoryName}`},
                ],
                `(.circleci/config.yml).jobs.${testJobName} is invalid`,
            );
        } else {
            assert.equal(typeof job, 'object', `(.circleci/config.yml).jobs.${testJobName} is ${job}`);
        }
    });
    Object.entries(circleCIConfiguration.workflows).forEach(([workflowName, workflow]) => {
        if (typeof workflow === 'object') {
            const buildJobConfiguration = getJobConfiguration(workflow, 'build');
            if (buildJobConfiguration) {
                packageDirectoryList.forEach((packageDirectory) => {
                    const directoryName = path.basename(packageDirectory);
                    const testJobName = `test-${directoryName}`;
                    const jobConfiguration = getJobConfiguration(workflow, testJobName);
                    if (jobConfiguration) {
                        assert.deepEqual(
                            jobConfiguration.filters,
                            buildJobConfiguration.filters,
                            `(.circleci/config.yml).workflows.${workflowName}.${testJobName}.filters is invalid`,
                        );
                        assert.deepEqual(
                            jobConfiguration.requires,
                            ['build'],
                            `(.circleci/config.yml).workflows.${workflowName}.${testJobName}.requires is invalid`,
                        );
                    } else {
                        assert.equal(
                            jobConfiguration && typeof jobConfiguration,
                            'object',
                            `(.circleci/config.yml).workflows.${workflowName}.${testJobName} is ${jobConfiguration}`,
                        );
                    }
                });
                const reportJobName = 'report-test-results';
                const reportConfiguration = getJobConfiguration(workflow, reportJobName);
                if (reportConfiguration) {
                    assert.deepEqual(
                        reportConfiguration.filters,
                        buildJobConfiguration.filters,
                        `(.circleci/config.yml).workflows.${workflowName}.${reportJobName}.filters is invalid`,
                    );
                    assert.deepEqual(
                        reportConfiguration.requires,
                        [
                            'test-configurations',
                        ].concat(packageDirectoryList.map((packageDirectory) => `test-${path.basename(packageDirectory)}`)),
                        `(.circleci/config.yml).workflows.${workflowName}.${reportJobName}.requires is invalid`,
                    );
                } else {
                    assert.equal(
                        reportConfiguration && typeof reportConfiguration,
                        'object',
                        `(.circleci/config.yml).workflows.${workflowName}.${reportJobName} is ${reportConfiguration}`,
                    );
                }
            }
        }
    });
};
