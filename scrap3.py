import json
import re
import uuid
from collections import Counter

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def parse_price(price_str):
    if not price_str or "Sujeto" in price_str:
        return 0.0, None
    range_match = re.search(r'\$\s?([\d,.]+)\s*-\s*\$\s?([\d,.]+)', price_str)
    if range_match:
        p1 = float(range_match.group(1).replace(',', ''))
        p2 = float(range_match.group(2).replace(',', ''))
        return p1, p2
    single_match = re.search(r'\$\s?([\d,.]+)', price_str)
    if single_match:
        p = float(single_match.group(1).replace(',', ''))
        return p, None
    return 0.0, None

def detect_location(text):
    text = text.lower()
    if 'cancún' in text or 'cancun' in text: return 'Cancún'
    if 'oaxaca' in text or 'zapoteca' in text or 'hierve el agua' in text: return 'Oaxaca'
    if 'cdmx' in text or 'xochimilco' in text or 'teotihuacán' in text or 'basílica' in text: return 'CDMX'
    if 'holbox' in text: return 'Holbox'
    if 'cozumel' in text: return 'Cozumel'
    if 'vallarta' in text: return 'Puerto Vallarta'
    return 'México'

def detect_category(text):
    text = text.lower()
    if 'taller' in text or 'clase' in text: return 'Talleres'
    if any(word in text for word in ['cena', 'sabores', 'gastronomía', 'mercado', 'churros']): return 'Gastronomía'
    if any(word in text for word in ['snorkel', 'marino', 'arrecife', 'catamarán', 'sailing']): return 'Aventura Acuática'
    if any(word in text for word in ['historia', 'arqueológico', 'zapoteca', 'teotihuacán']): return 'Cultura'
    if any(word in text for word in ['naturaleza', 'selva', 'caballo', 'camello']): return 'Naturaleza'
    return 'Aventura'

def escape_sql(val):
    if val is None: return "NULL"
    if isinstance(val, (int, float)): return str(val)
    if isinstance(val, bool): return str(val).lower()
    if isinstance(val, (list, dict)):
        return "'" + json.dumps(val, ensure_ascii=False).replace("'", "''") + "'"
    return "'" + str(val).replace("'", "''") + "'"

# 1. Cargar y Analizar imágenes comunes
with open('productos_final.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Contar qué imágenes se repiten mucho (logos globales)
image_counts = Counter()
for item in data:
    for img in item.get('imagenes', []):
        image_counts[img] += 1

# Si una imagen aparece en > 30% de las experiencias, es basura (logo)
common_images = {img for img, count in image_counts.items() if count > (len(data) * 0.3)}

# Patrones de nombres de archivo que suelen ser basura
garbage_patterns = ['logo', 'payment', 'icon', 'recurso-1', 'recurso-5', 'social-', 'favicon']

output_sql = []

# 2. SQL Schema
schema_sql = """create table if not exists public.experiences_escapamex (
  id text not null,
  slug text not null,
  title text not null,
  category text not null,
  description text not null,
  short_description text not null,
  price numeric not null,
  price_max numeric null,
  currency text not null,
  image text not null,
  images jsonb not null,
  included jsonb not null,
  duration text not null,
  location text not null,
  rating numeric null default 0,
  reviews integer null default 0,
  featured boolean null default false,
  created_at timestamp without time zone null default now(),
  tafiras json null,
  constraint experiences_escapamex_pkey primary key (id),
  constraint experiences_escapamex_slug_key unique (slug)
);
"""
output_sql.append(schema_sql)

# 3. Procesar
for item in data:
    title = item.get('titulo', 'Sin título')
    url = item.get('url', '')
    slug = url.strip('/').split('/')[-1] if url else slugify(title)
    uid = str(uuid.uuid5(uuid.NAMESPACE_DNS, slug))
    
    desc = item.get('descripcion', '')
    short_desc = desc[:147] + '...' if len(desc) > 150 else desc
    price, price_max = parse_price(item.get('precio', ''))
    
    # --- LIMPIEZA DE IMÁGENES ---
    all_imgs = item.get('imagenes', [])
    filtered_imgs = [
        img for img in all_imgs 
        if img not in common_images 
        and not any(p in img.lower() for p in garbage_patterns)
    ]
    
    main_img = filtered_imgs[0] if filtered_imgs else ''
    # ----------------------------

    location = detect_location(title + " " + desc)
    category = detect_category(title + " " + desc)
    tarifas = item.get('tarifas_por_cantidad', None)
    
    fields = [
        ('id', uid), ('slug', slug), ('title', title), ('category', category),
        ('description', desc), ('short_description', short_desc),
        ('price', price), ('price_max', price_max), ('currency', 'MXN'),
        ('image', main_img), ('images', filtered_imgs), ('included', item.get('incluye', [])),
        ('duration', item.get('duracion', 'No especificada')), ('location', location),
        ('tafiras', tarifas)
    ]
    
    cols = [f[0] for f in fields]
    vals = [escape_sql(f[1]) for f in fields]
    
    sql = f"INSERT INTO public.experiences_escapamex ({', '.join(cols)}) VALUES ({', '.join(vals)}) ON CONFLICT (slug) DO NOTHING;"
    output_sql.append(sql)

with open('import_supabase.sql', 'w', encoding='utf-8') as f:
    f.write("\n".join(output_sql))

print("SQL generado exitosamente eliminando imágenes duplicadas/logos.")