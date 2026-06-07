import { PrimaryLinkButton } from "@/components/ui/PrimaryButton";

const topics = [
  {
    number: "3.1",
    title: "What is Diode",
    href: "/books/industrial-automation/chapter-03-diode/3-1",
    available: true,
  },
  {
    number: "3.2",
    title: "Diode Construction",
    href: "/books/industrial-automation/chapter-03-diode/3-2",
    available: true,
  },
  {
    number: "3.3",
    title: "Working Principle",
    href: "/books/industrial-automation/chapter-03-diode/3-3",
    available: true,
  },
  {
    number: "3.4",
    title: "Diode Characteristics",
    href: "/books/industrial-automation/chapter-03-diode/3-4",
    available: true,
  },
  {
    number: "3.5",
    title: "Diode Types",
    href: "/books/industrial-automation/chapter-03-diode/3-5",
    available: true,
  },
  {
    number: "3.6",
    title: "Diode Testing",
    href: "/books/industrial-automation/chapter-03-diode/3-6",
    available: true,
  },
  {
    number: "3.7",
    title: "Half-Wave Rectifier",
    href: "/books/industrial-automation/chapter-03-diode/3-7",
    available: true,
  },
  {
    number: "3.8",
    title: "Center-Tap Full-Wave Rectifier",
    href: "/books/industrial-automation/chapter-03-diode/3-8",
    available: true,
  },
  {
    number: "3.9",
    title: "Bridge Rectifier",
    href: "/books/industrial-automation/chapter-03-diode/3-9",
    available: true,
  },
  {
    number: "3.10",
    title: "Filter Circuit",
    href: "/books/industrial-automation/chapter-03-diode/3-10",
    available: true,
  },
  {
    number: "3.11",
    title: "LED",
    href: "/books/industrial-automation/chapter-03-diode/3-11",
    available: true,
  },
  {
    number: "3.12",
    title: "Photodiode",
    href: "/books/industrial-automation/chapter-03-diode/3-12",
    available: true,
  },
  {
    number: "3.13",
    title: "Zener Diode",
    href: "/books/industrial-automation/chapter-03-diode/3-13",
    available: true,
  },
];

export default function IndustrialAutomationDiodeChapterPage() {
  return (
    <main className="py-8 sm:py-10">
      <div className="container space-y-6">
        <header className="edu-card p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            Industrial Automation
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            Chapter 3: Diode
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text/70">
            Diode concepts, rectifier circuits, filter circuits, and special
            purpose diodes are grouped in this chapter.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrimaryLinkButton href="/books/industrial-automation">
              Back to Book
            </PrimaryLinkButton>
            <PrimaryLinkButton href="/books/industrial-automation/chapter-04-transformer">
              Next Chapter
            </PrimaryLinkButton>
          </div>
        </header>

        <section className="edu-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-text">Topics</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {topics.map((topic) => (
              <article
                key={topic.number}
                className="rounded-xl border border-text/10 bg-bg p-4"
              >
                <p className="text-sm font-semibold text-primary">{topic.number}</p>
                <h3 className="mt-1 text-base font-semibold text-text">
                  {topic.title}
                </h3>
                <div className="mt-4">
                  {topic.available && topic.href ? (
                    <PrimaryLinkButton href={topic.href}>Open Topic</PrimaryLinkButton>
                  ) : (
                    <span className="inline-flex items-center justify-center rounded-xl border border-text/15 bg-bg px-4 py-2.5 text-sm font-semibold text-text/50">
                      In Progress
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
