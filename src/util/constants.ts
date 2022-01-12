/* eslint-disable @typescript-eslint/no-namespace */
import { Color } from "../models/types";

export enum Direction {
  up = "up",
  down = "down",
}

export namespace cmd {
  export const CREATE_GROUP = "kolorkross.createGroup";
  export const UPDATE_GROUP = "kolorkross.updateGroup";
  export const DELETE_GROUP = "kolorkross.deleteGroup";
  export const UPDATE_GROUP_ORDER = "kolorkross.updateGroupOrder";

  export const OPEN_PROJECT = "kolorkross.openProject";
  export const CREATE_PROJECT = "kolorkross.createProject";
  export const UPDATE_PROJECT = "kolorkross.updateProject";
  export const UPDATE_PROJECT_ORDER = "kolorkross.updateProjectOrder";
  export const DELETE_PROJECT = "kolorkross.deleteProject";

  export const OPEN_DASHBOARD = "kolorkross.openDashboard";

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
  export const MIGRATIONS = "migrations";
}

export const DASHBOARD_VIEW_ID = "kolorkross.dashboard";

export const PREDEFINED_COLORS: Color[] = [
  { name: "Palatinate Purple", value: "#682D63" },
  { name: "Purple", value: "#c678dd" },
  { name: "Opera Mauve", value: "#BA7BA1" },
  { name: "Auburn", value: "#A22C29" },
  { name: "Tart Orange", value: "#DD5F5F" },
  { name: "Orange Soda", value: "#E16D56" },
  { name: "Candy Pink", value: "#E06C75" },
  { name: "Tan Crayola", value: "#D19A66" },
  { name: "Gold Crayola", value: "#E5C07B" },
  { name: "Maximum Yellow Red", value: "#E8B85E" },
  { name: "Minion Yellow", value: "#E7D374" },
  { name: "Blue Jeans", value: "#61AFEF" },
  { name: "Sapphire Blue", value: "#006AA3" },
  { name: "Maximum Blue Green", value: "#64ABB4" },
  { name: "Pistachio", value: "#98C379" },
  { name: "Maximum Green", value: "#587F3D" },
  { name: "Steel Teal", value: "#648381" },
  { name: "Davys Grey", value: "#575761" },
];
