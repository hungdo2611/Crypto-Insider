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
    FlatList,
    RefreshControl,
    ScrollView
} from 'react-native'



import { connect } from 'react-redux'
import TopBarComponent from '../../component/TopBar';
import colors from '../../constants/colors';
import FastImage from 'react-native-fast-image';
import { renderShortAddress, copyToClipboard } from '../../models';
import { Navigation } from 'react-native-navigation';

import { GetTokenInfo } from '../../apis/TokenInfo'




const { width, height } = Dimensions.get('window')
class DetailTokenScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {



        };
    }
    async componentDidMount() {
        const { data } = this.props;
        let body = {
            chain: data?.chain,
            address: data?.address

        };
        let tokeninfo = await GetTokenInfo(body);
        console.log("tokeninfo", tokeninfo)

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
        return <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }
        }>
            <Text style={{ color: colors.text_gray, fontSize: 16, fontWeight: '600' }}>Price: </Text>
            <Text style={{ color: colors.white, fontSize: 16, fontWeight: '600' }}>{data?.price}</Text>
        </View>
    }
    renderButton = () => {
        return <TouchableOpacity style={{ backgroundColor: colors.blue, borderRadius: 10, alignItems: 'center', justifyContent: "center", paddingVertical: 6, marginTop: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", paddingHorizontal: 10, paddingVertical: 8, color: colors.white }}>Subcribe</Text>
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
                    {this.renderButton()}
                    {this.renderLine()}
                    {this.renderListBigTrans()}
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

