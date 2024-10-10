import fs from "fs";
import path from "path";

export function setupDirectory(directory: string): void {
  if (fs.existsSync(directory)) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const currentPath = path.join(directory, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        fs.rmSync(currentPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(currentPath);
      }
    }
  } else {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.mkdirSync(`${directory}/styles`, { recursive: true });
  fs.mkdirSync(`${directory}/pages`, { recursive: true });
}
