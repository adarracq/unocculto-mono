import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import User from '../models/User';
import AccountCreatedScreen from '../screens/unlogged/AccountCreatedScreen';
import CheckEmailCodeScreen from '../screens/unlogged/CheckEmailCodeScreen';
import ChoosePseudoScreen from '../screens/unlogged/ChoosePseudo';
import EmailInputScreen from '../screens/unlogged/EmailInputScreen';
import LoginScreen from '../screens/unlogged/LoginScreen';
import OnBoardingScreen from '../screens/unlogged/OnBoardingScreen';
import SetThemesScreen from '../screens/unlogged/SetThemesScreen';

export type NavParams = {
    OnBoarding: undefined;
    Login: undefined;
    EmailInput: undefined;
    CheckEmailCode: { email: string, loginOrSignup: string };
    ChoosePseudo: { user: User };
    SetThemes: { user: User };
    AccountCreated: { user: User };
};

const Stack = createStackNavigator<NavParams>();

export default function UnLoggedNav() {


    return (
        <Stack.Navigator initialRouteName={"OnBoarding"}>
            <Stack.Screen name="OnBoarding" component={OnBoardingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EmailInput" component={EmailInputScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CheckEmailCode" component={CheckEmailCodeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChoosePseudo" component={ChoosePseudoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SetThemes" component={SetThemesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AccountCreated" component={AccountCreatedScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}