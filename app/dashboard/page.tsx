import { Separator } from '@/components/ui/separator';
import { Sidebar } from './sidebar';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex gap-2">
      <aside className="w-[200px]">
        <Sidebar />
      </aside>
      <Separator orientation="vertical" />
      <div className="grow rounded-lg bg-background shadow-lg border m-3 p-3 ">
        DashboarddiSS
      </div>
    </div>
  );
}
