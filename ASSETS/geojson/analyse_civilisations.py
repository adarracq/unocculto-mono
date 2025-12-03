import glob
import json
import re
import csv
import sys
import os

# Augmente la limite de taille des champs CSV pour accepter les gros blocs de géométrie
try:
    csv.field_size_limit(sys.maxsize)
except OverflowError:
    csv.field_size_limit(2147483647) # Fallback pour les systèmes 32-bit

def get_civ_name(props):
    """Récupère le nom de la civilisation"""
    name = props.get('NAME')
    if not name:
        name = props.get('SUBJECTO')
    if not name:
        name = props.get('ABBREVN')
    return name

def get_year_from_filename(filename):
    """Extrait l'année en gérant les formats world_100, world_bc200, etc."""
    base_name = os.path.basename(filename).lower()
    
    match = re.search(r'(\d+)', base_name)
    if not match:
        return None
    
    year = int(match.group(1))
    
    if 'bc' in base_name:
        year = -year
        
    return year

def analyze_files():
    files = glob.glob("*.geojson")
    print(f"--- Démarrage : {len(files)} fichiers détectés ---")

    data_map = {} 
    all_years = set()
    
    # Liste pour stocker les avertissements
    logs_erreurs = []
    
    # Seuil d'alerte (Excel coupe à 32767 caractères)
    SEUIL_ALERTE = 32000

    for filename in files:
        if "places" in filename or "civilisations_" in filename or not filename.endswith(".geojson"):
            continue

        year = get_year_from_filename(filename)
        if year is None:
            print(f"⚠️ Ignoré (pas d'année lisible) : {filename}")
            continue

        print(f"Traitement : {filename} (Année {year})")
        all_years.add(year)

        try:
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            for feature in data.get('features', []):
                props = feature.get('properties', {})
                name = get_civ_name(props)
                
                if name:
                    name = str(name).strip()
                    if name.lower() not in ['unclaimed', 'none', 'null', 'true', 'false', '1', 'nan'] and not name.isdigit():
                        
                        geometry = feature.get('geometry')
                        
                        if geometry:
                            geo_string = json.dumps(geometry)
                            taille = len(geo_string)
                            
                            # Vérification de la taille pour le log
                            if taille > SEUIL_ALERTE:
                                msg = f"⚠️ [ALERTE TAILLE] {name} (Année {year}) : {taille} caractères. Risque de coupure dans Excel."
                                print(msg)
                                logs_erreurs.append(msg)
                            
                            if name not in data_map:
                                data_map[name] = {}
                            
                            data_map[name][year] = geo_string

        except Exception as e:
            msg_err = f"❌ ERREUR CRITIQUE sur {filename}: {e}"
            print(msg_err)
            logs_erreurs.append(msg_err)

    # --- Génération du CSV ---
    print("\nEcriture du fichier CSV final...")
    sorted_years = sorted(list(all_years))
    sorted_civs = sorted(data_map.keys())
    output_filename = "civilisations_geometries_completes.csv"
    
    try:
        with open(output_filename, 'w', newline='', encoding='utf-8-sig') as csvfile:
            writer = csv.writer(csvfile)
            header = ['Civilisation'] + [str(y) for y in sorted_years]
            writer.writerow(header)
            
            for civ in sorted_civs:
                row = [civ]
                for year in sorted_years:
                    geo_json = data_map[civ].get(year, "")
                    row.append(geo_json)
                writer.writerow(row)
        print(f"✅ CSV créé : {output_filename}")
        
    except Exception as e:
        print(f"❌ Erreur écriture CSV : {e}")

    # --- Génération du fichier de Log ---
    if logs_erreurs:
        log_filename = "log_erreurs_geometries.txt"
        with open(log_filename, "w", encoding="utf-8") as f:
            f.write(f"Rapport d'analyse - {len(logs_erreurs)} alertes détectées\n")
            f.write("="*50 + "\n")
            f.write("\n".join(logs_erreurs))
        print(f"⚠️  Un rapport d'erreurs a été généré : {log_filename}")
    else:
        print("✨ Aucun contour trop long détecté.")

if __name__ == "__main__":
    analyze_files()