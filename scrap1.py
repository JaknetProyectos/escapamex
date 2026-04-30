import requests
from bs4 import BeautifulSoup
import json

def extraer_enlaces_productos():
    # Configuración de la URL y el filtro
    url_objetivo = "https://addyourexperience.com/en/tienda/"
    filtro_base = "https://addyourexperience.com/en/product/"
    archivo_salida = "enlaces_productos.json"

    # User-Agent para evitar bloqueos básicos del servidor
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
    }

    try:
        print(f"Iniciando petición a: {url_objetivo}")
        # Realizar la petición GET
        respuesta = requests.get(url_objetivo, headers=headers)
        
        # Verificar si la petición fue exitosa (código 200)
        respuesta.raise_for_status()
        
        # Parsear el contenido HTML
        soup = BeautifulSoup(respuesta.text, 'html.parser')
        
        # Usamos un set para garantizar que no haya duplicados
        enlaces_unicos = set()
        
        # Buscar todas las etiquetas de enlace <a>
        for etiqueta in soup.find_all('a', href=True):
            href = etiqueta['href']
            # Filtrar enlaces que empiecen con la ruta de productos
            if href.startswith(filtro_base):
                enlaces_unicos.add(href)
        
        # Convertir el set a una lista para poder serializar en JSON
        lista_final = sorted(list(enlaces_unicos))
        
        # Guardar en archivo JSON
        with open(archivo_salida, 'w', encoding='utf-8') as f:
            json.dump(lista_final, f, ensure_ascii=False, indent=4)
            
        print(f"Éxito: Se han extraído {len(lista_final)} enlaces únicos.")
        print(f"Los datos se han guardado en: {archivo_salida}")

    except requests.exceptions.RequestException as e:
        print(f"Error de conexión: {e}")
    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")

if __name__ == "__main__":
    extraer_enlaces_productos()