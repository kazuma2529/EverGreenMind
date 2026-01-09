import { SignpostsTab } from '@/components/tabs/SignpostsTab';

export default function SignpostsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
        未来への道標
      </h1>
      <SignpostsTab />
    </div>
  );
}
