# 🔐 Configuração do Firebase Authentication

## 📋 Passo 1: Configurar Métodos de Login

1. **Acesse**: https://console.firebase.google.com/project/autodrive-1dccf/authentication/providers
2. **Ative os seguintes métodos**:

### ✅ Email/Password (Recomendado)
- Clique em "Email/Password"
- ✅ Ativar "Email/password"
- ✅ Ativar "Email link (passwordless sign-in)" (opcional)
- Salvar

### 🌐 Google Sign-In (Opcional)
- Clique em "Google"
- ✅ Ativar
- Configure nome do projeto e email de suporte
- Salvar

## 📋 Passo 2: Configurar Domínios Autorizados

1. **Acesse**: https://console.firebase.google.com/project/autodrive-1dccf/authentication/settings
2. **Na seção "Authorized domains"**, certifique-se que estão incluídos:
   - `localhost` (para desenvolvimento)
   - `autodrive-1dccf.web.app` (seu domínio de produção)
   - `autodrive-1dccf.firebaseapp.com` (domínio alternativo)

## 📋 Passo 3: Configurar Credenciais Web

1. **Acesse**: https://console.firebase.google.com/project/autodrive-1dccf/settings/general
2. **Na seção "Your apps"**:
   - Se não tiver Web App, clique em "Add app" > Web
   - Nome: "AutoDrive Web App"
   - ✅ Also set up Firebase Hosting
3. **Copie a configuração mostrada**:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "autodrive-1dccf.firebaseapp.com",
  projectId: "autodrive-1dccf",
  storageBucket: "autodrive-1dccf.appspot.com",
  messagingSenderId: "939709954025",
  appId: "..."
};
```

## 📋 Passo 4: Atualizar Código Frontend

Depois de obter as credenciais, cole no arquivo de configuração.

## 📋 Passo 5: Testar Authentication

Use os comandos:
- `python test_auth.py` - Testar sistema localmente
- `firebase emulators:start --only auth` - Emulador de auth
