# Firebase Configuration

Esta pasta contém todos os arquivos de configuração do Firebase para o projeto AutoDrive.

## 📁 Estrutura

- **`firestore.rules`** - Regras de segurança do Firestore Database
- **`firestore.indexes.json`** - Índices do Firestore para otimização de queries
- **`storage.rules`** - Regras de segurança do Firebase Storage
- **`init_firebase.py`** - Script Python para inicialização e configuração do projeto Firebase

## 🔧 Uso

### Firestore Rules
As regras do Firestore controlam o acesso aos dados. Para aplicar as regras:
```bash
firebase deploy --only firestore:rules
```

### Storage Rules
Regras para controle de acesso aos arquivos no Storage:
```bash
firebase deploy --only storage
```

### Índices do Firestore
Para otimizar as consultas do Firestore:
```bash
firebase deploy --only firestore:indexes
```

### Script de Inicialização
Para configurar o projeto Firebase inicialmente:
```bash
python firebase/init_firebase.py
```

## 📝 Notas

- Todos os caminhos são referenciados no `firebase.json` na raiz do projeto
- As regras são aplicadas automaticamente durante o deploy completo
- Mantenha sempre as regras atualizadas para garantir a segurança dos dados
