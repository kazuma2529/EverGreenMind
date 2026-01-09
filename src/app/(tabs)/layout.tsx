import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { UserMenu } from '@/components/auth/UserMenu';

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen pb-20">
        <header className="sticky top-0 z-30 border-b border-[var(--glass-border)] bg-[var(--glass-bg)]/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 md:px-8">
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">
              EverGreenMind
            </h1>
            <UserMenu />
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-12">
          {children}
        </main>
        <BottomNavigation />
      </div>
    </AuthGuard>
  );
}
