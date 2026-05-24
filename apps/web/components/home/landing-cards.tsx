import Link from "next/link";
import { ArrowRight, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const cards = [
  {
    href: "/employees",
    title: "Employees",
    description: "Paginated directory with search, filters, and full CRUD.",
    icon: Users,
    iconClass: "bg-chart-2/15 text-chart-2",
    buttonVariant: "default" as const,
    cta: "Open employees",
  },
  {
    href: "/insights",
    title: "Insights",
    description:
      "Summary metrics, salary bands, and country or title drill-down.",
    icon: BarChart3,
    iconClass: "bg-chart-3/15 text-chart-3",
    buttonVariant: "secondary" as const,
    cta: "View insights",
  },
];

export function LandingCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map(
        ({
          href,
          title,
          description,
          icon: Icon,
          iconClass,
          buttonVariant,
          cta,
        }) => (
          <Card
            key={href}
            className="border-gradient transition-shadow hover:shadow-lg hover:shadow-primary/10"
          >
            <CardHeader>
              <div
                className={cn(
                  "mb-3 flex h-12 w-12 items-center justify-center rounded-xl",
                  iconClass,
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant={buttonVariant}>
                <Link href={href}>
                  {cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ),
      )}
    </div>
  );
}
