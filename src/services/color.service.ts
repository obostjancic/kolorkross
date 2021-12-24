import { Color } from "../models/types";
import { PREDEFINED_COLORS } from "../util/constants";

export interface Pallete {
  veryLight: Color;
  light: Color;
  medium: Color;
  dark: Color;
  veryDark: Color;
}

export class ColorService {
  private static readonly colors: Color[] = [...Object.values(PREDEFINED_COLORS)];

  public static getPredefinedColors(): Color[] {
    return this.colors;
  }

  public static getRandomColor(): Color {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  public static getPallete(color: Color): Pallete {
    return {
      veryLight: this.lighter(color, 0.75),
      light: this.lighter(color, 0.5),
      medium: color,
      dark: this.darker(color, 0.5),
      veryDark: this.darker(color, 0.75),
    };
  }

  public static hex(r: number, g: number, b: number): string {
    return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
  }

  private static componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }

  public static transparent(color: Color, percent: number): Color {
    const hexOpacity = this.componentToHex(Math.round(255 * percent));
    return {
      name: `Transparent ${color.name}`,
      value: `${color.value}${hexOpacity}`,
    };
  }

  public static darker(color: Color, percent: number): Color {
    const hex = color.value.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const darkR = Math.max(Math.round(r * (1 - percent)), 0);
    const darkG = Math.max(Math.round(g * (1 - percent)), 0);
    const darkB = Math.max(Math.round(b * (1 - percent)), 0);

    return {
      name: `Dark ${color.name}`,
      value: this.hex(darkR, darkG, darkB),
    };
  }

  public static lighter(color: Color, percent: number): Color {
    const hex = color.value.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const lightR = Math.min(Math.round(r * (1 + percent)), 255);
    const lightG = Math.min(Math.round(g * (1 + percent)), 255);
    const lightB = Math.min(Math.round(b * (1 + percent)), 255);

    return {
      name: `Light ${color.name}`,
      value: this.hex(lightR, lightG, lightB),
    };
  }
}
