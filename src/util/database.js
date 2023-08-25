import { collection, getDocs } from 'firebase/firestore';
import { database } from './firebase';

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

export { getAllCategories, getAllProducts };
