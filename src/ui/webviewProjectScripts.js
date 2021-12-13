function initProjects() {
  console.log("initProjects");
  document.querySelectorAll('[data-action="project-click"]').forEach(project =>
    project.addEventListener("click", e => {
      window.vscode.postMessage({
        type: "open-project",
        projectId: e.currentTarget.id,
      });
    })
  );
}
