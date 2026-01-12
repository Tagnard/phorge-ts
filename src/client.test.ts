import { afterEach, describe, expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

import { Client } from "./client.js";
import { PhorgeError } from "./models/phorge.js";
import { SearchProjectResult } from "./models/project.js";
import { SearchTaskResult } from "./models/maniphest.js";

const fetchMocker = createFetchMock(vi);

fetchMocker.enableMocks();

afterEach(() => {
    fetchMocker.resetMocks();
});

describe("Client", () => {
    const client = new Client("https://example.com", "test-token");

    describe("searchProject", () => {
        test("should return a list of projects on success", async () => {
            const mockResponse: SearchProjectResult[] = [
                {
                    id: 1,
                    phid: "PHID-PROJ-123",
                    fields: {
                        name: "Test Project",
                        description: "A test project",
                        slug: "test-project",
                        milestone: 1,
                        depth: 1,
                        parent: null,
                        color: { key: "blue", name: "Blue" },
                        icon: { key: "check", name: "Check" },
                        image: null,
                        dateCreated: 1629878400,
                        dateModified: 1629878400,
                        policy: { view: "public", edit: "users" },
                    },
                    attachments: {},
                },
            ];

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { data: mockResponse }, error_code: null, error_info: null }));

            const projects = await client.searchProject();

            expect(projects).toEqual(mockResponse);
            expect(fetchMocker.mock.calls.length).toBe(1);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_NOT_FOUND", error_info: "Project not found" }));

            await expect(client.searchProject()).rejects.toThrow(PhorgeError);
        });
    });

    describe("createProject", () => {
        test("should return a new project object on success", async () => {
            const mockResponse = { id: "2", phid: "PHID-PROJ-456" };

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { object: mockResponse }, error_code: null, error_info: null }));

            const newProject = await client.createProject({ name: "New Project" });

            expect(newProject).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_INVALID", error_info: "Invalid data" }));

            await expect(client.createProject({ name: "New Project" })).rejects.toThrow(PhorgeError);
        });
    });

    describe("searchTask", () => {
        test("should return a list of tasks on success", async () => {
            const mockResponse: SearchTaskResult[] = [
                {
                    id: 1,
                    phid: "PHID-TASK-123",
                    fields: {
                        name: "Test Task",
                        description: { raw: "A test task" },
                        authorPHID: "PHID-USER-1",
                        ownerPHID: "PHID-USER-2",
                        status: { value: "open", name: "Open", color: "blue" },
                        priority: { value: "high", name: "High", color: "red" },
                        points: 5,
                        subtype: "default",
                        closePHID: null,
                        dateClosed: null,
                        groupByProjectPHID: null,
                        spacePHID: "PHID-SPCE-1",
                        dateCreated: 1629878400,
                        dateModified: 1629878400,
                        policy: { view: "public", edit: "users" },
                    },
                    attachments: {},
                },
            ];

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { data: mockResponse }, error_code: null, error_info: null }));

            const tasks = await client.searchTask();

            expect(tasks).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_NOT_FOUND", error_info: "Task not found" }));

            await expect(client.searchTask()).rejects.toThrow(PhorgeError);
        });
    });

    describe("createTask", () => {
        test("should return a new task object on success", async () => {
            const mockResponse = { id: "2", phid: "PHID-TASK-456" };

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { object: mockResponse }, error_code: null, error_info: null }));

            const newTask = await client.createTask({ title: "New Task" });

            expect(newTask).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_INVALID", error_info: "Invalid data" }));

            await expect(client.createTask({ title: "New Task" })).rejects.toThrow(PhorgeError);
        });
    });

    describe("updateTask", () => {
        test("should return an updated task object on success", async () => {
            const mockResponse = { id: "1", phid: "PHID-TASK-123" };

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { object: mockResponse }, error_code: null, error_info: null }));

            const updatedTask = await client.updateTask("PHID-TASK-123", { title: "Updated Task" });

            expect(updatedTask).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_INVALID", error_info: "Invalid data" }));

            await expect(client.updateTask("PHID-TASK-122", { title: "Updated Task" })).rejects.toThrow(PhorgeError);
        });
    });

    describe("searchUser", () => {
        test("should return a list of users on success", async () => {
            const mockResponse = [{
                id: 1,
                type: "USER",
                phid: "PHID-USER-123",
                fields: {
                    username: "testuser",
                    realName: "Test User",
                    roles: [],
                    dateCreated: 1629878400,
                    dateModified: 1629878400,
                    policy: { view: "public", edit: "users" },
                },
                attachments: {},
            }];

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { data: mockResponse }, error_code: null, error_info: null }));

            const users = await client.searchUser();

            expect(users).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_NOT_FOUND", error_info: "User not found" }));

            await expect(client.searchUser()).rejects.toThrow(PhorgeError);
        });
    });

    describe("searchTransaction", () => {
        test("should return a list of transactions on success", async () => {
            const mockResponse = [{
                id: 1,
                phid: "PHID-XACT-123",
                type: "comment",
                authorPHID: "PHID-USER-1",
                objectPHID: "PHID-TASK-1",
                dateCreated: 1629878400,
                dateModified: 1629878400,
                groupID: "group-1",
                comments: [],
            }];

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { data: mockResponse }, error_code: null, error_info: null }));

            const transactions = await client.searchTransaction();

            expect(transactions).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_NOT_FOUND", error_info: "Transaction not found" }));

            await expect(client.searchTransaction()).rejects.toThrow(PhorgeError);
        });
    });
});
