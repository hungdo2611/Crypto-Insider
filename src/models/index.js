import notificationProcessor from '../notification'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { bsc_image, KEY_ASYNC_RECENT_SEARCH } from '../constants';
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-root-toast';

const constant_key = {
    USER_INFO: 'ASYNC_USER_INFO',
}

export let InstanceData = {
    token: '',
    last_componentId: '',
    recentSearch: [],
    list_subcribe: [],
    user_info: null
}

export const updateLocalData = async (data) => {
    if (data) {
        // store.dispatch(actionsHome.action.updateUserInfo(data))
        await AsyncStorage.setItem(constant_key.USER_INFO, JSON.stringify(data))
    }

}
export const setLocalData = async (data) => {
    if (data) {
        InstanceData.user_info = JSON.parse(data);
        InstanceData.token = JSON.parse(data).token;
        // store.dispatch(actionsHome.action.updateUserInfo(JSON.parse(data)))
        await AsyncStorage.setItem(constant_key.USER_INFO, data)
        // getPreData();
        notificationProcessor.checkPermission();
    }


}
export const deleteLocalData = async () => {
    await AsyncStorage.removeItem(constant_key.USER_INFO)

}
export const getLocalData = async () => {
    AsyncStorage.getItem(KEY_ASYNC_RECENT_SEARCH).then(dt => {
        if (dt && dt != "null") {
            console.log("data123", dt)

            InstanceData.recentSearch = JSON.parse(dt);
        }
    })
    let data = await AsyncStorage.getItem(constant_key.USER_INFO);
    if (data) {
        InstanceData.user_info = JSON.parse(data);
        InstanceData.token = JSON.parse(data).token;
        // store.dispatch(actionsHome.action.updateUserInfo(JSON.parse(data)))

        // getPreData();

    }
    notificationProcessor.checkTokenRefresh();

    return JSON.parse(data);
}

export const searchDataOnBSC = async (txt) => {
    try {
        let req = await axios.get(`https://bscscan.com/searchHandler?term=${txt}&filterby=0`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },

            });
        let data = req.data.filter(vl => !vl.includes('Address'));
        data.splice(0, 1);
        let format_data = data.map(vl => {
            let arr = vl.split('~');
            if (arr.length < 4) {
                return
            }
            let name_add = arr[0].split(/(\s+)/).filter(e => e.trim().length > 0);

            let soft_add = name_add[name_add.length - 1];
            let address = name_add[name_add.length - 2];
            let name = ''
            let website = arr[1];
            for (let i = 0; i < name_add.length - 2; i++) {
                name = name + name_add[i] + ' ';
            }
            let arr3 = arr[3].split(/(\s+)/).filter(e => e.trim().length > 0);
            let price = arr3[0];
            let image = bsc_image + arr3[arr3.length - 1];
            return { name, address, soft_add, website, price, image }
        })
        return format_data;
    } catch (err) {
        return [];
    }
}

export function renderShortAddress(address = '', chars = 4) {
    if (!address || address.length < 10) return address;
    // const checksummedAddress = toChecksumAddress(address);
    return `${address.substr(0, chars + 2)}...${address.substr(-chars)}`;
}
const defaultOptions = {
    duration: Toast.durations.SHORT,
    position: Toast.positions.CENTER,
    backgroundColor: 'rgba(0,0,0, 0.5)',
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    onShow: () => {
        // calls on toast\`s appear animation start
    },
    onShown: () => {
        // calls on toast\`s appear animation end.
    },
    onHide: () => {
        // calls on toast\`s hide animation start.
    },
    onHidden: () => {
        // calls on toast\`s hide animation end.
    },
};

let toast = undefined;

function showToast(
    message = 'something wrong here!',
    options = { containerStyle: { zIndex: 100, elevation: 100 } },
) {
    // //console.xlog(message, "message");
    // //console.xlog(options, "options");
    Toast.hide(toast);
    toast = Toast.show(message, { ...defaultOptions, ...options });
}
export const ToastMEssage = (
    description = 'description',
    duration = Toast.durations.SHORT,
    position = Toast.positions.CENTER,
) => {
    showToast(description, {
        position,
        duration,
    });
    // todo show notification
    // notification[type]({
    //   message,
    //   description
    // });
};
const showNotification = (
    description = 'description',
    duration = Toast.durations.SHORT,
    position = Toast.positions.CENTER,
) => {
    showToast(description, {
        position,
        duration,
    });

};
export const copyToClipboard = (content = '', toast = '') => {
    Clipboard.setString(content);
    showNotification(toast);
};