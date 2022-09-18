import React, {Component} from 'react'
import {Text, View, StyleSheet, FlatList} from 'react-native'

import * as G from '../service/global'
import * as Services from '../service/Api';

// Largeur des items
const size = G.wSC / G.numColumns - 10;

export default class Home extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            
        }
    }

    componentDidMount() {
        
    }

    render() {
        return(
            <View style={[styles.container, this.props.appTheme == "Dark" ? darkTheme.container : null]}>
                <Text>Hello</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: "#fff",
        paddingTop: 50,
        paddingHorizontal: '5%'
    },

    label: {
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 18
    },

    groupContainer: {
        height: 170,
        width: '100%',
        paddingHorizontal: '5%',
        paddingTop: 50,
        zIndex: 2,
        backgroundColor: 'white'
    },

    postContainer: {
        height: '65%',
        width: '100%',
        overflow: 'visible',
        marginTop: 20
    }
})

const darkTheme = StyleSheet.create({
    container: {
        backgroundColor: "#0d0f15"
    },

    label: {
        color: "#fff"
    },

    groupContainer: {
        backgroundColor: '#0d0f15'
    }
});