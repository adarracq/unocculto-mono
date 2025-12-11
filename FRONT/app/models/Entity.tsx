export default class Entity {
    _id: string | null;
    name: string;
    labelFR: string;
    labelEN: string;
    descriptionMarkDownFR: string;
    descriptionMarkDownEN: string;
    dateStart: number;
    dateEnd: number;
    availableSnapshots: number[] = []; // Liste des snapshots disponibles pour cette entité -123000, -10000, -8000, -5000, -4000, -3000, -2000...
    type: string; // ['EMPIRE', 'TRIBE', 'KINGDOM', 'REPUBLIC', 'CULTURE'],

    constructor(
        name: string,
        labelFR: string,
        labelEN: string,
        descriptionMarkDownFR: string,
        descriptionMarkDownEN: string,
        dateStart: number,
        dateEnd: number,
        type: string,
    ) {
        this._id = null;
        this.name = name;
        this.labelFR = labelFR;
        this.labelEN = labelEN;
        this.descriptionMarkDownFR = descriptionMarkDownFR;
        this.descriptionMarkDownEN = descriptionMarkDownEN;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.type = type;
    }
}