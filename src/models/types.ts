export type Color = {
  name: string;
  value: string;
};

export type Group = {
  id: string;
  name: string;
  projects: string[];
};

export type UpdateGroupDTO = Partial<Group> & { id: string };

export type CreateGroupDTO = Partial<Group> & { name: string };

export type Project = {
  id: string;
  name: string;
  color: Color;
  path: string;
};

export type UpdateProjectDTO = Partial<Project> & { id: string };

export type CreateProjectDTO = Partial<Project> & { path: string };
