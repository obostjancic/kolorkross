import "reflect-metadata";
import Container from "typedi";
import { Color } from "../models/types";
import { token } from "../util/constants";
import { WorkspaceConfigService } from "./workspaceConfig.service";

describe("WorkspaceConfigService", () => {
  let service: WorkspaceConfigService;
  beforeEach(() => {
    Container.set(token.WORKSPACE_CONFIG, { update: () => {} });
    Container.set(token.CURRENT_PATH, "path1");
    service = new WorkspaceConfigService();
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
