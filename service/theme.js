import AsyncStorage from '@react-native-async-storage/async-storage';

export const getTheme = async () => {
    try {
        const selectedTheme = await AsyncStorage.getItem('selectedTheme');

        if(selectedTheme !== null) 
            return selectedTheme;

    } catch(e) {
        return false;
    }
}