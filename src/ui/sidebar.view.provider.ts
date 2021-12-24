import { singleton } from "tsyringe";
import { WebviewView, WebviewViewProvider } from "vscode";
import { cmd } from "../util/constants";
import { VSCode } from "../util/vscode.env";
@singleton()
export class SidebarDummyDashboardViewProvider implements WebviewViewProvider {
  private _view?: WebviewView;

  resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
    this._view = webviewView;
    // The only job of this "view" is to close itself and open the main project dashboard webview
    this.switchToMainDashboard();
    webviewView.onDidChangeVisibility(this.switchToMainDashboard);
  }

  switchToMainDashboard = () => {
    if (this._view?.visible) {
      VSCode.executeCommand(cmd.VIEW_EXPLORER);
      VSCode.executeCommand(cmd.OPEN_DASHBOARD);
    }
  };
}
