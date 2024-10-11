import { getUniqueComponents, ind } from "./utils";
import config from "./config.json";
import { writeFileSync } from "fs";
import { directory } from "./constants";

export function generatePage(page: (typeof config.pages)[number]) {
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
        case "object": {
          propString = propString + `{${JSON.stringify(value)}} `;
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

  writeFileSync(
    `${directory}/pages/${page.path}.astro`,
    file.join("\n"),
    "utf-8"
  );
}
