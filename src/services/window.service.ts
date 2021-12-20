import { Service } from "typedi";
import { Color, Project } from "../models/types";
import { cmd } from "../util/constants";
import { Catch } from "../util/decorators";
import { isValidHex } from "../util/validators";
import { VSCode } from "../util/vscode.env";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ShowError = () =>
  Catch((error: Error) => {
    VSCode.showErrorMessage(error.message);
  });

@Service()
export class WindowService {
  async defaultInput(label: string, value?: string): Promise<string> {
    const result = value || (await this.input(label));
    if (!result) {
      throw new Error(`No ${label} provided`);
    }
    return result;
  }

  async input(name: string, defaultValue: string = "", validateInput?: any): Promise<string | undefined> {
    return await VSCode.showInputBox({
      placeHolder: name,
      ignoreFocusOut: true,
      value: defaultValue,
      validateInput,
    });
  }

  async inputColor(name: string, defaultValue: string = "", colors: Color[]): Promise<Color> {
    const quickPick = await this.quickPickColor(colors);
    if (quickPick && quickPick.name !== "Custom") {
      return quickPick;
    }

    const hex = await this.input(name, defaultValue, (val: string) => (isValidHex(val) ? "" : "Invalid hex color"));
    if (!hex) {
      throw new Error(`No ${hex} provided`);
    }
    return { name, value: hex };
  }

  private async quickPickColor(colors: Color[]): Promise<Color | undefined> {
    const quickPickItems = [...colors.map(c => c.name), "Custom"];
    const quickPick = await VSCode.showQuickPick(quickPickItems);
    return colors.find(c => c.name === quickPick);
  }

  async inputPath(label: string, defaultValue: string = ""): Promise<string> {
    const uri = await VSCode.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: label,
      defaultUri: VSCode.parse(defaultValue),
    });
    const result = uri?.[0].path;
    if (!result) {
      throw new Error(`No ${label} provided`);
    }
    return result;
  }

  async confirm(text: string): Promise<boolean> {
    const answer = await VSCode.showInformationMessage(text, ...["Yes", "No"]);
    return answer === "Yes";
  }

  async openProject(project: Project): Promise<void> {
    VSCode.executeCommand(cmd.OPEN_FOLDER, VSCode.file(project.path), true);
  }
}
