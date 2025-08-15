/**
 * AutoDrive Loading States Manager
 * Gerencia todos os estados de loading da aplicação
 */

class LoadingManager {
  constructor() {
    this.activeLoadings = new Set();
  }

  /**
   * Criar loading state moderno
   */
  createLoadingState(options = {}) {
    const {
      type = 'spinner', // 'spinner', 'dots', 'skeleton', 'progress'
      size = 'medium',   // 'small', 'medium', 'large'
      text = 'Carregando...',
      subtext = null,
      compact = false,
      icon = null
    } = options;

    const loadingDiv = document.createElement('div');
    loadingDiv.className = `loading-state ${compact ? 'compact' : ''}`;

    let spinnerHTML = '';
    
    switch (type) {
      case 'dots':
        spinnerHTML = `
          <div class="loading-spinner ${size}">
            <div class="spinner-dots">
              <div class="spinner-dot"></div>
              <div class="spinner-dot"></div>
              <div class="spinner-dot"></div>
            </div>
          </div>
        `;
        break;
        
      case 'icon':
        spinnerHTML = `
          <div class="loading-with-icon">
            <div class="loading-icon">
              <i class="fas fa-${icon || 'cog'} fa-spin"></i>
            </div>
          </div>
        `;
        break;
        
      case 'progress':
        spinnerHTML = `
          <div class="loading-progress">
            <div class="loading-progress-bar"></div>
          </div>
        `;
        break;
        
      case 'skeleton':
        spinnerHTML = `
          <div class="table-loading">
            ${Array.from({length: 3}, () => `
              <div class="table-skeleton-row">
                <div class="skeleton table-skeleton-avatar"></div>
                <div class="table-skeleton-content">
                  <div class="skeleton skeleton-line medium"></div>
                  <div class="skeleton skeleton-line short"></div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        break;
        
      default: // spinner
        spinnerHTML = `
          <div class="loading-spinner ${size}">
            <div class="spinner-circle"></div>
          </div>
        `;
    }

    const textHTML = type !== 'skeleton' ? `
      <p class="loading-text ${size === 'small' ? 'small' : ''}">${text}</p>
      ${subtext ? `<p class="loading-subtext">${subtext}</p>` : ''}
    ` : '';

    loadingDiv.innerHTML = spinnerHTML + textHTML;
    return loadingDiv;
  }

  /**
   * Mostrar loading em elemento específico
   */
  show(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container ${containerId} não encontrado`);
      return;
    }

    // Salvar conteúdo original
    if (!container.dataset.originalContent) {
      container.dataset.originalContent = container.innerHTML;
    }

    // Criar e inserir loading
    const loadingElement = this.createLoadingState(options);
    container.innerHTML = '';
    container.appendChild(loadingElement);

    // Marcar como ativo
    this.activeLoadings.add(containerId);

    return this;
  }

  /**
   * Esconder loading e restaurar conteúdo
   */
  hide(containerId, newContent = null) {
    const container = document.getElementById(containerId);
    if (!container) return this;

    // Restaurar conteúdo original ou definir novo
    if (newContent) {
      container.innerHTML = newContent;
    } else if (container.dataset.originalContent) {
      container.innerHTML = container.dataset.originalContent;
      delete container.dataset.originalContent;
    }

    // Remover da lista de ativos
    this.activeLoadings.delete(containerId);

    return this;
  }

  /**
   * Mostrar loading em modal
   */
  showModal(modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) return this;

    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
      return this.show(modalBody.id || `${modalId}-body`, {
        compact: true,
        ...options
      });
    }

    return this;
  }

  /**
   * Criar overlay de loading para a página inteira
   */
  showOverlay(options = {}) {
    const {
      text = 'Carregando...',
      dark = false,
      blur = true
    } = options;

    // Remover overlay existente
    this.hideOverlay();

    const overlay = document.createElement('div');
    overlay.className = `loading-overlay ${dark ? 'dark' : ''}`;
    overlay.id = 'global-loading-overlay';
    
    if (!blur) {
      overlay.style.backdropFilter = 'none';
    }

    overlay.innerHTML = `
      <div class="loading-state compact">
        <div class="loading-spinner large">
          <div class="spinner-circle"></div>
        </div>
        <p class="loading-text">${text}</p>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    return this;
  }

  /**
   * Esconder overlay de loading
   */
  hideOverlay() {
    const overlay = document.getElementById('global-loading-overlay');
    if (overlay) {
      overlay.remove();
      document.body.style.overflow = '';
    }
    return this;
  }

  /**
   * Mostrar loading em botão
   */
  showButtonLoading(buttonId, loadingText = null) {
    const button = document.getElementById(buttonId) || 
                   document.querySelector(`[onclick*="${buttonId}"]`);
                   
    if (!button) return this;

    // Salvar estado original
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.innerHTML;
      button.dataset.originalDisabled = button.disabled;
    }

    // Aplicar loading
    button.classList.add('loading');
    button.disabled = true;
    
    if (loadingText) {
      button.innerHTML = loadingText;
    }

    return this;
  }

  /**
   * Esconder loading do botão
   */
  hideButtonLoading(buttonId) {
    const button = document.getElementById(buttonId) || 
                   document.querySelector(`[onclick*="${buttonId}"]`);
                   
    if (!button) return this;

    // Restaurar estado original
    button.classList.remove('loading');
    
    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
      delete button.dataset.originalText;
    }
    
    if (button.dataset.originalDisabled !== undefined) {
      button.disabled = button.dataset.originalDisabled === 'true';
      delete button.dataset.originalDisabled;
    }

    return this;
  }

  /**
   * Criar loading para lista/tabela
   */
  showListLoading(containerId, options = {}) {
    const {
      rows = 5,
      hasAvatar = true,
      text = 'Carregando dados...'
    } = options;

    return this.show(containerId, {
      type: 'skeleton',
      text: text,
      compact: true
    });
  }

  /**
   * Mostrar estado de erro
   */
  showError(containerId, options = {}) {
    const {
      title = 'Erro ao carregar',
      message = 'Ocorreu um erro inesperado',
      icon = 'exclamation-triangle',
      retry = null,
      retryText = 'Tentar Novamente'
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return this;

    const retryButton = retry ? `
      <button class="btn btn-primary" onclick="${retry}" style="margin-top: 15px;">
        <i class="fas fa-refresh"></i> ${retryText}
      </button>
    ` : '';

    container.innerHTML = `
      <div class="error-state">
        <div class="error-icon">
          <i class="fas fa-${icon}"></i>
        </div>
        <p class="error-text">${title}</p>
        <p class="error-subtext">${message}</p>
        ${retryButton}
      </div>
    `;

    return this;
  }

  /**
   * Verificar se há loading ativo
   */
  isLoading(containerId = null) {
    if (containerId) {
      return this.activeLoadings.has(containerId);
    }
    return this.activeLoadings.size > 0;
  }

  /**
   * Limpar todos os loadings
   */
  clearAll() {
    this.activeLoadings.forEach(containerId => {
      this.hide(containerId);
    });
    this.hideOverlay();
    return this;
  }
}

// Criar instância global
window.LoadingManager = new LoadingManager();

// Funções de conveniência globais
window.showLoading = (containerId, options) => window.LoadingManager.show(containerId, options);
window.hideLoading = (containerId, content) => window.LoadingManager.hide(containerId, content);
window.showLoadingOverlay = (options) => window.LoadingManager.showOverlay(options);
window.hideLoadingOverlay = () => window.LoadingManager.hideOverlay();

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Loading Manager inicializado');
});
