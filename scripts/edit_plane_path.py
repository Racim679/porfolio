"""
Modification manuelle du planePath dans Hero.tsx :
- Supprimer des points (par index)
- Ajouter des points (insérer à un index ou à la fin)

Modifie la section CONFIGURATION ci-dessous puis lance :
  python scripts/edit_plane_path.py
"""
import re

HERO_PATH = "components/Hero.tsx"

# =============================================================================
# CONFIGURATION — Modifier ici
# =============================================================================

# Indices des points à SUPPRIMER (0 = premier point, 1 = deuxième, etc.)
# Exemple : [0, 5, 10] supprime les points aux indices 0, 5 et 10
REMOVE_INDICES = []

# Points à AJOUTER. Chaque élément est :
#   - (index, x, y)  → insère le point (x, y) à la position index
#   - (x, y)         → ajoute le point (x, y) à la fin du chemin
# Exemples :
#   [(3, 12.5, 48.0)]           → insère (12.5, 48.0) à l'index 3
#   [(10.0, 50.0), (20.0, 55.0)] → ajoute deux points à la fin
ADD_POINTS = []

# =============================================================================


def load_plane_path(content):
    """Extrait le tableau planePath du contenu Hero.tsx."""
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
        points.append((x, y))
    return points, start, content.find("];", start) + 2


def save_plane_path(content, points, start_replace, end_replace):
    """Réécrit le bloc planePath dans le contenu."""
    new_block = "\n".join(f"  {{ x: {round(x, 2)}, y: {round(y, 2)} }}," for x, y in points)
    new_array = "const planePath = [\n" + new_block + "\n];"
    return content[:start_replace] + new_array + content[end_replace:]


def main():
    with open(HERO_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    points, block_start, block_end = load_plane_path(content)
    start_replace = content.find("const planePath = [")
    n_initial = len(points)

    if not REMOVE_INDICES and not ADD_POINTS:
        print(f"Aucune modification demandée. planePath actuel : {n_initial} points.")
        print("Modifiez REMOVE_INDICES et/ou ADD_POINTS en haut du script puis relancez.")
        return

    # 1. Supprimer les indices (en ordre décroissant pour ne pas décaler)
    for idx in sorted(REMOVE_INDICES, reverse=True):
        if 0 <= idx < len(points):
            points.pop(idx)

    n_after_remove = len(points)

    # 2. Ajouter les points
    for item in ADD_POINTS:
        if len(item) == 3:
            index, x, y = item
            index = min(max(0, index), len(points))
            points.insert(index, (x, y))
        elif len(item) == 2:
            x, y = item
            points.append((x, y))
        else:
            print(f"Ignoré (format invalide): {item}")

    n_final = len(points)

    new_content = save_plane_path(content, points, start_replace, block_end)

    # Mettre à jour le commentaire avec le nouveau nombre de points
    import re as re_comment
    new_content = re_comment.sub(
        r"(// Trajectoire[^\n]*— )\d+( points)",
        rf"\g<1>{n_final}\g<2>",
        new_content,
        count=1,
    )

    with open(HERO_PATH, "w", encoding="utf-8") as f:
        f.write(new_content)

    print("Hero.tsx mis à jour.")
    print(f"  Points initiaux : {n_initial}")
    print(f"  Supprimés       : {n_initial - n_after_remove} (indices {REMOVE_INDICES})")
    print(f"  Ajoutés         : {n_final - n_after_remove}")
    print(f"  Points finaux   : {n_final}")


if __name__ == "__main__":
    main()
