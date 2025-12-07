import Chapter from "../models/Chapter";
import { fetchWrapper } from "../utils/FetchWrapper";

const baseUrl = process.env.EXPO_PUBLIC_API_URL + '/api/chapter';

export const chapterService = {
    getByID,
    getByCourseID,
    getChapterStats,
    getAll,
    create
};

function getByID(id: string) {
    return fetchWrapper.get(`${baseUrl}/id/${id}`);
}

function getAll() {
    return fetchWrapper.get(baseUrl + '/');
}

function getByCourseID(courseID: string) {
    return fetchWrapper.get(`${baseUrl}/course/${courseID}`);
}

function getChapterStats(chapterID: string, userID: string) {
    return fetchWrapper.get(`${baseUrl}/${chapterID}/${userID}`);
}

function create(params: Chapter) {
    return fetchWrapper.post(baseUrl + '/', params);
}
