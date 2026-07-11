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
      <Card>
        <CardHeader>
          <CardTitle>Page Header & CTA</CardTitle>
        </CardHeader>
        <CardContent>
          <LanguageTabs headerText="Translate the main headers">
            {(lang) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold border-b border-border pb-2">
                    Hero Section
                  </h3>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={hero.title[lang] || ""}
                      onChange={(e) =>
                        setHero({
                          ...hero,
                          title: { ...hero.title, [lang]: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Textarea
                      value={hero.subtitle[lang] || ""}
                      onChange={(e) =>
                        setHero({
                          ...hero,
                          subtitle: {
                            ...hero.subtitle,
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold border-b border-border pb-2">
                    Contact CTA (Bottom)
                  </h3>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={cta.title[lang] || ""}
                      onChange={(e) =>
                        setCta({
                          ...cta,
                          title: { ...cta.title, [lang]: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={cta.subtitle[lang] || ""}
                      onChange={(e) =>
                        setCta({
                          ...cta,
                          subtitle: { ...cta.subtitle, [lang]: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Button Text</Label>
                    <Input
                      value={cta.button[lang] || ""}
                      onChange={(e) =>
                        setCta({
                          ...cta,
                          button: { ...cta.button, [lang]: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp Pre-filled Message</Label>
                    <Input
                      value={cta.whatsappMsg[lang] || ""}
                      onChange={(e) =>
                        setCta({
                          ...cta,
                          whatsappMsg: {
                            ...cta.whatsappMsg,
                            [lang]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </LanguageTabs>
        </CardContent>
      </Card>

      {/* 2. THE SECTIONS (Table of Contents via Vertical Tabs) */}
      <h2 className="text-xl font-bold mt-12 mb-4">FAQ Sections</h2>

      {sections.length > 0 ? (
        <Tabs
          orientation="vertical"
          defaultValue={sections[0]?.id}
          className="items-start gap-8"
        >
          {/* SIDEBAR (Table of contents) */}
          <TabsList
            variant="underline"
            className="w-full md:w-64 shrink-0 flex flex-col items-stretch space-y-2 border-r-0"
          >
            {sections.map((sec, i) => (
              <TabsTrigger
                key={sec.id}
                value={sec.id}
                className="justify-start text-left px-4"
              >
                {sec.title.es || `Section ${i + 1}`}
              </TabsTrigger>
            ))}
            <Button
              type="button"
              onClick={addSection}
              variant="soft"
              className="mt-4 w-full"
            >
              <Plus /> Add Section
            </Button>
          </TabsList>

          {/* EDITING AREA */}
          {sections.map((sec, sIdx) => (
            <TabsContent
              key={sec.id}
              value={sec.id}
              className="flex-1 w-full mt-0"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Edit Section</CardTitle>
                  <Button
                    type="button"
                    onClick={() => removeSection(sIdx)}
                    variant="destructive-soft"
                    size="sm-pill"
                  >
                    <Trash2 /> Delete Section
                  </Button>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Section Title */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground uppercase font-bold text-xs tracking-wider">
                      Section Title
                    </Label>
                    <LanguageTabs headerText="">
                      {(lang) => (
                        <Input
                          value={sec.title[lang] || ""}
                          onChange={(e) =>
                            updateSectionTitle(
                              sIdx,
                              lang as keyof I18nString,
                              e.target.value,
                            )
                          }
                        />
                      )}
                    </LanguageTabs>
                  </div>

                  <hr className="border-border" />

                  {/* Questions inside this Section */}
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Questions</h3>
                    <Button
                      type="button"
                      onClick={() => addQuestion(sIdx)}
                      variant="soft"
                      size="sm-pill"
                    >
                      <Plus /> Add Question
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {sec.questions.map((q: any, qIdx: number) => (
                      <div
                        key={qIdx}
                        className="bg-muted/30 border border-border rounded-lg p-5 relative"
                      >
                        <Button
                          type="button"
                          onClick={() => removeQuestion(sIdx, qIdx)}
                          variant="destructive-soft"
                          size="icon-sm"
                          className="absolute top-4 right-4"
                        >
                          <Trash2 />
                        </Button>
                        <LanguageTabs headerText={`Question ${qIdx + 1}`}>
                          {(lang) => (
                            <div className="space-y-4 pr-8">
                              <div className="space-y-2">
                                <Label>Question</Label>
                                <Input
                                  value={q.question[lang] || ""}
                                  onChange={(e) =>
                                    updateQuestion(
                                      sIdx,
                                      qIdx,
                                      "question",
                                      lang as keyof I18nString,
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Answer</Label>
                                <Textarea
                                  rows={4}
                                  value={q.answer[lang] || ""}
                                  onChange={(e) =>
                                    updateQuestion(
                                      sIdx,
                                      qIdx,
                                      "answer",
                                      lang as keyof I18nString,
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </LanguageTabs>
                      </div>
                    ))}
                    {sec.questions.length === 0 && (
                      <p className="text-muted-foreground text-sm italic">
                        No questions in this section.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No sections exist yet.</p>
            <Button type="button" onClick={addSection}>
              <Plus /> Create First Section
            </Button>
          </CardContent>
        </Card>
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
