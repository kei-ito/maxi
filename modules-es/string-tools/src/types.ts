export type ITableLike<TType = string | number | null | undefined> = Array<Array<TType>>;

export interface IXSVMapper<TValue> {
    (input: string, index: number): TValue,
}
