export default class User {
    _id: string | null;
    email: string;
    pseudo: string | null;
    expoPushToken: string | null;
    avatarID: number | null;
    unlockedAvatarIDs: number[] | [];
    themes: string[] | [];
    gems: number | null;
    points: number | null;
    dayStreak: number | null;
    lastCourseDate: Date | null;
    POIsCompleted: string[] | [];

    constructor(email: string) {
        this.email = email;
        this._id = null;
        this.pseudo = null;
        this.avatarID = 0;
        this.unlockedAvatarIDs = [0];
        this.expoPushToken = null;
        this.themes = [];
        this.gems = 0;
        this.points = 0;
        this.dayStreak = 0;
        this.lastCourseDate = null;
        this.POIsCompleted = [];
    }
}