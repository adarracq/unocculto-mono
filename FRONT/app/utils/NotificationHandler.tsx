
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { navigate, navigationRef } from '../utils/RootNavigation';

export default function NotificationHandler() {
    const { notifications, updateNotification } = useNotifications();


    useEffect(() => {
        // Demander la permission pour afficher les badges
        const requestPermission = async () => {
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowBadge: true,
                    allowAlert: true,
                    allowSound: true,
                },
            });

            if (status !== 'granted') {
                console.log('Notification permission not granted');
            }
        };

        requestPermission();

        // Notification reçue (app en arrière-plan ou en avant-plan)
        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            const type = notification.request.content.data.type;
            console.log('Notification received:', notification);

            if (type === 'quiz') updateNotification('quiz', notifications.quiz + 1);
            else if (type === 'revision') updateNotification('revision', notifications.revision + 1);
            else console.log('Unknown notification type:', type);
        });

        // Réaction à une notification cliquée (app ouverte ou en arrière-plan)
        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            const type = response.notification.request.content.data.type;
            const data = response.notification.request.content.data;

            const waitForNavigation = () => {
                if (navigationRef.current && navigationRef.current.isReady()) {
                    if (type === 'quiz') {
                        navigate('Quiz');
                    } else if (type === 'revision') {
                        navigate('Revision');
                    } else {
                        console.log("Unknown notification type:", type);
                    }
                } else {
                    setTimeout(waitForNavigation, 100);
                }
            };

            waitForNavigation();
        });

        // Nettoyer les listeners au démontage du composant
        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, [notifications, updateNotification]);

    return null;
}
