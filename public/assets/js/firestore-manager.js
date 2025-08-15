/**
 * AutoDrive Firestore Database Manager
 * Gerencia todas as operações de banco de dados do sistema
 */

let db;
let auth;
let currentUser = null;

// Inicializar Firestore
function initializeFirestore() {
  if (typeof firebase !== 'undefined' && window.firebaseConfig) {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.firebaseConfig);
      }
      
      db = firebase.firestore();
      auth = firebase.auth();
      
      console.log('✅ Firestore inicializado com sucesso');
      
      // Configurações do Firestore
      db.enablePersistence().catch((err) => {
        if (err.code == 'failed-precondition') {
          console.warn('⚠️ Persistência offline não habilitada - múltiplas abas abertas');
        } else if (err.code == 'unimplemented') {
          console.warn('⚠️ Persistência offline não suportada neste navegador');
        }
      });
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar Firestore:', error);
      return false;
    }
  }
  return false;
}

// ===== GESTÃO DE USUÁRIOS =====

/**
 * Criar perfil de usuário no Firestore
 */
async function createUserProfile(uid, userData) {
  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.set({
      ...userData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      isActive: true
    });
    console.log('✅ Perfil de usuário criado:', uid);
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar perfil:', error);
    throw error;
  }
}

/**
 * Buscar perfil de usuário
 */
async function getUserProfile(uid) {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);
    throw error;
  }
}

/**
 * Atualizar perfil de usuário
 */
