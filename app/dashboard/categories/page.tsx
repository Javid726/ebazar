'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
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

const formSchema = z.object({
  category_name: z.string().min(1, { message: 'Bu xana boş qoyula bilməz' }),
  parent_id: z.string(),
  slug: z.string(),
  category_description: z.string(),
});

export default function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_name: '',
      parent_id: '',
      slug: '',
      category_description: '',
    },
  });

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
          category_name: values.category_name,
          parent_id: values.parent_id,
          category_descriptin: values.category_description,
          slug: slug,
        }),
        // mode: 'no-cors',
      };

      try {
        const response = await fetch(
          'http://159.89.20.242/api/vendor/categories',
          requestOptions
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

    sendCategoryData();
  };

  return (
    <div>
      <div className="my-2 flex justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <Button
          type="button"
          className="mr-4 font-medium text-md"
          onClick={() => setOpen(true)}
        >
          Add Category
        </Button>
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
                  Əlavə et
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-32"
                  disabled={isLoading}
                  onClick={() => {
                    setOpen(false);
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
    </div>
  );
}
