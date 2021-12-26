import {
  window,
  commands,
  InputBoxOptions,
  CancellationToken,
  QuickPickOptions,
  OpenDialogOptions,
  Uri,
  Disposable,
} from "vscode";

export class VSCode {
  public static showInputBox(options?: InputBoxOptions, token?: CancellationToken): Thenable<string | undefined> {
    return window.showInputBox(options, token);
  }

  public static showQuickPick(
    items: readonly string[] | Thenable<readonly string[]>,
    options?: QuickPickOptions,
    token?: CancellationToken
  ): Thenable<string | undefined> {
    return window.showQuickPick(items, options, token);
  }

  public static showErrorMessage(message: string, ...items: string[]): Thenable<string | undefined> {
    return window.showErrorMessage(message, ...items);
  }

  public static showInformationMessage(message: string, ...items: string[]): Thenable<string | undefined> {
    return window.showInformationMessage(message, ...items);
  }

  public static showWarningMessage(message: string, ...items: string[]): Thenable<string | undefined> {
    return window.showWarningMessage(message, ...items);
  }

  public static showOpenDialog(options: OpenDialogOptions): Thenable<Uri[] | undefined> {
    return window.showOpenDialog(options);
  }

  public static registerCommand(command: string, callback: (...args: any[]) => any, thisArg?: any): Disposable {
    return commands.registerCommand(command, callback, thisArg);
  }

  public static executeCommand(command: string, ...args: any[]): Thenable<any> {
    return commands.executeCommand(command, ...args);
  }

  public static parse(path: string): Uri {
    return Uri.parse(path);
  }

  public static file(path: string): Uri {
    return Uri.file(path);
  }
}
