"""
Reechantillonne la trajectoire planePath pour avoir une densite de points
uniforme (espacement egal en longueur d'arc). Lit les points depuis
Hero.tsx (extrait manuel) et affiche le nouveau planePath pour copier.
"""
import re
import math

# Lit le fichier Hero.tsx et extrait planePath
HERO_PATH = "components/Hero.tsx"

def parse_plane_path_from_file():
    with open(HERO_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    # Extraire le contenu entre "const planePath = [" et "];"
    start = content.find("const planePath = [")
    if start == -1:
        raise SystemExit("planePath non trouve dans Hero.tsx")
    start = content.index("[", start) + 1
    depth = 1
    i = start
    while i < len(content) and depth > 0:
        if content[i] == "[":
            depth += 1
        elif content[i] == "]":
            depth -= 1
        i += 1
    block = content[start:i-1]
    points = []
    for m in re.finditer(r"\{\s*x:\s*([\d.-]+)\s*,\s*y:\s*([\d.-]+)\s*\}", block):
        x, y = float(m.group(1)), float(m.group(2))
        points.append((x, y))
    return points

def dist(p, q):
    return math.hypot(q[0] - p[0], q[1] - p[1])

def resample_uniform(points, num_output):
    if len(points) < 2:
        return list(points)
    # Longueurs des segments et longueur totale
    lengths = [dist(points[i], points[i+1]) for i in range(len(points)-1)]
    total = sum(lengths)
    if total <= 0:
        return list(points)
    # Positions cumulatives (arc length) au debut de chaque segment
    cumul = [0.0]
    for L in lengths:
        cumul.append(cumul[-1] + L)
    # Cibles: num_output points espaces uniformement en arc length
    out = []
    for k in range(num_output):
        s = total * k / (num_output - 1) if num_output > 1 else 0
        s = min(s, total - 1e-9)
        # Trouver le segment [cumul[i], cumul[i+1]] qui contient s
        i = 0
        while i < len(cumul) - 1 and cumul[i+1] < s:
            i += 1
        if i >= len(cumul) - 1:
            i = len(cumul) - 2
        seg_len = lengths[i]
        t = (s - cumul[i]) / seg_len if seg_len > 0 else 0
        t = max(0, min(1, t))
        x = points[i][0] + t * (points[i+1][0] - points[i][0])
        y = points[i][1] + t * (points[i+1][1] - points[i][1])
        out.append((x, y))
    return out

def main():
    import sys
    points = parse_plane_path_from_file()
    # Reechantillonner avec plus de points et densite uniforme (500 = plus fluide)
    num_output = 500
    uniform = resample_uniform(points, num_output)
    out_path = "scripts/plane_path_500.txt"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("const planePath = [\n")
        for x, y in uniform:
            f.write(f"  {{ x: {round(x, 2)}, y: {round(y, 2)} }},\n")
        f.write("];\n")
    print(f"Points lus: {len(points)} -> {len(uniform)} points (densite uniforme), ecrit dans {out_path}")

if __name__ == "__main__":
    main()
