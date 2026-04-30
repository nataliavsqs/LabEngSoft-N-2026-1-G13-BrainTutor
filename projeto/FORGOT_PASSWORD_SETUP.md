# 📧 Guia de Configuração - Funcionalidade "Esqueci a Senha"

## 🎯 O que foi implementado

A funcionalidade completa de recuperação de senha foi implementada com:

- ✅ Página de "Esqueci a Senha" (`pages/forgot-password.html`)
- ✅ Página de "Redefinir Senha" com validação de força (`pages/reset-password.html`)
- ✅ Email automático com link de redefinição
- ✅ Token seguro com expiração de 1 hora
- ✅ Validação de senha forte no frontend e backend
- ✅ UI responsiva e amigável

---

## 🔧 Configuração Necessária

### 1. Configurar Email (Gmail recomendado)

A plataforma usa **Gmail** por padrão. Para ativar:

#### Passo 1: Gerar Senha de App no Gmail
1. Acesse: https://myaccount.google.com/apppasswords
2. Selecione: `Mail` e `Windows Computer` (ou seu dispositivo)
3. Copie a senha gerada (16 caracteres)

#### Passo 2: Atualizar variáveis de ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
# Configurações de Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
FRONTEND_URL=http://localhost:3000
```

**Exemplo com um email real:**
```env
EMAIL_USER=braintutor.suporte@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

---

## 🧪 Testar a Funcionalidade

### Opção 1: Com Docker

Se estiver usando Docker, reinicie os containers para carregar as variáveis:

```bash
docker-compose down
docker-compose up -d
```

### Opção 2: Teste Local

1. **Acesse a aplicação**: http://localhost:3000
2. **Clique em "Entrar"**
3. **Clique em "Esqueceu sua senha?"**
4. **Digite um email cadastrado** e clique em "Enviar Instruções"
5. **Verifique seu email** (incluindo spam)
6. **Clique no link** de redefinição de senha
7. **Defina uma nova senha** forte
8. **Faça login** com a nova senha

---

## 📱 Fluxo da Aplicação

### Passo 1: Solicitação
```
Usuário clica "Esqueceu a Senha?"
        ↓
Página: /pages/forgot-password.html
        ↓
API: POST /api/auth/forgot-password
        ↓
Email enviado com token seguro
```

### Passo 2: Redefinição
```
Usuário clica no link do email
        ↓
Página: /pages/reset-password.html?token=xxxxx
        ↓
Validação do token
        ↓
Definir nova senha (com validação de força)
        ↓
API: POST /api/auth/reset-password
        ↓
Sucesso! Redireciona para login
```

---

## 🔐 Requisitos de Senha

A nova senha deve atender:

- ✓ Mínimo **6 caracteres**
- ✓ Pelo menos **uma letra**
- ✓ Pelo menos **um número**
- ✓ Confirmação de senha (devem ser iguais)

### Indicador de Força:
- 🔴 Fraca
- 🟠 Média  
- 🟡 Boa
- 🟢 Muito Boa
- 💚 Excelente

---

## 📧 Email Enviado

O usuário receberá um email com:

- Saudação personalizada
- Link para redefinir senha
- Aviso de expiração (1 hora)
- Aviso de segurança (se não solicitou)

**Exemplo:**
```
De: Brain Tutor <braintutor.suporte@gmail.com>
Assunto: Redefinir sua senha - Brain Tutor

[Botão] Redefinir Senha
```

---

## 🛡️ Segurança

- ✅ Token criptografado aleatório
- ✅ Expiração de token em 1 hora
- ✅ Hash bcrypt para senhas
- ✅ Validação no frontend e backend
- ✅ Proteção contra força bruta (por implementar)
- ✅ Email de confirmação de mudança de senha (por implementar)

---

## 🐛 Troubleshooting

### Email não chega

1. **Verifique pasta de spam**
2. **Confirme que EMAIL_USER e EMAIL_PASS estão corretos no `.env`**
3. **Reinicie o container**: `docker-compose down && docker-compose up -d`
4. **Verifique logs**: `docker-compose logs -f app`

### Link expirado

- Token válido por **1 hora**
- Solicite um novo link na página "Esqueci a Senha"

### Erro de conexão

- Verifique se o backend está rodando: `http://localhost:3001/health`
- Confirme CORS no `server/app.js`

### Erro: "Promise rejeitada: originalText is not defined"

- A correção já foi aplicada no frontend.
- Se o erro aparecer, recarregue a página para garantir que o navegador carregou a versão atualizada de `client/js/auth.js`.

---

## 📝 Endpoints da API

### Solicitar Redefinição
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "usuario@email.com"
}

Response:
{
  "success": true,
  "message": "Instruções de redefinição enviadas para seu email"
}
```

### Redefinir Senha
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "xxxxx",
  "newPassword": "novaSenha123"
}

Response:
{
  "success": true,
  "message": "Senha redefinida com sucesso"
}
```

---

## 🎨 Personalização

### Mudar Email de Envio
Edite `server/utils/emailService.js`:
```javascript
async sendPasswordResetEmail(userEmail, userName, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/pages/reset-password.html?token=${resetToken}`;
    // ... resto do código
}
```

### Mudar Duração do Token
Edite `server/routes/auth.js`:
```javascript
const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hora
// Mude para: 7200000 = 2 horas
```

---

## ✅ Checklist Final

- [ ] Email configurado no `.env`
- [ ] Containers reiniciados
- [ ] Acessei http://localhost:3000
- [ ] Cliquei em "Esqueceu a Senha?"
- [ ] Recebi email com token
- [ ] Consegui redefinir a senha
- [ ] Login com nova senha funciona

---

## 📞 Suporte

Se houver problemas, verifique:
1. Variáveis do `.env` estão corretas
2. Backend está rodando: `docker-compose ps`
3. Logs: `docker-compose logs -f app`
4. Gmail app password gerado corretamente

---

**🎉 Parabéns! Agora sua aplicação tem recuperação de senha funcional!**
