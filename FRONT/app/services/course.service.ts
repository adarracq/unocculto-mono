import Course from "../models/Course";
import { fetchWrapper } from "../utils/FetchWrapper";

const baseUrl = process.env.EXPO_PUBLIC_API_URL + '/api/course';

export const courseService = {
    getById,
    getAll,
    create
};

function getById(id: string) {
    return fetchWrapper.get(`${baseUrl}/id/${id}`);
}

function getAll() {
    return fetchWrapper.get(baseUrl + '/');
}

function create(params: Course) {
    return fetchWrapper.post(baseUrl + '/', params);
}
