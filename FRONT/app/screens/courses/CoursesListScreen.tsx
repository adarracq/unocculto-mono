import Colors from '@/app/constants/Colors';
import { useApi } from '@/app/hooks/useApi';
import Course from '@/app/models/Course';
import { CoursesNavParams } from '@/app/navigations/CoursesNav';
import { courseService } from '@/app/services/course.service';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import CourseOnList from './components/CourseOnList';
import SmallProfileHeader from './components/SmallProfileHeader';

type Props = NativeStackScreenProps<CoursesNavParams, 'CoursesList'>;

export default function CoursesListScreen({ navigation, route }: Props) {

    const [courses, setCourses] = useState<Course[]>([]);


    const { execute: getCourses, loading: loadingCourses } = useApi(
        () => courseService.getAll(),
        'CoursesListScreen - getCourses'
    );

    async function fetchCourses() {
        const result = await getCourses();
        if (result) {
            setCourses(result.sort((a: Course, b: Course) => a.number - b.number));
        }
    }

    useEffect(() => {
        fetchCourses();
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

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {courses.map((courseItem, index) => (
                    <CourseOnList
                        key={courseItem._id || index} // Préfère _id si disponible
                        course={courseItem}
                        isRight={index % 2 !== 0} // Alterne Gauche / Droite
                        isLast={index === courses.length - 1} // Pour cacher la ligne du dernier
                        onPress={() => {
                            navigation.navigate('ChaptersList', {
                                course: courseItem,
                                user: route.params.user,
                            });
                        }}
                    />
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