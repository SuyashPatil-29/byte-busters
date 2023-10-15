import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { daysAgo } from "@/lib/days-ago";

export function ListCard({
  title,
  description,
  link,
  itemType,
  date,
}: {
  title: string;
  description?: string;
  link: string;
  itemType: "CodeGenerator" | "Flashcards" | "Tutor";
  date: Date;
}) {
  return (
    <Card className="relative flex flex-col justify-between hover:opacity-70 duration-500 md:min-h-[175px]">
      <CardHeader>
        <Link href={link}>
          <CardTitle>{title || "Untitled" + itemType}</CardTitle>
        </Link>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <time className="text-xs text-muted-foreground">{daysAgo(date)}</time>
      </CardFooter>
      <Link href={link} className="absolute inset-0" />
    </Card>
  );
}