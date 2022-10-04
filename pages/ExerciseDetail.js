import React, {Component} from 'react'
import {Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView} from 'react-native'
import { Modalize } from 'react-native-modalize'

import { VictoryChart, VictoryAxis, VictoryArea } from "victory-native";

import GoBack from '../components/goBack';

import * as G from '../service/global'

import { db } from '../service/Firebase';
import { collection, getDocs, addDoc, query, where, deleteDoc, setDoc } from 'firebase/firestore/lite';
import ExerciseDayDetails from '../components/exerciseDayDetails';
import { Defs, LinearGradient, Stop } from 'react-native-svg';

import TimeIcon from '../assets/time.svg';
import EditIcon from '../assets/edit.svg';
import ExpandIcon from '../assets/expand.svg';
import DeleteIcon from '../assets/delete.svg';
import PlusIcon from '../assets/plus.svg';
import AddPerfMachine from '../components/addPerfMachine';
import AddPerfNormal from '../components/addPerfNormal';
import AddPerfBar from '../components/addPerfBar';
import AddPerfCardio from '../components/addPerfCardio';

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

const _ = require('lodash');

export default class ExerciseDetail extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            ref: React.createRef(null),
            refDelete: React.createRef(null),
            exercise: props.route.params.exercise,
            data: [],
            nbSeries: '',
            comments: '',
            repsWeights: [],
            date: formattedToday,
            chartData: [],
            activeData: '',
            dayData: '',
            timeInput: [],
            fill: false,
            missingField: false,
            existingDate: false,
            wrongFormat: false
        }

        this.getData()
    }

    onOpen = () => {
        this.setState({
            missingField: false,
            existingDate: false,
            wrongFormat: false
        })
        
        this.state.ref.current?.open();
    }

    askDelete = () => {
        this.state.refDelete.current?.open();
    }

    onChangeNbSeries = (text) => {
        this.setState({
            nbSeries: text.replace(/[^0-9]/g, ''),
        });
    }

    onChangeComments = (text) => {
        this.setState({
            comments: text,
        });
    }

    onChangeDate = (text) => {
        this.setState({
            date: text
        });
    }

    onChangeNbReps = (index, text) => {
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
    }

    onChangeWeights = (index, text) => {
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
    }

    onChangeRecupTime = (index, text) => {
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
    }

    getData = async () => {
        const exercisesDataCol = collection(db, 'exercisesData');
        
        const q = query(exercisesDataCol,
            where("mail", "==", this.state.exercise.mail),
            where("exerciseName", "==", this.state.exercise.exerciseName));

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
                        weight: parseInt(Math.max(...dataList[0].repsWeights.map(o => o.weight)))
                    },
                    {
                        date: 2,
                        weight: parseInt(Math.max(...dataList[0].repsWeights.map(o => o.weight)))
                    }
                ]
            } else {
                chartData = dataList.map(a => ({
                    date: a.date,
                    weight: parseInt(Math.max(...a.repsWeights.map(o => o.weight)))
                }))
            }

            let dayData = dataList.filter(obj => obj.date == dataList[dataList.length - 1].date);

            this.setState({
                chartData: chartData,
                activeData: dataList[dataList.length - 1].date,
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
            if(this.state.fill) { // Update perf
                const exercisesDataCol = collection(db, 'exercisesData');
                const qData = query(exercisesDataCol,
                    where("mail", "==", this.state.exercise.mail),
                    where("exerciseName", "==", this.state.exercise.exerciseName),
                    where("date", "==", this.state.activeData));
                const dataDataSnapshot = await getDocs(qData);
                let scope = this;
                dataDataSnapshot.docs.map(async function(doc) {
                    await setDoc(doc.ref,
                        {
                            exerciseName: scope.state.exercise.exerciseName,
                            mail: scope.state.exercise.mail,
                            nbSeries: scope.state.nbSeries,
                            repsWeights: scope.state.repsWeights,
                            date: scope.state.date,
                            comments: scope.state.comments
                        }
                    ).then(() => {
                        scope.state.ref.current?.close();
                        scope.setState({
                            repsWeights: [],
                            fill: false,
                            nbSeries: '',
                            comments: '',
                            missingField: false,
                            existingDate: false,
                            wrongFormat: false
                        });
                        scope.getData();
                    });
                }, scope)
            } else { // Add new perf
                await addDoc(collection(db, "exercisesData"), {
                    exerciseName: this.state.exercise.exerciseName,
                    mail: this.state.exercise.mail,
                    nbSeries: this.state.nbSeries,
                    repsWeights: this.state.repsWeights,
                    date: this.state.date,
                    comments: this.state.comments
                }).then(() => {
                    this.state.ref.current?.close();
                    this.setState({
                        repsWeights: [],
                        fill: false,
                        nbSeries: '',
                        comments: '',
                        missingField: false,
                        existingDate: false,
                        wrongFormat: false
                    });
                    this.getData();
                });
            }
        }
    }

    deleteElement = async() => {
        const exercisesDataCol = collection(db, 'exercisesData');
        const qData = query(exercisesDataCol,
            where("mail", "==", this.state.exercise.mail),
            where("exerciseName", "==", this.state.exercise.exerciseName),
            where("date", "==", this.state.activeData));
        const dataDataSnapshot = await getDocs(qData);
        dataDataSnapshot.docs.map(doc => deleteDoc(doc.ref).then(() => {
            this.state.refDelete.current?.close();
            this.getData();
        }));
    }

    renderDateFlatlist = (item) => {
        return(
            <TouchableOpacity
                style={[styles.flatListItemContainer, this.state.activeData == item.item.date ? styles.flatListItemContainerActive : null]}
                activeOpacity={.8}
                onPress={() => this.changeActiveData(item.item)}>
                <Text style={[styles.flatListItem, this.state.activeData == item.item.date ? styles.flatListItemActive : null]}>{item.item.date}</Text>
            </TouchableOpacity>
        )
    }

    changeActiveData(item) {
        let dayData = this.state.data.filter(obj => obj.date == item.date);
        this.setState({
            activeData: item.date,
            dayData: dayData.length > 0 ? dayData[0] : undefined
        })
    }

    fillEditData() {
        let dayData = _.cloneDeep(this.state.dayData);
        this.setState({
            fill: true,
            nbSeries: dayData.nbSeries,
            repsWeights: dayData.repsWeights,
            date: dayData.date,
            comments: dayData.comments
        });
        this.onOpen();
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
                <GoBack navigation={this.props.navigation} />
                <Text style={styles.title}>{this.state.exercise.exerciseName}</Text>
                <TouchableOpacity
                    style={styles.addPerformanceWrapperTop}
                    activeOpacity={.8}
                    onPress={() => {this.onOpen()}}>
                    <PlusIcon style={{color: 'white'}} height={12} />
                </TouchableOpacity>

                {
                    this.state.data.length <= 0 ?
                    <View style={styles.noDataContainer}>
                        <Text style={{marginBottom: 30, color: 'white'}}>Aucune donnée...</Text>
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={.7}
                            onPress={() => {
                                this.onOpen()
                            }}>
                            <Text style={styles.buttonText}>
                                Ajouter des performances
                            </Text>
                        </TouchableOpacity>
                    </View>
                    :
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
                        : <Text style={{color: 'white'}}>Oops</Text>
                }

                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={this.state.data.sort(function(a, b){
                        var aa = a.date.split('/').reverse().join(),
                            bb = b.date.split('/').reverse().join();
                        return bb < aa ? -1 : (bb > aa ? 1 : 0);
                    })}
                    renderItem={item => this.renderDateFlatlist(item)}
                    keyExtractor={(item, index) => index}
                    style={{marginVertical: 20, flexGrow: 0, width: G.wSC, paddingHorizontal: 5/100 * G.wSC}}
                />

                <ScrollView style={{width: '100%'}} showsVerticalScrollIndicator={false}>
                    <ExerciseDayDetails
                        dayData={this.state.dayData}
                        userData={this.state.exercise}
                    />

                    <View style={[styles.row, {marginTop: 30}]}>
                        <TouchableOpacity
                            style={styles.smallButton}
                            activeOpacity={.8}
                            onPress={() => {this.props.navigation.navigate('ExerciseDayDetails',
                                {
                                    dayData: this.state.dayData,
                                    userData: this.state.exercise
                                }
                            )}}>
                            <ExpandIcon height={20} style={{color: 'white', marginRight: 10}} />
                            <Text style={styles.smallButtonText}>Détails</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.smallButton}
                            activeOpacity={.8}
                            onPress={() => {this.fillEditData()}}>
                            <EditIcon height={12} style={{color: 'white'}} />
                            <Text style={styles.smallButtonText}>Editer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.smallButton, {backgroundColor: redColor}]}
                            activeOpacity={.8}
                            onPress={() => {this.askDelete()}}>
                            <DeleteIcon height={12} style={{color: 'white'}} />
                            <Text style={styles.smallButtonText}>Supprimer</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <Modalize 
                    ref={this.state.ref}
                    disableScrollIfPossible={true}
                    onClosed={() => {
                        this.setState({
                            repsWeights: [],
                            fill: false,
                            nbSeries: '',
                            date: formattedToday,
                            comments: ''
                        });
                    }}
                    modalStyle={{backgroundColor: bgColor}}
                >
                    {
                        this.props.route.params.exercise.category == "gymMachine" ?
                            <AddPerfMachine
                                exercise={this.props.route.params.exercise}
                                onChangeDate={this.onChangeDate}
                                onChangeNbSeries={this.onChangeNbSeries}
                                onChangeNbReps={this.onChangeNbReps}
                                onChangeWeights={this.onChangeWeights}
                                onChangeRecupTime={this.onChangeRecupTime}
                                onChangeComments={this.onChangeComments}
                                saveData={this.saveData}

                                fill={this.state.fill}
                                nbSeries={this.state.nbSeries}
                                repsWeights={this.state.repsWeights}
                                date={this.state.date}
                                comments={this.state.comments}
                                dayData={this.state.dayData}
                            />
                        : this.props.route.params.exercise.category == "haltere" ?
                            <AddPerfNormal
                                exercise={this.props.route.params.exercise}
                                onChangeDate={this.onChangeDate}
                                onChangeNbSeries={this.onChangeNbSeries}
                                onChangeNbReps={this.onChangeNbReps}
                                onChangeWeights={this.onChangeWeights}
                                onChangeRecupTime={this.onChangeRecupTime}
                                onChangeComments={this.onChangeComments}
                                saveData={this.saveData}

                                fill={this.state.fill}
                                nbSeries={this.state.nbSeries}
                                repsWeights={this.state.repsWeights}
                                date={this.state.date}
                                comments={this.state.comments}
                                dayData={this.state.dayData}
                            />
                        : this.props.route.params.exercise.category == "bar" ?
                            <AddPerfBar
                                exercise={this.props.route.params.exercise}
                                onChangeDate={this.onChangeDate}
                                onChangeNbSeries={this.onChangeNbSeries}
                                onChangeNbReps={this.onChangeNbReps}
                                onChangeWeights={this.onChangeWeights}
                                onChangeRecupTime={this.onChangeRecupTime}
                                onChangeComments={this.onChangeComments}
                                saveData={this.saveData}

                                fill={this.state.fill}
                                nbSeries={this.state.nbSeries}
                                repsWeights={this.state.repsWeights}
                                date={this.state.date}
                                comments={this.state.comments}
                                dayData={this.state.dayData}
                            />
                        : this.props.route.params.exercise.category == "kettlebell" ?
                            <AddPerfNormal
                                exercise={this.props.route.params.exercise}
                                onChangeDate={this.onChangeDate}
                                onChangeNbSeries={this.onChangeNbSeries}
                                onChangeNbReps={this.onChangeNbReps}
                                onChangeWeights={this.onChangeWeights}
                                onChangeRecupTime={this.onChangeRecupTime}
                                onChangeComments={this.onChangeComments}
                                saveData={this.saveData}

                                fill={this.state.fill}
                                nbSeries={this.state.nbSeries}
                                repsWeights={this.state.repsWeights}
                                date={this.state.date}
                                comments={this.state.comments}
                                dayData={this.state.dayData}
                            />
                        : this.props.route.params.exercise.category == "poulie" ?
                            <AddPerfNormal
                                exercise={this.props.route.params.exercise}
                                onChangeDate={this.onChangeDate}
                                onChangeNbSeries={this.onChangeNbSeries}
                                onChangeNbReps={this.onChangeNbReps}
                                onChangeWeights={this.onChangeWeights}
                                onChangeRecupTime={this.onChangeRecupTime}
                                onChangeComments={this.onChangeComments}
                                saveData={this.saveData}

                                fill={this.state.fill}
                                nbSeries={this.state.nbSeries}
                                repsWeights={this.state.repsWeights}
                                date={this.state.date}
                                comments={this.state.comments}
                                dayData={this.state.dayData}
                            />
                        : this.props.route.params.exercise.category == "cardio" ?
                            <AddPerfCardio
                                exercise={this.props.route.params.exercise}
                                onChangeDate={this.onChangeDate}
                                onChangeNbSeries={this.onChangeNbSeries}
                                onChangeNbReps={this.onChangeNbReps}
                                onChangeWeights={this.onChangeWeights}
                                onChangeRecupTime={this.onChangeRecupTime}
                                onChangeComments={this.onChangeComments}
                                saveData={this.saveData}

                                fill={this.state.fill}
                                nbSeries={this.state.nbSeries}
                                repsWeights={this.state.repsWeights}
                                date={this.state.date}
                                comments={this.state.comments}
                                dayData={this.state.dayData}
                            />
                        :
                            <AddPerfNormal
                                exercise={this.props.route.params.exercise}
                                onChangeDate={this.onChangeDate}
                                onChangeNbSeries={this.onChangeNbSeries}
                                onChangeNbReps={this.onChangeNbReps}
                                onChangeWeights={this.onChangeWeights}
                                onChangeRecupTime={this.onChangeRecupTime}
                                onChangeComments={this.onChangeComments}
                                saveData={this.saveData}

                                fill={this.state.fill}
                                nbSeries={this.state.nbSeries}
                                repsWeights={this.state.repsWeights}
                                date={this.state.date}
                                comments={this.state.comments}
                                dayData={this.state.dayData}
                            />
                    }
                </Modalize>

                <Modalize 
                    ref={this.state.refDelete}
                    modalHeight={200}
                    disableScrollIfPossible={true}
                    modalStyle={{backgroundColor: bgColor}}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => {
                                this.deleteElement();
                            }}
                            activeOpacity={.7}
                        >
                            <Text style={styles.deleteButtonText}>Supprimer les données du&nbsp;
                                <Text style={{fontWeight: 'bold'}}>{this.state.activeData}</Text>
                                &nbsp;?
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
        paddingTop: 50,
        paddingHorizontal: '5%'
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

    noDataContainer: {
        width: '100%',
        height: '90%',
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

    addPerformanceWrapper: {
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
        bottom: 50,
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

    addPerformanceWrapperTop: {
        backgroundColor: blueColor,
        height: 35,
        width: 35,
        borderRadius: 25,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        position: 'absolute',
        top: 55,
        right: 30,

        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10
    },

    addPerformancePlus: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10
    },

    addPerformanceText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold'
    },

    title: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 10,
        color: 'white',
        textAlign: 'center'
    },

    flatListItemContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },

    flatListItemContainerActive: {
        backgroundColor: blueColor,
    },

    flatListItem: {
        color: blueColor,
        fontWeight: 'bold',
        fontSize: 12
    },

    flatListItemActive: {
        color: 'white',
    },

    smallButton: {
        width: '30%',
        borderRadius: 10,
        backgroundColor: blueColor,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
    },

    smallButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12
    },

    errorMessage: {
        color: redColor
    },

    deleteButton: {
        width: '80%',
        padding: 10,
        borderRadius: 10,
        backgroundColor: redColor,
        alignItems: 'center',
        justifyContent: 'center',
    },

    deleteButtonText: {
        color: 'white',
        textAlign: 'center'
    },
})

const darkTheme = StyleSheet.create({
    container: {
        backgroundColor: "#0d0f15"
    },
});