export interface IXSVMapper<TValue> {
    (input: string, index: number): TValue,
}
