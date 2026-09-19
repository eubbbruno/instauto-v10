import { redirect } from "next/navigation";

// Alias: /parceiros (plural) → /parceiro (a landing de captação).
export default function ParceirosRedirect() {
  redirect("/parceiro");
}
