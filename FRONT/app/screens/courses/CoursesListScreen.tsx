import LoadingScreen from '@/app/components/molecules/LoadingScreen';
import Colors from '@/app/constants/Colors';
import { useApi } from '@/app/hooks/useApi';
import Course from '@/app/models/Course';
import { CoursesNavParams } from '@/app/navigations/CoursesNav';
import { courseService } from '@/app/services/course.service';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
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
            colors={[Colors.mainDark, Colors.main, Colors.mainLight]}
            style={styles.container}>
            <SmallProfileHeader user={route.params.user} />
            <ScrollView contentContainerStyle={{
                padding: 20,
                gap: 40,
            }}>
                {
                    courses.map((courseItem, index) => (
                        <CourseOnList
                            key={index}
                            course={courseItem}
                            isUnlocked={true}
                            isRight={index % 2 === 0}
                            onPress={() => {
                                navigation.navigate('ChaptersList', {
                                    course: courseItem,
                                    user: route.params.user,
                                });
                            }}
                        />
                    ))
                }
                {/*<Button
                    title="Create Courses in BDD"
                    backgroundColor={Colors.white}
                    onPress={async () => {
                        await createCoursesInBDD();
                    }}
                />*/}
            </ScrollView>
            {
                loadingCourses && <LoadingScreen />
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