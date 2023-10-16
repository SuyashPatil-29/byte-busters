"use client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ErrorAlert } from "@/components/alerts/ErrorAlert";
import { SearchAlert } from "@/components/alerts/SearchAlert";
import { EmptyAlert } from "@/components/alerts/EmptyAlert";
import { ListCard } from "@/components/cards/ListCard";
import { LoadingCards } from "@/components/cards/LoadingCard";


import { Tutor } from "@prisma/client";
import FileUpload from "@/components/FileUpload";


export default function TutorsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const { data: tutors, isLoading: tutorsLoading } = useQuery({
    queryKey: ["tutors"],
    queryFn: async (): Promise<Tutor[]> => {
      const res = await fetch("/api/chat");

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      return data;
    },
    onError: () => {
      toast({
        title: "Uh oh, something went wrong!",
        description: <p>There was an error loading your AI tutors.</p>,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again" onClick={() => router.refresh()}>
            Try again
          </ToastAction>
        ),
      });
    },
  });

  return (
    <div className="flex-1 px-4 py-10 md:py-16 max-w-5xl xl:max-w-6xl mx-auto w-full flex flex-col">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold">File Chat</h1>
        <p className="text-muted-foreground font-medium">
          Create and manage your Files.
        </p>
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search Files"
        />
        <FileUpload />
      </div>
      <div className="mt-6">
        {tutorsLoading ? (
          <LoadingCards />
        ) : tutors ? (
          tutors.length === 0 || tutors.length === undefined ? (
            <EmptyAlert />
          ) : (
            <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
              {tutors.filter((tutor) =>
                tutor.name.toLowerCase().includes(search.toLowerCase()),
              ).length !== 0 ? (
                tutors
                  .filter((tutor) =>
                    tutor.name.toLowerCase().includes(search.toLowerCase()),
                  ).reverse()
                  .map((tutor) => (
                    <ListCard
                      key={tutor.id}
                      title={tutor.name}
                      description={tutor.description ? tutor.description : "No description available"}
                      link={`/chat/${tutor.id}`}
                      itemType="Tutor"
                      date={new Date(tutor.createdAt)}
                    />
                  ))
              ) : (
                <SearchAlert />
              )}
            </div>
          )
        ) : (
          <ErrorAlert />
        )}
      </div>
    </div>
  );
}