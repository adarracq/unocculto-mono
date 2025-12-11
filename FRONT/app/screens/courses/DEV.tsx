import worldData2 from '@/app/assets/zones/world_bc10000.json';
import worldData from '@/app/assets/zones/world_bc123000.json';
import worldData7 from '@/app/assets/zones/world_bc2000.json';
import worldData6 from '@/app/assets/zones/world_bc3000.json';
import worldData5 from '@/app/assets/zones/world_bc4000.json';
import worldData4 from '@/app/assets/zones/world_bc5000.json';
import worldData3 from '@/app/assets/zones/world_bc8000.json';
import Button from '@/app/components/atoms/Button';
import LoadingScreen from '@/app/components/molecules/LoadingScreen';
import Chapters from '@/app/constants/Chapters';
import Colors from '@/app/constants/Colors';
import Courses from '@/app/constants/Courses';
import POIs from '@/app/constants/POIs';
import { useApi } from '@/app/hooks/useApi';
import Chapter from '@/app/models/Chapter';
import Course from '@/app/models/Course';
import Entity from '@/app/models/Entity';
import EntitySnapshot from '@/app/models/EntitySnapshot';
import POI from '@/app/models/POI';
import Theme from '@/app/models/Theme';
import { CoursesNavParams } from '@/app/navigations/CoursesNav';
import { chapterService } from '@/app/services/chapter.service';
import { courseService } from '@/app/services/course.service';
import { entityService } from '@/app/services/entity.service';
import { entitySnapshotService } from '@/app/services/entitySnapshot.service';
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
            console.log('Chapters in BDD:');
            chaptersResult.forEach((chapter: any) => {
                console.log('Chapter in BDD:', chapter._id, chapter.number, chapter.name);
            });
        }
        const coursesResult = await getCourses();
        if (coursesResult) {
            setCourses(coursesResult);
            coursesResult.forEach((course: any) => {
                console.log('Course in BDD:', course._id, course.number, course.name);
            });
        }
    }
    async function createPOIsInBDD() {
        const pois = POIs.pois;
        //const pois = POIC1.pois;

        pois.forEach(async (poi, index) => {
            let _poi = new POI(
                poi.name,
                poi.labelFR,
                poi.labelEN,
                poi.location as { type: 'Point'; coordinates: [number, number], labelFR: string, labelEN: string },
                poi.dateStart,
                poi.dateEnd,
                chapters.find(c => c.number.toString() === poi.chapterID && c.courseNB.toString() === poi.courseID)?._id,
                courses.find(c => c.number.toString() === poi.courseID)?._id,
                poi.entityID,
                poi.entityName,
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
                await chapterService.create(_chapter);

            }
        });
    }

    useEffect(() => {
        fetchData();
    }, []);



    // ENTITIES PART ------------------------------

    const [entities, setEntities] = useState<Entity[]>([]);


    const { execute: getEntities, loading: loadingEntities } = useApi(
        () => entityService.getAll(),
        'SetThemesScreen - getChapters'
    );

    const fetchEntities = async () => {
        const entitiesFromApi = await getEntities();
        setEntities(entitiesFromApi || []);
    };
    const getSnapshots = (datas: any, year: number) => {
        const empires = new Set<string>();
        (datas as any).features.forEach(async (feature: any) => {
            if (feature.properties.PARTOF && feature.properties.PARTOF !== null) {
                empires.add(feature.properties.PARTOF);
                let entity = entities.find(e => e.name === feature.properties.PARTOF);
                if (entity?._id) {
                    let _es = new EntitySnapshot(
                        entity._id,
                        entity.name,
                        year,
                        feature.geometry
                    );
                    console.log('Snapshot to create:', _es);
                    await entitySnapshotService.create(_es);
                }

            }
        });
        return Array.from(empires);
    };

    const createSnapshotsInBDD = async () => {
        const empireNames = getSnapshots(worldData, -123000);
        const empireNames2 = getSnapshots(worldData2, -10000);
        const empireNames3 = getSnapshots(worldData3, -8000);
        const empireNames4 = getSnapshots(worldData4, -5000);
        const empireNames5 = getSnapshots(worldData5, -4000);
        const empireNames6 = getSnapshots(worldData6, -3000);
        const empireNames7 = getSnapshots(worldData7, -2000);
    };
    //saveSnapshots();

    const saveEntities = async () => {
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            await entityService.create({
                name: entity.name,
                labelFR: entity.labelFR,
                labelEN: entity.labelEN,
                descriptionMarkDownFR: entity.descriptionMarkDownFR,
                descriptionMarkDownEN: entity.descriptionMarkDownEN,
                dateStart: entity.dateStart,
                dateEnd: entity.dateEnd,
                type: entity.type,
                _id: null,
                availableSnapshots: entity.availableSnapshots || [],
            });
            console.log(`Entity saved: ${entity.labelFR}`);
        }
    };
    //saveEntities();

    useEffect(() => {
        fetchEntities();
    }, []);
    // ----------------------------------------------


    if (loadingChapters || loadingCourses || loadingThemes || loadingEntities) {
        return <LoadingScreen />;
    }



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

            <Button
                title="Ajouter les Snapshots dans la BDD"
                backgroundColor={Colors.main}
                onPress={async () => {
                    await createSnapshotsInBDD();
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