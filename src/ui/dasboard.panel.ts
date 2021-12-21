import { Container } from "typedi";
import * as vscode from "vscode";
import { DASHBOARD_VIEW_ID, token } from "../util/constants";
import { group } from "./components/Group";
import { header } from "./components/Header";
import { DashboardService, EventMessage } from "./dasboard.service";
import { getResource } from "../util/loaders";

export class DashboardPanel {
  public static currentPanel: DashboardPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private readonly dashboardService: DashboardService = Container.get(DashboardService);

  private constructor(panel: vscode.WebviewPanel, private readonly extensionUri: vscode.Uri) {
    this._panel = panel;
    this._panel.onDidDispose(this.dispose, null, this._disposables);
    this._setWebviewMessageListener(this._panel.webview);
  }

  public async setContent() {
    this._panel.webview.html = await this._getWebviewContent(this._panel.webview, this.extensionUri);
  }

  public static async render() {
    if (DashboardPanel.currentPanel) {
      DashboardPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel(DASHBOARD_VIEW_ID, "Kolor Kross", vscode.ViewColumn.One, {
        enableScripts: true,
      });

      DashboardPanel.currentPanel = new DashboardPanel(panel, Container.get<vscode.Uri>(token.URI));
      await DashboardPanel.currentPanel.setContent();
    }
  }

  public dispose() {
    DashboardPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private async _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    const runMode = Container.get<vscode.ExtensionMode>(token.RUN_MODE);
    const scriptUri = getResource(webview, extensionUri, ["media", "dashboardScript.js"], runMode);
    const stylesUri = getResource(webview, extensionUri, ["media", "style.css"], runMode);
    const codiconsUri = getResource(
      webview,
      extensionUri,
      ["node_modules", "@vscode", "codicons", "dist", "codicon.css"],
      runMode
    );
    const toolkitUri = getResource(
      webview,
      extensionUri,
      ["node_modules", "@vscode", "webview-ui-toolkit", "dist", "toolkit.js"],
      runMode
    );

    const groups = await this.dashboardService.getGroups();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <script type="module" src="${toolkitUri}"></script>
        <script type="module" src="${scriptUri}"></script>
        <link href="${codiconsUri}" rel="stylesheet" />
        <link href="${stylesUri}" rel="stylesheet" />
      </head>
      <body>
        ${header()}
        ${groups.map(group).join("")}
      </body>
    </html>
    `;
  }

  private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      async (message: EventMessage) => {
        await this.dashboardService.handleCommand(message.command, message.payload);
        await DashboardPanel?.currentPanel?.setContent();
      },
      undefined,
      this._disposables
    );
  }
}
