import { createFileRoute } from "@tanstack/react-router";
import { AuroraMixer } from "@/components/aurora/mixer";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <AuroraMixer />;
}
