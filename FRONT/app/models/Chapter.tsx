export default class Chapter {
    _id: string | null;
    number: number;
    name: string;
    labelFR: string;
    labelEN: string;
    base64Icon: string;
    dateStart: number; // exemple 18/01/1813 -> 18130118
    dateEnd: number;
    courseID: string;
    courseNB: number;

    constructor(
        number: number,
        name: string,
        labelFR: string,
        labelEN: string,
        base64Icon: string,
        dateStart: number,
        dateEnd: number,
        courseID: string,
        courseNB: number,
    ) {
        this._id = null;
        this.number = number;
        this.name = name;
        this.labelFR = labelFR;
        this.labelEN = labelEN;
        this.base64Icon = base64Icon;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.courseID = courseID;
        this.courseNB = courseNB;
    }
}