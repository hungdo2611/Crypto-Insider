import ApiService from './ApiService'


const api = ApiService()


export const RegisterAccountAPI = (body) => {
    return api.makeRequest({
        url: `/account/register`,
        method: 'POST',
        data: body
    })
}

export const LoginAccountAPI = (body) => {
    return api.makeRequest({
        url: `/account/login`,
        method: 'POST',
        data: body
    })
}

export const registerDeviceTokenAPI = (body) => {
    return api.makeAuthRequest({
        url: `/account/register/devicetoken`,
        method: 'POST',
        data: body
    })
}

export const getProfileAPI = () => {
    return api.makeAuthRequest({
        url: `/account/info`,
        method: 'GET',
    })
}