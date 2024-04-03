'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialogEl } from '../categories/components/AlertDialogEl';
import { useContext, useEffect, useState } from 'react';
import { CategoryContext } from '@/app/category-provider';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import EmptyProducts from './components/EmptyProducts';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [renderPage, setRenderPage] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletedProductId, setDeletedProductId] = useState('');
  // const [editedProductId, setEditedProductId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [editedProductDetails, setEditedProductDetails] = useState({
  //   name: '',
  //   description: '',
  //   price: '',
  //   discount_price: '',
  //   quantity: null,
  //   sku: '',
  //   vendor_id: null,
  //   category_id: null,
  // }); // fuck I couldn't find proper name for this jackass

  const { getCategories, handleGetEditedProduct, editedProductDetails } =
    useContext(CategoryContext);

  const handleDeleteCategory = async () => {
    setIsLoading(true);

    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('vendor_token')}`,
      },
      // mode: 'no-cors',
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/products/${deletedProductId}`,
        requestOptions,
      );
      const result = await response.json();

      if (response.ok) {
        setIsLoading(false);

        toast('Məhsul uğurla silindi!', {
          action: {
            label: 'Ok',
            onClick: () => {
              // setOpen(false);
            },
          },
        });
        setRenderPage(prevValue => !prevValue);
      } else {
        if (result.message) {
          toast.error(result.message, {});
        } else {
          toast.error('Daxil etdiyiniz məlumatlarda yanlışlıq var');
        }
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('Gözlənilməyən xəta yarandı.', {
        description: 'Zəhmət olmasa başqa vaxt yenidən cəhd edin..',
        action: {
          label: 'Ok',
          onClick: () => {
            // setOpen(false);
          },
        },
      });
      setIsLoading(false);
    }

    setShowDeleteDialog(false);
  };

  // const handleGetEditedProduct = async (editedProduct: any) => {
  //   const { productId } = editedProduct;
  //   setEditedProductId(productId);

  //   const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/products/${productId}`;
  //   const requestOptions = {
  //     headers: {
  //       'Content-type': 'application/json',
  //       Accept: 'application/json',
  //       Authorization: `Bearer ${localStorage.getItem('vendor_token')}`,
  //     },
  //   };

  //   const response = await fetch(url, requestOptions);
  //   const result = await response.json();

  //   const {
  //     name,
  //     description,
  //     price,
  //     discount_price,
  //     category_id,
  //     quantity,
  //     sku,
  //     vendor_id,
  //   } = result[0];

  //   setEditedProductDetails({
  //     name,
  //     description,
  //     price,
  //     discount_price,
  //     category_id,
  //     quantity,
  //     sku,
  //     vendor_id,
  //   });
  //   // form.setValue('category_name', name);
  //   // form.setValue('category_description', description);
  // };

  useEffect(() => {
    const getData = async () => {
      const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('vendor_token')}`,
        },
      };
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/products`,
          requestOptions,
        );
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.log(error);
        setProducts([]);
      }
    };

    getData();
  }, [renderPage]);

  return (
    <div>
      <div className="my-2 flex justify-between">
        {products.length !== 0 && (
          <>
            <h1 className="text-2xl font-semibold tracking-tight">Məhsullar</h1>
            <Link href="/dashboard/products/add-product">
              <Button
                type="button"
                className="mr-4 font-medium text-md"
                onClick={getCategories}
              >
                Məhsul əlavə et
              </Button>
            </Link>
          </>
        )}
      </div>
      <div className="mt-20">
        {products.length === 0 ? (
          <EmptyProducts />
        ) : (
          <DataTable
            data={products}
            columns={columns}
            onEditProduct={product => handleGetEditedProduct(product)}
            handleOpen={(id: any) => {
              setShowDeleteDialog(true);
              setDeletedProductId(id);
            }}
          />
        )}
      </div>
      <AlertDialogEl
        open={showDeleteDialog}
        handleClose={() => setShowDeleteDialog(false)}
        handleDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
}
