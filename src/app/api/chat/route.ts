import { getAuthSession } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    const session = await getAuthSession();
    if (!session)
      return NextResponse.json({ error: "Unauthorized request", status: 401 });
  
    const tutors = await db.tutor.findMany({
      where: {
        userId: session.user.id,
      },
    });
  
    return NextResponse.json(tutors);
  }

// export default async function GET(){
//     try {
//         const session = await getAuthSession()
//         if(!session) return new Response("Unauthorized", {status: 401})

//         const tutors = await db.tutor.findMany({
//             where : {
//                 id : session.user.id
//             }
//         })

//         if(!tutors) return new Response("No tutors found", {status: 400})
//         return new Response(JSON.stringify(tutors), {status: 200})
        
//     } catch (error) {
//         return new Response(JSON.stringify(error), {status: 500})
//     }
// }