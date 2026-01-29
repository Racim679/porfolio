"""
Tronque planePath dans Hero.tsx : garde uniquement les points du debut
jusqu'au point le plus a droite (inclus). L'avion sort a droite puis
reapparait a gauche au loop, sans retraverser l'ecran.
"""
import re

HERO_PATH = "components/Hero.tsx"

with open(HERO_PATH, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = "const planePath = ["
start = content.find(start_marker)
if start == -1:
    raise SystemExit("planePath non trouve")
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

if not points:
    raise SystemExit("Aucun point trouve")

# Index du point le plus a droite (dernier en cas d'egalite)
max_x = max(p[0] for p in points)
last_right_idx = max(i for i, p in enumerate(points) if p[0] == max_x)
trimmed = points[: last_right_idx + 1]

print(f"Points avant: {len(points)}, apres trim (fin au x max={max_x}): {len(trimmed)}")

# Reconstruire le bloc
new_block = "\n".join(f"  {{ x: {round(x, 2)}, y: {round(y, 2)} }}," for x, y in trimmed)
new_array = "const planePath = [\n" + new_block + "\n];"

# Remplacer l'ancien bloc (du debut de "const planePath" au "];" correspondant)
start_replace = content.find("const planePath = [")
end_replace = content.find("];", start_replace) + 2
new_content = content[:start_replace] + new_array + content[end_replace:]

with open(HERO_PATH, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Hero.tsx mis a jour : trajectoire tronquee a {len(trimmed)} points (sortie a droite).")
