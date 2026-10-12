import TransitionLink from "@/components/TransitionLink";

export default function NotFound() {
  return (
    <main className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-surface shadow-2xl">
        <span className="font-display text-4xl font-bold text-acid">404</span>
      </div>
      <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-sm text-mute">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8">
        <TransitionLink href="/" className="btn-primary">
          Back to home <span aria-hidden>→</span>
        </TransitionLink>
      </div>
    </main>
  );
}
