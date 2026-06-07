import { PrimaryLinkButton } from "@/components/ui/PrimaryButton";

const topics = [
  "Capacitor",
  "Capacitance",
  "Capacitor Structure",
  "Capacitor Working Principle",
  "Ceramic Capacitor",
  "Electrolytic Capacitor",
  "Polarized vs Nonpolarized Capacitor",
  "Variable Capacitor",
];

export default function IndustrialAutomationCapacitorChapterPage() {
  return (
    <main className="py-8 sm:py-10">
      <div className="container space-y-6">
        <header className="edu-card p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            Industrial Automation
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            Chapter 2: Capacitor
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text/70">
            Capacitor basics, capacitance, construction, working principle, and
            common capacitor types are grouped in this chapter.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryLinkButton href="/books/industrial-automation">
              Back to Book
            </PrimaryLinkButton>
            <PrimaryLinkButton href="/books/industrial-automation/chapter-03-diode">
              Next Chapter
            </PrimaryLinkButton>
          </div>
        </header>

        <section className="edu-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-text">Topics</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {topics.map((topic, index) => (
              <div key={topic} className="rounded-xl border border-text/10 bg-bg p-4">
                <p className="text-sm font-semibold text-primary">
                  2.{index + 1}
                </p>
                <h3 className="mt-1 text-base font-semibold text-text">{topic}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
