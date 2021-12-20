import { ColorService } from "./color.service";

describe("ColorService", () => {
  describe("getPredefinedColors", () => {
    it("should return predefined colors", () => {
      const colors = ColorService.getPredefinedColors();
      expect(colors).toHaveLength(12);
    });
  });

  describe("getRandomColor", () => {
    it("should return a color", () => {
      let color = ColorService.getRandomColor();
      expect(typeof color.value).toBe("string");
    });
  });

  describe("getPallete", () => {
    it("should return a pallete", () => {
      const color = { name: "red", value: "#ff0000" };
      let pallete = ColorService.getPallete(color);
      expect(pallete.foreground.value).toEqual(`${color}FF`);
      expect(pallete.background.value).toEqual(`${color}28`);
    });
  });
});
