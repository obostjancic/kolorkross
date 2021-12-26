import { VSCode } from "./vscode.env";

export const handler = (error: Error) => {
  VSCode.showErrorMessage(error.message);
};
