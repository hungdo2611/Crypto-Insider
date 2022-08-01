import ApiService from './ApiService'


const api = ApiService()


export const GetTokenInfo  = (body) => {
    return api.makeAuthRequest({
        url: `/token/info`,
        method: 'POST',
        data: body
    })
}