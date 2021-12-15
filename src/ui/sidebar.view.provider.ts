import { injectable } from "tsyringe";
import * as vscode from "vscode";
import { cmd } from "../util/constants";

@injectable()
export class SidebarDummyDashboardViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
    this._view = webviewView;
    // The only job of this "view" is to close itself and open the main project dashboard webview
    this.switchToMainDashboard();
    webviewView.onDidChangeVisibility(this.switchToMainDashboard);
  }

  switchToMainDashboard = () => {
    if (this._view?.visible) {
      vscode.commands.executeCommand(cmd.VIEW_EXPLORER);
      vscode.commands.executeCommand(cmd.OPEN_DASHBOARD);
    }
  };
}
