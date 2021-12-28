import * as ExtColor from "color";
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
      veryLight: this.lighter(color, 0.8),
      light: this.lighter(color, 0.4),
      medium: this.darker(color, 0.2),
      dark: this.darker(color, 0.4),
      veryDark: this.darker(color, 0.6),
    };
  }

  public static transparent(color: Color, percent: number): Color {
    return {
      name: `Transparent ${color.name}`,
      value: ExtColor(color.value).desaturate(0.2).alpha(percent).hex(),
    };
  }

  public static darker(color: Color, percent: number): Color {
    return {
      name: `Dark ${color.name}`,
      value: ExtColor(color.value).darken(percent).hex(),
    };
  }

  public static lighter(color: Color, percent: number): Color {
    return {
      name: `Light ${color.name}`,
      value: ExtColor(color.value).lighten(percent).hex(),
    };
  }
}
