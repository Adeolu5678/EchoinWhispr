import { Skeleton } from '@/components/ui/skeleton';

export default function LegalLoading() {
  return (
    <article className="legal-document">
      <div className="flex items-center gap-4 mb-10">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {[...Array(4)].map((_, i) => (
        <section key={i} className="legal-section">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </section>
      ))}
    </article>
  );
}
