import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type MenuKey = 'revisions' | 'quiz' | 'courses';

type Notifications = Record<MenuKey, number>;

type NotificationsContextType = {
    notifications: Notifications;
    updateNotification: (menu: MenuKey, count: number) => Promise<void>;
    resetNotification: (menu: MenuKey) => Promise<void>;
};

const defaultNotifications: Notifications = {
    revisions: 0,
    quiz: 0,
    courses: 0,
};

const NOTIF_KEY = 'nbNotif';

export const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notifications>(defaultNotifications);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const storedData = await AsyncStorage.getItem(NOTIF_KEY);
                if (storedData) {
                    try {
                        const parsedData = JSON.parse(storedData);
                        setNotifications(parsedData);
                        console.log('Notifications loaded from AsyncStorage:', parsedData);
                    } catch (jsonError) {
                        console.error('Error parsing notifications JSON:', jsonError);
                        setNotifications(defaultNotifications);
                    }
                } else {
                    console.log('No notifications found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error loading notifications from AsyncStorage:', error);
                setNotifications(defaultNotifications);
            }
        };
        loadNotifications();
    }, []);


    const updateNotification = async (menu: MenuKey, count: number) => {
        try {
            const newNotifications = { ...notifications, [menu]: count };

            setNotifications(newNotifications);
            await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(newNotifications));

            const totalCount = (Object.values(newNotifications) as number[]).reduce((acc: number, curr: number) => acc + curr, 0);
            console.log('Total notification count:', totalCount);
            await Notifications.setBadgeCountAsync(totalCount);

            console.log('Notifications updated and stored in AsyncStorage:', newNotifications);
        } catch (error) {
            console.error('Error updating notifications:', error);
        }
    };


    const resetNotification = async (menu: MenuKey) => {
        await updateNotification(menu, 0);
    };

    return (
        <NotificationsContext.Provider value={{ notifications, updateNotification, resetNotification }}>
            {children}
        </NotificationsContext.Provider>
    );
};


// Hook pratique pour y accéder facilement
export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};
