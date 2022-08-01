import React, { useState, useEffect, PureComponent } from 'react'
import {
    Dimensions,
    SafeAreaView,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity
} from 'react-native'


import { connect } from 'react-redux'
import colors from '../../constants/colors';
import {
    pushToSignInScreen,
    pushToRegisterScreen
} from '../../NavigationController'
import LottieView from 'lottie-react-native';


const { width, height } = Dimensions.get('window')
class WellcomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }
    PushToSignIn = () => {
        const { componentId } = this.props;
        pushToSignInScreen(componentId);
    }
    PushToRegister = () => {
        const { componentId } = this.props;
        pushToRegisterScreen(componentId);
    }
    renderTitle = () => {
        return <View style={{ flex: 1, marginTop: 20, marginHorizontal: 40, alignItems: 'center' }}>
            <Text style={{ color: colors.white, fontSize: 50, fontWeight: "600" }}>Crypto Insider</Text>
            <Text style={{ color: colors.text_gray, fontWeight: '500', fontSize: 20, textAlign: 'center', marginTop: 20 }}>
                On-chain metrics turn blockchain-based transaction data into actionable crypto market insights
            </Text>

        </View>
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.black, alignItems: "center" }}>
                <StatusBar
                    animated={true}
                    barStyle={'light-content'}
                    hidden={false} />
                <SafeAreaView>
                    <View style={{
                        width: width,
                        height: 300,
                        marginTop: 20,
                    }}>
                        <LottieView
                            ref={animation => {
                                this.animation = animation;
                            }}
                            resizeMode="cover"
                            autoPlay
                            loop={true}
                            source={require('../../res/spaceship.json')}
                        />
                    </View>
                    {/* <Image style={{ width: width - 40, height: 300, marginTop: 20 }} source={require('../res/banner.jpg')} /> */}
                    {this.renderTitle()}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: 'center',
                            borderRadius: 20,
                            marginHorizontal: 20,
                            backgroundColor: colors.dark_gray,
                            height: 55,
                            width: width - 40,
                            marginBottom: 20
                        }}>
                        <TouchableOpacity
                            onPress={this.PushToRegister}
                            activeOpacity={0.6}
                            style={{
                                flex: 1,
                                backgroundColor: colors.white,
                                borderRadius: 20,
                                height: '100%',
                                alignItems: "center",
                                justifyContent: 'center'
                            }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.black }}>Register</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.PushToSignIn}
                            activeOpacity={0.6}
                            style={{
                                flex: 1,
                                height: '100%',
                                alignItems: "center",
                                justifyContent: 'center'
                            }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.white }}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(WellcomeScreen)

