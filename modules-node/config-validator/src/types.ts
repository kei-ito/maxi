import * as ESLint from 'eslint';

export type IMAXIJSConfigYMLJobStep =
| 'checkout'
| {restore_cache: {keys: Array<string>}}
| {save_cache: {paths: Array<string>, key: string}}
| {persist_to_workspace: {root: string, paths: Array<string>}}
| {attach_workspace: {at: string}}
| {run: string};

export interface IMAXIJSConfigYMLJob {
    docker: Array<{image: string}>,
    steps: Array<IMAXIJSConfigYMLJobStep>,
}

export type IMAXIJSConfigYMLWorkflowJobFilter = {only: string} | {ignore: string};

export interface IMAXIJSConfigYMLWorkflowJob {
    filters?: {
        branches?: IMAXIJSConfigYMLWorkflowJobFilter,
        tags?: IMAXIJSConfigYMLWorkflowJobFilter,
    },
    requires: Array<string>,
}

export interface IMAXIJSConfigYMLWorkflow {
    jobs: Array<{[name: string]: IMAXIJSConfigYMLWorkflowJob | undefined}>,
}

export interface IMAXIJSCircleCIConfig {
    version: string,
    jobs: {
        [name: string]: IMAXIJSConfigYMLJob | undefined,
    },
    workflows: {
        [name: string]: IMAXIJSConfigYMLWorkflow | number | undefined,
    },
}

export interface IMAXIJSLernaJSON {
    version: string,
    packages: Array<string>,
    npmClient: 'npm' | 'yarn',
    command?: {
        publish?: {
            allowBranch?: string,
            ignoreChanges?: Array<string>,
            message?: string,
        },
        bootstrap?: {
            ignore?: string,
            npmClientArgs?: Array<string>,
            scope?: Array<string>,
        },
    },
}

export interface IPerson {
    name: string,
    email: string,
    url: string,
}

export interface IPublishConfig {
    access: 'public',
}

export interface IEngines {
    [name: string]: string | undefined,
}

export interface IScripts {
    [command: string]: string | undefined,
}

export interface IDependencies {
    [name: string]: string | undefined,
}

export interface IMAXIJSPackageJSON {
    name: string,
    version: string,
    license: string,
    author: IPerson,
    contributors?: Array<IPerson>,
    homepage: string,
    repository: string,
    publishConfig: IPublishConfig,
    engines: IEngines,
    main: string,
    files: Array<string>,
    scripts: IScripts,
    dependencies: IDependencies,
    devDependencies: IDependencies,
}

export interface IMAXIJSRootPackageJSON {
    private: true,
    license: string,
    scripts: IScripts,
    devDependencies: IDependencies,
    eslintConfig: ESLint.Linter.Config & {
        extends: Array<string>,
        overrides: Array<ESLint.Linter.Config & {files: Array<string>}>,
    },
    ava: {},
    commitlint: {
        extends: Array<string>,
        rules: {
            'scope-enum': [
                number,
                string,
                Array<string>,
            ],
        },
    },
    husky: {},
    'renovate-config': {},
}

export interface IPackageTestParameters {
    lernaProjectDirectory: string,
    lernaJSON: IMAXIJSLernaJSON,
    rootPackageJSON: IMAXIJSRootPackageJSON,
    packageDirectory: string,
    packageJSON: IMAXIJSPackageJSON,
}
