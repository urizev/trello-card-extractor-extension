// Crear la opción del menú contextual cuando se instala la extensión
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "extractTrelloCards",
        title: "Extraer títulos de tarjetas",
        contexts: ["all"],
        documentUrlPatterns: ["*://trello.com/*"]
    });
});

// Ya no necesitamos el listener onUpdated que estaba causando errores
// porque ahora no dependemos del tracking de clics

// Manejar el clic en la opción del menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "extractTrelloCards") {
        // Ejecutar un script en la página para obtener las tarjetas
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: extractCardsFromPage
        });
    }
});

// Esta función se ejecutará en el contexto de la página
function extractCardsFromPage() {
    console.log('Iniciando extracción de tarjetas de Trello');

    // Buscar todas las listas en Trello
    const allLists = document.querySelectorAll('div[data-testid="list"]');
    console.log(`Se encontraron ${allLists.length} listas en total`);

    if (allLists.length === 0) {
        alert('No se encontraron listas en esta página de Trello.');
        return;
    }

    // Buscar la primera lista con un título que coincida con el formato de fecha (ej: "12 Abr 2025")
    let targetList = null;
    const dateRegex = /^\d{1,2}\s+(Ene|Feb|Mar|Abr|May|Jun|Jul|Ago|Sep|Oct|Nov|Dic)\s+\d{4}$/;

    for (const list of allLists) {
        const headerElement = list.querySelector('h2');
        if (headerElement && dateRegex.test(headerElement.textContent.trim())) {
            targetList = list;
            console.log(`Lista encontrada con título de fecha: "${headerElement.textContent.trim()}"`);
            break;
        }
    }

    if (!targetList) {
        alert('No se encontró ninguna lista con título de fecha (formato: "12 Abr 2025").');
        return;
    }

    // Encontrar todas las tarjetas dentro de la lista objetivo
    const cardsList = targetList.querySelector('ol[data-testid="list-cards"]');

    if (!cardsList) {
        alert('No se encontró la lista de tarjetas dentro de la lista seleccionada.');
        return;
    }

    const cardItems = cardsList.querySelectorAll('li[data-testid="list-card"]');
    console.log(`Se encontraron ${cardItems.length} tarjetas en la lista`);

    if (!cardItems || cardItems.length === 0) {
        alert('No se encontraron tarjetas en esta lista.');
        return;
    }

    // Extraer el texto de los enlaces dentro de cada tarjeta
    const cardTitles = [];
    cardItems.forEach(card => {
        const linkElement = card.querySelector('a');
        if (linkElement && linkElement.textContent) {
            cardTitles.push(linkElement.textContent.trim());
        } else {
            // Si no encuentra el enlace, intentar encontrar cualquier texto en la tarjeta
            const textContent = card.textContent.trim();
            if (textContent) {
                cardTitles.push(textContent);
            }
        }
    });

    if (cardTitles.length === 0) {
        // Si no se encontraron títulos, mostrar un mensaje de error con información de depuración
        let debugInfo = 'Estructura de la primera tarjeta: ';
        if (cardItems.length > 0) {
            debugInfo += cardItems[0].outerHTML.substring(0, 200) + '...';
        }

        alert('No se pudo extraer el texto de las tarjetas.\n\nInformación de depuración:\n' + debugInfo);
        return;
    }

    // Mostrar los títulos en un modal
    showModal(cardTitles.join('\n'));

    // Función para mostrar el modal con los títulos de las tarjetas
    function showModal(content) {
        // Eliminar modal anterior si existe
        const existingModal = document.getElementById('trello-card-extractor-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Crear el modal
        const modal = document.createElement('div');
        modal.id = 'trello-card-extractor-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            max-width: 80%;
            max-height: 80%;
            overflow-y: auto;
            font-family: Arial, sans-serif;
        `;

        // Contenido del modal
        const title = document.createElement('h3');
        title.textContent = 'Títulos de tarjetas';
        title.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #333;';

        const contentArea = document.createElement('pre');
        contentArea.textContent = content;
        contentArea.style.cssText = `
            white-space: pre-wrap;
            margin: 0;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 4px;
            max-height: 300px;
            overflow-y: auto;
            font-family: monospace;
        `;

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copiar al portapapeles';
        copyButton.style.cssText = `
            background-color: #0079bf;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            margin-top: 15px;
            cursor: pointer;
            font-size: 14px;
        `;
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(content).then(() => {
                copyButton.textContent = '¡Copiado!';
                setTimeout(() => {
                    copyButton.textContent = 'Copiar al portapapeles';
                }, 1500);
            });
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Cerrar';
        closeButton.style.cssText = `
            background-color: #ddd;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            margin-top: 15px;
            margin-left: 10px;
            cursor: pointer;
            font-size: 14px;
        `;
        closeButton.addEventListener('click', () => {
            modal.remove();
        });

        // Añadir elementos al modal
        modal.appendChild(title);
        modal.appendChild(contentArea);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; justify-content: flex-end;';
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(closeButton);
        modal.appendChild(buttonContainer);

        // Añadir modal al documento
        document.body.appendChild(modal);

        // Cerrar modal al hacer clic fuera de él
        document.addEventListener('click', function closeModal(e) {
            if (!modal.contains(e.target)) {
                modal.remove();
                document.removeEventListener('click', closeModal);
            }
        });

        // También cerrar con Escape
        document.addEventListener('keydown', function escapeClose(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeClose);
            }
        });
    }
}