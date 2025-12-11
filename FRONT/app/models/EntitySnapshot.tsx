export default class EntitySnapshot {
    _id: string | null;
    entityId: string;
    entityName: string;
    year: number;
    geometry: {
        type: string;
        coordinates: number[][][] | number[][][][];
    };

    constructor(
        entityId: string,
        entityName: string,
        year: number,
        geometry: {
            type: string;
            coordinates: number[][][] | number[][][][];
        }
    ) {
        this._id = null;
        this.entityId = entityId;
        this.entityName = entityName;
        this.year = year;
        this.geometry = geometry;
    }



}