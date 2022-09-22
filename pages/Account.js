import React, {Component} from 'react'
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as G from '../service/global'
import { authentication } from '../service/Firebase';
import { signOut } from 'firebase/auth';
import { async } from '@firebase/util';
import { Modalize } from 'react-native-modalize';
import { TextInput } from 'react-native-gesture-handler';

import { VictoryChart, VictoryAxis, VictoryArea } from "victory-native";
import { Defs, LinearGradient, Stop } from 'react-native-svg';

import { db } from '../service/Firebase';
import { collection, getDocs, addDoc, query, where, deleteDoc, setDoc } from 'firebase/firestore/lite';

// Largeur des items
const size = G.wSC / G.numColumns - 10;

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const textColor = "#E0DDF3";
const blueColor = "#28C6D5";
const redColor = "#E85F5C";

// Date
const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const formattedToday = dd + '/' + mm + '/' + yyyy;

export default class Account extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            needConnection: true,
            userData: typeof props.userData !== "object" ? JSON.parse(props.userData) : props.userData,
            date: formattedToday,
            inputWeight: '',
            data: [],
            chartData: [],
            ref: React.createRef(null),
            wrongFormat: false,
            missingField: false,
        }

        this.getData();
    }

    async onDisconnect() {
        signOut(authentication)
            .then(() => {
                this.props.navigation.replace('Connexion');
            })
            .catch(error => alert(error.message))


        await AsyncStorage.removeItem('user');
        
        this.props.navigation.navigate('Connexion');
    }

    onOpen = () => {
        this.state.ref.current?.open();
    };

    onChangeDate = (text) => {
        this.setState({date: text});
    }

    onChangeWeight = (text) => {
        this.setState({inputWeight: text});
    }

    getData = async() => {
        const userDataCol = collection(db, 'userData');
        
        const q = query(userDataCol,
            where("mail", "==", this.state.userData.mail));

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
                        weight: parseInt(dataList[0].weight)
                    },
                    {
                        date: 2,
                        weight: parseInt(dataList[0].weight)
                    }
                ]
            } else {
                chartData = dataList.map(a => ({
                    date: a.date,
                    weight: parseInt(a.weight)
                }))
            }

            let dayData = dataList.filter(obj => obj.date == dataList[dataList.length - 1].date);

            this.setState({
                chartData: chartData,
                dayData: dayData.length > 0 ? dayData[0] : undefined
            });
        }
    }

    saveData = async() => {
        this.setState({
            missingField: false,
            existingDate: false,
            wrongFormat: false
        })
        let missingField = false;

        if(this.state.date == null || this.state.date == undefined || this.state.date == ""
            || this.state.inputWeight == null || this.state.inputWeight == undefined || this.state.inputWeight == "") {
            missingField = true;
            this.setState({missingField: true});
        }

        if (this.state.data.some(e => e.date === this.state.date)) {
            missingField = true;
            this.setState({existingDate: true});
        }

        let dateChecker = this.state.date.split("/");
        if(dateChecker.length !== 3 || dateChecker[0].length !== 2 || dateChecker[1].length !== 2 || dateChecker[2].length !== 4) {
            missingField = true;
            this.setState({wrongFormat: true});
        }

        if(!missingField) {
            await addDoc(collection(db, "userData"), {
                weight: this.state.inputWeight,
                mail: this.state.userData.mail,
                date: this.state.date
            }).then(() => {
                this.state.ref.current?.close();
                this.setState({
                    inputWeight: '',
                    missingField: false,
                    existingDate: false,
                    wrongFormat: false
                });
                this.getData();
            });
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
                weightMin = Math.min(...this.state.chartData.map(o => o.weight)) - (weightDiff * 30/100);
                weightMax = Math.max(...this.state.chartData.map(o => o.weight)) + (weightDiff * 30/100);
            }
        }

        return(
            <View style={[styles.container, this.props.appTheme == "Dark" ? darkTheme.container : null]}>
                <Text style={styles.title}>Evolution personnelle</Text>

                {
                    this.state.data.length > 0 ?
                        this.state.chartData.length > 0 ?
                            <VictoryChart
                                height={200}
                            >
                                <VictoryArea
                                    style={{
                                        data: {
                                            stroke: "#61A0AF",
                                            fill: "url(#gradientChart)"
                                        }
                                    }}
                                    data={this.state.chartData}
                                    interpolation={"catmullRom"}
                                    x="date" y="weight"
                                    domain={{
                                        y: [weightMin, weightMax]
                                    }}
                                    animate={{
                                        duration: 2000,
                                        onLoad: { duration: 1000 }
                                    }}
                                />
                                <VictoryAxis style={{
                                    axis: {stroke: "transparent"},
                                    ticks: {stroke: "transparent"},
                                    tickLabels: {fill:"transparent"}
                                }} />
                                <VictoryAxis dependentAxis style={{
                                    axis: {stroke: "transparent"},
                                    tickLabels: {fill: "white"}
                                }} />
                                <Defs>
                                    <LinearGradient id="gradientChart" x1="0%" y1="0%" x2="0%" y2="100%" >
                                        <Stop offset="0%" stopColor={blueColor}/>
                                        <Stop offset="100%" stopColor={bgColor}/>
                                    </LinearGradient>
                                </Defs>
                            </VictoryChart>
                        :
                            <Text style={{color: 'white'}}>Oops</Text>
                    :
                    <Text style={[styles.text, {marginVertical: 50}]}>Pas encore de données...</Text>
                }

                <View style={[styles.buttonsContainer, this.state.data.length <= 0 ? styles.singleButton : null]}>
                    {
                        this.state.data.length > 0 &&
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.button, this.state.data.length > 0 ? {width: '40%'} : null]}
                                onPress={() => this.props.navigation.navigate("PersonalEvolutionDetails",
                                    {
                                        userData: this.state.userData,
                                        data: this.state.data,
                                        getData: this.getData
                                    }
                                )}>
                                <Text style={styles.buttonText}>Historique</Text>
                            </TouchableOpacity>
                    }
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.button, this.state.data.length > 0 ? {width: '50%'} : null]}
                        onPress={this.onOpen}>
                        <Text style={styles.buttonText}>Ajouter des données</Text>
                    </TouchableOpacity>
                </View>


                <TouchableOpacity
                    style={[styles.disconnectButton, this.props.appTheme == "Dark" ? darkTheme.disconnectButton : null]}
                    onPress={() => {
                        if(this.state.needConnection) {
                            this.onDisconnect();
                        }
                    }}
                    activeOpacity={.8}>
                    <Text style={[styles.disconnectButtonText, this.props.appTheme == "Dark" ? darkTheme.disconnectButtonText : null]}>Se déconnecter</Text>
                </TouchableOpacity>

                <Modalize 
                    ref={this.state.ref}
                    disableScrollIfPossible={true}
                    adjustToContentHeight={true}
                    modalStyle={{backgroundColor: bgColor}}
                    onClosed={() => this.setState({inputWeight: ""})}>
                    <View style={[styles.modalContent, {paddingBottom: 150, paddingTop: 20}]}>
                        <Text style={[styles.title, {marginVertical: 20}]}>Ajouter un poids</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor={textColor}

                            // Valeur à afficher par défaut dans le champ de recherche
                            defaultValue={formattedToday}

                            // Events
                            onChangeText = {this.onChangeDate}/>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Poids (en kg)"
                            placeholderTextColor={textColor}
                            keyboardType="decimal-pad"

                            // Valeur à afficher par défaut dans le champ de recherche
                            value={this.state.inputWeight}

                            // Events
                            onChangeText = {this.onChangeWeight}/>

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
                                if(this.state.inputWeight.replace(/\s/g, '') !== "") {
                                    this.saveData(this.state.inputWeight)
                                }
                            }}
                            activeOpacity={.7}
                        >
                            <Text style={styles.buttonText}>Ajouter</Text>
                        </TouchableOpacity>
                    </View>
                </Modalize>
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

    disconnectButton: {
        position: 'absolute',
        bottom: 120,
        width: '80%',
        padding: 10,
        backgroundColor: redColor,
        borderRadius: 9
    },

    disconnectButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },

    title: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 10,
        color: 'white',
        textAlign: 'center'
    },

    text: {
        color: 'white'
    },

    buttonsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },

    singleButton: {
        justifyContent: 'center'
    },

    button: {
        width: '80%',
        padding: 10,
        backgroundColor: blueColor,
        borderRadius: 9
    },

    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center'
    },

    modalContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

    errorMessage: {
        color: 'red'
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
})

const darkTheme = StyleSheet.create({
    container: {
        backgroundColor: "#0d0f15"
    },

    disconnectButton: {
        backgroundColor: '#61A0AF',
    },

    disconnectButtonText: {
        color: '#0d0f15',
    }
});