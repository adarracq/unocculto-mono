import Button from '@/app/components/atoms/Button';
import Chapters from '@/app/constants/Chapters';
import Colors from '@/app/constants/Colors';
import Courses from '@/app/constants/Courses';
import POIs from '@/app/constants/POIs';
import { useApi } from '@/app/hooks/useApi';
import Chapter from '@/app/models/Chapter';
import Course from '@/app/models/Course';
import POI from '@/app/models/POI';
import Theme from '@/app/models/Theme';
import { CoursesNavParams } from '@/app/navigations/CoursesNav';
import { chapterService } from '@/app/services/chapter.service';
import { courseService } from '@/app/services/course.service';
import { poiService } from '@/app/services/poi.service';
import { themeService } from '@/app/services/theme.service';
import { functions } from '@/app/utils/Functions';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

type Props = NativeStackScreenProps<CoursesNavParams, 'Dev'>;

export default function DEV({ navigation, route }: Props) {

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
            await poiService.create(_poi);
        });
    }

    async function createCoursesInBDD() {
        const courses = Courses.courses;

        courses.forEach(async (course, index) => {
            if (course.icon) {
                let base64Icon = await functions.convertImageToBase64(course.icon);
                let _course = new Course(
                    course.number,
                    course.name,
                    course.labelFR,
                    course.labelEN,
                    course.descriptionFR,
                    course.descriptionEN,
                    base64Icon,
                );
                await courseService.create(_course);

            }
        });
    }

    async function createChaptersInBDD() {
        const chapters = Chapters.chapters;

        chapters.forEach(async (chapter, index) => {
            if (chapter.icon) {
                let base64Icon = await functions.convertImageToBase64(chapter.icon);
                let _chapter = new Chapter(
                    chapter.number,
                    chapter.name,
                    chapter.labelFR,
                    chapter.labelEN,
                    // convert icon name to base64 string
                    base64Icon,
                    chapter.dateStart,
                    chapter.dateEnd,
                    courses.find(c => c.number === chapter.courseNB)?._id,
                    chapter.courseNB
                );
                chapterService.create(_chapter);

            }
        });
    }

    useEffect(() => {
        fetchData();
    }, []);



    return (
        <LinearGradient
            colors={[Colors.mainDark, Colors.main, Colors.mainLight]}
            style={styles.container}>
            <Button
                title="Ajouter les POIs dans la BDD"
                backgroundColor={Colors.main}
                onPress={async () => {
                    await createPOIsInBDD();
                }}
            />
            <Button
                title="Ajouter les Cours dans la BDD"
                backgroundColor={Colors.main}
                onPress={async () => {
                    await createCoursesInBDD();
                }}
            />
            <Button
                title="Ajouter les Chapitres dans la BDD"
                backgroundColor={Colors.main}
                onPress={async () => {
                    await createChaptersInBDD();
                }}
            />

        </LinearGradient >
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        gap: 20,
        padding: 20,
    },
})