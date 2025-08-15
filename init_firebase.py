#!/usr/bin/env python3
"""
Inicialização do projeto Firebase AutoDrive
"""
import subprocess
import os
import sys
import shutil

def find_firebase_command():
    """Encontra o comando firebase no sistema"""
    # Tenta diferentes localizações do firebase
    possible_paths = [
        'firebase',
        'firebase.cmd',
        os.path.expanduser('~\\AppData\\Roaming\\npm\\firebase.cmd'),
        'C:\\Users\\' + os.getenv('USERNAME', '') + '\\AppData\\Roaming\\npm\\firebase.cmd'
    ]
    
    for path in possible_paths:
        if shutil.which(path):
            return path
    
    return None

def init_firebase_project():
    """Inicializa o projeto Firebase"""
    print("🔥 Configurando projeto Firebase para AutoDrive...")
    
    # Encontrar comando firebase
    firebase_cmd = find_firebase_command()
    if not firebase_cmd:
        print("❌ Firebase CLI não encontrado!")
        print("💡 Instale com: npm install -g firebase-tools")
        return False
    
    print(f"✅ Firebase CLI encontrado: {firebase_cmd}")
    
    try:
        # Verificar se está logado no Firebase
        result = subprocess.run([firebase_cmd, 'projects:list'], 
                              capture_output=True, text=True, timeout=30, shell=True)
        
        if result.returncode != 0:
            print("📝 Fazendo login no Firebase...")
            login_result = subprocess.run([firebase_cmd, 'login'], shell=True)
            if login_result.returncode != 0:
                print("❌ Falha no login do Firebase")
                return False
        
        # Verificar se o projeto AutoDrive está disponível
        print("📋 Verificando projeto AutoDrive...")
        projects_result = subprocess.run([firebase_cmd, 'projects:list'], 
                                       capture_output=True, text=True, shell=True)
        
        if 'autodrive-1dccf' in projects_result.stdout:
            print("✅ Projeto AutoDrive encontrado!")
        else:
            print("⚠️  Projeto AutoDrive não encontrado na lista")
            print("Certifique-se de ter acesso ao projeto 'autodrive-1dccf'")
        
        # Inicializar projeto Firebase se não existir firebase.json
        if not os.path.exists('firebase.json'):
            print("🚀 Inicializando configuração do Firebase...")
            print("\n📝 Durante a configuração:")
            print("1. Selecione 'Functions' e 'Hosting'")
            print("2. Escolha o projeto 'AutoDrive (autodrive-1dccf)'")
            print("3. Para Functions: escolha 'Python'")
            print("4. Para Hosting: use 'app/assets' como public directory")
            print("5. Configure como SPA (single-page app): Yes")
            
            init_result = subprocess.run([firebase_cmd, 'init'], shell=True)
            if init_result.returncode != 0:
                print("❌ Falha na inicialização do Firebase")
                return False
        else:
            print("✅ Projeto Firebase já configurado!")
            
        print("\n✅ Configuração concluída!")
        print("📖 Próximos passos:")
        print("1. Configure suas credenciais no Firebase Console")
        print("2. Atualize o arquivo firebase-config.js com sua API Key")
        print("3. Execute: python deploy_production.py")
        
        return True
        
    except subprocess.TimeoutExpired:
        print("❌ Timeout ao verificar projetos Firebase")
        print("Verifique sua conexão com a internet")
        return False
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao configurar Firebase: {e}")
        return False
    except KeyboardInterrupt:
        print("\n❌ Cancelado pelo usuário")
        return False
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        return False

if __name__ == "__main__":
    success = init_firebase_project()
    sys.exit(0 if success else 1)
