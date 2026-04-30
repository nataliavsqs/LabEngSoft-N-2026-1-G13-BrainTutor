// Gerenciamento da funcionalidade de esqueci a senha

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgotPasswordForm');
    const submitBtn = document.getElementById('submitBtn');
    const backBtn = document.getElementById('backBtn');
    const messageContainer = document.getElementById('messageContainer');
    const emailInput = document.getElementById('email');

    // Voltar para login
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Enviar formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();

        // Validação
        if (!email) {
            showMessage('Por favor, digite seu email', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Por favor, digite um email válido', 'error');
            return;
        }

        // Desabilitar botão durante envio
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Enviando...';

        try {
            const response = await fetch(getApiUrl(APP_CONFIG.ENDPOINTS.FORGOT_PASSWORD), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || `Erro HTTP ${response.status}`);
            }

            if (data.success) {
                showMessage(
                    '✅ ' + data.message + '\nVerifique seu email para as instruções de redefinição.',
                    'success'
                );

                // Limpar formulário
                form.reset();

                // Redirecionar para login após 3 segundos
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                showMessage('❌ ' + (data.message || 'Erro ao enviar email'), 'error');
            }
        } catch (error) {
            console.error('Erro:', error);
            showMessage('❌ Erro ao conectar com o servidor', 'error');
        } finally {
            // Reabilitar botão
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Instruções';
        }
    });

    // Mostrar mensagem
    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message ${type}`;
        messageContainer.style.display = 'block';

        // Scroll para a mensagem
        messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Auto-limpar mensagem de erro após 5 segundos
        if (type === 'error') {
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 5000);
        }
    }

    // Validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Feedback ao digitar
    emailInput.addEventListener('input', () => {
        if (messageContainer.classList.contains('error')) {
            messageContainer.style.display = 'none';
        }
    });
});
