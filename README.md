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
- `background.js`: Script que gestiona el menú contextual y extrae los títulos
- `popup.html`: Página HTML para el popup de la extensión

## Requisitos

- Google Chrome o cualquier navegador basado en Chromium
- Acceso a una cuenta de Trello