// const chatUrl = "http://127.0.0.1:8000/";
// const apiUrl = "https://your-api-service-100977245211.us-central1.run.app/";

function toggleVisibilityOff(rowId) {
    const row = document.getElementById(rowId);
    if (row.classList.contains('hidden')) {}
    else{
        row.classList.add('hidden');
    }
}
function toggleVisibilityOn(rowId) {
    const row = document.getElementById(rowId);
    if (row.classList.contains('hidden')) {
        row.classList.remove('hidden');
    }
}