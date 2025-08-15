# 🔑 Como Obter as Credenciais do Firebase

## 📋 Passo 1: Configurar Web App no Firebase Console

1. **Acesse o Firebase Console**: https://console.firebase.google.com/
2. **Selecione seu projeto**: AutoDrive
3. **Vá em Project Settings** (ícone de engrenagem)
4. **Na aba "General"**, role até "Your apps"
5. **Se não tiver um Web App, clique em "Add app" > Web (ícone </>) **
6. **Configure o app**:
   - App nickname: `AutoDrive Web`
   - ✅ Also set up Firebase Hosting
   - Clique em "Register app"

## 🔧 Passo 2: Copiar Configuração Web

Após registrar o app, você verá um código similar a:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...", // ← Copie esta
  authDomain: "autodrive-1dccf.firebaseapp.com",
  projectId: "autodrive-1dccf",
  storageBucket: "autodrive-1dccf.appspot.com",
  messagingSenderId: "939709954025",
  appId: "1:939709954025:web:..."  // ← Copie esta
};
```

## 🗝️ Passo 3: Criar Service Account

1. **Vá em Project Settings > Service Accounts**
2. **Clique em "Generate new private key"**
3. **Baixe o arquivo JSON**
4. **Salve em local seguro** (ex: `C:\firebase\autodrive-service-account.json`)

## ⚙️ Passo 4: Ativar Serviços Necessários

1. **Authentication**:
   - Vá em Authentication > Sign-in method
   - Ative "Email/Password"

2. **Cloud Functions**:
   - Vá em Functions (já deve estar ativo)

3. **Hosting**:
   - Vá em Hosting (já deve estar ativo)

## 📝 Passo 5: Atualizar Arquivos de Configuração

Após obter as credenciais, atualize os arquivos:

### 1. `app/assets/js/firebase-config.js`:
```javascript
window.firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI", // ← Cole aqui
  authDomain: "autodrive-1dccf.firebaseapp.com",
  projectId: "autodrive-1dccf",
  storageBucket: "autodrive-1dccf.appspot.com",
  messagingSenderId: "939709954025",
  appId: "SEU_APP_ID_AQUI" // ← Cole aqui
};
```

### 2. `.env.production`:
```env
FIREBASE_PROJECT_ID="autodrive-1dccf"
GOOGLE_APPLICATION_CREDENTIALS="C:\firebase\autodrive-service-account.json"
```

## ✅ Depois disso, execute:

```bash
firebase use autodrive-1dccf
python deploy_production.py
```

---

**💡 Dica**: Mantenha o Service Account JSON em local seguro e nunca o commite no Git!
