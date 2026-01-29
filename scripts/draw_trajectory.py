#!/usr/bin/env python3
"""
Dessine ta trajectoire à la souris : clique pour ajouter des points.
- Clic gauche : ajouter un point
- Clic droit ou Entrée : terminer et exporter les points
- Coordonnées en % viewport : x 0-100 (écran), y 0-100 (haut->bas)
  Pour sortie à droite tu peux dépasser 100, pour entrée à gauche utiliser x < 0.
"""

import numpy as np
import matplotlib.pyplot as plt

# Stockage des points
points = []

def onclick(event):
    """Ajoute un point au clic gauche."""
    if event.button == 1 and event.xdata is not None and event.ydata is not None:
        x, y = float(event.xdata), float(event.ydata)
        points.append((x, y))
        ax.plot(x, y, 'ro', markersize=8)
        if len(points) > 1:
            ax.plot([points[-2][0], x], [points[-2][1], y], 'b-', linewidth=2)
        fig.canvas.draw()
        print(f"  Point {len(points)}: ({round(x, 2)}, {round(y, 2)})")

def onkey(event):
    """Termine et exporte quand tu appuies sur Entrée."""
    if event.key == 'enter' or event.key == 'return':
        export_and_quit()

def export_and_quit():
    """Exporte les points au format waypoints + planePath pour Hero.tsx."""
    if len(points) < 2:
        print("Ajoute au moins 2 points avec des clics gauches.")
        return
    pts = np.array(points)
    x, y = pts[:, 0], pts[:, 1]
    # Clamper y dans [0, 100] pour l'affichage
    y = np.clip(y, 0, 100)
    print("\n" + "=" * 60)
    print("WAYPOINTS (à coller dans smooth_plane_path.py) :")
    print("=" * 60)
    way_str = "waypoints = [\n    "
    way_str += ", ".join(f"({round(x[i], 2)}, {round(y[i], 2)})" for i in range(len(x)))
    way_str += "\n]"
    print(way_str)
    print("\n" + "=" * 60)
    print("Pour générer le planePath : copie les waypoints ci-dessus")
    print("dans smooth_plane_path.py puis lance : python scripts/smooth_plane_path.py")
    print("=" * 60)
    plt.close(fig)

# Fenêtre de dessin : x -10 à 110 (pour entrée/sortie hors écran), y 0 à 100
fig, ax = plt.subplots(figsize=(12, 7))
ax.set_xlim(-10, 110)
ax.set_ylim(0, 100)
ax.set_aspect('equal')
ax.grid(True, alpha=0.3)
ax.set_xlabel("X (%) — gauche = 0, droite = 100")
ax.set_ylabel("Y (%) — haut = 0, bas = 100")
ax.set_title("Dessine la trajectoire : CLIC GAUCHE = ajouter un point | ENTREE = terminer et exporter")

# Zone "écran" en gris clair
ax.axvspan(0, 100, alpha=0.1, color='gray')
ax.axvline(0, color='gray', linestyle='--', alpha=0.5)
ax.axvline(100, color='gray', linestyle='--', alpha=0.5)

fig.canvas.mpl_connect('button_press_event', onclick)
fig.canvas.mpl_connect('key_press_event', onkey)

print("Dessine ta trajectoire :")
print("  - Clic gauche = ajouter un point")
print("  - Entree = terminer et afficher les waypoints")
print("")

plt.show()

# Après fermeture : si on a des points, proposer de générer le path
if len(points) >= 2:
    pts = np.array(points)
    x, y = pts[:, 0], pts[:, 1]
    y = np.clip(y, 0, 100)
    # Générer le planePath avec spline comme smooth_plane_path.py
    from scipy.interpolate import CubicSpline
    n = len(x)
    t = np.linspace(0, 1, n)
    cs_x = CubicSpline(t, x, bc_type="natural")
    cs_y = CubicSpline(t, y, bc_type="natural")
    num_points = 180
    t_smooth = np.linspace(0, 1, num_points, endpoint=False)
    x_smooth = cs_x(t_smooth)
    y_smooth = np.clip(cs_y(t_smooth), 0, 100)
    print("\n[Optionnel] planePath lissé (180 points) pour Hero.tsx :")
    print("const planePath = [")
    for i in range(num_points):
        print(f"  {{ x: {round(x_smooth[i], 2)}, y: {round(y_smooth[i], 2)} }},")
    print("];")
