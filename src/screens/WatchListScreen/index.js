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
    Alert,
    FlatList,
    RefreshControl,
    ScrollView
} from 'react-native'

import { showModalSearchToken } from '../../NavigationController'

import { connect } from 'react-redux'
import TopBarComponent from '../../component/TopBar';
import colors from '../../constants/colors';
import LottieView from 'lottie-react-native';

import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Shine
} from "rn-placeholder";

import { getListSubscribeUser } from '../../apis/Subcribe';
import { renderShortAddress } from '../../models';
import FastImage from 'react-native-fast-image';
import BigNumber from 'bignumber.js'
import { pushToDetailTokenScreen } from '../../NavigationController'
import moment from 'moment';

export let WatchListInstance = null;

const { width, height } = Dimensions.get('window')
class WatchListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            txt_search: '',
            chain: 'bsc',
            refreshing: false,
            isloading: false,
            lst_sub: [],
            total_sub: 0,

        };
        this.page_number = 1;
        this.page_size = 10;
        WatchListInstance = this;
    }

    componentDidMount() {
        this.getData();
    }
    deleteData = (address) => {
        const { lst_sub } = this.state;
        let new_arr = lst_sub.filter(vl => {
            return vl?.token_id?.contract_add !== address;
        });
        this.setState({ lst_sub: new_arr })
    }
    addNewData = (data) => {
        console.log("addNewData", data);
        const { lst_sub } = this.state;
        this.setState({ lst_sub: [data, ...lst_sub] })
    }
    updateExsistData = (data) => {
        const { lst_sub } = this.state;
        let new_arr = lst_sub.map(vl => {
            if (vl?._id == data?._id) {
                return { ...vl, min_value: data?.min_value, time_expired: data?.time_expired }
            } else {
                return vl
            }
        });
        this.setState({ lst_sub: new_arr })
    }

    getData = async () => {
        const { total_sub, lst_sub } = this.state;
        if (total_sub > 0 && total_sub >= lst_sub.length) {
            return
        }

        this.setState({ isloading: true });
        const req = await getListSubscribeUser(this.page_number, this.page_size);
        console.log("req", req);

        this.setState({ isloading: false });
        if (req && !req.err) {
            this.setState({ lst_sub: [...lst_sub, ...req?.data], total_sub: req?.total });
            this.page_number = this.page_number + 1;
        }

    }

    cbSetChain = (chain) => {
        this.setState({ chain: chain })
    }



    renderSearchInput = () => {
        const { chain } = this.state;
        return <TouchableOpacity
            onPress={() => showModalSearchToken({ cbsetChain: this.cbSetChain, chain: chain })}
            activeOpacity={0.6}
            style={{
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.dark_gray,
                padding: 15,

            }}>
            <Image
                style={[{ width: 20, height: 20, tintColor: colors.text_gray }, { marginRight: 12 }]}
                source={require('../../res/search.png')} />
            <Text style={{
                color: colors.text_gray,
                fontSize: 16
            }}>Enter token name/ address...</Text>
        </TouchableOpacity>
    }
    renderChain = () => {
        const { chain } = this.state;
        return <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
            {/* <Text style={{ fontWeight: "700", fontSize: 18, color: colors.text_gray }}>Chain:</Text> */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    borderRadius: 20,
                    backgroundColor: colors.dark_gray,
                    height: 36,
                    width: 170,
                }}>
                <TouchableOpacity
                    onPress={() => this.setState({ chain: 'bsc' })}
                    activeOpacity={0.6}
                    style={{
                        flex: 1,
                        backgroundColor: chain == 'bsc' ? colors.blue : colors.dark_gray,
                        borderRadius: 20,
                        height: '100%',
                        alignItems: "center",
                        justifyContent: 'center',
                        flexDirection: "row"
                    }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../res/bsc.png')} />
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: "bold",
                            color: colors.white,
                            marginLeft: 5
                        }}>Bsc</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.setState({ chain: 'eth' })}
                    activeOpacity={0.6}
                    style={{
                        flex: 1,
                        height: '100%',
                        alignItems: "center",
                        justifyContent: 'center',
                        flexDirection: "row",
                        backgroundColor: chain == 'eth' ? colors.blue : colors.dark_gray,
                        borderRadius: 20,



                    }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../res/eth.png')} />
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: "bold",
                            color: colors.white,
                            marginLeft: 5
                        }}>
                        Eth
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    }


    getDataProvider = () => {
        const { lst_sub, chain } = this.state;
        if (chain == 'bsc') {
            let data = lst_sub.filter(vl => vl?.token_id?.chain == 'bsc');
            return data;
        }
        if (chain == 'eth') {
            let data = lst_sub.filter(vl => vl?.token_id?.chain == 'eth');
            return data;
        }
    }
    renderLine = () => {
        return <View style={{ height: 1, width: width, backgroundColor: colors.dark_gray, marginVertical: 5 }} />
    }
    onPressItem = (data) => {
        const { componentId } = this.props;
        const { chain } = this.state;
        const data_pass_props = {
            name: data?.token_id?.name,
            address: data?.token_id?.contract_add,
            price: data?.token_id?.price_usd,
            image: data?.token_id?.icon
        }
        pushToDetailTokenScreen(componentId, {
            token_info: data_pass_props,
            chain: chain,
            haveData: true,
            sub_data: data,
            address: data?.token_id?.contract_add,
            name: data?.token_id?.name,
            image: data?.token_id?.icon,
            website: data?.token_id?.website
        })
    }
    renderItem = ({ item }) => {
        const address = renderShortAddress(item?.token_id?.contract_add, 10);
        let price = new BigNumber(item?.token_id?.price_usd).toFormat(5, BigNumber.ROUND_DOWN) + ' $';
        let sub_value = `${new Intl.NumberFormat("es-ES").format(item?.min_value)} $`;
        let time_expired = moment(item?.time_expired).fromNow();
        const current_time = Date.now();
        const shadow_style = {
            shadowColor: colors.blue,
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,

            elevation: 12,
            // background color must be set
            backgroundColor: "black" // invisible color
        }
        return <View style={[shadow_style, { flexDirection: 'row', alignItems: "center", marginVertical: 10, marginHorizontal: 5, borderRadius: 15, padding: 10 }]}>
            <TouchableOpacity
                onPress={() => this.onPressItem(item)}
                activeOpacity={0.6}
                style={[{ flexDirection: 'row', alignItems: "center", flex: 1 }]}>
                <FastImage style={{ width: 36, height: 36, borderRadius: 18 }} resizeMode='cover' source={{ uri: item?.token_id?.icon }} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', color: colors.white, lineHeight: 20 }}>
                        {item?.token_id?.name + ' '}
                        {item?.time_expired > current_time ? <LottieView
                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={{ height: 24, width: 24 }}
                            resizeMode="cover"
                            autoPlay
                            loop={true}
                            source={require('../../res/bell.json')}
                        /> : <Image
                            style={{ height: 18, width: 18 }}
                            source={require('../../res/no_alarm.png')} />}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text_gray, marginTop: 3 }}>{item?.token_id?.symbol}</Text>
                    {/* {/* <Text style={{ fontSize: 15, fontWeight: '500', color: colors.text_gray }}>{price}</Text> */}
                    <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text_gray }}>{`Subscription value`} {sub_value}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text_gray }}>
                        {item?.time_expired > current_time ? `Expired ${time_expired}` : 'Expired. Renew now!'}
                    </Text>




                </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 15, fontWeight: '500', color: colors.text_gray }}>{price}</Text>

        </View>

    }
    renderRefreshCtr = () => {
        return <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
                this.page_number = 0;
                this.getData();

                // this.onRefresh()
            }}
        />
    }
    renderLoading = () => {
        let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const shadow_style = {
            shadowColor: colors.blue,
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.37,
            shadowRadius: 7.49,

            elevation: 12,
            // background color must be set
            backgroundColor: "black" // invisible color
        }
        return <ScrollView style={{ flex: 1 }}>
            {arr.map(vl => {
                return <Placeholder
                    key={vl}
                    Animation={Shine}
                    Left={props => <PlaceholderMedia style={[{ width: 46, height: 46, backgroundColor: colors.text_gray, marginLeft: (20), marginTop: (5) }, props.style]} />}
                    style={[{ marginVertical: (12) }, shadow_style]}
                >
                    <PlaceholderLine width={40} height={10} style={{ backgroundColor: colors.text_gray, marginTop: 5 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <PlaceholderLine width={20} height={10} style={{ backgroundColor: colors.text_gray }} />
                        <PlaceholderLine width={15} height={10} style={{ backgroundColor: colors.text_gray, marginLeft: 10 }} />
                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                            <PlaceholderLine width={25} height={10} style={{ backgroundColor: colors.text_gray, marginHorizontal: 10 }} />

                        </View>

                    </View>
                    <PlaceholderLine width={50} height={10} style={{ backgroundColor: colors.text_gray }} />



                </Placeholder>
            })}


        </ScrollView>
    }

    renderEmpty = () => {
        return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <LottieView
                ref={animation => {
                    this.animation = animation;
                }}
                style={{ height: 150, width: 150 }}
                resizeMode="cover"
                autoPlay
                loop={false}
                source={require('../../res/empty.json')}
            />
            <Text style={{ fontSize: 17, fontWeight: "600", color: colors.text_gray, paddingTop: 10 }}>No subscription</Text>
        </View>
    }

    render() {
        const { isloading } = this.state;
        let data = this.getDataProvider();
        return (
            <View style={{ flex: 1, backgroundColor: colors.black }}>
                <StatusBar
                    animated={true}
                    barStyle={'light-content'}
                    hidden={false} />
                <SafeAreaView style={{ flex: 1 }}>
                    <TopBarComponent title="Watch List" />
                    {this.renderSearchInput()}
                    {this.renderChain()}
                    {this.renderLine()}
                    {isloading && this.renderLoading()}
                    {!isloading && data?.length > 0 && <FlatList
                        data={[...data]}
                        keyExtractor={(item, index) => item?._id}
                        renderItem={this.renderItem}
                        onEndReachedThreshold={100}
                        onEndReached={({ distanceFromEnd }) => {
                            if (distanceFromEnd < 0) return;
                            this.getData();
                        }}
                        scrollEventThrottle={16}
                        refreshControl={this.renderRefreshCtr}
                    />}
                    {!isloading && data?.length == 0 && this.renderEmpty()}
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

export default connect(mapStateToProps, mapDispatchToProps)(WatchListScreen)

