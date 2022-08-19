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



import { connect } from 'react-redux'
import colors from '../../constants/colors';

import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Shine
} from "rn-placeholder";

import { InstanceData, searchDataOnBSC } from '../../models';
import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { KEY_ASYNC_RECENT_SEARCH } from '../../constants';
import { pushToDetailTokenScreen } from '../../NavigationController'

const { width, height } = Dimensions.get('window')
class SearchTokenScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            data: [],
            isloading: false,
            recentSearch: [],
            showRecent: InstanceData.recentSearch.length > 0 ? true : false,
            chain: props?.data?.chain

        };
    }
    setDataRecentSearch = (chain) => {
        let recentSearch = InstanceData.recentSearch.filter(vl => vl.chain == chain);
        this.setState({ recentSearch: recentSearch });
    }
    componentDidMount() {
        const { chain } = this.state;
        this.setDataRecentSearch(chain);
    }

    renderLine = () => {
        return <View style={{ height: 1, width: width, backgroundColor: colors.dark_gray, marginVertical: 15 }} />
    }
    onchangeTxt = async (txt) => {
        const { recentSearch } = this.state;
        if (txt) {
            this.setState({ isloading: true, showRecent: false });
            let data = await searchDataOnBSC(txt);
            this.setState({ data: data, isloading: false })
        } else {
            if (recentSearch) {
                this.setState({ showRecent: true, data: [] });
            }
        }

    }
    renderSearchInput = () => {
        const { componentId } = this.props;
        return <View>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
            }}>
                <TouchableOpacity activeOpacity={0.6} onPress={() => Navigation.dismissModal(componentId)}>
                    <Image
                        style={[{ width: 20, height: 20, tintColor: colors.text_gray }, { marginRight: 10 }]}
                        source={require('../../res/arrow_left.png')} />
                </TouchableOpacity>
                <TextInput
                    style={{
                        flex: 1,
                        color: colors.text_gray,
                        fontSize: 16,
                        backgroundColor: colors.dark_gray,
                        borderRadius: 20,
                        padding: 12
                    }}
                    onChangeText={txt => this.onchangeTxt(txt)}
                    placeholder='Enter token name/ address...'
                    placeholderTextColor={colors.text_gray} />



            </View>
        </View>

    }
    saveRecentSearch = (data) => {
        const { recentSearch } = this.state;
        let index = recentSearch.findIndex(vl => vl?.address == data?.address)
        if (index < 0) {
            this.setState({ recentSearch: [data, ...recentSearch] });
            InstanceData.recentSearch = [data, ...recentSearch];
            AsyncStorage.setItem(KEY_ASYNC_RECENT_SEARCH, JSON.stringify([data, ...recentSearch]));

        }
    }
    onPressItem = (data) => {
        const { componentId } = this.props;
        const { chain } = this.state;
        this.saveRecentSearch({ ...data, chain: chain });
        pushToDetailTokenScreen(componentId, { ...data, chain: chain })
    }
    renderItem = ({ item }) => {
        if (!item) {
            return null;
        }
        let list_subscribe = InstanceData.user_info?.lst_sub_address;
        let isSub = -1;
        if (list_subscribe) {
            isSub = list_subscribe.findIndex(vl => {
                return vl == item?.address
            })
        }
        console.log('list_subscribe', InstanceData.user_info)

        return <View>
            <View style={{ flexDirection: 'row', alignItems: "center", marginHorizontal: 10 }}>
                <TouchableOpacity
                    onPress={() => this.onPressItem(item)}
                    activeOpacity={0.6}
                    style={{ flexDirection: 'row', alignItems: "center", flex: 1 }}>
                    <FastImage style={{ width: 40, height: 40, borderRadius: 20 }} resizeMode='cover' source={{ uri: item?.image }} />
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.white }}>{item?.name}</Text>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text_gray }}>{item?.soft_add} - {item?.price}</Text>

                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: colors.blue, borderRadius: 10 }}>
                    <Text style={{ fontSize: 13, fontWeight: "600", paddingHorizontal: 10, paddingVertical: 8, color: colors.white }}>{isSub < 0 ? "Subscribe" : "Subscribed"}</Text>
                </TouchableOpacity>
            </View>
            {this.renderLine()}
        </View>
    }
    renderLoading = () => {
        let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return <ScrollView style={{ flex: 1 }}>
            {arr.map(vl => {
                return <Placeholder
                    key={vl}
                    Animation={Shine}
                    Left={props => <PlaceholderMedia style={[{ width: 40, height: 40, backgroundColor: colors.text_gray, marginLeft: (10), marginTop: (5) }, props.style]} />}
                    style={{ marginVertical: (12) }}
                >
                    <PlaceholderLine width={70} height={10} style={{ backgroundColor: colors.text_gray, marginTop: 5 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <PlaceholderLine width={20} height={10} style={{ backgroundColor: colors.text_gray }} />
                        <PlaceholderLine width={10} height={10} style={{ backgroundColor: colors.text_gray, marginLeft: 10 }} />

                    </View>
                    {/* <PlaceholderLine width={30} height={10} style={{ backgroundColor: colors.text_gray }} /> */}



                </Placeholder>
            })}


        </ScrollView>
    }
    onClearRecent = () => {
        this.setState({ recentSearch: [], showRecent: false });
        InstanceData.recentSearch = [];
        AsyncStorage.setItem(KEY_ASYNC_RECENT_SEARCH, JSON.stringify([]));

    }
    renderRecentSearch = () => {
        const { showRecent } = this.state;
        if (showRecent) {
            return <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", marginBottom: 10 }}>
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: colors.white }}>Recent Searches</Text>
                <TouchableOpacity onPress={this.onClearRecent} activeOpacity={0.6}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.blue }}>Clear</Text>
                </TouchableOpacity>
            </View>
        }


    }
    renderChain = () => {
        const { chain } = this.state;
        const { data } = this.props;
        return <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <Text style={{ fontWeight: "700", fontSize: 18, color: colors.text_gray }}>Chain:</Text>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    borderRadius: 10,
                    marginHorizontal: 20,
                    backgroundColor: colors.dark_gray,
                    height: 32,
                    width: 170,
                }}>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ chain: 'bsc' });
                        data?.cbsetChain('bsc');
                        this.setDataRecentSearch('bsc');

                    }}
                    activeOpacity={0.6}
                    style={{
                        flex: 1,
                        backgroundColor: chain == 'bsc' ? colors.white : colors.dark_gray,
                        borderRadius: 10,
                        height: '100%',
                        alignItems: "center",
                        justifyContent: 'center',
                        flexDirection: "row"
                    }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../res/bsc.png')} />
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "bold",
                            color: chain == 'bsc' ? colors.black : colors.white,
                            marginLeft: 5
                        }}>BSC</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ chain: 'eth' });
                        data?.cbsetChain('eth');
                        this.setDataRecentSearch('eth');


                    }}
                    activeOpacity={0.6}
                    style={{
                        flex: 1,
                        height: '100%',
                        alignItems: "center",
                        justifyContent: 'center',
                        flexDirection: "row",
                        backgroundColor: chain == 'eth' ? colors.white : colors.dark_gray,
                        borderRadius: 10,



                    }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../res/eth.png')} />
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "bold",
                            color: chain == 'eth' ? colors.black : colors.white,
                            marginLeft: 5
                        }}>
                        ETH
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    }
    render() {
        const { data, isloading, showRecent, recentSearch } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: colors.black }}>
                <StatusBar
                    animated={true}
                    barStyle={'light-content'}
                    hidden={false} />
                <SafeAreaView style={{ flex: 1 }}>
                    {this.renderSearchInput()}
                    {this.renderChain()}
                    {this.renderLine()}
                    {isloading && this.renderLoading()}
                    {this.renderRecentSearch()}
                    {!isloading && <FlatList
                        keyExtractor={item => item?.address}
                        data={showRecent ? recentSearch : data}
                        renderItem={this.renderItem} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchTokenScreen)

