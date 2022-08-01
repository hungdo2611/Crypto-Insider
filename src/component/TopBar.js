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
import colors from '../constants/colors';



const { width, height } = Dimensions.get('window')
export default class TopBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }


    render() {
        const { iconLeft, iconRight, title, fontSize } = this.props;
        return (
            <View style={{ height: 50, marginHorizontal: 15, flexDirection: "row", alignItems: "center" }}>
                {iconLeft && iconLeft}
                <Text style={{ fontSize: fontSize ? fontSize : 25, fontWeight: 'bold', color: colors.white, flex: 1, textAlign: "center" }}>
                    {title}
                </Text>
                {iconRight && iconRight}

            </View>
        )
    }
}





