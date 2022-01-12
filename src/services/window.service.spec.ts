import "reflect-metadata";
import { container } from "tsyringe";
import { Direction } from "../util/constants";
import { VSCode } from "../util/vscode.env";
import { WindowService } from "./window.service";

jest.mock("../util/vscode.env", () => ({
  /* eslint-disable @typescript-eslint/naming-convention */
  VSCode: {
    showErrorMessage: jest.fn(),
    showInformationMessage: jest.fn(),
    showOpenDialog: jest.fn(),
    executeCommand: jest.fn(),
    showInputBox: jest.fn(),
    showQuickPick: jest.fn(),
    parse: jest.fn(),
    file: jest.fn((path: string) => path),
  },
}));

const colors = [
  { name: "Red", value: "#ff0000" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0000ff" },
];

describe("WindowService", () => {
  let windowService: WindowService;

  beforeEach(() => {
    jest.clearAllMocks();
    container.reset();
    windowService = container.resolve(WindowService);
  });

  describe("defaultInput", () => {
    it("should return the default value if the input is empty", async () => {
      const result = await windowService.defaultInput("Label", "val");

      expect(result).toBe("val");
    });

    it("should return the input value if it is not empty", async () => {
      jest.spyOn(windowService, "input").mockImplementation(() => Promise.resolve("input-val"));

      const result = await windowService.defaultInput("Label");

      expect(result).toBe("input-val");
    });

    it("should return imput value if there is no default", async () => {
      jest.spyOn(windowService, "input").mockImplementation(() => Promise.resolve("input-val"));

      const result = await windowService.defaultInput("Label", undefined);

      expect(result).toBe("input-val");
    });

    it("should throw an error if the input is empty and there is no default", async () => {
      jest.spyOn(windowService, "input").mockImplementation(() => Promise.resolve(undefined));

      await expect(windowService.defaultInput("Label")).rejects.toThrow("No Label provided");
    });
  });

  describe("input", () => {
    it("should return the input value", async () => {
      jest.spyOn(VSCode, "showInputBox").mockImplementation(() => Promise.resolve("input-val"));

      const result = await windowService.input("Label");

      expect(result).toBe("input-val");
    });

    it("should return undefined if input returns nothing", async () => {
      jest.spyOn(VSCode, "showInputBox").mockImplementation(() => Promise.resolve(undefined));

      const result = await windowService.input("Label");

      expect(result).toBeUndefined();
    });
  });

  describe("inputColor", () => {
    it("Should return a valid color", async () => {
      const color = { name: "Red", value: "#ff0000" };
      jest.spyOn(windowService, "quickPickColor" as any).mockImplementation(() => Promise.resolve(color));

      const result = await windowService.inputColor("Label", "", colors);

      expect(result).toStrictEqual(color);
    });

    it("Should return a custom color", async () => {
      const color = { name: "Custom", value: "#ff0000" };
      jest.spyOn(windowService, "quickPickColor" as any).mockImplementation(() => Promise.resolve(undefined));
      jest.spyOn(windowService, "input").mockImplementation(() => Promise.resolve(color.value));

      const result = await windowService.inputColor("Custom", "", colors);

      expect(result).toStrictEqual(color);
    });

    it("Should throw if the input and quick pick are empty", async () => {
      jest.spyOn(windowService, "quickPickColor" as any).mockImplementation(() => Promise.resolve(undefined));
      jest.spyOn(windowService, "input").mockImplementation(() => Promise.resolve(undefined));

      await expect(windowService.inputColor("Label", "", colors)).rejects.toThrow("No Label provided");
    });
  });

  describe("quickPickColor", () => {
    it("Should return a valid color", async () => {
      jest.spyOn(VSCode, "showQuickPick" as any).mockImplementation(() => Promise.resolve(colors[0].name));

      const result = await windowService["quickPickColor"](colors);

      expect(result).toStrictEqual(colors[0]);
    });

    it("Should return undefined for a custom color", async () => {
      jest.spyOn(VSCode, "showQuickPick").mockImplementation(() => Promise.resolve("Custom"));

      const result = await windowService["quickPickColor"](colors);

      expect(result).toBeUndefined();
    });

    it("Should return undefined if the input and quick pick are empty", async () => {
      jest.spyOn(VSCode, "showQuickPick").mockImplementation(() => Promise.resolve(undefined));
      jest.spyOn(windowService, "input").mockImplementation(() => Promise.resolve(undefined));

      const result = await windowService["quickPickColor"](colors);

      expect(result).toBeUndefined();
    });
  });

  describe("inputDirection", () => {
    it("Should return a valid direction when provided with a default", async () => {
      jest.spyOn(VSCode, "showQuickPick").mockImplementation(() => Promise.resolve(Direction.up));
      const direction = await windowService.inputDirection(Direction.up);
      expect(direction).toBe(Direction.up);
    });

    it("Should return a valid direction when not provided with a default", async () => {
      jest.spyOn(VSCode, "showQuickPick").mockImplementation(() => Promise.resolve(Direction.up));

      const direction = await windowService.inputDirection();
      expect(direction).toBe(Direction.up);
    });

    it("should throw an error if quick pick returns undefined", async () => {
      jest.spyOn(VSCode, "showQuickPick").mockImplementation(() => Promise.resolve(undefined));

      await expect(windowService.inputDirection()).rejects.toThrow("No direction provided");
    });
  });

  describe("inputPath", () => {
    it("Should return a valid path", async () => {
      jest.spyOn(VSCode, "showOpenDialog" as any).mockImplementation(() => Promise.resolve([{ path: "path" }]));

      const result = await windowService.inputPath("Path");

      expect(result).toBe("path");
    });

    it("Should throw if path is undefined", async () => {
      jest.spyOn(VSCode, "showOpenDialog" as any).mockImplementation(() => Promise.resolve([]));

      await expect(windowService.inputPath("Path")).rejects.toThrow("No Path provided");
    });

    it("Should throw if path is not selected", async () => {
      jest.spyOn(VSCode, "showOpenDialog" as any).mockImplementation(() => Promise.resolve(undefined));

      await expect(windowService.inputPath("Path")).rejects.toThrow("No Path provided");
    });
  });

  describe("confirm", () => {
    it("Should return true if the user confirms", async () => {
      jest.spyOn(VSCode, "showInformationMessage").mockImplementation(() => Promise.resolve("Yes"));

      const result = await windowService.confirm("Do you want to continue?");

      expect(result).toBe(true);
    });

    it("Should return false if the user does not confirm", async () => {
      jest.spyOn(VSCode, "showInformationMessage").mockImplementation(() => Promise.resolve("No"));

      const result = await windowService.confirm("Do you want to continue?");

      expect(result).toBe(false);
    });

    it("Should return false if the user does not confirm or cancels", async () => {
      jest.spyOn(VSCode, "showInformationMessage").mockImplementation(() => Promise.resolve(undefined));

      const result = await windowService.confirm("Do you want to continue?");

      expect(result).toBe(false);
    });
  });

  describe("openProject", () => {
    it("Should open the project", async () => {
      jest.spyOn(VSCode, "executeCommand").mockImplementation(() => Promise.resolve({}));
      const project = { id: "1", name: "", path: "path", color: { name: "Red", value: "#ff0000" } };

      await windowService.openProject(project);

      expect(VSCode.executeCommand).toHaveBeenCalledWith("vscode.openFolder", "path", true);
    });
  });
});
