import React, {Component} from 'react'
import {Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput} from 'react-native'

import * as G from '../service/global'

import { db } from '../service/Firebase';
import { collection, getDocs, addDoc, setDoc, deleteDoc, query, where, updateDoc } from 'firebase/firestore/lite';
import { Modalize } from 'react-native-modalize';
import { async } from '@firebase/util';
import { AutoDragSortableView } from 'react-native-drag-sort';
import WorkoutDayDetails from '../components/workoutDayDetails';

import EditIcon from '../assets/edit.svg'

// Largeur des items
const size = G.wSC / G.numColumns - 10;

const parentWidth = G.wSC - (G.wSC * 10/100);
const childrenWidth = G.wSC - (G.wSC * 30/100);
const parentChildrenDiff = parentWidth - childrenWidth;
const childrenHeight = 48

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const textColor = "#E0DDF3";
const blueColor = "#28C6D5";
const redColor = "#E85F5C";

export default class WorkoutMain extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            userData: typeof props.userData !== "object" ? JSON.parse(props.userData) : props.userData,
            workoutList: [],
            exerciseList: [],
            activeData: '',
            ref: React.createRef(null),
            refAddTime: React.createRef(null),
            currentWorkoutExerciseList: [],
            workoutListLoaded: false,
            exerciseListLoaded: false,
            inputRestTime: "",
            updatedRestTimeIndex: "",
            editRestTime: false
        }

        // Get all data
        this.getData();
        this.getExerciseList();
    }

    onOpenEdit = () => {
        this.setState({
            currentWorkoutExerciseList: [...this.state.workoutList.filter(a => a.date == this.state.activeData)[0].exerciseList]
        })
        this.state.ref.current?.open();
    };

    onOpen = () => {
        this.state.refAddTime.current?.open();
    };

    getData = async () => {
        const workoutListCol = collection(db, 'workoutList');

        const q = query(workoutListCol,
            where("mail", "==", this.state.userData.mail));
        
        const workoutListSnapshot = await getDocs(q);
        let workoutListList = workoutListSnapshot.docs.map(doc => doc.data());

        workoutListList.sort(function(a, b){
            var aa = a.date.split('/').reverse().join(),
                bb = b.date.split('/').reverse().join();
            return bb < aa ? -1 : (bb > aa ? 1 : 0);
        });

        this.setState({
            workoutList: workoutListList,
            activeData: workoutListList[0].date,
            currentWorkoutExerciseList: workoutListList.filter(a => a.date == workoutListList[0].date)[0].exerciseList,
            workoutListLoaded: true
        }, () => {
            if(this.state.workoutListLoaded && this.state.exerciseListLoaded) {
                this.fillDbIfNeeded();
            }
        });

    }

    getExerciseList = async() => {
        const exerciseListCol = collection(db, 'exercisesData');

        const q = query(exerciseListCol,
            where("mail", "==", this.state.userData.mail));
        
        const exerciseListSnapshot = await getDocs(q);
        const exerciseListList = exerciseListSnapshot.docs.map(doc => doc.data());

        exerciseListList.sort((a,b) => (a.exerciseName > b.exerciseName) ? 1 : ((b.exerciseName > a.exerciseName) ? -1 : 0));

        this.setState({
            exerciseList: exerciseListList,
            exerciseListLoaded: true
        }, () => {
            if(this.state.workoutListLoaded && this.state.exerciseListLoaded) {
                this.fillDbIfNeeded();
            }
        });
    }

    fillDbIfNeeded = async() => {
        let addedDates = [];
        this.state.exerciseList.forEach((el, i) => {
            if(!this.state.workoutList.some(a => a.date == el.date)) { // Check if a workout is missing
                if(!addedDates.includes(el.date)) {
                    let exerciseList = [...this.state.exerciseList.filter(obj => obj.date == el.date)];
                    exerciseList = exerciseList.map(function(obj, index) {
                        return {
                            date: obj.date,
                            exerciseName: obj.exerciseName,
                            index: index
                        }
                    });
    
                    addedDates.push(el.date);
    
                    this.addMissingWorkout(el.date, exerciseList);
                }
            } else if(this.state.workoutList &&
                !this.state.workoutList.some(
                    a => a.exerciseList.some(
                        b => b.exerciseName == el.exerciseName && b.date == el.date
                    )
            )) { // Check if an exercise is missing from a workout
                this.addMissingPerf(el.date, el);
            }
        })

        this.state.workoutList.forEach((el, i) => {
            if(!this.state.exerciseList.some(a => a.date == el.date)) { // Check if a workout has no data
                this.deleteWorkout(el.date);
            }
        })
    }

    addMissingWorkout = async(date, exerciseList) => {
        if(!this.state.workoutList.find(obj => obj.date == date)) {
            await addDoc(collection(db, "workoutList"), {
                exerciseList: exerciseList,
                date: date,
                mail: this.state.userData.mail
            }).then(() => {
                this.getData();
            });
        }
    }

    addMissingPerf = async(date, newPerf) => {
        const workoutDataCol = collection(db, 'workoutList');
        const qData = query(workoutDataCol,
            where("mail", "==", this.state.userData.mail),
            where("date", "==", date));
        const dataDataSnapshot = await getDocs(qData);
        let scope = this;
        const perfList = dataDataSnapshot.docs.map(doc => doc.data())[0].exerciseList;
        perfList.push({
            date: date,
            exerciseName: newPerf.exerciseName,
            index: perfList.length
        })
        
        dataDataSnapshot.docs.map(async function(doc) {
            await updateDoc(doc.ref,
                {
                    exerciseList: perfList,
                }
            ).then(() => {
                scope.getData();
            });
        }, scope)
    }

    deleteWorkout = async(date) => {
        const workoutDataCol = collection(db, 'workoutList');
        const qData = query(workoutDataCol,
            where("mail", "==", this.state.userData.mail),
            where("date", "==", date));
        const dataDataSnapshot = await getDocs(qData);
        dataDataSnapshot.docs.map(doc => deleteDoc(doc.ref));
    }

    saveWorkout = async() => {
        let exerciseList = [];
        this.state.currentWorkoutExerciseList.forEach((obj, i) => {
            if(i < this.state.currentWorkoutExerciseList.length - 1) {
                if(obj.restTime !== null && obj.restTime !== undefined) {
                    exerciseList.push({
                        date: obj.date,
                        exerciseName: obj.exerciseName,
                        restTime: obj.restTime,
                        index: i
                    })
                } else {
                    exerciseList.push({
                        date: obj.date,
                        exerciseName: obj.exerciseName,
                        index: i
                    })
                }
            } else {
                exerciseList.push({
                    date: obj.date,
                    exerciseName: obj.exerciseName,
                    index: i
                })
            }
        })

        const workoutDataCol = collection(db, 'workoutList');
        const qData = query(workoutDataCol,
            where("mail", "==", this.state.userData.mail),
            where("date", "==", this.state.activeData));
        const dataDataSnapshot = await getDocs(qData);
        let scope = this;
        
        dataDataSnapshot.docs.map(async function(doc) {
            await updateDoc(doc.ref,
                {
                    exerciseList: exerciseList,
                }
            ).then(() => {
                scope.state.ref.current?.close();
                scope.getData();
            });
        }, scope)
    }

    saveRestTime = async() => {
        if(this.state.inputRestTime.replace(/\s/g, '') !== "") {
            let exerciseList = [];
            if(this.state.workoutList.filter(obj => obj.date == this.state.activeData)[0].exerciseList !== undefined
                && this.state.workoutList.filter(obj => obj.date == this.state.activeData)[0].exerciseList !== null) {
                    exerciseList = this.state.workoutList.filter(obj => obj.date == this.state.activeData)[0].exerciseList;
            }
            exerciseList[this.state.updatedRestTimeIndex].restTime = this.state.inputRestTime;
    
            const workoutDataCol = collection(db, 'workoutList');
            const qData = query(workoutDataCol,
                where("mail", "==", this.state.userData.mail),
                where("date", "==", this.state.activeData));
            const dataDataSnapshot = await getDocs(qData);
            let scope = this;
            dataDataSnapshot.docs.map(async function(doc) {
                await updateDoc(doc.ref,
                    {
                        exerciseList: exerciseList,
                    }
                ).then(() => {
                    scope.state.refAddTime.current?.close();
                    scope.setState({
                        inputRestTime: '',
                        updatedRestTimeIndex: '',
                        editRestTime: false
                    });
                    scope.getData();
                });
            }, scope)
        }
    }

    onChangeActiveData = (date) => {
        this.setState({
            activeData: date,
            currentWorkoutExerciseList: [...this.state.workoutList.filter(a => a.date == this.state.activeData)[0].exerciseList]
        })
    }

    onChangeRestTime = (text) => {
        this.setState({
            inputRestTime: text
        })
    }

    setRefAddTime = (i, edit) => {
        if(this.state.workoutList.filter(obj => obj.date == this.state.activeData)[0].exerciseList !== undefined
            && this.state.workoutList.filter(obj => obj.date == this.state.activeData)[0].exerciseList !== null) {
            let exerciseList = this.state.workoutList.filter(obj => obj.date == this.state.activeData)[0].exerciseList;
            if(exerciseList[i].restTime !== null && exerciseList[i].restTime !== undefined) {
                this.setState({
                    inputRestTime: exerciseList[i].restTime
                })
            }
        }
        
        if(edit) {
            this.setState({editRestTime: true})
        }

        this.setState({updatedRestTimeIndex: i});
        this.state.refAddTime.current?.open()
    }

    renderDateFlatlist = (obj) => {
        let item = obj.item;
        return(
            <TouchableOpacity
                style={this.state.activeData == item.date ? styles.flatListItemActive : styles.flatListItem}
                activeOpacity={.7}
                onPress={() => { this.onChangeActiveData(item.date) }}>
                {this.getDayOfWeek(item.date.split('/').reverse().join('-'))}
            </TouchableOpacity>
        )
    }

    getDayOfWeek(date) {
        const fullDate = new Date(date);
        const dayOfWeek = fullDate.getDay();
        const dayOfMonth = fullDate.getDate();
        const monthOfYear = fullDate.getMonth();
        
        if(!isNaN(dayOfWeek) && !isNaN(dayOfMonth) && !isNaN(monthOfYear)) {
            return(
                <>
                    <Text style={styles.flatListDateSmall}>{['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][dayOfWeek]}</Text>
                    <Text style={styles.flatListDateBig}>{dayOfMonth}</Text>
                    <Text style={styles.flatListDateSmall}>{['Jan', 'Fev', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Dec'][monthOfYear]}</Text>
                </>
            )
        } else {
            return(
                <Text>{date}</Text>
            )
        }
      }

    renderDragDropItem = (item, index) => {
        return(
            <View style={styles.dragdropItemContainer}>
                <Text style={styles.dragdropItemText}>{index + 1}. {item.exerciseName}</Text>
            </View>
        )
    }

    render() {
        return(
            <View style={[styles.container, this.props.appTheme == "Dark" ? darkTheme.container : null]}>
                {
                    this.state.workoutList.length > 0 ?
                    <>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={this.state.workoutList.sort(function(a, b){
                                var aa = a.date.split('/').reverse().join(),
                                    bb = b.date.split('/').reverse().join();
                                return bb < aa ? -1 : (bb > aa ? 1 : 0);
                            })}
                            renderItem={item => this.renderDateFlatlist(item)}
                            keyExtractor={(item, index) => index}
                            style={{marginVertical: 20, flexGrow: 0, width: G.wSC, paddingHorizontal: 10}}
                        />
                        <WorkoutDayDetails
                            dayData={this.state.workoutList.find((obj) => obj.date == this.state.activeData)}
                            dayDataDetails={this.state.exerciseList.filter(a => a.date == this.state.activeData)}
                            userData={this.state.userData}
                            navigation={this.props.navigation}
                            setRefAddTime={this.setRefAddTime} />
                    </>
                    :
                    <View style={styles.noDataContainer}>
                        <Text style={{marginBottom: 30, color: 'white'}}>Aucune donnée...</Text>
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={.7}
                            onPress={() => {
                                this.onOpen()
                            }}>
                            <Text style={styles.buttonText}>
                                Ajouter une séance
                            </Text>
                        </TouchableOpacity>
                    </View>
                }

                <TouchableOpacity
                    style={styles.addExerciseWrapper}
                    activeOpacity={.8}
                    onPress={() => {this.onOpenEdit()}}>
                    <EditIcon style={{color: 'white'}} height={12} />
                    <Text style={styles.addExerciseText}>Editer la séance</Text>
                </TouchableOpacity>

                <Modalize 
                    ref={this.state.ref}
                    disableScrollIfPossible={true}
                    adjustToContentHeight={true}
                    modalStyle={{backgroundColor: bgColor}}
                    onClosed={() => this.setState({
                        currentWorkoutExerciseList: [...this.state.workoutList.filter(a => a.date == this.state.activeData)[0].exerciseList],
                    })}>
                    <ScrollView
                        style={[styles.modalContent, {paddingBottom: 150}]}
                        contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={styles.modalTitle}>Editer la séance du {this.state.activeData}</Text>

                        {
                            this.state.currentWorkoutExerciseList.length > 0 ?
                                <AutoDragSortableView
                                    dataSource={this.state.currentWorkoutExerciseList}
                                
                                    parentWidth={parentWidth}
                                    childrenWidth= {childrenWidth}
                                    marginChildrenBottom={10}
                                    marginChildrenTop={10}
                                    marginChildrenLeft={parentChildrenDiff / 2}
                                    marginChildrenRight={parentChildrenDiff / 2}
                                    childrenHeight={childrenHeight}

                                    delayLongPress={100}
                                    
                                    onDataChange = {(data)=>{
                                        this.setState({
                                            currentWorkoutExerciseList: data
                                        })
                                    }}
                                    keyExtractor={(item,index)=> index}
                                    renderItem={(item,index)=>{
                                        return this.renderDragDropItem(item,index)
                                    }}
                                />
                            : <Text style={{color: 'white', marginVertical: 20}}>Aucune performance enregistrée pour cette date...</Text>
                        }

                        <TouchableOpacity
                            style={[styles.button, {marginTop: 20}]}
                            onPress={this.saveWorkout}
                            activeOpacity={.7}
                        >
                            <Text style={styles.buttonText}>Editer</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Modalize>

                <Modalize 
                    ref={this.state.refAddTime}
                    disableScrollIfPossible={true}
                    adjustToContentHeight={true}
                    modalStyle={{backgroundColor: bgColor}}
                    onClosed={() => this.setState({inputRestTime: "", editRestTime: false})}>
                    <View style={[styles.modalContent, {paddingBottom: 150, alignItems: 'center', justifyContent: 'center'}]}>
                        <Text style={styles.modalTitle}>
                            {
                                this.state.editRestTime ?
                                    "Editer un temps de récupération"
                                :
                                    "Ajouter un temps de récupération"
                            }
                        </Text>

                        <TextInput
                            style={[styles.modalInput, {marginBottom: 20}]}
                            placeholder="Temps (en secondes)"
                            placeholderTextColor={textColor}
                            keyboardType="number-pad"

                            // Valeur à afficher par défaut dans le champ de recherche
                            value={this.state.inputRestTime}

                            // Events
                            onChangeText = {this.onChangeRestTime}/>

                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={.7}
                            onPress={this.saveRestTime}
                        >
                            <Text style={styles.buttonText}>
                                {
                                    this.state.editRestTime ?
                                        "Editer"
                                    :
                                        "Ajouter"
                                }
                            </Text>
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
        paddingHorizontal: '5%',
        paddingTop: 50,
    },

    noDataContainer: {
        width: '100%',
        height: '70%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },

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

    modalContent: {
        width: "100%",
        paddingVertical: 60,
        paddingHorizontal: 20,
        display: 'flex'
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

    modalTitle: {
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20
    },

    dragdropItemContainer: {
        width: G.wSC - (G.wSC * 30/100),
        padding: 15,
        borderRadius: 20,
        backgroundColor: modalColor,

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',

        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10
    },

    dragdropItemText: {
        color: 'white',
        fontWeight: 'bold'
    },

    flatListItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: modalColor,
        marginHorizontal: 10,

        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10
    },

    flatListItemActive: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: blueColor,
        marginHorizontal: 10,

        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10
    },

    flatListDateSmall: {
        textAlign: 'center',
        color: 'white',
        fontSize: 12,
    },

    flatListDateBig: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 5
    },
})

const darkTheme = StyleSheet.create({
    container: {
        backgroundColor: "#0d0f15"
    },
});