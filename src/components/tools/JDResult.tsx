export type JDResultData = {
  title: string;
  intro: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  benefits: string[];
  closing: string;
};

type Props = {
  result: JDResultData;
};

export default function JDResult({ result }: Props) {
  function copyToClipboard() {
    const lines = [
      `# ${result.title}`,
      "",
      result.intro,
      "",
      "## Responsibilities",
      ...result.responsibilities.map((r) => `- ${r}`),
      "",
      "## Requirements",
      ...result.requirements.map((r) => `- ${r}`),
      "",
      "## Nice to Have",
      ...result.nice_to_have.map((r) => `- ${r}`),
      "",
      "## What We Offer",
      ...result.benefits.map((r) => `- ${r}`),
      "",
      result.closing,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
  }

  return (
    <div className="space-y-6">
      {/* Title & copy */}
      <div className="flex items-start justify-between gap-4 bg-white rounded-2xl border border-neutral-200 p-6">
        <div>
          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-1">
            Generated Job Description
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {result.title}
          </h2>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex-shrink-0 px-4 py-2 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
        >
          Copy as text
        </button>
      </div>

      {/* Intro */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <p className="text-sm text-neutral-700 leading-relaxed">
          {result.intro}
        </p>
      </div>

      {/* Responsibilities & Requirements side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <Section
          title="Responsibilities"
          items={result.responsibilities}
          color="bg-blue-50 border-blue-200 text-blue-900"
          bullet="bg-blue-400"
        />
        <Section
          title="Requirements"
          items={result.requirements}
          color="bg-neutral-50 border-neutral-200 text-neutral-900"
          bullet="bg-neutral-400"
        />
      </div>

      {/* Nice to have & Benefits side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <Section
          title="Nice to Have"
          items={result.nice_to_have}
          color="bg-amber-50 border-amber-200 text-amber-900"
          bullet="bg-amber-400"
        />
        <Section
          title="What We Offer"
          items={result.benefits}
          color="bg-green-50 border-green-200 text-green-900"
          bullet="bg-green-400"
        />
      </div>

      {/* Closing */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6">
        <p className="text-sm text-neutral-700 leading-relaxed italic">
          {result.closing}
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  items,
  color,
  bullet,
}: {
  title: string;
  items: string[];
  color: string;
  bullet: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 space-y-3 ${color}`}>
      <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 items-start">
            <span
              className={`mt-1.5 flex-shrink-0 h-1.5 w-1.5 rounded-full ${bullet}`}
            />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
