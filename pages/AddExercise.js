import React, {Component} from 'react'
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native'

import * as G from '../service/global'
import { db } from '../service/Firebase';
import { collection, getDocs, addDoc, query, where, updateDoc } from 'firebase/firestore/lite';

import GoBack from '../components/goBack';
import SelectCategory from '../components/selectCategory';
import SelectMuscles from '../components/selectMuscles';
import SelectName from '../components/selectName';

import NextIcon from '../assets/next.svg'
import PreviousIcon from '../assets/previous.svg'

// Largeur des items
const size = (G.wSC - (G.wSC * 30/100)) / G.numColumns;

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const textColor = "#E0DDF3";
const blueColor = "#28C6D5";
const redColor = "#E85F5C";

export default class AddExercise extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            userData: typeof props.userData !== "object" ? JSON.parse(props.userData) : props.userData,
            activeCategory: this.props.route.params.editExercise ?
                this.props.route.params.exerciseList.find(el => el.exerciseName == this.props.route.params.editExercise).category
                : '',
            activeMuscles: this.props.route.params.editExercise ?
                this.props.route.params.exerciseList.find(el => el.exerciseName == this.props.route.params.editExercise).muscles !== undefined ?
                    this.props.route.params.exerciseList.find(el => el.exerciseName == this.props.route.params.editExercise).muscles
                    : []
                : [],
            activeName: this.props.route.params.editExercise,
            activePage: 1,
            errorMessageMissing: false,
            errorMessageExisting: false,
            exerciseList: this.props.route.params.exerciseList,
            editExercise: this.props.route.params.editExercise
        }
    }

    setActiveCategory = (category) => {
        this.setState({activeCategory: category})
    }

    setActiveMuscles = (muscles) => {
        this.setState({activeMuscles: muscles})
    }

    setActiveName = (name) => {
        this.setState({activeName: name})
    }

    setNextPage = () => {
        if(this.state.activePage < 3) {
            this.setState({activePage: this.state.activePage + 1})
        }
    }

    setPreviousPage = () => {
        if(this.state.activePage > 1) {
            this.setState({activePage: this.state.activePage - 1})
        }
    }

    saveExercise = async() => {
        if(this.state.activeCategory !== null && this.state.activeCategory !== undefined && this.state.activeCategory !== ""
            && this.state.activeName !== null && this.state.activeName !== undefined && this.state.activeName !== "") {
            if(this.state.editExercise) {
                const exercisesDataCol = collection(db, 'exercisesData');
                const qData = query(exercisesDataCol,
                    where("mail", "==", this.state.userData.mail),
                    where("exerciseName", "==", this.state.editExercise));
                const dataDataSnapshot = await getDocs(qData);
                let scope = this;
                dataDataSnapshot.docs.map(async function(doc) {
                    await updateDoc(doc.ref,
                        {
                            exerciseName: scope.state.activeName,
                        }
                    );
                }, scope);
    
                const exercisesListCol = collection(db, 'exerciseList');
                const qList = query(exercisesListCol,
                    where("mail", "==", this.state.userData.mail),
                    where("exerciseName", "==", this.state.editExercise));
                const dataListSnapshot = await getDocs(qList);
                dataListSnapshot.docs.map(async function(doc) {
                    await updateDoc(doc.ref,
                        {
                            exerciseName: scope.state.activeName,
                            category: scope.state.activeCategory,
                            muscles: scope.state.activeMuscles
                        }
                    ).then(() => {
                        this.setState({
                            activeCategory: '',
                            activeMuscles: [],
                            activeName: '',
                            errorMessageMissing: false,
                            errorMessageExisting: false,
                            editExercise: undefined
                        });
                        this.props.route.params.getData();
                        this.props.navigation.goBack();
                    });
                }, scope);
            } else {
                if(!this.state.exerciseList.find(obj => obj.exerciseName.replace(/\s/g, '') == this.state.activeName.replace(/\s/g, ''))) {
                    await addDoc(collection(db, "exerciseList"), {
                        exerciseName: this.state.activeName,
                        category: this.state.activeCategory,
                        muscles: this.state.activeMuscles,
                        mail: this.state.userData.mail
                    }).then(() => {
                        this.setState({
                            activeCategory: '',
                            activeMuscles: [],
                            activeName: '',
                            errorMessageMissing: false,
                            errorMessageExisting: false
                        });
                        this.props.route.params.getData();
                        this.props.navigation.goBack();
                    });
                } else {
                    this.setState({errorMessageExisting: true});
                }
            }
        } else {
            this.setState({errorMessageMissing: true});
        }
    }

    render() {
        return(
            <View style={[styles.container, this.props.appTheme == "Dark" ? darkTheme.container : null]}>
                <GoBack navigation={this.props.navigation} />

                <Text style={styles.title}>
                    {
                        this.state.editExercise ?
                            "Editer un exercice"
                            : "Ajouter un exercice"
                    }
                </Text>

                {
                    this.state.activePage == 1 ?
                        <SelectCategory userData={this.state.userData} activeCategory={this.state.activeCategory} setActiveCategory={this.setActiveCategory} />
                    : this.state.activePage == 2 ?
                        <SelectMuscles userData={this.state.userData} activeMuscles={this.state.activeMuscles} setActiveMuscles={this.setActiveMuscles} />
                    : this.state.activePage == 3 ?
                        <SelectName userData={this.state.userData} activeName={this.state.activeName} setActiveName={this.setActiveName} saveExercise={this.saveExercise} errorMessageMissing={this.state.errorMessageMissing} errorMessageExisting={this.state.errorMessageExisting} editExercise={this.state.editExercise} />
                    : null
                }


                <View style={styles.bottomView}>
                    <View style={{width: '33%'}}>
                        {
                            this.state.activePage > 1 &&
                                <TouchableOpacity
                                    style={styles.nextButton}
                                    activeOpacity={.7}
                                    onPress={() => this.setPreviousPage()}>
                                    <PreviousIcon style={{color: 'white'}} height={16} width={16} />
                                    <Text style={[styles.text, styles.bold, {fontSize: 12}]}> Précédent</Text>
                                </TouchableOpacity>
                        }
                    </View>
                    <View style={{width: '33%'}}>
                        <Text style={[styles.text, styles.bold, {textAlign: 'center'}]}>{this.state.activePage}/3</Text>
                    </View>
                    <View style={{width: '33%'}}>
                        {
                            this.state.activePage < 3 &&
                                <TouchableOpacity
                                    style={styles.nextButton}
                                    activeOpacity={.7}
                                    onPress={() => this.setNextPage()}>
                                    <Text style={[styles.text, styles.bold, {fontSize: 12}]}>Suivant </Text>
                                    <NextIcon style={{color: 'white'}} height={16} width={16} />
                                </TouchableOpacity>
                        }
                    </View>
                </View>
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
        paddingHorizontal: '5%',
        paddingTop: 50,
    },

    scrollView: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-around'
    },

    title: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 10,
        marginBottom: 40,
        color: 'white'
    },

    text: {
        color: 'white'
    },

    bold: {
        fontWeight: 'bold'
    },

    card: {
        backgroundColor: modalColor,
        height: size,
        width: size,
        borderRadius: 20,
        marginBottom: G.wSC * 10/100,

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

    activeCard: {
        backgroundColor: blueColor
    },

    bottomView: {
        width: '90%',
        position: 'absolute',
        bottom: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    nextButton: {
        alignSelf: 'flex-end',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: blueColor,
        borderRadius: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const darkTheme = StyleSheet.create({
    container: {
        backgroundColor: "#0d0f15"
    },
});