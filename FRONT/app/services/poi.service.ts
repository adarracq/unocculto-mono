import POI from "../models/POI";
import { fetchWrapper } from "../utils/FetchWrapper";

const baseUrl = process.env.EXPO_PUBLIC_API_URL + '/api/poi';

export const poiService = {
    getById,
    create,
    createMany
};

function getById(id: string) {
    return fetchWrapper.get(`${baseUrl}/id/${id}`);
}

function create(params: POI) {
    return fetchWrapper.post(baseUrl, params);
}

function createMany(params: POI[]) {
    return fetchWrapper.post(baseUrl + '/many', params);
}
