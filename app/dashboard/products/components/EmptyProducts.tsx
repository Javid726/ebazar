import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useContext } from 'react';
import { CategoryContext } from '@/app/category-provider';

export default function EmptyProducts() {
  const { getCategories } = useContext(CategoryContext);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-[600px]">
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Əlavə etdiyiniz heç bir məhsul yoxdur
          </h3>
          <p className="text-sm text-muted-foreground">
            Məhsulları əlavə etdiyiniz andan satışa başlaya bilərsiniz.
          </p>
          <Link href="/dashboard/products/add-product">
            <Button className="mt-4" onClick={getCategories}>
              Məhsul əlavə et
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
