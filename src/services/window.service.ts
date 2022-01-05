import { singleton } from "tsyringe";
import { Color, Project } from "../models/types";
import { cmd } from "../util/constants";
import { isValidHex } from "../util/validators";
import { VSCode } from "../util/vscode.env";
@singleton()
export class WindowService {
  async defaultInput(label: string, value?: string): Promise<string> {
    const result = value || (await this.input(label));
    if (!result) {
      throw new Error(`No ${label} provided`);
    }
    return result;
  }

  async input(name: string, defaultValue = "", validateInput?: (value: string) => string): Promise<string | undefined> {
    return await VSCode.showInputBox({
      placeHolder: name,
      ignoreFocusOut: true,
      value: defaultValue,
      validateInput,
    });
  }

  async inputColor(name: string, defaultValue: string, colors: Color[]): Promise<Color> {
    const quickPick = await this.quickPickColor(colors);
    if (quickPick) {
      return quickPick;
    }

    //FIXME: this cb is untestable
    /* istanbul ignore next */
    const hex = await this.input(name, defaultValue, (val: string) => (isValidHex(val) ? "" : "Invalid hex color"));
    if (!hex) {
      throw new Error(`No ${name} provided`);
    }
    return { name, value: hex };
  }

  private async quickPickColor(colors: Color[]): Promise<Color | undefined> {
    const quickPickItems = [...colors.map(c => c.name), "Custom"];
    const quickPick = await VSCode.showQuickPick(quickPickItems);
    return colors.find(c => c.name === quickPick);
  }

  async inputPath(label: string, defaultValue = ""): Promise<string> {
    const uri = await VSCode.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      canSelectMany: false,
      openLabel: label,
      defaultUri: VSCode.parse(defaultValue),
    });
    const result = uri?.[0]?.path;
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
