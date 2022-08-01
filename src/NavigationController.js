import { Navigation } from 'react-native-navigation';
import { constant_name } from './RegisterScreen'
import _ from 'lodash'
import colors from './constants/colors';
let defaultOption = {
    topBar: {
        visible: false,
        height: 0,
        animate: false,
    },
    bottomTabs: {
        visible: false,
    },
};
let defaultOptionModal = {
    topBar: {
        visible: false,
        height: 0,
        animate: false,
    },
    modalPresentationStyle: 'fullScreen',
};

export function setRootToHome() {

    Navigation.setRoot({
        root: {
            bottomTabs: {
                id: 'BOTTOM_TABS',
                children: [
                    {
                        stack: {
                            id: `${constant_name.WATCH_LIST_SCREEN}_id`,
                            children: [
                                {
                                    component: {
                                        name: constant_name.WATCH_LIST_SCREEN,
                                    },
                                },
                            ],
                            options: {
                                topBar: {
                                    animate: false,
                                    visible: false,
                                    height: 0,
                                },
                                bottomTab: {
                                    icon: require('./res/watchlist.png'),
                                    selectedIcon: require('./res/watchlist.png'),
                                    text: 'Watchlist',
                                    fontSize: 15,
                                    textColor: colors.text_gray,
                                    selectedTextColor: colors.blue,
                                    iconColor: colors.text_gray,
                                    selectedIconColor: colors.blue,
                                    fontWeight: 'bold',
                                },
                                bottomTabs: {
                                    titleDisplayMode: 'alwaysShow',
                                    backgroundColor: colors.dark_gray,
                                },
                            },
                        },
                    }
                ],
            },
        },
    });
}

export function setRootToWellcome() {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: constant_name.WELLCOME_SCREEN,
                            options: defaultOption,
                        },
                    }
                ]
            }
        }
    });
}
export const pushToSignInScreen = _.debounce(
    (componentId) => {
        Navigation.push(componentId, {
            component: {
                name: constant_name.SIGN_IN_SCREEN,
                passProps: {
                    isPush: true,
                },
                options: defaultOption,
            },
        });
    },
    1000,
    { leading: true, trailing: false },
);

export const pushToRegisterScreen = _.debounce(
    (componentId) => {
        Navigation.push(componentId, {
            component: {
                name: constant_name.REGISTER_SCREEN,
                passProps: {
                    isPush: true,
                },
                options: defaultOption,
            },
        });
    },
    1000,
    { leading: true, trailing: false },
);

export const showModalSearchToken = _.debounce(
    (data) => {
        Navigation.showModal({
            stack: {
                children: [
                    {
                        component: {
                            id: constant_name.SEARCH_TOKEN_SCREEN + 'id',
                            name: constant_name.SEARCH_TOKEN_SCREEN,
                            passProps: {
                                data
                            },
                            options: {
                                ...defaultOptionModal,
                            },
                        },
                    },
                ],
            },
        });
    },
    1000,
    { leading: true, trailing: false },
);



export const pushToDetailTokenScreen = _.debounce(
    (componentId, data) => {
        Navigation.push(componentId, {
            component: {
                name: constant_name.DETAIL_TOKEN_SCREEN,
                passProps: {
                    data: data,
                },
                options: defaultOption,
            },
        });
    },
    1000,
    { leading: true, trailing: false },
);