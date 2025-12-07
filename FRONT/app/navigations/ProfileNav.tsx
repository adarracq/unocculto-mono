import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import User from '../models/User';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type ProfileNavParams = {
    HomeProfile: undefined;
    EditPersonalData: { user: User }
};

const Stack = createStackNavigator<ProfileNavParams>();

export default function ProfileNav() {

    return (
        <Stack.Navigator initialRouteName={'HomeProfile'}>
            <Stack.Screen name="HomeProfile" component={ProfileScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}