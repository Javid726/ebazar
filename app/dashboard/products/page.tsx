'use client';

import { Button } from '@/components/ui/button';
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
  const [deletedCategoryId, setDeletedCategoryId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/products/${deletedCategoryId}`,
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
        <h1 className="text-2xl font-semibold tracking-tight">Məhsullar</h1>
        <Link href="/dashboard/products/add-product">
          <Button type="button" className="mr-4 font-medium text-md">
            Məhsul əlavə et
          </Button>
        </Link>
      </div>
      <div className="mt-20">
        {/* <EmptyProducts /> */}
        <DataTable
          data={products}
          columns={columns}
          onEditProduct={() => console.log('stick to the carate')}
          handleOpen={(id: any) => {
            setShowDeleteDialog(true);
            setDeletedCategoryId(id);
          }}
        />
      </div>
      <AlertDialogEl
        open={showDeleteDialog}
        handleClose={() => setShowDeleteDialog(false)}
        handleDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
}
