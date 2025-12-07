export default class POI {
    _id: string | null;
    name: string;
    labelFR: string;
    labelEN: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    dateStart: number;
    dateEnd: number | null; // null means no end date
    chapterID: string;
    courseID: string;
    entityID: string | null;
    themes: string[];

    content: {
        intro: string
        bodyMarkdown: string
        media: {
            type: 'image' | 'video' | 'audio';
            uri: string;
        },
    }
    quiz: {
        question: string;
        answers: {
            text: string;
            isCorrect: boolean;
        }[];
        explanation: string;
    }[];



    constructor(
        name: string,
        labelFR: string,
        labelEN: string,
        location: {
            type: 'Point';
            coordinates: [number, number];
        },
        dateStart: number,
        dateEnd: number | null,
        chapterID: string,
        courseID: string,
        entityID: string | null,
        themes: string[],
        content: {
            intro: string
            bodyMarkdown: string
            media: {
                type: 'image' | 'video' | 'audio';
                uri: string;
            },
        },
        quiz: {
            question: string;
            answers: {
                text: string;
                isCorrect: boolean;
            }[];
            explanation: string;
        }[],
    ) {
        this._id = null;
        this.name = name;
        this.labelFR = labelFR;
        this.labelEN = labelEN;
        this.location = location;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.chapterID = chapterID;
        this.courseID = courseID;
        this.entityID = entityID;
        this.themes = themes;
        this.content = content;
        this.quiz = quiz;
    }
}