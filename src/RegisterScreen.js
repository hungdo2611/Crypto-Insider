import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import React, { PureComponent } from 'react';
import store from './redux/store';
import WellComeScreen from './WellcomeScreen'
import SignInScreen from './WellcomeScreen/SignInScreen'
import RegisterScreen from './WellcomeScreen/RegisterScreen'
export const constant_name = {
    WELLCOME_SCREEN: `Navigation.WellcomeScreen`,
    SIGN_IN_SCREEN: `Navigation.SIGN_IN_SCREEN`,
    REGISTER_SCREEN: `Navigation.REGISTER_SCREEN`
}
export const registerScreens = () => {
    Navigation.registerComponent(constant_name.WELLCOME_SCREEN, () => (props) =>
        <Provider store={store}>
            <WellComeScreen {...props} />
        </Provider>,
        () => WellComeScreen);
    Navigation.registerComponent(constant_name.SIGN_IN_SCREEN, () => (props) =>
        <Provider store={store}>
            <SignInScreen {...props} />
        </Provider>,
        () => SignInScreen);
    Navigation.registerComponent(constant_name.REGISTER_SCREEN, () => (props) =>
        <Provider store={store}>
            <RegisterScreen {...props} />
        </Provider>,
        () => RegisterScreen);
}