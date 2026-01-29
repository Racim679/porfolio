#!/usr/bin/env python3
"""
Critique objective de la trajectoire et création d'une trajectoire naturelle et fluide.
"""

import numpy as np
from scipy.interpolate import CubicSpline
import matplotlib.pyplot as plt

print("=" * 70)
print("CRITIQUE OBJECTIVE DE LA TRAJECTOIRE ACTUELLE")
print("=" * 70)

# Waypoints actuels
current_waypoints = [
    (-8, 52), (-2, 52), (4, 50), (10, 46), (16, 40), (22, 36), (28, 32), (34, 30), (38, 30),
    (40, 32), (40, 40), (36, 48), (28, 52), (18, 50), (10, 44), (8, 36), (10, 30), (16, 28), (24, 30), (32, 34), (38, 38),
    (42, 40), (48, 38), (54, 34), (58, 30), (60, 28), (62, 26), (64, 28), (66, 32), (68, 38), (70, 44),
    (74, 46), (80, 47), (86, 46), (92, 45), (98, 45), (104, 45), (108, 45),
]

x_curr = np.array([p[0] for p in current_waypoints])
y_curr = np.array([p[1] for p in current_waypoints])

n_curr = len(current_waypoints)
t_curr = np.linspace(0, 1, n_curr)
cs_x_curr = CubicSpline(t_curr, x_curr, bc_type="natural")
cs_y_curr = CubicSpline(t_curr, y_curr, bc_type="natural")

num_points = 180
t_smooth = np.linspace(0, 1, num_points, endpoint=False)
x_curr_smooth = cs_x_curr(t_smooth)
y_curr_smooth = np.clip(cs_y_curr(t_smooth), 0, 100)

print("\n1. PROBLÈMES IDENTIFIÉS:")
print("   - La boucle forme une figure-8 complexe avec auto-intersections")
print("   - Les transitions sont irrégulières (certaines trop abruptes, d'autres trop douces)")
print("   - La boucle n'est pas intuitive - elle ne ressemble pas à un vol naturel de papier")
print("   - Trop de waypoints dans certaines zones créent des oscillations")
print("   - Le retour vers la gauche dans la boucle n'est pas assez prononcé visuellement")

print("\n2. CARACTÉRISTIQUES D'UNE TRAJECTOIRE NATURELLE:")
print("   - Entrée fluide depuis la gauche (légèrement inclinée)")
print("   - Descente progressive avec une courbe douce")
print("   - BOUCLE SIMPLE ET CLAIRE: descend, fait une boucle vers la gauche (comme un cercle), remonte")
print("   - Montée haute avec une courbe naturelle")
print("   - Sortie fluide vers la droite")
print("   - Pas d'auto-intersections complexes")
print("   - Transitions régulières et prévisibles")

print("\n3. CRÉATION D'UNE NOUVELLE TRAJECTOIRE NATURELLE:")
print("   - Boucle simple: forme de cercle ou de boucle de papier")
print("   - Waypoints espacés régulièrement")
print("   - Transitions fluides entre toutes les sections")

# Nouvelle trajectoire naturelle et intuitive
# Principe: entrée -> descente douce -> boucle simple (cercle) -> montée -> sortie
natural_waypoints = [
    # Entrée fluide depuis la gauche
    (-8, 50), (-4, 50), (0, 49), (4, 47), (8, 44), (12, 40),
    
    # Descente douce vers la zone de la boucle
    (16, 36), (20, 32), (24, 30), (28, 29), (32, 29),
    
    # BOUCLE SIMPLE ET INTUITIVE (forme de cercle/ovale)
    # Entrée dans la boucle (descend légèrement)
    (34, 30),
    # Commence la boucle vers la gauche (point haut gauche)
    (36, 32), (36, 36), (34, 40), (30, 44), (24, 46), (18, 46), (12, 44), (8, 40),
    # Point bas de la boucle (gauche)
    (6, 34), (6, 28), (8, 24), (12, 22), (16, 22), (20, 24), (24, 28), (28, 32),
    # Sortie de la boucle (remonte et repart droite)
    (30, 34), (32, 36), (34, 38),
    
    # Continuation après la boucle
    (36, 38), (40, 36), (44, 34), (48, 32), (52, 30),
    
    # Montée haute (comme un saut)
    (54, 28), (56, 26), (58, 25), (60, 26), (62, 28), (64, 32), (66, 36), (68, 40),
    
    # Descente douce et sortie
    (70, 42), (74, 43), (78, 44), (82, 44.5), (86, 45), (90, 45), (94, 45), (98, 45), (102, 45), (108, 45),
]

x_nat = np.array([p[0] for p in natural_waypoints])
y_nat = np.array([p[1] for p in natural_waypoints])

n_nat = len(natural_waypoints)
t_nat = np.linspace(0, 1, n_nat)
cs_x_nat = CubicSpline(t_nat, x_nat, bc_type="natural")
cs_y_nat = CubicSpline(t_nat, y_nat, bc_type="natural")

