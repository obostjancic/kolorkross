export type Color = `#${string}`;

export interface Group {
  id: string;
  name: string;
  color: Color;
  projects: string[];
}

export type UpdateGroupDTO = Partial<Group> & { id: string };

export type CreateGroupDTO = Partial<Group> & { name: string };

export interface Project {
  id: string;
  name: string;
  color: Color;
  path: string;
}

export type UpdateProjectDTO = Partial<Project> & { id: string };

export type CreateProjectDTO = Partial<Project> & { path: string };