async function updateUserProfile(uid, updates) {
  try {
    const userRef = db.collection('users').doc(uid);
    await userRef.update({
      ...updates,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Perfil atualizado:', uid);
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error);
    throw error;
  }
}

// ===== GESTÃO DE ALUNOS =====

/**
 * Adicionar novo aluno
 */
async function addStudent(studentData) {
  try {
    const studentsRef = db.collection('students');
    const docRef = await studentsRef.add({
      ...studentData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      createdBy: currentUser?.uid
    });
    
    console.log('✅ Aluno adicionado:', docRef.id);
    return { id: docRef.id, ...studentData };
  } catch (error) {
    console.error('❌ Erro ao adicionar aluno:', error);
    throw error;
  }
}

/**
 * Buscar todos os alunos
 */
async function getStudents(limit = 50) {
  try {
    const studentsSnapshot = await db.collection('students')
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    const students = [];
    studentsSnapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('✅ Alunos carregados:', students.length);
    return students;
  } catch (error) {
    console.error('❌ Erro ao buscar alunos:', error);
    throw error;
  }
}

/**
 * Buscar aluno por ID
 */
async function getStudent(studentId) {
  try {
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (studentDoc.exists) {
      return { id: studentDoc.id, ...studentDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar aluno:', error);
    throw error;
  }
}

/**
 * Atualizar dados do aluno
 */
async function updateStudent(studentId, updates) {
  try {
    const studentRef = db.collection('students').doc(studentId);
    await studentRef.update({
      ...updates,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Aluno atualizado:', studentId);
    return true;
  } catch (error) {
    console.error('❌ Erro ao atualizar aluno:', error);
    throw error;
  }
}

/**
 * Desativar aluno (soft delete)
 */
async function deactivateStudent(studentId) {
  try {
    await updateStudent(studentId, { isActive: false });
    console.log('✅ Aluno desativado:', studentId);
    return true;
  } catch (error) {
    console.error('❌ Erro ao desativar aluno:', error);
    throw error;
  }
}

// ===== GESTÃO DE INSTRUTORES =====

/**
 * Adicionar novo instrutor
 */
async function addInstructor(instructorData) {
  try {
    const instructorsRef = db.collection('instructors');
    const docRef = await instructorsRef.add({
      ...instructorData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      createdBy: currentUser?.uid
    });
    
    console.log('✅ Instrutor adicionado:', docRef.id);
    return { id: docRef.id, ...instructorData };
  } catch (error) {
    console.error('❌ Erro ao adicionar instrutor:', error);
    throw error;
  }
}

/**
 * Buscar todos os instrutores
 */
async function getInstructors() {
  try {
    const instructorsSnapshot = await db.collection('instructors')
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
    
    const instructors = [];
    instructorsSnapshot.forEach((doc) => {
      instructors.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('✅ Instrutores carregados:', instructors.length);
    return instructors;
  } catch (error) {
    console.error('❌ Erro ao buscar instrutores:', error);
    throw error;
  }
}

// ===== GESTÃO DE VEÍCULOS =====

/**
 * Adicionar novo veículo
 */
async function addVehicle(vehicleData) {
  try {
    const vehiclesRef = db.collection('vehicles');
    const docRef = await vehiclesRef.add({
      ...vehicleData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      isActive: true,
      createdBy: currentUser?.uid
    });
    
    console.log('✅ Veículo adicionado:', docRef.id);
    return { id: docRef.id, ...vehicleData };
  } catch (error) {
    console.error('❌ Erro ao adicionar veículo:', error);
    throw error;
  }
}

/**
 * Buscar todos os veículos
 */
async function getVehicles() {
  try {
    const vehiclesSnapshot = await db.collection('vehicles')
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
    
    const vehicles = [];
    vehiclesSnapshot.forEach((doc) => {
      vehicles.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('✅ Veículos carregados:', vehicles.length);
    return vehicles;
  } catch (error) {
    console.error('❌ Erro ao buscar veículos:', error);
    throw error;
  }
}

// ===== GESTÃO DE AULAS =====

/**
 * Agendar nova aula
 */
async function scheduleLesson(lessonData) {
  try {
    const lessonsRef = db.collection('lessons');
    const docRef = await lessonsRef.add({
      ...lessonData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'scheduled',
      createdBy: currentUser?.uid
    });
    
    console.log('✅ Aula agendada:', docRef.id);
    return { id: docRef.id, ...lessonData };
  } catch (error) {
    console.error('❌ Erro ao agendar aula:', error);
    throw error;
  }
}

/**
 * Buscar aulas por período
 */
async function getLessonsByDateRange(startDate, endDate) {
  try {
    const lessonsSnapshot = await db.collection('lessons')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .orderBy('date', 'asc')
      .get();
    
    const lessons = [];
    lessonsSnapshot.forEach((doc) => {
      lessons.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('✅ Aulas carregadas:', lessons.length);
    return lessons;
  } catch (error) {
    console.error('❌ Erro ao buscar aulas:', error);
    throw error;
  }
}

// ===== GESTÃO DE PAGAMENTOS =====

/**
 * Registrar novo pagamento
 */
async function addPayment(paymentData) {
  try {
    const paymentsRef = db.collection('payments');
    const docRef = await paymentsRef.add({
      ...paymentData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: currentUser?.uid
    });
    
    console.log('✅ Pagamento registrado:', docRef.id);
    return { id: docRef.id, ...paymentData };
  } catch (error) {
    console.error('❌ Erro ao registrar pagamento:', error);
    throw error;
  }
}

/**
 * Buscar pagamentos por aluno
 */
async function getPaymentsByStudent(studentId) {
  try {
    const paymentsSnapshot = await db.collection('payments')
      .where('studentId', '==', studentId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const payments = [];
    paymentsSnapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('✅ Pagamentos carregados para aluno:', studentId, payments.length);
    return payments;
  } catch (error) {
    console.error('❌ Erro ao buscar pagamentos:', error);
    throw error;
  }
}

// ===== ESTATÍSTICAS E RELATÓRIOS =====

/**
 * Buscar estatísticas gerais
 */
async function getGeneralStats() {
  try {
    // Contar alunos ativos
    const studentsSnapshot = await db.collection('students')
      .where('isActive', '==', true)
      .get();
    
    // Contar instrutores ativos
    const instructorsSnapshot = await db.collection('instructors')
      .where('isActive', '==', true)
      .get();
    
    // Contar veículos ativos
    const vehiclesSnapshot = await db.collection('vehicles')
      .where('isActive', '==', true)
      .get();
    
    // Aulas do mês atual
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const lessonsSnapshot = await db.collection('lessons')
      .where('date', '>=', currentMonth)
      .get();
    
    const stats = {
      totalStudents: studentsSnapshot.size,
      totalInstructors: instructorsSnapshot.size,
      totalVehicles: vehiclesSnapshot.size,
      lessonsThisMonth: lessonsSnapshot.size,
      updatedAt: new Date()
    };
    
    console.log('✅ Estatísticas carregadas:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    throw error;
  }
}

// ===== LISTENERS EM TEMPO REAL =====

/**
 * Escutar mudanças nos alunos
 */
function listenToStudents(callback) {
  return db.collection('students')
    .where('isActive', '==', true)
    .orderBy('createdAt', 'desc')
    .onSnapshot((snapshot) => {
      const students = [];
      snapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() });
      });
      callback(students);
    }, (error) => {
      console.error('❌ Erro no listener de alunos:', error);
    });
}

/**
 * Escutar mudanças nas aulas
 */
function listenToLessons(callback) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return db.collection('lessons')
    .where('date', '>=', today)
    .orderBy('date', 'asc')
    .onSnapshot((snapshot) => {
      const lessons = [];
      snapshot.forEach((doc) => {
        lessons.push({ id: doc.id, ...doc.data() });
      });
      callback(lessons);
    }, (error) => {
      console.error('❌ Erro no listener de aulas:', error);
    });
}

// ===== INICIALIZAÇÃO =====

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  if (initializeFirestore()) {
    // Monitorar estado de autenticação
    auth.onAuthStateChanged((user) => {
      if (user) {
        currentUser = user;
        console.log('✅ Usuário autenticado para Firestore:', user.email);
        
        // Carregar ou criar perfil do usuário
        getUserProfile(user.uid).then((profile) => {
          if (!profile) {
            // Criar perfil padrão para usuário novo
            createUserProfile(user.uid, {
              email: user.email,
              name: user.displayName || user.email.split('@')[0],
              role: 'admin', // Por padrão, primeiro usuário é admin
              photoURL: user.photoURL
            }).catch(console.error);
          }
        }).catch(console.error);
        
      } else {
        currentUser = null;
        console.log('❌ Usuário não autenticado');
      }
    });
  }
});

// Exportar funções para uso global
window.FirestoreManager = {
  // Usuários
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  
  // Alunos
  addStudent,
  getStudents,
  getStudent,
  updateStudent,
  deactivateStudent,
  
  // Instrutores
  addInstructor,
  getInstructors,
  
  // Veículos
  addVehicle,
  getVehicles,
  
  // Aulas
  scheduleLesson,
  getLessonsByDateRange,
  
  // Pagamentos
  addPayment,
  getPaymentsByStudent,
  
  // Estatísticas
  getGeneralStats,
  
  // Listeners
  listenToStudents,
  listenToLessons,
  
  // Estado
  getCurrentUser: () => currentUser,
  getDB: () => db,
  getAuth: () => auth
};
