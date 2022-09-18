import React, {Component} from 'react'
import {Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView} from 'react-native'

import * as G from '../service/global'

import GoBack from '../components/goBack';

import TimeIcon from '../assets/time.svg';

// Largeur des items
const size = G.wSC / G.numColumns - 40;

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const textColor = "#E0DDF3";
const blueColor = "#28C6D5";

export default class ExerciseDayDetailsPage extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            userData: props.route.params.userData,
            dayData: props.route.params.dayData
        }
    }
    
    render() {
        return(
            <View style={styles.container}>
                <GoBack navigation={this.props.navigation} />

                <Text style={styles.title}>{this.state.dayData.date}</Text>

                <ScrollView
                    style={{width: '100%'}}
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                    <Text style={[styles.text, {marginBottom: 30}]}>
                        Nombre de séries :&nbsp;
                        <Text style={styles.bold}>{this.state.dayData.nbSeries}</Text>
                        &nbsp;séries
                    </Text>

                    {
                        parseInt(this.state.dayData.nbSeries) >= 0 &&
                        this.state.dayData.repsWeights.map((a, i) => {
                            return(
                                <View style={styles.dataInputContainer} key={i}>
                                    <View style={styles.row}>
                                        <Text style={styles.dataTitle}>Série {i+1}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <View style={styles.column}>
                                            <Text style={styles.text}>
                                                <Text style={styles.bold}>{a.nbReps}</Text>
                                                &nbsp;répétitions
                                            </Text>
                                        </View>
                                        <View style={[styles.column, styles.right]}>
                                            <Text style={styles.text}>
                                                <Text style={styles.bold}>{a.weight}</Text>
                                                &nbsp;kg
                                            </Text>
                                        </View>
                                    </View>
                                    {
                                        i + 1 < this.state.dayData.nbSeries ?
                                        <View style={styles.timeContainer}>
                                            <TimeIcon style={{color: 'white'}} height={12} />
                                            <Text style={styles.timeText}>
                                                <Text style={styles.bold}>{a.recupTime}</Text>
                                                &nbsp;secondes
                                            </Text>
                                        </View>
                                        : null
                                    }
                                </View>
                            )
                        })
                    }
                </ScrollView>

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
        backgroundColor: bgColor,
        paddingTop: 50,
        paddingHorizontal: '5%'
    },

    title: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 10,
        marginBottom: 40,
        color: 'white'
    },

    text: {
        color: 'white',
        marginBottom: 10
    },

    bold: {
        fontWeight: 'bold'
    },

    row: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    },

    column: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: '50%',
        height: '100%'
    },

    right: {
        alignItems: 'flex-end'
    },

    dataInputContainer: {
        width: '90%',
        marginBottom: 30,
    },

    dataTitle: {
        marginBottom: 10,
        fontWeight: 'bold',
        color: 'white'
    },

    timeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 20
    },

    timeText: {
        fontSize: 14,
        color: 'white'
    },
})

const darkTheme = StyleSheet.create({
    
});