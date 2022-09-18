import React, {Component} from 'react'
import {View, StyleSheet, TextInput, Text, TouchableOpacity, FlatList} from 'react-native'
import { Modalize } from 'react-native-modalize'

import * as G from '../service/global'

import { db } from '../service/Firebase';
import { collection, getDocs, addDoc, setDoc, deleteDoc, query, where, updateDoc } from 'firebase/firestore/lite';
import ExerciseCard from '../components/exerciseCard';

// Largeur des items
const size = G.wSC / G.numColumns - 10;

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const textColor = "#E0DDF3";
const blueColor = "#28C6D5";
const redColor = "#E85F5C";

export default class GlobalStats extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            inputSearch: "",
            inputExerciseName: '',
            userData: typeof props.userData !== "object" ? JSON.parse(props.userData) : props.userData,
            exerciseList: [],
            ref: React.createRef(null),
            refDelete: React.createRef(null),
            refEdit: React.createRef(null),
            errorMessage: false,
            askDelete: '',
            editExercise: '',
        }

        // Get all data
        this.getData();
    }

    onOpen = () => {
        this.state.ref.current?.open();
    };

    askDeleteElement = (exerciseName) => {
        this.state.refDelete.current?.open();
        this.setState({askDelete: exerciseName, editExercise: exerciseName})
    }

    editElement = () => {
        this.state.refEdit.current?.open();
    }

    deleteElement = async() => {
        const exercisesDataCol = collection(db, 'exercisesData');
        const qData = query(exercisesDataCol,
            where("mail", "==", this.state.userData.mail),
            where("exerciseName", "==", this.state.askDelete));
        const dataDataSnapshot = await getDocs(qData);
        dataDataSnapshot.docs.map(doc => deleteDoc(doc.ref));

        const exercisesNamesCol = collection(db, 'exerciseList');
        const qName = query(exercisesNamesCol,
            where("mail", "==", this.state.userData.mail),
            where("exerciseName", "==", this.state.askDelete));
        const dataNameSnapshot = await getDocs(qName);
        dataNameSnapshot.docs.map(doc => deleteDoc(doc.ref).then(() => {
            this.state.refDelete.current?.close();
            this.setState({askDelete: ''});
    
            this.getData();
        }));
    }

    getData = async () => {
        const exercisesNamesCol = collection(db, 'exerciseList');

        const q = query(exercisesNamesCol,
            where("mail", "==", this.state.userData.mail));
        
        const exercisesNamesSnapshot = await getDocs(q);
        const exercisesNamesList = exercisesNamesSnapshot.docs.map(doc => doc.data());

        exercisesNamesList.sort((a,b) => (a.exerciseName > b.exerciseName) ? 1 : ((b.exerciseName > a.exerciseName) ? -1 : 0));

        this.setState({exerciseList: exercisesNamesList});
    }

    onChangeSearch = (text) => {
        this.setState({
            inputSearch: text
        })
    }

    onChangeExerciseName = (text) => {
        this.setState({inputExerciseName: text})
    }

    onChangeEditExercise = (text) => {
        this.setState({editExercise: text})
    }

    saveExerciseName = async(exerciseName) => {
        if(!this.state.exerciseList.find(obj => obj.exerciseName == exerciseName)) {
            await addDoc(collection(db, "exerciseList"), {
                exerciseName: exerciseName,
                mail: this.state.userData.mail
            }).then(() => {
                this.state.ref.current?.close();
                this.setState({
                    inputSearch: '',
                    inputExerciseName: '',
                    errorMessage: false
                });
                this.getData();
            });
        } else {
            this.setState({errorMessage: true});
        }

        // Update data
        // await setDoc(doc(db, "exerciseList", "key"), {
        //     exerciseName: exerciseName,
        //     mail: this.state.userData.mail
        // });
    }

    editExercise = async() => {
        if(!this.state.exerciseList.find(obj => obj.exerciseName == this.state.editExercise)) {
            const exercisesDataCol = collection(db, 'exercisesData');
            const qData = query(exercisesDataCol,
                where("mail", "==", this.state.userData.mail),
                where("exerciseName", "==", this.state.askDelete));
            const dataDataSnapshot = await getDocs(qData);
            let scope = this;
            dataDataSnapshot.docs.map(async function(doc) {
                await updateDoc(doc.ref,
                    {
                        exerciseName: scope.state.editExercise,
                    }
                );
            }, scope);

            const exercisesListCol = collection(db, 'exerciseList');
            const qList = query(exercisesListCol,
                where("mail", "==", this.state.userData.mail),
                where("exerciseName", "==", this.state.askDelete));
            const dataListSnapshot = await getDocs(qList);
            dataListSnapshot.docs.map(async function(doc) {
                await updateDoc(doc.ref,
                    {
                        exerciseName: scope.state.editExercise,
                    }
                ).then(() => {
                    this.state.ref.current?.close();
                    this.state.refEdit.current?.close();
                    this.setState({
                        inputSearch: '',
                        inputExerciseName: '',
                        askDelete: '',
                        editElement: '',
                        errorMessage: false
                    });
                    this.getData();
                });
            }, scope);
        } else {
            this.setState({errorMessage: true});
        }
    }

    filterList(list) {
        return list.filter(listItem => listItem.exerciseName.toLowerCase().includes(this.state.inputSearch.toLowerCase()));
    }

    render() {
        return(
            <View style={[styles.container, this.props.appTheme == "Dark" ? darkTheme.container : null]}>
                <View style={[styles.inputWrapper, this.props.appTheme == "Dark" ? darkTheme.inputWrapper : null]}>
                    <View style={[styles.inputContainer, this.props.appTheme == "Dark" ? darkTheme.inputContainer : null]}>
                        <TextInput
                            style={styles.input}
                            placeholder={"Rechercher"}
                            placeholderTextColor={textColor}

                            // Valeur à afficher par défaut dans le champ de recherche
                            value={this.state.inputSearch}

                            // Events
                            onChangeText = {this.onChangeSearch}/>
                    </View>
                </View>

                {
                    this.state.exerciseList.length <= 0 ?
                        <View style={styles.noDataContainer}>
                            <Text style={{marginBottom: 30, color: 'white'}}>Aucune donnée...</Text>
                            <TouchableOpacity
                                style={styles.button}
                                activeOpacity={.7}
                                onPress={() => {
                                    this.onOpen()
                                }}>
                                <Text style={styles.buttonText}>
                                    Ajouter un exercice
                                </Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={styles.scrollView}>
                            <FlatList
                                data={this.filterList(this.state.exerciseList)}
                                renderItem={({item, index}) =>
                                    <ExerciseCard
                                        {... this.props}
                                        exercise={item}
                                        key={item.exerciseName}
                                        askDeleteElement={this.askDeleteElement} />}
                                keyExtractor={(item, index) => index.toString()}
                                style={{overflow: 'visible', alignSelf: 'flex-start', height: '100%'}}
                                showsVerticalScrollIndicator={false}
                                numColumns={2}
                            />
                        </View>
                }

                <TouchableOpacity
                    style={styles.addExerciseWrapper}
                    activeOpacity={.8}
                    onPress={() => {this.onOpen()}}>
                    <Text style={styles.addExercisePlus}>+</Text>
                    <Text style={styles.addExerciseText}>Ajouter un exercice</Text>
                </TouchableOpacity>

                <Modalize 
                    ref={this.state.ref}
                    // modalHeight={400}
                    disableScrollIfPossible={true}
                    adjustToContentHeight={true}
                    modalStyle={{backgroundColor: bgColor}}
                    onClosed={() => this.setState({inputExerciseName: ""})}>
                    <View style={[styles.modalContent, {paddingBottom: 150}]}>
                        <Text style={styles.title}>Ajouter un exercice</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Nom de l'exercice"
                            placeholderTextColor={textColor}

                            // Valeur à afficher par défaut dans le champ de recherche
                            value={this.state.inputExerciseName}

                            // Events
                            onChangeText = {this.onChangeExerciseName}/>

                        {this.state.errorMessage && <Text style={styles.errorMessage}>Cet exercice existe déjà</Text>}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                if(this.state.inputExerciseName.replace(/\s/g, '') !== "") {
                                    this.saveExerciseName(this.state.inputExerciseName)
                                }
                            }}
                            activeOpacity={.7}
                        >
                            <Text style={styles.buttonText}>Ajouter</Text>
                        </TouchableOpacity>
                    </View>
                </Modalize>

                <Modalize 
                    ref={this.state.refDelete}
                    // modalHeight={300}
                    adjustToContentHeight={true}
                    disableScrollIfPossible={true}
                    modalStyle={{backgroundColor: bgColor}}
                    onClose={() => this.setState({askDelete: ''})}>
                    <View style={[styles.modalContent, {paddingBottom: 150}]}>
                        <TouchableOpacity
                            style={[styles.button, {marginBottom: 40}]}
                            onPress={() => {
                                this.editElement();
                            }}
                            activeOpacity={.7}
                        >
                            <Text style={styles.buttonText}>Editer l'exercice</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => {
                                this.deleteElement();
                            }}
                            activeOpacity={.7}
                        >
                            <Text style={styles.deleteButtonText}>Supprimer l'exercice&nbsp;
                                <Text style={{fontWeight: 'bold'}}>{this.state.askDelete}</Text>
                                &nbsp;et toutes les données associées ?</Text>
                        </TouchableOpacity>
                    </View>
                </Modalize>

                <Modalize 
                    ref={this.state.refEdit}
                    // modalHeight={300}
                    adjustToContentHeight={true}
                    disableScrollIfPossible={true}
                    modalStyle={{backgroundColor: bgColor}}
                    onClose={() => {
                        this.setState({askDelete: ''});
                        this.state.refDelete.current?.close();
                    }}>
                    <View style={[styles.modalContent, {paddingBottom: 150}]}>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Nom de l'exercice"
                            placeholderTextColor={textColor}

                            // Valeur à afficher par défaut dans le champ de recherche
                            value={this.state.editExercise}

                            // Events
                            onChangeText = {this.onChangeEditExercise}/>

                        {this.state.errorMessage && <Text style={styles.errorMessage}>Cet exercice existe déjà</Text>}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                if(this.state.editExercise.replace(/\s/g, '') !== "") {
                                    this.editExercise()
                                }
                            }}
                            activeOpacity={.7}
                        >
                            <Text style={styles.buttonText}>Editer</Text>
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
        paddingHorizontal: '5%'
    },

    inputWrapper: {
        width: '100%',
        backgroundColor: bgColor,
        height: 103,
        marginBottom: 23,
        paddingTop: 50,
        paddingHorizontal: 0,
        zIndex: 9
    },

    inputContainer: {
        width: 'auto',
        height: 53,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: modalColor,

        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10
    },

    input: {
        width: '100%',
        height: '100%',
        fontSize: 14,
        color: 'white'
    },

    title: {
        fontWeight: 'bold',
        color: 'white'
    },

    modalInput: {
        width: '80%',
        color: 'white',
        fontSize: 14,
        padding: 10,
        borderColor: blueColor,
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
        fontWeight: 'bold'
    },

    deleteButtonText: {
        color: 'white',
        // fontWeight: 'bold',
        textAlign: 'center'
    },

    noDataContainer: {
        width: '100%',
        height: '70%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    modalContent: {
        width: "100%",
        paddingVertical: 60,
        paddingHorizontal: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

    addExerciseWrapper: {
        backgroundColor: blueColor,
        height: 50,
        width: 'auto',
        paddingHorizontal: 20,
        borderRadius: 25,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        position: 'absolute',
        bottom: 110,
        right: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10
    },

    addExercisePlus: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10
    },

    addExerciseText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold'
    },

    exerciseList: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        paddingBottom: 500
    },

    scrollView: {
        height: '65%',
        overflow: 'visible'
    },

    errorMessage: {
        marginBottom: 10,
        color: 'red'
    }
})

const darkTheme = StyleSheet.create({
    container: {
        backgroundColor: "#0d0f15"
    },

    inputWrapper: {
        backgroundColor: '#0d0f15',
    },

    inputContainer: {
        backgroundColor: '#0d0f15',
        shadowColor: "#fff",
    },

    input: {
        color: 'white',
    },
});