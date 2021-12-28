import { ColorService } from "./color.service";

describe("ColorService", () => {
  describe("getPredefinedColors", () => {
    it("should return predefined colors", () => {
      const colors = ColorService.getPredefinedColors();
      expect(colors).toHaveLength(18);
    });
  });

  describe("getRandomColor", () => {
    it("should return a color", () => {
      const color = ColorService.getRandomColor();
      expect(typeof color.value).toBe("string");
    });
  });

  describe("getPallete", () => {
    it("should return a pallete", () => {
      const color = { name: "red", value: "#800000" };
      const pallete = ColorService.getPallete(color);
      expect(pallete.veryLight.value).toBe("#E60000");
      expect(pallete.light.value).toBe("#B30000");
      expect(pallete.medium.value).toBe("#660000");
      expect(pallete.dark.value).toBe("#4D0000");
      expect(pallete.veryDark.value).toBe("#330000");
    });
  });

  describe("darker", () => {
    it("should return a darker color", () => {
      const color = { name: "red", value: "#ff0000" };
      const darkerColor = ColorService.darker(color, 0.5);
      expect(darkerColor.value).toEqual(`#800000`);
    });
  });

  describe("lighter", () => {
    it("should return a lighter color", () => {
      const color = { name: "red", value: "#ff0000" };
      const lighterColor = ColorService.lighter(color, 0.5);
      expect(lighterColor.value).toEqual(`#FF8080`);
    });
  });
});
