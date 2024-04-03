'use client';

import { createContext, useReducer, useState } from 'react';
import { initialCategory, categoryReducer } from './category-reducer';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CategoryContextType {
  categoryEdit: { [key: string]: boolean }; // Change `any` to the appropriate type for categoryEdit
  dispatch: React.Dispatch<any>;
}

// Set default value to match the structure you're providing
const defaultValue: CategoryContextType = {
  categoryEdit: initialCategory,
  dispatch: () => {
    console.log('hell is not a good place');
  }, // Provide a dummy dispatch function
};

// export const CategoryContext = createContext<CategoryContextType>(defaultValue);
export const CategoryContext = createContext({
  edit: true,
  productEdit: false,
  categories: [],
  handleSetEdit: () => {
    console.log('whatt?');
  },
  handleResetEdit: () => {},
  getCategories: () => {},
  handleGetEditedProduct: (editedProduct: any) => {},
  editedProductId: '',
  editedProductDetails: {
    name: '',
    description: '',
    price: '',
    discount_price: '',
    quantity: '',
    sku: '',
    vendor_id: '',
    category_id: '',
  },
});
// export const CategoryDispatchContext = createContext(null);

export default function CategoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categoryEdit, dispatch] = useReducer(categoryReducer, initialCategory);
  const [edit, setEdit] = useState(true);
  const [productEdit, setProductEdit] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editedProductId, setEditedProductId] = useState('');
  const [editedProductDetails, setEditedProductDetails] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    quantity: '',
    sku: '',
    vendor_id: '',
    category_id: '',
  }); // fuck I couldn't find proper name for this jackass

  const router = useRouter();

  const handleSetEdit = () => setEdit(false);
  const handleResetEdit = () => setEdit(true);

  const getCategories = async () => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/categories`;
    const requestOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('vendor_token')}`,
      },
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error('Gözlənilməyən xəta yarandı.', {
        description: 'Kateqoriyalar yüklənmədi...',
      });
    }
  };

  const handleGetEditedProduct = async (editedProduct: any) => {
    console.log(editedProduct);
    const { id } = editedProduct;
    setEditedProductId(id);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/products/${id}`;
    const requestOptions = {
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('vendor_token')}`,
      },
    };

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    console.log(result);

    const {
      name,
      description,
      price,
      discount_price,
      category_id,
      quantity,
      sku,
      vendor_id,
    } = result[0];

    setEditedProductDetails({
      name,
      description,
      price,
      discount_price,
      category_id,
      quantity,
      sku,
      vendor_id,
    });

    getCategories();
    setProductEdit(true);
    router.push('/dashboard/products/add-product');
  };

  const context = {
    edit,
    categories,
    handleSetEdit,
    handleResetEdit,
    getCategories,
    handleGetEditedProduct,
    editedProductId,
    editedProductDetails,
    productEdit,
  };

  return (
    <CategoryContext.Provider value={context}>
      {/* <CategoryDispatchContext.Provider value={{ categoryEdit, dispatch }}> */}
      {children}
      {/* </CategoryDispatchContext.Provider> */}
    </CategoryContext.Provider>
  );
}
