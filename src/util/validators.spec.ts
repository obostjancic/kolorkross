import { isValidHex } from "./validators";

describe("isValidHex", () => {
  it("should return true when color (3) is valid", () => {
    const color = "#fff";
    const result = isValidHex(color);

    expect(result).toBeTruthy();
  });

  it("should return false when color (3) is invalid", () => {
    const color = "#qwe";
    const result = isValidHex(color);

    expect(result).toBeFalsy();
  });

  it("should return true when color (6) is valid", () => {
    const color = "#ffffff";
    const result = isValidHex(color);

    expect(result).toBeTruthy();
  });

  it("should return false when color (6) is invalid", () => {
    const color = "#qwerty";
    const result = isValidHex(color);

    expect(result).toBeFalsy();
  });

  it("should return true when color (8) is valid", () => {
    const color = "#ffffffff";
    const result = isValidHex(color);

    expect(result).toBeTruthy();
  });

  it("should return false when color (8) is invalid", () => {
    const color = "#qwertyui";
    const result = isValidHex(color);

    expect(result).toBeFalsy();
  });

  it("should return false when color is undefined", () => {
    const color = undefined;

    //@ts-expect-error
    const result = isValidHex(color);

    expect(result).toBeFalsy();
  });

  it("should return false when color length is different than 3, 6 or 8", () => {
    const color = "#";
    const result = isValidHex(color);

    expect(result).toBeFalsy();
  });
});
