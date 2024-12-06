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
            // Mostrar el pop-up dinámico
            const alertBox = document.getElementById('alert');
            alertBox.style.display = 'block';

            // Ocultar el pop-up después de 10 segundos
            setTimeout(function() {
                alertBox.style.display = 'none';
            }, 10000);

            // Eliminar el parámetro 'success' de la URL
            history.replaceState(null, "", window.location.pathname);
        }