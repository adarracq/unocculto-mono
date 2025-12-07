import AsyncStorageUser from "./AsyncStorageUser";

export const fetchWrapper = {
    get,
    post,
    put,
    putImage,
    delete: _delete
};

async function get(url: string) {
    let token = await AsyncStorageUser.getToken();
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: { authorization: 'Bearer ' + token }
    };
    return fetch(url, requestOptions).then(handleResponse);
}

async function post(url: string, body: any) {
    let token = await AsyncStorageUser.getToken();
    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token
        },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

async function put(url: string, body: any) {
    let token = await AsyncStorageUser.getToken();
    const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'multipart/form-data',
            authorization: 'Bearer ' + token
        },
        body: JSON.stringify(body),
        credentials: 'include' as RequestCredentials
    };
    return fetch(url, requestOptions).then(handleResponse);
}


async function putImage(url: string, formData: any) {
    let token = await AsyncStorageUser.getToken();
    const requestOptions: RequestInit = {
        method: "PUT",
        body: formData,
        headers: {
            "Accept": "multipart/form-data",
            authorization: 'Bearer ' + token
        },
        credentials: "include" as RequestCredentials,
    };
    return fetch(url, requestOptions).then(handleResponse).catch(err => {
        console.error('FetchWrapper error:', err);
        throw err;
    });
}



// prefixed with underscored because delete is a reserved word in javascript
async function _delete(url: string) {
    let token = await AsyncStorageUser.getToken();
    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {
            authorization: 'Bearer ' + token
        },
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function handleResponse(response: any) {
    return response.text().then((text: any) => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            // Créer un objet d'erreur plus riche pour notre système de gestion d'erreur
            const errorMessage = (data && data.message) || (data && data.error) || response.statusText;
            const error = new Error(errorMessage);

            // Ajouter des informations sur la réponse HTTP
            (error as any).status = response.status;
            (error as any).statusText = response.statusText;
            (error as any).url = response.url;
            (error as any).response = {
                status: response.status,
                statusText: response.statusText,
                data: data
            };

            return Promise.reject(error);
        }

        return data;
    }).catch((parseError: any) => {
        // Gestion des erreurs de parsing JSON
        if (parseError.name === 'SyntaxError') {
            const error = new Error('Réponse serveur invalide');
            (error as any).status = response.status;
            (error as any).originalError = parseError;
            return Promise.reject(error);
        }
        throw parseError;
    });
}