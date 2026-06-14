import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free CV Reviewer — CubeA",
  description:
    "Get quick, free feedback on your CV for the Dutch tech job market with CubeA's CV reviewer.",
  alternates: { canonical: "/tools/cv-reviewer" },
};

export default function CvReviewerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
