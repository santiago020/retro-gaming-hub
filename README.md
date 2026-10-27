# 🎮 RetroStation Hub - Consola Web Multiemulador & Juegos 3D

Una interfaz web de última generación inspirada en consolas modernas (PS5, Nintendo Switch, Steam Deck) diseñada para recopilar y jugar en el navegador tus títulos de:

- **PlayStation 1 (PSX)**
- **Nintendo**: Super Nintendo (SNES), Game Boy Advance (GBA), Nintendo 64 (N64), Nintendo DS (NDS), NES
- **Sega Genesis / Mega Drive**
- **Juegos Web & 3D**: Integración nativa de tu juego **PeronPrime 3D** (Three.js / WebGL) y clásicos WebAssembly como DOOM.

---

## 🌟 Características Principales

1. **Diseño Visual de Consola:**
   - Modo oscuro con paleta Cyberpunk / Aurora.
   - Carrusel interactivo tipo Hero con rotación automática de títulos destacados.
   - Efectos de sonido procedurales mediante Web Audio API al navegar, hacer clic y lanzar juegos.

2. **Soporte de Mandos / Joysticks:**
   - Detección automática de Gamepads por USB y Bluetooth (Mandos de PS4/PS5, Xbox, Nintendo Switch Pro Controller y genéricos).

3. **Carga y Almacenamiento Local (ROMs):**
   - **Arrastrar y soltar (Drag & Drop):** Arrastra cualquier archivo `.gba`, `.sfc`, `.chd`, `.iso`, `.z64`, `.nds`, etc., sobre la ventana para cargarlo al instante.
   - **Persistencia con IndexedDB:** Almacena tus ROMs pesadas directamente en la base de datos de tu navegador sin necesidad de servidores externos.
   - **Favoritos y Recientes:** Marca juegos con una estrella (★) y accede a tu historial de partidas.
   - **Copia de Seguridad:** Exporta e importa tu biblioteca y configuración en formato `.json`.

4. **Experiencia de Juego Inmersiva:**
   - Modo Pantalla Completa con un solo clic.
   - Filtro CRT para emular las líneas de escaneo de los televisores de tubo clásicos.
   - Atajo con la tecla `ESC` para volver rápidamente a la biblioteca.

---

## 🚀 Cómo Iniciar la Interfaz

Simplemente abre el archivo principal en cualquier navegador web moderno (Edge, Chrome, Brave, Firefox):

**Ruta local del archivo:**
```
retro-gaming-hub/index.html
```

O si prefieres un servidor local HTTP:
```bash
cd retro-gaming-hub
npx serve .
# o con Python:
python -m http.server 8080
```
Luego visita en tu navegador: `http://localhost:8080`
