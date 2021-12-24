import "reflect-metadata";
import { container } from "tsyringe";
import { token } from "../util/constants";
import { WorkspaceConfigService } from "./workspaceConfig.service";

describe("WorkspaceConfigService", () => {
  let service: WorkspaceConfigService;
  beforeEach(() => {
    container.register(token.WORKSPACE_CONFIG, { useValue: { update: () => {} } });
    container.register(token.CURRENT_PATH, { useValue: "path1" });
    service = container.resolve(WorkspaceConfigService);
  });

  describe("applyConfigToWorkspace", () => {
    const writeWorkspaceConfig = jest.spyOn(WorkspaceConfigService.prototype as any, "writeWorkspaceConfig");
    const updateWorkspaceConfig = jest.spyOn(WorkspaceConfigService.prototype as any, "updateWorkspaceConfig");

    it("Should not apply config to workspace", async () => {
      const project = {
        id: "id1",
        name: "name1",
        path: "path2",
        color: { name: "red", value: "#FF0000" },
      };

      await service.applyConfigToWorkspace(project);
      expect(updateWorkspaceConfig).not.toHaveBeenCalled();
      expect(writeWorkspaceConfig).not.toHaveBeenCalled();
    });

    it("Should apply config to workspace", async () => {
      const project = {
        id: "id1",
        name: "name1",
        path: "path1",
        color: { name: "red", value: "#FF0000" },
      };

      await service.applyConfigToWorkspace(project);
      expect(updateWorkspaceConfig).toHaveBeenCalled();
      expect(writeWorkspaceConfig).toHaveBeenCalled();
    });
  });
});
