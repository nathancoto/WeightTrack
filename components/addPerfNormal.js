import React, {Component} from 'react'
import {Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView} from 'react-native'

import * as G from '../service/global'

import TimeIcon from '../assets/time.svg';

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const textColor = "#E0DDF3";
const blueColor = "#28C6D5";
const redColor = "#E85F5C";

// Largeur des items
const size = G.wSC / G.numColumns - 10;

const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const formattedToday = dd + '/' + mm + '/' + yyyy;

export default class AddPerfNormal extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            exercise: props.exercise,
            data: [],
            nbSeries: props.nbSeries,
            comments: props.comments,
            repsWeights: props.repsWeights,
            date: props.date,
            chartData: [],
            activeData: '',
            dayData: '',
            timeInput: [],
            fill: props.fill,
            missingField: false,
            existingDate: false,
            wrongFormat: false,
            dayData: props.dayData
        }
    }

    onChangeNbSeries = (text) => {
        this.setState({
            nbSeries: text.replace(/[^0-9]/g, ''),
        });
        this.props.onChangeNbSeries(text);
    }

    onChangeComments = (text) => {
        this.setState({
            comments: text,
        });
        this.props.onChangeComments(text);
    }

    onChangeDate = (text) => {
        this.setState({
            date: text
        });
        this.props.onChangeDate(text);
    }

    onChangeNbReps(index) {
        return (text) => {
            let repsWeights = this.state.repsWeights;
            if(typeof repsWeights[index.i] == 'object') {
                repsWeights[index.i]['nbReps'] = text;
            } else {
                repsWeights[index.i] = {
                    nbReps: text,
                    weight: '',
                    recupTime: ''
                };
            }
            this.setState({repsWeights: repsWeights});
            this.props.onChangeNbReps(index, text);
        }
    }

    onChangeWeights(index) {
        return (text) => {
            let repsWeights = this.state.repsWeights;
            if(typeof repsWeights[index.i] == 'object') {
                repsWeights[index.i]['weight'] = text;
            } else {
                repsWeights[index.i] = {
                    nbReps: '',
                    weight: text,
                    recupTime: ''
                };
            }
            this.setState({repsWeights: repsWeights});
            this.props.onChangeWeights(index, text);
        }
    }

    onChangeRecupTime(index) {
        return (text) => {
            let repsWeights = this.state.repsWeights;
            if(typeof repsWeights[index.i] == 'object') {
                repsWeights[index.i]['recupTime'] = text;
            } else {
                repsWeights[index.i] = {
                    nbReps: '',
                    weight: '',
                    recupTime: text
                };
            }
            this.setState({repsWeights: repsWeights});
            this.props.onChangeRecupTime(index, text);
        }
    }

    saveData = () => {
        this.setState({
            missingField: false,
            existingDate: false,
            wrongFormat: false
        })
        let missingField = false;
        if(this.state.date !== null && this.state.date !== undefined && this.state.date !== ""
            && this.state.nbSeries !== null && this.state.nbSeries !== undefined && this.state.nbSeries !== "") {
            this.state.repsWeights.forEach((a, i) => {
                if(a.nbReps == null || a.nbReps == undefined || a.nbReps == ""
                || a.weight == null || a.weight == undefined || a.weight == "") {
                    missingField = true;
                    this.setState({missingField: true});
                }
            })
        } else {
            missingField = true;
            this.setState({missingField: true});
        }

        if(!this.state.fill) {
            if (this.state.data.some(e => e.date === this.state.date)) {
                missingField = true;
                this.setState({existingDate: true});
            }
        }

        let dateChecker = this.state.date.split("/");
        if(dateChecker.length !== 3 || dateChecker[0].length !== 2 || dateChecker[1].length !== 2 || dateChecker[2].length !== 4
            || !(/^\d+$/.test(dateChecker[0])) || !(/^\d+$/.test(dateChecker[1])) || !(/^\d+$/.test(dateChecker[2]))) {
            missingField = true;
            this.setState({wrongFormat: true});
        }

        if(!missingField) {
            this.props.saveData();
        }
    }

    render() {
        return(
            <View style={styles.modalContent}>
                <Text style={[styles.title, {marginBottom: 20}]}>
                    {this.state.fill ? "Editer les données du " + this.state.dayData.date : "Ajouter des performances"}
                </Text>

                <TextInput
                    style={styles.modalInput}
                    defaultValue={this.state.fill == true ? this.state.dayData.date : formattedToday}

                    // Events
                    onChangeText = {this.onChangeDate}/>

                <TextInput
                    style={[styles.modalInput, {marginBottom: 20}]}
                    placeholder="Nombre de séries"
                    placeholderTextColor={'#96C9DC'}
                    keyboardType={'number-pad'}
                    defaultValue={this.state.fill == true ? this.state.dayData.nbSeries : null}

                    // Events
                    onChangeText = {this.onChangeNbSeries}/>

                {
                    parseInt(this.state.nbSeries) >= 0 &&
                    Array.from(Array(parseInt(this.state.nbSeries)).keys()).map((a, i) => {
                        return(
                            <View style={styles.dataInputContainer} key={i}>
                                <View style={styles.row}>
                                    <Text style={styles.dataTitle}>Série {i+1}</Text>
                                </View>
                                <View style={styles.row}>
                                    <View style={styles.column}>
                                        <Text style={styles.dataLabel}>Nombre de répétitions</Text>
                                        <TextInput
                                            style={styles.smallModalInput}
                                            keyboardType={'number-pad'}
                                            defaultValue={this.state.fill == true ? this.state.dayData.repsWeights[i].nbReps : null}

                                            // Events
                                            onChangeText = {this.onChangeNbReps({i})}/>
                                    </View>
                                    <View style={[styles.column, styles.right]}>
                                        <Text style={[styles.dataLabel]}>Poids</Text>
                                        <TextInput
                                            style={styles.smallModalInput}
                                            keyboardType={'decimal-pad'}
                                            defaultValue={this.state.fill == true ? this.state.dayData.repsWeights[i].weight : null}

                                            // Events
                                            onChangeText = {this.onChangeWeights({i})}/>
                                    </View>
                                </View>
                                {
                                    i + 1 < this.state.nbSeries ?
                                    <TouchableOpacity
                                        style={styles.customInputContainer}
                                        onPress={() => { this.state.timeInput[i].focus(); }}>
                                        <TimeIcon style={{color: 'white'}} height={12} />
                                        <TextInput
                                            style={[styles.customInput, {color: 'white'}]}
                                            keyboardType={'decimal-pad'}
                                            ref={(input) => { this.state.timeInput[i] = input; }}
                                            defaultValue={this.state.fill == true ? this.state.dayData.repsWeights[i].recupTime : "0"}

                                            // Events
                                            onChangeText = {this.onChangeRecupTime({i})}/>
                                        <Text style={{color: 'white'}}> secondes</Text>
                                        </TouchableOpacity>   
                                    : null
                                }
                            </View>
                        )
                    })
                }

                <Text style={[styles.dataLabel, {alignSelf: 'flex-start', marginLeft: '10%'}]}>Commentaires</Text>
                <TextInput
                    style={[styles.modalInput, {marginBottom: 20, textAlignVertical: "top"}]}
                    placeholder="Commentaires"
                    placeholderTextColor={'#96C9DC'}
                    defaultValue={this.state.fill == true ? this.state.dayData.comments : null}
                    multiline={true}

                    // Events
                    onChangeText = {this.onChangeComments}/>

                {
                    this.state.missingField &&
                        <Text style={styles.errorMessage}>Un ou plusieurs champs sont manquants</Text>
                }

                {
                    this.state.existingDate &&
                        <Text style={styles.errorMessage}>Cette date contient déjà des données</Text>
                }

                {
                    this.state.wrongFormat &&
                        <Text style={styles.errorMessage}>La date doit être au format dd/mm/yyyy</Text>
                }

                <TouchableOpacity
                    style={[styles.button, {marginTop: 20}]}
                    onPress={() => {
                        this.saveData()
                    }}
                    activeOpacity={.7}
                >
                    <Text style={styles.buttonText}>{this.state.fill ? "Editer" : "Ajouter"}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width: '80%',
        height: 53,
        borderRadius: 10,
        backgroundColor: blueColor,
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },

    modalContent: {
        width: "100%",
        paddingVertical: 60,
        paddingHorizontal: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    modalInput: {
        width: '80%',
        color: 'white',
        fontSize: 14,
        padding: 10,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10
    },

    dataInputContainer: {
        width: '90%',
        marginBottom: 10,
    },

    dataTitle: {
        marginBottom: 10,
        fontWeight: 'bold',
        color: 'white'
    },

    dataLabel: {
        color: 'white'
    },

    smallModalInput: {
        width: '80%',
        color: 'white',
        fontSize: 14,
        padding: 10,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 25
    },

    customInputContainer: {
        width: '50%',
        color: 'white',
        padding: 10,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 25,
        alignSelf: 'center',

        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

        overflow: 'hidden'
    },

    timeInput: {
        flex: 1,
        fontSize: 14,
        padding: 0,
        width: 'auto'
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

    title: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 10,
        color: 'white',
        textAlign: 'center'
    },

    errorMessage: {
        color: redColor
    },
})

const darkTheme = StyleSheet.create({
    container: {
        backgroundColor: "#0d0f15"
    },
});