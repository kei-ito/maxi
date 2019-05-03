export interface IObjectData {
    id: string,
    name: string,
    category: string,
    /** Right Ascension (Equatorial coordinate system) */
    ra: number,
    /** Declination (Equatorial coordinate system) */
    dec: number,
    /** Galactic longitude (Galactic coordinate system) */
    l: number,
    /** Galactic latitude (Galactic coordinate system) */
    b: number,
    source: {
        title: string,
        urls: {
            html: string,
            image: string,
            data: string,
        },
    },
}

export interface IObjectCatalog {
    list: Array<IObjectData>,
    createdAt: string,
    source: {
        title: string,
        urls: {
            html: string,
        },
    },
}
