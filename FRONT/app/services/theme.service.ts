import Theme from "../models/Theme";
import { fetchWrapper } from "../utils/FetchWrapper";

const baseUrl = process.env.EXPO_PUBLIC_API_URL + '/api/theme';

export const themeService = {
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

function create(params: Theme) {
    return fetchWrapper.post(baseUrl + '/', params);
}
