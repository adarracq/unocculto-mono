import Colors from '@/app/constants/Colors';
import { UserContext } from '@/app/contexts/UserContext';
import { useApi } from '@/app/hooks/useApi';
import POI from '@/app/models/POI';
import { CoursesNavParams } from '@/app/navigations/CoursesNav';
import { poiService } from '@/app/services/poi.service';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import ChapterHeader from './components/ChapterHeader';
import MapCourse from './components/MapCourse';

type Props = NativeStackScreenProps<CoursesNavParams, 'CourseMap'>;

export default function CourseMapScreen({ navigation, route }: Props) {
    const [userContext, setUserContext] = useContext(UserContext);
    const [pois, setPois] = useState<POI[]>([]);
    const [dates, setDates] = useState<number[]>([]);
    const [currentPOIIndex, setCurrentPOIIndex] = useState<number>(0);
    const [selectedPOIIndex, setSelectedPOIIndex] = useState<number>(0);
    const isFocused = useIsFocused();

    const { execute: getPOIs, loading: loadingPOIs } = useApi(
        () => poiService.getByCourse(route.params.course._id!),
        'CourseMap - getPOIs'
    );


    async function fetchData() {
        const result = await getPOIs();
        if (result) {
            const sortedPois = result.sort((a: POI, b: POI) => (a.dateStart || 0) - (b.dateStart || 0));
            setPois(sortedPois);
            sortedPois.forEach((element: { name: any; dateStart: any; }) => {
                console.log('POI:', element.name, 'DateStart:', element.dateStart);
            });
            setDates(sortedPois.map((poi: POI) => poi.dateStart || 0));
        }
    }


    const handleNavigateToCourse = (poi: POI) => {
        if (userContext.lifes <= 0) {
            showMessage({
                message: "Vies épuisées",
                description: "Vous n'avez plus de vies pour continuer ce chapitre. Veuillez réessayer plus tard.",
                type: "danger",
                duration: 4000,
            });
            return;
        }
        navigation.navigate('POICourse', {
            poi,
            onPOICompleted: (poiId: string, nbGoodAnswers: number) => {
                // Mettre à jour l'index du POI courant
                const index = pois.findIndex(p => p._id === poiId);
                if (index !== -1 && index + 1 < pois.length) {
                    setCurrentPOIIndex(index + 1);
                }
            },
        })
    };

    const handleSelectPOI = (poi: POI) => {
        const index = pois.findIndex(p => p._id === poi._id);
        if (index !== -1) {
            setSelectedPOIIndex(index);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isFocused]);

    return (
        <LinearGradient
            colors={[Colors.black, Colors.realBlack]}
            style={styles.container}>
            <ChapterHeader
                currentIndex={selectedPOIIndex}
                dates={dates}
            />
            <MapCourse
                pois={pois}
                currentIndex={currentPOIIndex}
                onNavigateToCourse={handleNavigateToCourse}
                onSelectPOI={handleSelectPOI}
            />
        </LinearGradient >
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
    },
})