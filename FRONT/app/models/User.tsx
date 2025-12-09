export default class User {
    _id: string | null;
    email: string;
    pseudo: string | null;
    expoPushToken: string | null;
    avatarID: number | null;
    unlockedAvatarIDs: number[] | [];
    themes: string[] | [];
    lifes: number;
    coins: number;
    dayStreak: number | null;
    lastCourseDate: Date | null;
    chaptersCompleted: string[];

    constructor(email: string) {
        this.email = email;
        this._id = null;
        this.pseudo = null;
        this.avatarID = 0;
        this.unlockedAvatarIDs = [0];
        this.expoPushToken = null;
        this.themes = [];
        this.lifes = 0;
        this.coins = 0;
        this.dayStreak = 0;
        this.lastCourseDate = null;
        this.chaptersCompleted = [];
    }
}