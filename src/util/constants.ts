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
}

export namespace token {
  export const URI = "uri";
  export const RUN_MODE = "runMode";
  export const CURRENT_PATH = "currentPath";
  export const GLOBAL_STATE = "globalState";
  export const SUBSCRIPTIONS = "subscriptions";
  export const WORKSPACE_CONFIG = "workspaceConfig";
}

export const DASHBOARD_VIEW_ID = "dash.dashboard";

export const PREDEFINED_COLORS: Color[] = [
  { name: "purple", value: "#c678dd" },

  { name: "red", value: "#f44747" },

  { name: "coral", value: "#e06c75" },

  { name: "whiskey", value: "#d19a66" },
  { name: "chalky", value: "#E5C07B" },
  { name: "lightDark", value: "#7F848E" },
  { name: "dark", value: "#5C63701" },
  { name: "malibu", value: "#61AFEF" },
  { name: "green", value: "#98c379" },
  { name: "fountainBlue", value: "#56b6c2" },
  { name: "white", value: "#FFFFFF" },
  { name: "lightwhite", value: "#abb2bf" },
];
