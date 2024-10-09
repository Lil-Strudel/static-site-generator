import config from "./config.json";
import { mkdirSync, writeFileSync } from "fs";

const indentSpaceCount = 4;

function ind(num: number, str: string) {
  return " ".repeat(num * indentSpaceCount) + str;
}

mkdirSync("./dist_pages", { recursive: true });

for (const page of config.pages) {
  const file = [];

  file.push("---");
  file.push("import BaseHead from '../_components/BaseHead.astro'");

  const uniqueComponents = new Set<string>();
  page.components.forEach((component) => {
    uniqueComponents.add(component.path);
  });
  for (const component of uniqueComponents) {
    // prettier-ignore
    file.push(`import ${component.split(".")[0]} from '../components/${component}'`);
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
