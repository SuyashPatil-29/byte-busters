import { getAuthSession } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const user = await db.user.findFirst({
      where: {
        id: session.user.id,
      },
      include: {
        generations: true,
        tutors: true,
        LanguageTranslators: true,
      },
    });
    if (user) return new Response(JSON.stringify(user), { status: 200 });
    return new Response("User not found", { status: 404 });
  } catch (error) {
    return new Response("Some problem occurred", { status: 500 });
  }
}
