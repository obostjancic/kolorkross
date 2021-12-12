export type Color = `#${string}`;

export interface Group {
  id: string;
  name: string;
  color: Color;
  projects: string[];
}

export type UpdateGroupDTO = Pick<Group, "id" | "name" | "color">;

export interface Project {
  id: string;
  name: string;
  color: Color;
  path: string;
}

export type UpdateProjectDTO = Pick<Project, "id" | "name" | "color" | "path">;
