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

# Obtenir les dimensions
width, height = img.size

# Trouver les limites du contenu (en excluant le blanc pur)
# On cherche les pixels qui ne sont pas blancs (255, 255, 255)
pixels = img.load()
left = width
right = 0
top = height
bottom = 0

# Seuil pour considérer un pixel comme "blanc" (pour gérer les variations légères)
white_threshold = 250

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # Si le pixel n'est pas blanc (ou presque blanc)
        if r < white_threshold or g < white_threshold or b < white_threshold:
            if x < left:
                left = x
            if x > right:
                right = x
            if y < top:
                top = y
            if y > bottom:
                bottom = y

# Ajouter une petite marge de sécurité
margin = 5
left = max(0, left - margin)
top = max(0, top - margin)
right = min(width, right + margin)
bottom = min(height, bottom + margin)

# Recadrer l'image au contenu
cropped = img.crop((left, top, right, bottom))

# Dimensions du contenu recadré
content_width, content_height = cropped.size

# Facteur de padding réduit (15% au lieu de 40%)
padding_factor = 0.15

# Calculer les nouvelles dimensions avec padding réduit
new_width = int(content_width * (1 + 2 * padding_factor))
new_height = int(content_height * (1 + 2 * padding_factor))

# Créer un nouveau canvas blanc
new_img = Image.new('RGBA', (new_width, new_height), (255, 255, 255, 255))

# Calculer la position pour centrer l'image recadrée
x_offset = int((new_width - content_width) / 2)
y_offset = int((new_height - content_height) / 2)

# Coller l'image recadrée au centre du nouveau canvas
new_img.paste(cropped, (x_offset, y_offset), cropped if cropped.mode == 'RGBA' else None)

# Convertir en RGB pour sauvegarder (sans transparence)
if new_img.mode == 'RGBA':
    rgb_img = Image.new('RGB', new_img.size, (255, 255, 255))
    rgb_img.paste(new_img, mask=new_img.split()[3])  # Utiliser le canal alpha comme masque
    new_img = rgb_img

# Sauvegarder
new_img.save(output_path, 'PNG', quality=95)
print(f"Image traitée avec succès ! Padding réduit à : {padding_factor * 100}% de chaque côté")
print(f"Dimensions originales : {width}x{height}")
print(f"Contenu recadré : {content_width}x{content_height}")
print(f"Nouvelles dimensions : {new_width}x{new_height}")
