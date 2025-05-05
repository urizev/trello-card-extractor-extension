# Trello Cards Extractor

Esta extensión de Chrome te permite extraer fácilmente los títulos de todas las tarjetas de una lista en Trello.

## Características

- Extrae todos los títulos de las tarjetas de una lista de Trello
- Muestra los títulos en un modal limpio y ordenado
- Permite copiar los títulos al portapapeles con un solo clic
- Se integra con el menú contextual (clic derecho) de Chrome

## Instalación

1. Descarga o clona este repositorio
2. Abre Chrome y navega a `chrome://extensions/`
3. Activa el "Modo desarrollador" en la esquina superior derecha
4. Haz clic en "Cargar descomprimida" y selecciona la carpeta de la extensión

## Uso

1. Navega a cualquier tablero de Trello
2. Haz clic derecho sobre cualquier elemento dentro de una lista
3. Selecciona "Extraer títulos de tarjetas" del menú contextual
4. Se mostrará un modal con todos los títulos de las tarjetas de esa lista
5. Puedes copiar los títulos al portapapeles usando el botón "Copiar al portapapeles"

## Estructura de archivos

- `manifest.json`: Configuración de la extensión
- `background.js`: Script que gestiona el menú contextual
- `content.js`: Script que se ejecuta en la página de Trello para extraer los títulos
- `popup.html`: Página HTML para el popup de la extensión

## Requisitos

- Google Chrome o cualquier navegador basado en Chromium
- Acceso a una cuenta de Trello

## Notas

Esta extensión busca el elemento `<ol data-testid="list-cards">` y dentro de él encuentra todos los `<li data-testid="list-card">` para extraer el contenido de texto de los elementos `<a>` dentro de cada tarjeta.

## Solución de problemas

Si no aparece la opción del menú contextual:
1. Asegúrate de estar en una página de Trello
2. Verifica que la extensión esté habilitada
3. Recarga la página y/o la extensión

## Creación de los iconos

Para completar la extensión, necesitarás crear tres iconos de diferentes tamaños:
- icon16.png (16x16 píxeles)
- icon48.png (48x48 píxeles)
- icon128.png (128x128 píxeles)

Colócalos en una carpeta llamada `images` dentro del directorio de la extensión.