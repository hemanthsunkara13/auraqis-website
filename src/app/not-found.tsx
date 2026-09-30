import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="on-dark relative flex min-h-svh items-center bg-charcoal text-ivory">
      <div aria-hidden className="blueprint-grid absolute inset-0 text-ivory opacity-60" />
      <div className="shell relative">
        <p className="label text-sage-light">404 — Not found</p>
        <h1 className="display mt-8 fs-page-title">
          This space is <span className="serif-accent">still on the drawing board.</span>
        </h1>
        <div className="mt-12 flex flex-wrap gap-4">
          <ButtonLink href="/" tone="light">Back home</ButtonLink>
          <ButtonLink href="/projects" variant="outline" tone="light">View projects</ButtonLink>
        </div>
      </div>
    </section>
  );
}
