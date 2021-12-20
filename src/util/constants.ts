import { Color } from "../models/types";

export namespace cmd {
  export const CREATE_GROUP = "dash.createGroup";
  export const UPDATE_GROUP = "dash.updateGroup";
  export const DELETE_GROUP = "dash.deleteGroup";

  export const OPEN_PROJECT = "dash.openProject";
  export const CREATE_PROJECT = "dash.createProject";
  export const UPDATE_PROJECT = "dash.updateProject";
  export const DELETE_PROJECT = "dash.deleteProject";

  export const OPEN_DASHBOARD = "dash.openDashboard";

  export const VIEW_EXPLORER = "workbench.view.explorer";

  export const OPEN_FOLDER = "vscode.openFolder";
}

export namespace token {
  export const URI = "uri";
  export const RUN_MODE = "runMode";
  export const CURRENT_PATH = "currentPath";
  export const GLOBAL_STATE = "globalState";
  export const SUBSCRIPTIONS = "subscriptions";
  export const WORKSPACE_CONFIG = "workspaceConfig";
}

export namespace section {
  export const PROJECTS = "projects";
  export const GROUPS = "groups";
}

export const DASHBOARD_VIEW_ID = "dash.dashboard";

export const PREDEFINED_COLORS: Color[] = [
  { name: "Purple", value: "#c678dd" },
  { name: "Red", value: "#f44747" },
  { name: "Coral", value: "#e06c75" },
  { name: "Whiskey", value: "#d19a66" },
  { name: "Chalky", value: "#E5C07B" },
  { name: "Light dark", value: "#7F848E" },
  { name: "Dark", value: "#5C63701" },
  { name: "Malibu", value: "#61AFEF" },
  { name: "Green", value: "#98c379" },
  { name: "Fountain blue", value: "#56b6c2" },
  { name: "White", value: "#FFFFFF" },
  { name: "Light White", value: "#abb2bf" },
];
