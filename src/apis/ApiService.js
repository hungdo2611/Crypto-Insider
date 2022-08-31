import Axios from 'axios'
import { InstanceData } from '../models'
import _ from 'lodash'
import { Alert } from 'react-native'

const _makeRequest = createRequest => async args => {
    const _headers = args.headers ? args.headers : {}
    const body = args.body ? args.body : {}
    const defaultHeaders = {}
    args = {
        ...args,
        headers: {
            ...defaultHeaders,
            ..._headers,
        },
        body,
    }

    try {
        const { data } = await createRequest(args)
        return data
    } catch (e) {
        throw e
    }
}
const showAlertErr = _.debounce(txt => {
    Alert.alert(txt)
}, 1000)

const _makeAuthRequest = createRequest => async args => {
    const requestHeaders = args.headers ? args.headers : {}

    let headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${InstanceData.token}`,

    }

    args = {
        ...args,
        headers: {
            ...headers,
            ...requestHeaders,
        },
    }

    try {
        return await _makeRequest(createRequest)(args)
    } catch (e) {
        const { response } = e

        if (response.status === 444) {
            showAlertErr('Your account has been locked. Let contact admin to solve the problem');
            return
        }
        if (!response || !response.data) {
            throw e
        }

        if (response.status >= 400 && response.status <= 403) {
        }
    }
}

export default (options = {}) => {
    let BaseURL = 'http://192.168.1.106:3000/api'
    // let BaseURL = 'https://vn-9trip.com/api'

    // if (options.BaseURL)
    //     BaseURL = options.BaseURL

    //const baseUrlValidated = options.baseUrl || getEnv('baseAPIUrl')
    const instance = Axios.create({
        baseURL: BaseURL,
        //timeout: 30000,
    })

    return {
        makeRequest: _makeRequest(instance),
        makeAuthRequest: _makeAuthRequest(instance),
    }
}
