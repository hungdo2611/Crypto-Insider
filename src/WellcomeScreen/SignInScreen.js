import React, { useState, useEffect, PureComponent } from 'react'
import {
    Dimensions,
    SafeAreaView,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    TextInput
} from 'react-native'
import { Navigation } from 'react-native-navigation';


import { connect } from 'react-redux'
import colors from '../constants/colors';
import { pushToRegisterScreen } from '../NavigationController'


const { width, height } = Dimensions.get('window')
class SignInScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }
    renderTitle = () => {
        return <View style={{ marginTop: 20 }}>
            <Text style={{ color: colors.white, fontSize: 40, fontWeight: "bold" }}>Let's sign you in</Text>
            <Text style={{ color: colors.text_gray, fontWeight: '500', fontSize: 30, marginTop: 20 }}>
                {`Wellcome back.\nYou've been missed!`}
            </Text>

        </View>
    }

    renderInput = () => {
        return <View style={{ flex: 1, marginTop: 40 }}>
            <TextInput
                style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.dark_gray,
                    padding: 18,
                    color: colors.text_gray,
                    fontSize: 16

                }}
                placeholderTextColor={colors.text_gray}
                placeholder='Username' />
            <TextInput
                style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.dark_gray,
                    padding: 18,
                    color: colors.text_gray,
                    fontSize: 16,
                    marginTop: 20

                }}
                secureTextEntry
                placeholderTextColor={colors.text_gray}
                placeholder='Password' />
        </View>
    }

    onSignIn = () => {

    }
    onRegister = () => {
        const { componentId } = this.props;
        pushToRegisterScreen(componentId);
    }
    renderButton = () => {
        return <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.onRegister}
            >
                <Text style={{ fontSize: 17, fontWeight: '500', color: colors.text_gray }}>
                    Don't you have an account? <Text style={{ color: colors.white, fontWeight: "600" }}>Register</Text>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={this.onSignIn}
                activeOpacity={0.6}
                style={{
                    borderRadius: 20,
                    backgroundColor: colors.white,
                    alignItems: "center",
                    justifyContent: "center",
                    width: '90%',
                    height: 60, marginTop: 20
                }}>
                <Text style={{ color: colors.black, fontWeight: "bold", fontSize: 18 }}>Sign In</Text>
            </TouchableOpacity>
        </View>
    }
    onBack = () => {
        const { componentId } = this.props;
        Navigation.pop(componentId);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.black }}>
                <StatusBar
                    animated={true}
                    barStyle={'light-content'}
                    hidden={false} />
                <SafeAreaView style={{ marginHorizontal: 20, flex: 1 }}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.onBack}
                    >
                        <Image
                            style={{ tintColor: colors.white, width: 30, height: 30 }}
                            source={require('../res/ic_back.png')} />
                    </TouchableOpacity>
                    {this.renderTitle()}
                    {this.renderInput()}
                    {this.renderButton()}
                </SafeAreaView>
            </View>
        )
    }
}



const mapStateToProps = (state) => {
    return {


    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)

