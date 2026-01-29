#!/usr/bin/env python3
"""
Visualise et analyse la trajectoire de l'avion pour identifier les problèmes.
"""

import numpy as np
from scipy.interpolate import CubicSpline
import matplotlib.pyplot as plt

# Waypoints actuels (même que smooth_plane_path.py)
waypoints = [
    (-8, 52), (-2, 52), (4, 50), (10, 46), (16, 40), (22, 36), (28, 32), (34, 30), (38, 30),
    (40, 32), (40, 40), (36, 48), (28, 52), (18, 50), (10, 44), (8, 36), (10, 30), (16, 28), (24, 30), (32, 34), (38, 38),
    (42, 40), (48, 38), (54, 34), (58, 30), (60, 28), (62, 26), (64, 28), (66, 32), (68, 38), (70, 44),
    (74, 46), (80, 47), (86, 46), (92, 45), (98, 45), (104, 45), (108, 45),
]

# Extraire x et y
x_way = np.array([p[0] for p in waypoints])
y_way = np.array([p[1] for p in waypoints])

# Créer les splines
n = len(waypoints)
t_way = np.linspace(0, 1, n)
cs_x = CubicSpline(t_way, x_way, bc_type="natural")
cs_y = CubicSpline(t_way, y_way, bc_type="natural")

# Générer la trajectoire lissée
num_points = 180
t_smooth = np.linspace(0, 1, num_points, endpoint=False)
x_smooth = cs_x(t_smooth)
y_smooth = np.clip(cs_y(t_smooth), 0, 100)

# Créer le graphique
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 8))

# Graphique 1: Trajectoire complète
ax1.plot(x_smooth, y_smooth, 'b-', linewidth=2, label='Trajectoire lissée', alpha=0.7)
ax1.plot(x_way, y_way, 'ro', markersize=8, label='Waypoints', alpha=0.8)
ax1.plot(x_way, y_way, 'r--', linewidth=1, alpha=0.3, label='Ligne directe waypoints')
ax1.set_xlabel('X (%)', fontsize=12)
ax1.set_ylabel('Y (%)', fontsize=12)
ax1.set_title('Trajectoire complète de l\'avion', fontsize=14, fontweight='bold')
ax1.grid(True, alpha=0.3)
ax1.legend()
ax1.set_aspect('equal', adjustable='box')

# Ajouter des annotations pour la boucle
loop_start_idx = np.where(x_smooth >= 38)[0][0]
loop_end_idx = np.where(x_smooth <= 10)[0][-1]
if loop_end_idx > loop_start_idx:
    ax1.plot(x_smooth[loop_start_idx:loop_end_idx+1], 
             y_smooth[loop_start_idx:loop_end_idx+1], 
             'g-', linewidth=3, alpha=0.5, label='Zone boucle')
    ax1.annotate('Début boucle', 
                xy=(x_smooth[loop_start_idx], y_smooth[loop_start_idx]),
                xytext=(x_smooth[loop_start_idx]+5, y_smooth[loop_start_idx]+5),
                arrowprops=dict(arrowstyle='->', color='green', lw=2),
                fontsize=10, fontweight='bold', color='green')
    ax1.annotate('Fin boucle', 
                xy=(x_smooth[loop_end_idx], y_smooth[loop_end_idx]),
                xytext=(x_smooth[loop_end_idx]-5, y_smooth[loop_end_idx]+5),
                arrowprops=dict(arrowstyle='->', color='green', lw=2),
                fontsize=10, fontweight='bold', color='green')

# Graphique 2: Analyse de la boucle (zoom)
ax2.plot(x_smooth, y_smooth, 'b-', linewidth=2, label='Trajectoire', alpha=0.7)
ax2.plot(x_way, y_way, 'ro', markersize=10, label='Waypoints', alpha=0.8)

# Trouver la zone de la boucle pour zoomer
loop_x_min = min(x_smooth[loop_start_idx:loop_end_idx+1]) - 5
loop_x_max = max(x_smooth[loop_start_idx:loop_end_idx+1]) + 5
loop_y_min = min(y_smooth[loop_start_idx:loop_end_idx+1]) - 5
loop_y_max = max(y_smooth[loop_start_idx:loop_end_idx+1]) + 5

ax2.set_xlim(loop_x_min, loop_x_max)
ax2.set_ylim(loop_y_min, loop_y_max)
ax2.set_xlabel('X (%)', fontsize=12)
ax2.set_ylabel('Y (%)', fontsize=12)
ax2.set_title('Zoom sur la boucle', fontsize=14, fontweight='bold')
ax2.grid(True, alpha=0.3)
ax2.legend()
ax2.set_aspect('equal', adjustable='box')

# Ajouter des flèches pour montrer la direction
for i in range(loop_start_idx, loop_end_idx, 10):
    dx = x_smooth[i+1] - x_smooth[i]
    dy = y_smooth[i+1] - y_smooth[i]
    ax2.annotate('', xy=(x_smooth[i+1], y_smooth[i+1]), 
                xytext=(x_smooth[i], y_smooth[i]),
                arrowprops=dict(arrowstyle='->', color='purple', lw=1.5, alpha=0.6))

