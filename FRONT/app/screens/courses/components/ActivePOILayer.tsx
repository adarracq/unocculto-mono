import Colors from '@/app/constants/Colors';
import Mapbox from '@rnmapbox/maps';
import React, { useEffect, useState } from 'react';

type Props = {
    coordinate: number[]; // [longitude, latitude]
}

export default function ActivePOILayer({ coordinate }: Props) {
    // On utilise un simple booléen pour gérer l'état "Petit" ou "Grand"
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // On crée une boucle infinie qui inverse l'état toutes les 1 seconde
        const interval = setInterval(() => {
            setIsExpanded(prev => !prev);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const pointGeoJSON = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: coordinate,
                },
            },
        ],
    };

    return (
        <Mapbox.ShapeSource id="active-poi-source" shape={pointGeoJSON as any}>

            {/* 1. Le cercle BLANC extérieur (Fixe) */}

            <Mapbox.CircleLayer
                id="active-poi-outer"
                style={{
                    circleColor: Colors.white,
                    // Si expanded=true, rayon de 15, sinon 0.
                    circleRadius: isExpanded ? 18 : 8,
                    // C'est ICI que la magie opère : Mapbox gère la transition nativement
                    circleRadiusTransition: {
                        duration: 2000,
                        delay: 0
                    }
                }}
            />

            {/* 2. Le cercle MAIN intérieur (Pulsing) */}
            <Mapbox.CircleLayer
                id="active-poi-inner"
                style={{
                    circleColor: Colors.main,
                    // Si expanded=true, rayon de 15, sinon 0.
                    circleRadius: isExpanded ? 15 : 5,
                    // C'est ICI que la magie opère : Mapbox gère la transition nativement
                    circleRadiusTransition: {
                        duration: 2000,
                        delay: 0
                    }
                }}
            />
        </Mapbox.ShapeSource>
    );
}