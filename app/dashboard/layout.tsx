import { Sidebar } from './sidebar';
import { Separator } from '@/components/ui/separator';
// import StoreProvider from '../StoreProvider';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <StoreProvider>
    <div className="min-h-screen flex gap-2">
      <aside className="w-[200px]">
        <Sidebar />
      </aside>
      <Separator orientation="vertical" />
      <div className="grow rounded-lg bg-background shadow-lg border m-3 p-3 ">
        {children}
      </div>
    </div>
    // </StoreProvider>
  );
}
