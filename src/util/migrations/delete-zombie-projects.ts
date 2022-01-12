import { container } from "tsyringe";
import { GroupService } from "../../services/group.service";
import { ProjectService } from "../../services/project.service";

const doesProjectExist = async (projectId: string) => {
  try {
    const projectService = container.resolve(ProjectService);
    await projectService.findById(projectId);
    return true;
  } catch (err) {
    return false;
  }
};

const deleteZombieProjects = async () => {
  const groupService = container.resolve(GroupService);
  const groups = await groupService.findAll();
  for (const group of groups) {
    for (const projectId of group.projects) {
      if (!(await doesProjectExist(projectId))) {
        group.projects = group.projects.filter(p => p !== projectId);
      }
    }
    await groupService.update(group);
  }
};

export default deleteZombieProjects;
