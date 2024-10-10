const indentSpaceCount = 4;
export function ind(num: number, str: string) {
  return " ".repeat(num * indentSpaceCount) + str;
}

type Component = { type: string; path: string };

export function getUniqueComponents(arr: Component[]): Component[] {
  const map = new Map<string, Component>();

  arr.forEach((item) => {
    const key = `${item.type}:${item.path}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  return Array.from(map.values());
}

export function hexToCssHsl(hex: string) {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Parse r, g, b values
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 3) {
    // Handle shorthand hex (#rgb)
    r = parseInt(hex[0]! + hex[0], 16);
    g = parseInt(hex[1]! + hex[1], 16);
    b = parseInt(hex[2]! + hex[2], 16);
  } else if (hex.length === 6) {
    // Handle full hex (#rrggbb)
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    throw new Error("Invalid hex color");
  }

  // Convert RGB to the range [0, 1]
  r /= 255;
  g /= 255;
  b /= 255;

  // Find the min and max values to get the lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  // Convert h, s, and l values to a percentage string
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}
