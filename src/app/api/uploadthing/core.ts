import { createUploadthing, type FileRouter } from "uploadthing/next";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import {  pinecone } from "@/lib/pinecone";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/authOptions";

const f = createUploadthing();

const middleware = async () => {
  const session = await getAuthSession();
  const user = session?.user;

  if (!user || !user.id) throw new Error("Unauthorized");

  return { userId: user.id };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  const isFileExist = await db.tutor.findFirst({
    where: {
      key: file.key,
    },
  });

  if (isFileExist) return;

  const createdFile = await db.tutor.create({
    data: {
      key: file.key,
      name: file.name,
      userId: metadata.userId,
      url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
      uploadStatus: "PROCESSING",
    },
  });

  if(createdFile){
    await db.generation.create({
      data: {
        userId: metadata.userId,
        type: "tutor",
      },
    });
  }

  try {
    const response = await fetch(
      `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
    );

    const blob = await response.blob();

    const loader = new PDFLoader(blob);

    const pageLevelDocs = await loader.load();
    console.log(pageLevelDocs);

    const pagesAmt = pageLevelDocs.length;

    // vectorize and index entire document
    const pineconeIndex = pinecone.Index('byte-busters');
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

      await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
        pineconeIndex,
      });

      await db.tutor.update({
        data: {
          uploadStatus: 'SUCCESS',
        },
        where: {
          id: createdFile.id,
        },
      });
  } catch (err) {
    console.log(err);
    await db.tutor.update({
      data: {
        uploadStatus: "FAILED",
      },
      where: {
        id: createdFile.id,
      },
    });
  }
};

export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
