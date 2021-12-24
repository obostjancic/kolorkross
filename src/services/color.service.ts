import { Color } from "../models/types";
import { PREDEFINED_COLORS } from "../util/constants";

export interface Pallete {
  foreground: Color;
  background: Color;
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
      foreground: this.getForegroundShade(color),
      background: this.getBackgroundShade(color),
    };
  }

  private static getForegroundShade(color: Color): Color {
    return { name: `foreground${color.name}`, value: `${color.value}FF` };
  }

  private static getBackgroundShade(color: Color): Color {
    return { name: `background${color.name}`, value: `${color.value}28` };
  }
}
