"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Inbox, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { pdfjs } from "react-pdf";
import * as z from "zod";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FormSchema = z.object({
  language: z.string({
    required_error: "Please select a Language",
  }),
});

export default function SelectForm() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [uploading, setUploading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const [translatedTextFromFile, setTranslatedTextFromFile] = useState("");

  const formSchema = z.object({
    language: z.string(),
  });

  const form1 = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmitForm1 = async (data: z.infer<typeof FormSchema>) => {
    const response = axios
      .post(
        "https://translation.googleapis.com/language/translate/v2",
        {},
        {
          params: {
            q: search,
            target: data.language,
            key: "AIzaSyCwwqTBMDZexB6eudo6ZlLIUx_JVqKgyTg",
          },
        }
      )
      .then((response) => {
        setTranslatedTextFromFile("")
        setConvertedText(response.data.data.translations[0].translatedText);
      })
      .catch((err) => {
        console.log("rest api error", err);
      });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { getInputProps, getRootProps } = useDropzone({
    accept: {
      "application/pdf": ["pdf"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFile) => {
      let file = acceptedFile[0];
      if (file.type === "application/pdf") {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          let res = fileReader.result;
          extractPdfText(res as string);
        };
      }
    },
  });

  async function extractPdfText(url: string) {
    const pdf = await pdfjs.getDocument(url).promise;
    let pages = pdf.numPages;
    for (let i = 1; i <= pages; i++) {
      let page = await pdf.getPage(i);
      let txt = await page.getTextContent();
      // @ts-ignore
      let text = txt.items.map((s) => s.str).join("");
      setPdfText(text);
    }
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    let key = "d7fd2e143990470bbd79af1b77689a34";
    let endpoint = "https://api.cognitive.microsofttranslator.com";

    // location, also known as region.
    // required if you're using a multi-service or regional (not global) resource. It can be found in the Azure portal on the Keys and Endpoint page.
    let location = "southeastasia";

    axios({
      baseURL: endpoint,
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        // location required if you're using a multi-service or regional (not global) resource.
        "Ocp-Apim-Subscription-Region": location,
        "Content-type": "application/json",
      },
      params: {
        "api-version": "3.0",
        from: "en",
        to: data.language,
      },
      data: [
        {
          text: pdfText,
        },
      ],
      responseType: "json",
    }).then(function (response) {
      setConvertedText("")
      setTranslatedTextFromFile(
        JSON.stringify(response.data[0].translations[0].text)
      );
      console.log(translatedTextFromFile);
    });
  };

  return (
    <div className="flex-1 px-4 py-10 md:py-16 max-w-5xl xl:max-w-6xl mx-auto w-full flex flex-col">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold">Language Translator</h1>
        <p className="text-muted-foreground font-medium">
          Choose a language to translate your text.
        </p>
      </div>
      <div className="flex space-x-3 mt-4 items-start">
        <Textarea
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="resize-none pr-12 text-base scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex-1 lg:min-w-[840px]"
          placeholder="Enter your text to translate"
          rows={1}
          maxRows={3}
          minRows={3}
          autoFocus
        />
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Form {...form1}>
              <form
                onSubmit={form.handleSubmit(onSubmitForm1)}
                className="space-y-6 relative"
                id="language-input"
              >
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-20 md:min-w-[180px]">
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="mr">Marathi</SelectItem>
                          <SelectItem value="bn">Bengali</SelectItem>
                          <SelectItem value="gu">Gujarati</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                          <SelectItem value="te">Telugu</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <Button form="language-input" type="submit">
              Submit
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Upload document instead</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload a file</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 relative"
                  id="language-input"
                >
                  <div className=" pr-4 bg-white w-[400px] rounded-xl">
                    <div
                      {...getRootProps({
                        className:
                          "border-dashed border-2 rounded-xl cursor-pointer bg-gray-200 border-blue-500 py-8 flex justify-center items-center flex-col",
                      })}
                    >
                      <Input {...getInputProps()} />
                      {uploading && isLoading ? (
                        <>
                          {/* loading state */}
                          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                          <p className="mt-2 text-sm text-slate-400">
                            Spilling Tea to GPT...
                          </p>
                        </>
                      ) : (
                        <>
                          <Inbox className="w-10 h-10 text-blue-500" />
                          <p className="mt-2 text-sm text-slate-400">
                            {uploading && "Drop PDF Here"}{" "}
                            {!uploading && "File uploaded successfully"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 mr-4">
                    <DialogDescription>Choose a language</DialogDescription>
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select Language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hi">Hindi</SelectItem>
                              <SelectItem value="mr">Marathi</SelectItem>
                              <SelectItem value="bn">Bengali</SelectItem>
                              <SelectItem value="gu">Gujarati</SelectItem>
                              <SelectItem value="ta">Tamil</SelectItem>
                              <SelectItem value="te">Telugu</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mt-10">
        <h1 className="text-3xl font-bold">Translated Text</h1>
        <p className="text-muted-foreground font-medium">
          Translated text will appear below
        </p>
        {(translatedTextFromFile || convertedText) && (
          <Card className="mt-4 mx-3 p-5 font-medium">
            {translatedTextFromFile}
            {convertedText}
          </Card>
        )}
      </div>
    </div>
  );
}
