# 🚀 AutoDrive - Comandos de Produção

## Deploy Rápido
```bash
python quick_deploy.py
```

## Deploy Manual
```bash
firebase deploy --only hosting
```

## Testar Localmente
```bash
firebase emulators:start --only hosting --port 8080
```

## Ver Logs
```bash
firebase functions:log
```

## Status do Projeto
```bash
firebase projects:list
firebase use
```

## URLs Importantes
- 🌐 **Site em Produção**: https://autodrive-1dccf.web.app
- 🔧 **Console Firebase**: https://console.firebase.google.com/project/autodrive-1dccf
- 📊 **Analytics**: https://console.firebase.google.com/project/autodrive-1dccf/analytics

## Estrutura de Arquivos
```
AutoDrive/
├── public/          # Arquivos servidos em produção
├── app/
│   ├── assets/      # Arquivos fonte (CSS, JS, imagens)
│   └── templates/   # Templates HTML
├── firebase.json    # Configuração Firebase
└── quick_deploy.py  # Script de deploy rápido
```

## Atualizações
1. Modifique arquivos em `app/`
2. Execute `python quick_deploy.py`
3. Acesse https://autodrive-1dccf.web.app

---
**Status**: ✅ Em Produção
**Última atualização**: $(date)
