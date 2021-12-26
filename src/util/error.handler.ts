import { VSCode } from "./vscode.env";

/* istanbul ignore next */
export const handler = (error: Error) => {
  VSCode.showErrorMessage(error.message);
};
