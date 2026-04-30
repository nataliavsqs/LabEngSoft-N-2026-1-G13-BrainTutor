# 🚀 Guia Rápido - Ativar "Esqueci a Senha"

## ⏱️ Tempo: 5 minutos

### Passo 1: Configurar Gmail (2 min)

**1.1** Abra: https://myaccount.google.com/apppasswords

**1.2** Selecione:
- App: `Mail`
- Device: `Windows Computer` (ou seu dispositivo)

**1.3** Clique em "Gerar"

**1.4** Copie a senha de 16 caracteres (com espaços)

### Passo 2: Atualizar .env (1 min)

**2.1** Abra o arquivo `.env` na raiz do projeto:

```
c:\Users\natal\Desktop\ADS\sprint 3\Fatec-Ipiranga-LabEngSoft-N-2025-2-G10-BrainTutor\projeto\.env
```

**2.2** Encontre estas linhas:

```env
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

**2.3** Substitua com seus dados reais:

```env
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

**Exemplo real:**
```env
EMAIL_USER=braintutor.suporte@gmail.com
EMAIL_PASS=kqpm zcfe plrz mybb
```

**2.4** Salve o arquivo (Ctrl+S)

### Passo 3: Reiniciar Docker (2 min)

**3.1** Abra PowerShell e execute:

```powershell
cd "c:\Users\natal\Desktop\ADS\sprint 3\Fatec-Ipiranga-LabEngSoft-N-2025-2-G10-BrainTutor\projeto"
docker-compose down
docker-compose up -d
```

**3.2** Aguarde ~30 segundos e verifique:

```powershell
docker-compose ps
```

Você deve ver:
- ✅ `brain-tutor-app` - Healthy
- ✅ `brain-tutor-mysql` - Healthy
- ✅ `brain-tutor-nginx` - Running

---

## ✅ Teste Rápido

### 1. Abra o navegador
http://localhost:3000

### 2. Clique em "Entrar"

### 3. Clique em "Esqueceu sua senha?"

### 4. Digite um email cadastrado
```
samira@email.com
```

### 5. Clique "Enviar Instruções"

### 6. Verifique seu email
✓ Gmail: https://mail.google.com/mail/u/0/
✓ Verifique pasta de SPAM também!

### 7. Clique no botão "Redefinir Senha" do email

### 8. Defina uma nova senha
- Mínimo 6 caracteres
- Pelo menos 1 letra
- Pelo menos 1 número
- Exemplo: `Nova123`

### 9. Clique "Redefinir Senha"

### 10. Você verá ✅ Sucesso!

---

## 🎯 Resultado Final

Quando tudo funcionar:

```
✅ Página "Esqueci a Senha" carrega
✅ Email enviado com link
✅ Link leva para "Redefinir Senha"
✅ Validação de força funciona (cores)
✅ Nova senha salvada
✅ Login com nova senha funciona
```

---

## 🐛 Se não funcionar...

### Email não chega

1. **Verifique SPAM** (muito comum com Gmail)
2. **Verifique .env** - Copie a senha exatamente como gerada
3. **Reinicie containers**: `docker-compose down && docker-compose up -d`
4. **Veja logs**: `docker-compose logs -f app`

### Erro: "Não conseguir enviar"

- Copie a senha de App Password exatamente (com espaços)
- Não use sua senha normal do Gmail

### Link não funciona

- Token válido por 1 hora
- Se expirou, solicite novo link

---

## 📞 Suporte Rápido

| Problema | Solução |
|----------|---------|
| Email não chega | Verifique SPAM, reinicie Docker |
| Erro de conexão | Veja se está em http://localhost:3000 |
| Link expirado | Solicite nova redefinição |
| Senha fraca | Adicione letra + número |

---

## 📁 Arquivos Adicionados

```
✨ client/pages/forgot-password.html
✨ client/pages/reset-password.html
✨ client/js/forgot-password.js
✨ client/js/reset-password.js
📄 FORGOT_PASSWORD_SETUP.md (completo)
📄 FORGOT_PASSWORD_IMPLEMENTATION.md (técnico)
📄 FORGOT_PASSWORD_QUICKSTART.md (este arquivo)
```

---

## 🎉 Pronto!

Sua funcionalidade "Esqueci a Senha" está:
- ✅ Implementada
- ✅ Pronta para testar
- ✅ Segura (token + bcrypt)
- ✅ Responsiva
- ✅ Bem documentada

**Aproveite! 🚀**

---

## 💡 Dicas

- **Gmail funciona melhor**: Use Gmail para testar
- **1 hora de validade**: Token expira em 1 hora por segurança
- **Força de senha**: Indicador colorido ajuda usuário a escolher boa senha
- **Sem spam**: Se não receber, sempre tente solicitar novo link

---

**Dúvidas?** Veja `FORGOT_PASSWORD_SETUP.md` para mais detalhes.
