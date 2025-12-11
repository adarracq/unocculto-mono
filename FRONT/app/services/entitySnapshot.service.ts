import EntitySnapshot from "../models/EntitySnapshot";
import { fetchWrapper } from "../utils/FetchWrapper";

const baseUrl = process.env.EXPO_PUBLIC_API_URL + '/api/entitySnapshots';

export const entitySnapshotService = {
    getByYear,
    getAll,
    create,
};

function getByYear(year: number) {
    return fetchWrapper.get(`${baseUrl}/year/${year}`);
}

function getAll() {
    return fetchWrapper.get(`${baseUrl}`);
}

function create(params: EntitySnapshot) {
    return fetchWrapper.post(baseUrl, params);
}