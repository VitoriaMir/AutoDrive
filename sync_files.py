#!/usr/bin/env python3
"""
Script para sincronizar todos os arquivos do projeto com o diretório público
"""
import shutil
import os

def sync_files():
    """Sincroniza todos os arquivos necessários para o diretório public"""
    print("🔄 Sincronizando arquivos...")
    
    # Copiar templates
    templates = ['index.html', 'login.html', 'dashboard.html']
    for template in templates:
        src = f'app/templates/{template}'
        dst = f'public/{template}'
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"✅ {template} copiado")
        else:
            print(f"⚠️  {template} não encontrado")
    
    # Copiar assets completos
    if os.path.exists('public/assets'):
        shutil.rmtree('public/assets')
    
    if os.path.exists('app/assets'):
        shutil.copytree('app/assets', 'public/assets')
        print("✅ Assets sincronizados")
    
    print("✅ Sincronização completa!")

if __name__ == "__main__":
    sync_files()
