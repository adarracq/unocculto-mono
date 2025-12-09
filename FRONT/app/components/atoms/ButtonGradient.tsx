import { functions } from '@/app/utils/Functions';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';
import Title2 from './Title2';

type ButtonProps = {
  title: string;
  onPress: () => void;
  icon?: any;
  iconColor?: any;
  textColor?: any;
  style?: ViewStyle;
  disabled?: boolean;
  recommended?: boolean;
  // On remplace les couleurs de gradient par une couleur d'accentuation unique
  accentColor?: string;
}

export default function ModernSquircleButton(props: ButtonProps) {
  // Animation de scale pour l'effet "press" (très moderne)
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  // Animation de bump pour la flèche quand recommended
  const arrowBumpValue = useRef(new Animated.Value(1)).current;

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

  // Animation de bump pour la flèche
  useEffect(() => {
    if (props.recommended) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowBumpValue, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(arrowBumpValue, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      arrowBumpValue.setValue(1);
    }
  }, [props.recommended]);

  // Couleurs dynamiques basées sur le mode sombre
  const backgroundColor = props.disabled ? '#2C2C2C' : Colors.black; // Gris sombre mat
  const activeBorderColor = props.recommended ? (props.accentColor || Colors.main) : Colors.darkGrey;
  const textColor = props.disabled ? '#666666' : (props.textColor || '#FFFFFF');

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }], width: '100%' }, props.style]}>
      <Pressable
        onPress={props.disabled ? undefined : props.onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.container,
          {
            backgroundColor: backgroundColor,
            borderColor: activeBorderColor,
            borderWidth: props.recommended ? 2 : 1,
          }
        ]}
      >
        <View style={styles.contentRow}>
          <View style={styles.leftContent}>
            {/* Icône à gauche */}
            {props.icon && (
              <View style={[styles.iconContainer, { backgroundColor: props.disabled ? 'transparent' : Colors.lightGrey + '22' }]}>
                <Image
                  source={functions.getIconSource(props.icon)}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: props.disabled ? '#666' : (props.iconColor || Colors.black),
                  }}
                />
              </View>
            )}

            {/* Texte centré ou aligné */}
            <Title2
              title={props.title}
              color={textColor}
              // Assurez-vous que Title2 accepte un style pour la font-weight, le moderne aime le "Medium" (500/600)
              style={{ fontWeight: '600' }}
            />
          </View>

          {/* Flèche à droite avec animation bump */}
          <Animated.View style={[styles.arrowContainer, { transform: [{ scale: arrowBumpValue }] }]}>
            <Image
              source={functions.getIconSource('arrow-right')}
              style={{
                width: 20,
                height: 20,
                tintColor: props.disabled ? '#666' : (textColor),
              }}
            />
          </Animated.View>
        </View>

        {/* Badge "Recommandé" modernisé (Pillule flottante) */}
        {props.recommended && (
          <View style={[styles.badge, { backgroundColor: props.accentColor || Colors.main }]}>
            <Text style={styles.badgeText}>Recommandé</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72, // Un peu plus compact que 80 pour être plus élégant
    borderRadius: 20, // Radius élevé
    borderCurve: 'continuous',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,

    // Ombre subtile et diffuse (Glow effect) pour le mode sombre
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Espace moderne entre icône et texte
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
    borderCurve: 'continuous',
    // Petit fond subtil derrière l'icône pour la hiérarchie visuelle
  },
  arrowContainer: {
    opacity: 0.8, // Flèche visible mais subtile
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderCurve: 'continuous',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});