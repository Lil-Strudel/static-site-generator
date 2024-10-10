import config from "./config.json";
import { directory } from "./constants";
import { generatePage } from "./generatePage";
import { generateStyles } from "./generateStyles";
import { setupDirectory } from "./setupDirectory";

setupDirectory(directory);

generateStyles(config.theme);

for (const page of config.pages) {
  generatePage(page);
}
