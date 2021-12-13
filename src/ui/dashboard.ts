import { Group, Project } from "../models/types";
import { GroupService } from "../services/group.service";
import { ProjectService } from "../services/project.service";
import * as vscode from "vscode";
import * as path from "path";

function getMediaResource(context: vscode.ExtensionContext, webview: vscode.Webview, name: string) {
  let resource = vscode.Uri.file(path.join(context.extensionPath, "src", "ui", name));
  resource = webview.asWebviewUri(resource);

  return resource;
}

export const dashboardContent = async (
  groupService: GroupService,
  projectService: ProjectService,
  context: vscode.ExtensionContext,
  webview: vscode.Webview
) => {
  const groups = await groupService.findAll();

  var projectScriptsPath = getMediaResource(context, webview, "webviewProjectScripts.js");

  const renderGroup = async (group: Group) => {
    return `
    <div class="group">
      <div class="group-name" style="border-color: ${group.color}">
        <h2>${group.name}</h2>
      </div>
      <div class="group-projects">
        ${(
          await Promise.all(
            group.projects.map(async projectId => renderProject(await projectService.findById(projectId)))
          )
        ).join("")}
        ${renderAddProject()}
      </div>
    </div>
  `;
  };

  const renderProject = (project: Project) => {
    return `
    <div class="project" id="${project.id}" data-action="project-click">
      <div class="project-name" style="border-color: ${project.color}">
        <h3>${project.name}</h3>
      </div>
      <div class="project-path">
        ${project.path}
      </div>
    </div>
  `;
  };

  const renderAddProject = () => {
    return `
    <div class="project">
      <div class="project-name" style="border-color: #FFF0">
        <h3>Add Project</h3>
      </div>
      <div class="project-path">
        +
      </div>
    </div>
  `;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <style>${css}</style>
      <title>Document</title>
      <script src="${projectScriptsPath}"></script>

      </head>
      <body>
        <div class="container">
        <h1>Dashboard</h1>  
        ${(await Promise.all(groups.map(renderGroup))).join("")}
      <body>  
      
      <script>
      (function() {
          window.vscode = acquireVsCodeApi();
          
          window.onload = () => {
              initProjects();
          }
      })();
  </script>
      </html>
  `;
};

const css = `
  .group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .group-name {
    border-bottom: 2px solid;
  }

  .group-name h2 {
      margin-bottom: 0.5em;
  }

  .group-projects {
    display: flex;
    flex-direction: row;
  }

  .project {
    display: flex;
    flex-direction: column;
    border: 1px solid;
    border-radius: 2px;
    margin: 0.5em 1em 0.5em 0;
    padding: 0 1em 1em 1em;
  }
  .project-name {
    border-bottom: 2px solid;
  }
  .project-name h3 {
    margin-bottom: 0.25em;
}
`;
