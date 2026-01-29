#!/usr/bin/env python3
"""
Édition du planePath sur le graphique (comme draw_trajectory.py).
- Charge la trajectoire depuis Hero.tsx et l'affiche.
- MOUSSE : zoom avant/arrière (centré sur le curseur).
- R : réinitialiser la vue (zoom 100%).
- Clic GAUCHE sur la courbe : ajoute un point EXACTEMENT où tu cliques.
- Clic DROIT près d'un point : supprime ce point.
- G : saisir un index de point pour centrer/zoomer dessus et afficher son angle.
- ENTREE : enregistre dans Hero.tsx et quitte.
"""

import re
import math
import matplotlib.pyplot as plt

HERO_PATH = "components/Hero.tsx"

# Rayon (en unités x/y) en dessous duquel un clic droit supprime le point
PICK_RADIUS = 3.0

# Limites de la vue complète (pour reset zoom)
XLIM_FULL = (-10, 120)
YLIM_FULL = (0, 100)
ZOOM_FACTOR = 1.15  # facteur de zoom par cran de molette


def load_plane_path_from_hero():
    """Charge le planePath depuis Hero.tsx."""
    with open(HERO_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    start = content.find("const planePath = [")
    if start == -1:
        raise SystemExit("planePath non trouvé dans Hero.tsx")
    start = content.index("[", start) + 1
    depth = 1
    i = start
    while i < len(content) and depth > 0:
        if content[i] == "[":
            depth += 1
        elif content[i] == "]":
            depth -= 1
        i += 1
    block = content[start : i - 1]
    points = []
    for m in re.finditer(r"\{\s*x:\s*([\d.-]+)\s*,\s*y:\s*([\d.-]+)\s*\}", block):
        x, y = float(m.group(1)), float(m.group(2))
        points.append([x, y])
    return points, content


def save_plane_path_to_hero(content, points):
    """Écrit le planePath dans Hero.tsx."""
    new_block = "\n".join(f"  {{ x: {round(x, 2)}, y: {round(y, 2)} }}," for x, y in points)
    new_array = "const planePath = [\n" + new_block + "\n];"
    start_replace = content.find("const planePath = [")
    end_replace = content.find("];", start_replace) + 2
    new_content = content[:start_replace] + new_array + content[end_replace:]
    # Mettre à jour le commentaire (nombre de points)
    new_content = re.sub(
        r"(// Trajectoire[^\n]*— )\d+( points)",
        rf"\g<1>{len(points)}\g<2>",
        new_content,
        count=1,
    )
    with open(HERO_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Hero.tsx mis à jour : {len(points)} points.")


def dist_point_point(a, b):
    return math.hypot(b[0] - a[0], b[1] - a[1])


def dist_point_segment(p, a, b):
    """Distance du point p au segment [a, b]."""
    dx = b[0] - a[0]
    dy = b[1] - a[1]
    length_sq = dx * dx + dy * dy
    if length_sq == 0:
        return dist_point_point(p, a)
    t = max(0, min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / length_sq))
    proj = [a[0] + t * dx, a[1] + t * dy]
    return dist_point_point(p, proj), proj


def find_nearest_point_index(points, x, y):
    """Index du point le plus proche de (x, y), ou None si plus loin que PICK_RADIUS."""
    best_i = None
    best_d = PICK_RADIUS
    for i, p in enumerate(points):
        d = dist_point_point([x, y], p)
        if d < best_d:
            best_d = d
            best_i = i
    return best_i


def find_nearest_segment_index(points, x, y):
    """Index où insérer (après le segment le plus proche du clic). Le nouveau point sera à (x,y) exact."""
    if len(points) < 2:
        return 0
    best_i = 1
    best_d, _ = dist_point_segment([x, y], points[0], points[1])
    for i in range(1, len(points) - 1):
        d, _ = dist_point_segment([x, y], points[i], points[i + 1])
        if d < best_d:
            best_d = d
            best_i = i + 1
    return best_i


def redraw(ax, points, line_plot, pt_plot):
    """Met à jour le graphique."""
    if not points:
        line_plot.set_data([], [])
        pt_plot.set_data([], [])
    else:
        xs, ys = [p[0] for p in points], [p[1] for p in points]
        line_plot.set_data(xs, ys)
        pt_plot.set_data(xs, ys)
    ax.figure.canvas.draw_idle()


def main():
    points, file_content = load_plane_path_from_hero()
    if len(points) < 2:
        print("La trajectoire doit avoir au moins 2 points.")
        return

    fig, ax = plt.subplots(figsize=(12, 7))
    ax.set_xlim(XLIM_FULL)
    ax.set_ylim(YLIM_FULL)
    ax.set_aspect("equal")
    ax.grid(True, alpha=0.3)
    ax.set_xlabel("X (%)")
    ax.set_ylabel("Y (%)")
    ax.set_title(
        "Édition trajectoire — MOUSSE = zoom | R = vue complète | GAUCHE = ajouter (où tu cliques) | DROIT = supprimer | ENTREE = enregistrer"
    )
    ax.axvspan(0, 100, alpha=0.1, color="gray")
    ax.axvline(0, color="gray", linestyle="--", alpha=0.5)
    ax.axvline(100, color="gray", linestyle="--", alpha=0.5)

    xs, ys = [p[0] for p in points], [p[1] for p in points]
    (line_plot,) = ax.plot(xs, ys, "b-", linewidth=2, label="Trajectoire")
    (pt_plot,) = ax.plot(xs, ys, "ro", markersize=5, picker=8)

    # Point sélectionné (mis en évidence lorsqu'on "goto" un index)
    (selected_plot,) = ax.plot([], [], "yo", markersize=10, zorder=5)

    def compute_angle_deg(idx: int) -> float:
        """Calcule l'angle (en degrés) au point idx, avec le même offset que dans Hero.tsx (+40°)."""
        prev = points[max(0, idx - 1)]
        nxt = points[min(len(points) - 1, idx + 1)]
        dx = nxt[0] - prev[0]
        dy = nxt[1] - prev[1]
        angle_rad = math.atan2(dy, dx)
        angle_deg = angle_rad * 180.0 / math.pi + 40.0
        return angle_deg

    def goto_index(idx: int):
        """Centre/zoome sur le point d'index idx et affiche son angle."""
        if not (0 <= idx < len(points)):
            print(f"Index {idx} en dehors des bornes [0, {len(points) - 1}]")
            return
        x, y = points[idx]
        selected_plot.set_data([x], [y])

        # Zoom serré autour du point (fenêtre 40x40)
        half_width = 20
        half_height = 20
        ax.set_xlim(x - half_width, x + half_width)
        ax.set_ylim(y - half_height, y + half_height)
        ax.figure.canvas.draw_idle()

        angle = compute_angle_deg(idx)
        print(f"Point index {idx} -> x={x:.2f}, y={y:.2f}, angle≈{angle:.2f}°")

    def on_click(event):
        if event.xdata is None or event.ydata is None:
            return
        x, y = float(event.xdata), float(event.ydata)
        if event.button == 1:
            # Clic gauche : TOUJOURS ajouter un point exactement où tu cliques
            i_ins = find_nearest_segment_index(points, x, y)
            points.insert(i_ins, [round(x, 2), round(y, 2)])
            print(f"  Point ajouté à l'index {i_ins} : ({x:.2f}, {y:.2f}). Total {len(points)} points.")
        else:
            # Clic droit : supprimer le point le plus proche (si dans le rayon)
            i_remove = find_nearest_point_index(points, x, y)
            if i_remove is not None:
                points.pop(i_remove)
                print(f"  Point supprimé (index {i_remove}). Reste {len(points)} points.")
            else:
                print("  Clic droit : aucun point assez proche. Zoome ou rapproche-toi du point à supprimer.")
        redraw(ax, points, line_plot, pt_plot)

    def on_key(event):
        if event.key in ("enter", "return"):
            if len(points) < 2:
                print("Il faut au moins 2 points pour enregistrer.")
                return
            save_plane_path_to_hero(file_content, points)
            plt.close(fig)
        elif event.key in ("r", "R"):
            ax.set_xlim(XLIM_FULL)
            ax.set_ylim(YLIM_FULL)
            ax.figure.canvas.draw_idle()
            print("  Vue réinitialisée (zoom 100%).")
        elif event.key in ("g", "G"):
            try:
                raw = input(f"  Aller à l'index (0–{len(points) - 1}) : ")
                idx = int(raw.strip())
            except (ValueError, EOFError):
                print("  Index invalide.")
                return
            goto_index(idx)

    def on_scroll(event):
        if event.xdata is None or event.ydata is None:
            return
        x, y = event.xdata, event.ydata
        xlim = ax.get_xlim()
        ylim = ax.get_ylim()
        if event.button == "up":
            scale = 1.0 / ZOOM_FACTOR
        else:
            scale = ZOOM_FACTOR
        new_width = (xlim[1] - xlim[0]) * scale
        new_height = (ylim[1] - ylim[0]) * scale
        x_center = (xlim[0] + xlim[1]) / 2
        y_center = (ylim[0] + ylim[1]) / 2
        # Zoom vers le curseur : déplacer le centre vers (x, y) un peu
        t = 1 - scale
        x_center = x * t + x_center * scale
        y_center = y * t + y_center * scale
        ax.set_xlim(x_center - new_width / 2, x_center + new_width / 2)
        ax.set_ylim(y_center - new_height / 2, y_center + new_height / 2)
        ax.figure.canvas.draw_idle()

    fig.canvas.mpl_connect("button_press_event", on_click)
    fig.canvas.mpl_connect("key_press_event", on_key)
    fig.canvas.mpl_connect("scroll_event", on_scroll)

    print("Édition sur le graphique :")
    print("  - MOUSSE = zoom avant/arrière (centré sur le curseur)")
    print("  - R = réinitialiser la vue (vue complète)")
    print("  - Clic GAUCHE = ajouter un point EXACTEMENT où tu cliques (inséré au bon endroit sur la courbe)")
    print("  - Clic DROIT sur un point (proche) = supprimer ce point")
    print("  - G = saisir un index pour centrer/zoomer sur ce point et voir son angle")
    print("  - ENTREE = enregistrer dans Hero.tsx et quitter")
    print("")

    plt.show()


if __name__ == "__main__":
    main()
