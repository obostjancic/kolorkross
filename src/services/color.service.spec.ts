var assert = require("assert");
import { Color, Group, Project } from "../models/types";
import { MockRepository, Repository } from "../repositories/base.repository";
import { ColorService } from "./color.service";
import { GroupService } from "./group.service";

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
      assert.equal(pallete.background, `${color}11`);
    });
  });
});
