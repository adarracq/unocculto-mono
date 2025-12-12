import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Device from "expo-device";
import * as Font from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import * as Notifications from "expo-notifications";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import LoadingScreen from './components/molecules/LoadingScreen';
import { CoursesContext } from './contexts/CoursesContext';
import { CourseThemesContext } from './contexts/CourseThemesContext';
import { NotificationsProvider } from './contexts/NotificationContext';
import { UserContext } from './contexts/UserContext';
import { useApi } from './hooks/useApi';
import Course from './models/Course';
import BottomTabNav from './navigations/BottomTabNav';
import UnLoggedNav from './navigations/UnloggedNav';
import { courseService } from './services/course.service';
import { themeService } from './services/theme.service';
import { userService } from './services/user.service';
import AsyncStorageUser from './utils/AsyncStorageUser';
import { ErrorBoundary } from './utils/ErrorBoundary';
import NotificationHandler from './utils/NotificationHandler';
import { navigationRef } from './utils/RootNavigation';



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function App() {
  // Load fonts and hide splash screen
  const [fontsLoaded, fontsError] = Font.useFonts({
    'title-regular': require('./assets/fonts/SpaceGrotesk-regular.ttf'),
    'title-bold': require('./assets/fonts/SpaceGrotesk-bold.ttf'),
    'title-medium': require('./assets/fonts/SpaceGrotesk-medium.ttf'),
    'title-italic': require('./assets/fonts/sf_pro_italic.otf'),
    'title-regular2': require('./assets/fonts/lexend_deca_regular.ttf'),
    'title-bold2': require('./assets/fonts/lexend_deca_bold.ttf'),
    'title-medium2': require('./assets/fonts/lexend_deca_medium.ttf'),
    'title-italic2': require('./assets/fonts/sf_pro_italic.otf'),
    'text-regular': require('./assets/fonts/sf_pro_regular.otf'),
    'text-bold': require('./assets/fonts/sf_pro_bold.otf'),
    'text-italic': require('./assets/fonts/sf_pro_italic.otf'),
    'text-medium': require('./assets/fonts/sf_pro_medium.otf'),
  });
  const [loading, setLoading] = useState(true);

  // Main
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState(null);

  const [expoPushToken, setExpoPushToken] = useState('');


  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError('Project ID not found');
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  }

  function saveExpoPushToken(email: string) {
    registerForPushNotificationsAsync()
      .then(token => {
        if (token) {
          setExpoPushToken(token);
          userService.saveExpoPushToken({ token, email })
            .then(() => {
              // Expo push token saved successfully
            })
            .catch(err => {
              // Error saving expo push token
            });
        }
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

  }



  // We retrieve the user data in local storage
  function getUserFromStorage() {
    AsyncStorageUser.getUser().then(resp => {
      setUserLoaded(true);
      if (resp && resp.email) {
        saveExpoPushToken(resp.email);
        userService.getByEmail(resp.email)
          .then(user => {
            // if user is banned
            if (user.status == -1) {
              AsyncStorageUser.Logout();
              setUser(null);
              setLoading(false);
              Alert.alert(
                'Compte suspendu',
                "Les informations permettant de valider votre profil d'agent immobilier n'ont pas été validées par Huntya. \nVeuillez contacter support@huntya.fr pour plus d'informations.",
                [
                  {
                    text: 'OK', onPress: () => {
                      // User acknowledged suspension
                    }
                  }
                ]
              )
            }
            else {
              setUser(resp);
              setLoading(false);
            }
          })
          .catch(err => {
            // Error getting user from server
            AsyncStorageUser.Logout();
            setUser(null);
            setLoading(false);
          });
      }
      else {
        // No user/email in storage
        AsyncStorageUser.Logout();
        setUser(null);
        setLoading(false);
      }
    });
  }


  useEffect(() => {
    //requestLocationPermission();
    getUserFromStorage();
    //AsyncStorageUser.Logout();
  }, []);

  // save themes
  const [courseThemesContext, setCourseThemesContext] = useState([]);
  const [coursesContext, setCoursesContext] = useState([]);

  const { execute: getThemes, loading: loadingThemes } = useApi(
    () => themeService.getAll(),
    'index - getThemes'
  );
  const { execute: getCourses, loading: loadingCourses } = useApi(
    () => courseService.getAll(),
    'index - getCourses'
  );
  useEffect(() => {
    async function fetchData() {
      const themes = await getThemes();
      const courses = await getCourses();
      if (courses) { // order by course.number ascending
        setCoursesContext(courses.sort((a: Course, b: Course) => a.number - b.number));
      }
      if (themes) {
        setCourseThemesContext(themes);
      }
    }
    fetchData();
  }, []);



  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBehaviorAsync('overlay-swipe');
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (userLoaded && fontsLoaded || fontsError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return loading ? <LoadingScreen /> : (
    <ErrorBoundary>
      <NotificationsProvider>
        <NotificationHandler />
        <NavigationIndependentTree>
          <NavigationContainer ref={navigationRef}>
            <UserContext.Provider
              value={[user, setUser]}>
              <CourseThemesContext.Provider
                value={[courseThemesContext, setCourseThemesContext]}>
                <CoursesContext.Provider
                  value={[coursesContext, setCoursesContext]}>
                  <StatusBar hidden />
                  <View style={StyleSheet.absoluteFillObject} onLayout={onLayoutRootView}>
                    {
                      userLoaded && user ?
                        <BottomTabNav />
                        :
                        <UnLoggedNav />
                    }
                    <FlashMessage position="top" statusBarHeight={10} />
                  </View>
                </CoursesContext.Provider>
              </CourseThemesContext.Provider>
            </UserContext.Provider>
          </NavigationContainer>
        </NavigationIndependentTree>
      </NotificationsProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
