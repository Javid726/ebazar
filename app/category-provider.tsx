'use client';

import { createContext, useReducer, useState } from 'react';
import { initialCategory, categoryReducer } from './category-reducer';
import { toast } from 'sonner';

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
  categories: [],
  handleSetEdit: () => {
    console.log('whatt?');
  },
  handleResetEdit: () => {},
  getCategories: () => {},
});
// export const CategoryDispatchContext = createContext(null);

export default function CategoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categoryEdit, dispatch] = useReducer(categoryReducer, initialCategory);
  const [edit, setEdit] = useState(true);
  const [categories, setCategories] = useState([]);

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

  const context = {
    edit,
    categories,
    handleSetEdit,
    handleResetEdit,
    getCategories,
  };

  return (
    <CategoryContext.Provider value={context}>
      {/* <CategoryDispatchContext.Provider value={{ categoryEdit, dispatch }}> */}
      {children}
      {/* </CategoryDispatchContext.Provider> */}
    </CategoryContext.Provider>
  );
}
