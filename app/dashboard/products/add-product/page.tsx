'use client';

import BreadCrumbEl from './BreadCrumb';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Asterisk } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CategoryContext } from '@/app/category-provider';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Bu xana boş qoyula bilməz' }),
  description: z.string().optional(),
  price: z.string().min(1, { message: 'Bu xana boş qoyula bilməz' }),
  discount_price: z.string(),
  category_id: z.string(),
  quantity: z.string(),
  sku: z.string(),
});

export default function AddProduct() {
  const { categories, editedProductDetails, editedProductId, productEdit } =
    useContext(CategoryContext);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      discount_price: '',
      category_id: '',
      quantity: '',
      sku: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsLoading(true);

    const requestOptions: RequestInit = {
      method: productEdit ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('vendor_token')}`,
      },
      body: JSON.stringify({
        name: values.name,
        description: values.description,
        price: Number(values.price),
        discount_price: Number(values.discount_price),
        category_id: Number(values.category_id),
        quantity: Number(values.quantity),
        option_name: 'size?',
        sku: values.sku,
      }),
      // mode: 'no-cors',
    };

    try {
      let response: any;
      if (!productEdit) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/products`,
          requestOptions,
        );
      } else {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/products/${editedProductId}`,
          requestOptions,
        );
      }

      const result = await response.json();

      if (response.ok) {
        setIsLoading(false);

        toast('Yeni məhsul əlavə edildi!', {
          action: {
            label: 'Ok',
            onClick: () => {
              router.push('/dashboard/products');
            },
          },
        });
        form.reset();
      } else {
        if (result.message) {
          toast.error(result.message, {});
        } else {
          toast.error('Daxil etdiyiniz məlumatlarda yanlışlıq var');
        }
        setIsLoading(false);
        form.reset();
      }
    } catch (error) {
      toast.error('Gözlənilməyən xəta yarandı.', {
        description: 'Zəhmət olmasa başqa vaxt yenidən cəhd edin..',
        action: {
          label: 'Ok',
          onClick: () => {
            form.reset();
          },
        },
      });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    form.setValue('name', editedProductDetails.name);
    form.setValue('description', editedProductDetails.description);
    form.setValue('category_id', editedProductDetails.category_id);
    form.setValue('price', editedProductDetails.price);
    form.setValue('discount_price', editedProductDetails.discount_price);
    form.setValue('quantity', editedProductDetails.quantity);
    form.setValue('sku', editedProductDetails.sku);
  }, [editedProductDetails]);

  return (
    <main>
      <BreadCrumbEl />
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Əsas məlumatlar</CardTitle>
              </CardHeader>
              {/* <Separator /> */}
              <CardContent>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="relative">
                        Məhsulun adı{' '}
                        <Asterisk
                          className="absolute top-0 -right-4 text-slate-500"
                          size={14}
                        />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>Məhsulun təsviri</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-16 mt-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="relative">
                          Qiyməti{' '}
                          <Asterisk
                            className="absolute top-0 -right-4 text-slate-500"
                            size={14}
                          />
                        </FormLabel>
                        <FormControl className="w-[300px]">
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endirimli qiyməti</FormLabel>
                        <FormControl className="w-[300px]">
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sayı</FormLabel>
                        <FormControl className="w-[300px]">
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-10 w-full">
              <Card className="mt-5 flex-1">
                <CardHeader>
                  <CardTitle>Kateqoriya</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kateqoriya</FormLabel>
                        <FormControl className="w-[300px]">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-[300px]">
                              <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category: any) => {
                                return (
                                  <SelectItem
                                    value={String(category.id)}
                                    key={category.id}
                                  >
                                    {category.name}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className="mt-5 flex-1">
                <CardHeader>
                  <CardTitle>İnventar</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl className="w-[300px]">
                          <Input {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <Link href="/dashboard/products">
              <Button type="button" variant="secondary" className="w-32 mr-4">
                Ləğv et
              </Button>
            </Link>
            <Button type="submit" className="w-32" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yadda saxla
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
