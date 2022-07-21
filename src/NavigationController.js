import { Navigation } from 'react-native-navigation';
import { constant_name } from './RegisterScreen'
import _ from 'lodash'
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
