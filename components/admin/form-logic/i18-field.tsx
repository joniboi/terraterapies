// components/admin/form-logic/i18n-field.tsx
import LanguageTabs from "../language-tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "./form-field";

interface I18nFieldProps {
  label: string;
  value: any;
  onChange: (lang: string, val: string) => void;
  type?: "input" | "textarea";
  rows?: number;
  placeholder?: string;
  description?: string;
}

export function I18nField({
  label,
  value,
  onChange,
  type = "input",
  rows = 3,
  placeholder,
  description,
}: I18nFieldProps) {
  return (
    <FormField label={label} description={description}>
      <LanguageTabs variant="inline" useShortLabels>
        {(lang) =>
          type === "input" ? (
            <Input
              value={value?.[lang] || ""}
              onChange={(e) => onChange(lang, e.target.value)}
              placeholder={placeholder}
            />
          ) : (
            <Textarea
              rows={rows}
              value={value?.[lang] || ""}
              onChange={(e) => onChange(lang, e.target.value)}
              placeholder={placeholder}
            />
          )
        }
      </LanguageTabs>
    </FormField>
  );
}
