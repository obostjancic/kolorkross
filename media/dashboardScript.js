const vscode = acquireVsCodeApi();

window.addEventListener("load", initDashboardScript);

function initDashboardScript() {
  addClickListenerToClass(".project", e => {
    vscode.postMessage({
      command: "dash.openProject",
      payload: e.currentTarget.getAttribute("data-id"),
    });
  });

  addClickListenerToClass(".create-project", e => {
    vscode.postMessage({
      command: "dash.createProject",
      payload: e.currentTarget.getAttribute("data-id"),
    });
  });

  addClickListenerToClass(".update-group", e => {
    vscode.postMessage({
      command: "dash.updateGroup",
      payload: e.currentTarget.getAttribute("data-id"),
    });
  });

  addClickListenerToClass(".delete-group", e => {
    vscode.postMessage({
      command: "dash.deleteGroup",
      payload: e.currentTarget.getAttribute("data-id"),
    });
  });

  addClickListenerToClass(".update-project", e => {
    vscode.postMessage({
      command: "dash.updateProject",
      payload: e.currentTarget.getAttribute("data-id"),
    });
  });

  addClickListenerToClass(".delete-project", e => {
    console.log("deleting project", e.currentTarget.getAttribute("data-id"));
    vscode.postMessage({
      command: "dash.deleteProject",
      payload: e.currentTarget.getAttribute("data-id"),
    });
  });
}

function addClickListenerToClass(className, cb) {
  document.querySelectorAll(className).forEach(element =>
    element.addEventListener("click", e => {
      console.log("adding click listener to class", className);
      e.preventDefault();
      e.stopPropagation();
      cb(e);
    })
  );
}
