export default class Course {
    _id: string | null;
    number: number;
    name: string;
    labelFR: string;
    labelEN: string;
    base64Icon: string;

    constructor(
        number: number,
        name: string,
        labelFR: string,
        labelEN: string,
        base64Icon: string,
    ) {
        this._id = null;
        this.number = number;
        this.name = name;
        this.labelFR = labelFR;
        this.labelEN = labelEN;
        this.base64Icon = base64Icon;
    }
}