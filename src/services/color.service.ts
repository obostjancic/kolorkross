import { Service } from "typedi";
import { Color } from "../models/types";
import { PREDEFINED_COLORS } from "../util/constants";

export interface Pallete {
  foreground: Color;
  background: Color;
}

@Service()
export class ColorService {
  constructor() {}

  private readonly colors: Color[] = [...Object.values(PREDEFINED_COLORS)];

  public getRandomColor(): Color {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  public getPallete(color: Color): Pallete {
    return {
      foreground: this.getForegroundShade(color),
      background: this.getBackgroundShade(color),
    };
  }

  private getForegroundShade(color: Color): Color {
    return { name: `foreground${color.name}`, value: `${color}FF` };
  }

  private getBackgroundShade(color: Color): Color {
    return { name: `background${color.name}`, value: `${color}28` };
  }
}
