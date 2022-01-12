import { container } from "tsyringe";
import { GroupService } from "../../services/group.service";

const addGroupOrder = async () => {
    const groupService = container.resolve(GroupService);
    const groups = await groupService.findAll();
    groups.forEach((group, idx) => {
        groupService.update({ ...group, order: idx });
    });
}

export default addGroupOrder;