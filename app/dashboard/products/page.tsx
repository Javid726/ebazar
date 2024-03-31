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

import EmptyProducts from './components/EmptyProducts';

export default function ProductsPage() {
  return (
    <div>
      <div className="my-2 flex justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Məhsullar</h1>
        {/* <Button
        type="button"
        className="mr-4 font-medium text-md"
        onClick={() => {
          Form.reset();
          setOpen(true);
          handleSetEdit();
        }}
      >
        Kateqoriya əlavə et
      </Button> */}
      </div>
      <div className="mt-20">
        <EmptyProducts />
      </div>
    </div>
  );
}
