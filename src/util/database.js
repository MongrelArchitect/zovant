import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { database, storage } from './firebase';

async function addNewCategory(name, description) {
  const docRef = await addDoc(collection(database, 'categories'), {
    description,
    name,
  });
  return docRef;
}

async function addNewProduct(product) {
  const docRef = await (addDoc(collection(database, 'products'), product));
  return docRef;
}

async function addProductImage(id, file) {
  // upload image to storage and get the download url
  const fileName = file.name;
  const lastDot = fileName.lastIndexOf('.');
  const extension = fileName.slice(lastDot + 1);
  const imageRef = ref(storage, `products/${id}.${extension}`);
  await uploadBytes(imageRef, file);
  const imageURL = await getDownloadURL(imageRef);

  // update the product with image location
  const productRef = doc(database, 'products', id);
  const updatedProduct = await updateDoc(productRef, {
    image: imageURL,
  });
  return updatedProduct;
}

async function checkCategoryExists(name) {
  const categories = collection(database, 'categories');
  const nameQuery = query(categories, where('name', '==', name), limit(1));
  const snapshot = await getDocs(nameQuery);
  return !snapshot.empty;
}

async function checkProductExists(model) {
  const products = collection(database, 'products');
  const modelQuery = query(products, where('model', '==', model), limit(1));
  const snapshot = await getDocs(modelQuery);
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

async function getAllCategoryProducts(categoryId) {
  const categoryRef = doc(database, 'categories', categoryId);
  const productsRef = collection(database, 'products');
  const productsQuery = query(
    productsRef,
    where('categories', 'array-contains', categoryRef),
  );
  const snapshot = await getDocs(productsQuery);
  const result = [];
  if (!snapshot.empty) {
    snapshot.forEach((docu) => {
      result.push({ ...docu.data(), id: docu.id });
    });
  }
  return result;
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
  throw new Error(`Category id "${id}" not found`);
}

async function getSummaryCounts() {
  const result = {};

  const categoriesRef = collection(database, 'categories');
  const categoriesSnap = await getCountFromServer(categoriesRef);
  result.categories = categoriesSnap.data().count;

  const productsRef = collection(database, 'products');
  const productsSnap = await getCountFromServer(productsRef);
  result.products = productsSnap.data().count;

  return result;
}

async function updateCategory(id, name, description) {
  const categoryRef = doc(database, 'categories', id);
  await updateDoc(categoryRef, {
    description,
    name,
  });
}

export {
  addNewCategory,
  addNewProduct,
  addProductImage,
  checkCategoryExists,
  checkProductExists,
  getAllCategories,
  getAllCategoryProducts,
  getAllProducts,
  getSingleCategory,
  getSummaryCounts,
  updateCategory,
};
