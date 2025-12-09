import User from "../models/User";
import { fetchWrapper } from "../utils/FetchWrapper";

const baseUrl = process.env.EXPO_PUBLIC_API_URL + '/api/user';

// Interfaces for service parameters
interface LoginOrSignupParams {
    email: string;
    language?: string;
}

interface VerifyEmailCodeParams {
    email: string;
    code: string;
}


interface ExpoPushTokenParams {
    token: string;
    email: string;
}

export const userService = {
    loginOrSignup,
    verifyEmailCode,
    getByEmail,
    getById,
    update,
    testPseudoValidity,
    addCompletedChapter,
    loseLife,
    saveExpoPushToken,
    deleteAccountAndData
};

function loginOrSignup(params: LoginOrSignupParams) {
    return fetchWrapper.post(baseUrl + '/loginOrSignup', params);
}

function verifyEmailCode(params: VerifyEmailCodeParams) {
    return fetchWrapper.post(baseUrl + '/code', params);
}

function getByEmail(email: string) {
    return fetchWrapper.get(baseUrl + '/' + email);
}

function getById(id: string) {
    return fetchWrapper.get(`${baseUrl}/id/${id}`);
}

function update(params: User) {
    return fetchWrapper.put(baseUrl + '/', params);
}

function testPseudoValidity(pseudo: string) {
    return fetchWrapper.get(baseUrl + '/verifyPseudo/' + pseudo);
}

function addCompletedChapter(chapterId: string, nbQuestions: number) {
    return fetchWrapper.post(baseUrl + '/chapter', { chapterId, nbQuestions });
}

function loseLife() {
    return fetchWrapper.post(baseUrl + '/loseLife', {});
}

function saveExpoPushToken(params: ExpoPushTokenParams) {
    return fetchWrapper.put(baseUrl + '/expoPushToken', params);
}

function deleteAccountAndData(id: string) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}