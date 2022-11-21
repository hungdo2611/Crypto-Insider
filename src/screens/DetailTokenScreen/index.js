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
import colors from '../../constants/colors';
import FastImage from 'react-native-fast-image';
import { renderShortAddress, copyToClipboard, InstanceData } from '../../models';
import { Navigation } from 'react-native-navigation';
import LinearGradient from 'react-native-linear-gradient';

import { GetTokenInfo } from '../../apis/TokenInfo'

import Modal from "react-native-modal";
import DropDownPicker from 'react-native-dropdown-picker';
import LottieView from 'lottie-react-native';
import { SubcribeTokenAPI, UpdateSubcribeTokenAPI, unSubscribeTokenAPI } from '../../apis/Subcribe';
import InputComponent from '../../component/InputComponent'
import { CONSTANT_TYPE_ACCOUNT } from '../../constants';
import BigNumber from 'bignumber.js'
import { WatchListInstance } from '../WatchListScreen';
import messaging from '@react-native-firebase/messaging';


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
            isloading: false,
            isValidTxValue: true,
            txtErrorTxValue: '',
            subscribe_info: null
        };
    }
    async componentDidMount() {
        const { data } = this.props;
        if (data?.haveData) {
            this.setState({ token_info: { ...data?.token_info, is_sub: true }, subscribe_info: data?.sub_data });
            if (data?.sub_data) {
                this.setState({ sub_value: data?.sub_data?.min_value + '' })
            }
        } else {

            let body = {
                chain: data?.chain,
                address: data?.address,
                icon: data?.image,
                website: data?.website
            };
            this.setState({ isloading: true })
            let tokeninfo = await GetTokenInfo(body);
            console.log('tokeninfo', tokeninfo)
            this.setState({ isloading: false })
            //price ==0  not tradable
            if (tokeninfo && tokeninfo?.data && !tokeninfo.err && tokeninfo?.data?.price !== 0) {

                this.setState({ token_info: tokeninfo?.data });
                if (tokeninfo?.sub_data) {
                    this.setState({ subscribe_info: tokeninfo?.sub_data, sub_value: tokeninfo?.sub_data?.min_value + '' })
                }
            } else {
                Alert.alert('This token is not tradable')
            }
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
        if (token_info) {
            price = new BigNumber(token_info?.price).toFixed(10) + ' $';
        } else {
            price = data?.price;
        }

        return <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }
        }>
            <Text style={{ color: colors.text_gray, fontSize: 16, fontWeight: '600' }}>Price: </Text>
            <Text style={{ color: colors.white, fontSize: 16, fontWeight: '600' }}>{price}</Text>
        </View>
    }
    renderEdit = () => {
        const { isVisibleModal } = this.state;
        return <TouchableOpacity
            onPress={() => this.setState({ isVisibleModal: !isVisibleModal })}
            activeOpacity={0.6}>
            <Image style={{ width: 24, height: 24 }} source={require('../../res/edit.png')} />
        </TouchableOpacity>
    }
    renderInfoSubscribe = () => {
        const { token_info, subscribe_info } = this.state;
        let time_expired = (subscribe_info?.time_expired);
        let is_expired = time_expired < Date.now();
        let sub_value = `${new Intl.NumberFormat("es-ES").format(subscribe_info?.min_value)} $`


        if (token_info?.is_sub) {
            if (is_expired) {
                return <View style={{ marginVertical: 10, alignItems: "center" }}>
                    <Image source={require('../../res/no_alarm.png')} />
                    <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600', textAlign: "center", paddingVertical: 5 }}>
                        Alert transactions have value bigger than
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                        <Text style={{ color: colors.blue, fontSize: 18, fontWeight: 'bold', paddingRight: 5 }}>{sub_value}</Text>
                        {this.renderEdit()}
                    </View>
                </View>
            }
            return <View style={{ marginVertical: 10, alignItems: "center" }}>
                <Image source={require('../../res/bell.png')} />
                <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600', textAlign: "center", paddingVertical: 5 }}>
                    Alert transactions have value bigger than
                </Text>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <Text style={{ color: colors.blue, fontSize: 18, fontWeight: 'bold', paddingRight: 5 }}> {sub_value}</Text>
                    {this.renderEdit()}
                </View>
            </View>
        } else {
            return <View style={{ marginVertical: 10, alignItems: "center" }}>
                <Image source={require('../../res/no_alarm.png')} />
                <Text style={{ color: colors.white, fontSize: 18, fontWeight: '600', textAlign: "center", paddingHorizontal: 30, paddingVertical: 10 }}>
                    Subscribe to get transactions have value bigger than your choice
                </Text>
            </View>
        }
    }
    onPressButton = () => {

    }
    unSubToken = async () => {
        const { subscribe_info, token_info } = this.state;
        const { data } = this.props;

        let req = await unSubscribeTokenAPI(subscribe_info?._id, data?.address);
        if (req && !req.err) {
            this.setState({ subscribe_info: null, token_info: { ...token_info, is_sub: false } });
            WatchListInstance.deleteData(data?.address);

        }
    }
    showModalSubscribe = () => {
        const { isVisibleModal, subscribe_info, token_info } = this.state;
        const { data } = this.props;
        const { name } = data;

        if (token_info?.is_sub) {
            let time_expired = (subscribe_info?.time_expired);
            let is_expired = time_expired < Date.now();
            if (is_expired) {
                this.setState({ isVisibleModal: !isVisibleModal })
            } else {
                //show unsub
                Alert.alert(
                    `Unsubscribe from ${name}?`,
                    "",
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        {
                            text: 'Unsubscribe', onPress: this.unSubToken
                        },
                    ]
                )
            }
        } else {
            this.setState({ isVisibleModal: !isVisibleModal })
        }
    }
    renderSubscribe = () => {
        const { isVisibleModal, token_info, isloading, subscribe_info } = this.state;
        let disable_btn = token_info ? false : true;


        if (isloading) {
            return
        }


        let title_button;
        if (token_info?.is_sub) {
            let time_expired = (subscribe_info?.time_expired);
            let is_expired = time_expired < Date.now();
            if (is_expired) {
                title_button = 'Subscribe expired';

            } else {
                title_button = 'Subscribed';

            }
        } else {
            title_button = 'Subscribe now';
        }

        return <View>
            {this.renderLine()}
            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text_gray }}>Subscribe Info</Text>
            {this.renderInfoSubscribe()}
            <TouchableOpacity
                disabled={disable_btn}
                onPress={this.showModalSubscribe}
                activeOpacity={0.6}
                style={{ backgroundColor: disable_btn ? colors.text_gray : colors.blue, borderRadius: 10, alignItems: 'center', justifyContent: "center", paddingVertical: 6, marginTop: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", paddingHorizontal: 10, paddingVertical: 8, color: colors.white }}>{title_button}</Text>
            </TouchableOpacity>
        </View>
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
        const { sub_value, custom_value, isVisibleModal, subscribe_info, token_info } = this.state;

        //check expired
        let is_custom = false;

        let txValue = 0;
        // check custom
        if (custom_value.show) {
            txValue = custom_value.value >> 0;
            is_custom = true;
            if (txValue < 500 && InstanceData.user_info?.acc_type == CONSTANT_TYPE_ACCOUNT.PRO) {
                this.setState({
                    isValidTxValue: false,
                    txtErrorTxValue: 'Transaction value must be greater than 500$'
                })
                return
            }
        } else {
            txValue = sub_value;
        }
        // check create new or update
        if (subscribe_info) {
            const body = {
                id_sub: subscribe_info?._id,
                min_value: txValue
            }
            let req_update = await UpdateSubcribeTokenAPI(body);
            if (req_update && !req_update.err) {
                this.setState({ subscribe_info: req_update?.data, token_info: { ...token_info, is_sub: true } });
                WatchListInstance.updateExsistData({ ...req_update?.data, token_id: token_info });
                // unsub old 

                if (!is_custom) {
                    messaging()
                        .unsubscribeFromTopic(`${data?.address}_${subscribe_info?.min_value}`)
                        .then(() => console.log('Subscribed to topic!'));
                    // sub new
                    messaging()
                        .subscribeToTopic(`${data?.address}_${txValue}`)
                        .then(() => console.log('Subscribed to topic!'));
                }


            }
            console.log("req_update", req_update)
        } else {
            const body = {
                address: data?.address,
                min_value: txValue,
                chain: data?.chain,
                is_custom_price: is_custom
            };
            let req_sub = await SubcribeTokenAPI(body);
            console.log("req_sub", req_sub);

            if (req_sub && !req_sub.err) {
                this.setState({ subscribe_info: req_sub?.data, token_info: { ...token_info, is_sub: true } });
                WatchListInstance.addNewData({ ...req_sub?.data, token_id: token_info });
                if (!is_custom) {
                    messaging()
                        .subscribeToTopic(`${data?.address}_${txValue}`)
                        .then(() => console.log('Subscribed to topic!'));
                }

            }
        }

        this.setState({ isVisibleModal: !isVisibleModal })


    }


    renderModalSelectTransValue = () => {

        let isPro = InstanceData.user_info?.acc_type == CONSTANT_TYPE_ACCOUNT.PRO;
        const list = [
            { label: new Intl.NumberFormat().format(1000) + ' $', value: '1000' },
            { label: new Intl.NumberFormat().format(2000) + ' $', value: '2000' },
            { label: new Intl.NumberFormat().format(5000) + ' $', value: '5000' },
            { label: new Intl.NumberFormat().format(10000) + ' $', value: '10000' },
            { label: new Intl.NumberFormat().format(20000) + ' $', value: '20000' },
            { label: 'Custom (Pro Version)', value: 'custom', disabled: !isPro },
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
                    height: 510
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
                            closeOnBackPressed
                            disabledItemLabelStyle={{ color: colors.text_gray }}
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

                    </View>
                </ScrollView>
                <TouchableOpacity

                    onPress={() => this.onSubcribe()}
                    activeOpacity={0.6}
                    style={{ backgroundColor: colors.blue, borderRadius: 10, alignItems: 'center', justifyContent: "center", paddingVertical: 6, marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", paddingHorizontal: 10, paddingVertical: 8, color: colors.white }}>Subscribe</Text>
                </TouchableOpacity>
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
                    {this.renderSubscribe()}
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

