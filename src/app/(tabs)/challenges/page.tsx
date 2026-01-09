import { ChallengesList } from '@/components/tabs/ChallengesList';

export default function ChallengesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
        挑戦したいこと
      </h1>
      <ChallengesList />
    </div>
  );
}
