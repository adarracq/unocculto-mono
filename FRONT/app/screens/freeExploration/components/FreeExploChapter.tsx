import BodyText from '@/app/components/atoms/BodyText';
import SmallText from '@/app/components/atoms/SmallText';
import Title1 from '@/app/components/atoms/Title1';
import Colors from '@/app/constants/Colors';
import { CourseThemesContext } from '@/app/contexts/CourseThemesContext';
import Chapter from '@/app/models/Chapter';
import POI from '@/app/models/POI';
import Theme from '@/app/models/Theme';
import { functions } from '@/app/utils/Functions';
import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';

type Props = {
    chapter: Chapter;
    pois: POI[];
    onPressPOI: (poi: POI) => void;
    isRight?: boolean;
    isLast?: boolean;
}

export default function FreeExploChapter(props: Props) {

    const [showPOIs, setShowPOIs] = React.useState(false);
    const scaleValue = React.useRef(new Animated.Value(1)).current;
    const [themes] = useContext(CourseThemesContext);
    const [pressedPOI, setPressedPOI] = React.useState<string | null>(null);

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.96,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    // Animation pour un POI spécifique
    const handlePOIPressIn = (poiId: string) => {
        setPressedPOI(poiId);
    };

    const handlePOIPressOut = () => {
        setPressedPOI(null);
    };

    return (
        <View style={styles.rowContainer}>
            <Animated.View style={[{ transform: [{ scale: scaleValue }] }]}>
                <Pressable
                    onPress={() => setShowPOIs(!showPOIs)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={[
                        styles.cardContainer
                    ]}
                >
                    {/* En-tête de la carte : Icone + Titre */}
                    <View style={styles.header}>
                        {!props.isRight && <View style={{ flex: 1 }}>
                            <Title1 title={props.chapter.labelFR} isRight />
                        </View>}
                        <View style={styles.iconWrapper}>
                            <Image
                                source={{ uri: props.chapter.base64Icon }}
                                style={styles.icon}
                            />
                        </View>
                        {props.isRight && <View style={{ flex: 1 }}>
                            <Title1 title={props.chapter.labelFR} isLeft />
                        </View>}
                    </View>
                    {showPOIs && (
                        <View style={{ paddingVertical: 10 }}>
                            {props.pois.map((poi: POI, index: number) => {
                                // Récupération du premier thème pour l'icône
                                const mainTheme = ((): Theme | null => {
                                    if (poi.themes && poi.themes.length > 0) {
                                        const theme = themes?.find((t: Theme) => t._id === poi.themes[0]);
                                        return theme || null;
                                    }
                                    return null;
                                })();
                                const isLastItem = index === props.pois.length - 1;
                                const isPressed = pressedPOI === poi._id;

                                return (
                                    <Animated.View
                                        style={[{
                                            transform: [{
                                                scale: isPressed ? 0.96 : 1
                                            }]
                                        }]}
                                        key={poi._id || index}
                                    >
                                        <Pressable
                                            onPress={() => poi._id && props.onPressPOI(poi)}
                                            onPressIn={() => poi._id && handlePOIPressIn(poi._id)}
                                            onPressOut={handlePOIPressOut}
                                            style={styles.timelineItem}
                                        >

                                            {/* --- COLONNE GAUCHE : TIMELINE --- */}
                                            <View style={styles.timelineLeft}>
                                                {/* Ligne verticale (sauf après le dernier item si on veut s'arrêter net) */}
                                                {!isLastItem && <View style={styles.timelineLine} />}

                                                {/* Bulle / Icone du thème */}
                                                <View style={styles.timelineBubble}>
                                                    {mainTheme && mainTheme.base64Icon ? (
                                                        <Image
                                                            source={{ uri: mainTheme.base64Icon }}
                                                            style={styles.themeIcon}
                                                            resizeMode="contain"
                                                        />
                                                    ) : (
                                                        <View style={styles.defaultDot} />
                                                    )}
                                                </View>
                                            </View>

                                            {/* --- COLONNE DROITE : CONTENU --- */}
                                            <View style={styles.timelineContent}>
                                                <View style={styles.poiCard}>
                                                    <View style={{ flex: 1 }}>
                                                        <BodyText
                                                            text={poi.labelFR}
                                                            color={Colors.white}
                                                            isBold
                                                        />
                                                        <View style={styles.metaRow}>
                                                            {/* Petite icône horloge ou calendrier si tu as, sinon juste le texte */}
                                                            <View style={styles.timeBadge}>
                                                                <Ionicons name="time-outline" size={16} color={Colors.lightGrey} />
                                                                <SmallText
                                                                    text={functions.simpleDateToString(poi.dateStart)}
                                                                    color={Colors.lightGrey} // Une touche de couleur pour la date
                                                                    isLeft
                                                                />
                                                            </View>
                                                            {/* Optionnel : Badge du thème */}
                                                            {mainTheme && (
                                                                <View style={styles.themeBadge}>
                                                                    <Image
                                                                        // Assure-toi que le base64 a le préfixe, sinon ajoute 'data:image/png;base64,' + ...
                                                                        source={{ uri: mainTheme.base64Icon }}
                                                                        style={{ width: 12, height: 12 }}
                                                                        resizeMode="contain"
                                                                    />
                                                                    <SmallText
                                                                        text={mainTheme.labelFR}
                                                                        color={Colors.white}
                                                                    />
                                                                </View>
                                                            )}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </Pressable>
                                    </Animated.View>
                                );
                            })}
                        </View>
                    )}
                    <View style={styles.statusBadge}>
                        <BodyText
                            text={showPOIs ? 'Voir moins' : 'Voir plus'}
                            color={Colors.white}
                        />
                    </View>
                </Pressable>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    rowContainer: {
        position: 'relative',
        marginVertical: 10,
        width: '100%',
    },
    // Le design de la carte
    cardContainer: {
        flex: 1,
        backgroundColor: Colors.black,
        borderRadius: 20,
        borderCurve: 'continuous',
        padding: 20,
        marginHorizontal: 20,
        // Ombre subtile et diffuse (Glow effect) pour le mode sombre
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: Colors.darkGrey
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 16,
        borderCurve: 'continuous',
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 36,
        height: 36,
        resizeMode: 'contain',
    },
    statusBadge: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.main,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderCurve: 'continuous',
    },
    // Styles pour la ligne de connexion
    connectorLine: {
        position: 'absolute',
        width: 2,
        height: 100, // Hauteur suffisante pour toucher le prochain item
        backgroundColor: Colors.lightGrey,
        left: '50%',
        bottom: -50,
        zIndex: -1,
    },
    // --- TIMELINE STYLES ---
    timelineItem: {
        flexDirection: 'row',
        minHeight: 60, // Hauteur min pour que la ligne soit jolie
    },
    timelineLeft: {
        width: 40,
        alignItems: 'center',
        position: 'relative',
    },
    timelineLine: {
        position: 'absolute',
        top: 15, // Commence au milieu de l'icône
        bottom: -15, // Descend jusqu'au prochain item
        width: 2,
        backgroundColor: Colors.darkGrey, // Ou une couleur subtile
        zIndex: 0,
    },
    timelineBubble: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.black, // Fond derrière l'icône pour cacher la ligne
        borderWidth: 1,
        borderColor: Colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        marginTop: 2, // Pour aligner avec le texte
    },
    themeIcon: {
        width: 18,
        height: 18,
        tintColor: Colors.white,
    },
    defaultDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.white,
    },
    timelineContent: {
        flex: 1,
        paddingBottom: 20, // Espace entre les items
        paddingRight: 10,
    },
    poiCard: {
        backgroundColor: 'rgba(255,255,255,0.08)', // Fond léger translucide
        borderRadius: 12,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    themeBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: Colors.main,
        borderRadius: 16,
        borderCurve: 'continuous',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    timeBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        borderCurve: 'continuous',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
});