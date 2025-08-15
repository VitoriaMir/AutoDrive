#!/usr/bin/env python3
"""
Script para deploy em produção com Firebase
"""
import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(cmd, description):
    """Execute um comando e mostra o resultado"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} - Sucesso")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - Erro: {e.stderr}")
        sys.exit(1)

def check_firebase_tools():
    """Verifica se Firebase CLI está instalado"""
    try:
        result = subprocess.run(['firebase', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Firebase CLI instalado: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    
    print("❌ Firebase CLI não encontrado. Instalando...")
    run_command("npm install -g firebase-tools", "Instalando Firebase CLI")
    return True

def setup_production_build():
    """Prepara o build para produção"""
    print("\n🚀 Preparando build para produção...")
    
    # Verifica se existe .env.production
    if not os.path.exists('.env.production'):
        print("❌ Arquivo .env.production não encontrado!")
        print("Por favor, crie o arquivo .env.production com as configurações necessárias")
        sys.exit(1)
    
    # Copia configuração de produção
    if os.path.exists('.env'):
        shutil.copy('.env', '.env.backup')
        print("📄 Backup do .env atual criado como .env.backup")
    
    shutil.copy('.env.production', '.env')
    print("📄 Configuração de produção ativada")
    
    # Instala dependências Python
    run_command("pip install -r requirements.txt", "Instalando dependências Python")
    
    # Instala dependências Node.js se necessário
    if os.path.exists('package.json'):
        run_command("npm install", "Instalando dependências Node.js")

def deploy_to_firebase():
    """Faz o deploy para o Firebase"""
    if not os.path.exists('firebase.json'):
        print("❌ Arquivo firebase.json não encontrado!")
        print("Execute 'firebase init' primeiro para configurar o projeto")
        sys.exit(1)
    
    print("\n🔥 Fazendo login no Firebase...")
    run_command("firebase login", "Login no Firebase")
    
    print("\n🚀 Fazendo deploy para produção...")
    run_command("firebase deploy", "Deploy para Firebase")

def main():
    """Função principal"""
    print("🔥 AutoDrive - Deploy para Produção com Firebase")
    print("=" * 50)
    
    # Verifica se está no diretório correto
    if not os.path.exists('app.py'):
        print("❌ Execute este script a partir do diretório raiz do projeto")
        sys.exit(1)
    
    # Verifica ferramentas necessárias
    check_firebase_tools()
    
    # Prepara build
    setup_production_build()
    
    # Deploy
    deploy_to_firebase()
    
    print("\n✅ Deploy concluído com sucesso!")
    print("🌐 Sua aplicação está agora em produção no Firebase")

if __name__ == "__main__":
    main()
