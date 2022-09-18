import React, {Component} from 'react'
import {Text, View, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as G from '../service/global'

import { authentication } from '../service/Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import GoBack from '../components/goBack';

// Colors
const bgColor = "#3D348B";
const blueColor = "#28C6D5";

// Largeur des items
const size = G.wSC / G.numColumns - 10;

export default class CreateAccount extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            inputMail: '',
            inputPassword: '',
            visible: false,
            validating: false,
            failedLogin: false,
            needConnection: true
        }
    }

    handleSignup = () => {
        createUserWithEmailAndPassword(authentication, this.state.inputMail, this.state.inputPassword)
            .then(userCredentials => {
                const user = userCredentials.user;
                this.saveToStorage(user);
                this.props.setUserData({
                    isLoggedIn: true,
                    mail: user.email
                });
                this.props.navigation.replace('App');
            })
            .catch(error => alert(error.message))
    }

    onChangeMail = (text) => {
        this.setState({inputMail:text})
    }

    onChangePassword = (text) => {
        this.setState({inputPassword:text})
    }

    async saveToStorage(userData){
        if (userData) {
            await AsyncStorage.setItem('user', JSON.stringify({
                    isLoggedIn: true,
                    mail: userData.email
                })
            );
            return true;
        } else {
            return false;
        }
    }

    render() {
        return(
            <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={[bgColor, bgColor]}
                    style={styles.container}>
                {/* <Logo width={200} height={120} style={styles.logo}/> */}

                <GoBack navigation={this.props.navigation} /> 

                {this.state.failedLogin ? <Text style={styles.failedMessage}>Mauvaise combinaison mail / mot de passe</Text> : null}

                <View style={styles.containerMail}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mail"
                        placeholderTextColor={'white'}
                        keyboardType={"email-address"}

                        // Valeur à afficher par défaut dans le champ de recherche
                        value={this.state.inputMail}

                        // Events
                        onChangeText = {this.onChangeMail}/>

                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        placeholderTextColor={'white'}
                        secureTextEntry={true}

                        // Valeur à afficher par défaut dans le champ de recherche
                        value={this.state.inputPassword}

                        // Events
                        onChangeText = {this.onChangePassword}/>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            if(this.state.needConnection) {
                                if(this.state.inputMail && this.state.inputPassword) {
                                    this.handleSignup();
                                }
                            } else {
                                // this.props.navigator.resetTo({
                                //     title: 'App',
                                //     component: Home,
                                // })
                                this.props.navigation.replace('App');
                            }
                        }}
                        activeOpacity={.7}
                    >
                        <Text style={styles.buttonText}>M'inscrire</Text>
                    </TouchableOpacity>

                </View>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    containerMail: {
        width: '100%',
        alignItems: 'center'
    },

    logo: {
        marginBottom: 50
    },

    input: {
        width: '80%',
        height: 53,
        paddingHorizontal: 20,
        margin: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        color: 'white',
        fontSize: 14
    },

    button: {
        width: '80%',
        height: 53,
        marginTop: 60,
        borderRadius: 10,
        backgroundColor: blueColor,
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },

    failedMessage: {
        marginBottom: 20,
        fontWeight: 'bold',
        color: 'white'
    },
})