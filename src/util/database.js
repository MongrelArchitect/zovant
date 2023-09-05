import {
  addDoc,
  arrayUnion,
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
  // first need to convert the array of category id strings into array
  // of firestore references for those categories
  const newProduct = { ...product };
  const newCategories = [];
  newProduct.categories.forEach((categoryId) => {
    const categoryRef = doc(database, 'categories', categoryId);
    newCategories.push(categoryRef);
  });
  newProduct.categories = newCategories;

  // now do the same for any accessories
  if (product.accessories.length) {
    const newAccessories = [];
    newProduct.accessories.forEach((productId) => {
      const productRef = doc(database, 'products', productId);
      newAccessories.push(productRef);
    });
    newProduct.accessories = newAccessories;
  }

  // now upload the product (we'll add the image later);
  const docRef = await addDoc(collection(database, 'products'), newProduct);
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
  if (!querySnapshot.empty) {
    querySnapshot.forEach((docu) => {
      categories.push({ ...docu.data(), id: docu.id });
    });
    categories.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    });
  }
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
    result.sort((a, b) => {
      const modelA = a.model.toLowerCase();
      const modelB = b.model.toLowerCase();
      if (modelA < modelB) {
        return -1;
      }
      if (modelA < modelB) {
        return 1;
      }
      return 0;
    });
  }
  return result;
}

async function getSingleCategory(id) {
  const categoryRef = doc(database, 'categories', id);
  const categorySnap = await getDoc(categoryRef);
  if (categorySnap.exists()) {
    return categorySnap.data();
  }
  throw new Error(`Category id "${id}" not found`);
}

async function getSingleProduct(id) {
  const productRef = doc(database, 'products', id);
  const productSnap = await getDoc(productRef);
  if (productSnap.exists()) {
    return productSnap.data();
  }
  throw new Error(`Product id "${id}" not found`);
}

async function getAllProductAccessories(accessoryRefs) {
  const accessories = [];
  if (accessoryRefs.length) {
    // eslint-disable-next-line
    for (const acc of accessoryRefs) {
      // eslint-disable-next-line
      const accessory = await getSingleProduct(acc.id);
      accessories.push({ ...accessory, id: acc.id });
    }
  }
  return accessories;
}

async function getAllProductCategories(categoryRefs) {
  const categories = [];
  if (categoryRefs.length) {
    // eslint-disable-next-line
    for(const cat of categoryRefs) {
    // eslint-disable-next-line
      const category = await getSingleCategory(cat.id);
      categories.push({ ...category, id: cat.id });
    }
  }
  return categories;
}

async function getAllProducts() {
  const querySnapshot = await getDocs(collection(database, 'products'));
  const products = [];
  if (!querySnapshot.empty) {
    querySnapshot.forEach((docu) => {
      products.push({ ...docu.data(), id: docu.id });
    });
    products.sort((a, b) => {
      const modelA = a.model.toLowerCase();
      const modelB = b.model.toLowerCase();
      if (modelA < modelB) {
        return -1;
      }
      if (modelA < modelB) {
        return 1;
      }
      return 0;
    });
  }
  return products;
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

async function updateProduct(id, product) {
  // first need to convert the array of category id strings into array
  // of firestore references for those categories
  const newProduct = { ...product };
  const newCategories = [];
  newProduct.categories.forEach((categoryId) => {
    const categoryRef = doc(database, 'categories', categoryId);
    newCategories.push(categoryRef);
  });
  newProduct.categories = newCategories;

  // now do the same for any accessories
  if (product.accessories.length) {
    const newAccessories = [];
    newProduct.accessories.forEach((productId) => {
      const productRef = doc(database, 'products', productId);
      newAccessories.push(productRef);
    });
    newProduct.accessories = newAccessories;
  }

  // now update the product (we'll deal with the image later);
  const productRef = doc(database, 'products', id);
  await updateDoc(productRef, product);
}

async function updateProductAccessories(productId) {
  // add's a product to the accessories of it's own accessories
  const productRef = doc(database, 'products', productId);
  const productSnap = await getDoc(productRef);
  const { accessories } = productSnap.data();
  if (accessories.length) {
    accessories.forEach(async (accessory) => {
      await updateDoc(accessory, {
        accessories: arrayUnion(productRef),
      });
    });
  }
}

export {
  addNewCategory,
  addNewProduct,
  addProductImage,
  checkCategoryExists,
  checkProductExists,
  getAllCategories,
  getAllCategoryProducts,
  getAllProductAccessories,
  getAllProductCategories,
  getAllProducts,
  getSingleCategory,
  getSingleProduct,
  getSummaryCounts,
  updateCategory,
  updateProduct,
  updateProductAccessories,
};
