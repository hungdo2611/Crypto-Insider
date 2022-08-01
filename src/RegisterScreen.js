import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import React, { PureComponent } from 'react';
import store from './redux/store';
import WellComeScreen from './screens/WellcomeScreen'
import SignInScreen from './screens/WellcomeScreen/SignInScreen'
import RegisterScreen from './screens/WellcomeScreen/RegisterScreen'
import WatchListScreen from './screens/WatchListScreen';
import SearchTokenScreen from './screens/SearchTokenScreen'
import DetailTokenScreen from './screens/DetailTokenScreen'
export const constant_name = {
    WELLCOME_SCREEN: `Navigation.WellcomeScreen`,
    SIGN_IN_SCREEN: `Navigation.SIGN_IN_SCREEN`,
    REGISTER_SCREEN: `Navigation.REGISTER_SCREEN`,
    WATCH_LIST_SCREEN: `Navigation.WATCH_LIST_SCREEN`,
    SEARCH_TOKEN_SCREEN: `Navigation.SEARCH_TOKEN_SCREEN`,
    DETAIL_TOKEN_SCREEN: `Navigation.DETAIL_TOKEN_SCREEN`,

}
export const registerScreens = () => {
    Navigation.registerComponent(constant_name.DETAIL_TOKEN_SCREEN, () => (props) =>
        <Provider store={store}>
            <DetailTokenScreen {...props} />
        </Provider>,
        () => DetailTokenScreen);
    Navigation.registerComponent(constant_name.SEARCH_TOKEN_SCREEN, () => (props) =>
        <Provider store={store}>
            <SearchTokenScreen {...props} />
        </Provider>,
        () => SearchTokenScreen);
    Navigation.registerComponent(constant_name.WATCH_LIST_SCREEN, () => (props) =>
        <Provider store={store}>
            <WatchListScreen {...props} />
        </Provider>,
        () => WatchListScreen);
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