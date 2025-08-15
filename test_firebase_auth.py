#!/usr/bin/env python3
"""
Script para testar Firebase Authentication localmente
"""
import subprocess
import webbrowser
import time
import os

def test_auth_locally():
    """Testa a autenticação Firebase localmente"""
    print("🔐 Iniciando teste do Firebase Authentication...")
    
    try:
        # Iniciar emulador de hosting
        print("🚀 Iniciando emulador Firebase...")
        print("📝 Pressione Ctrl+C para parar")
        
        # Abrir no navegador após um delay
        def open_browser():
            time.sleep(3)
            webbrowser.open('http://localhost:5000/test-auth.html')
            print("🌐 Página de teste aberta: http://localhost:5000/test-auth.html")
        
        import threading
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        # Iniciar emulador
        result = subprocess.run(['firebase', 'emulators:start', '--only', 'hosting'], 
                              shell=True)
        
    except KeyboardInterrupt:
        print("\n⏹️  Parando emulador...")
    except Exception as e:
        print(f"❌ Erro: {e}")
        print("💡 Dica: Certifique-se de que o Firebase CLI está instalado")

def show_instructions():
    """Mostra instruções para configurar Authentication"""
    print("""
🔐 CONFIGURAÇÃO DO FIREBASE AUTHENTICATION

📋 Passos no Firebase Console:

1. 🌐 Acesse: https://console.firebase.google.com/project/autodrive-1dccf/authentication/providers

2. ✅ Ative "Email/Password":
   - Clique em "Email/Password" 
   - ✅ Marque "Enable"
   - Salvar

3. 🔧 Configure domínios autorizados:
   - Vá em Settings > Authorized domains
   - Certifique-se que tem:
     • localhost
     • autodrive-1dccf.web.app
     • autodrive-1dccf.firebaseapp.com

4. 🧪 Teste:
   - Local: http://localhost:5000/test-auth.html
   - Produção: https://autodrive-1dccf.web.app/test-auth.html

🎯 Funcionalidades de Teste:
- ✅ Criar conta (email + senha)
- ✅ Fazer login
- ✅ Ver informações do usuário
- ✅ Logout
    """)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == 'info':
        show_instructions()
    else:
        print("🔥 Firebase Authentication Test")
        print("Comandos:")
        print("  python test_firebase_auth.py        - Testar localmente")
        print("  python test_firebase_auth.py info   - Ver instruções")
        print()
        
        choice = input("Deseja testar localmente? (y/n): ").lower()
        if choice in ['y', 'yes', 's', 'sim']:
            test_auth_locally()
        else:
            show_instructions()
