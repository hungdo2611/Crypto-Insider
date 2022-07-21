/**
 * @format
 */

import { Platform } from 'react-native';

import { registerScreens } from './src/RegisterScreen'
import { Navigation } from 'react-native-navigation';
import { setRootToWellcome } from './src/NavigationController'
import colors from './src/constants/colors';
registerScreens();

if (Platform.OS === 'android') {
    Navigation.setDefaultOptions({
        animations: {
            push: {
                enabled: 'true',
                content: {
                    x: {
                        from: 2000,
                        to: 0,
                        duration: 800,
                        interpolation: "accelerate",
                        startDelay: 0,

                    },
                },
            },
            pop: {
                enabled: 'true',
                content: {
                    x: {
                        from: 0,
                        to: 2000,
                        duration: 800,
                        interpolation: "accelerate",
                        startDelay: 0,

                    },
                },
            },
        },
    });
} else {
    Navigation.setDefaultOptions({
        statusBar: {
            drawBehind: true,
            style: 'dark',
            backgroundColor: colors.black
        },
        animations: {
            push: {
                waitForRender: true
            }
        }
    })

}

Navigation.events().registerAppLaunchedListener(async () => {
    console.log('abc')
    setRootToWellcome();
});