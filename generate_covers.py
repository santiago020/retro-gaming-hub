import os

covers_dir = "retro-gaming-hub/assets/covers"
os.makedirs(covers_dir, exist_ok=True)

games = [
    ("web-peronprime", "PeronPrime 3D", "WEB 3D", "#10b981", "#050508"),
    ("web-doom", "DOOM Classic", "WEB", "#dc2626", "#1a0505"),
    ("ps1-crash-bandicoot", "Crash Bandicoot", "PS1", "#00439c", "#001a40"),
    ("ps1-tekken3", "Tekken 3", "PS1", "#ff5500", "#331100"),
    ("ps1-castlevania-sotn", "Castlevania SotN", "PS1", "#8b5cf6", "#1e1b4b"),
    ("ps1-metal-gear-solid", "Metal Gear Solid", "PS1", "#059669", "#064e3b"),
    ("ps1-gta2", "Grand Theft Auto 2", "PS1", "#f59e0b", "#451a03"),
    ("ps1-resident-evil-3", "Resident Evil 3", "PS1", "#dc2626", "#450a0a"),
    ("ps1-silent-hill", "Silent Hill", "PS1", "#6b7280", "#1f2937"),
    ("ps1-gran-turismo-2", "Gran Turismo 2", "PS1", "#3b82f6", "#1e3a8a"),
    ("ps1-dragon-ball-gt", "Dragon Ball GT Final Bout", "PS1", "#eab308", "#422006"),
    ("ps1-simpsons-wrestling", "The Simpsons Wrestling", "PS1", "#facc15", "#713f12"),
    ("ps2-gta-san-andreas", "GTA San Andreas (Cloud)", "PS2 / CLOUD", "#ea580c", "#431407"),
    ("ps2-god-of-war-2", "God of War II (Cloud)", "PS2 / CLOUD", "#dc2626", "#450a0a"),
    ("ps2-dbz-budokai-3", "Dragon Ball Z: Budokai 3", "PS2 / CLOUD", "#f97316", "#7c2d12"),
    ("ps2-need-for-speed-mw", "NFS Most Wanted (Cloud)", "PS2 / CLOUD", "#0284c7", "#082f49"),
    ("gba-pokemon-esmeralda", "Pokémon Esmeralda", "GBA", "#10b981", "#064e3b"),
    ("gba-zelda-minish-cap", "Zelda: The Minish Cap", "GBA", "#eab308", "#422006"),
    ("gba-super-mario-advance-4", "Super Mario Advance 4", "GBA", "#ef4444", "#7f1d1d"),
    ("gba-metroid-fusion", "Metroid Fusion", "GBA", "#06b6d4", "#164e63"),
    ("gba-pokemon-firered", "Pokémon Rojo Fuego", "GBA", "#f97316", "#7c2d12"),
    ("gba-dbz-supersonic", "DBZ: Supersonic Warriors", "GBA", "#eab308", "#422006"),
    ("gba-simpsons-road-rage", "The Simpsons Road Rage", "GBA", "#facc15", "#713f12"),
    ("snes-super-mario-world", "Super Mario World", "SNES", "#ef4444", "#7f1d1d"),
    ("snes-zelda-alttp", "Zelda: A Link to the Past", "SNES", "#22c55e", "#14532d"),
    ("snes-super-metroid", "Super Metroid", "SNES", "#a855f7", "#3b0764"),
    ("snes-donkey-kong-country", "Donkey Kong Country", "SNES", "#d97706", "#451a03"),
    ("snes-simpsons-bart-nightmare", "Simpsons: Bart's Nightmare", "SNES", "#facc15", "#713f12"),
    ("nes-super-mario-bros-3", "Super Mario Bros. 3", "NES", "#dc2626", "#450a0a"),
    ("nes-contra", "Contra", "NES", "#2563eb", "#1e3a8a"),
    ("nes-super-mario-bros", "Super Mario Bros.", "NES", "#ea580c", "#431407"),
    ("nes-simpsons-krusty", "Krusty's Fun House", "NES", "#eab308", "#422006"),
    ("n64-super-mario-64", "Super Mario 64", "N64", "#3b82f6", "#1e3a8a"),
    ("n64-zelda-oot", "Zelda: Ocarina of Time", "N64", "#10b981", "#064e3b"),
    ("n64-gta-advance-port", "GTA 64 Fan Port", "N64", "#f59e0b", "#451a03"),
    ("nds-new-super-mario-bros", "New Super Mario Bros.", "NDS", "#ef4444", "#7f1d1d"),
    ("nds-mario-kart-ds", "Mario Kart DS", "NDS", "#06b6d4", "#164e63"),
    ("nds-simpsons-game", "The Simpsons Game (NDS)", "NDS", "#facc15", "#713f12"),
    ("sega-sonic-the-hedgehog-2", "Sonic the Hedgehog 2", "SEGA", "#2563eb", "#1e3a8a"),
    ("sega-streets-of-rage-2", "Streets of Rage 2", "SEGA", "#dc2626", "#450a0a"),
    ("sega-simpsons-arcade", "The Simpsons Arcade Game", "SEGA", "#eab308", "#422006")
]

for gid, title, badge, color1, color2 in games:
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{color2}" />
      <stop offset="100%" stop-color="#0a0b12" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{color1}" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="600" fill="url(#bg)" />
  
  <!-- Decorative Grid / Cyber lines -->
  <path d="M0 100 L400 100 M0 200 L400 200 M0 300 L400 300 M0 400 L400 400 M0 500 L400 500" stroke="{color1}" stroke-opacity="0.1" stroke-width="1" />
  <path d="M100 0 L100 600 M200 0 L200 600 M300 0 L300 600" stroke="{color1}" stroke-opacity="0.1" stroke-width="1" />
  
  <!-- Central Emblem / Icon Box -->
  <circle cx="200" cy="240" r="110" fill="{color2}" stroke="{color1}" stroke-width="4" filter="url(#glow)" />
  <text x="200" y="215" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="{color1}" text-anchor="middle">🎮</text>
  <text x="200" y="260" font-family="system-ui, sans-serif" font-weight="800" font-size="22" fill="#ffffff" text-anchor="middle">{badge}</text>
  
  <!-- System Badge Top Left -->
  <rect x="25" y="25" width="90" height="34" rx="8" fill="{color1}" />
  <text x="70" y="47" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#ffffff" text-anchor="middle">{badge}</text>
  
  <!-- Title and Footer Area -->
  <rect x="0" y="420" width="400" height="180" fill="#0a0b12" fill-opacity="0.9" />
  <path d="M0 420 L400 400 L400 600 L0 600 Z" fill="#0a0b12" fill-opacity="0.8" />
  
  <text x="35" y="475" font-family="system-ui, sans-serif" font-weight="900" font-size="26" fill="#ffffff" width="330">
    {title[:22]}
  </text>
  {'<text x="35" y="505" font-family="system-ui, sans-serif" font-weight="700" font-size="20" fill="#ffffff">' + title[22:] + '</text>' if len(title) > 22 else ''}
  
  <rect x="35" y="535" width="120" height="28" rx="14" fill="{color1}" fill-opacity="0.3" stroke="{color1}" stroke-width="1.5" />
  <text x="95" y="553" font-family="system-ui, sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">RETROSTATION</text>
</svg>'''
    
    file_path = os.path.join(covers_dir, f"{gid}.svg")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(svg_content)

print(f"Generated {len(games)} covers successfully in {covers_dir}")
