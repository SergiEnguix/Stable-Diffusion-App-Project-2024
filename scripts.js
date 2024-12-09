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
        const urlParamsSuccess = new URLSearchParams(window.location.search);
        if (urlParamsSuccess.has('success') && urlParamsSuccess.get('success') === '1') {
            // Mostrar el pop-up dinámico
            const alertBoxSuccess = document.getElementById('alertSuccess');
            alertBoxSuccess.style.display = 'block';

            // Ocultar el pop-up después de 10 segundos
            setTimeout(function() {
                alertBoxSuccess.style.display = 'none';
            }, 10000);

            // Eliminar el parámetro 'success' de la URL
            history.replaceState(null, "", window.location.pathname);
        }

        // Detectar si la URL contiene el parámetro 'error'
        const urlParamsFailure = new URLSearchParams(window.location.search);
        if (urlParamsFailure.has('error') && urlParamsFailure.get('error') === '1') {
            // Mostrar el pop-up dinámico
            const alertBoxFailure = document.getElementById('alertFailure');
            alertBoxFailure.style.display = 'block';

            // Ocultar el pop-up después de 10 segundos
            setTimeout(function() {
                alertBoxFailure.style.display = 'none';
            }, 10000);

            // Eliminar el parámetro 'error' de la URL
            history.replaceState(null, "", window.location.pathname);
        }