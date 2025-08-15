// ============================================
// DEMONSTRAÇÃO DO LOADING MANAGER
// ============================================

// Função para testar diferentes tipos de loading
function testLoadingStates() {
  const tests = [
    {
      name: 'Loading com Spinner',
      action: () => {
        LoadingManager.show('studentsListContainer', {
          type: 'spinner',
          size: 'medium',
          text: 'Carregando com spinner...'
        });
        setTimeout(() => LoadingManager.hide('studentsListContainer'), 3000);
      }
    },
    {
      name: 'Loading com Skeleton',
      action: () => {
        LoadingManager.show('studentsListContainer', {
          type: 'skeleton',
          text: 'Carregando com skeleton...',
          rows: 5
        });
        setTimeout(() => LoadingManager.hide('studentsListContainer'), 3000);
      }
    },
    {
      name: 'Loading com Dots',
      action: () => {
        LoadingManager.show('studentsListContainer', {
          type: 'dots',
          size: 'large',
          text: 'Carregando com dots animados...'
        });
        setTimeout(() => LoadingManager.hide('studentsListContainer'), 3000);
      }
    },
    {
      name: 'Estado de Erro',
      action: () => {
        LoadingManager.showError('studentsListContainer', {
          title: 'Erro de Demonstração',
          message: 'Este é um exemplo de como exibir erros de forma elegante',
          icon: 'exclamation-triangle',
          retry: 'testLoadingStates()',
          retryText: 'Testar Novamente'
        });
      }
    },
    {
      name: 'Overlay Global',
      action: () => {
        LoadingManager.showOverlay({
          text: 'Processando dados...',
          dark: false,
          blur: true
        });
        setTimeout(() => LoadingManager.hideOverlay(), 2000);
      }
    }
  ];
  
  console.log('🎯 Testes de Loading disponíveis:');
  tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}`);
    console.log(`   Execute: testLoadingStates()[${index}].action()`);
  });
  
  return tests;
}

// Função para simular carregamento de dados
async function simulateDataLoading(containerId, type = 'spinner') {
  try {
    LoadingManager.show(containerId, {
      type: type,
      text: 'Carregando dados...',
      size: 'medium'
    });
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular dados carregados
    const mockData = `
      <div class="alert alert-success">
        <i class="fas fa-check-circle"></i>
        <strong>Sucesso!</strong> Dados carregados com ${type} loading.
      </div>
    `;
    
    LoadingManager.hide(containerId, mockData);
    
  } catch (error) {
    LoadingManager.showError(containerId, {
      title: 'Erro na simulação',
      message: error.message,
      retry: `simulateDataLoading('${containerId}', '${type}')`,
      retryText: 'Tentar Novamente'
    });
  }
}

// Função para testar loading em botões
function testButtonLoading(buttonId) {
  const button = document.getElementById(buttonId);
  if (!button) {
    console.error(`Botão ${buttonId} não encontrado`);
    return;
  }
  
  LoadingManager.showButtonLoading(buttonId, 'Processando...');
  
  setTimeout(() => {
    LoadingManager.hideButtonLoading(buttonId);
    console.log('✅ Loading do botão finalizado');
  }, 3000);
}

// Função para demonstrar loading de pesquisa
function demonstrateSearchLoading() {
  const searchInput = document.querySelector('input[placeholder*="esquisar"]');
  if (searchInput) {
    searchInput.classList.add('search-loading');
    
    setTimeout(() => {
      searchInput.classList.remove('search-loading');
    }, 2000);
  }
}

// Console commands para testar:
console.log(`
🚀 COMANDOS PARA TESTAR O LOADING MANAGER:

1. Testar diferentes tipos de loading:
   testLoadingStates()

2. Simular carregamento com spinner:
   simulateDataLoading('studentsListContainer', 'spinner')

3. Simular carregamento com skeleton:
   simulateDataLoading('studentsListContainer', 'skeleton')

4. Simular carregamento com dots:
   simulateDataLoading('studentsListContainer', 'dots')

5. Testar loading em botão (exemplo):
   testButtonLoading('algumBotaoId')

6. Mostrar overlay global:
   LoadingManager.showOverlay({text: 'Teste'})

7. Esconder overlay:
   LoadingManager.hideOverlay()

8. Verificar se há loading ativo:
   LoadingManager.isLoading()

9. Limpar todos os loadings:
   LoadingManager.clearAll()
`);

// Disponibilizar funções globalmente para teste
window.testLoadingStates = testLoadingStates;
window.simulateDataLoading = simulateDataLoading;
window.testButtonLoading = testButtonLoading;
