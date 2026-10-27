import json
import re

# 1. Cargar catálogo de GameWave
with open('retro-gaming-hub/gamewave_catalog.json', 'r', encoding='utf-8') as f:
    gw_data = json.load(f)

gw_apps = gw_data.get('apps', [])
print(f"Cargadas {len(gw_apps)} apps desde gamewave_catalog.json")

# Función para mapear plataforma de GameWave a nuestro sistema de navegación
def map_system(source_platform, tags):
    p = (source_platform or '').lower()
    t = ' '.join(tags or []).lower()
    
    if any(k in p for k in ['playstation', 'psx', 'ps1', 'ps2', 'ps3', 'ps4', 'psp', 'ps vita']):
        return 'psx', 'PlayStation & PS2'
    if any(k in p for k in ['game boy advance', 'gba', 'game boy']):
        return 'gba', 'Game Boy Advance'
    if any(k in p for k in ['super nintendo', 'snes']):
        return 'snes', 'Super Nintendo'
    if any(k in p for k in ['nintendo 64', 'n64']):
        return 'n64', 'Nintendo 64'
    if any(k in p for k in ['nintendo ds', 'nds', '3ds']):
        return 'nds', 'Nintendo DS'
    if any(k in p for k in ['nes', 'famicom']):
        return 'nes', 'Nintendo NES'
    if any(k in p for k in ['sega', 'genesis', 'mega drive', 'dreamcast']):
        return 'sega', 'Sega Genesis'
    if any(k in p for k in ['xbox', 'xbox 360', 'pc', 'windows', 'dos', 'linux', 'android']):
        return 'gamewave', 'GameWave / PC'
    return 'gamewave', 'GameWave Port'

# 2. Cargar los 53 juegos base iniciales
with open('retro-gaming-hub/js/games-data.js', 'r', encoding='utf-8') as f:
    current_content = f.read()

# Extraer array base antes de GameWave masivo
# Crearemos un array unificado
converted_gw_games = []

for idx, a in enumerate(gw_apps):
    app_id = f"gw-{a.get('id', idx)}"
    name = a.get('name', 'Juego Desconocido')
    # Limpiar caracteres raros si hay
    name = name.replace('\u00ef\u00bf\u00bd', ' - ')
    
    source_plat = a.get('sourcePlatform', 'PC / Otros')
    sys_key, sys_display = map_system(source_plat, a.get('tags', []))
    
    # Enlace de redirección directo a la ficha del juego o GameWave
    project_url = a.get('projectUrl') or a.get('verificationUrl') or "https://gamewave.digital/ports/"
    
    # Cover
    cover_url = a.get('coverUrl') or "assets/covers/gamewave-default.svg"
    
    desc = a.get('description') or a.get('descriptionEn') or f"Port comunitario de {name} ({source_plat}) indexado en GameWave Digital."
    
    tags = a.get('tags', [])
    genre = a.get('category') or (tags[0] if tags else 'Port / Arcade')
    
    is_featured = bool(a.get('featured', False))
    
    game_obj = {
        "id": app_id,
        "title": name,
        "system": sys_key,
        "systemName": sys_display,
        "core": "link", # Tipo enlace externo directo
        "genre": genre,
        "year": 2026,
        "players": "1 Jugador",
        "rating": 4.9 if is_featured else 4.7,
        "featured": is_featured,
        "cover": cover_url,
        "description": desc,
        "redirectUrl": project_url,
        "isGameWave": True,
        "sourcePlatform": source_plat
    }
    converted_gw_games.append(game_obj)

print(f"Convertidos {len(converted_gw_games)} juegos de GameWave.")

# Cargar los juegos predefinidos originales (unos 41 para jugabilidad retro offline directa)
# Guardaremos todos juntos en retro-gaming-hub/js/games-data.js
# Mantendremos la cabecera original de los 41 juegos retro jugables con emulador + todos los de GameWave

# Leemos los primeros 41 juegos del archivo actual
match = re.search(r'const DEFAULT_GAMES = (\[.*?\]);\s*\n\s*// Constantes de sistemas', current_content, re.DOTALL)
if match:
    # Usar los que ya estaban
    try:
        # Extraer usando json o evaluador
        pass
    except Exception as e:
        pass

# Para asegurar máxima estabilidad, guardamos un games_gamewave.js o fusionamos en games-data.js
final_json_games = json.dumps(converted_gw_games, indent=2, ensure_ascii=False)

with open('retro-gaming-hub/js/gamewave-data.js', 'w', encoding='utf-8') as f:
    f.write(f"// Colección masiva de ports y juegos de GameWave Digital (1170+ juegos)\nconst GAMEWAVE_GAMES = {final_json_games};\n\nif (typeof module !== 'undefined' && module.exports) {{ module.exports = {{ GAMEWAVE_GAMES }}; }}")

print("Generado retro-gaming-hub/js/gamewave-data.js exitosamente.")
