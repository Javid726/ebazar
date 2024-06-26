'use client';

import { Button } from '@/components/ui/button';
import { useContext, useEffect, useState } from 'react';
import {
  CategoryContext,
  // CategoryDispatchContext,
} from '@/app/category-provider';
// import { CategoryDispatchContext } from '@/app/category-reducer';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { AlertDialogEl } from './components/AlertDialogEl';

const formSchema = z.object({
  category_name: z.string().min(1, { message: 'Bu xana boş qoyula bilməz' }),
  parent_id: z.string(),
  slug: z.string(),
  category_description: z.string(),
});

export default function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editedCategoryId, setEditedCategoryId] = useState('');
  const [deletedCategoryId, setDeletedCategoryId] = useState('');
  const { edit, handleResetEdit, handleSetEdit } = useContext(CategoryContext);
  const [renderPage, setRenderPage] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // const dispatch = useContext(CategoryDispatchContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_name: '',
      parent_id: '',
      slug: '',
      category_description: '',
    },
  });

  const handleGetEditedCategory = async (values: any) => {
    console.log('somehow I run here');
    const { id } = values;
    setEditedCategoryId(id);

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/categories/${id}`;
    const requestOptions = {
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('vendor_token')}`,
      },
    };

    const response = await fetch(url, requestOptions);
    const result = await response.json();

    const { name, description } = result[0];

    form.setValue('category_name', name);
    form.setValue('category_description', description);
  };

  const addCategory = (values: z.infer<typeof formSchema>) => {
    async function sendCategoryData() {
      setIsLoading(true);

      const slug = values.category_name.toLowerCase().trim().replace(' ', '_');

      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('vendor_token')}`,
        },
        body: JSON.stringify({
          name: values.category_name,
          parent_id: values.parent_id,
          description: values.category_description,
          slug: slug,
        }),
        // mode: 'no-cors',
      };

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/categories`,
          requestOptions,
        );
        const result = await response.json();

        if (response.ok) {
          setIsLoading(false);

          toast('Yeni kateqoriya əlavə edildi!', {
            action: {
              label: 'Ok',
              onClick: () => {
                setOpen(false);
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
              setOpen(false);
            },
          },
        });
        setIsLoading(false);
      }
    }

    async function editCategoryData() {
      setIsLoading(true);

      const slug = values.category_name.toLowerCase().trim().replace(' ', '_');

      const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('vendor_token')}`,
        },
        body: JSON.stringify({
          name: values.category_name,
          parent_id: values.parent_id,
          description: values.category_description,
          slug: slug,
        }),
        // mode: 'no-cors',
      };

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/categories/${editedCategoryId}`,
          requestOptions,
        );
        const result = await response.json();

        if (response.ok) {
          setIsLoading(false);

          toast('Kateqoriya uğurla yeniləndi!', {
            action: {
              label: 'Ok',
              onClick: () => {
                setOpen(false);
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
              setOpen(false);
            },
          },
        });
        setIsLoading(false);
      }
    }

    if (!edit) {
      sendCategoryData();
    } else {
      editCategoryData();
    }
  };

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/categories/${deletedCategoryId}`,
        requestOptions,
      );
      const result = await response.json();

      if (response.ok) {
        setIsLoading(false);

        toast('Kateqoriya uğurla silindi!', {
          action: {
            label: 'Ok',
            onClick: () => {
              setOpen(false);
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
            setOpen(false);
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
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/categories`,
          requestOptions,
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.log(error);
        setCategories([]);
      }
    };

    getData();
  }, [renderPage]);

  return (
    <div>
      <div className="my-2 flex justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Kateqoriyalar</h1>
        <Button
          type="button"
          className="mr-4 font-medium text-md"
          onClick={() => {
            form.reset();
            setOpen(true);
            handleSetEdit();
          }}
        >
          Kateqoriya əlavə et
        </Button>
      </div>
      <div className="mt-20">
        <DataTable
          columns={columns}
          data={categories}
          setOpen={setOpen}
          onEditCategory={handleGetEditedCategory}
          handleOpen={(id: any) => {
            setShowDeleteDialog(true);
            setDeletedCategoryId(id);
          }}
        />
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="h-4/5 px-10">
          <DrawerHeader className="m-0 p-0 mb-8">
            <DrawerTitle className="text-2xl">
              Kateqoriya əlavə edin
            </DrawerTitle>
            <DrawerDescription className="text-slate-400 text-sm">
              home - dashboard - categories
            </DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(addCategory)}
              className="grid grid-cols-2 grid-rows-3 gap-8"
            >
              <FormField
                control={form.control}
                name="category_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Kateqoriya adı</FormLabel>
                    <FormControl>
                      <Input
                        id="category_name"
                        placeholder=""
                        type="string"
                        autoCapitalize="none"
                        autoComplete="string"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Kateqoriya adını daxil etməyiniz mütləqdir, həmçinin
                      çalışın ki unikal ad daxil edəsiniz.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Ana kateqoriya</FormLabel>
                    <FormControl>
                      <Input
                        id="parent_id"
                        placeholder=""
                        type="string"
                        autoCapitalize="none"
                        autoComplete="string"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Kateqoriya açıqlaması
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        id="category_description"
                        placeholder=""
                        autoCapitalize="none"
                        autoComplete="string"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4 row-start-3">
                <Button type="submit" className="w-32" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Yadda saxla
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-32"
                  disabled={isLoading}
                  onClick={() => {
                    setOpen(false);
                    handleResetEdit();
                    // dispatch({ type: 'add_category', payload: { edit: 5 } });
                  }}
                >
                  Ləğv et
                </Button>
              </div>
            </form>
          </Form>
          <DrawerFooter className="m-0 p-0">
            <DrawerClose></DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <AlertDialogEl
        open={showDeleteDialog}
        handleClose={() => setShowDeleteDialog(false)}
        handleDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
}