# Analyse textuelle
print("=" * 60)
print("ANALYSE DE LA TRAJECTOIRE")
print("=" * 60)
print(f"\nNombre de waypoints: {len(waypoints)}")
print(f"Nombre de points lissés: {len(x_smooth)}")
print(f"\nCoordonnées X des waypoints:")
for i, (x, y) in enumerate(waypoints):
    print(f"  {i+1}. ({x}, {y})")

# Analyser la boucle
print(f"\n{'='*60}")
print("ANALYSE DE LA BOUCLE:")
print(f"{'='*60}")
print(f"Zone boucle détectée: indices {loop_start_idx} à {loop_end_idx}")
print(f"X min dans la boucle: {min(x_smooth[loop_start_idx:loop_end_idx+1]):.2f}")
print(f"X max dans la boucle: {max(x_smooth[loop_start_idx:loop_end_idx+1]):.2f}")
print(f"Amplitude X de la boucle: {max(x_smooth[loop_start_idx:loop_end_idx+1]) - min(x_smooth[loop_start_idx:loop_end_idx+1]):.2f}")

# Vérifier si la boucle est vraiment visible
x_range_loop = max(x_smooth[loop_start_idx:loop_end_idx+1]) - min(x_smooth[loop_start_idx:loop_end_idx+1])
if x_range_loop < 20:
    print(f"\n⚠️  PROBLÈME DÉTECTÉ: La boucle n'est pas assez prononcée!")
    print(f"   L'amplitude X n'est que de {x_range_loop:.2f}%, ce qui est trop petit.")
    print(f"   Pour une vraie boucle visible, il faut au moins 25-30% d'amplitude.")

# Vérifier la direction dans toute la boucle
print(f"\n{'='*60}")
print("VÉRIFICATION DE LA DIRECTION DANS LA BOUCLE:")
print(f"{'='*60}")
directions = []
for i in range(loop_start_idx, loop_end_idx):
    dx = x_smooth[i+1] - x_smooth[i]
    direction = "droite" if dx > 0.1 else "gauche" if dx < -0.1 else "vertical"
    directions.append(direction)
    if i % 10 == 0:  # Afficher tous les 10 points
        print(f"  Point {i}: x={x_smooth[i]:.2f}, dx={dx:.2f} ({direction})")

# Compter les directions
right_count = directions.count("droite")
left_count = directions.count("gauche")
print(f"\n  Résumé: {right_count} mouvements vers la droite, {left_count} mouvements vers la gauche")

# Identifier les problèmes
print(f"\n{'='*60}")
print("PROBLÈMES IDENTIFIÉS:")
print(f"{'='*60}")

problems = []
if x_range_loop < 25:
    problems.append(f"PROBLEME: La boucle n'est pas assez large (amplitude X: {x_range_loop:.2f}%)")
    
# Vérifier si x diminue vraiment
x_decreases = False
for i in range(loop_start_idx, loop_end_idx):
    if x_smooth[i+1] < x_smooth[i]:
        x_decreases = True
        break

if not x_decreases:
    problems.append("PROBLEME: L'avion ne revient pas vraiment vers la gauche (x ne diminue pas)")
else:
    print("OK: L'avion revient bien vers la gauche")

# Vérifier la forme de la boucle
if len(problems) == 0:
    print("OK: La boucle semble correcte!")
else:
    for p in problems:
        print(p)

print(f"\n{'='*60}")
print("ANALYSE DETAILLEE DU PROBLEME:")
print(f"{'='*60}")
print("Les waypoints de la boucle:")
for i in range(8, 18):  # waypoints de la boucle
    print(f"  {i+1}. ({waypoints[i][0]}, {waypoints[i][1]})")

print(f"\nPROBLEME PRINCIPAL:")
print("La spline cubique crée une transition trop douce entre les waypoints.")
print("Meme si on a des waypoints qui reviennent vers la gauche (x diminue de 40 à 8),")
print("la spline peut créer une courbe qui continue vers la droite avant de revenir,")
print("ce qui fait que la boucle n'est pas nette et visible.")

print(f"\n{'='*60}")
print("SUGGESTIONS:")
print(f"{'='*60}")
print("1. Ajouter PLUS de waypoints dans la zone de la boucle pour forcer la forme")
print("2. Créer une vraie boucle fermée: x va de 40 -> 35 -> 25 -> 15 -> 8 -> 12 -> 20 -> 30 -> 40")
print("3. Utiliser des waypoints plus serrés dans la zone critique")
print("4. Peut-être utiliser une approche différente: créer la boucle avec des points")
print("   qui forment vraiment un cercle ou une boucle fermée")

plt.tight_layout()
plt.savefig('scripts/trajectory_analysis.png', dpi=150, bbox_inches='tight')
print(f"\nGraphique sauvegardé dans: scripts/trajectory_analysis.png")
plt.show()
