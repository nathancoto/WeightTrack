import React, {Component} from 'react'
import {Text, View, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import * as G from '../service/global'

import { authentication } from '../service/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Colors
const bgColor = "#3D348B";
const blueColor = "#28C6D5";

// Largeur des items
const size = G.wSC / G.numColumns - 10;

export default class Connexion extends Component {
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
        
        this.getData();
    }

    handleLogin = () => {
        signInWithEmailAndPassword(authentication, this.state.inputMail, this.state.inputPassword)
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

    async checkConnection(response) {
        let data = response.data;
        
        const connected = await this.saveToStorage(data);
        if (connected){
            this.setState({
                validating: false
            });

            this.props.setUserData(data.data);
            
            this.props.navigation.replace('App');
        } else {
            this.setState({
                failedLogin: true
            });
        }
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

    getData = async () => {
        try {
            const theme = await AsyncStorage.getItem('selectedTheme');
            if(theme !== null) {
                this.props.setAppTheme(theme);
            }
        } catch(e) {
            return false;
        }

        try {
            const value = await AsyncStorage.getItem('user');
            if(value !== null) {
                this.setState({
                    validating: false
                });
    
                this.props.setUserData(value);
                
                /* Redirect to accounts page */
                // this.props.navigator.resetTo({
                //     title: 'App',
                //     component: Home,
                // })
                this.props.navigation.replace('App');
            } else {
                // Not connected
            }
        } catch(e) {
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
                                    this.handleLogin();
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
                        <Text style={styles.buttonText}>Se connecter</Text>
                    </TouchableOpacity>

                </View>

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        bottom: 50
                    }}
                    activeOpacity={0.8}
                    onPress={() => {this.props.navigation.navigate('CreateAccount')}}>
                    <Text
                        style={{
                            marginRight: 5,
                            color: 'white'
                        }}>
                            Vous n'avez pas de compte ?
                        </Text>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: 'white'
                        }}>
                            Créer un compte
                    </Text>
                </TouchableOpacity>
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
    }
})