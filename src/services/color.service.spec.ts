var assert = require("assert");
import "reflect-metadata";

import { ColorService } from "./color.service";

describe("ColorService", () => {
  let colorService = new ColorService();

  describe("getRandomColor", () => {
    it("should return a color", () => {
      let color = colorService.getRandomColor();
      assert.equal(typeof color, "string");
    });
  });

  describe("getPallete", () => {
    it("should return a pallete", () => {
      const color = "#ff0000";
      let pallete = colorService.getPallete(color);
      assert.equal(pallete.foreground, `${color}FF`);
      assert.equal(pallete.background, `${color}28`);
    });
  });
});
