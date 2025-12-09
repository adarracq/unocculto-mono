import LoadingScreen from '@/app/components/molecules/LoadingScreen';
import TimelineConnector from '@/app/components/molecules/TimelineConnector';
import Colors from '@/app/constants/Colors';
import { UserContext } from '@/app/contexts/UserContext';
import { useApi } from '@/app/hooks/useApi';
import Chapter from '@/app/models/Chapter';
import { CoursesNavParams } from '@/app/navigations/CoursesNav';
import { chapterService } from '@/app/services/chapter.service';
import { userService } from '@/app/services/user.service';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { ScrollView } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import ChapterOnList from './components/ChapterOnList';
import SmallProfileHeader from './components/SmallProfileHeader';

type Props = NativeStackScreenProps<CoursesNavParams, 'ChaptersList'>;

export default function ChaptersListScreen({ navigation, route }: Props) {
    const [userContext, setUserContext] = useContext(UserContext);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [lastChapterIndex, setLastChapterIndex] = useState<number>(0);
    const isFocused = useIsFocused();

    const { execute: getChapters, loading: loadingChapters } = useApi(
        () => chapterService.getByCourseID(route.params.course._id!),
        'ChaptersListScreen - getChapters'
    );

    const { execute: refreshUser } = useApi(
        () => userService.getByEmail(userContext?.email || route.params.user.email),
        'ChaptersListScreen - refreshUser'
    );

    async function refreshUserData() {
        if (userContext?.email) {
            const updatedUser = await refreshUser();
            if (updatedUser) {
                setUserContext(updatedUser);
                return updatedUser;
            }
        }
        return route.params.user;
    }

    async function fetchChapters() {
        // Recharger les données utilisateur d'abord
        const currentUser = await refreshUserData();

        const result = await getChapters();
        if (result) {
            let _chapters = result.sort((a: Chapter, b: Chapter) => a.number - b.number);
            setChapters(_chapters);

            // Calculer l'index du dernier chapitre débloqué
            const lastIndex = getLastBumpedChapterIndex(currentUser, _chapters);
            setLastChapterIndex(lastIndex);
        }
    }

    function getLastBumpedChapterIndex(user = route.params.user, chapterList = chapters) {
        const chaptersCompleted: string[] = user.chaptersCompleted || [];

        // Trouver le dernier chapitre complété
        let lastCompletedIndex = -1;

        for (let i = 0; i < chapterList.length; i++) {
            const chapter = chapterList[i];
            if (chapter._id && chaptersCompleted.includes(chapter._id)) {
                lastCompletedIndex = i;
            }
        }

        return lastCompletedIndex + 1;
    }

    useEffect(() => {
        fetchChapters();
    }, [isFocused]);

    return (
        <LinearGradient
            colors={[Colors.darkGrey, Colors.realBlack]}
            style={styles.container}>
            <SmallProfileHeader user={userContext || route.params.user} />
            {loadingChapters ? (
                <LoadingScreen />
            ) :
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingVertical: 40,
                    }}
                >

                    {chapters.map((chapter, index) => {
                        const isRight = index % 2 === 1;
                        const isLast = index === chapters.length - 1;

                        return (
                            <React.Fragment key={index}>
                                {/* LE NOEUD DU CHAPITRE */}
                                <ChapterOnList
                                    chapter={chapter}
                                    isRight={isRight}
                                    isUnlocked={index <= lastChapterIndex}
                                    bumping={index === lastChapterIndex}
                                    onPress={() => {
                                        if (userContext.lifes <= 0) {
                                            showMessage({
                                                message: "Vies épuisées",
                                                description: "Vous n'avez plus de vies pour continuer ce chapitre. Veuillez réessayer plus tard.",
                                                type: "danger",
                                                duration: 4000,
                                            });
                                            return;
                                        }
                                        if (index <= lastChapterIndex) {
                                            navigation.navigate('Chapter', {
                                                chapter: chapter,
                                            });
                                        }
                                    }}
                                />

                                {/* LE CONNECTEUR VERS LE SUIVANT */}
                                {!isLast && (
                                    <TimelineConnector
                                        // On affiche la date de fin du chapitre actuel 
                                        // comme transition vers le suivant
                                        date={chapter.dateEnd}
                                        isNextRight={isRight} // Le prochain sera à l'opposé
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}

                    {/* Petit espace final */}
                    <View style={{ height: 50 }} />
                </ScrollView>
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