"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LanguageTabs from "@/components/admin/language-tabs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { I18nString } from "@/db/schema";
import { FormSection } from "@/components/admin/form-logic/form-section";
import { FormGrid } from "@/components/admin/form-logic/form-grid";
import { I18nField } from "@/components/admin/form-logic/i18-field";
import Accordion from "@/components/ui/accordion";

// Empty boilerplate for new items
const emptyI18n: I18nString = { es: "", ca: "", en: "" };

export default function FAQForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // General Marketing Text
  const [hero, setHero] = useState(
    initialData?.faqHero || { title: emptyI18n, subtitle: emptyI18n },
  );
  const [cta, setCta] = useState(
    initialData?.faqCta || {
      title: emptyI18n,
      subtitle: emptyI18n,
      button: emptyI18n,
      whatsappMsg: emptyI18n,
    },
  );

  // The Sections Array
  const [sections, setSections] = useState<any[]>(
    initialData?.faqSections || [],
  );

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now().toString(),
        title: { ...emptyI18n, es: "Nueva Sección" },
        questions: [],
      },
    ]);
  };

  const removeSection = (index: number) => {
    if (confirm("Delete this entire section and its questions?")) {
      const newSections = [...sections];
      newSections.splice(index, 1);
      setSections(newSections);
    }
  };

  const addQuestion = (sectionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.push({
      question: { ...emptyI18n },
      answer: { ...emptyI18n },
    });
    setSections(newSections);
  };

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.splice(questionIndex, 1);
    setSections(newSections);
  };

  const updateSectionTitle = (
    sectionIndex: number,
    lang: keyof I18nString,
    value: string,
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].title[lang] = value;
    setSections(newSections);
  };

  const updateQuestion = (
    sIdx: number,
    qIdx: number,
    field: "question" | "answer",
    lang: keyof I18nString,
    value: string,
  ) => {
    const newSections = [...sections];
    newSections[sIdx].questions[qIdx][field][lang] = value;
    setSections(newSections);
  };

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/settings`, {
        method: "PATCH", // Using our new partial update endpoint
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faqHero: hero,
          faqCta: cta,
          faqSections: sections,
        }),
      });
      if (res.ok) {
        alert("FAQs saved successfully!");
        router.refresh();
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-24 space-y-8">
      {/* 1. HERO & CTA (Global FAQ text) */}
      <FormSection
        title="Page Header & CTA"
        description="Translate the main marketing headers for the FAQ page."
      >
        <FormGrid cols={2}>
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-muted-foreground border-b pb-1">
              Hero Section
            </h3>
            <I18nField
              label="Title"
              value={hero.title}
              onChange={(l, v) =>
                setHero({ ...hero, title: { ...hero.title, [l]: v } })
              }
            />
            <I18nField
              label="Subtitle"
              type="textarea"
              value={hero.subtitle}
              onChange={(l, v) =>
                setHero({ ...hero, subtitle: { ...hero.subtitle, [l]: v } })
              }
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-muted-foreground border-b pb-1">
              Contact CTA
            </h3>
            <I18nField
              label="Title"
              value={cta.title}
              onChange={(l, v) =>
                setCta({ ...cta, title: { ...cta.title, [l]: v } })
              }
            />
            <I18nField
              label="Button"
              value={cta.button}
              onChange={(l, v) =>
                setCta({ ...cta, button: { ...cta.button, [l]: v } })
              }
            />
          </div>
        </FormGrid>
      </FormSection>

      {/* 2. THE SECTIONS (Table of Contents via Vertical Tabs) */}
      <div className="flex justify-between items-center mt-12 mb-6">
        <h2 className="text-xl font-bold tracking-tight">
          FAQ Content Sections
        </h2>
        {sections.length === 0 && (
          <Button
            type="button"
            onClick={addSection}
            variant="soft"
            size="sm-pill"
          >
            <Plus /> Create First Section
          </Button>
        )}
      </div>

      {sections.length > 0 && (
        <Tabs
          orientation="vertical"
          defaultValue={sections[0]?.id}
          className="items-start gap-8"
        >
          {/* SIDEBAR: Table of Contents */}
          <TabsList
            variant="underline"
            className="w-full md:w-64 shrink-0 flex flex-col items-stretch space-y-1 bg-muted/10 p-2 rounded-xl border border-border"
          >
            {sections.map((sec, i) => (
              <TabsTrigger
                key={sec.id}
                value={sec.id}
                className="justify-start text-left px-4 py-2 text-sm font-medium"
              >
                <span className="truncate">
                  {sec.title.es || `Section ${i + 1}`}
                </span>
              </TabsTrigger>
            ))}
            <Button
              type="button"
              onClick={addSection}
              variant="ghost"
              className="mt-4 w-full justify-start text-primary hover:bg-primary/5"
            >
              <Plus className="size-4 mr-2" /> Add Section
            </Button>
          </TabsList>

          {/* EDITING AREA */}
          {sections.map((sec, sIdx) => (
            <TabsContent
              key={sec.id}
              value={sec.id}
              className="flex-1 w-full mt-0"
            >
              <FormSection
                title="Edit Section Content"
                action={
                  <Button
                    type="button"
                    onClick={() => removeSection(sIdx)}
                    variant="destructive-soft"
                    size="sm-pill"
                  >
                    <Trash2 className="size-3 mr-1" /> Delete Section
                  </Button>
                }
              >
                {/* Section Title field */}
                <I18nField
                  label="Section Title"
                  description="The header that appears above this group of questions."
                  value={sec.title}
                  onChange={(l, v) => updateSectionTitle(sIdx, l as any, v)}
                />

                <div className="pt-8 border-t border-border mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      Questions ({sec.questions.length})
                    </h3>
                    <Button
                      type="button"
                      onClick={() => addQuestion(sIdx)}
                      variant="soft"
                      size="sm-pill"
                    >
                      <Plus className="size-3 mr-1" /> Add Question
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {sec.questions.map((q: any, qIdx: number) => (
                      <Accordion
                        key={qIdx}
                        title={q.question.es || `Question #${qIdx + 1}`}
                        className="bg-muted/10 border-dashed"
                      >
                        <div className="space-y-6">
                          <I18nField
                            label="The Question"
                            value={q.question}
                            onChange={(l, v) =>
                              updateQuestion(
                                sIdx,
                                qIdx,
                                "question",
                                l as any,
                                v,
                              )
                            }
                          />
                          <I18nField
                            label="The Answer"
                            type="textarea"
                            rows={4}
                            value={q.answer}
                            onChange={(l, v) =>
                              updateQuestion(sIdx, qIdx, "answer", l as any, v)
                            }
                          />
                          <div className="flex justify-end pt-2">
                            <Button
                              type="button"
                              onClick={() => removeQuestion(sIdx, qIdx)}
                              variant="destructive-soft"
                              size="sm-pill"
                            >
                              <Trash2 className="size-3 mr-1" /> Remove Question
                            </Button>
                          </div>
                        </div>
                      </Accordion>
                    ))}

                    {sec.questions.length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                        <p className="text-sm text-muted-foreground italic">
                          No questions in this section yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </FormSection>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* FIXED FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 p-4 bg-background border-t border-border z-50 flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-6"
        >
          {loading ? "Saving..." : "Save FAQs"}
        </Button>
      </div>
    </div>
  );
}
