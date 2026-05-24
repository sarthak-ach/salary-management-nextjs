import { LandingCards } from "@/components/home/landing-cards";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-8 sm:p-10">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-chart-3/20 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-chart-2/20 blur-3xl" />
        <div className="relative space-y-4">
          <p className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            HR Platform
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-gradient">Salary management</span>
            <span className="text-foreground"> for modern teams</span>
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Manage employee records and explore salary insights across countries
            and job titles. Built for teams managing large workforces.
          </p>
        </div>
      </section>

      <LandingCards />
    </div>
  );
}
