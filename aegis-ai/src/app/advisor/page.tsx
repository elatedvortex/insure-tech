import { Suspense } from "react";
import AdvisorClient from "./AdvisorClient";

export default function AdvisorPage() {
  return (
    <Suspense fallback={null}>
      <AdvisorClient />
    </Suspense>
  );
}
