import { ConsciousnessList } from '@/components/tabs/ConsciousnessList';

export default function ConsciousnessPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
        一貫して意識を向けること
      </h1>
      <ConsciousnessList />
    </div>
  );
}
