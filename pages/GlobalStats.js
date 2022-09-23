import React, {Component} from 'react'
import {View, StyleSheet, TextInput, Text, TouchableOpacity, FlatList, ScrollView} from 'react-native'
import { Modalize } from 'react-native-modalize'

import * as G from '../service/global'

import { db } from '../service/Firebase';
import { collection, getDocs, addDoc, setDoc, deleteDoc, query, where, updateDoc } from 'firebase/firestore/lite';

import ExerciseCard from '../components/exerciseCard';

import FilterIcon from '../assets/filter.svg';
import Checkbox from 'expo-checkbox';

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
            refDelete: React.createRef(null),
            refFilter: React.createRef(null),
            errorMessage: false,
            askDelete: '',
            editExercise: '',
            filterMuscles: []
        }

        // Get all data
        this.getData();
    }

    onOpen = () => {
        this.props.navigation.navigate('AddExercise', {exerciseList: this.state.exerciseList, getData: this.getData});
    };

    onOpenFilter = () => {
        this.state.refFilter.current?.open();
    }

    askDeleteElement = (exerciseName) => {
        this.state.refDelete.current?.open();
        this.setState({askDelete: exerciseName, editExercise: exerciseName})
    }

    editElement = () => {
        this.props.navigation.navigate('AddExercise', {exerciseList: this.state.exerciseList, getData: this.getData, editExercise: this.state.askDelete});
        // this.state.refEdit.current?.open();
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
        if(this.state.filterMuscles.length > 0 && this.state.filterMuscles.some(e => e.checked == true)) {
            let activeMusclesFilter = [...this.state.filterMuscles];
            activeMusclesFilter = activeMusclesFilter.filter(el => el.checked == true);
            activeMusclesFilter = activeMusclesFilter.map(el => el.muscle);
            return list.filter(listItem => listItem.exerciseName.toLowerCase().includes(this.state.inputSearch.toLowerCase())
                && listItem.muscles !== null && listItem.muscles !== undefined
                && activeMusclesFilter.every(el => listItem.muscles.includes(el)));
        } else {
            return list.filter(listItem => listItem.exerciseName.toLowerCase().includes(this.state.inputSearch.toLowerCase()));
        }
    }

    setFilters = (i) => {
        let filterMuscles = [...this.state.filterMuscles];
        if(filterMuscles.some(e => e.muscle == i)) {
            let newOptions = {...filterMuscles.find(el => el.muscle == i)};
            newOptions.checked = !newOptions.checked;

            let muscleIndex = filterMuscles.indexOf(filterMuscles.find(el => el.muscle == i));
            filterMuscles.splice(muscleIndex, 1);
            filterMuscles.push(newOptions);
        } else {
            filterMuscles.push({
                muscle: i,
                checked: true
            });
        }
        this.setState({filterMuscles: filterMuscles});
    }

    render() {
        let muscleList = [];
        this.state.exerciseList.forEach((el) => {
            if(el.muscles) {
                el.muscles.map(muscle => {
                    if(muscleList.indexOf(muscle) === -1) {
                        muscleList.push(muscle);
                    }
                })
            }
        })
        muscleList.sort();

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
                    <TouchableOpacity
                        style={styles.filterContainer}
                        activeOpacity={.7}
                        onPress={() => this.onOpenFilter()}>
                        <FilterIcon style={{color: 'white'}} height={20} />
                    </TouchableOpacity>
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
                    ref={this.state.refFilter}
                    adjustToContentHeight={true}
                    disableScrollIfPossible={true}
                    modalStyle={{backgroundColor: bgColor}}
                    onClose={() => {
                        this.setState({askDelete: ''});
                        this.state.refDelete.current?.close();
                    }}>
                    <View style={[styles.modalContent, {paddingVertical: 0}]}>
                        <ScrollView
                            contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
                            style={{paddingTop: 60, paddingBottom: 150}}>
                            <Text style={[styles.title, {marginBottom: 10}]}>Sélectionnez les muscles utilisés</Text>

                            {
                                muscleList.map((el, i) => {
                                    return(
                                        <TouchableOpacity
                                            style={styles.filterItem}
                                            activeOpacity={1}
                                            key={i}
                                            onPress={() => this.setFilters(el)}
                                        >
                                            <Checkbox
                                                style={styles.checkbox}
                                                value={this.state.filterMuscles.find(a => a.muscle == el) ? this.state.filterMuscles.find(a => a.muscle == el).checked : false}
                                                onValueChange={() => this.setFilters(el)}
                                                color={this.state.filterMuscles[el] ? blueColor : blueColor}
                                            />
                                            <Text style={styles.filterText}>{el}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }

                            <TouchableOpacity
                                style={[styles.button, {marginTop: 20}]}
                                onPress={() => {
                                    this.state.refFilter.current?.close();
                                }}
                                activeOpacity={.7}
                            >
                                <Text style={styles.buttonText}>Filtrer</Text>
                            </TouchableOpacity>
                        </ScrollView>
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
        height: 123,
        marginBottom: 23,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 0,
        zIndex: 9,

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    inputContainer: {
        width: (G.wSC - (G.wSC * 10/100)) - 73,
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

    filterContainer: {
        width: 53,
        height: 53,
        padding: 10,
        marginLeft: 20,
        borderRadius: 10,
        backgroundColor: modalColor,

        display: 'flex',
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

    filterItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        minWidth: '60%'
    },

    filterText: {
        color: 'white'
    },

    checkbox: {
        marginRight: 10
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

        shadowColor: "#fff",
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
        color: redColor
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