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
export default class InputComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }


    render() {
        const {
            onChangeText,
            placeholder,
            styleText,
            secureTextEntry,
            placeholderTextColor,
            //icon right
            iconRight,
            // icon left
            iconLeft,

            // check valid
            isvalid,
            txterror,
            containerStyle

        } = this.props;
        return (
            <View>
                <View style={containerStyle ? containerStyle : {
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.dark_gray,
                    marginTop: 20,
                    padding: 18,

                }}>
                    {iconLeft && iconLeft}
                    <TextInput
                        style={styleText}
                        onChangeText={txt => onChangeText(txt)}
                        secureTextEntry={secureTextEntry}
                        placeholderTextColor={placeholderTextColor}
                        placeholder={placeholder}
                        {...this.props}>

                    </TextInput>
                    {iconRight && iconRight}
                </View>
                {isvalid == false && <Text style={{ color: "red", paddingLeft: 18, marginTop: 5 }}>{txterror}</Text>}
            </View>
        )
    }
}





