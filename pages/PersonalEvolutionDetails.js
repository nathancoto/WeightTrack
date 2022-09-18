import React, {Component} from 'react'
import {Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView} from 'react-native'

import * as G from '../service/global'

import GoBack from '../components/goBack';

import { Modalize } from 'react-native-modalize';

import { db } from '../service/Firebase';
import { collection, getDocs, addDoc, query, where, deleteDoc, setDoc, updateDoc } from 'firebase/firestore/lite';

// Largeur des items
const size = G.wSC / G.numColumns - 40;

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const textColor = "#E0DDF3";
const blueColor = "#28C6D5";
const redColor = "#E85F5C";

export default class PersonalEvolutionDetailsPage extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            userData: props.route.params.userData,
            data: props.route.params.data.sort(function(a, b){
                var aa = a.date.split('/').reverse().join(),
                    bb = b.date.split('/').reverse().join();
                return bb < aa ? -1 : (bb > aa ? 1 : 0);
            }),
            ref: React.createRef(null),
            missingField: false,
            activeData: '',
            weight: '',
            inputWeight: ''
        }
    }

    weightDiff = (previous, actual) => {
        let weightDiff = actual - previous;
        return(
            <Text style={[weightDiff < 0 ? styles.negative : styles.positive, {marginLeft: 10}]}>
                {weightDiff < 0 ? "-" : "+"}
                {Math.abs(weightDiff)} kg
            </Text>
        )
    }

    onOpen = (data) => {
        this.setState({
            activeData: data.date,
            weight: data.weight,
            inputWeight: data.weight
        });
        this.state.ref.current?.open();
    }

    onChangeWeight = (text) => {
        this.setState({inputWeight: text});
    }

    saveData = async() => {
        this.setState({
            missingField: false,
        })
        let missingField = false;

        if(this.state.inputWeight == null || this.state.inputWeight == undefined || this.state.inputWeight == "") {
            missingField = true;
            this.setState({missingField: true});
        }

        const userDataCol = collection(db, 'userData');
        const qData = query(userDataCol,
            where("mail", "==", this.state.userData.mail),
            where("weight", "==", this.state.weight),
            where("date", "==", this.state.activeData));
        const dataDataSnapshot = await getDocs(qData);
        let scope = this;
        dataDataSnapshot.docs.map(async function(doc) {
            await updateDoc(doc.ref,
                {
                    weight: scope.state.inputWeight,
                }
            ).then(() => {
                scope.state.ref.current?.close();
                scope.setState({
                    inputWeight: '',
                    missingField: false,
                    activeData: '',
                });
                scope.props.route.params.getData();
                scope.getData();
            });
        }, scope)
    }

    deleteElement = async() => {
        const userDataCol = collection(db, 'userData');
        const qData = query(userDataCol,
            where("mail", "==", this.state.userData.mail),
            where("weight", "==", this.state.weight),
            where("date", "==", this.state.activeData));
        const dataDataSnapshot = await getDocs(qData);
        dataDataSnapshot.docs.map(doc => deleteDoc(doc.ref).then(() => {
            this.state.ref.current?.close();
            this.setState({
                inputWeight: '',
                missingField: false,
                activeData: '',
            });
            this.props.route.params.getData();
            this.getData();
        }));

    }

    getData = async() => {
        const userDataCol = collection(db, 'userData');
        
        const q = query(userDataCol,
            where("mail", "==", this.state.userData.mail));

        const dataSnapshot = await getDocs(q);
        const dataList = dataSnapshot.docs.map(doc => doc.data());

        this.setState({data: dataList.sort(function(a, b){
            var aa = a.date.split('/').reverse().join(),
                bb = b.date.split('/').reverse().join();
            return bb < aa ? -1 : (bb > aa ? 1 : 0);
        })});
    }
    
    render() {
        return(
            <View style={styles.container}>
                <GoBack navigation={this.props.navigation} />

                <Text style={styles.title}>Historique du poids</Text>

                <ScrollView
                    style={{width: '100%'}}
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                    {
                        this.state.data.length >= 0 &&
                        this.state.data.map((a, i) => {
                            return(
                                <TouchableOpacity
                                    style={styles.dataInputContainer}
                                    key={i}
                                    activeOpacity={.7}
                                    onLongPress={() => {this.onOpen(a)}}>
                                    <View style={styles.row}>
                                        <View style={styles.column}>
                                            <Text style={styles.text}>
                                                <Text style={styles.bold}>{a.date}</Text>
                                            </Text>
                                        </View>
                                        <View style={[styles.column, styles.right]}>
                                            <View style={[styles.row, {justifyContent: 'flex-end'}]}>
                                                <Text style={styles.text}>
                                                    <Text style={styles.bold}>{a.weight}</Text>
                                                    &nbsp;kg
                                                </Text>
                                                {
                                                    i < this.state.data.length - 1 &&
                                                        this.weightDiff(parseInt(this.state.data[i + 1].weight), parseInt(this.state.data[i].weight))
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>

                <Modalize 
                    ref={this.state.ref}
                    disableScrollIfPossible={true}
                    adjustToContentHeight={true}
                    modalStyle={{backgroundColor: bgColor}}
                    onClosed={() => this.setState({
                        activeData: '',
                        weight: '',
                        inputWeight: '',
                        missingField: false,
                    })}>
                    <View style={[styles.modalContent, {paddingBottom: 150, paddingTop: 20}]}>
                        <Text style={[styles.title, {marginVertical: 20}]}>Modifier le poids du {this.state.activeData}</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Poids (en kg)"
                            placeholderTextColor={textColor}
                            keyboardType="decimal-pad"

                            // Valeur à afficher par défaut dans le champ de recherche
                            defaultValue={this.state.weight}

                            // Events
                            onChangeText = {this.onChangeWeight}/>

                        {
                            this.state.missingField &&
                                <Text style={styles.errorMessage}>Un ou plusieurs champs sont manquants</Text>
                        }

                        <TouchableOpacity
                            style={[styles.button, {marginTop: 20}]}
                            onPress={() => {
                                if(this.state.inputWeight.replace(/\s/g, '') !== "") {
                                    this.saveData()
                                }
                            }}
                            activeOpacity={.7}
                        >
                            <Text style={styles.buttonText}>Modifier</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.deleteButton, {marginTop: 20}]}
                            onPress={() => {this.deleteElement()}}
                            activeOpacity={.7}
                        >
                            <Text style={styles.buttonText}>Supprimer</Text>
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

    positive: {
        color: 'green',
        fontWeight: 'bold'
    },

    negative: {
        color: redColor,
        fontWeight: 'bold'
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
        borderColor: blueColor,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10
    },

    button: {
        width: '80%',
        padding: 10,
        backgroundColor: blueColor,
        borderRadius: 9
    },

    deleteButton: {
        width: '80%',
        padding: 10,
        borderRadius: 10,
        backgroundColor: redColor,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center'
    },
})

const darkTheme = StyleSheet.create({
    
});