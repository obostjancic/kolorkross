import { Color } from "../models/types";

export enum Colors {
  purple = "#c678dd",
  red = "#f44747",
  coral = "#e06c75",
  whiskey = "#d19a66",
  chalky = "#E5C07B",
  lightDark = "#7F848E",
  dark = "#5C63701",
  malibu = "#61AFEF",
  green = "#98c379",
  fountainBlue = "#56b6c2",
  white = "#FFFFFF",
  lightwhite = "#abb2bf",
}

export interface Pallete {
  foreground: Color;
  background: Color;
}

export class ColorService {
  private readonly colors: Color[] = [
    Colors.chalky,
    Colors.coral,
    Colors.purple,
    Colors.red,
    Colors.whiskey,
    Colors.malibu,
    Colors.green,
    Colors.fountainBlue,
    Colors.white,
    Colors.lightwhite,
  ];

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
    return `${color}FF`;
  }

  private getBackgroundShade(color: Color): Color {
    return `${color}28`;
  }
}
