import Entity from "../models/Entity";
import { fetchWrapper } from "../utils/FetchWrapper";

const baseUrl = process.env.EXPO_PUBLIC_API_URL + '/api/entity';

export const entityService = {
    getById,
    getAll,
    create,
    createMany
};

function getById(id: string) {
    return fetchWrapper.get(`${baseUrl}/id/${id}`);
}

function getAll() {
    return fetchWrapper.get(`${baseUrl}`);
}

function create(params: Entity) {
    return fetchWrapper.post(baseUrl, params);
}

function createMany(params: Entity[]) {
    return fetchWrapper.post(baseUrl + '/many', params);
}
