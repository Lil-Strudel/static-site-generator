import path from "path";
import config from "./config.json";
import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from "fs";

const indentSpaceCount = 4;

function ind(num: number, str: string) {
  return " ".repeat(num * indentSpaceCount) + str;
}

type Component = { type: string; path: string };

function getUniqueComponents(arr: Component[]): Component[] {
  const map = new Map<string, Component>();

  arr.forEach((item) => {
    const key = `${item.type}:${item.path}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  return Array.from(map.values());
}

const directory = "./dist_pages";
mkdirSync(directory, { recursive: true });
const files = readdirSync(directory);
for (const file of files) {
  unlinkSync(path.join(directory, file));
}

for (const page of config.pages) {
  const file = [];

  file.push("---");
  file.push("import BaseHead from '../components/BaseHead.astro'");

  const uniqueComponents = getUniqueComponents(page.components);
  for (const component of uniqueComponents) {
    file.push(
      `import ${component.path.split(".")[0]} from '../blocks/${
        component.type
      }/${component.path}'`
    );
  }
  file.push("---");
  file.push("");
  file.push("<!doctype html>");
  file.push('<html lang="en">');
  file.push(ind(1, "<head>"));
  // prettier-ignore
  file.push(ind(2, `<BaseHead title="${page.meta.title}" description="${page.meta.description}" />`));
  file.push(ind(1, "</head>"));
  file.push(ind(1, "<body>"));
  for (const component of page.components) {
    let propString = ``;
    Object.entries(component.props).forEach(([key, value]) => {
      propString = propString + key + "=";
      switch (typeof value) {
        case "string": {
          propString = propString + `"${value}" `;
          break;
        }
        case "object":
        case "boolean":
        case "number": {
          propString = propString + `{${value}} `;
          break;
        }
        default: {
          throw new Error(`Invalid prop: ${key}`);
        }
      }
    });
    file.push(ind(2, `<${component.path.split(".")[0]} ${propString}/>`));
  }
  file.push(ind(1, "</body>"));
  file.push("<html>");

  console.log(file);

  writeFileSync(`./dist_pages/${page.path}.astro`, file.join("\n"), "utf-8");
}
