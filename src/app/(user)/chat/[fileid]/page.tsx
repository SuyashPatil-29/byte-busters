// // app/chat.tsx -- client component
// "use client";

// import { BotAvatar } from "@/components/app_components/avatars/BotAvatar";
// import { UserAvatar } from "@/components/app_components/avatars/UserAvatar";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";
// import { cn } from "@/lib/utils";
// import { ToastAction } from "@radix-ui/react-toast";
// import { useChat } from "ai/react";
// import { Loader2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import ReactMarkdown from "react-markdown";
// import { useQuery } from "react-query";

// export default function MyComponent({ params }: { params: { id: string } }) {
//   const router = useRouter();
//   const [pdfUrl, setPdfUrl] = useState("")
//   const {
//     messages,
//     input,
//     handleInputChange,
//     setMessages,
//     handleSubmit,
//   } = useChat({
//     api: `/api/chat/${params.id}/tutor`,
//     onError: (error) => {
//       toast({
//         title: "Uh oh something went wrong!",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });

//   const { data: tutors, isLoading } = useQuery({
//     queryKey: ["tutors", { id: params.id }],
//     queryFn: async (): Promise<any> => {
//       const res = await fetch(`/api/chat/${params.id}`);
//       if (!res.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const data = await res.json();
//       setPdfUrl(data.source)
//       return data;
//     },
//     onSuccess: (data) => {
//       if (data.messages.length) {
//         const initMessages = data.messages.map((message: any) => ({
//           id: message.id,
//           role: message.role as "assistant" | "system" | "user" | "function",
//           content: message.content,
//         }));
//         setMessages(initMessages);
//       }
//       else{
//         const initMessages = data.messages.map((message: any) => ({
//           id: message.id,
//           role: message.role as "assistant" | "system" | "user" | "function",
//           content: "Hello I am your AI assistant",
//         }));
//         setMessages(initMessages);
//       }
//     },
//     onError: (data) => {
//       toast({
//         title: "Uh oh, something went wrong!",
//         description: <p>There was an error loading the AI tutor.</p>,
//         variant: "destructive",
//         action: (
//           <ToastAction altText="Try again" onClick={() => router.refresh()}>
//             Try again
//           </ToastAction>
//         ),
//       });
//     },
//   });

//   // const isValid = tutors && tutors.length > 0 && tutors.some((tutor: any) => tutor.id === params.id);

//   // if (!isValid) {
//   //   redirect("/chat"); // Redirect the user to "/chat"
//   // }

//   return (
//     <div className="w-3/5 mx-auto text-black">
//       {isLoading ? (
//         <div className="flex w-full justify-center py-8">
//           <Loader2 className="animate-spin" />
//         </div>
//       ) : (
//         tutors && (
//           <>
//             <div className="flex flex-col gap-y-4 mb-52 mt-10">
//               {messages.map((message) => (
//                 <div
//                   key={message.content}
//                   className={cn(
//                     "w-full flex",
//                     message.role === "user" ? "justify-end" : "justify-start"
//                   )}
//                 >
//                   <div className="flex items-center gap-x-4 border border-black/20 rounded-xl pl-4 p-4">
//                     {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
//                     <ReactMarkdown components={{
//                   pre: ({ node, ...props }) => (
//                     <div className="overflow-auto w-full my-2 bg-slate-800 text-white p-4 rounded-lg">
//                       <pre {...props} />
//                     </div>
//                   ),
//                   code: ({ node, ...props }:any) => (
//                     <code className="bg-slate-800 text-white md:p-2 p-1 rounded-lg" {...props} />
//                   )
//                 }} className="text-sm overflow-hidden leading-7">
//                   {message.content || ""}
//                 </ReactMarkdown>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="fixed inset-x-0 bottom-0 p-4 bg-background border-t shadow-sm">
//               <form
//                 onSubmit={handleSubmit}
//                 className="flex flex-row gap-2 max-w-xl mx-auto border rounded-lg p-4 ring-offset-background focus-within:ring-2 ring-offset-2 ring-ring"
//               >
//                 <textarea
//                   className="resize-none flex-1 overflow-hidden text-sm text-black font-medium focus:outline-none"
//                   onChange={handleInputChange}
//                   value={input}
//                   spellCheck
//                   rows={2}
//                   placeholder="Send a message..."
//                 />
//                 <Button type="submit">Send </Button>
//               </form>
//             </div>
//           </>
//         )
//       )}
//     </div>
//   );
// }

import ChatWrapper from '@/components/chat/ChatWrapper'
import PdfRenderer from '@/components/pdfRenderer'
import { getAuthSession } from '@/lib/authOptions'
import { db } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

interface PageProps {
  params: {
    fileid: string
  }
}

const Page = async ({ params }: PageProps) => {
  
  const { fileid } = params

  const session = await getAuthSession()
  const user = session?.user

  if (!user || !user.id)
    redirect(`/auth-callback?origin=dashboard/${fileid}`)

  const file = await db.tutor.findFirst({
    where: {
      id: fileid,
      userId: user.id,
    },
  })

  if (!file) notFound()

  return (
    <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
      <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
        {/* Left sidebar & main wrapper */}
        <div className='flex-1 xl:flex'>
          <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
            {/* Main area */}
            <PdfRenderer url={file.url} />
          </div>
        </div>

        <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
          <ChatWrapper fileId={file.id}/>
        </div>
      </div>
    </div>
  )
}

export default Page