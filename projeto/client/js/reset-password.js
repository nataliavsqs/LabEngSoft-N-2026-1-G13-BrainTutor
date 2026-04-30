// Gerenciamento da funcionalidade de redefinição de senha

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('resetPasswordForm');
    const submitBtn = document.getElementById('submitBtn');
    const backBtn = document.getElementById('backBtn');
    const messageContainer = document.getElementById('messageContainer');
    const resetFormContainer = document.getElementById('resetFormContainer');
    const tokenErrorContainer = document.getElementById('tokenErrorContainer');

    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    // Extrair token da URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
        showTokenError();
        return;
    }

    // Validar token no backend (opcional, mas recomendado)
    // Por enquanto, assumimos que o token é válido

    // Voltar para login
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Mostrar força da senha em tempo real
    newPasswordInput.addEventListener('input', () => {
        const password = newPasswordInput.value;
        updatePasswordStrength(password);
        validateRequirements();
    });

    // Validar requisitos ao digitar
    confirmPasswordInput.addEventListener('input', () => {
        validateRequirements();
    });

    // Enviar formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validações
        if (!newPassword || !confirmPassword) {
            showMessage('Por favor, preencha todos os campos', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage('As senhas não coincidem', 'error');
            return;
        }

        if (newPassword.length < 6) {
            showMessage('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }

        // Desabilitar botão durante envio
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Redefinindo...';

        try {
            const response = await fetch(getApiUrl(APP_CONFIG.ENDPOINTS.RESET_PASSWORD), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword
                })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || `Erro HTTP ${response.status}`);
            }

            if (data.success) {
                showMessage(
                    '✅ ' + data.message + '\nVocê será redirecionado para login em 3 segundos...',
                    'success'
                );

                // Redirecionar para login após 3 segundos
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                if (response.status === 400 && data.message.includes('inválido')) {
                    showTokenError();
                } else {
                    showMessage('❌ ' + (data.message || 'Erro ao redefinir senha'), 'error');
                }
            }
        } catch (error) {
            console.error('Erro:', error);
            showMessage('❌ Erro ao conectar com o servidor', 'error');
        } finally {
            // Reabilitar botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Redefinir Senha';
        }
    });

    // Calcular força da senha
    function getPasswordStrength(password) {
        let strength = 0;

        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        return Math.min(strength, 4); // Máximo 4 níveis
    }

    // Atualizar visualização da força de senha
    function updatePasswordStrength(password) {
        if (!password) {
            passwordStrength.classList.remove('show');
            return;
        }

        passwordStrength.classList.add('show');
        const strength = getPasswordStrength(password);

        const strengths = ['Fraca', 'Média', 'Boa', 'Muito Boa', 'Excelente'];
        const colors = ['#dc3545', '#ffc107', '#17a2b8', '#28a745', '#20c997'];
        const percentages = ['25%', '50%', '75%', '100%'];

        strengthText.textContent = strengths[strength];
        strengthFill.style.width = percentages[Math.max(strength - 1, 0)];
        strengthFill.style.backgroundColor = colors[strength];
    }

    // Validar requisitos
    function validateRequirements() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Requisito: 6+ caracteres
        const req1 = password.length >= 6;
        updateRequirement('req-length', req1);

        // Requisito: Pelo menos uma letra
        const req2 = /[a-zA-Z]/.test(password);
        updateRequirement('req-letter', req2);

        // Requisito: Pelo menos um número
        const req3 = /[0-9]/.test(password);
        updateRequirement('req-number', req3);

        // Requisito: Senhas coincidem
        const req4 = password && confirmPassword && password === confirmPassword;
        updateRequirement('req-match', req4);

        // Habilitar/desabilitar botão
        submitBtn.disabled = !(req1 && req2 && req3 && req4);
    }

    // Atualizar visual do requisito
    function updateRequirement(id, met) {
        const element = document.getElementById(id);
        const check = element.querySelector('.requirement-check');

        if (met) {
            element.classList.add('met');
            check.textContent = '✓';
        } else {
            element.classList.remove('met');
            check.textContent = '-';
        }
    }

    // Mostrar mensagem
    function showMessage(message, type) {
        messageContainer.innerHTML = message;
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

    // Mostrar erro de token
    function showTokenError() {
        resetFormContainer.style.display = 'none';
        tokenErrorContainer.style.display = 'block';
    }

    // Inicializar validações
    validateRequirements();
});
