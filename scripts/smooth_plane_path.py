#!/usr/bin/env python3
"""
Génère une trajectoire lissée pour l'avion en papier via spline cubique.
Usage: python scripts/smooth_plane_path.py
"""

import numpy as np
from scipy.interpolate import CubicSpline

# Trajectoire SIMPLE : arc doux gauche -> droite, pas de boucles, waypoints espacés régulièrement
# = vitesse perçue constante, pas de variations brusques
waypoints = [
    (-8, 50), (5, 49), (18, 47), (30, 45), (42, 44), (54, 44), (66, 44), (78, 45), (90, 45), (108, 45),
]

# Paramètre t normalisé [0, 1] pour chaque waypoint
n = len(waypoints)
t_way = np.linspace(0, 1, n)
x_way = np.array([p[0] for p in waypoints])
y_way = np.array([p[1] for p in waypoints])

# Splines "natural" (dérivée seconde nulle aux bords) = courbe plus détendue et naturelle
cs_x = CubicSpline(t_way, x_way, bc_type="natural")
cs_y = CubicSpline(t_way, y_way, bc_type="natural")

# Nombre de points en sortie (trajectoire très lisse)
num_points = 180
t_smooth = np.linspace(0, 1, num_points, endpoint=False)  # sans répéter le dernier
x_smooth = cs_x(t_smooth)
y_smooth = cs_y(t_smooth)

# Clamper y dans [0, 100]; x peut dépasser 100 pour sortie écran
y_smooth = np.clip(y_smooth, 0, 100)

# Format JS/TS pour copier dans Hero.tsx
print("// Path lissé par spline cubique (scripts/smooth_plane_path.py)")
print("const planePath = [")
for i in range(num_points):
    print(f"  {{ x: {round(x_smooth[i], 2)}, y: {round(y_smooth[i], 2)} }},")
print("];")
