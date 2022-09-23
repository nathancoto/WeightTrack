import React, {Component} from 'react'
import {Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput} from 'react-native'

import * as G from '../service/global'

import HaltereIcon from '../assets/haltere.svg'
import BarIcon from '../assets/barre.svg'
import KettlebellIcon from '../assets/kettlebell.svg'
import GymMachineIcon from '../assets/gym-machine.svg'
import PoulieIcon from '../assets/poulie.svg'
import CardioIcon from '../assets/cardio.svg'

// Largeur des items
const size = (G.wSC - (G.wSC * 30/100)) / G.numColumns;

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const textColor = "#E0DDF3";
const blueColor = "#28C6D5";
const redColor = "#E85F5C";

export default class SelectName extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            userData: typeof props.userData !== "object" ? JSON.parse(props.userData) : props.userData,
            activeName: this.props.activeName,
            editExercise: this.props.editExercise
        }
    }

    setActiveName = (name) => {
        this.props.setActiveName(name);
        this.setState({activeName: name});
    }

    saveExercise = () => {
        this.props.saveExercise();
    }

    render() {
        return(
            <View
                style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Nom de l'exercice"
                    placeholderTextColor={textColor}

                    // Valeur à afficher par défaut dans le champ de recherche
                    value={this.state.activeName}

                    // Events
                    onChangeText = {this.setActiveName}/>

                {this.props.errorMessageMissing && <Text style={styles.errorMessage}>Un ou plusieurs champs sont manquants</Text>}

                {this.props.errorMessageExisting && <Text style={styles.errorMessage}>Cet exercice existe déjà</Text>}

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        if(this.state.activeName.replace(/\s/g, '') !== "") {
                            this.saveExercise();
                        }
                    }}
                    activeOpacity={.7}
                >
                    <Text style={[styles.text, styles.bold]}>
                        {
                            this.state.editExercise ?
                                "Editer"
                                : "Ajouter"
                        } 
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: G.hSC / 1.5
    },

    text: {
        color: 'white'
    },

    bold: {
        fontWeight: 'bold'
    },

    input: {
        width: '80%',
        color: 'white',
        fontSize: 14,
        padding: 10,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 30
    },

    button: {
        width: '80%',
        height: 53,
        borderRadius: 10,
        backgroundColor: blueColor,
        alignItems: 'center',
        justifyContent: 'center'
    },

    errorMessage: {
        marginBottom: 20,
        color: redColor
    },
})

const darkTheme = StyleSheet.create({
    container: {
        backgroundColor: "#0d0f15"
    },
});