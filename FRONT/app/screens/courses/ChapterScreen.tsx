import Colors from '@/app/constants/Colors';
import { UserContext } from '@/app/contexts/UserContext';
import { useApi } from '@/app/hooks/useApi';
import POI from '@/app/models/POI';
import { CoursesNavParams } from '@/app/navigations/CoursesNav';
import { poiService } from '@/app/services/poi.service';
import { userService } from '@/app/services/user.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import ChapterHeader from './components/ChapterHeader';
import MapChapter0 from './components/MapChapter0';
import MapChapter1 from './components/MapChapter1';
import MapChapter2And3 from './components/MapChapter2And3';
import MapChapters from './components/MapChapters';

type Props = NativeStackScreenProps<CoursesNavParams, 'Chapter'>;

export default function ChapterScreen({ navigation, route }: Props) {
    const [userContext, setUserContext] = useContext(UserContext);
    const [pois, setPois] = useState<POI[]>([]);
    const [dates, setDates] = useState<number[]>([]);
    const [currentPOIIndex, setCurrentPOIIndex] = useState<number>(0);
    const [selectedPOIIndex, setSelectedPOIIndex] = useState<number>(0);
    const [completedPOIsCount, setCompletedPOIsCount] = useState<number>(0);
    const [completedPOIs, setCompletedPOIs] = useState<boolean[]>([]); // Track quels POIs sont complétés
    const [nbGoodAnswers, setNbGoodAnswers] = useState<number>(0);
    const isFocused = useIsFocused();

    const { execute: getPOIs, loading: loadingPOIs } = useApi(
        () => poiService.getByChapter(route.params.chapter._id!),
        'ChapterScreen - getPOIs'
    );

    const { execute: addCompletedChapter } = useApi(
        (nbQuestions: number) => userService.addCompletedChapter(route.params.chapter._id!, nbQuestions),
        'ChapterScreen - addCompletedChapter'
    );

    // Vérifier si le chapitre est complété
    const isChapterCompleted = useMemo(() => {
        return userContext?.chaptersCompleted?.includes(route.params.chapter._id!) || false;
    }, [userContext?.chaptersCompleted, route.params.chapter._id]);

    // Vérifier si tous les POIs sont terminés localement
    const allPOIsCompleted = useMemo(() => {
        const result = pois.length > 0 && completedPOIsCount >= pois.length;
        return result;
    }, [completedPOIsCount, pois.length]);

    async function fetchData() {
        const result = await getPOIs();
        if (result) {
            const sortedPois = result.sort((a: POI, b: POI) => (a.dateStart || 0) - (b.dateStart || 0));
            setPois(sortedPois);
            setDates(sortedPois.map((poi: POI) => poi.dateStart || 0));

            // Si le chapitre est complété, on affiche tous les POIs
            if (isChapterCompleted) {
                setCurrentPOIIndex(sortedPois.length);
                setCompletedPOIsCount(sortedPois.length);
                setCompletedPOIs(new Array(sortedPois.length).fill(true));
            } else {
                // Récupérer la progression sauvegardée
                try {
                    const savedProgress = await AsyncStorage.getItem(`chapter_${route.params.chapter._id}_progress`);
                    if (savedProgress) {
                        const progress = JSON.parse(savedProgress);
                        setCompletedPOIsCount(progress.count || 0);
                        setCurrentPOIIndex(progress.count || 0);
                        setCompletedPOIs(progress.completedPOIs || new Array(sortedPois.length).fill(false));
                        setNbGoodAnswers(progress.nbGoodAnswers || 0);
                    } else {
                        setCompletedPOIs(new Array(sortedPois.length).fill(false));
                    }
                } catch (error) {
                    console.error('Error loading saved progress:', error);
                    setCompletedPOIs(new Array(sortedPois.length).fill(false));
                }
            }
        }
    }

    // Fonction appelée quand un POI est terminé
    const handlePOICompleted = async (poiId: string, _nbGoodAnswers: number) => {
        if (!isChapterCompleted) {
            // Trouver l'index du POI
            const poiIndex = pois.findIndex(p => p._id === poiId);

            // Vérifier si ce POI n'a pas déjà été complété
            if (poiIndex !== -1 && !completedPOIs[poiIndex]) {
                const newCompletedPOIs = [...completedPOIs];
                newCompletedPOIs[poiIndex] = true;

                const newCount = completedPOIsCount + 1;
                const newNbGoodAnswers = nbGoodAnswers + _nbGoodAnswers;

                setCompletedPOIs(newCompletedPOIs);
                setCompletedPOIsCount(newCount);
                setCurrentPOIIndex(newCount);
                setNbGoodAnswers(newNbGoodAnswers);

                // Sauvegarder la progression
                try {
                    const progressData = {
                        count: newCount,
                        completedPOIs: newCompletedPOIs,
                        nbGoodAnswers: newNbGoodAnswers
                    };
                    await AsyncStorage.setItem(`chapter_${route.params.chapter._id}_progress`, JSON.stringify(progressData));
                } catch (error) {
                    console.error('Error saving progress:', error);
                }
            } else {
                console.log('POI already completed or not found:', poiId);
            }
        }
    };

    // Fonction appelée quand le chapitre est complété
    const handleChapterCompleted = async () => {
        if (userContext && route.params.chapter._id) {
            // Mettre à jour la base de données
            await addCompletedChapter(nbGoodAnswers);

            // Nettoyer la progression sauvegardée
            try {
                await AsyncStorage.removeItem(`chapter_${route.params.chapter._id}_progress`);
            } catch (error) {
                console.error('Error clearing saved progress:', error);
            }

            // Mettre à jour le contexte local
            const updatedContext = {
                ...userContext,
                chaptersCompleted: [...(userContext.chaptersCompleted || []), route.params.chapter._id]
            };
            setUserContext(updatedContext);

            // Naviguer vers la liste des chapitres
            navigation.goBack();
        }
    };

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
            onPOICompleted: handlePOICompleted,
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
            {
                route.params.chapter.courseNB == 0 && route.params.chapter.number == 0 ?
                    <MapChapter0
                        pois={pois}
                        currentIndex={currentPOIIndex}
                        isChapterCompleted={allPOIsCompleted || isChapterCompleted}
                        onNavigateToCourse={handleNavigateToCourse}
                        onChapterCompleted={handleChapterCompleted}
                        onSelectPOI={handleSelectPOI}
                    />
                    :
                    route.params.chapter.courseNB == 0 && route.params.chapter.number == 1 ?
                        <MapChapter1
                            pois={pois}
                            currentIndex={currentPOIIndex}
                            isChapterCompleted={allPOIsCompleted || isChapterCompleted}
                            onNavigateToCourse={handleNavigateToCourse}
                            onChapterCompleted={handleChapterCompleted}
                            onSelectPOI={handleSelectPOI}
                        />
                        :
                        // les autres chapitres du cours 0
                        route.params.chapter.courseNB == 0 ?
                            <MapChapter2And3
                                pois={pois}
                                currentIndex={currentPOIIndex}
                                isChapterCompleted={allPOIsCompleted || isChapterCompleted}
                                onNavigateToCourse={handleNavigateToCourse}
                                onChapterCompleted={handleChapterCompleted}
                                onSelectPOI={handleSelectPOI}
                            />
                            :
                            <MapChapters
                                pois={pois}
                                currentIndex={currentPOIIndex}
                                isChapterCompleted={allPOIsCompleted || isChapterCompleted}
                                onNavigateToCourse={handleNavigateToCourse}
                                onChapterCompleted={handleChapterCompleted}
                                onSelectPOI={handleSelectPOI}
                            />
            }
        </LinearGradient >
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
    },
})