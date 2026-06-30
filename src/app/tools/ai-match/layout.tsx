import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Job Match — CubeA",
  description:
    "Describe what you're looking for and let CubeA match you to relevant Dutch jobs — including hidden roles crawled straight from company career pages.",
  alternates: { canonical: "/tools/ai-match" },
};

export default function AiMatchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
