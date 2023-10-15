import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function EmptyAlert() {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Oops</AlertTitle>
      <AlertDescription>
        There is nothing here! Try clicking the {"Add New..."} button to add some
        items.
      </AlertDescription>
    </Alert>
  );
}