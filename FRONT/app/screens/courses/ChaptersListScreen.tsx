import LoadingScreen from '@/app/components/molecules/LoadingScreen';
import Colors from '@/app/constants/Colors';
import { useApi } from '@/app/hooks/useApi';
import Chapter from '@/app/models/Chapter';
import Theme from '@/app/models/Theme';
import { CoursesNavParams } from '@/app/navigations/CoursesNav';
import { chapterService } from '@/app/services/chapter.service';
import { themeService } from '@/app/services/theme.service';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import ChapterOnList from './components/ChapterOnList';
import POIStats from './components/POIStats';
import SmallProfileHeader from './components/SmallProfileHeader';

type Props = NativeStackScreenProps<CoursesNavParams, 'ChaptersList'>;

export default function ChaptersListScreen({ navigation, route }: Props) {
    const [chaptersStats, setChaptersStats] = useState<{
        chapter: Chapter,
        stats:
        {
            completed: number,
            total: number,
            themeID: string
        }[]
    }[]
    >([]);
    const [themes, setThemes] = useState<Theme[]>([]);
    const [lastChapterIndex, setLastChapterIndex] = useState<number>(0);

    const { execute: getChapters, loading: loadingChapters } = useApi(
        () => chapterService.getByCourseID(route.params.course._id!),
        'ChaptersListScreen - getChapters'
    );


    const { execute: getThemes, loading: loadingThemes } = useApi(
        () => themeService.getAll(),
        'ChaptersListScreen - getThemes'
    );


    const { execute: getChapterStats, loading: loadingChapterStats } = useApi(
        (chapterID: string) => chapterService.getChapterStats(chapterID, route.params.user._id!),
        'ChaptersListScreen - getChapters'
    );

    async function fetchThemes() {
        const result = await getThemes();
        if (result) {
            setThemes(result);
        }
    }

    async function fetchChapters() {
        const result = await getChapters();
        if (result) {
            let _chapters = result.sort((a: Chapter, b: Chapter) => a.number - b.number);
            const lastIndex = getLastBumpedChapterIndex();
            setLastChapterIndex(lastIndex);

            let _chaptersStats: {
                chapter: Chapter,
                stats:
                {
                    completed: number,
                    total: number,
                    themeID: string
                }[]
            }[] = [];
            for (let chapter of _chapters) {
                if (chapter.number <= lastIndex) {
                    const stats = await getChapterStats(chapter._id!);
                    if (stats) {
                        _chaptersStats.push({
                            chapter: chapter,
                            stats: stats
                        });
                    }
                }
                else {
                    _chaptersStats.push({
                        chapter: chapter,
                        stats: []
                    });
                }

            }
            setChaptersStats(_chaptersStats);
        }
    }
    function getLastBumpedChapterIndex() {
        for (let i = chaptersStats.length - 1; i >= 0; i--) {
            const chapterStat = chaptersStats[i];
            const totalCompleted = chapterStat.stats.reduce((acc, stat) => acc + stat.completed, 0);
            const totalPOIs = chapterStat.stats.reduce((acc, stat) => acc + stat.total, 0);
            if (totalCompleted < totalPOIs * 0.7) {
                setLastChapterIndex(i);
                return i;
            }
        }
        return 0;
    }

    useEffect(() => {
        fetchThemes();
        fetchChapters();
    }, []);

    if (loadingChapters || loadingThemes || loadingChapterStats) {
        return <LoadingScreen />
    }


    return (
        <LinearGradient
            colors={[Colors.mainDark, Colors.main, Colors.mainLight]}
            style={styles.container}>
            <SmallProfileHeader user={route.params.user} />
            <ScrollView contentContainerStyle={{
                padding: 20,
                gap: 40,
            }}>
                {
                    chaptersStats.map((chapterStat, index) => (
                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {index % 2 === 0 ?
                                index <= lastChapterIndex ?
                                    <POIStats
                                        stats={chapterStat.stats}
                                        themes={themes} />
                                    : <View></View>
                                : null
                            }

                            <ChapterOnList
                                key={index}
                                chapter={chapterStat.chapter}
                                percentage={chapterStat.stats.reduce((acc, stat) => acc + (stat.total === 0 ? 0 : stat.completed / stat.total), 0) / chapterStat.stats.length}
                                isUnlocked={index > lastChapterIndex ? false : true}
                                bumping={index === lastChapterIndex}
                                onPress={() => {
                                    console.log('Pressed chapter: ' + chapterStat.chapter.labelFR);
                                }} />
                            {index % 2 === 1 ?
                                index <= lastChapterIndex ?
                                    <POIStats
                                        stats={chapterStat.stats}
                                        themes={themes} />
                                    : <View></View>
                                : null
                            }
                        </View>
                    ))
                }
            </ScrollView>
        </LinearGradient >
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
    },
})