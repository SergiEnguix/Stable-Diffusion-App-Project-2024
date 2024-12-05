        // Funciones para mostrar y ocultar modales
        function showModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        }

        // Detectar si la URL contiene el parámetro 'success'
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('success') && urlParams.get('success') === '1') {
            // Mostrar el pop-up
            alert("¡Tu registro se ha realizado con éxito!");
            // Limpiar el parámetro de la URL para evitar que se muestre repetidamente
            history.replaceState(null, "", window.location.pathname);
        }