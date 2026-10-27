import os

covers_dir = "retro-gaming-hub/assets/covers"
os.makedirs(covers_dir, exist_ok=True)

gw_games = [
    ("gw-the-darkness", "The Darkness", "GAMEWAVE / PC", "#dc2626", "#450a0a"),
    ("gw-simpsons-hit-and-run", "Simpsons: Hit & Run", "GAMEWAVE / PC", "#facc15", "#713f12"),
    ("gw-gta-v-port", "GTA V (GameWave Port)", "GAMEWAVE", "#10b981", "#064e3b"),
    ("gw-gta-iv-recomp", "GTA IV Recompiled", "GAMEWAVE", "#ea580c", "#431407"),
    ("gw-gta-lcs", "GTA: Liberty City", "GAMEWAVE / PSP", "#f59e0b", "#451a03"),
    ("gw-conker-recompiled", "Conker's Bad Fur Day", "N64 RECOMP", "#f97316", "#7c2d12"),
    ("gw-dk64-rekongpiled", "DK64 ReKONGpiled", "N64 RECOMP", "#d97706", "#451a03"),
    ("gw-diddy-kong-racing", "Diddy Kong Racing", "N64 RECOMP", "#2563eb", "#1e3a8a"),
    ("gw-megaman-x-recomp", "Mega Man X Recompiled", "SNES RECOMP", "#0284c7", "#082f49"),
    ("gw-sonic-1-forever", "Sonic 1 Forever", "SEGA RECOMP", "#3b82f6", "#1e3a8a"),
    ("gw-banjo-kazooie", "Banjo-Kazooie Recomp", "N64 RECOMP", "#eab308", "#422006"),
    ("gw-zelda-64-recomp", "Zelda 64 Recompiled", "N64 RECOMP", "#10b981", "#064e3b")
]

for gid, title, badge, color1, color2 in gw_games:
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
  <path d="M0 100 L400 100 M0 200 L400 200 M0 300 L400 300 M0 400 L400 400 M0 500 L400 500" stroke="{color1}" stroke-opacity="0.15" stroke-width="1" />
  <path d="M100 0 L100 600 M200 0 L200 600 M300 0 L300 600" stroke="{color1}" stroke-opacity="0.15" stroke-width="1" />
  
  <!-- Central Emblem / Icon Box -->
  <circle cx="200" cy="240" r="110" fill="{color2}" stroke="{color1}" stroke-width="4" filter="url(#glow)" />
  <text x="200" y="215" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="{color1}" text-anchor="middle">🌊</text>
  <text x="200" y="260" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#ffffff" text-anchor="middle">{badge[:14]}</text>
  
  <!-- System Badge Top Left -->
  <rect x="25" y="25" width="130" height="34" rx="8" fill="{color1}" />
  <text x="90" y="47" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="#ffffff" text-anchor="middle">GAMEWAVE</text>
  
  <!-- Title and Footer Area -->
  <rect x="0" y="420" width="400" height="180" fill="#0a0b12" fill-opacity="0.92" />
  <path d="M0 420 L400 400 L400 600 L0 600 Z" fill="#0a0b12" fill-opacity="0.85" />
  
  <text x="35" y="475" font-family="system-ui, sans-serif" font-weight="900" font-size="25" fill="#ffffff">
    {title[:22]}
  </text>
  {'<text x="35" y="505" font-family="system-ui, sans-serif" font-weight="700" font-size="19" fill="#ffffff">' + title[22:] + '</text>' if len(title) > 22 else ''}
  
  <rect x="35" y="535" width="160" height="28" rx="14" fill="{color1}" fill-opacity="0.3" stroke="{color1}" stroke-width="1.5" />
  <text x="115" y="553" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#ffffff" text-anchor="middle">GAMEWAVE DIGITAL</text>
</svg>'''
    
    file_path = os.path.join(covers_dir, f"{gid}.svg")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(svg_content)

print(f"Generated {len(gw_games)} GameWave covers successfully in {covers_dir}")
