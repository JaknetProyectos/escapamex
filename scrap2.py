import requests
from bs4 import BeautifulSoup
import json
import re
import time

def limpiar_texto(texto):
    if not texto: return ""
    return " ".join(texto.strip().split())

def extraer_datos_producto(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        texto_completo = soup.get_text(separator=" ") # Texto plano de toda la página
        
        # --- 1. TÍTULO ---
        title_tag = soup.select_one('h1.product_title, h1.elementor-heading-title, h1.entry-title')
        titulo = limpiar_texto(title_tag.get_text()) if title_tag else url.strip('/').split('/')[-1].replace('-', ' ').capitalize()

        # --- 2. PRECIO (Heurística: $ / comas / MXN) ---
        precio = "No encontrado"
        # Buscamos el patrón exacto: $ seguido de números/comas, luego MXN, opcionalmente IVA Incluido
        patron_precio = r'\$\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s?MXN(?:\s*IVA\s*Incluido)?'
        match_p = re.search(patron_precio, texto_completo, re.IGNORECASE)
        
        if match_p:
            precio = match_p.group(0)
        else:
            # Fallback si no dice MXN pero tiene el formato de moneda
            match_fallback = re.search(r'\$\s?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', texto_completo)
            if match_fallback:
                precio = f"{match_fallback.group(0)} MXN"

        # --- 3. DURACIÓN (Heurística: horas / hora) ---
        duracion = "No especificada"
        # Buscamos un número seguido de hora, horas, hrs, h
        # Ejemplo: "4 horas", "1.5 horas", "2 hrs"
        match_duracion = re.search(r'(\d+(?:\.\d+)?)\s*(?:hora|horas|hrs|h)\b', texto_completo, re.IGNORECASE)
        if match_duracion:
            duracion = match_duracion.group(0).strip()
        else:
            # Fallback por si dice "Duración: Todo el día" o algo similar
            elemento_duracion = soup.find(string=re.compile(r'Duración:', re.IGNORECASE))
            if elemento_duracion:
                match = re.search(r'Duración:\s*([^\n|•]*)', elemento_duracion, re.IGNORECASE)
                if match: duracion = limpiar_texto(match.group(1))

        # --- 4. IMÁGENES ---
        imagenes = []
        for img in soup.find_all('img', src=True):
            src = img['src']
            if 'wp-content/uploads' in src and any(char.isdigit() for char in src):
                if src not in imagenes: imagenes.append(src)

        # --- 5. DESCRIPCIÓN ---
        descripcion = ""
        desc_label = soup.find(string=re.compile(r'Descripción:', re.IGNORECASE))
        if desc_label:
            parent = desc_label.find_parent()
            siguiente = parent.find_next_sibling() if parent else None
            if siguiente: descripcion = limpiar_texto(siguiente.get_text())
        
        if not descripcion:
            p_mso = soup.find_all(class_=re.compile(r'MsoNormal', re.IGNORECASE))
            if p_mso: descripcion = "\n".join([limpiar_texto(p.get_text()) for p in p_mso if len(p.get_text()) > 20])
        
        # --- 6. INCLUYE ---
        incluye = []
        incluye_label = soup.find(string=re.compile(r'Incluye:', re.IGNORECASE))
        if incluye_label:
            contenedor_lista = incluye_label.find_parent().find_next(['ul', 'div', 'p'])
            if contenedor_lista:
                items = contenedor_lista.find_all('li')
                if items:
                    incluye = [limpiar_texto(li.get_text()) for li in items]
                else:
                    incluye = [limpiar_texto(x) for x in contenedor_lista.get_text().split('\n') if len(x) > 3]

        return {
            "url": url,
            "titulo": titulo,
            "precio": precio,
            "duracion": duracion,
            "descripcion": descripcion,
            "incluye": incluye,
            "imagenes": imagenes[:10]
        }

    except Exception as e:
        return {"url": url, "error": str(e)}

# Ejecución de prueba
def procesar_lista_enlaces(archivo_entrada, archivo_salida):
    try:
        with open(archivo_entrada, 'r', encoding='utf-8') as f:
            enlaces = json.load(f)
        
        print(f"Se cargaron {len(enlaces)} enlaces. Iniciando procesamiento...")
        
        resultados = []
        for i, url in enumerate(enlaces):
            print(f"[{i+1}/{len(enlaces)}] Procesando: {url}")
            datos = extraer_datos_producto(url)
            resultados.append(datos)
            # Pequeña pausa para no saturar el servidor
            time.sleep(1)
        
        with open(archivo_salida, 'w', encoding='utf-8') as f:
            json.dump(resultados, f, indent=4, ensure_ascii=False)
            
        print(f"\n¡Proceso completado! Datos guardados en {archivo_salida}")

    except Exception as e:
        print(f"Error general: {e}")

if __name__ == "__main__":
    # Ejecuta el procesamiento masivo
    procesar_lista_enlaces('enlaces_productos.json', 'productos_final.json')