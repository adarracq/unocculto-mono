import BodyText from '@/app/components/atoms/BodyText';
import SmallText from '@/app/components/atoms/SmallText';
import Colors from '@/app/constants/Colors';
import { UserContext } from '@/app/contexts/UserContext';
import Theme from '@/app/models/Theme';
import { CoursesNavParams } from '@/app/navigations/CoursesNav';
import { functions } from '@/app/utils/Functions';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import LifeHeader from './components/LifeHeader';
import POIHeader from './components/POIHeader';
import POIQuiz from './components/POIQuiz';

type Props = NativeStackScreenProps<CoursesNavParams, 'POICourse'>;

export default function POICourseScreen({ navigation, route }: Props) {

    // On récupère le POI et le callback passé en paramètre
    const { poi, onPOICompleted } = route.params;
    const [themes, setThemes] = useState<Theme[]>([]);
    const [userContext, setUserContext] = useContext(UserContext);

    const handleQuizComplete = async (nbGoodAnswers: number) => {
        // Marquer le POI comme terminé avec son ID
        if (onPOICompleted && poi._id) {
            onPOICompleted(poi._id, nbGoodAnswers);
        }

        navigation.goBack();
    }

    // Filtrer les thèmes du POI
    const activeThemes = themes.filter(t => poi.themes.includes(t._id!));


    return (
        <View style={styles.container}>
            {!route.params.isFreeExplo &&
                <LifeHeader user={userContext} />
            }

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>

                {/* 1. HEADER IMMERSIF */}
                <POIHeader
                    title={poi.labelFR}
                    imageUrl={poi.content.media.uri}
                    onBack={() => navigation.goBack()}
                />

                {/* 2. CONTENU PRINCIPAL */}
                <LinearGradient
                    colors={[Colors.black, '#111']} // Fond dégradé sombre
                    style={styles.contentContainer}
                >
                    {/* INFO META (Date & Thèmes) */}
                    <View style={styles.metaRow}>
                        <ScrollView horizontal contentContainerStyle={styles.themeRow}>
                            {activeThemes.map(t => (
                                <View key={t._id} style={[styles.themeBadge, { backgroundColor: Colors.main }]}>
                                    <Image source={{ uri: t.base64Icon }} style={{ width: 16, height: 16 }} />
                                    <SmallText style={styles.themeText} text={t.labelFR} isBold />
                                </View>
                            ))}
                        </ScrollView>
                        <View style={styles.dateBadge}>
                            <Ionicons name="time-outline" size={16} color={Colors.main} />
                            <BodyText text={functions.dateToString(poi.dateStart)} />
                        </View>
                        <View style={styles.dateBadge}>
                            <Ionicons name="location-outline" size={16} color={Colors.main} />
                            <BodyText text={poi.location.labelFR} />
                        </View>
                    </View>

                    {/* INTRODUCTION */}
                    <BodyText style={styles.introText} text={poi.content.intro} isItalic />

                    <View style={styles.divider} />

                    {/* CORPS DU COURS (Markdown) */}
                    <Markdown
                        style={{
                            body: styles.bodyText,
                            heading: styles.titles,
                            heading1: styles.titles,
                            heading2: styles.titles,
                            heading3: styles.titles,
                        }}
                    >
                        {poi.content.bodyMarkdown}
                    </Markdown>

                    {/* 3. QUIZ */}
                    {poi.quiz && poi.quiz.length > 0 && (
                        <POIQuiz
                            quizData={poi.quiz}
                            onQuizComplete={handleQuizComplete}
                        />
                    )}

                </LinearGradient>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },

    contentContainer: {
        flex: 1,
        padding: 20,
        minHeight: 600,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -30, // Remonte sur l'image header
    },

    // Meta Info
    metaRow: {
        flexDirection: 'column',
        gap: 10,
        marginBottom: 20
    },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderCurve: 'continuous',
        alignSelf: 'flex-start'
    },
    themeRow: { flexDirection: 'row', gap: 8 },
    themeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderCurve: 'continuous',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    themeText: {
        color: Colors.white,
        textTransform: 'uppercase'
    },

    // Texte
    introText: {
        fontSize: 20,
        lineHeight: 28,
        marginBottom: 20,
        color: Colors.main
    },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', width: '50%', marginBottom: 20 },
    bodyText: {
        fontSize: 16,
        lineHeight: 24,
        color: Colors.lightGrey,
        fontFamily: 'text-regular',
    },
    titles: {
        fontFamily: 'title-medium',
        lineHeight: 34,
        color: Colors.white,
        marginTop: 20,
        marginBottom: 10
    },
});