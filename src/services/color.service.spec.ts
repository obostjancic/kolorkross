import { ColorService } from "./color.service";

describe("ColorService", () => {
  let colorService = new ColorService();

  describe("getRandomColor", () => {
    it("should return a color", () => {
      let color = colorService.getRandomColor();
      expect(typeof color.value).toBe("string");
    });
  });

  describe("getPallete", () => {
    it("should return a pallete", () => {
      const color = { name: "red", value: "#ff0000" };
      let pallete = colorService.getPallete(color);
      expect(pallete.foreground.value).toEqual(`${color}FF`);
      expect(pallete.background.value).toEqual(`${color}28`);
    });
  });
});
