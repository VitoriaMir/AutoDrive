# AutoDrive - Sistema de Gestão para Auto Escolas

## 🚗 Sobre o Projeto

AutoDrive é um sistema completo de gestão para auto escolas, desenvolvido com Firebase Hosting e Firebase Authentication. O sistema oferece uma interface moderna e responsiva para gerenciar alunos, instrutores, veículos, agendamentos e financeiro.

## 🌐 Demo Online

**Site em produção:** https://autodrive-1dccf.web.app

- **Login:** https://autodrive-1dccf.web.app/login.html
- **Dashboard:** https://autodrive-1dccf.web.app/dashboard.html

## ⚡ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Autenticação:** Firebase Authentication
- **Hosting:** Firebase Hosting
- **Gráficos:** Chart.js
- **Ícones:** Font Awesome
- **Responsivo:** CSS Grid/Flexbox

## 🏗️ Estrutura do Projeto

```
AutoDrive/
├── public/                    # Arquivos estáticos (Firebase Hosting)
│   ├── index.html            # Página inicial
│   ├── login.html            # Tela de login
│   ├── dashboard.html        # Dashboard principal (7500+ linhas)
│   └── assets/              # Assets estáticos
│       ├── css/             # Estilos
│       │   ├── style.css    # Estilos da homepage
│       │   ├── login.css    # Estilos do login
│       │   └── dashboard.css # Estilos do dashboard
│       ├── js/              # Scripts
│       │   ├── firebase-config.js      # Configuração Firebase
│       │   ├── firebase-init.js        # Inicialização Firebase
│       │   ├── auth-interceptor.js     # Interceptador de autenticação
│       │   ├── login-clean.js          # Lógica do login
│       │   ├── dashboard.js            # Lógica do dashboard
│       │   ├── dashboard-integration.js # Integração do dashboard
│       │   ├── firestore-manager.js    # Gerenciador do Firestore
│       │   └── main.js                 # Scripts gerais
│       ├── images/          # Imagens e assets
│       └── videos/          # Vídeos
├── firebase/                # Configurações Firebase
│   ├── firestore.rules      # Regras do Firestore
│   ├── firestore.indexes.json # Índices do Firestore
│   ├── storage.rules        # Regras do Storage
│   └── init_firebase.py     # Script de inicialização do Firebase
├── firebase.json            # Configuração principal do Firebase
└── README.md               # Documentação do projeto
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js
- Firebase CLI (`npm install -g firebase-tools`)
- Conta no Firebase

### Configuração

1. **Clone o repositório:**
```bash
git clone https://github.com/VitoriaMir/AutoDrive.git
cd AutoDrive
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o Firebase:**
```bash
firebase login
firebase use autodrive-1dccf
```

4. **Execute localmente:**
```bash
firebase serve --only hosting
```

5. **Deploy para produção:**
```bash
firebase deploy --only hosting
```

## 🔑 Configuração do Firebase

### Authentication
O projeto usa Firebase Authentication com:
- Autenticação por email/senha
- Proteção de rotas
- Interceptador automático para páginas protegidas

### Hosting
- Configured para servir arquivos estáticos
- Cache otimizado
- Suporte a SPAs

## 📱 Funcionalidades

### Dashboard Principal
- **Visão Geral:** Métricas e KPIs importantes
- **Gestão de Alunos:** Cadastro, edição, progresso
- **Gestão de Instrutores:** Perfis, especialidades, agenda
- **Gestão de Veículos:** Frota, manutenção, disponibilidade
- **Agenda:** Agendamento de aulas e exames
- **Financeiro:** Controle de pagamentos e relatórios
- **Relatórios:** Análises detalhadas e exportação

### Interface Responsiva
- Design adaptável para desktop, tablet e mobile
- Sidebar colapsável
- Modais e formulários otimizados
- Gráficos interativos com Chart.js

### Sistema de Autenticação
- Login seguro com Firebase Auth
- Proteção automática de rotas
- Logout com limpeza de sessão
- Interceptação de requisições não autenticadas

## 🎨 Interface

O dashboard conta com mais de 7500 linhas de código HTML/CSS/JS, oferecendo:
- Interface moderna e intuitiva
- Tema escuro profissional
- Componentes reutilizáveis
- Animações suaves
- Feedback visual consistente

## 📊 Recursos Técnicos

### Performance
- Arquivos otimizados
- Lazy loading de recursos
- Cache estratégico
- Compressão automática

### Segurança
- Autenticação Firebase
- Proteção de rotas sensíveis
- Validação client-side
- Sanitização de inputs

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
# Servir localmente
firebase serve --only hosting

# Deploy para produção
firebase deploy --only hosting

# Logs do projeto
firebase logs

# Configurar novo projeto
firebase init hosting
```

### Estrutura de Desenvolvimento
- **Código modular:** Separação clara entre funcionalidades
- **Componentes reutilizáveis:** CSS e JS organizados
- **Padrões consistentes:** Nomenclatura e estrutura uniformes
- **Documentação inline:** Comentários explicativos no código

## 📈 Status do Projeto

- ✅ **Frontend completo** - Interface totalmente funcional
- ✅ **Autenticação** - Firebase Auth implementado
- ✅ **Deploy automático** - Firebase Hosting configurado
- ✅ **Responsividade** - Adaptável a todos os dispositivos
- ✅ **Performance otimizada** - Carregamento rápido

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

**Vitória Mir**
- GitHub: [@VitoriaMir](https://github.com/VitoriaMir)

---

**AutoDrive** - Transformando a gestão de auto escolas com tecnologia moderna! 🚗💨