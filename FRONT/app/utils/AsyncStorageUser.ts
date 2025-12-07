import AsyncStorage from '@react-native-async-storage/async-storage';


const setUser = async (value: any) => {
    await AsyncStorage.setItem('userData', JSON.stringify(value))
}

const getUser = async () => {
    const value = await AsyncStorage.getItem('userData');
    return JSON.parse(value || '{}')
}

const setToken = async (value: any) => {
    await AsyncStorage.setItem('token', value)
}

const getToken = async () => {
    return await AsyncStorage.getItem('token');
}

const Logout = () => {
    AsyncStorage.clear()
}

export default {
    setUser,
    getUser,
    setToken,
    getToken,
    Logout,
}
