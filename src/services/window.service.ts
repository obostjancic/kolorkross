import { Service } from "typedi";
import * as vscode from "vscode";
import { Color } from "../models/types";
import { Catch } from "../util/decorators";
import { isValidHex } from "../util/validators";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ShowError = () =>
  Catch((error: Error) => {
    vscode.window.showErrorMessage(error.message);
  });

@Service()
export class WindowService {
  async validatedInput(label: string, value?: string): Promise<string> {
    const result = value || (await this.input(label));
    if (!result) {
      throw new Error(`No ${label} provided`);
    }
    return result;
  }

  async input(name: string, defaultValue: string = "", validateInput?: any): Promise<string | undefined> {
    return await vscode.window.showInputBox({
      placeHolder: name,
      ignoreFocusOut: true,
      value: defaultValue,
      validateInput,
    });
  }

  async inputColor(name: string, defaultValue: string = ""): Promise<Color> {
    return (await this.input(name, defaultValue, (val: string) =>
      isValidHex(val) ? "" : "Invalid hex color"
    )) as Color;
  }

  async inputPath(label: string, defaultValue: string = ""): Promise<string> {
    const uri = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: label,
      defaultUri: vscode.Uri.parse(defaultValue),
    });
    const result = uri?.[0].path;
    if (!result) {
      throw new Error(`No ${label} provided`);
    }
    return result;
  }

  async confirm(text: string): Promise<boolean> {
    const answer = await vscode.window.showInformationMessage(text, ...["Yes", "No"]);
    return answer === "Yes";
  }
}
