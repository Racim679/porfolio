"""
Supprime les points du planePath qui provoquent des sauts de rotation violents.
Indices identifies par find_tangent_spike.py (top 10 sauts de tangente).
"""
import re

HERO_PATH = "components/Hero.tsx"

# Indices a supprimer (tri decroissant pour ne pas deplacer les autres)
# Top 10: 195, 217, 196, 194, 190, 189, 219, 171, 83, 239
INDICES_A_SUPPRIMER = sorted([195, 217, 196, 194, 190, 189, 219, 171, 83, 239], reverse=True)

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

# Supprimer les indices (en ordre decroissant)
for idx in INDICES_A_SUPPRIMER:
    if 0 <= idx < len(points):
        points.pop(idx)

print(f"Points supprimes: {len(INDICES_A_SUPPRIMER)}, reste {len(points)} points")

# Reconstruire le bloc
new_block = "\n".join(f"  {{ x: {round(x, 2)}, y: {round(y, 2)} }}," for x, y in points)
new_array = "const planePath = [\n" + new_block + "\n];"

start_replace = content.find("const planePath = [")
end_replace = content.find("];", start_replace) + 2
new_content = content[:start_replace] + new_array + content[end_replace:]

with open(HERO_PATH, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Hero.tsx mis a jour : {len(points)} points dans planePath.")
