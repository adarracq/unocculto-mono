import Button from '@/app/components/atoms/Button';
import LoadingScreen from '@/app/components/molecules/LoadingScreen';
import Colors from '@/app/constants/Colors';
import POIs from '@/app/constants/POIs';
import { useApi } from '@/app/hooks/useApi';
import POI from '@/app/models/POI';
import Theme from '@/app/models/Theme';
import { CoursesNavParams } from '@/app/navigations/CoursesNav';
import { chapterService } from '@/app/services/chapter.service';
import { courseService } from '@/app/services/course.service';
import { poiService } from '@/app/services/poi.service';
import { themeService } from '@/app/services/theme.service';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

type Props = NativeStackScreenProps<CoursesNavParams, 'Dev'>;

export default function DevAddPOI({ navigation, route }: Props) {

    const [themes, setThemes] = useState<Theme[]>([]);
    const [chapters, setChapters] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);

    const { execute: getThemes, loading: loadingThemes } = useApi(
        () => themeService.getAll(),
        'SetThemesScreen - getThemes'
    );

    const { execute: getChapters, loading: loadingChapters } = useApi(
        () => chapterService.getAll(),
        'SetThemesScreen - getChapters'
    );

    const { execute: getCourses, loading: loadingCourses } = useApi(
        () => courseService.getAll(),
        'SetThemesScreen - getCourses'
    );

    async function fetchData() {
        const result = await getThemes();
        if (result) {
            setThemes(result);
        }
        const chaptersResult = await getChapters();
        if (chaptersResult) {
            setChapters(chaptersResult);
        }
        const coursesResult = await getCourses();
        if (coursesResult) {
            setCourses(coursesResult);
        }
    }
    async function createPOIsInBDD() {
        const pois = POIs.pois;

        pois.forEach(async (poi, index) => {
            let _poi = new POI(
                poi.name,
                poi.labelFR,
                poi.labelEN,
                poi.location as { type: 'Point'; coordinates: [number, number] },
                poi.dateStart,
                poi.dateEnd,
                chapters.find(c => c.number.toString() === poi.chapterID)?._id,
                courses.find(c => c.number.toString() === poi.courseID)?._id,
                poi.entityID,
                // TODO : Replacer par des vrais IDs de thèmes
                poi.themes,
                poi.content as {
                    intro: string;
                    bodyMarkdown: string;
                    media: {
                        type: 'image' | 'video' | 'audio';
                        uri: string;
                    };
                },
                poi.quiz
            );
            poiService.create(_poi);
        });
    }

    useEffect(() => {
        fetchData();
    }, []);



    return (
        <LinearGradient
            colors={[Colors.mainDark, Colors.main, Colors.mainLight]}
            style={styles.container}>
            {loadingChapters || loadingCourses || loadingThemes ? <LoadingScreen /> :
                <Button
                    title="Ajouter les POIs dans la BDD"
                    backgroundColor={Colors.main}
                    onPress={async () => {
                        await createPOIsInBDD();
                    }}
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