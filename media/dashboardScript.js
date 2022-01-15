const vscode = acquireVsCodeApi();

window.addEventListener("load", initDashboardScript);

function initDashboardScript() {
  addClickListenerToClass(".project", e => {
    vscode.postMessage({
      command: "kolorkross.openProject",
      payload: [e.currentTarget.getAttribute("data-id")],
    });
  });

  addClickListenerToClass(".create-project", e => {
    vscode.postMessage({
      command: "kolorkross.createProject",
      payload: [e.currentTarget.getAttribute("data-id")],
    });
  });

  addClickListenerToClass(".create-group", e => {
    vscode.postMessage({
      command: "kolorkross.createGroup",
      payload: [],
    });
  });

  addClickListenerToClass(".update-group", e => {
    vscode.postMessage({
      command: "kolorkross.updateGroup",
      payload: [e.currentTarget.getAttribute("data-id")],
    });
  });

  addClickListenerToClass(".move-group-up", e => {
    vscode.postMessage({
      command: "kolorkross.updateGroupOrder",
      payload: [e.currentTarget.getAttribute("data-id"), "up"],
    });
  });

  addClickListenerToClass(".move-group-down", e => {
    vscode.postMessage({
      command: "kolorkross.updateGroupOrder",
      payload: [e.currentTarget.getAttribute("data-id"), "down"],
    });
  });

  addClickListenerToClass(".delete-group", e => {
    vscode.postMessage({
      command: "kolorkross.deleteGroup",
      payload: [e.currentTarget.getAttribute("data-id")],
    });
  });

  addClickListenerToClass(".update-project", e => {
    vscode.postMessage({
      command: "kolorkross.updateProject",
      payload: [e.currentTarget.getAttribute("data-id")],
    });
  });

  addClickListenerToClass(".delete-project", e => {
    vscode.postMessage({
      command: "kolorkross.deleteProject",
      payload: [e.currentTarget.getAttribute("data-id")],
    });
  });

  addClickListenerToClass(".move-project-up", e => {
    vscode.postMessage({
      command: "kolorkross.updateProjectOrder",
      payload: [e.currentTarget.getAttribute("data-group-id"), e.currentTarget.getAttribute("data-id"), "up"],
    });
  });

  addClickListenerToClass(".move-project-down", e => {
    vscode.postMessage({
      command: "kolorkross.updateProjectOrder",
      payload: [e.currentTarget.getAttribute("data-group-id"), e.currentTarget.getAttribute("data-id"), "down"],
    });
  });

  addSearchFilter();
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

function addSearchFilter() {
  document.querySelector("#search-input").addEventListener("keyup", e => {
    const searchTerm = e.currentTarget.value?.trim();
    const projectDivs = document.querySelectorAll(".project");
    projectDivs.forEach(projectDiv => {
      const moveProjectIcons = projectDiv.querySelector(".move-project");

      const projectName = projectDiv.querySelector(".project-name").innerText;
      const match = projectName.toLowerCase().includes(searchTerm.toLowerCase().trim());
      const isVisible = searchTerm.length === 0 || match;
      const isMoveable = isVisible && !match;
      
      if (isVisible) {
        projectDiv.style.display = "flex";
        moveProjectIcons.style.display = "none";
      } else {
        projectDiv.style.display = "none";
      }

      if (isMoveable) {
        projectDiv.style.display = "flex";
        moveProjectIcons.style.display = "flex";
      }
    });
  });
}
