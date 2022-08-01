import React, { useState, useEffect, PureComponent } from 'react'
import {
    Dimensions,
    SafeAreaView,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    Alert
} from 'react-native'
import { Navigation } from 'react-native-navigation';


import { connect } from 'react-redux'
import colors from '../../constants/colors';
import { pushToRegisterScreen, setRootToHome } from '../../NavigationController'
import InputComponent from '../../component/InputComponent'
import { LoginAccountAPI } from '../../apis/AccountAPI'
import { setLocalData } from '../../models';

const { width, height } = Dimensions.get('window')
class SignInScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowPass: false,
            //
            uname: '',
            isValidUname: true,
            txtErrorUname: '',
            //  
            password: '',
            isValidPass: true,
            txtErrorPass: '',
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
    onShowHidePass = () => {
        const { isShowPass } = this.state;
        this.setState({ isShowPass: !isShowPass })
    }
    renderInput = () => {
        const { isShowPass,
            isValidPass, isValidUname,
            txtErrorPass, txtErrorUname } = this.state;
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
            />
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
        </View>
    }

    onSignIn = async () => {
        const {
            uname, isValidUname, txtErrorUname,
            password, isValidPass, txtErrorPass
        } = this.state;
        if (uname.length < 5) {
            this.setState({ isValidUname: false, txtErrorUname: 'Username length should not be less than 5' });
        }
        if (password.length < 6) {
            this.setState({ isValidPass: false, txtErrorPass: 'Password length should not be less than 6' });
        }
        if (uname.length >= 5 && password.length >= 6) {
            let body = {
                uname, password
            }
            let req = await LoginAccountAPI(body);
            if (req && req.err == 'WrongPass') {
                this.setState({ isValidPass: false, txtErrorPass: 'Wrong password' });
            }
            if (req && req.err == "NotFound") {
                this.setState({ isValidUname: false, txtErrorUname: 'Username not found' });
            }
            if (req && req.data && !req.err) {
                console.log("Login ok");
                setLocalData(JSON.stringify(req.data));
                setRootToHome();
            } else {
                Alert.alert("Something was wrong. Please try again")
            }

        }
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

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)

