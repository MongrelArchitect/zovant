import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from 'firebase/firestore';
import { database } from './firebase';

async function addNewCategory(name, description) {
  const docRef = await addDoc(collection(database, 'categories'), {
    description,
    name,
  });
  return docRef;
}

async function checkCategoryExists(name) {
  const categories = collection(database, 'categories');
  const nameQuery = query(categories, where('name', '==', name), limit(1));
  const snapshot = await getDocs(nameQuery);
  return !snapshot.empty;
}

async function getAllCategories() {
  const querySnapshot = await getDocs(collection(database, 'categories'));
  const categories = [];
  querySnapshot.forEach((docu) => {
    categories.push({ ...docu.data(), id: docu.id });
  });
  return categories;
}

async function getAllProducts() {
  const querySnapshot = await getDocs(collection(database, 'products'));
  const products = [];
  querySnapshot.forEach((docu) => {
    products.push({ ...docu.data(), id: docu.id });
  });
  return products;
}

async function getSingleCategory(id) {
  const categoryRef = doc(database, 'categories', id);
  const categorySnap = await getDoc(categoryRef);
  if (categorySnap.exists()) {
    return categorySnap.data();
  }
  return new Error(`Category id "${id}" not found`);
}

export {
  addNewCategory,
  checkCategoryExists,
  getAllCategories,
  getAllProducts,
  getSingleCategory,
};
