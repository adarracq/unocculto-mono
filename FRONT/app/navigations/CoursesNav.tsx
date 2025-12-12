import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Chapter from '../models/Chapter';
import Course from '../models/Course';
import POI from '../models/POI';
import User from '../models/User';
import ChapterScreen from '../screens/courses/ChapterScreen';
import ChaptersListScreen from '../screens/courses/ChaptersListScreen';
import CourseMapScreen from '../screens/courses/CourseMapScreen';
import CoursesHomeScreen from '../screens/courses/CoursesHomeScreen';
import CoursesListScreen from '../screens/courses/CoursesListScreen';
import DEV from '../screens/courses/DEV';
import POICourseScreen from '../screens/courses/POICourseScreen';
import FreeExploChaptersScreen from '../screens/freeExploration/FreeExploChaptersScreen';
import FreeExploScreen from '../screens/freeExploration/FreeExploScreen';

export type CoursesNavParams = {
    Home: undefined;
    FreeExplo: { user: User };
    CoursesList: { user: User };
    ChaptersList: { course: Course, user: User };
    FreeExploChapters: { course: Course, user: User };
    Chapter: { chapter: Chapter };
    Dev: undefined;
    POICourse: { poi: POI, isFreeExplo?: boolean, onPOICompleted?: (poiId: string, nbGoodAnswers: number) => void };
    CourseMap: { course: Course };
};

const Stack = createStackNavigator<CoursesNavParams>();

export default function CoursesNav() {

    return (
        <Stack.Navigator initialRouteName={'Home'}>
            <Stack.Screen name="Home" component={CoursesHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CoursesList" component={CoursesListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FreeExplo" component={FreeExploScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FreeExploChapters" component={FreeExploChaptersScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChaptersList" component={ChaptersListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Chapter" component={ChapterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Dev" component={DEV} options={{ headerShown: false }} />
            <Stack.Screen name="POICourse" component={POICourseScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CourseMap" component={CourseMapScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );

}