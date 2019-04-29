import * as ESLint from 'eslint';

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
    commitlint: {},
    husky: {},
    'renovate-config': {},
}
