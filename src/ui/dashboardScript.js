function initDashboardScript() {
  addClickListenerToClass(".project", e => {
    window.vscode.postMessage({
      type: "dash.openProject",
      payload: e.currentTarget.getAttribute("data-id"),
    });
  });

  addClickListenerToClass(".create-project", e => {
    window.vscode.postMessage({
      type: "dash.createProject",
      payload: e.currentTarget.getAttribute("data-id"),
    });
  });

  addClickListenerToClass(".update-group", e => {
    window.vscode.postMessage({
      type: "dash.updateGroup",
      payload: e.currentTarget.getAttribute("data-id"),
    });
  });

  addClickListenerToClass(".delete-group", e => {
    window.vscode.postMessage({
      type: "dash.deleteGroup",
      payload: e.currentTarget.getAttribute("data-id"),
    });
  });

  addClickListenerToClass(".update-project", e => {
    window.vscode.postMessage({
      type: "dash.updateProject",
      payload: e.currentTarget.getAttribute("data-id"),
    });
  });

  addClickListenerToClass(".delete-project", e => {
    window.vscode.postMessage({
      type: "dash.deleteProject",
      payload: e.currentTarget.getAttribute("data-id"),
    });
  });
}

function addClickListenerToClass(className, cb) {
  document.querySelectorAll(className).forEach(element =>
    element.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      cb(e);
    })
  );
}
