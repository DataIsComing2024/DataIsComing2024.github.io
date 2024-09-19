
const chatUrl = "http://34.41.73.174:8000/";
// const chatUrl = "http://127.0.0.1:8000/"; // pruebas en local
function eliminarHistorial(rowId) {
    const ids = {};
    const elementos = document.querySelectorAll('[id]');
    
    elementos.forEach(elemento => {
        const id = rowId;
        if (ids[id]) {
            elemento.remove();
        } else {
            ids[id] = true;
        }
    });

    console.log('Elementos duplicados eliminados');
}

function parseMarkdown(text) {
    // Convertir encabezados
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    // Convertir texto en negrita
    text = text.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>');
    // Convertir texto en cursiva
    text = text.replace(/\*(.*)\*/gim, '<i>$1</i>');
    // Convertir listas no ordenadas
    text = text.replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>');
    text = text.replace(/<\/ul>\n<ul>/gim, '');

    // Convertir enlaces
    text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>');

    // Convertir imágenes
    text = text.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1">');
    // Convertir saltos de línea
    text = text.replace(/\n/gim, '<br>');
    return text.trim();
}

function borrarContenido(rowId) {
    document.getElementById(rowId).innerHTML = "";
}
document.getElementById('send-button').addEventListener('click', async () => {
    const queryInput = document.getElementById('query-input');
    const query = queryInput.value;
    const idragInput = document.getElementById('id-rag');
    var id_sesion = idragInput.value;
    if (!query) return;

    // Display the user's query in the chat history
    const chatHistory = document.getElementById('chat-history');
    const userMessage = document.createElement('div');
    userMessage.className = 'message user icon-text';
    userMessage.textContent = `: ${query}`;
    chatHistory.appendChild(userMessage);

    // Send the query to the FastAPI endpoint
    try {
        const datos = {
            question: query,
            id: idragInput.value
          };
        const response = await fetch(chatUrl+'chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const data = await response.json();
        idragInput.value = data.id;
        // Display the response in the chat history
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot icon-text';
        const outputHtml = parseMarkdown(data.answer);
        botMessage.innerHTML = outputHtml;
        chatHistory.appendChild(botMessage);
        toggleVisibilityOn('chat-history')
        toggleVisibilityOn('reset-button')
        // Clear the input field
        queryInput.value = '';
    } catch (error) {
        console.error('Error:', error);
    }
});
document.getElementById('reset-button').addEventListener('click', async () => {
    const queryInput = document.getElementById('query-input');
    queryInput.value = '';
    queryInput.placeholder = 'Nueva pregunta al chat';
    const idragInput = document.getElementById('id-rag');
    idragInput.value = 'Nuevo';
    toggleVisibilityOff('chat-history')
    toggleVisibilityOff('reset-button')
    borrarContenido('chat-history')
    try {
        const datos = {
            question: "Nueva pregunta al chat",
            id: "_"
        };
        const response = await fetch(chatUrl+'chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const data = await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
});