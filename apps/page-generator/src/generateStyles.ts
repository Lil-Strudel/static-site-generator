import config from "./config.json";
import { writeFileSync } from "fs";
import { directory } from "./constants";
import { hexToCssHsl, ind } from "./utils";

export function generateStyles(theme: typeof config.theme) {
  const file = [];
  file.push(`@tailwind base;`);
  file.push(`@tailwind components;`);
  file.push(`@tailwind utilities;`);
  file.push(``);
  file.push(`@layer base {`);
  file.push(ind(1, `:root {`));
  file.push(ind(2, `--background: ${hexToCssHsl(theme.background)};`));
  file.push(ind(2, `--foreground: ${hexToCssHsl(theme.foreground)};`));
  file.push(``);
  file.push(ind(2, `--card: ${hexToCssHsl(theme.card)};`));
  // prettier-ignore
  file.push(ind(2, `--card-foreground: ${hexToCssHsl(theme["card-foreground"])};`));
  file.push(``);
  file.push(ind(2, `--popover: ${hexToCssHsl(theme.popover)};`));
  // prettier-ignore
  file.push(ind(2, `--popover-foreground: ${hexToCssHsl(theme["popover-foreground"])};`));
  file.push(``);
  file.push(ind(2, `--primary: ${hexToCssHsl(theme.primary)};`));
  // prettier-ignore
  file.push(ind(2, `--primary-foreground: ${hexToCssHsl(theme["primary-foreground"])};`));
  file.push(``);
  file.push(ind(2, `--secondary: ${hexToCssHsl(theme.secondary)};`));
  // prettier-ignore
  file.push(ind(2, `--secondary-foreground: ${hexToCssHsl(theme["secondary-foreground"])};`));
  file.push(``);
  file.push(ind(2, `--muted: ${hexToCssHsl(theme.muted)};`));
  // prettier-ignore
  file.push(ind(2, `--muted-foreground: ${hexToCssHsl(theme["muted-foreground"])};`));
  file.push(``);
  file.push(ind(2, `--accent: ${hexToCssHsl(theme.accent)};`));
  // prettier-ignore
  file.push(ind(2, `--accent-foreground: ${hexToCssHsl(theme["accent-foreground"])};`));
  file.push(``);
  file.push(ind(2, `--destructive: ${hexToCssHsl(theme.destructive)};`));
  // prettier-ignore
  file.push(ind(2, `--destructive-foreground: ${hexToCssHsl(theme["destructive-foreground"])};`));
  file.push(``);
  file.push(ind(2, `--border: ${hexToCssHsl(theme.border)};`));
  file.push(ind(2, `--input: ${hexToCssHsl(theme.input)};`));
  file.push(ind(2, `--ring: ${hexToCssHsl(theme.ring)};`));
  file.push(``);
  file.push(ind(2, `--radius: ${theme.radius};`));
  file.push(ind(1, `}`));
  file.push(`}`);
  file.push(``);
  file.push(`@layer base {`);
  file.push(ind(1, `* {`));
  file.push(ind(2, `@apply border-border;`));
  file.push(ind(1, `}`));
  file.push(ind(1, `body {`));
  file.push(ind(2, `@apply bg-background text-foreground;`));
  file.push(ind(1, `}`));
  file.push(`}`);

  writeFileSync(`${directory}/styles/global.css`, file.join("\n"), "utf-8");
}
