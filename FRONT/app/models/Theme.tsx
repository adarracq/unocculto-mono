export default class Theme {
    _id: string | null;
    name: string;
    labelFR: string;
    labelEN: string;
    base64Icon: string;

    constructor(
        name: string,
        labelFR: string,
        labelEN: string,
        base64Icon: string,
    ) {
        this._id = null;
        this.name = name;
        this.labelFR = labelFR;
        this.labelEN = labelEN;
        this.base64Icon = base64Icon;
    }
}