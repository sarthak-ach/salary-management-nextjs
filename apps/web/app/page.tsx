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

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          HR salary management
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Manage employee records and explore salary insights across countries
          and job titles. Built for teams managing large workforces.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <Users className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Employees</CardTitle>
            <CardDescription>
              Paginated directory with search, filters, and full CRUD.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/employees">
                Open employees
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BarChart3 className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Insights</CardTitle>
            <CardDescription>
              Summary metrics, salary bands, and country or title drill-down.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/insights">
                View insights
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
