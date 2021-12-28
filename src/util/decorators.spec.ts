import { CatchError } from "./decorators";

jest.mock("./error.handler", jest.fn());

class Test {
  @CatchError(Error, jest.fn())
  public thrower() {
    throw new Error("test");
  }

  @CatchError(Error, () => {
    return "Async error handled";
  })
  public async throwerAsync() {
    await Promise.resolve(setTimeout(jest.fn(), 1000));
    throw new Error("test");
  }

  @CatchError(Error, jest.fn())
  public notThrowing() {
    return "Not throwing";
  }

  @CatchError(Error, () => {
    throw new Error("Can not handle this error");
  })
  public throwerUnhandled() {
    /* eslint-disable-next-line no-throw-literal */
    throw null;
  }

  //@ts-expect-error - testing for null handler, even though ts should not allow it
  @CatchError(Error, null)
  public throwerNull() {
    throw new Error("Regular error");
  }
}

describe("CatchError", () => {
  it("Should catch error of function", () => {
    const test = new Test();
    const res = test.thrower();

    expect(res).toBeUndefined();
  });

  it("Should catch error of async function", async () => {
    const test = new Test();
    const res = await test.throwerAsync();

    expect(res).toBeUndefined();
  });

  it("Should pass method result", () => {
    const test = new Test();
    const res = test.notThrowing();

    expect(res).toBe("Not throwing");
  });

  it("Should throw error if it can not handle it", () => {
    const test = new Test();

    expect(test.throwerUnhandled).toThrow();
  });

  it("Should throw error if handler is not a function", () => {
    const test = new Test();

    expect(test.throwerNull).toThrow();
  });
});
