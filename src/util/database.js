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

export default getAllCategories;
