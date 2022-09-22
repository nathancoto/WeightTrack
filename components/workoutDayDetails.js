import React, {Component} from 'react'
import {Text, View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native'

import * as G from '../service/global'

import ExpandIcon from '../assets/expand.svg'
import DeleteIcon from '../assets/delete.svg'
import PlusIcon from '../assets/plus.svg'
import TimeAddIcon from '../assets/timeadd.svg'

// Largeur des items
const sizeWithPadding = G.wSC - (G.wSC * 5/100);
const size = sizeWithPadding / G.numColumns - 20;

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const textColor = "#E0DDF3";
const blueColor = "#28C6D5";
const redColor = "#E85F5C";

export default class WorkoutDayDetails extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            userData: typeof props.userData !== "object" ? JSON.parse(props.userData) : props.userData,
            dayData: props.dayData
        }
    }

    render() {
        return(
            <ScrollView
                style={styles.container}
                contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
                {
                    typeof this.props.dayData == "object" ?
                    <>
                        {
                            this.props.dayData.exerciseList.length > 0 ?
                                this.props.dayData.exerciseList.map((a, i) => {
                                    return(
                                        <View style={[styles.itemContainer, {flexDirection: 'column'}]} key={i}>
                                            <View style={styles.itemContainer}>
                                                <TouchableOpacity
                                                    style={styles.exerciseContainer}
                                                    activeOpacity={.7}
                                                    onPress={() => {
                                                        this.props.navigation.navigate('ExerciseDayDetails',
                                                        {
                                                            dayData: this.props.dayDataDetails.find((obj) => obj.exerciseName == a.exerciseName),
                                                            userData: this.state.userData
                                                        }
                                                    )}}>
                                                    <Text style={{color: 'white'}}>{a.exerciseName}</Text>
                                                    <ExpandIcon style={{color: 'white', marginLeft: 10}} height={18} />
                                                </TouchableOpacity>
                                                {/* <TouchableOpacity
                                                    style={styles.deleteButton}
                                                    activeOpacity={.7}>
                                                    <DeleteIcon style={{color: 'white'}} height={12} />
                                                </TouchableOpacity> */}
                                            </View>

                                            {
                                                i !== this.props.dayData.exerciseList.length - 1 ?
                                                    a.restTime !== undefined && a.restTime !== null && a.restTime.length > 0 ?
                                                        <TouchableOpacity
                                                            style={styles.circleContainer}
                                                            activeOpacity={.7}
                                                            onPress={() => this.props.setRefAddTime(i, true)}>
                                                            <Text style={{color: 'white'}}>{a.restTime}</Text>
                                                            <Text style={{color: 'white'}}>sec</Text>
                                                        </TouchableOpacity>
                                                    :
                                                        <TouchableOpacity
                                                            style={styles.circleContainer}
                                                            activeOpacity={.7}
                                                            onPress={() => this.props.setRefAddTime(i)}>
                                                            <TimeAddIcon style={{color: 'white'}} height={12} />
                                                        </TouchableOpacity>
                                                :
                                                    // <TouchableOpacity
                                                    //     style={styles.circleContainer}
                                                    //     activeOpacity={.7}>
                                                    //     <PlusIcon style={{color: 'white'}} height={12} />
                                                    // </TouchableOpacity>
                                                    <></>
                                            }
                                        </View>
                                    )
                                })
                            : <Text style={{color: 'white', marginTop: 50}}>Pas encore d'exercice pour cette date...</Text>
                        }
                    </>
                    : <Text>Loading...</Text>
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 30,
        display: 'flex',
        flexDirection: 'column',
    },

    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    exerciseContainer: {
        backgroundColor: modalColor,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginVertical: 10,
        // marginRight: 20,
        borderRadius: 5,
        height: 30,

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10
    },

    deleteButton: {
        width: 30,
        height: 30,
        backgroundColor: redColor,
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    circleContainer: {
        width: 45,
        height: 45,
        borderRadius: 25,
        marginVertical: 20,
        backgroundColor: blueColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

const darkTheme = StyleSheet.create({
    
});