'use client';

import { cn } from '@/lib/utils';
import { Loader2, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Bu xana mütləq doldurulmalıdır.' })
    .email('Düzgün email ünvanı deyil!'),
  password: z
    .string()
    .min(6, { message: 'Ən azı 6 simvoldan ibarət olmalıdır' }),
  store_name: z.string().min(1, { message: 'Bu xana mütləq doldurulmalıdır.' }),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      store_name: '',
    },
  });

  // async function onSubmit(event: React.SyntheticEvent) {
  //   event.preventDefault();
  //   setIsLoading(true);

  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 3000);
  // }

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    console.log(values);

    async function createProfile() {
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          store_name: values.store_name,
        }),
        // mode: 'no-cors',
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/register`,
        requestOptions,
      );

      const result = await response.json();

      console.log(result);

      if (response.ok) {
        localStorage.setItem('vendor_token', result.vendor_token);
        router.push('/dashboard');
        setIsLoading(false);
      } else {
        toast.error(result.message, {});
        setIsLoading(false);
      }
    }

    createProfile();

    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 3000);

    console.log(values);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="name@example.com"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Şifrə</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        placeholder="Password"
                        type="password"
                        autoCapitalize="none"
                        autoComplete="password"
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
                name="store_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Mağaza adı</FormLabel>
                    <FormControl>
                      <Input
                        id="store"
                        placeholder="Mağaza adı"
                        type="text"
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
            </div>
            <Button disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In with Email
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Facebook className="mr-2 h-4 w-4" />
        )}{' '}
        Facebook
      </Button>
    </div>
  );
}
