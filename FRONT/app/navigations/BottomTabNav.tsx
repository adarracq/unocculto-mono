import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import TabBarElement from '../components/molecules/TabBarElement';
import Colors from '../constants/Colors';
import { useNotifications } from '../contexts/NotificationContext';
import { UserContext } from '../contexts/UserContext';
import CoursesNav from './CoursesNav';
import ProfileNav from './ProfileNav';

export type BottomNavParams = {
    Courses: undefined;
    Revision: undefined;
    Quiz: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomNavParams>();

export default function BottomTabNav() {
    const [user, setUser] = useContext(UserContext);
    const { notifications, updateNotification, resetNotification } = useNotifications();

    const noTabBarScreens = [
        'Chapter',
    ];
    return (
        <Tab.Navigator
            initialRouteName={"Courses"}
            screenOptions={(props) => {
                return {
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        ...styles.tabBarStyle,
                        display:
                            noTabBarScreens.includes(getFocusedRouteNameFromRoute(props.route) ?? '')
                                ? "none"
                                : "flex",
                    },
                };
            }}
        >
            <Tab.Screen
                name={"Revision"}
                component={ProfileNav}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarElement
                            title='Révisions'
                            focused={focused}
                            name='student'
                            nbNotifications={notifications.revisions}
                        />
                    ),
                }}
                listeners={{
                    focus: () => {
                        resetNotification('revisions');
                    }
                }}
            />
            <Tab.Screen
                name="Courses"
                component={CoursesNav}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarElement
                            title='Voyage'
                            focused={focused}
                            name='compass'
                            nbNotifications={notifications.courses}
                        />
                    ),
                }}
                listeners={{
                    focus: () => {
                        resetNotification('courses');
                    }
                }}
            />
            <Tab.Screen
                name="Quiz"
                component={ProfileNav}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabBarElement
                            title='Quiz'
                            focused={focused}
                            name='duel'
                            nbNotifications={notifications.quiz}
                        />
                    ),
                }}
                listeners={{
                    focus: () => {
                        resetNotification('quiz');
                    }
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBarStyle: {
        height: 70,
        backgroundColor: Colors.black,
        borderTopWidth: 0,
        borderTopColor: Colors.black,
    },
})