import * as vscode from "vscode";

import { injectable } from "tsyringe";
@injectable()
export class VSCode {
  public static showInputBox(
    options?: vscode.InputBoxOptions,
    token?: vscode.CancellationToken
  ): Thenable<string | undefined> {
    return vscode.window.showInputBox(options, token);
  }

  public static showQuickPick(
    items: readonly string[] | Thenable<readonly string[]>,
    options?: vscode.QuickPickOptions,
    token?: vscode.CancellationToken
  ): Thenable<string | undefined> {
    return vscode.window.showQuickPick(items, options, token);
  }

  public static showErrorMessage(message: string, ...items: string[]): Thenable<string | undefined> {
    return vscode.window.showErrorMessage(message, ...items);
  }

  public static showInformationMessage(message: string, ...items: string[]): Thenable<string | undefined> {
    return vscode.window.showInformationMessage(message, ...items);
  }

  public static showWarningMessage(message: string, ...items: string[]): Thenable<string | undefined> {
    return vscode.window.showWarningMessage(message, ...items);
  }

  public static showOpenDialog(options: vscode.OpenDialogOptions): Thenable<vscode.Uri[] | undefined> {
    return vscode.window.showOpenDialog(options);
  }

  public static registerCommand(command: string, callback: (...args: any[]) => any, thisArg?: any): vscode.Disposable {
    return vscode.commands.registerCommand(command, callback, thisArg);
  }

  public static executeCommand(command: string, ...args: any[]): Thenable<any> {
    return vscode.commands.executeCommand(command, ...args);
  }

  public static parse(path: string): vscode.Uri {
    return vscode.Uri.parse(path);
  }

  public static file(path: string): vscode.Uri {
    return vscode.Uri.file(path);
  }
}
