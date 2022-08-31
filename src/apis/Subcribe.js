import ApiService from './ApiService'


const api = ApiService()


export const SubcribeTokenAPI = (body) => {
    return api.makeAuthRequest({
        url: `/subscribe/register`,
        method: 'POST',
        data: body
    })
}

export const UpdateSubcribeTokenAPI = (body) => {
    return api.makeAuthRequest({
        url: `/subscribe/update`,
        method: 'POST',
        data: body
    })
}

export const getListSubscribeUser = (page_number, page_size) => {
    return api.makeAuthRequest({
        url: `/subscribe?page_number=${page_number}&page_size=${page_size}`,
        method: 'GET',
    })
}

export const unSubscribeTokenAPI = (id, address) => {
    return api.makeAuthRequest({
        url: `/subscribe/unsub/${id}/${address}`,
        method: 'POST',
    })
}


