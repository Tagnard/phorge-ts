import * as z from "zod"
import { Policy, type ApiResponse, type PHID } from "./phorge.js";
import { CreateObjectResult } from "./phorge.js";

export const TaskTransaction = z.object({
    parent: z.custom<PHID<"TASK">>().optional(),
    column: z.custom<PHID<"COLN">>().optional(),
    space: z.custom<PHID<"SPCE">>().optional(),
    title: z.string().optional(),
    owner: z.custom<PHID<"USER">>().optional(),
    status: z.string().optional(),
    priority: z.string().optional(),
    description: z.string().optional(),
    parents: z.object({
        add: z.custom<PHID<'TASK'>>().array().optional(),
        remove: z.custom<PHID<'TASK'>>().array().optional(),
        set: z.custom<PHID<'TASK'>>().array().optional(),
    }).optional(),
    subtasks: z.object({
        add: z.custom<PHID<'TASK'>>().array().optional(),
        remove: z.custom<PHID<'TASK'>>().array().optional(),
        set: z.custom<PHID<'TASK'>>().array().optional(),
    }).optional(),
    commits: z.object({
        add: z.custom<PHID<'CMIT'>>().array().optional(),
        remove: z.custom<PHID<'CMIT'>>().array().optional(),
        set: z.custom<PHID<'CMIT'>>().array().optional(),
    }).optional(),
    view: z.string().optional(),
    edit: z.string().optional(),
    projects: z.object({
        add: z.custom<PHID<'PROJ'>>().array().optional(),
        remove: z.custom<PHID<'PROJ'>>().array().optional(),
        set: z.custom<PHID<'PROJ'>>().array().optional(),
    }).optional(),
    subscribers: z.object({
        add: z.custom<PHID<'USER'>>().array().optional(),
        remove: z.custom<PHID<'USER'>>().array().optional(),
        set: z.custom<PHID<'USER'>>().array().optional(),
    }).optional(),
    subtype: z.string().optional(),
    comment: z.string().optional(),
    mfa: z.string().optional(),
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
    columnPHIDs: z.custom<"PCOL">().optional(),
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
    type: z.literal("TASK"),
    phid: z.custom<PHID<"TASK">>(),
    fields: z.object({
        name: z.string(),
        description: z.object({ raw: z.string() }),
        authorPHID: z.custom<PHID<"USER">>,
        ownerPHID: z.custom<PHID<"USER">>().nullable(),
        status: z.object({
            value: z.string(),
            name: z.string(),
            color: z.string().nullable()
        }),
        priority: z.object({
            value: z.number(),
            name: z.string(),
            color: z.string().nullable()
        }),
        points: z.number().nullable(),
        subtype: z.string(),
        closerPHID: z.custom<PHID<"USER">>().nullable(),
        dateClosed: z.number().nullable(),
        groupByProjectPHID: z.unknown(), // TODO: Needs to be implemented
        spacePHID: z.custom<PHID<"SPCE">>().nullable(), // TODO: Needs to be implemented
        dateCreated: z.number(),
        dateModified: z.number(),
        policy: Policy,
    }),
    attachments: z.object({
        columns: z.object({
            boards: z.unknown().array()
        }),
        projects: z.object({
            projectPHIDs: z.custom<PHID<"PROJ">>().array()
        }),
        subscribers: z.object({
            subscriberPHIDs: z.custom<PHID<"USER">>().array(),
            subscriberCount: z.number(),
            viewerIsSubscribed: z.boolean()
        })
    })
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