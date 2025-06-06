import { db } from '../config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  limit 
} from 'firebase/firestore';

const COLLECTION_NAME = 'toners';
const MOVEMENTS_COLLECTION = 'tonerMovements';

// Buscar todos os toners
export const fetchToners = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('model'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao buscar toners:', error);
    throw error;
  }
};

// Adicionar novo toner
export const addToner = async (tonerData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...tonerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar toner:', error);
    throw error;
  }
};

// Atualizar toner
export const updateToner = async (id, tonerData) => {
  try {
    const tonerRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(tonerRef, {
      ...tonerData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erro ao atualizar toner:', error);
    throw error;
  }
};

// Deletar toner
export const deleteToner = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Erro ao deletar toner:', error);
    throw error;
  }
};

// Registrar movimentação
export const registerTonerMovement = async (movementData) => {
  try {
    await addDoc(collection(db, MOVEMENTS_COLLECTION), {
      ...movementData,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Erro ao registrar movimentação:', error);
    throw error;
  }
};

// Buscar movimentações
export const fetchTonerMovements = async (limit = 10) => {
  try {
    const q = query(
      collection(db, MOVEMENTS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    throw error;
  }
};

// Buscar estatísticas
export const getTonerStats = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const toners = snapshot.docs.map(doc => doc.data());
    
    return {
      total: toners.length,
      available: toners.filter(t => t.status === 'available').length,
      inUse: toners.filter(t => t.status === 'in_use').length,
      retired: toners.filter(t => t.status === 'retired').length
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
};