'use client';

import { createContext, useReducer, useState } from 'react';
import { initialCategory, categoryReducer } from './category-reducer';

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
  handleSetEdit: () => {
    console.log('whatt?');
  },
  handleResetEdit: () => {},
});
// export const CategoryDispatchContext = createContext(null);

export default function CategoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categoryEdit, dispatch] = useReducer(categoryReducer, initialCategory);
  const [edit, setEdit] = useState(true);

  const handleSetEdit = () => setEdit(false);
  const handleResetEdit = () => setEdit(true);

  const context = {
    edit,
    handleSetEdit,
    handleResetEdit,
  };

  return (
    <CategoryContext.Provider value={context}>
      {/* <CategoryDispatchContext.Provider value={{ categoryEdit, dispatch }}> */}
      {children}
      {/* </CategoryDispatchContext.Provider> */}
    </CategoryContext.Provider>
  );
}
