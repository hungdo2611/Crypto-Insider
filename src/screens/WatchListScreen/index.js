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

import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Shine
} from "rn-placeholder";

import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';


const { width, height } = Dimensions.get('window')
class WatchListScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            txt_search: '',
            chain: 'bsc',
            refreshing: false,
            isloading: false,
            dataBSC: [],
            dataETH: [],

        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        const { } = this.state;
        console.log("getdata")
        this.setState({ isloading: true })

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
                marginTop: 20,
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
                    onPress={() => this.setState({ chain: 'bsc' })}
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
                    onPress={() => this.setState({ chain: 'eth' })}
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


    getDataProvider = () => {
        const { dataBSC, dataETH, chain } = this.state;
        if (chain == 'bsc') {
            return dataBSC;
        }
        if (chain == 'eth') {
            return dataETH;
        }
    }
    renderItem = () => {

    }
    renderRefreshCtr = () => {
        return <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
                this.setState({
                    refreshing: true,
                });
                this.refreshData();
                setTimeout(
                    function () {
                        //console.oldlog("")
                        this.setState({
                            refreshing: false,
                        });
                    }.bind(this),
                    2000,
                );
                // this.onRefresh()
            }}
        />
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
                    {this.renderChain()}
                    {this.renderSearchInput()}
                    {isloading && this.renderLoading()}
                    {!isloading && <FlatList
                        data={[...data, { type: 'loading' }]}
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

