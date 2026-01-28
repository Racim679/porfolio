from PIL import Image
import os

# Chemin de l'image
input_path = 'public/photo_racim.png'
output_path = 'public/photo_racim.png'

# Ouvrir l'image
img = Image.open(input_path)

# Convertir en RGBA si nécessaire
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Dimensions originales
original_width, original_height = img.size

# Facteur de padding (ajouter 40% d'espace de chaque côté)
padding_factor = 0.4

# Calculer les nouvelles dimensions
new_width = int(original_width * (1 + 2 * padding_factor))
new_height = int(original_height * (1 + 2 * padding_factor))

# Créer un nouveau canvas blanc
new_img = Image.new('RGBA', (new_width, new_height), (255, 255, 255, 255))

# Calculer la position pour centrer l'image originale
x_offset = int((new_width - original_width) / 2)
y_offset = int((new_height - original_height) / 2)

# Coller l'image originale au centre du nouveau canvas
new_img.paste(img, (x_offset, y_offset), img if img.mode == 'RGBA' else None)

# Convertir en RGB pour sauvegarder (sans transparence)
if new_img.mode == 'RGBA':
    rgb_img = Image.new('RGB', new_img.size, (255, 255, 255))
    rgb_img.paste(new_img, mask=new_img.split()[3])  # Utiliser le canal alpha comme masque
    new_img = rgb_img

# Sauvegarder
new_img.save(output_path, 'PNG', quality=95)
print(f"Image traitée avec succès ! Padding ajouté : {padding_factor * 100}% de chaque côté")
print(f"Nouvelles dimensions : {new_width}x{new_height} (original : {original_width}x{original_height})")
