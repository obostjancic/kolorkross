import { Uri, Webview, ExtensionMode } from "vscode";

function getUri(webview: Webview, extensionUri: Uri, pathList: string[]) {
  return webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList));
}

function getUriProd(webview: Webview, extensionUri: Uri, pathList: string[]) {
  if (pathList[0] === "node_modules") {
    pathList[0] = "vendor";
  }
  return getUri(webview, extensionUri, pathList);
}

export const getResource = (
  webview: Webview,
  extensionUri: Uri,
  pathList: string[],
  runMode: ExtensionMode = ExtensionMode.Development
) => {
  if (runMode === ExtensionMode.Development) {
    return getUri(webview, extensionUri, pathList);
  }
  return getUriProd(webview, extensionUri, pathList);
};
