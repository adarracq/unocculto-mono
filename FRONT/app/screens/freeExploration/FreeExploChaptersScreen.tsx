import LoadingScreen from '@/app/components/molecules/LoadingScreen';
import TimelineConnector from '@/app/components/molecules/TimelineConnector';
import Colors from '@/app/constants/Colors';
import { useApi } from '@/app/hooks/useApi';
import Chapter from '@/app/models/Chapter';
import POI from '@/app/models/POI';
import { CoursesNavParams } from '@/app/navigations/CoursesNav';
import { chapterService } from '@/app/services/chapter.service';
import { poiService } from '@/app/services/poi.service';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import SmallProfileHeader from '../courses/components/SmallProfileHeader';
import FreeExploChapter from './components/FreeExploChapter';

type Props = NativeStackScreenProps<CoursesNavParams, 'FreeExploChapters'>;

export default function FreeExploChaptersScreen({ navigation, route }: Props) {

    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [pois, setPois] = useState<POI[]>([]);

    const { execute: getChapters, loading: loadingChapters } = useApi(
        () => chapterService.getByCourseID(route.params.course._id!),
        'FreeExploChapters - getChapters'
    );

    const { execute: getPOIs, loading: loadingPOIs } = useApi(
        () => poiService.getByCourse(route.params.course._id!),
        'FreeExploChapters - getPOIs'
    );

    const fetchDatas = async () => {
        const chapters = await getChapters();
        if (chapters) {
            let _chapters = chapters.sort((a: Chapter, b: Chapter) => a.number - b.number);
            setChapters(_chapters);
        }
        const pois = await getPOIs();
        if (pois) {
            setPois(pois.sort((a: POI, b: POI) => a.dateStart - b.dateStart));
        }
    }

    useEffect(() => {
        fetchDatas();
    }, []);


    return (
        <LinearGradient
            // Assure-toi que ces couleurs créent un beau dégradé
            colors={[Colors.darkGrey, Colors.realBlack]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SmallProfileHeader user={route.params.user} />
            {
                loadingChapters && <LoadingScreen />
            }

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {chapters.map((chapterItem: Chapter, index: number) => (
                    <View key={chapterItem._id || index}>
                        <FreeExploChapter
                            chapter={chapterItem}
                            isRight={index % 2 !== 0} // Alterne Gauche / Droite
                            isLast={index === chapters.length - 1} // Pour cacher la ligne du dernier
                            pois={pois.filter(p => p.chapterID === chapterItem._id)}
                            onPressPOI={(poi) => navigation.navigate('POICourse', {
                                poi,
                                onPOICompleted: undefined,
                                isFreeExplo: true,
                            })}
                        />
                        {index < chapters.length - 1 &&
                            <TimelineConnector
                                date={chapterItem.dateEnd}
                                isNextRight={index % 2 === 0}
                                withLine
                            />}
                    </View>
                ))}
                {/* Espace en bas pour le scroll */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </LinearGradient >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 0, // On gère le padding dans les items
        paddingTop: 20,
        gap: 20, // Espace vertical entre les cartes
    },
})