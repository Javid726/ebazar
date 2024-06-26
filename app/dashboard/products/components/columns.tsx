'use client';

import { ColumnDef } from '@tanstack/react-table';

import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  id: number;
  name: string;
  price: string;
  discount_price: string;
  quantity: number;
  description: string;
  parent_id: number;
  vendor_id: number;
};

// Define the type of your custom props
type CustomColumnProps = {
  customProps?: {
    // Define your custom props here
    onEditProduct: (product: Product) => void;
    // Add other custom props if needed
  };
};

// Extend ColumnDef with CustomColumnProps
export type CustomColumnDef<T> = ColumnDef<T> & CustomColumnProps;

export const columns: CustomColumnDef<Product & CustomColumnProps>[] & {
  customProps?: any;
} = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Məhsulun adı
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Qiymət',
  },
  {
    accessorKey: 'quantity',
    header: 'Sayı',
  },
  {
    accessorKey: 'discount_price',
    header: 'Endirimli qiyməti',
  },
  {
    accessorKey: 'description',
    header: 'Məhsul açıqlaması',
  },
  {
    id: 'actions',
    cell: ({ row, column }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Əməliyyatlar</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(String(product.id))}
            >
              ID-ni kopyala
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                column.columnDef.customProps.onEditProduct(product);
                column.columnDef.customProps.handleResetEdit();
              }}
            >
              Redaktə et
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                column.columnDef.customProps.handleOpen(product.id)
              }
            >
              Məhsulu sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
