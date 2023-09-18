import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { database, storage } from './firebase';

async function addNewCategory(name, description, features) {
  const docRef = await addDoc(collection(database, 'categories'), {
    description,
    name,
    features,
  });
  return docRef;
}

async function addNewProduct(product) {
  // turn category string into a database reference
  const newProduct = { ...product };
  const categoryRef = doc(database, 'categories', newProduct.category);
  newProduct.category = categoryRef;

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
  const path = `products/${id}.${extension}`;
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file);
  const imageURL = await getDownloadURL(imageRef);

  // update the product with image location & reference
  const productRef = doc(database, 'products', id);
  const updatedProduct = await updateDoc(productRef, {
    image: imageURL,
    imageRef: path,
  });
  return updatedProduct;
}

async function removeProductFromAccessories(id, products) {
  const productRef = doc(database, 'products', id);
  if (products.length) {
    products.forEach(async (product) => {
      const updateRef = doc(database, 'products', product);
      await updateDoc(updateRef, {
        accessories: arrayRemove(productRef),
      });
    });
  }
}

async function deleteOldImage(imagePath) {
  const imageRef = ref(storage, imagePath);
  await deleteObject(imageRef);
}

async function deleteSingleCategory(categoryId) {
  const products = collection(database, 'products');
  const categoryRef = doc(database, 'categories', categoryId);
  const productsQuery = query(
    products,
    where('categories', 'array-contains', categoryRef),
  );
  const snapshot = await getCountFromServer(productsQuery);
  const { count } = snapshot.data();
  if (count) {
    throw new Error(
      `Cannot delete category: contains ${count} product${
        count > 1 ? 's' : ''
      }.`,
    );
  } else {
    await deleteDoc(doc(database, 'categories', categoryId));
  }
}

async function deleteSingleProduct(id, imagePath, accessories) {
  const imageRef = ref(storage, imagePath);
  // first delete the image
  await deleteObject(imageRef);
  // then the product itself
  await deleteDoc(doc(database, 'products', id));
  // finally remove any reference to the product from its accessories
  await removeProductFromAccessories(id, accessories);
}

async function updateCategory(id, name, description, features) {
  const categoryRef = doc(database, 'categories', id);
  await updateDoc(categoryRef, {
    description,
    name,
    features,
  });
}

async function updateProduct(id, product) {
  // convert category id string to database reference
  const newProduct = { ...product };
  newProduct.category = doc(database, 'categories', newProduct.category);

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
  await updateDoc(productRef, newProduct);
}

async function updateProductAccessories(productId) {
  // adds a product to the accessories of it's own accessories
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
  deleteOldImage,
  deleteSingleCategory,
  deleteSingleProduct,
  removeProductFromAccessories,
  updateCategory,
  updateProduct,
  updateProductAccessories,
};
