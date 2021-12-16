import { ColorService } from "./color.service";

describe("ColorService", () => {
  let colorService = new ColorService();

  describe("getRandomColor", () => {
    it("should return a color", () => {
      let color = colorService.getRandomColor();
      expect(typeof color).toBe("string");
    });
  });

  describe("getPallete", () => {
    it("should return a pallete", () => {
      const color = "#ff0000";
      let pallete = colorService.getPallete(color);
      expect(pallete.foreground).toEqual(`${color}FF`);
      expect(pallete.background).toEqual(`${color}28`);
    });
  });
});
