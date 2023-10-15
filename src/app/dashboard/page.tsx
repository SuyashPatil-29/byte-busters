"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { LanguageTranslator, Tutor, User } from "@prisma/client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowRight, MessagesSquare, Languages } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios"

const cards = [
  {
    title: "File Chat",
    icon: <MessagesSquare className="h-4 w-4 mr-2" />,
    description: "Talk to your files by simply uploading them",
    href: "/chat",
  },
  {
    title: "Language Translator",
    icon: <Languages className="h-4 w-4 mr-2" />,
    description: "Translate text from one language to another",
    href: "/language-translator",
  },
];

function HomePage() {
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<any> => {
      const {data} = await axios.get("api/validate");
      return data;
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading the dashboard.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      });
    },
  });

  console.log(user);
  

  return (
    <div className="h-full w-full">
      <main className="flex-1 px-4 py-10 md:py-16 max-w-4xl xl:max-w-6xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col space-y-1">
          <h1 className="text-3xl text-black font-bold">Dashboard</h1>
          <p className=" text-gray-800 font-medium">
            Welcome back{" "}
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              user?.name
            )}
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Monthly Generations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {isLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    user?.generations.length
                  )}{" "}
                  / 25
                </p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Pro plan coming soon...
                </p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Generations Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="flex flex-col space-y-4">
                    {Array(3)
                      .fill("")
                      .map((s, i) => (
                        <Skeleton
                          className={cn(
                            "h-4",
                            i == 0 ? "w-4/5" : i == 1 ? "w-3/5" : "w-2/5"
                          )}
                          key={i}
                        />
                      ))}
                  </div>
                ) : (
                  <ul className="flex flex-col space-y-2 text-muted-foreground">
                    <li>
                      <Link href="/languageTranslator">
                        {
                          user.generations.filter(
                            (generation: any) => generation.type == "code-generator"
                          ).length
                        }{" "}
                        Code Generators
                      </Link>
                    </li>
                    <Separator />
                    <li>
                      <Link href="/quizzes">
                        {
                          user.generations.filter(
                            (generation: any) => generation.type == "books"
                          ).length
                        }{" "}
                        Books
                      </Link>
                    </li>
                    <Separator />
                    <li>
                      <Link href="/chat">
                        {
                          user.generations.filter(
                            (generation: any) => generation.type == "tutor"
                          ).length
                        }{" "}
                        Files
                      </Link>
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {cards.map((card, index) => (
              <Link
                href={card.href}
                key={index}
                className="hover:opacity-70 duration-500"
              >
                <Card className="flex justify-between items-center h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {card.icon}
                      {card.title}
                    </CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="flex-1 grid md:grid-cols-2 gap-4">
            <Card className="relative pb-14">
              <CardHeader>
                <CardTitle>Recent file uploads</CardTitle>
                <CardDescription>
                  Here are some of the files you uploaded recently.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  {isLoading ? (
                    <>
                      {Array(3)
                        .fill("")
                        .map((s, i) => (
                          <div className="flex flex-col space-y-2" key={i}>
                            <Skeleton className="h-4 w-5/5" />
                            <Skeleton className="h-4 w-4/5" />
                          </div>
                        ))}
                    </>
                  ) : (
                    user && (
                      <>
                        {" "}
                        {user.tutors
                          .slice(-3)
                          .reverse()
                          .map((tutor: Tutor) => (
                            <Link key={tutor.id} href={`/chat/${tutor.id}`}>
                              {" "}
                              <Card className=" border-muted-foreground/60">
                                {" "}
                                <CardTitle className="text-lg underline">
                                  {tutor.name}
                                </CardTitle>{" "}
                                <CardDescription>
                                  {" "}
                                  {tutor.description ? tutor.description : "No description provided"}{" "}
                                </CardDescription>{" "}
                              </Card>{" "}
                            </Link>
                          ))}{" "}
                      </>
                    )
                  )}
                </div>
              </CardContent>
              <CardFooter className="absolute bottom-0">
                <Link href="/flashcard=sets">
                  <Button variant="ghost">
                    {" "}
                    View all <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <div className="flex-1 grid gap-4">
              <Card className="relative pb-14">
                <CardHeader>
                  <CardTitle>Recent Translations</CardTitle>
                  <CardDescription>
                    Some of the Codes you generated recently.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-6">
                    {isLoading ? (
                      <>
                        {Array(3)
                          .fill("")
                          .map((s, i) => (
                            <div className="flex flex-col space-y-2" key={i}>
                              <Skeleton className="h-4 w-5/5" />
                              <Skeleton className="h-4 w-4/5" />
                            </div>
                          ))}
                      </>
                    ) : (
                      user && (
                        <>
                          {" "}
                          {user.LanguageTranslators
                            .slice(-1)
                            .reverse()
                            .map((languageTranslator: LanguageTranslator) => (
                              <Link key={languageTranslator.id} href={`/language-translator/${languageTranslator.id}`}>
                                {" "}
                                <Card className=" border-muted-foreground/60">
                                  {" "}
                                  <CardTitle className="text-lg underline">
                                    {languageTranslator.language}
                                  </CardTitle>{" "}
                                </Card>{" "}
                              </Link>
                            ))}{" "}
                        </>
                      )
                    )}
                  </div>
                </CardContent>
                <CardFooter className="absolute bottom-0">
                  <Link href="/tutors">
                    <Button variant="ghost">
                      {" "}
                      View all <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
