import * as z from "zod"
import type { ApiResponse, PHID, Policy } from "./phorge.js";
import { CreateObjectResult } from "./phorge.js";

export const TaskTransaction = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    priority: z.enum(["unbreak", "triage", "high", "normal", "low", "wish"]).optional(),
    ownerPHID: z.custom<PHID<"USER">>().optional(),
    parents: z.custom<PHID<'TASK'>>().array().optional(),
    subtasks: z.custom<PHID<'TASK'>>().array().optional(),
    commits: z.custom<PHID<'CMIT'>>().array().optional(),
    projects: z.custom<PHID<'PROJ'>>().array().optional(),
    subscribers: z.custom<PHID<'USER'>>().array().optional(),
});

export type TaskTransactions = z.infer<typeof TaskTransaction>

export const TaskConstraints = z.object({
    ids: z.number().array().optional(),
    phids: z.custom<PHID<"TASK">>().array().optional(),
    assigned: z.custom<PHID<"USER">>().array().optional(),
    authorPHIDs: z.custom<PHID<"USER">>().array().optional(),
    statuses: z.custom<string>().array().optional(),
    priorities: z.custom<number>().array().optional(),
    subtypes: z.custom<string>().array().optional(),
    columnPHIDs: z.unknown().optional(),
    hasParents: z.boolean().optional(),
    hasSubtasks: z.boolean().optional(),
    parentIDs: z.custom<PHID<"TASK">>().array().optional(),
    subtaskIDs: z.custom<PHID<"TASK">>().array().optional(),
    group: z.enum(["priority", "assigned", "status", "project", "none"]).optional(),
    createdStart: z.number().optional(),
    createdEnd: z.number().optional(),
    modifiedStart: z.number().optional(),
    modifiedEnd: z.number().optional(),
    closedStart: z.number().optional(),
    closedEnd: z.number().optional(),
    closerPHIDs: z.custom<PHID<"USER">>().array().optional(),
    query: z.string().optional(),
    subscribers: z.custom<PHID<"USER">>().array().optional(),
    projects: z.custom<PHID<"PROJ">>().array().optional(),
})

export type TaskConstraints = z.infer<typeof TaskConstraints>

export const SearchTaskResult = z.object({
    id: z.number(),
    phid: z.custom<PHID<"TASK">>(),
    fields: z.object({
        name: z.string(),
        description: z.object({ raw: z.string() }),
        authorPHID: z.custom<PHID<"USER">>,
        ownerPHID: z.custom<PHID<"USER">>,
        status: z.object({
            value: z.string(),
            name: z.string(),
            color: z.string().nullable()
        }),
        priority: z.object({
            value: z.string(),
            name: z.string(),
            color: z.string().nullable()
        }),
        points: z.number(),
        subtype: z.string(),
        closePHID: z.custom<PHID<"USER">>,
        dateClosed: z.number(),
        groupByProjectPHID: z.unknown(), // TODO: Needs to be implemented
        spacePHID: z.custom<PHID<"SPCE">>(), // TODO: Needs to be implemented
        dateCreated: z.number(),
        dateModified: z.number(),
        policy: z.custom<Policy>(),
    }),
    attachments: z.unknown() // TODO: Needs to be implemented
})

export type SearchTaskResult = z.infer<typeof SearchTaskResult>

export const TaskSearchOptions = z.object({
    queryKey: z.string().optional(),
    constraints: z.custom<TaskConstraints>().optional(),
    attachments: z.object({
        columns: z.boolean().optional(),
        projects: z.boolean().optional(),
        subscribers: z.boolean().optional(),
    }).optional(),
    order: z.enum(["priority", "updated", "outdated", "newest", "oldest", "closed", "title", "relevance"]).optional(),
    before: z.number().optional(),
    after: z.number().optional(),
    limit: z.number().optional()
})

export type TaskSearchOptions = z.infer<typeof TaskSearchOptions>

export type CreateTaskResponse = ApiResponse<{ object: CreateObjectResult }>
export type SearchTaskResponse = ApiResponse<{ data: SearchTaskResult[] }>