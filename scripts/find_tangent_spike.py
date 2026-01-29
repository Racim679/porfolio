"""
Trouve le(s) point(s) ou la tangente varie brutalement (rotation sequentielle violente).
Reproduit getPlaneRotations de Hero.tsx et calcule les sauts d'angle entre points consecutifs.
"""
import re
import math

HERO_PATH = "components/Hero.tsx"

with open(HERO_PATH, "r", encoding="utf-8") as f:
    content = f.read()

start = content.find("const planePath = [")
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

def get_plane_rotations(path):
    rotations = []
    for i in range(len(path)):
        prev = path[max(0, i - 1)]
        next_pt = path[min(len(path) - 1, i + 1)]
        dx = next_pt[0] - prev[0]
        dy = next_pt[1] - prev[1]
        angle_rad = math.atan2(dy, dx)
        angle_deg = (angle_rad * 180) / math.pi + 40
        rotations.append(angle_deg)
    return rotations

def delta_angle(a1, a2):
    d = a2 - a1
    while d > 180:
        d -= 360
    while d < -180:
        d += 360
    return abs(d)

rotations = get_plane_rotations(points)
deltas = []
for i in range(1, len(rotations)):
    d = delta_angle(rotations[i - 1], rotations[i])
    deltas.append((i, d, points[i], rotations[i - 1], rotations[i]))

deltas.sort(key=lambda x: -x[1])

print("Top 10 points avec le plus grand saut de rotation (tangente parasite):")
print("-" * 70)
for idx, (i, d, pt, r_prev, r_curr) in enumerate(deltas[:10]):
    x, y = pt
    print(f"  #{idx+1} index {i}  ->  delta = {d:.1f} deg   point ({x:.2f}, {y:.2f})   rotation {r_prev:.1f} -> {r_curr:.1f}")

worst_idx = deltas[0][0]
worst_pt = points[worst_idx]
print("-" * 70)
print(f"Point parasite (plus violent): index {worst_idx}, coordonnees ({worst_pt[0]:.2f}, {worst_pt[1]:.2f})")
print(f"  -> Ligne dans Hero.tsx: environ ligne {14 + 1 + worst_idx} (premier point = ligne 15)")
