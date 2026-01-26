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

    // Phriction Tests
    const wikiSlug = `test/page/${hash}`;
    const wikiTitle = `Test Page ${hash}`;
    let wikiPHID: PHID<"WIKI">;

    test("should create a wiki page", async () => {
        const result = await client.createPhriction({
            slug: wikiSlug,
            title: wikiTitle,
            content: "Initial content for E2E test",
            description: "E2E Test Page"
        });
        expect(result.phid).toBeDefined();
        expect(result.slug).toBe(wikiSlug);
        expect(result.title).toBe(wikiTitle);
        wikiPHID = result.phid;
    });

    test("should search for a wiki page", async () => {
        const documents = await client.searchPhriction({
            constraints: { paths: [wikiSlug] }
        });
        expect(documents.length).toBeGreaterThan(0);
        expect(documents[0]!.phid).toBe(wikiPHID);
        expect(documents[0]!.fields.path).toBe(wikiSlug);
    });

    test("should edit a wiki page content", async () => {
        const updatedContent = "Updated content for E2E test";
        const result = await client.editPhriction({
            slug: wikiSlug,
            content: updatedContent,
            title: `${wikiTitle} Updated`
        });
        expect(result.phid).toBe(wikiPHID);
        expect(result.content).toBeDefined(); // Assuming response includes it or check via search

        // Verify with search if needed, though edit returns info
    });

    test("should update a wiki page metadata (subscribers)", async () => {
        // Just verify the call succeeds, verifying subscriber addition is hard without a second user
        const result = await client.updatePhriction(wikiPHID, [
            { type: "comment", value: "Adding a comment via metadata update" }
        ]);
        expect(result.phid).toBe(wikiPHID);
    });
});
