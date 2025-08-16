// ===== DASHBOARD AUTHENTICATION INTEGRATION =====

let auth;
let currentUser = null;

// Configuração inicial do usuário (fallback)
window.currentUser = {
    role: "admin",
    name: "Usuário Admin", 
    email: "admin@autodrive.com"
};

// Inicializar Firebase quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 Inicializando Firebase Authentication...');
    
    if (typeof firebase !== 'undefined' && window.firebaseConfig) {
        try {
            firebase.initializeApp(window.firebaseConfig);
            auth = firebase.auth();
            console.log('✅ Firebase inicializado com sucesso');
            
            // Verificar estado de autenticação
            auth.onAuthStateChanged((user) => {
                if (user) {
                    currentUser = user;
                    updateDashboardUserInfo(user);
                    console.log('✅ Usuário logado:', user.email);
                } else {
                    console.log('❌ Usuário não logado, redirecionando...');
                    window.location.href = '/login.html';
                }
            });
        } catch (error) {
            console.error('❌ Erro ao inicializar Firebase:', error);
            // Continuar sem Firebase em caso de erro
        }
    } else {
        console.warn('⚠️ Firebase config não encontrado, usando dados estáticos');
    }
});

// Atualizar informações do usuário na interface
function updateDashboardUserInfo(user) {
    const userName = user.displayName || user.email.split('@')[0];
    const userEmail = user.email;
    const userInitials = userName.length > 1 ? 
        userName[0].toUpperCase() + (userName.split(' ')[1] ? 
        userName.split(' ')[1][0].toUpperCase() : 
        (userName[1] ? userName[1].toUpperCase() : '')) : 
        userName[0].toUpperCase();

    // Atualizar elementos da interface
    const elements = {
        'user-avatar': userInitials,
        'user-name': userName, 
        'user-role': 'Admin',
        'profile-avatar-large': userInitials,
        'profile-user-name': userName,
        'profile-user-email': userEmail,
        'logoutUserName': userName,
        'logoutUserEmail': userEmail,
        'logoutUserInitials': userInitials
    };

    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });

    // Atualizar configuração global
    window.currentUser = {
        role: "admin",
        name: userName,
        email: userEmail
    };
}

// Função de logout integrada ao Firebase
function confirmLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        if (auth && auth.currentUser) {
            auth.signOut().then(() => {
                console.log('✅ Logout realizado com sucesso');
                window.location.href = '/login.html';
            }).catch((error) => {
                console.error('❌ Erro no logout:', error);
                alert('Erro ao fazer logout: ' + error.message);
            });
        } else {
            window.location.href = '/login.html';
        }
    }
}
