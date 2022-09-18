import React, {Component} from 'react'
import {Text, View, StyleSheet} from 'react-native'

import * as G from '../service/global'

import { VictoryChart, VictoryArea, VictoryAxis, VictoryBar } from "victory-native";
import { Defs, LinearGradient, Stop } from 'react-native-svg';

import RepeatIcon from '../assets/repeat.svg';
import TimeIcon from '../assets/time.svg';

// Largeur des items
const sizeWithPadding = G.wSC - (G.wSC * 5/100);
const size = sizeWithPadding / G.numColumns - 20;

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const textColor = "#E0DDF3";
const blueColor = "#28C6D5";

export default class ExerciseDayDetails extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            userData: typeof props.userData !== "object" ? JSON.parse(props.userData) : props.userData,
            dayData: props.dayData
        }
    }
    
    render() {
        let chartData = [], weightDiff, weightMin, weightMax, averageRecupTime;
        if(this.props.dayData.repsWeights) {
            chartData = this.props.dayData.repsWeights.map((a, i) => ({
                index: i,
                weight: parseInt(a.weight),
                nbReps: parseInt(a.nbReps),
                recupTime: parseInt(a.recupTime)
            }));

            weightDiff = Math.max(...chartData.map(o => o.weight)) - Math.min(...chartData.map(o => o.weight));
            weightMin = Math.min(...chartData.map(o => o.weight)) - (weightDiff * 50/100);
            weightMax = Math.max(...chartData.map(o => o.weight)) + (weightDiff * 15/100);
            
            let sum = 0;
            for (var i = 0; i < chartData.length; i++) {
                if(!isNaN(chartData[i].recupTime)) {
                    sum += chartData[i].recupTime;
                }
            }
            averageRecupTime = Math.round(sum / (chartData.length - 1));
        }

        return(
            <View style={styles.container}>
                {
                    typeof this.props.dayData == "object" ?
                    <>
                    <View style={[styles.side, styles.left]}>
                        <View style={styles.cardContainer}>
                            <RepeatIcon style={styles.icon} height={24}/>
                            <Text style={{color: textColor, marginBottom: 5,}}>
                                <Text style={styles.dataNumber}>{this.props.dayData.nbSeries}</Text>
                                &nbsp;séries
                            </Text>
                        </View>

                        <View style={styles.cardContainer}>
                            <VictoryChart
                                width={size - 40}
                                height={65}
                                padding={0}
                            >
                                <VictoryBar
                                    style={{
                                        data: {
                                            stroke: "#61A0AF",
                                            fill: "url(#gradientChart)",
                                        }
                                    }}
                                    data={chartData}
                                    domain={{
                                        x: [-.5, chartData.length - .5]
                                    }}
                                    interpolation={"catmullRom"}
                                    x="index" y="nbReps"
                                    barRatio={.8}
                                    cornerRadius={{ top: 6 }}
                                    animate={{
                                        duration: 1000,
                                        onLoad: { duration: 1000 }
                                    }}
                                />
                                <VictoryAxis
                                    style={{ 
                                        axis: {stroke: "transparent"}, 
                                        ticks: {stroke: "transparent"},
                                        tickLabels: {fill:"transparent"}
                                    }}
                                />
                                <Defs>
                                    <LinearGradient id="gradientChart" x1="0%" y1="0%" x2="0%" y2="100%" >
                                        <Stop offset="0%" stopColor={blueColor}/>
                                        <Stop offset="100%" stopColor={modalColor}/>
                                    </LinearGradient>
                                </Defs>
                            </VictoryChart>
                            <Text style={[styles.data, {marginTop: 5, textAlign: 'center'}]}>Nombre de répétitions :</Text>
                            <Text style={[styles.data, {marginBottom: 0, textAlign: 'center'}]}>
                                de&nbsp;
                                <Text style={styles.dataNumber}>{Math.min(...this.props.dayData.repsWeights.map(o => o.nbReps))}</Text>
                                &nbsp;à&nbsp;
                                <Text style={styles.dataNumber}>{Math.max(...this.props.dayData.repsWeights.map(o => o.nbReps))}</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.side, styles.right]}>
                        <View style={styles.cardContainer}>
                            <VictoryChart
                                width={size - 40}
                                height={50}
                                padding={0}
                                domain={{
                                    y: [weightMin, weightMax]
                                }}
                            >
                                <VictoryArea
                                    style={{
                                        data: {
                                            stroke: "#61A0AF",
                                            fill: "url(#gradientChart)"
                                        }
                                    }}
                                    data={chartData}
                                    interpolation={"catmullRom"}
                                    x="index" y="weight"
                                    animate={{
                                        duration: 1000,
                                        onLoad: { duration: 1000 }
                                    }}
                                />
                                <VictoryAxis
                                    style={{ 
                                        axis: {stroke: "transparent"}, 
                                        ticks: {stroke: "transparent"},
                                        tickLabels: {fill:"transparent"}
                                    }}
                                />
                                <VictoryAxis dependentAxis
                                    style={{
                                        axis: {stroke: "transparent"},
                                        tickLabels: {fill: "white", fontSize: 8}
                                    }}
                                />
                                <Defs>
                                    <LinearGradient id="gradientChart" x1="0%" y1="0%" x2="0%" y2="100%" >
                                        <Stop offset="0%" stopColor={blueColor}/>
                                        <Stop offset="100%" stopColor={modalColor}/>
                                    </LinearGradient>
                                </Defs>
                            </VictoryChart>
                            <Text style={[styles.data, {marginTop: 5, textAlign: 'center'}]}>Poids soulevé :</Text>
                            <Text style={[styles.data, {marginBottom: 0, textAlign: 'center'}]}>
                                de&nbsp;
                                <Text style={styles.dataNumber}>{Math.min(...this.props.dayData.repsWeights.map(o => o.weight))}kg</Text>
                                &nbsp;à&nbsp;
                                <Text style={styles.dataNumber}>{Math.max(...this.props.dayData.repsWeights.map(o => o.weight))}kg</Text>
                            </Text>
                        </View>

                        <View style={styles.cardContainer}>
                            <TimeIcon style={styles.icon} height={24}/>
                            <View>
                                <Text style={{color: textColor, marginBottom: 5}}>Récupération moyenne : </Text>
                                <Text style={styles.dataNumber}>{averageRecupTime} secondes</Text>
                            </View>
                        </View>
                    </View>
                    </>
                    : <Text>Loading...</Text>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: size * G.numColumns + 20,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        // backgroundColor: 'green'
    },

    side: {
        width: size + 10,
        height: 'auto',
        paddingHorizontal: 10,
    },

    left: {
        // backgroundColor: 'yellow'
    },

    right: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        // backgroundColor: 'red',
    },

    cardContainer: {
        width: size - 10,
        padding: 15,
        marginVertical: 10,
        borderRadius: 20,
        backgroundColor: modalColor,

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',

        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10
    },

    data: {
        color: textColor,
        marginBottom: 5,
        width: size - 40
    },

    dataNumber : {
        fontWeight: 'bold',
        color: 'white'
    },

    icon: {
        color: 'white',
    }
})

const darkTheme = StyleSheet.create({
    
});