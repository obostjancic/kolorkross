import { Group, Project } from "../models/types";
import { GroupService } from "../services/group.service";
import { ProjectService } from "../services/project.service";
import * as vscode from "vscode";
import * as path from "path";
import { deleteIcon, editIcon } from "./icons";

const getResource = (context: vscode.ExtensionContext, webview: vscode.Webview, name: string) => {
  const resource = vscode.Uri.file(path.join(context.extensionPath, "src", "ui", name));
  return webview.asWebviewUri(resource);
};

export const dashboardContent = async (
  groupService: GroupService,
  projectService: ProjectService,
  context: vscode.ExtensionContext,
  webview: vscode.Webview
) => {
  const groups = await groupService.findAll();

  const dashboardScript = getResource(context, webview, "dashboardScript.js");
  const style = getResource(context, webview, "style.css");

  const getGroupProjects = async (group: Group) => {
    const projects = await projectService.findAll();
    return projects.filter(project => group.projects.includes(project.id));
  };

  const renderGroup = async (group: Group) => {
    return `
    <div class="group" id="${group.id}">
      <div class="group-name" >
      <h2>${group.name}</h2>  
        <div class="icons group-icons">
          <div class="delete-group delete-icon icon" data-id="${group.id}">${deleteIcon}</div>
          <div class="update-group edit-icon icon" data-id="${group.id}">${editIcon}</div>
        </div>

      </div>
      <div class="group-projects">
        ${(await getGroupProjects(group)).map(renderProject).join("")}
        ${renderAddProject(group.id)}
      </div>
    </div>
  `;
  };

  const renderProject = (project: Project) => {
    return `
    <div class="project" id="${project.id}" data-id="${project.id}">
      <div class="project-name" >
        <div class="icons">
          <div class="delete-project delete-icon icon" data-id="${project.id}">${deleteIcon}</div>
          <div class="update-project edit-icon icon" data-id="${project.id}">${editIcon}</div>
        </div>
        <h3 style="border-color: ${project.color}">${project.name}</h3>
      </div>
      <div class="project-path">
        ${project.path}
      </div>
    </div>
  `;
  };

  const renderAddProject = (groupId: string) => {
    return `
    <div class="create-project icon" data-id="${groupId}">
        <h3> + </h3>
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
      <link rel="stylesheet" href="${style}">
      <title>Document</title>
      <script src="${dashboardScript}"></script>

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
              initDashboardScript();
          }
      })();
  </script>
      </html>
  `;
};
