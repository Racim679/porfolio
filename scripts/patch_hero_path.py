"""Patch Hero.tsx: replace planePath block with content from plane_path_360.txt"""
with open("scripts/plane_path_360.txt", encoding="utf-8") as f:
    p = f.read()
with open("components/Hero.tsx", encoding="utf-8") as f:
    h = f.read()
start = h.find("// Trajectoire dessin")
end = h.find("];", start) + 2
new_block = "// Trajectoire reechantillonnee a densite uniforme (resample_uniform.py) — 360 points\n" + p
h2 = h[:start] + new_block + h[end:]
with open("components/Hero.tsx", "w", encoding="utf-8") as f:
    f.write(h2)
print("Hero.tsx updated with 360 uniform points")
