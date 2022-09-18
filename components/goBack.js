import React, {Component} from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'

import GoBackIcon from '../assets/goBack.svg'

// Colors
const bgColor = "#3D348B";
const blueColor = "#28C6D5";

export default class GoBack extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <TouchableOpacity
                style={[styles.backButtonContainer, this.props.appTheme == "Dark" ? darkTheme.backButtonContainer : null]}
                onPress={() => {
                    this.props.navigation.goBack();
                }}
                activeOpacity={0.8}>
                <View style={[styles.backButton, this.props.appTheme == "Dark" ? darkTheme.backButton : null]}>
                    <GoBackIcon style={[styles.backButtonIcon, this.props.appTheme == "Dark" ? darkTheme.backButtonIcon : null]} />
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    backButtonContainer: {
        width: 35,
        height: 35,
        borderRadius: 25,
        overflow: 'hidden',
        position: 'absolute',
        top: 55,
        left: 30
    },

    backButton: {
        width: '100%',
        height: '100%',
        backgroundColor: blueColor,
        alignItems: 'center',
        justifyContent: 'center'
    },

    backButtonIcon: {
        width: 30,
        height: 30,
        color: 'white'
    },
})