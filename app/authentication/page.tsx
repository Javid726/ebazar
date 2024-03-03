'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Facebook } from 'lucide-react';
import { Loader2 } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
});

export default function LoginAccount() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    async function login() {
      setIsLoading(true);

      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
        // mode: 'no-cors',
      };
      const response = await fetch(
        'http://159.89.20.242/api/vendor/login',
        requestOptions,
      );
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('vendor_token', result.vendor_token);
        router.push('/dashboard');
        setIsLoading(false);
      } else {
        if (result.message) {
          toast.error(result.message, {});
        } else {
          toast.error('Daxil etdiyiniz məlumatlarda yanlışlıq var');
        }
        setIsLoading(false);
      }
    }

    login();
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <div className="w-full m-auto bg-white lg:max-w-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Sign in</CardTitle>
                <CardDescription className="text-center">
                  Enter your email and password to login
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
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
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Şifrə</FormLabel>
                        <FormControl>
                          <Input
                            id="password"
                            placeholder=""
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
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </CardFooter>
              <div className="relative mb-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="m-2">
                <Button variant="outline" className="w-full" type="button">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Facebook className="mr-2 h-4 w-4" />
                  )}{' '}
                  Facebook
                </Button>
              </div>

              <p className="mt-2 text-xs text-center text-gray-700 mb-2">
                Don&apos;t have an account?
                <Link
                  href="/register"
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
