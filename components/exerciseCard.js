import React, {Component} from 'react'
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native'

import { VictoryGroup, VictoryArea } from "victory-native";
import { Defs, LinearGradient, Stop } from 'react-native-svg';

import * as G from '../service/global'

import { db } from '../service/Firebase';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';

// Largeur des items
const size = G.wSC / G.numColumns - 20;

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const textColor = "#E0DDF3";
const blueColor = "#28C6D5";

export default class ExerciseCard extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            userData: typeof props.userData !== "object" ? JSON.parse(props.userData) : props.userData,
            exercise: props.exercise,
            data: [],
            chartData: [],
        }

        this.getData();
    }

    redirectToExerciseDetails = () => {
        this.props.navigation.navigate("ExerciseDetail", {exercise: this.state.exercise})
    }

    askDeleteExercise = () => {
        this.props.askDeleteElement(this.state.exercise.exerciseName);
    }

    getData = async() => {
        const exercisesDataCol = collection(db, 'exercisesData');

        const q = query(exercisesDataCol,
            where("mail", "==", this.state.userData.mail),
            where("exerciseName", "==", this.state.exercise.exerciseName));

        const dataSnapshot = await getDocs(q);
        const dataList = dataSnapshot.docs.map(doc => doc.data());

        this.setState({data: dataList});

        if(dataList.length > 0) {
            dataList.sort(function(a, b){
                var aa = a.date.split('/').reverse().join(),
                    bb = b.date.split('/').reverse().join();
                return aa < bb ? -1 : (aa > bb ? 1 : 0);
            });

            let chartData;

            if(dataList.length == 1) {
                chartData = [
                    {
                        date: 1,
                        weight: parseInt(Math.max(...dataList[0].repsWeights.map(o => o.weight)))
                    },
                    {
                        date: 2,
                        weight: parseInt(Math.max(...dataList[0].repsWeights.map(o => o.weight)))
                    }
                ]
            } else {
                chartData = dataList.map(a => ({
                    date: a.date,
                    weight: parseInt(Math.max(...a.repsWeights.map(o => o.weight)))
                }))
            }


            this.setState({chartData: chartData});
        }
    }

    render() {
        let weightDiff, weightMin, weightMax;
        if(this.state.chartData.length > 0) {
            if(this.state.data.length == 1) {
                weightMin = 0;
                weightMax = Math.max(...this.state.chartData.map(o => o.weight));
            } else {
                weightDiff = Math.max(...this.state.chartData.map(o => o.weight)) - Math.min(...this.state.chartData.map(o => o.weight));
                weightMin = Math.min(...this.state.chartData.map(o => o.weight)) - (weightDiff * 50/100);
                weightMax = Math.max(...this.state.chartData.map(o => o.weight)) + (weightDiff * 15/100);
            }
        }

        return(
            <TouchableOpacity
                activeOpacity={.7}
                style={[styles.container, this.props.appTheme == "Dark" ? darkTheme.container : null]}
                onPress={this.redirectToExerciseDetails}
                onLongPress={this.askDeleteExercise}>
                <View style={[styles.wrapper, this.props.appTheme == "Dark" ? darkTheme.wrapper : null]}>
                    <View style={styles.upDataContainer}>
                        {
                            this.state.chartData.length > 0 ?
                            <>
                                <VictoryGroup
                                    width={size-30} height={40}
                                    padding={0}
                                    domain={{
                                        y: [weightMin, weightMax]
                                    }}>
                                    <VictoryArea
                                        style={{
                                            data: {
                                                stroke: blueColor,
                                                fill: "url(#gradientChart)"
                                            }
                                        }}
                                        data={this.state.chartData}
                                        interpolation={"catmullRom"}
                                        x="date" y="weight"
                                        animate={{
                                            duration: 1000,
                                            onLoad: { duration: 1000 }
                                        }}
                                    />
                                    <Defs>
                                        <LinearGradient id="gradientChart" x1="0%" y1="0%" x2="0%" y2="100%" >
                                            <Stop offset="0%" stopColor={blueColor}/>
                                            <Stop offset="100%" stopColor={modalColor}/>
                                        </LinearGradient>
                                    </Defs>
                                </VictoryGroup>
                                <View style={{paddingHorizontal: 0, marginTop: 5}}>
                                    <Text style={{fontSize: 12, color: textColor, textAlign: 'center'}}>Dernière séance :</Text>
                                    <Text style={{fontSize: 12, fontWeight: 'bold', color: 'white', textAlign: 'center'}}>{Math.max(...this.state.data[this.state.data.length - 1].repsWeights.map(o => o.weight))} kg</Text>
                                </View>
                            </>
                                :
                                <View style={styles.noData}>
                                    <Text style={{color: textColor, textAlign: 'center'}}>Pas encore de données...</Text>
                                </View>
                        }
                    </View>
                    <Text style={styles.exerciseName}>{this.state.exercise.exerciseName}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    wrapper: {
        width: size - 30,
        height: size - 30,
        padding: 15,
        borderRadius: 20,
        backgroundColor: modalColor,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10
    },

    exerciseName: {
        marginTop: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    },

    noData: {
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    upDataContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})

const darkTheme = StyleSheet.create({
    wrapper: {
        backgroundColor: "#0d0f15"
    },
});