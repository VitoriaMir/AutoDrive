#!/usr/bin/env python3
"""
Script rápido para deploy de updates
"""
import subprocess
import os
import shutil

def update_public_files():
    """Atualiza os arquivos no diretório public"""
    print("📁 Copiando arquivos atualizados para public/...")
    
    # Templates para copiar
    templates = ['index.html', 'login.html', 'dashboard.html']
    for template in templates:
        src = f'app/templates/{template}'
        dst = f'public/{template}'
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"✅ {template} copiado")
    
    # Copiar assets atualizados (substitui tudo)
    if os.path.exists('app/assets'):
        if os.path.exists('public/assets'):
            shutil.rmtree('public/assets')
        shutil.copytree('app/assets', 'public/assets')
        print("✅ Assets sincronizados")

def deploy():
    """Faz o deploy para produção"""
    print("🚀 Fazendo deploy para produção...")
    
    try:
        # Atualizar arquivos
        update_public_files()
        
        # Deploy
        result = subprocess.run(['firebase', 'deploy', '--only', 'hosting'], 
                              check=True, capture_output=True, text=True)
        
        print("✅ Deploy concluído com sucesso!")
        print("🌐 Site: https://autodrive-1dccf.web.app")
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro no deploy: {e}")
        print(f"Saída: {e.stdout}")
        print(f"Erro: {e.stderr}")
        return False

if __name__ == "__main__":
    success = deploy()
    if success:
        print("\n🎉 Deploy realizado com sucesso!")
    else:
        print("\n❌ Falha no deploy")
