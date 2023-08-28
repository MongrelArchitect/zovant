import {
  addDoc,
  collection,
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
  querySnapshot.forEach((doc) => {
    categories.push({ ...doc.data(), id: doc.id });
  });
  return categories;
}

async function getAllProducts() {
  const querySnapshot = await getDocs(collection(database, 'products'));
  const products = [];
  querySnapshot.forEach((doc) => {
    products.push({ ...doc.data(), id: doc.id });
  });
  return products;
}

export {
  addNewCategory,
  checkCategoryExists,
  getAllCategories,
  getAllProducts,
};
