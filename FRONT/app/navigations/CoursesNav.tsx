import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Course from '../models/Course';
import User from '../models/User';
import ChaptersListScreen from '../screens/courses/ChaptersListScreen';
import CoursesHomeScreen from '../screens/courses/CoursesHomeScreen';
import CoursesListScreen from '../screens/courses/CoursesListScreen';
import DevAddPOI from '../screens/courses/DevAddPOI';

export type CoursesNavParams = {
    Home: undefined;
    CoursesList: { user: User };
    ChaptersList: { course: Course, user: User }
    Dev: undefined;
};

const Stack = createStackNavigator<CoursesNavParams>();

export default function CoursesNav() {

    return (
        <Stack.Navigator initialRouteName={'Home'}>
            <Stack.Screen name="Home" component={CoursesHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CoursesList" component={CoursesListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChaptersList" component={ChaptersListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Dev" component={DevAddPOI} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}