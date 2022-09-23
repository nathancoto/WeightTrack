import React, {Component} from 'react'
import {Text, View, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput} from 'react-native'
import Svg, { Path, G } from 'react-native-svg';

import * as Global from '../service/global'

// Echelle des items
const scale = (Global.wSC / 1080) * 1.2;

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const textColor = "#E0DDF3";
const blueColor = "#28C6D5";
const redColor = "#E85F5C";

export default class SelectMuscles extends Component {
    constructor(props) {
        super(props);

        // Etats
        this.state = {
            userData: typeof props.userData !== "object" ? JSON.parse(props.userData) : props.userData,
            activeMuscles: this.props.activeMuscles,
            activeSide: 'front'
        }
    }

    setActiveMuscles = (muscles) => {
        let activeMuscles = [...this.state.activeMuscles];
        if(activeMuscles.indexOf(muscles) === -1) {
            activeMuscles.push(muscles);
        } else {
            activeMuscles = activeMuscles.filter(e => e !== muscles);
        }
        this.props.setActiveMuscles(activeMuscles);
        this.setState({activeMuscles: activeMuscles});
    }

    setActiveSide = (side) => {
        this.setState({activeSide: side})
    }

    render() {
        return(
            <ScrollView
                style={{width: '100%', display: 'flex'}}
                contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
                showsVerticalScrollIndicator={false}>

                {
                    this.state.activeSide == "front" ?
                        <Svg
                            width={459.1 * scale}
                            height={1080 * scale}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <Path
                                d="M229.9,616.5c-1.6,18.4,16.6,116.4,23.1,154.6c3.1,18.1,11.5,47.6,8.5,63.3 c-4.3,21.8-5.6,50.1-3.2,66.6c1.5,10,6.2,56.1-0.5,73c-3.5,8.8-10,54.2-10,54.2c-16.9,42.7-7.4,40.6-7.4,40.6 c5.2,6.4,14.2,0.5,14.2,0.5c6.8,4.4,11.6-1,11.6-1c5.9,4.9,12.7-0.6,12.7-0.6c7.4,3.8,14.2-3.2,14.2-3.2c4.2,2.1,5.3-0.6,5.3-0.6 c12.7-0.8-7.1-41.4-7.1-41.4c-4.7-36.5,4.7-56.8,4.7-56.8c30.9-91.6,32.5-116,20.1-150.5c-3.5-10-4.4-13.9-2.8-18.2 c3.7-10,1-50.2,5.5-66.1c8.7-30.8,17.3-108.8,21.8-145.2c6-49-21.3-114.8-21.3-114.8c-6-26.8,2.8-122.1,2.8-122.1 c12.3,19.1,11.8,52.7,11.8,52.7c-1.9,35.3,28.5,89.3,28.5,89.3c14.6,22.3,20.2,43.5,20.2,45c0,6.4-1.4,22-1.4,22l0.6,13.5 c0.3,3.4,2.2,15.3,1.9,21.1c-2.3,35.3,3.3,28.7,3.3,28.7c4.7,0,9.9-28.4,9.9-28.4c0,7.3-1.8,29.3,2.2,37.5c4.7,9.9,8.2-1.7,8.3-4 c1.3-45,4-33.2,4-33.2c2.6,36.5,5.9,44.7,11.7,41.9c4.4-2.1,0.4-43.8,0.4-43.8c7.5,24.8,13.2,28.7,13.2,28.7 c12.4,8.7,4.7-15.4,3-20.1c-9.2-25.3-9.5-34.1-9.5-34.1c11.5,22.8,20.1,21.9,20.1,21.9c11.2-3.6-9.8-35.8-22.1-51.2 c-6.3-7.9-14.4-18.4-16.7-24.6c-3.8-10.6-6.7-44.6-6.7-44.6c-1.2-40.2-11.1-57.6-11.1-57.6c-17-27.2-20.2-77.9-20.2-77.9l-0.8-85.6 c-6-58.4-49-58.8-49-58.8c-43.5-6.5-49.5-20.5-49.5-20.5c-9.2-13.3-3.9-38.7-3.9-38.7c7.6-6.2,10.6-22.7,10.6-22.7 c12.7-9.7,12.1-24,6.2-23.8c-4.7,0.1-3.6-3.8-3.6-3.8c7.9-64.1-49-67.4-49-67.4h-8.7c0,0-56.9,3.3-49,67.4c0,0,1.1,3.9-3.7,3.8 c-5.8-0.2-6.4,14.1,6.3,23.8c0,0,2.9,16.5,10.6,22.7c0,0,5.3,25.4-3.9,38.7c0,0-6,14.1-49.5,20.5c0,0-43.1,0.4-49,58.8l-0.8,85.6 c0,0-3.1,50.7-20.2,77.9c0,0-9.9,17.5-11,57.6c0,0-2.9,34.1-6.7,44.6c-2.3,6.2-10.4,16.8-16.7,24.6c-12.4,15.4-33.2,47.6-22.1,51.2 c0,0,8.7,0.8,20.1-21.9c0,0-0.2,8.7-9.4,34.1c-1.8,4.7-9.5,28.8,2.9,20.1c0,0,5.7-3.9,13.2-28.7c0,0-4,41.7,0.4,43.8 c5.8,2.9,9-5.4,11.6-41.9c0,0,2.7-11.8,3.9,33.2c0.1,2.3,3.5,13.9,8.2,4c4-8.3,2.2-30.2,2.2-37.5c0,0,5.1,28.4,9.9,28.4 c0,0,5.7,6.6,3.3-28.7c-0.4-5.8,1.6-17.6,1.9-21.1l0.5-13.5c0,0-1.4-15.5-1.4-22c0-1.6,5.6-22.7,20.2-45c0,0,30.4-54,28.5-89.3 c0,0-0.4-33.7,11.8-52.7c0,0,8.7,95.4,2.8,122.1c0,0-27.4,65.8-21.3,114.8c4.5,36.5,13,114.5,21.8,145.2c4.6,15.9,1.9,56.1,5.5,66.1 c1.6,4.4,0.8,8.4-2.8,18.2c-12.3,34.5-10.7,58.9,20.2,150.5c0,0,9.5,20.3,4.7,56.8c0,0-19.7,40.6-7.1,41.4c0,0,1,2.7,5.3,0.6 c0,0,6.8,7,14.2,3.2c0,0,6.8,5.5,12.7,0.6c0,0,4.7,5.4,11.5,1c0,0,9,6,14.3-0.5c0,0,9.5,2.1-7.4-40.6c0,0-6.5-45.3-10-54.2 c-6.8-16.9-2-63.1-0.5-73c2.3-16.5,1.1-44.7-3.2-66.6c-3.1-15.6,5.3-45.2,8.4-63.3C213.3,732.9,229.9,616.5,229.9,616.5L229.9,616.5 z"
                                stroke="#FFFFFF"
                                strokeWidth={2}
                                scale={scale}
                            />
                            <G id="Deltoïdes">
                                <Path
                                    d="M186.2,199c0,0-64.9-37-91.4,18.1c-9.8,20.3-2.4,84.2-2.1,87.2c0.2,1.9,19.3-41.1,35.6-50.2 C131.1,252.5,127.5,210.7,186.2,199z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Deltoïdes') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Deltoïdes')}
                                />
                                <Path
                                    d="M273.7,199c0,0,64.9-37,91.4,18.1c9.8,20.3,2.4,84.2,2.1,87.2c-0.2,1.9-19.3-41.1-35.6-50.2 C328.8,252.5,332.4,210.7,273.7,199L273.7,199z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Deltoïdes') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Deltoïdes')}
                                />
                            </G>
                            <G id="Biceps">
                                <Path
                                    d="M131.6,255.3c0,0,5.8,87.6-1,91.5c-7.7,4.5-11.7,47.7-11.7,47.7s-3.9-11-8.3-10.5 c-4.4,0.5-12.7,8.8-14.4,11.7C94.7,398.6,69.1,305.4,131.6,255.3L131.6,255.3z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Biceps') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Biceps')}
                                />
                                <Path 
                                    d="M331.5,266.6c0,0-5.8,87.6,1,91.5c7.7,4.5,11.7,47.7,11.7,47.7s3.9-11,8.3-10.5c4.4,0.5,12.7,8.8,14.4,11.7 C368.4,409.9,394,316.7,331.5,266.6L331.5,266.6z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Biceps') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Biceps')}
                                />
                            </G>
                            <G id="Pectoraux">
                                <Path 
                                    d="M219.4,209.3c-1.6,20.8,10.5,46.7,10.6,62.3c0.2,21.1-1.7,38.1-38.9,42.3c-29.9,3.3-36.6-9.1-46.3-15.2 c-6-3.9-7.9-43.7-13.4-49.7c-3.8-4.1,20.8-46.5,54.9-46.2C220.3,203,219.8,204.9,219.4,209.3L219.4,209.3z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Pectoraux') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Pectoraux')}
                                />
                                <Path 
                                    d="M240.7,209.3c1.6,20.8-10.5,46.7-10.6,62.3c-0.2,21.1,1.7,38.1,38.9,42.3c29.9,3.3,36.6-9.1,46.3-15.2 c6.1-3.9,7.9-43.7,13.4-49.7c3.8-4.1-20.8-46.5-54.9-46.2C239.8,203,240.4,204.9,240.7,209.3L240.7,209.3z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Pectoraux') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Pectoraux')}
                                />
                            </G>
                            <G id="Obliques">
                                <Path
                                    d="M187.9,327.8c0,0,7.3,166,0,171.9c-7.3,5.9-8.8-33.1-35.4-37.5c-5-0.8-0.9-89.9-12.8-111.1 C127.7,329.8,182.8,320.9,187.9,327.8L187.9,327.8z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Obliques') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Obliques')}
                                />
                                <Path
                                    d="M270.9,327.8c0,0-7.3,166,0,171.9c7.3,5.9,8.8-33.1,35.4-37.5c5-0.8,0.9-89.9,12.8-111.1 C331,329.8,275.9,320.9,270.9,327.8L270.9,327.8z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Obliques') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Obliques')}
                                />
                            </G>
                            <G id="Abdominaux">
                                <Path 
                                    d="M231.4,314.5c0,0-30.7-9.7-44.7,7.7c-14,17.4,2.4,85-1.3,110.2c-3.7,25.1,17.2,129.4,27.8,133.4 c6.6,2.5,11.2,3,18.6-0.5c6.6-3,37.2-72.4,41.2-133.5c1.9-28.3,25.3-113.4-15.6-119.5C233.7,308.6,231.4,314.5,231.4,314.5z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Abdominaux') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Abdominaux')}
                                />
                            </G>
                            <G id="Quadriceps">
                                <Path
                                    d="M164.5,500.3c0,0,57.8,123.3,53.6,181c-4.2,57.7-10.5,77.7-10.5,92.4c0,14.7,1.9-22-16.5-22 c-21.6-0.1-37.7,17.4-43.5,36.6c-0.8,2.7-5.2-54.8-5.2-54.8s-7.4-15.9-12.4-69.1C122.3,583.9,183.7,554.8,164.5,500.3"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Quadriceps') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Quadriceps')}
                                />
                                <Path
                                    d="M293.9,500.3c0,0-57.8,123.3-53.6,181c4.2,57.7,10.5,77.7,10.5,92.4c0,14.7-1.9-22,16.5-22 c21.6-0.1,37.7,17.4,43.5,36.6c0.8,2.7,5.2-54.8,5.2-54.8s7.4-15.9,12.5-69.1C336.2,583.9,274.8,554.8,293.9,500.3"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Quadriceps') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Quadriceps')}
                                />
                            </G>
                            <G id="Adducteurs">
                                <Path
                                    d="M181,490.2c0,0,22.1,61.1,30.7,77.5c12.8,24.4,20.1,44.1,18.2,47.2c-1.9,3.1-6.5,51.1-6.9,46.8 c-2.5-31.4-38.9-153-44.8-161.3C174.9,495.7,180.9,490.1,181,490.2L181,490.2z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Adducteurs') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Adducteurs')}
                                />
                                <Path
                                    d="M276.7,490.2c0,0-22.1,61.1-30.7,77.5c-12.8,24.4-20.1,44.1-18.2,47.2c1.9,3.1,6.5,51.1,6.9,46.8 c2.5-31.4,38.9-153,44.8-161.3C282.8,495.7,276.7,490.1,276.7,490.2L276.7,490.2z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Adducteurs') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Adducteurs')}
                                />
                            </G>
                        </Svg>
                    :
                        <Svg
                            width={459.1 * scale}
                            height={1080 * scale}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <Path
                                d="M233.1,616.5c-1.6,18.4,16.6,116.4,23.1,154.6c3.1,18.1,11.5,47.6,8.5,63.3 c-4.3,21.8-5.6,50.1-3.2,66.6c1.5,10,6.2,56.1-0.5,73c-3.5,8.8-10,54.2-10,54.2c-16.9,42.7-7.4,40.6-7.4,40.6 c5.2,6.4,14.2,0.5,14.2,0.5c6.8,4.4,11.6-1,11.6-1c5.9,4.9,12.7-0.6,12.7-0.6c7.4,3.8,14.2-3.2,14.2-3.2c4.2,2.1,5.3-0.6,5.3-0.6 c12.7-0.8-7.1-41.4-7.1-41.4c-4.7-36.5,4.7-56.8,4.7-56.8c30.9-91.6,32.5-116,20.1-150.5c-3.5-10-4.4-13.9-2.8-18.2 c3.7-10,1-50.2,5.5-66.1c8.7-30.8,17.3-108.8,21.8-145.2c6-49-21.3-114.8-21.3-114.8c-6-26.8,2.8-122.1,2.8-122.1 c12.3,19.1,11.8,52.7,11.8,52.7c-1.9,35.3,28.5,89.3,28.5,89.3c14.6,22.3,20.2,43.5,20.2,45c0,6.4-1.4,22-1.4,22l0.6,13.5 c0.3,3.4,2.2,15.3,1.9,21.1c-2.3,35.3,3.3,28.7,3.3,28.7c4.7,0,9.9-28.4,9.9-28.4c0,7.3-1.8,29.3,2.2,37.5c4.7,9.9,8.2-1.7,8.3-4 c1.3-45,3.9-33.2,3.9-33.2c2.6,36.5,5.9,44.7,11.7,41.9c4.4-2.1,0.4-43.8,0.4-43.8c7.5,24.8,13.2,28.7,13.2,28.7 c12.4,8.7,4.7-15.4,3-20.1c-9.2-25.3-9.5-34.1-9.5-34.1c11.5,22.8,20.1,21.9,20.1,21.9c11.2-3.6-9.8-35.8-22.1-51.2 c-6.3-7.9-14.4-18.4-16.7-24.6c-3.8-10.6-6.7-44.6-6.7-44.6c-1.2-40.2-11.1-57.6-11.1-57.6c-17-27.2-20.2-77.9-20.2-77.9l-0.8-85.6 c-6-58.4-49-58.8-49-58.8c-43.5-6.5-49.5-20.5-49.5-20.5c-9.2-13.3-3.9-38.7-3.9-38.7c7.6-6.2,10.6-22.7,10.6-22.7 c12.7-9.7,12.1-24,6.2-23.8c-4.7,0.1-3.6-3.8-3.6-3.8c7.9-64.1-49-67.4-49-67.4h-8.7c0,0-56.9,3.3-49,67.4c0,0,1.1,3.9-3.7,3.8 c-5.8-0.2-6.4,14.1,6.3,23.8c0,0,2.9,16.5,10.6,22.7c0,0,5.3,25.4-3.9,38.7c0,0-6,14.1-49.5,20.5c0,0-43.1,0.4-49,58.8l-0.8,85.6 c0,0-3.1,50.7-20.2,77.9c0,0-9.9,17.5-11,57.6c0,0-2.9,34.1-6.7,44.6c-2.3,6.2-10.4,16.8-16.7,24.6c-12.4,15.4-33.2,47.6-22.1,51.2 c0,0,8.7,0.8,20.1-21.9c0,0-0.2,8.7-9.4,34.1c-1.8,4.7-9.5,28.8,2.9,20.1c0,0,5.7-3.9,13.2-28.7c0,0-4,41.7,0.5,43.8 c5.8,2.9,9-5.4,11.6-41.9c0,0,2.7-11.8,3.9,33.2c0.1,2.3,3.5,13.9,8.2,4c4-8.3,2.2-30.2,2.2-37.5c0,0,5.1,28.4,9.9,28.4 c0,0,5.7,6.6,3.3-28.7c-0.4-5.8,1.6-17.6,1.9-21.1l0.5-13.5c0,0-1.4-15.5-1.4-22c0-1.6,5.6-22.7,20.2-45c0,0,30.4-54,28.5-89.3 c0,0-0.4-33.7,11.8-52.7c0,0,8.7,95.4,2.8,122.1c0,0-27.4,65.8-21.3,114.8c4.4,36.5,13,114.5,21.8,145.2c4.6,15.9,1.9,56.1,5.5,66.1 c1.6,4.4,0.8,8.4-2.8,18.2c-12.3,34.5-10.7,58.9,20.2,150.5c0,0,9.5,20.3,4.7,56.8c0,0-19.7,40.6-7.1,41.4c0,0,1,2.7,5.3,0.6 c0,0,6.8,7,14.2,3.2c0,0,6.8,5.5,12.7,0.6c0,0,4.7,5.4,11.5,1c0,0,9,6,14.3-0.5c0,0,9.5,2.1-7.4-40.6c0,0-6.5-45.3-10-54.2 c-6.8-16.9-2-63.1-0.5-73c2.3-16.5,1.1-44.7-3.2-66.6c-3.1-15.6,5.3-45.2,8.4-63.3C216.5,732.9,233.1,616.5,233.1,616.5L233.1,616.5 z"
                                stroke="#FFFFFF"
                                strokeWidth={2}
                                scale={scale}
                            />
                            <G id="Trapèzes">
                                <Path 
                                    d="M225.6,398.9c0.4,2,3.8-15.4,8.2-13.5c4.3,1.9,9.7,13.5,9.6,13c-1.4-14.2,11.4-36.4,20.7-51.4 c10.1-16.4,15.3-17.3,22.1-38.5c2.7-8.4,0-63.5,11.5-83.7c11.5-20.2,19.7-18.1,28.4-23.1c1.9-1.1-70.8-6.8-77.1-55.9 c-1-8.1-1.1-15.5,0.2-22.9c1.3-7.4-37.8-10.4-39.9-0.5c-3.2,15.2,23.8,58.5-68.3,72.6c-6.5,1,19.1,10.9,33.2,32.2 c3.4,5.2,3.4,17.6,13.9,87C190.5,329.8,221.1,375.8,225.6,398.9L225.6,398.9z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Trapèzes') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Trapèzes')}
                                />
                            </G>
                            <G id="Grands dorsaux">
                                <Path
                                    d="M250.7,394.4c0,0,26.3,26.9,29.2,42.9c2.9,16,2.9,45.1,16.6,42.9c0.2,0-4.7-10.6,1.7-21.6 c21.9-37.6,22.9-81.5,22.9-81.5l7.4-71.6c0,0-20.4,7.3-36.6-3.4c-3.3-2.1-1.3,24.9-17,39C268.5,347,244.4,378.4,250.7,394.4 L250.7,394.4z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Grands dorsaux') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Grands dorsaux')}
                                />
                                <Path
                                    d="M216.4,394.4c0,0-26.3,26.9-29.2,42.9c-2.9,16-2.9,45.1-16.6,42.9c-0.2,0,4.7-10.6-1.7-21.6 C147,421.1,146,377.2,146,377.2l-7.4-71.6c0,0,20.4,7.3,36.6-3.4c3.3-2.1,1.3,24.9,17,39C198.5,347,222.7,378.4,216.4,394.4 L216.4,394.4z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Grands dorsaux') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Grands dorsaux')}
                                />
                            </G>
                            <G id="Triceps">
                                <Path
                                    d="M328.5,257.6c0,0,19.4-13.5,26.2-9.7c6.8,3.9,19.5,28.8,21,39c1.5,10.2,7.8,91.7,7.8,91.7 s-2.4,10.1-9.3,12.6c-6.8,2.5-5.8-21.2-11-23.8c-5.2-2.6-0.2,18.3-5.4,20c-5.2,1.6-20.2-5.6-20.2-5.6l-11.4-33.6 C326.2,348.2,336.9,275.6,328.5,257.6L328.5,257.6z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Triceps') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Triceps')}
                                />
                                <Path
                                    d="M137.6,257.6c0,0-19.4-13.5-26.2-9.7c-6.8,3.9-19.5,28.8-21,39c-1.5,10.2-7.8,91.7-7.8,91.7 s2.4,10.1,9.3,12.6c6.8,2.5,5.8-21.2,11-23.8c5.2-2.6,0.2,18.3,5.4,20c5.2,1.6,20.2-5.6,20.2-5.6l11.4-33.6 C140,348.2,129.3,275.6,137.6,257.6z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Triceps') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Triceps')}
                                />
                            </G>
                            <G id="Avant-bras">
                                <Path
                                    d="M383.5,383c0,0,19.4,30.8,23.4,54.3s-0.5,69.9,10.8,80.7c11.2,10.8-32.5,19.6-34.1,8.8 C381.9,516,334,435,339.4,420.2c1.5-4-1.5-38.6-1.5-38.6l16.9,9.7c0,0,3.6,14.7-4.7,19.1c-8.3,4.4,4.9,17.1,10.3,11.7 c5.4-5.4,8.8-15.7,15.2-17.6c6.4-2-4.9-11-1-13.1C378.5,389.4,383.5,383,383.5,383L383.5,383z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Avant-bras') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Avant-bras')}
                                />
                                <Path
                                    d="M84.3,383c0,0-19.4,30.8-23.4,54.3s0.5,69.9-10.8,80.7s32.5,19.6,34.1,8.8c1.6-10.8,49.6-91.8,44.1-106.6 c-1.5-4,1.5-38.6,1.5-38.6l-16.9,9.7c0,0-3.6,14.7,4.7,19.1c8.3,4.4-4.9,17.1-10.3,11.7c-5.4-5.4-8.8-15.7-15.2-17.6 c-6.4-2,4.9-11,1-13.1C89.3,389.4,84.3,383,84.3,383L84.3,383z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Avant-bras') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Avant-bras')}
                                />
                            </G>
                            <G id="Fessiers">
                                <Path
                                    d="M156.5,469.4c4.2-0.7,70.6,32.5,74.2,83.7c3.6,51.2-36.1,69.5-69.7,60.6c-33.5-9-31.1-49-30.2-58.7 c0.6-6.9,6.6-22.3,12.1-59.7C143.9,488.8,152.3,470.1,156.5,469.4L156.5,469.4z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Fessiers') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Fessiers')}
                                />
                                <Path
                                    d="M319.1,475.6c-3.7-1.5-70.9,18.4-83.4,68c-12.5,49.6,20.8,75.2,53.3,72.8c32.5-2.4,37.4-42.2,38.3-51.8 c0.7-6.9-2.1-23.2-0.4-60.9C327.3,497.1,322.9,477.1,319.1,475.6L319.1,475.6z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Fessiers') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Fessiers')}
                                />
                            </G>
                            <G id="Ischio-jambiers">
                                <Path
                                    d="M249.1,619.4c0,0,64.4,2.5,74.6-6.4c10.2-9,12.9,49,0,111.7c-12.9,62.7-4.8,69.7-6.7,68 c-14.3-12.4-22.9-43.3-23.9-42.5c-0.8,0.6-29.8,43.4-25,76.7c0.3,1.9-27.1-151.2-31.2-169.8C232.8,638.5,226.7,621.5,249.1,619.4 L249.1,619.4z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Ischio-jambiers') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Ischio-jambiers')}
                                />
                                <Path
                                    d="M217.1,619.4c0,0-64.1,2.5-74.2-6.4c-10.2-9-12.9,49,0,111.7c12.9,62.7,4.8,69.7,6.6,68 c14.2-12.4,22.8-43.3,23.8-42.5c0.8,0.6,29.6,43.4,24.9,76.7c-0.3,1.9,27-151.2,31.1-169.8C233.3,638.5,230.1,620,217.1,619.4z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Ischio-jambiers') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Ischio-jambiers')}
                                />
                            </G>
                            <G id="Mollets">
                                <Path
                                    d="M295.3,795.1c0,0-29.8,37.1-31.8,52.2c-2,15.1-2,88.3,3.5,101c4.1,9.3,23.9-20.7,28.9-39.4 c5-18.8-0.1,17.4,12.5,30.9c2.1,2.3,24.4-71.8,18-96.3c-8.9-34-12.2-43.7-10-59.4c3.5-24.8-13.4,11.1-15.9,22.2 C298,817.4,295.3,795.1,295.3,795.1L295.3,795.1z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Mollets') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Mollets')}
                                />
                                <Path
                                    d="M171.9,795.1c0,0,29.8,37.1,31.8,52.2c2,15.1,2,88.3-3.5,101c-4.1,9.3-23.9-20.7-28.9-39.4 c-5-18.8,0.1,17.4-12.5,30.9c-2.1,2.3-24.4-71.8-18-96.3c8.9-34,12.2-43.7,10-59.4c-3.5-24.8,13.4,11.1,15.9,22.2 C169.1,817.4,171.9,795.1,171.9,795.1L171.9,795.1z"
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                    scale={scale}
                                    fill={this.state.activeMuscles.includes('Mollets') ? "#28C6D5" : "#28C6D540"}
                                    onPress={() => this.setActiveMuscles('Mollets')}
                                />
                            </G>
                        </Svg>
                }

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={.7}
                        style={[styles.button, this.state.activeSide == "front" ? styles.buttonActive : null]}
                        onPress={() => this.setActiveSide('front')}>
                        <Text style={[styles.text, styles.bold]}>Avant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={.7}
                        style={[styles.button, this.state.activeSide == "back" ? styles.buttonActive : null]}
                        onPress={() => this.setActiveSide('back')}>
                        <Text style={[styles.text, styles.bold]}>Arrière</Text>
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

    buttonContainer: {
        width: '60%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },

    button: {
        borderWidth: 2,
        borderColor: blueColor,
        borderRadius: 50,
        paddingHorizontal: 20,
        paddingVertical: 10
    },

    buttonActive: {
        backgroundColor: blueColor
    }
})

const darkTheme = StyleSheet.create({
    container: {
        backgroundColor: "#0d0f15"
    },
});