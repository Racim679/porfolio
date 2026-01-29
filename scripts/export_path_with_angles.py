#!/usr/bin/env python3
"""
Exporte le planePath actuel de Hero.tsx avec les angles de tangente associés.

Pour chaque point :
  - index
  - x, y
  - angle_deg : même calcul que getPlaneRotations dans Hero.tsx

Utilisation (depuis le dossier `portfolio`) :
  python scripts/export_path_with_angles.py

Affiche un tableau dans la console et écrit aussi un CSV :
  scripts/plane_path_with_angles.csv
"""

import math
import re
from pathlib import Path

HERO_PATH = Path("components/Hero.tsx")
CSV_PATH = Path("scripts/plane_path_with_angles.csv")


def load_plane_path():
  content = HERO_PATH.read_text(encoding="utf-8")
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
  return points


def compute_rotations(points):
  """Même logique que getPlaneRotations dans Hero.tsx."""
  rotations = []
  for i in range(len(points)):
    prev = points[max(0, i - 1)]
    nxt = points[min(len(points) - 1, i + 1)]
    dx = nxt[0] - prev[0]
    dy = nxt[1] - prev[1]
    angle_rad = math.atan2(dy, dx)
    angle_deg = (angle_rad * 180.0) / math.pi + 40.0
    rotations.append(angle_deg)
  return rotations


def main():
  points = load_plane_path()
  if len(points) < 2:
    raise SystemExit("planePath contient moins de 2 points.")

  rotations = compute_rotations(points)

  # Affichage console (limité pour rester lisible)
  print(f"Nombre de points : {len(points)}")
  print("index,x,y,angle_deg")
  for i, ((x, y), ang) in enumerate(zip(points, rotations)):
    print(f"{i},{x:.2f},{y:.2f},{ang:.2f}")

  # Export CSV complet
  CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
  with CSV_PATH.open("w", encoding="utf-8", newline="") as f:
    f.write("index,x,y,angle_deg\n")
    for i, ((x, y), ang) in enumerate(zip(points, rotations)):
      f.write(f"{i},{x:.6f},{y:.6f},{ang:.6f}\n")

  print()
  print(f"Fichier CSV écrit : {CSV_PATH}")


if __name__ == "__main__":
  main()

