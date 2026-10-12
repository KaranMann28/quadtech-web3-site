"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LineList({
  name,
  label,
  required,
  values,
  onChange,
  error,
}: {
  name: string;
  label: string;
  required?: boolean;
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
}) {
  const items = values.length > 0 ? values : [""];

  function update(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  }

  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-medium">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </legend>
      <ul className="grid gap-2">
        {items.map((value, index) => (
          <li key={`${name}-${index}`} className="flex flex-wrap items-center gap-2">
            <Label htmlFor={`${name}-${index}`} className="sr-only">
              {label} {index + 1}
            </Label>
            <Input
              id={`${name}-${index}`}
              name={name}
              value={value}
              onChange={(event) => update(index, event.target.value)}
              className="h-11 min-w-0 flex-1"
            />
            <Button type="button" variant="outline" className="h-11" onClick={() => move(index, -1)} disabled={index === 0}>
              Move up
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
            >
              Move down
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
            >
              Remove line
            </Button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="outline" className="h-11 w-fit" onClick={() => onChange([...items, ""])}>
        Add line
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
