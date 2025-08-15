# 🔥 AutoDrive - Deployment para Produção com Firebase

## Pré-requisitos

1. **Conta Firebase**: Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. **Node.js**: Instale a versão mais recente
3. **Firebase CLI**: Será instalado automaticamente pelo script

## Configuração Inicial

### 1. Configure seu projeto Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative os seguintes serviços:
   - **Authentication** (Email/Password)
   - **Cloud Functions** 
   - **Hosting**
   - **Cloud Firestore** (opcional)

### 2. Configure as credenciais

1. No Firebase Console, vá em **Project Settings > Service Accounts**
2. Clique em **Generate new private key**
3. Salve o arquivo JSON em um local seguro
4. Configure as variáveis de ambiente:

```bash
# Para desenvolvimento local
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/firebase-service-account.json"

# Para produção (recomendado usar Application Default Credentials)
export FIREBASE_PROJECT_ID="your-project-id"
```

### 3. Atualize o arquivo `.env.production`

Edite o arquivo `.env.production` com suas configurações reais:

```env
# Configurações de Produção
SECRET_KEY="sua-chave-secreta-super-segura-aqui"
DATABASE_URL="postgresql+psycopg://user:password@host:5432/autodrive"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Firebase Configuration
FIREBASE_PROJECT_ID="seu-project-id-do-firebase"
GOOGLE_APPLICATION_CREDENTIALS="/path/to/firebase-service-account.json"

# Environment
ENVIRONMENT="production"

# CORS Settings
ALLOWED_ORIGINS="https://seudominio.com,https://www.seudominio.com"
```

### 4. Configure o Firebase no frontend

Atualize o arquivo `app/assets/js/firebase-config.js` com suas credenciais do Firebase:

```javascript
window.firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Deployment

### Opção 1: Deployment Automático (Recomendado)

Execute o script de deployment:

```bash
python deploy_production.py
```

Este script irá:
- ✅ Verificar e instalar Firebase CLI
- ✅ Instalar todas as dependências
- ✅ Configurar o ambiente de produção
- ✅ Fazer login no Firebase
- ✅ Fazer deploy da aplicação

### Opção 2: Deployment Manual

1. **Instale as dependências**:
```bash
pip install -r requirements.txt
npm install -g firebase-tools
```

2. **Configure o Firebase CLI**:
```bash
firebase login
firebase init
```
   - Selecione **Functions** e **Hosting**
   - Escolha seu projeto Firebase
   - Aceite as configurações padrão

3. **Faça o deploy**:
```bash
firebase deploy
```

## Verificação pós-deploy

1. **Teste a aplicação**:
   - Acesse `https://seu-projeto.web.app`
   - Teste o login/cadastro
   - Verifique as APIs

2. **Monitore logs**:
```bash
firebase functions:log
```

3. **Verifique Analytics** no Firebase Console

## Configurações Avançadas

### SSL/HTTPS
O Firebase Hosting fornece HTTPS automaticamente.

### Domínio Customizado
1. No Firebase Console: **Hosting > Add custom domain**
2. Siga as instruções para verificar o domínio
3. Atualize `ALLOWED_ORIGINS` no `.env.production`

### Monitoramento
- Use Firebase Analytics para métricas
- Configure alertas no Firebase Console
- Monitore performance via Firebase Performance

### Backup e Recuperação
- Configure backups automáticos do banco de dados
- Mantenha backups das configurações do Firebase

## Problemas Comuns

### 1. Erro de Autenticação Firebase
```bash
firebase login --reauth
```

### 2. Permissões de deploy
Certifique-se de ter permissões de editor no projeto Firebase.

### 3. Problemas de CORS
Verifique se `ALLOWED_ORIGINS` está configurado corretamente.

### 4. Timeout em Functions
Aumente o timeout nas configurações das Cloud Functions.

## Segurança

- ✅ Use HTTPS sempre
- ✅ Configure CORS restritivo
- ✅ Use variáveis de ambiente para secrets
- ✅ Habilite Firebase Security Rules
- ✅ Configure rate limiting
- ✅ Monitore logs regularmente

## Suporte

Para problemas específicos:
1. Verifique os logs: `firebase functions:log`
2. Consulte a [documentação do Firebase](https://firebase.google.com/docs)
3. Verifique issues conhecidos no repositório
