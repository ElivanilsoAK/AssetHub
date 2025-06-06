import { auth } from '../config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { db } from '../config';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Registrar um novo usuário
export const registerUser = async (name, email, password, role = 'user') => {
  try {
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Atualizar o perfil com o nome
    await updateProfile(user, { displayName: name });
    
    // Salvar informações adicionais no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      role,
      createdAt: serverTimestamp()
    });
    
    return {
      uid: user.uid,
      name,
      email,
      role
    };
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};

// Login de usuário
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Buscar informações adicionais do Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    
    return {
      uid: user.uid,
      name: userData?.name || user.displayName,
      email: user.email,
      role: userData?.role || 'user'
    };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

// Logout de usuário
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

// Verificar estado de autenticação atual
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (user) {
        try {
          // Buscar informações adicionais do Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          
          resolve({
            uid: user.uid,
            name: userData?.name || user.displayName,
            email: user.email,
            role: userData?.role || 'user'
          });
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          resolve({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            role: 'user'
          });
        }
      } else {
        resolve(null);
      }
    }, reject);
  });
};