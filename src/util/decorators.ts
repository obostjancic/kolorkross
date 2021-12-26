import { handler } from "./error.handler";
import { VSCode } from "./vscode.env";

/* eslint-disable @typescript-eslint/naming-convention */
type HandlerFunction = (error: Error, ctx: any) => void;

export const CatchError = (errorType: any, handler: HandlerFunction): any => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Save a reference to the original method
    const originalMethod = descriptor.value;

    // Rewrite original method with try/catch wrapper
    descriptor.value = function (...args: any[]) {
      try {
        const result = originalMethod.apply(this, args);

        // Check if method is asynchronous
        if (result && result instanceof Promise) {
          // Return promise
          return result.catch((error: any) => {
            _handleError(this, errorType, handler, error);
          });
        }

        // Return actual result
        return result;
      } catch (error) {
        if (typeof error === "object" && error instanceof Error) {
          _handleError(this, errorType, handler, error);
        } else {
          throw error;
        }
      }
    };

    return descriptor;
  };
};

export const Catch = (handler: HandlerFunction): any => CatchError(Error, handler);

function _handleError(ctx: any, errorType: any, handler: HandlerFunction, error: Error) {
  // Check if error is instance of given error type
  if (typeof handler === "function" && error instanceof errorType) {
    // Run handler with error object and class context
    handler.call(null, error, ctx);
  } else {
    // Throw error further
    // Next decorator in chain can catch it
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ShowError = () => {
  return Catch(handler);
};
