export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
      <p className="mt-3 text-muted">This page is coming soon.</p>
    </div>
  );
}
