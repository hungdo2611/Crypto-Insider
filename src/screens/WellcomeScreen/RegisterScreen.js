import React, { useState, useEffect, PureComponent } from 'react'
import {
    Dimensions,
    SafeAreaView,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native'
import { Navigation } from 'react-native-navigation';
import { pushToSignInScreen, setRootToHome } from '../../NavigationController'


import { connect } from 'react-redux'
import colors from '../../constants/colors';
import { RegisterAccountAPI } from '../../apis/AccountAPI'
import InputComponent from '../../component/InputComponent'
import { setLocalData } from '../../models';

const { width, height } = Dimensions.get('window')
class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowPass: false,
            uname: '',
            isValidUname: true,
            txtErrorUname: '',
            //  
            password: '',
            isValidPass: true,
            txtErrorPass: '',
            //
            email: '',
            isValidEmail: '',
            txtErrorEmail: ''
        };

    }
    renderTitle = () => {
        return <View style={{ marginTop: 20 }}>
            <Text style={{ color: colors.white, fontSize: 40, fontWeight: "bold" }}>Register account</Text>
            <Text style={{ color: colors.text_gray, fontWeight: '500', fontSize: 30, marginTop: 20 }}>
                {`Join us.\nTo get crypto insights!`}
            </Text>

        </View>
    }
    onShowHidePass = () => {
        const { isShowPass } = this.state;
        this.setState({ isShowPass: !isShowPass })
    }

    renderInput = () => {
        const { isShowPass,
            isValidEmail, isValidPass, isValidUname,
            txtErrorEmail, txtErrorPass, txtErrorUname } = this.state;
        return <View style={{ flex: 1, marginTop: 40 }}>
            <InputComponent
                styleText={{
                    flex: 1,
                    color: colors.text_gray,
                    fontSize: 16,
                }}
                onChangeText={txt => this.setState({ uname: txt, isValidUname: true, txtErrorUname: '' })}
                placeholderTextColor={colors.text_gray}
                placeholder='Username'
                iconLeft={<Image
                    style={[{ width: 20, height: 20, tintColor: colors.text_gray }, { marginRight: 10 }]}
                    source={require('../../res/user.png')} />}
                txterror={txtErrorUname}
                isvalid={isValidUname}
                styleLeft={{ width: 20, height: 20, tintColor: colors.text_gray }} />
            <InputComponent
                styleText={{
                    flex: 1,
                    color: colors.text_gray,
                    fontSize: 16,
                }}
                onChangeText={txt => this.setState({ password: txt, isValidPass: true, txtErrorPass: '' })}
                placeholderTextColor={colors.text_gray}
                placeholder='Password'
                iconLeft={<Image
                    style={[{ width: 20, height: 20, tintColor: colors.text_gray }, { marginRight: 10 }]}
                    source={require('../../res/lock.png')} />}
                iconRight={<TouchableOpacity
                    onPress={this.onShowHidePass}
                    activeOpacity={0.6}>
                    <Image
                        style={[{ width: 20, height: 20, tintColor: colors.text_gray }, { marginLeft: 10 }]}
                        source={isShowPass ? require('../../res/ic_hide_pass.png') : require('../../res/ic_show_pass.png')} />
                </TouchableOpacity>}
                secureTextEntry={!isShowPass}
                txterror={txtErrorPass}
                isvalid={isValidPass}
            />
            <InputComponent
                styleText={{
                    flex: 1,
                    color: colors.text_gray,
                    fontSize: 16,
                }}
                onChangeText={txt => this.setState({ email: txt, isValidEmail: true, txtErrorEmail: '' })}
                placeholderTextColor={colors.text_gray}
                placeholder='Email'
                iconLeft={<Image
                    style={[{ width: 20, height: 20, tintColor: colors.text_gray }, { marginRight: 10 }]}
                    source={require('../../res/email.png')} />}
                txterror={txtErrorEmail}
                isvalid={isValidEmail} />
        </View>
    }

    onSignIn = () => {
        const { componentId } = this.props;
        pushToSignInScreen(componentId);
    }
    validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    onRegister = async () => {
        const {
            email, isValidEmail, txtErrorEmail,
            uname, isValidUname, txtErrorUname,
            password, isValidPass, txtErrorPass
        } = this.state;


        if (uname.length < 5) {
            this.setState({ isValidUname: false, txtErrorUname: 'Username length should not be less than 5' });
        }
        if (password.length < 6) {
            this.setState({ isValidPass: false, txtErrorPass: 'Password length should not be less than 6' });
        }
        if (!this.validateEmail(email)) {
            this.setState({ isValidEmail: false, txtErrorEmail: 'Email is invalid' });
        }
        if (uname.length >= 5 && password.length >= 6 && this.validateEmail(email)) {
            let body = {
                uname, password, email
            }
            let req = await RegisterAccountAPI(body);
            console.log("req", req)
            if (req && req.err == 'Existed') {
                this.setState({ isValidUname: false, txtErrorUname: 'Username has already existed' });
                return
            }
            if (req && req.data && !req.err) {
                setLocalData(JSON.stringify(req.data));
                setRootToHome();
            } else {
                Alert.alert("Something was wrong. Please try again")
            }
        }


    }
    renderButton = () => {
        return <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={this.onSignIn}
            >
                <Text style={{ fontSize: 17, fontWeight: '500', color: colors.text_gray }}>
                    Have an account? <Text style={{ color: colors.white, fontWeight: "600" }}>Sign In</Text>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={this.onRegister}
                activeOpacity={0.6}
                style={{
                    borderRadius: 20,
                    backgroundColor: colors.white,
                    alignItems: "center",
                    justifyContent: "center",
                    width: '90%',
                    height: 60, marginTop: 20
                }}>
                <Text style={{ color: colors.black, fontWeight: "bold", fontSize: 18 }}>Register</Text>
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
                            source={require('../../res/ic_back.png')} />
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)

