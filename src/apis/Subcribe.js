import ApiService from './ApiService'


const api = ApiService()


export const SubcribeTokenAPI  = (body) => {
    return api.makeAuthRequest({
        url: `/subcribe/register`,
        method: 'POST',
        data: body
    })
}