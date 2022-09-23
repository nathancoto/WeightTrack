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

export default class SelectCategory extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            userData: typeof props.userData !== "object" ? JSON.parse(props.userData) : props.userData,
            activeCategory: this.props.activeCategory,
        }
    }

    setActiveCategory = (category) => {
        this.props.setActiveCategory(category);
        this.setState({activeCategory: category});
    }

    render() {
        return(
            <ScrollView
                style={{width: '100%'}}
                showsVerticalScrollIndicator={false}>
                    <View style={styles.scrollView}>
                        <TouchableOpacity 
                            activeOpacity={.7}
                            style={[styles.card, this.state.activeCategory == "haltere" ? styles.activeCard : null]}
                            onPress={() => this.setActiveCategory('haltere')}>
                            <HaltereIcon style={{color: 'white', marginBottom: 20}} height={50} width={50} />
                            <Text style={[styles.text, styles.bold]}>Haltères</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity={.7}
                            style={[styles.card, this.state.activeCategory == "bar" ? styles.activeCard : null]}
                            onPress={() => this.setActiveCategory('bar')}>
                            <BarIcon style={{color: 'white', marginBottom: 20}} height={50} width={50} />
                            <Text style={[styles.text, styles.bold]}>Barre</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity={.7}
                            style={[styles.card, this.state.activeCategory == "kettlebell" ? styles.activeCard : null]}
                            onPress={() => this.setActiveCategory('kettlebell')}>
                            <KettlebellIcon style={{color: 'white', marginBottom: 20}} height={50} width={50} />
                            <Text style={[styles.text, styles.bold]}>Kettlebell</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity={.7}
                            style={[styles.card, this.state.activeCategory == "gymMachine" ? styles.activeCard : null]}
                            onPress={() => this.setActiveCategory('gymMachine')}>
                            <GymMachineIcon style={{color: 'white', marginBottom: 20}} height={50} width={50} />
                            <Text style={[styles.text, styles.bold]}>Machine</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity={.7}
                            style={[styles.card, this.state.activeCategory == "poulie" ? styles.activeCard : null]}
                            onPress={() => this.setActiveCategory('poulie')}>
                            <PoulieIcon style={{color: 'white', marginBottom: 20}} height={50} width={50} />
                            <Text style={[styles.text, styles.bold]}>Poulie</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity={.7}
                            style={[styles.card, this.state.activeCategory == "cardio" ? styles.activeCard : null]}
                            onPress={() => this.setActiveCategory('cardio')}>
                            <CardioIcon style={{color: 'white', marginBottom: 20}} height={50} width={50} />
                            <Text style={[styles.text, styles.bold]}>Cardio</Text>
                        </TouchableOpacity>
                    </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-around'
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
})

const darkTheme = StyleSheet.create({
    container: {
        backgroundColor: "#0d0f15"
    },
});