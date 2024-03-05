import { Separator } from '@/components/ui/separator';
import { Sidebar } from './sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>DashboarddiSS</div>
    </ProtectedRoute>
  );
}
