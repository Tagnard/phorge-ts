import { describe, test, expect } from "vitest";
import { Client } from "./client.js";
import * as dotenv from "dotenv";
import type { PHID } from "./models/phorge.js";
import crypto from "node:crypto";

dotenv.config();

const uri = process.env.PHORGE_URI;
const token = process.env.PHORGE_TOKEN;

describe("Client E2E", () => {
    if (!uri || !token) {
        test.skip("PHORGE_URI and PHORGE_TOKEN must be set for E2E tests", () => {});
        return;
    }

    const client = new Client(uri, token);
    const hash = crypto.randomBytes(4).toString("hex");
    const projectName = `Test Project ${hash}`;
    const taskTitle = `Test Task ${hash}`;

    let projectPHID: PHID<"PROJ">;
    let taskPHID: PHID<"TASK">;

    test("should create a project", async () => {
        const result = await client.createProject([
            { type: "name", value: projectName },
            { type: "description", value: "E2E Test Project" }
        ]);
        expect(result.phid).toBeDefined();
        projectPHID = result.phid as PHID<"PROJ">;

        const projects = await client.searchProject({
            constraints: { phids: [projectPHID] }
        });
        expect(projects.length).toBe(1);
        expect(projects[0]!.fields.name).toBe(projectName);
    });

    test("should update a project", async () => {
        const updatedName = `${projectName} Updated`;
        await client.updateProject(projectPHID, [
            { type: "name", value: updatedName }
        ]);

        const projects = await client.searchProject({
            constraints: { phids: [projectPHID] }
        });
        expect(projects[0]!.fields.name).toBe(updatedName);
    });

    test("should create a task", async () => {
        const result = await client.createManiphest([
            { type: "title", value: taskTitle },
            { type: "description", value: "E2E Test Task" },
            { type: "projects.add", value: [projectPHID] }
        ]);
        expect(result.phid).toBeDefined();
        taskPHID = result.phid as PHID<"TASK">;

        const tasks = await client.searchManiphest({
            constraints: { phids: [taskPHID] },
            attachments: { projects: true }
        });
        expect(tasks.length).toBe(1);
        expect(tasks[0]!.fields.name).toBe(taskTitle);
        expect(tasks[0]!.attachments.projects.projectPHIDs).toContain(projectPHID);
    });

    test("should update a task", async () => {
        const updatedTitle = `${taskTitle} Updated`;
        await client.updateManiphest(taskPHID, [
            { type: "title", value: updatedTitle }
        ]);

        const tasks = await client.searchManiphest({
            constraints: { phids: [taskPHID] }
        });
        expect(tasks[0]!.fields.name).toBe(updatedTitle);
    });

    test("should search users", async () => {
        const users = await client.searchUser({ limit: 5 });
        expect(users.length).toBeGreaterThan(0);
    });

    test("should search transactions", async () => {
        const transactions = await client.searchTransaction({
            objectIdentifier: taskPHID,
            limit: 5
        });
        expect(transactions.length).toBeGreaterThan(0);
    });

    test("should search maniphest priorities", async () => {
        const priorities = await client.searchManiphestPriority();
        expect(priorities.length).toBeGreaterThan(0);
        expect(priorities[0]).toHaveProperty("name");
        expect(priorities[0]).toHaveProperty("value");
    });

    test("should search maniphest statuses", async () => {
        const statuses = await client.searchManiphestStatus();
        expect(statuses.length).toBeGreaterThan(0);
        expect(statuses[0]).toHaveProperty("name");
        expect(statuses[0]).toHaveProperty("value");
    });

    test("cleanup: close task", async () => {
        if (!taskPHID) return;

        await client.updateManiphest(taskPHID, [
            { type: "status", value: "closed" }
        ]);

        const tasks = await client.searchManiphest({
            constraints: { phids: [taskPHID] }
        });
        expect(tasks[0]!.fields.status.value).toBe("closed");
    });
});
