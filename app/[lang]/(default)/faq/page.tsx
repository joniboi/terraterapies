import { db } from "@/db";
import Accordion from "@/components/ui/accordion";
import { I18nString } from "@/db/schema";
import { parseWildcards } from "@/app/lib/wildcardParser";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function FAQPage({ params }: PageProps) {
  const { lang } = await params;

  // Fetch from DB instead of dictionary
  const settings = await db.query.siteSettings.findFirst();

  const hero = settings?.faqHero;
  const cta = settings?.faqCta;
  const sections = settings?.faqSections || [];

  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="relative py-20 bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            data-aos="fade-up"
          >
            {hero?.title?.[lang as keyof I18nString] || "FAQ"}
          </h1>
          <p
            className="text-lg text-muted-foreground"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {hero?.subtitle?.[lang as keyof I18nString] || ""}
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 md:py-20 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className={sectionIndex > 0 ? "mt-16" : ""}
              data-aos="fade-up"
              data-aos-delay={sectionIndex * 100}
            >
              {/* Section Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 pb-3 border-b-2 border-primary/20">
                {section.title[lang as keyof I18nString]}
              </h2>

              {/* Questions */}
              <div className="space-y-4">
                {section.questions.map((qa, qaIndex) => (
                  <Accordion
                    key={`${section.id}-${qaIndex}`}
                    id={`${section.id}-${qaIndex}`}
                    title={qa.question[lang as keyof I18nString]}
                    active={qaIndex === 0 && sectionIndex === 0}
                  >
                    <p className="whitespace-pre-line text-muted-foreground">
                      {/* 🚀 PARSE WILDCARDS HERE 🚀 */}
                      {parseWildcards(
                        qa.answer[lang as keyof I18nString] || "",
                        settings,
                      )}
                    </p>
                  </Accordion>
                ))}
              </div>
            </div>
          ))}

          {/* Contact CTA */}
          {cta && (
            <div
              className="mt-16 p-8 rounded-2xl bg-muted/50 border border-border text-center"
              data-aos="fade-up"
            >
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {cta.title[lang as keyof I18nString]}
              </h3>
              <p className="text-muted-foreground mb-6">
                {cta.subtitle[lang as keyof I18nString]}
              </p>
              <a
                href={`https://wa.me/${settings?.contactPhone?.replace(/\s+/g, "") || ""}?text=${encodeURIComponent(cta.whatsappMsg[lang as keyof I18nString] || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary-hover transition shadow-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                {cta.button[lang as keyof I18nString]}
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
