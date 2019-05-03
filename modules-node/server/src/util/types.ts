export type IHeaderValue = string | number | null | undefined;
export interface IHeader {
    [name: string]: IHeaderValue | Array<IHeaderValue>,
}