x_nat_smooth = cs_x_nat(t_smooth)
y_nat_smooth = np.clip(cs_y_nat(t_smooth), 0, 100)

# Visualisation comparative
fig, axes = plt.subplots(2, 2, figsize=(16, 14))

# Graphique 1: Trajectoire actuelle (vue complète)
ax1 = axes[0, 0]
ax1.plot(x_curr_smooth, y_curr_smooth, 'b-', linewidth=2, label='Trajectoire actuelle', alpha=0.7)
ax1.plot(x_curr, y_curr, 'ro', markersize=6, label='Waypoints actuels', alpha=0.6)
ax1.set_xlabel('X (%)', fontsize=11)
ax1.set_ylabel('Y (%)', fontsize=11)
ax1.set_title('Trajectoire ACTUELLE (vue complète)', fontsize=12, fontweight='bold')
ax1.grid(True, alpha=0.3)
ax1.legend()
ax1.set_aspect('equal', adjustable='box')

# Graphique 2: Trajectoire naturelle (vue complète)
ax2 = axes[0, 1]
ax2.plot(x_nat_smooth, y_nat_smooth, 'g-', linewidth=2, label='Trajectoire naturelle', alpha=0.7)
ax2.plot(x_nat, y_nat, 'mo', markersize=6, label='Waypoints naturels', alpha=0.6)
ax2.set_xlabel('X (%)', fontsize=11)
ax2.set_ylabel('Y (%)', fontsize=11)
ax2.set_title('Trajectoire NATURELLE (vue complète)', fontsize=12, fontweight='bold')
ax2.grid(True, alpha=0.3)
ax2.legend()
ax2.set_aspect('equal', adjustable='box')

# Graphique 3: Zoom sur la boucle actuelle
ax3 = axes[1, 0]
loop_mask_curr = (x_curr_smooth >= 8) & (x_curr_smooth <= 40)
ax3.plot(x_curr_smooth[loop_mask_curr], y_curr_smooth[loop_mask_curr], 'b-', linewidth=3, label='Boucle actuelle', alpha=0.8)
ax3.plot(x_curr[(x_curr >= 8) & (x_curr <= 40)], y_curr[(x_curr >= 8) & (x_curr <= 40)], 'ro', markersize=8, alpha=0.7)
ax3.set_xlabel('X (%)', fontsize=11)
ax3.set_ylabel('Y (%)', fontsize=11)
ax3.set_title('Zoom: Boucle ACTUELLE', fontsize=12, fontweight='bold')
ax3.grid(True, alpha=0.3)
ax3.legend()
ax3.set_aspect('equal', adjustable='box')
ax3.set_xlim(5, 42)
ax3.set_ylim(20, 55)

# Graphique 4: Zoom sur la boucle naturelle
ax4 = axes[1, 1]
loop_mask_nat = (x_nat_smooth >= 6) & (x_nat_smooth <= 36)
ax4.plot(x_nat_smooth[loop_mask_nat], y_nat_smooth[loop_mask_nat], 'g-', linewidth=3, label='Boucle naturelle', alpha=0.8)
ax4.plot(x_nat[(x_nat >= 6) & (x_nat <= 36)], y_nat[(x_nat >= 6) & (x_nat <= 36)], 'mo', markersize=8, alpha=0.7)
ax4.set_xlabel('X (%)', fontsize=11)
ax4.set_ylabel('Y (%)', fontsize=11)
ax4.set_title('Zoom: Boucle NATURELLE (simple et intuitive)', fontsize=12, fontweight='bold')
ax4.grid(True, alpha=0.3)
ax4.legend()
ax4.set_aspect('equal', adjustable='box')
ax4.set_xlim(5, 38)
ax4.set_ylim(20, 50)

plt.tight_layout()
plt.savefig('scripts/trajectory_comparison.png', dpi=150, bbox_inches='tight')
print(f"\nGraphique comparatif sauvegardé: scripts/trajectory_comparison.png")

# Analyse de la nouvelle trajectoire
print("\n4. ANALYSE DE LA NOUVELLE TRAJECTOIRE:")
print(f"   - Nombre de waypoints: {len(natural_waypoints)}")
print(f"   - Boucle claire: x va de 34 -> 36 -> 6 -> 34 (boucle fermee)")
print(f"   - Amplitude de la boucle: {max(x_nat_smooth[loop_mask_nat]) - min(x_nat_smooth[loop_mask_nat]):.1f}%")
print(f"   - Montée haute: y minimum = {min(y_nat_smooth):.1f}%")

# Générer le code pour Hero.tsx
print("\n5. GÉNÉRATION DU CODE POUR Hero.tsx:")
print("=" * 70)
print("const planePath = [")
for i in range(num_points):
    print(f"  {{ x: {round(x_nat_smooth[i], 2)}, y: {round(y_nat_smooth[i], 2)} }},")
print("];")
print("=" * 70)

# plt.show()  # Commenté pour éviter le blocage en ligne de commande
