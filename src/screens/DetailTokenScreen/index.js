import React, { useState, useEffect, PureComponent } from 'react'
import {
    Dimensions,
    SafeAreaView,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    Linking,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    TextInput
} from 'react-native'



import { connect } from 'react-redux'
import TopBarComponent from '../../component/TopBar';
import colors from '../../constants/colors';
import FastImage from 'react-native-fast-image';
import { renderShortAddress, copyToClipboard, InstanceData } from '../../models';
import { Navigation } from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';

import { GetTokenInfo } from '../../apis/TokenInfo'

import Modal from "react-native-modal";
import DropDownPicker from 'react-native-dropdown-picker';
import LottieView from 'lottie-react-native';
import { SubcribeTokenAPI } from '../../apis/Subcribe';
import InputComponent from '../../component/InputComponent'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CONSTANT_TYPE_ACCOUNT } from '../../constants';



const { width, height } = Dimensions.get('window')
class DetailTokenScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisibleModal: false,
            showPicker: false,
            sub_value: null,
            custom_value: { show: false, value: 0 },
            token_info: null,
            is_sub: false,
            isloading: true,
            isValidTxValue: true,
            txtErrorTxValue: ''
        };
    }
    async componentDidMount() {
        const { data } = this.props;
        let body = {
            chain: data?.chain,
            address: data?.address,
            icon: data?.image
        };
        let tokeninfo = await GetTokenInfo(body);
        this.setState({ isloading: false })
        console.log("tokeninfo", tokeninfo)

        if (tokeninfo && tokeninfo?.data && !tokeninfo.err) {

            this.setState({ token_info: tokeninfo?.data });
        } else {
            Alert.alert('Token is not verified')
        }


    }
    goback = () => {
        console.log('goback')
        Navigation.pop(this.props.componentId);
    }

    renderTitle = () => {
        const { data } = this.props;
        const { name } = data;

        return <View style={{ flexDirection: "row", alignItems: 'center' }}>
            <FastImage
                style={{ width: 40, height: 40, borderRadius: 20 }}
                resizeMode='cover'
                source={{ uri: data?.image }} />
            <Text>{name}</Text>
        </View>
    }
    renderTopBar = () => {
        const { data } = this.props;
        const { name } = data;
        return <View style={{}}>
            <TouchableOpacity onPress={this.goback} activeOpacity={0.6}>
                <Image
                    style={{ tintColor: colors.white, width: 25, height: 25 }}
                    source={require('../../res/ic_back.png')} />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 10 }}>
                <FastImage
                    style={{ width: 30, height: 30, borderRadius: 15 }}
                    resizeMode='cover'
                    source={{ uri: data?.image }} />
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.white, marginLeft: 10 }}>
                    {name}
                </Text>
            </View>

        </View>
    }

    renderAddress = () => {
        const { data } = this.props;
        return <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <Text style={{ color: colors.text_gray, fontSize: 16, fontWeight: '600' }}>Address: </Text>
            <Text style={{ color: colors.white, fontSize: 16, fontWeight: '600' }}>{renderShortAddress(data?.address, 10)}</Text>
            <TouchableOpacity
                onPress={() => copyToClipboard(data?.address, 'Copied')}
                activeOpacity={0.6}>
                <Image
                    style={{ width: 20, height: 20, tintColor: colors.text_gray, marginLeft: 10 }}
                    source={require('../../res/ic_copy.png')} />
            </TouchableOpacity>

        </View>
    }

    renderWebSite = () => {
        const { data } = this.props;

        return <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }
        }>
            <Text style={{ color: colors.text_gray, fontSize: 16, fontWeight: '600' }}>Website: </Text>
            <TouchableOpacity activeOpacity={0.6} onPress={() => Linking.openURL(data?.website)}>
                <Text style={{ color: colors.blue, fontSize: 16, fontWeight: '600', textDecorationLine: 'underline' }}>{data?.website}</Text>
            </TouchableOpacity>
        </View>
    }
    renderPrice = () => {
        const { data } = this.props;
        const { token_info } = this.state;
        let price = token_info ? token_info?.price + ' $' : data?.price;
        return <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }
        }>
            <Text style={{ color: colors.text_gray, fontSize: 16, fontWeight: '600' }}>Price: </Text>
            <Text style={{ color: colors.white, fontSize: 16, fontWeight: '600' }}>{price}</Text>
        </View>
    }
    renderButton = () => {
        const { isVisibleModal, token_info } = this.state;
        let disable_btn = token_info ? false : true;
        return <TouchableOpacity
            disabled={disable_btn}
            onPress={() => this.setState({ isVisibleModal: !isVisibleModal })}
            activeOpacity={0.6}
            style={{ backgroundColor: disable_btn ? colors.text_gray : colors.blue, borderRadius: 10, alignItems: 'center', justifyContent: "center", paddingVertical: 6, marginTop: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", paddingHorizontal: 10, paddingVertical: 8, color: colors.white }}>{token_info?.is_sub ? "Subscribed" : "Subscribe"}</Text>
        </TouchableOpacity>
    }
    renderLine = () => {
        return <View style={{ height: 1, width: width, backgroundColor: colors.dark_gray, marginVertical: 15 }} />
    }

    renderListBigTrans = () => {
        return <View>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text_gray }}>Big transaction detected!</Text>
        </View>
    }
    onSubcribe = async () => {
        const { data } = this.props;
        const { sub_value, custom_value } = this.state;

        if (custom_value.show) {
            let txValue = custom_value.value >> 0;
            console.log('txt value', txValue)

            if (txValue < 500 && InstanceData.user_info?.acc_type == CONSTANT_TYPE_ACCOUNT.FREE) {
                this.setState({
                    isValidTxValue: false,
                    txtErrorTxValue: 'Transaction value must be greater than 500$'
                })
                return
            }
            const body = {
                address: data?.address,
                min_value: sub_value,
                chain: data?.chain
            };
            let req_sub = await SubcribeTokenAPI(body);
            this.setState({ isVisibleModal: !isVisibleModal })
        } else {
            return
        }


    }


    renderModalSelectTransValue = () => {
        const list = [
            { label: new Intl.NumberFormat().format(2000) + ' $', value: '2000' },
            { label: new Intl.NumberFormat().format(5000) + ' $', value: '5000' },
            { label: new Intl.NumberFormat().format(10000) + ' $', value: '10000' },
            { label: new Intl.NumberFormat().format(20000) + ' $', value: '20000' },
            { label: new Intl.NumberFormat().format(50000) + ' $', value: '50000' },
            { label: 'Custom', value: 'custom' },


        ];
        const { isVisibleModal, showPicker, sub_value, custom_value, txtErrorTxValue, isValidTxValue } = this.state;
        return <Modal
            onBackdropPress={() => this.setState({ isVisibleModal: false })}
            isVisible={isVisibleModal}>
            <LinearGradient
                colors={['#d1b7e4', '#8382da', '#aedffb']}
                style={{
                    padding: 22,
                    borderRadius: 10,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    height: height / 2
                }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <View style={{
                    }}>
                        <LottieView
                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={{ height: 60, width: 60 }}
                            resizeMode="cover"
                            autoPlay
                            loop={true}
                            source={require('../../res/bell.json')}
                        />
                        <Text style={{ fontSize: 26, fontWeight: "bold", marginTop: 10 }}>Don't Miss Out </Text>
                        <Text style={{ fontWeight: '600', fontSize: 16, color: colors.dark_gray, marginTop: 10 }}>
                            Subcribe to get info about big transaction from Blockchain
                        </Text>
                        <DropDownPicker
                            style={{ marginTop: 10 }}
                            open={showPicker}
                            value={sub_value}
                            items={list}
                            placeholder='Select transaction value to listen'
                            setOpen={isOpen => this.setState({ showPicker: isOpen })}
                            onSelectItem={(item) => {
                                this.setState({ sub_value: item?.value });
                                if (item?.value == 'custom') {
                                    this.setState({ custom_value: { show: true, value: 0 } })
                                } else {
                                    this.setState({ custom_value: { show: false, value: 0 } })
                                }
                            }}
                        // onChangeValue={vl => this.setValue(vl)}
                        // setItems={setItems}
                        />

                        {custom_value?.show && <InputComponent
                            containerStyle={{
                                flexDirection: "row",
                                alignItems: "center",
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: colors.dark_gray,
                                backgroundColor: colors.white,
                                marginTop: 15,
                                padding: 10,

                            }}
                            styleText={{
                                flex: 1,
                                color: colors.black,
                                fontSize: 14,
                                fontWeight: "bold"
                            }}
                            keyboardType='numeric'
                            onChangeText={txt => this.setState({ custom_value: { show: true, value: txt }, isValidTxValue: true, txtErrorTxValue: '' })}
                            placeholderTextColor={colors.text_gray}
                            placeholder='Enter custom transaction value'
                            txterror={txtErrorTxValue}
                            isvalid={isValidTxValue}
                            iconRight={<Text style={{ fontSize: 22, fontWeight: "bold" }}>$</Text>}
                        />}


                        <Text style={{ fontWeight: '600', fontSize: 14, color: colors.dark_gray, marginTop: 10 }}>
                            Subcribe will be expired in 2 days at free version
                        </Text>
                        <TouchableOpacity

                            onPress={() => this.onSubcribe()}
                            activeOpacity={0.6}
                            style={{ backgroundColor: colors.blue, borderRadius: 10, alignItems: 'center', justifyContent: "center", paddingVertical: 6, marginTop: 20 }}>
                            <Text style={{ fontSize: 18, fontWeight: "600", paddingHorizontal: 10, paddingVertical: 8, color: colors.white }}>Subcribe</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </Modal>
    }

    renderLoading = () => {
        const { isloading } = this.state;
        if (isloading) {
            return <ActivityIndicator style={{ marginVertical: 10 }} size="large" color={colors.blue} />
        }

    }

    render() {
        const { data } = this.props;
        const { name } = data;
        return (
            <View style={{ flex: 1, backgroundColor: colors.black }}>
                <StatusBar
                    animated={true}
                    barStyle={'light-content'}
                    hidden={false} />
                <SafeAreaView style={{ flex: 1, marginHorizontal: 10 }}>
                    {this.renderTopBar()}
                    {this.renderAddress()}
                    {this.renderWebSite()}
                    {this.renderPrice()}
                    {this.renderLoading()}
                    {this.renderButton()}
                    {this.renderLine()}
                    {this.renderListBigTrans()}
                    {this.renderModalSelectTransValue()}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailTokenScreen)

