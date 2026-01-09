import { ValuesTab } from '@/components/tabs/ValuesTab';

export default function ValuesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
        価値観と自分軸
      </h1>
      <ValuesTab />
    </div>
  );
}
