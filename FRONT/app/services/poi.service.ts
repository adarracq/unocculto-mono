import POI from "../models/POI";
import { fetchWrapper } from "../utils/FetchWrapper";

const baseUrl = process.env.EXPO_PUBLIC_API_URL + '/api/poi';

export const poiService = {
    getById,
    getByChapter,
    getByCourse,
    create,
    createMany
};

function getById(id: string) {
    return fetchWrapper.get(`${baseUrl}/id/${id}`);
}

function getByChapter(chapterID: string) {
    return fetchWrapper.get(`${baseUrl}/chapter/${chapterID}`);
}

function getByCourse(courseID: string) {
    return fetchWrapper.get(`${baseUrl}/course/${courseID}`);
}

function create(params: POI) {
    return fetchWrapper.post(baseUrl, params);
}

function createMany(params: POI[]) {
    return fetchWrapper.post(baseUrl + '/many', params);
}
