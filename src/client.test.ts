import { afterEach, describe, expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

import { Client } from "./client.js";
import { PhorgeError } from "./models/phorge.js";
import { Project } from "./models/project.js";
import { ManiphestTask, ManiphestPriority, ManiphestStatus } from "./models/maniphest.js";
import { PhrictionDocument, PhrictionInfo } from "./models/phriction.js";

const fetchMocker = createFetchMock(vi);

fetchMocker.enableMocks();

afterEach(() => {
    fetchMocker.resetMocks();
});

describe("Client", () => {
    const client = new Client("https://example.com", "test-token");

    describe("searchProject", () => {
        test("should return a list of projects on success", async () => {
            const mockResponse: Project[] = [
                {
                    id: 1,
                    type: "PROJ",
                    phid: "PHID-PROJ-123",
                    fields: {
                        name: "Test Project",
                        description: "A test project",
                        slug: "test-project",
                        subtype: "default",
                        milestone: 1,
                        depth: 1,
                        parent: null,
                        color: { key: "blue", name: "Blue" },
                        icon: { key: "check", name: "Check", icon: "fa-check" },
                        status: "active",
                        spacePHID: null,
                        dateCreated: 1629878400,
                        dateModified: 1629878400,
                        policy: { view: "public", edit: "users", join: "users" },
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

        test("should return a list of projects with attachments on success", async () => {
            const mockResponse: Project[] = [
                {
                    id: 1,
                    type: "PROJ",
                    phid: "PHID-PROJ-vg4ynenht5xkrgdwaoyj",
                    fields: {
                        name: "One",
                        slug: "one",
                        subtype: "default",
                        milestone: null,
                        depth: 0,
                        parent: null,
                        icon: {
                            key: "project",
                            name: "Project",
                            icon: "fa-briefcase",
                        },
                        color: {
                            key: "blue",
                            name: "Blue",
                        },
                        status: "active",
                        spacePHID: null,
                        dateCreated: 1767701677,
                        dateModified: 1767797148,
                        policy: {
                            view: "users",
                            edit: "users",
                            join: "users",
                        },
                        description: null,
                    },
                    attachments: {
                        members: {
                            members: [
                                {
                                    phid: "PHID-USER-pem4jdwjvmsensfmkfxt",
                                },
                            ],
                        },
                        watchers: {
                            watchers: [
                                {
                                    phid: "PHID-USER-pem4jdwjvmsensfmkfxt",
                                },
                            ],
                        },
                        ancestors: {
                            ancestors: [],
                        },
                    },
                },
            ];

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { data: mockResponse }, error_code: null, error_info: null }));

            const projects = await client.searchProject({
                attachments: {
                    members: true,
                    watchers: true,
                    ancestors: true,
                },
            });

            expect(projects).toEqual(mockResponse);
        });
    });

    describe("createProject", () => {
        test("should return a new project object on success", async () => {
            const mockResponse = { id: "2", phid: "PHID-PROJ-456" };

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { object: mockResponse }, error_code: null, error_info: null }));

            const newProject = await client.createProject([{ type: "name", value: "New Project" }]);

            expect(newProject).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_INVALID", error_info: "Invalid data" }));

            await expect(client.createProject([{ type: "name", value: "New Project" }])).rejects.toThrow(PhorgeError);
        });
    });

    describe("updateProject", () => {
        test("should return an updated project object on success", async () => {
            const mockResponse = { id: "1", phid: "PHID-PROJ-123" };

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { object: mockResponse }, error_code: null, error_info: null }));

            const updatedProject = await client.updateProject("PHID-PROJ-123", [{ type: "name", value: "Updated Project" }]);

            expect(updatedProject).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_INVALID", error_info: "Invalid data" }));

            await expect(client.updateProject("PHID-PROJ-123", [{ type: "name", value: "Updated Project" }])).rejects.toThrow(PhorgeError);
        });
    });

    describe("searchManiphest", () => {
        test("should return a list of tasks on success", async () => {
            const mockResponse: ManiphestTask[] = [
                {
                    id: 11,
                    type: "TASK",
                    phid: "PHID-TASK-34hrdlpijuixi2ghj52r",
                    fields: {
                        name: "Title",
                        description: {
                            raw: "Description"
                        },
                        authorPHID: "PHID-USER-rnkdeb65flsegm4e3y62",
                        ownerPHID: null,
                        status: {
                            value: "open",
                            name: "Open",
                            color: null
                        },
                        priority: {
                            value: 90,
                            name: "Needs Triage",
                            color: "violet"
                        },
                        points: null,
                        subtype: "default",
                        closerPHID: null,
                        dateClosed: null,
                        groupByProjectPHID: null,
                        spacePHID: null,
                        dateCreated: 1768121863,
                        dateModified: 1768121863,
                        policy: {
                            view: "users",
                            interact: "users",
                            edit: "users"
                        }
                    },
                    attachments: {
                        columns: {
                            boards: []
                        },
                        projects: {
                            projectPHIDs: []
                        },
                        subscribers: {
                            subscriberPHIDs: [
                                "PHID-USER-rnkdeb65flsegm4e3y62"
                            ],
                            subscriberCount: 1,
                            viewerIsSubscribed: true
                        }
                    }
                }
            ];

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { data: mockResponse }, error_code: null, error_info: null }));

            const tasks = await client.searchManiphest();

            expect(tasks).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_NOT_FOUND", error_info: "Task not found" }));

            await expect(client.searchManiphest()).rejects.toThrow(PhorgeError);
        });
    });

    describe("createManiphest", () => {
        test("should return a new task object on success", async () => {
            const mockResponse = { id: "2", phid: "PHID-TASK-456" };

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { object: mockResponse }, error_code: null, error_info: null }));

            const newTask = await client.createManiphest([{ type: "title", value: "New Task" }]);

            expect(newTask).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_INVALID", error_info: "Invalid data" }));

            await expect(client.createManiphest([{ type: "title", value: "New Task" }])).rejects.toThrow(PhorgeError);
        });
    });

    describe("searchManiphestPriority", () => {
        test("should return a list of priorities on success", async () => {
            const mockResponse: ManiphestPriority[] = [
                {
                    "name": "Unbreak Now!",
                    "keywords": [
                        "unbreak"
                    ],
                    "short": "Unbreak!",
                    "color": "pink",
                    "value": 100
                },
                {
                    "name": "Needs Triage",
                    "keywords": [
                        "triage"
                    ],
                    "short": "Triage",
                    "color": "violet",
                    "value": 90
                }
            ];

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { data: mockResponse }, error_code: null, error_info: null }));

            const priorities = await client.searchManiphestPriority();

            expect(priorities).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_INVALID", error_info: "Invalid request" }));

            await expect(client.searchManiphestPriority()).rejects.toThrow(PhorgeError);
        });
    });

    describe("updateManiphest", () => {
        test("should return an updated task object on success", async () => {
            const mockResponse = { id: "1", phid: "PHID-TASK-123" };

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { object: mockResponse }, error_code: null, error_info: null }));

            const updatedTask = await client.updateManiphest("PHID-TASK-123", [{ type: "title", value: "Updated Task" }]);

            expect(updatedTask).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_INVALID", error_info: "Invalid data" }));

            await expect(client.updateManiphest("PHID-TASK-122", [{ type: "title", value: "Updated Task" }])).rejects.toThrow(PhorgeError);
        });
    });

    describe("searchUser", () => {
        test("should return a list of users on success", async () => {
            const mockResponse = [
                {
                    "id": 2,
                    "type": "USER",
                    "phid": "PHID-USER-rnkdeb65flsegm4e3y62",
                    "fields": {
                        "username": "bot",
                        "realName": "Bottington",
                        "roles": [
                            "bot",
                            "verified",
                            "approved",
                            "activated"
                        ],
                        "dateCreated": 1767700151,
                        "dateModified": 1767700151,
                        "policy": {
                            "view": "public",
                            "edit": "admin"
                        }
                    },
                    "attachments": {}
                }
            ];

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

    describe("searchManiphestStatus", () => {
        test("should return a list of task statuses on success", async () => {
            const mockResponse: ManiphestStatus[] = [
                {
                    "name": "Open",
                    "value": "open",
                    "closed": false,
                    "special": "default"
                },
                {
                    "name": "Resolved",
                    "value": "resolved",
                    "closed": true,
                    "special": "closed"
                },
                {
                    "name": "Wontfix",
                    "value": "wontfix",
                    "closed": true
                }
            ];

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { data: mockResponse }, error_code: null, error_info: null }));

            const statuses = await client.searchManiphestStatus();

            expect(statuses).toEqual(mockResponse);
        });

        test("should throw a PhorgeError on failure", async () => {
            fetchMocker.mockResponseOnce(JSON.stringify({ error_code: "ERR_CONDUIT_CORE", error_info: "Some error" }));

            await expect(client.searchManiphestStatus()).rejects.toThrow(PhorgeError);
        });
    });

    describe("searchPhriction", () => {
        test("should return a list of documents on success", async () => {
            const mockResponse: PhrictionDocument[] = [
                {
                    id: 1,
                    type: "WIKI",
                    phid: "PHID-WIKI-123",
                    fields: {
                        path: "test/",
                        status: { value: "active", name: "Active" },
                        policy: { view: "public", edit: "users" },
                    },
                    attachments: {}
                }
            ];

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { data: mockResponse }, error_code: null, error_info: null }));

            const documents = await client.searchPhriction({
                order: ["title", "-id"],
                constraints: { statuses: ["active"] }
            });

            expect(documents).toEqual(mockResponse);
            // Verify order param handling
            const calls = fetchMocker.mock.calls;
            const params = calls[0][1]!.body as URLSearchParams;
            expect(params.getAll("order[0]")).toContain("title");
            expect(params.getAll("order[1]")).toContain("-id");
            expect(params.get("constraints[statuses][0]")).toBe("active");
        });
    });

    describe("createPhriction", () => {
        test("should return document info on success", async () => {
            const mockResponse: PhrictionInfo = {
                phid: "PHID-WIKI-123",
                uri: "http://example.com/w/test/",
                slug: "test/",
                version: 1,
                authorPHID: "PHID-USER-1",
                title: "Test Page",
                content: "Content",
                status: "exists",
                description: "Desc",
                dateCreated: 1234567890
            };

            fetchMocker.mockResponseOnce(JSON.stringify({ result: mockResponse, error_code: null, error_info: null }));

            const info = await client.createPhriction({
                slug: "test/",
                title: "Test Page",
                content: "Content",
                description: "Desc"
            });

            expect(info).toEqual(mockResponse);
            const calls = fetchMocker.mock.calls;
            const params = calls[0][1]!.body as URLSearchParams;
            expect(params.get("slug")).toBe("test/");
            expect(params.get("title")).toBe("Test Page");
            expect(params.get("content")).toBe("Content");
        });
    });

    describe("editPhriction", () => {
        test("should return document info on success", async () => {
            const mockResponse: PhrictionInfo = {
                phid: "PHID-WIKI-123",
                uri: "http://example.com/w/test/",
                slug: "test/",
                version: 2,
                authorPHID: "PHID-USER-1",
                title: "Test Page Updated",
                content: "Content Updated",
                status: "exists",
                description: "Desc",
                dateCreated: 1234567890
            };

            fetchMocker.mockResponseOnce(JSON.stringify({ result: mockResponse, error_code: null, error_info: null }));

            const info = await client.editPhriction({
                slug: "test/",
                content: "Content Updated",
                title: "Test Page Updated"
            });

            expect(info).toEqual(mockResponse);
        });
    });

    describe("updatePhriction", () => {
        test("should return object result on success", async () => {
            const mockResponse = { id: "123", phid: "PHID-WIKI-123" };

            fetchMocker.mockResponseOnce(JSON.stringify({ result: { object: mockResponse }, error_code: null, error_info: null }));

            const result = await client.updatePhriction("PHID-WIKI-123", [
                { type: "subscribers.add", value: ["PHID-USER-2"] }
            ]);

            expect(result).toEqual(mockResponse);
            const calls = fetchMocker.mock.calls;
            const params = calls[0][1]!.body as URLSearchParams;
            expect(params.get("objectIdentifier")).toBe("PHID-WIKI-123");
            expect(params.get("transactions[0][type]")).toBe("subscribers.add");
            expect(params.get("transactions[0][value][0]")).toBe("PHID-USER-2");
        });
    });
});
