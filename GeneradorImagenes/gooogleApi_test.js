const response = await fetch(`${endpoint}?key=${apiKey}`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
});

if (!response.ok) {
    const errorResponse = await response.text();  // Obtiene el cuerpo de la respuesta de error
    throw new Error(`Error en la traducción: ${response.statusText} - ${errorResponse}`);
}

const data = await response.json();
