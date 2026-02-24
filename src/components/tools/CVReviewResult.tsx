import ScoreBar from "./ScoreBar";

type SectionFeedback = {
  score: number;
  feedback: [string, string];
};

export type CVReviewResult = {
  overall_score: number;
  top_priorities: [string, string, string];
  sections: {
    summary: SectionFeedback;
    experience: SectionFeedback;
    skills: SectionFeedback;
    education: SectionFeedback;
    formatting: SectionFeedback;
    dutch_market_fit: SectionFeedback;
  };
};

const SECTION_LABELS: Record<keyof CVReviewResult["sections"], string> = {
  summary: "Summary",
  experience: "Experience",
  skills: "Skills",
  education: "Education",
  formatting: "Formatting",
  dutch_market_fit: "Dutch Market Fit",
};

type Props = {
  result: CVReviewResult;
};

export default function CVReviewResult({ result }: Props) {
  const sectionKeys = Object.keys(SECTION_LABELS) as (keyof CVReviewResult["sections"])[];

  return (
    <div className="space-y-6">
      {/* Overall score */}
      <div className="text-center py-8 bg-white rounded-2xl border border-neutral-200">
        <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-2">
          Overall Score
        </p>
        <p className="text-7xl font-extrabold text-black tracking-tight">
          {result.overall_score}
          <span className="text-3xl text-neutral-400 font-medium">/5</span>
        </p>
      </div>

      {/* Top priorities */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <p className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3">
          Top 3 Priority Fixes
        </p>
        <ol className="space-y-2">
          {result.top_priorities.map((priority, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-400 text-white text-xs font-bold grid place-items-center">
                {i + 1}
              </span>
              <span className="text-sm text-amber-900">{priority}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Section cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {sectionKeys.map((key) => {
          const section = result.sections[key];
          return (
            <div
              key={key}
              className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-800">
                  {SECTION_LABELS[key]}
                </h3>
              </div>
              <ScoreBar score={section.score} />
              <ul className="space-y-1.5">
                {section.feedback.map((point, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-neutral-400" />
                    <span className="text-sm text-neutral-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center pt-2 pb-4">
        <a
          href="/jobs"
          className="inline-block bg-black text-white text-sm font-medium rounded-xl px-6 py-3 hover:bg-neutral-800 transition-colors"
        >
          Ready to find your next role?
        </a>
      </div>

      {/* Recruiter pitch */}
      <div className="text-center pb-2">
        <p className="text-sm text-neutral-500">
          Want a human eye on your CV too?{" "}
          <a
            href="/recruiters#contact"
            className="text-neutral-700 underline underline-offset-2 hover:text-black transition-colors"
          >
            Our recruiter offers free 15-min CV calls for candidates in the Netherlands.
          </a>
        </p>
      </div>
    </div>
  );
}
