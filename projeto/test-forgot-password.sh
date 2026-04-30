#!/bin/bash

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}🧪 Testador de Recuperação de Senha${NC}"
echo -e "${BLUE}================================${NC}\n"

# Verificar se o servidor está rodando
echo -e "${YELLOW}1. Verificando se o servidor está rodando...${NC}"
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)

if [ "$HEALTH" = "200" ]; then
    echo -e "${GREEN}✓ Servidor rodando em http://localhost:3001${NC}\n"
else
    echo -e "${RED}✗ Servidor não está respondendo${NC}"
    echo -e "${RED}Por favor, inicie com: docker-compose up -d${NC}\n"
    exit 1
fi

# Verificar variáveis de email
echo -e "${YELLOW}2. Verificando configuração de email...${NC}"

if [ -f ".env" ]; then
    EMAIL_USER=$(grep '^EMAIL_USER=' .env | cut -d '=' -f 2 | xargs)
    EMAIL_PASS=$(grep '^EMAIL_PASS=' .env | cut -d '=' -f 2 | xargs)
    FRONTEND_URL=$(grep '^FRONTEND_URL=' .env | cut -d '=' -f 2 | xargs)
    
    if [ -z "$EMAIL_USER" ] || [ "$EMAIL_USER" = "seu_email@gmail.com" ]; then
        echo -e "${RED}✗ EMAIL_USER não configurado ou usando valor padrão${NC}"
        echo -e "${YELLOW}   Configure no arquivo .env${NC}\n"
    else
        echo -e "${GREEN}✓ EMAIL_USER: $EMAIL_USER${NC}"
    fi
    
    if [ -z "$EMAIL_PASS" ] || [ "$EMAIL_PASS" = "sua_senha_de_app" ]; then
        echo -e "${RED}✗ EMAIL_PASS não configurado ou usando valor padrão${NC}"
        echo -e "${YELLOW}   Gere em: https://myaccount.google.com/apppasswords${NC}\n"
    else
        echo -e "${GREEN}✓ EMAIL_PASS: ****${NC}"
    fi
    
    echo -e "${GREEN}✓ FRONTEND_URL: $FRONTEND_URL${NC}\n"
else
    echo -e "${RED}✗ Arquivo .env não encontrado${NC}\n"
fi

# Testar endpoint de forgot-password
echo -e "${YELLOW}3. Testando endpoint /api/auth/forgot-password...${NC}"

TEST_EMAIL="teste@email.com"
RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_EMAIL\"}")

if echo "$RESPONSE" | grep -q '"success"'; then
    echo -e "${GREEN}✓ Endpoint respondendo corretamente${NC}"
    echo -e "${GREEN}   Response: $RESPONSE${NC}\n"
else
    echo -e "${RED}✗ Erro na resposta${NC}"
    echo -e "${RED}   Response: $RESPONSE${NC}\n"
fi

# Verificar arquivos necessários
echo -e "${YELLOW}4. Verificando arquivos necessários...${NC}"

FILES=(
    "client/pages/forgot-password.html"
    "client/pages/reset-password.html"
    "client/js/forgot-password.js"
    "client/js/reset-password.js"
    "server/utils/emailService.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file não encontrado${NC}"
    fi
done

echo -e "\n${BLUE}================================${NC}"
echo -e "${BLUE}📋 Resumo da Configuração${NC}"
echo -e "${BLUE}================================${NC}\n"

if [ -z "$EMAIL_USER" ] || [ "$EMAIL_USER" = "seu_email@gmail.com" ]; then
    echo -e "${RED}⚠️  Email não configurado${NC}"
    echo -e "Para ativar a funcionalidade:"
    echo -e "1. Edite o arquivo .env"
    echo -e "2. Configure EMAIL_USER e EMAIL_PASS"
    echo -e "3. Reinicie os containers: docker-compose down && docker-compose up -d\n"
else
    echo -e "${GREEN}✅ Configuração pronta!${NC}\n"
    echo -e "Para testar:"
    echo -e "1. Acesse: http://localhost:3000"
    echo -e "2. Clique em 'Entrar'"
    echo -e "3. Clique em 'Esqueceu sua senha?'"
    echo -e "4. Digite um email cadastrado"
    echo -e "5. Verifique seu email para o link de redefinição\n"
fi

echo -e "${BLUE}================================${NC}\n"
