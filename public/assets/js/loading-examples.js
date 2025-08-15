// ========================================
// INSTRUÇÕES PARA USO DO LOADING MANAGER
// ========================================

/*
EXEMPLOS DE USO DO LOADING MANAGER:

1. MOSTRAR LOADING EM CONTAINER:
LoadingManager.show('containerId', {
  type: 'spinner',      // ou 'dots', 'skeleton', 'progress'
  size: 'medium',       // ou 'small', 'large'
  text: 'Carregando...'
});

2. ESCONDER LOADING:
LoadingManager.hide('containerId');

3. LOADING DE LISTA/TABELA:
LoadingManager.show('containerId', {
  type: 'skeleton',
  text: 'Carregando dados...',
  rows: 5
});

4. LOADING EM BOTÃO:
LoadingManager.showButtonLoading('buttonId', 'Salvando...');
LoadingManager.hideButtonLoading('buttonId');

5. OVERLAY GLOBAL:
LoadingManager.showOverlay({
  text: 'Processando...',
  dark: false,
  blur: true
});
LoadingManager.hideOverlay();

6. ESTADO DE ERRO:
LoadingManager.showError('containerId', {
  title: 'Erro ao carregar',
  message: 'Descrição do erro',
  retry: 'nomeDaFuncao()',
  retryText: 'Tentar Novamente'
});

7. VERIFICAR SE ESTÁ CARREGANDO:
if (LoadingManager.isLoading('containerId')) {
  // Fazer algo
}

8. LIMPAR TODOS OS LOADINGS:
LoadingManager.clearAll();
*/

// EXEMPLOS DE IMPLEMENTAÇÃO:

// Exemplo para função de salvar aluno:
async function saveStudent(studentData) {
  try {
    LoadingManager.showButtonLoading('saveStudentBtn', 'Salvando...');
    
    await FirestoreManager.saveStudent(studentData);
    
    LoadingManager.hideButtonLoading('saveStudentBtn');
    closeModal('studentModal');
    loadAllStudentsData(); // Recarregar lista
    
  } catch (error) {
    LoadingManager.hideButtonLoading('saveStudentBtn');
    alert('Erro ao salvar aluno: ' + error.message);
  }
}

// Exemplo para função de carregar dashboard:
async function loadDashboardStats() {
  try {
    LoadingManager.show('dashboardStats', {
      type: 'skeleton',
      text: 'Carregando estatísticas...'
    });
    
    const stats = await FirestoreManager.getDashboardStats();
    renderStats(stats);
    
    LoadingManager.hide('dashboardStats');
    
  } catch (error) {
    LoadingManager.showError('dashboardStats', {
      title: 'Erro ao carregar estatísticas',
      message: error.message,
      retry: 'loadDashboardStats()',
      retryText: 'Recarregar'
    });
  }
}

// Exemplo para função de pesquisa:
function searchStudents(query) {
  if (!query.trim()) {
    renderStudentsList(allStudentsData);
    return;
  }
  
  LoadingManager.show('studentsListContainer', {
    type: 'dots',
    size: 'small',
    text: 'Pesquisando...',
    compact: true
  });
  
  // Simular delay de pesquisa
  setTimeout(() => {
    const filtered = allStudentsData.filter(student => 
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.cpf.includes(query) ||
      student.email.toLowerCase().includes(query.toLowerCase())
    );
    
    renderStudentsList(filtered);
    LoadingManager.hide('studentsListContainer');
  }, 300);
}
