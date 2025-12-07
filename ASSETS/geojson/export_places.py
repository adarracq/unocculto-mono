import json
import csv
import os

def export_places_to_csv(input_filename="places.geojson", output_filename="places_export.csv"):
    print(f"--- Lecture du fichier {input_filename} ---")
    
    try:
        with open(input_filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"❌ Erreur : Le fichier '{input_filename}' est introuvable.")
        return

    features = data.get('features', [])
    print(f"Nombre de lieux trouvés : {len(features)}")

    # Liste pour stocker toutes les données traitées
    extracted_data = []
    
    # Ensemble pour collecter TOUS les noms de colonnes possibles (car les propriétés varient d'un lieu à l'autre)
    all_headers = set(['latitude', 'longitude']) # On force la présence de lat/lon

    for feature in features:
        props = feature.get('properties', {})
        geometry = feature.get('geometry')
        
        # Copie des propriétés pour ne pas modifier l'original
        row = props.copy()
        
        # --- Gestion des Coordonnées ---
        # La plupart des "places" sont des Points. On extrait Lat/Lon.
        lat, lon = "", ""
        if geometry:
            coords = geometry.get('coordinates')
            geo_type = geometry.get('type')
            
            if geo_type == 'Point' and coords:
                # GeoJSON est [Longitude, Latitude]
                lon = coords[0]
                lat = coords[1]
            elif geo_type == 'MultiPoint' and coords:
                # On prend le premier point
                lon = coords[0][0]
                lat = coords[0][1]
            # Pour les polygones, on pourrait calculer le centroïde, 
            # mais places.geojson contient généralement des points.
        
        row['latitude'] = lat
        row['longitude'] = lon
        
        # Ajout des clés trouvées à la liste globale des en-têtes
        all_headers.update(row.keys())
        extracted_data.append(row)

    # --- Organisation des colonnes ---
    # On met les colonnes importantes en premier pour la lisibilité
    priority_headers = ['name', 'latitude', 'longitude', 'inhabitedSince', 'inhabitedUntil', 'wikipedia']
    
    # On trie le reste alphabétiquement
    other_headers = sorted([h for h in all_headers if h not in priority_headers])
    final_headers = priority_headers + other_headers

    # --- Écriture du CSV ---
    print(f"Écriture dans {output_filename}...")
    
    try:
        # encoding='utf-8-sig' permet à Excel de bien lire les accents
        with open(output_filename, 'w', newline='', encoding='utf-8-sig') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=final_headers, extrasaction='ignore')
            
            writer.writeheader()
            for row in extracted_data:
                writer.writerow(row)
                
        print(f"✅ Succès ! Export terminé : {output_filename}")
        print(f"Nombre de colonnes détectées : {len(final_headers)}")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'écriture du CSV : {e}")

if __name__ == "__main__":
    export_places_to_csv()