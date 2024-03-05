'use client';

import { ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  name: string;
  description: string;
  parent_id: number;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'name',
    header: 'Kateqoriya adı',
  },
  {
    accessorKey: 'description',
    header: 'Kateqoriya açıqlaması',
  },
];
