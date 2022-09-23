import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Appearance } from 'react-native';

// Package pour la navigation
import { NavigationContainer, DarkTheme} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

// Import des écrans
import Connexion from './pages/Connexion'
import CreateAccount from './pages/CreateAccount'
import ExerciseDetail from './pages/ExerciseDetail'
import GlobalStats from './pages/GlobalStats'
import Account from './pages/Account'
import ExerciseDayDetailsPage from './pages/ExerciseDayDetails'
import PersonalEvolutionDetailsPage from './pages/PersonalEvolutionDetails';
import WorkoutMain from './pages/WorkoutMain';
import AddExercise from './pages/AddExercise';

// Import des icônes
import HomeIcon from './assets/home-icon.svg';
import GlobalStatsIcon from './assets/globalstats-icon.svg';
import AccountIcon from './assets/user-icon.svg';
import WorkoutIcon from './assets/workout.svg';

// Colors
const bgColor = "#3D348B";
const modalColor = "#6257C1";
const blueColor = "#28C6D5";

// Création de l'objet qui va gérer la navigation
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [userData, setUserData] = useState('');
  const [appTheme, setAppTheme] = useState('');
  const [leftValue, setLeftValue] = useState(0);

  function MyTabBar({ state, descriptors, navigation }) {
    return (
      <>
        <StatusBar
          animated={true}
          backgroundColor={bgColor}
          barStyle='light-content'
          translucent={true}
          showHideTransition={'fade'} />
        <View style={{width: '100%', alignItems: 'center'}}>
          <View style={[styles.tabBarContainer, appTheme == "Dark" ? darkTheme.tabBarContainer : null]}>
            <View style={[styles.animationItemContainer, {left: leftValue + '%'}]}>
              <View style={styles.animationItem} />
            </View>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;
      
              const isFocused = state.index === index;
      
              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                setLeftValue(index * 100/3);
                
                if (!isFocused && !event.defaultPrevented) {
                  // The `merge: true` option makes sure that the params inside the tab screen are preserved
                  navigation.navigate({ name: route.name, merge: true });
                }
              };
      
              const onLongPress = () => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
                });
              };

              const renderIcon = (label) => {
                switch(label) {
                  case "Home":
                    return <HomeIcon height={20} style={isFocused ? (appTheme == "Dark" ? darkTheme.tabBarIconActive : styles.tabBarIconActive) : (appTheme == "Dark" ? darkTheme.tabBarIcon : styles.tabBarIcon)} />
                  case "GlobalStats":
                    return <GlobalStatsIcon height={20} style={isFocused ? (appTheme == "Dark" ? darkTheme.tabBarIconActive : styles.tabBarIconActive) : (appTheme == "Dark" ? darkTheme.tabBarIcon : styles.tabBarIcon)} />
                  case "Account":
                    return <AccountIcon height={20} style={isFocused ? (appTheme == "Dark" ? darkTheme.tabBarIconActive : styles.tabBarIconActive) : (appTheme == "Dark" ? darkTheme.tabBarIcon : styles.tabBarIcon)} />
                  case "Parameters":
                    return <HomeIcon height={20} style={isFocused ? (appTheme == "Dark" ? darkTheme.tabBarIconActive : styles.tabBarIconActive) : (appTheme == "Dark" ? darkTheme.tabBarIcon : styles.tabBarIcon)} />
                    case "Workout":
                    return <WorkoutIcon height={20} style={isFocused ? (appTheme == "Dark" ? darkTheme.tabBarIconActive : styles.tabBarIconActive) : (appTheme == "Dark" ? darkTheme.tabBarIcon : styles.tabBarIcon)} />
                  default:
                    return <Text>undefined</Text>
                }
              }
      
              return (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={isFocused ? (appTheme == "Dark" ? darkTheme.tabBarElementActive : styles.tabBarElementActive) : ((appTheme == "Dark" ? darkTheme.tabBarElement : styles.tabBarElement))}
                  activeOpacity={.8}
                  key={index}
                >
                  {renderIcon(label)}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </>
    );
  }

  function HomeTabs() {
    return (
      <Tab.Navigator
          initialRouteName='Connexion'
          screenOptions={{
            headerShown: false
          }}
          tabBar={props => <MyTabBar {...props} />}>
        <Tab.Screen name="GlobalStats">
          {props => (<GlobalStats {...props} userData={userData} appTheme={appTheme}/>)}
        </Tab.Screen>
        <Tab.Screen name="Workout">
          {props => (<WorkoutMain {...props} userData={userData} appTheme={appTheme}/>)}
        </Tab.Screen>
        <Tab.Screen name="Account">
          {props => (<Account {...props} userData={userData} appTheme={appTheme}/>)}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator initialRouteName='Connexion' screenOptions={{headerShown: false}} >
        <Stack.Screen name="Connexion">
          {props => (<Connexion {...props} setUserData={setUserData} setAppTheme={setAppTheme}/>)}
        </Stack.Screen>
        <Stack.Screen name="CreateAccount">
          {props => (<CreateAccount {...props} setUserData={setUserData} setAppTheme={setAppTheme}/>)}
        </Stack.Screen>
        <Stack.Screen name="App" component={HomeTabs} />
        <Stack.Screen name="ExerciseDetail">
          {props => (<ExerciseDetail {...props} userData={userData} appTheme={appTheme}/>)}
        </Stack.Screen>
        <Stack.Screen name="ExerciseDayDetails">
          {props => (<ExerciseDayDetailsPage {...props} userData={userData} appTheme={appTheme}/>)}
        </Stack.Screen>
        <Stack.Screen name="PersonalEvolutionDetails">
          {props => (<PersonalEvolutionDetailsPage {...props} userData={userData} appTheme={appTheme}/>)}
        </Stack.Screen>
        <Stack.Screen name="AddExercise">
          {props => (<AddExercise {...props} userData={userData} appTheme={appTheme}/>)}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bgColor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '90%',
    height: 63,
    backgroundColor: modalColor,
    borderRadius: 25,

    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },

  tabBarElement: {
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    flex: 1
  },

  tabBarElementActive: {
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    color: 'white',
    flex: 1
  },

  tabBarIcon: {
    color: 'white'
  },

  tabBarIconActive: {
    color: 'white'
  },

  animationItemContainer: {
    position: 'absolute',
    top: 0,
    width: 100/3 + '%',
    height: '100%',
    overflow: 'hidden'
  },

  animationItem: {
    width: '100%',
    height: '100%',
    backgroundColor: blueColor,
    borderRadius: 25
  }
});

const darkTheme = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0f15',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '90%',
    height: 63,
    backgroundColor: '#0d0f15',
    borderRadius: 25,

    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },

  tabBarElement: {
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#61A0AF',
    flex: 1
  },

  tabBarElementActive: {
    height: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    color: '#0d0f15',
    // backgroundColor: '#61A0AF',
    flex: 1
  },

  tabBarIcon: {
    color: '#61A0AF'
  },

  tabBarIconActive: {
    color: '#0d0f15'
  },

  animationItemContainer: {
    position: 'absolute',
    top: 0,
    width: '25%',
    height: '100%',
    overflow: 'hidden'
  },

  animationItem: {
    width: '100%',
    height: '100%',
    backgroundColor: '#61A0AF',
    borderRadius: 25
  }
});
