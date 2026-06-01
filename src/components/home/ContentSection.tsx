import { Card } from "@/components/ui/Card";

export function ContentSection({
  id,
  title,
  description,
  items,
  variant = "light",
}: {
  id: string;
  title: string;
  description: string;
  items?: string[];
  variant?: "light" | "soft";
}) {
  return (
    <section
      id={id}
      className={`section-padding ${variant === "soft" ? "bg-surface-soft" : "bg-warm-white"}`}
    >
      <div className="section-container max-w-4xl">
        <h2 className="font-display text-3xl font-bold md:text-4xl">{title}</h2>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">
          {description}
        </p>
        {items && items.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <Card key={item} padding="sm">
                <p className="text-sm font-medium text-medical-blue">{item}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
