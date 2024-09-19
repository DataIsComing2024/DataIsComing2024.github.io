
const apiUrl = "https://analyze-api-100977245211.us-central1.run.app//";
// const apiUrl = "http://127.0.0.1:8001/"; // PRUEBAS EN LOCAL
// Función para obtener el saludo y la información de la API automáticamente al cargar la página
async function fetchInfo() {
    try {
        const saludoResponse = await fetch(apiUrl+'saludo');
        const saludoData = await saludoResponse.json();
        const infoResponse = await fetch(apiUrl+'información_api');
        const infoData = await infoResponse.json();
        document.getElementById('infoContainer').innerHTML = `
            <p>${saludoData.Message}</p>
            <p>${infoData.Message}</p>
        `;
        toggleVisibilityOff('responseAnalize');        
        toggleVisibilityOff('reload-button');
    } catch (error) {
        console.error('Error fetching API info:', error);
        document.getElementById('infoContainer').textContent = 'Error fetching API information.';
        toggleVisibilityOff('reload-button');

    }
}

// Ejecutar fetchInfo al cargar la página
window.onload = fetchInfo;

// Mostrar vista previa de la imagen subida
document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            preview.src = event.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
    toggleVisibilityOn('reload-button');
});

// Función para manejar la subida y análisis de la imagen
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]');
    formData.append('file', fileInput.files[0]);
    try {
        const response = await fetch(apiUrl+'analyze_plant', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'text/html'
            }
        });

        if (response.ok) {
            const html = await response.text();
            console.log(html)
            document.getElementById('responseContainer').innerHTML = html;

            // Mostrar despedida automáticamente después del análisis responseAnalize
            const farewellResponse = await fetch(apiUrl+'despedida');
            const farewellData = await farewellResponse.json();
            document.getElementById('farewellContainer').innerHTML = `<p>${farewellData.Message}</p>`;
            toggleVisibilityOn('responseAnalize')
            toggleVisibilityOn('reload-button')
        } else {
            document.getElementById('responseContainer').textContent = 'Error: Could not analyze the plant.';
            toggleVisibilityOn('responseAnalize')
            toggleVisibilityOn('reload-button')
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('responseContainer').textContent = 'Error: An unexpected error occurred.';
        toggleVisibilityOn('responseAnalize')
        toggleVisibilityOn('reload-button')
}
});
