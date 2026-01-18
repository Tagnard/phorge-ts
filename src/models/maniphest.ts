import * as z from "zod"
import { Policy, type ApiResponse, type PHID } from "./phorge.js";
import { CreateObjectResult } from "./phorge.js";

export const ManiphestTaskParentTransaction = z.object({
    type: z.literal("parent"),
    value: z.custom<PHID<"TASK">>(),
});

export const ManiphestTaskColumnTransaction = z.object({
    type: z.literal("column"),
    value: z.custom<PHID<"COLN">>(),
});

export const ManiphestTaskSpaceTransaction = z.object({
    type: z.literal("space"),
    value: z.custom<PHID<"SPCE">>(),
});

export const ManiphestTaskTitleTransaction = z.object({
    type: z.literal("title"),
    value: z.string(),
});

export const ManiphestTaskOwnerTransaction = z.object({
    type: z.literal("owner"),
    value: z.custom<PHID<"USER">>(),
});

export const ManiphestTaskStatusTransaction = z.object({
    type: z.literal("status"),
    value: z.string(),
});

export const ManiphestTaskPriorityTransaction = z.object({
    type: z.literal("priority"),
    value: z.string(),
});

export const ManiphestTaskDescriptionTransaction = z.object({
    type: z.literal("description"),
    value: z.string(),
});

export const ManiphestTaskParentsAddTransaction = z.object({
    type: z.literal("parents.add"),
    value: z.array(z.custom<PHID<"TASK">>()),
});

export const ManiphestTaskParentsRemoveTransaction = z.object({
    type: z.literal("parents.remove"),
    value: z.array(z.custom<PHID<"TASK">>()),
});

export const ManiphestTaskParentsSetTransaction = z.object({
    type: z.literal("parents.set"),
    value: z.array(z.custom<PHID<"TASK">>()),
});

export const ManiphestTaskSubtasksAddTransaction = z.object({
    type: z.literal("subtasks.add"),
    value: z.array(z.custom<PHID<"TASK">>()),
});

export const ManiphestTaskSubtasksRemoveTransaction = z.object({
    type: z.literal("subtasks.remove"),
    value: z.array(z.custom<PHID<"TASK">>()),
});

export const ManiphestTaskSubtasksSetTransaction = z.object({
    type: z.literal("subtasks.set"),
    value: z.array(z.custom<PHID<"TASK">>()),
});

export const ManiphestTaskCommitsAddTransaction = z.object({
    type: z.literal("commits.add"),
    value: z.array(z.custom<PHID<"CMIT">>()),
});

export const ManiphestTaskCommitsRemoveTransaction = z.object({
    type: z.literal("commits.remove"),
    value: z.array(z.custom<PHID<"CMIT">>()),
});

export const ManiphestTaskCommitsSetTransaction = z.object({
    type: z.literal("commits.set"),
    value: z.array(z.custom<PHID<"CMIT">>()),
});

export const ManiphestTaskViewTransaction = z.object({
    type: z.literal("view"),
    value: z.string(),
});

export const ManiphestTaskEditTransaction = z.object({
    type: z.literal("edit"),
    value: z.string(),
});

export const ManiphestTaskProjectsAddTransaction = z.object({
    type: z.literal("projects.add"),
    value: z.array(z.custom<PHID<"PROJ">>()),
});

export const ManiphestTaskProjectsRemoveTransaction = z.object({
    type: z.literal("projects.remove"),
    value: z.array(z.custom<PHID<"PROJ">>()),
});

export const ManiphestTaskProjectsSetTransaction = z.object({
    type: z.literal("projects.set"),
    value: z.array(z.custom<PHID<"PROJ">>()),
});

export const ManiphestTaskSubscribersAddTransaction = z.object({
    type: z.literal("subscribers.add"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const ManiphestTaskSubscribersRemoveTransaction = z.object({
    type: z.literal("subscribers.remove"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const ManiphestTaskSubscribersSetTransaction = z.object({
    type: z.literal("subscribers.set"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const ManiphestTaskSubtypeTransaction = z.object({
    type: z.literal("subtype"),
    value: z.string(),
});

export const ManiphestTaskCommentTransaction = z.object({
    type: z.literal("comment"),
    value: z.string(),
});

export const ManiphestTaskMfaTransaction = z.object({
    type: z.literal("mfa"),
    value: z.string(),
});

export const ManiphestUpdateTransaction = z.union([
    ManiphestTaskParentTransaction,
    ManiphestTaskColumnTransaction,
    ManiphestTaskSpaceTransaction,
    ManiphestTaskTitleTransaction,
    ManiphestTaskOwnerTransaction,
    ManiphestTaskStatusTransaction,
    ManiphestTaskPriorityTransaction,
    ManiphestTaskDescriptionTransaction,
    ManiphestTaskParentsAddTransaction,
    ManiphestTaskParentsRemoveTransaction,
    ManiphestTaskParentsSetTransaction,
    ManiphestTaskSubtasksAddTransaction,
    ManiphestTaskSubtasksRemoveTransaction,
    ManiphestTaskSubtasksSetTransaction,
    ManiphestTaskCommitsAddTransaction,
    ManiphestTaskCommitsRemoveTransaction,
    ManiphestTaskCommitsSetTransaction,
    ManiphestTaskViewTransaction,
    ManiphestTaskEditTransaction,
    ManiphestTaskProjectsAddTransaction,
    ManiphestTaskProjectsRemoveTransaction,
    ManiphestTaskProjectsSetTransaction,
    ManiphestTaskSubscribersAddTransaction,
    ManiphestTaskSubscribersRemoveTransaction,
    ManiphestTaskSubscribersSetTransaction,
    ManiphestTaskSubtypeTransaction,
    ManiphestTaskCommentTransaction,
    ManiphestTaskMfaTransaction,
]);

export type ManiphestUpdateTransaction = z.infer<typeof ManiphestUpdateTransaction>;

export const ManiphestConstraints = z.object({
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

export type ManiphestConstraints = z.infer<typeof ManiphestConstraints>

export const ManiphestTask = z.object({
    id: z.number(),
    type: z.literal("TASK"),
    phid: z.custom<PHID<"TASK">>(),
    fields: z.object({
        name: z.string(),
        description: z.object({ raw: z.string() }),
        authorPHID: z.custom<PHID<"USER">>(),
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
        groupByProjectPHID: z.unknown(),
        spacePHID: z.custom<PHID<"SPCE">>().nullable(),
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

export type ManiphestTask = z.infer<typeof ManiphestTask>

export const ManiphestSearchOptions = z.object({
    queryKey: z.string().optional(),
    constraints: z.custom<ManiphestConstraints>().optional(),
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

export type ManiphestSearchOptions = z.infer<typeof ManiphestSearchOptions>

export const ManiphestPriority = z.object({
    name: z.string(),
    keywords: z.array(z.string()),
    short: z.string(),
    color: z.string(),
    value: z.number(),
});

export type ManiphestPriority = z.infer<typeof ManiphestPriority>;

export const ManiphestStatus = z.object({
    name: z.string(),
    value: z.string(),
    closed: z.boolean(),
    special: z.string().optional(),
})

export type ManiphestStatus = z.infer<typeof ManiphestStatus>

export type CreateManiphestResponse = ApiResponse<{ object: CreateObjectResult }>
export type SearchManiphestResponse = ApiResponse<{ data: ManiphestTask[] }>
export type SearchManiphestPriorityResponse = ApiResponse<{ data: ManiphestPriority[] }>
export type SearchManiphestStatusResponse = ApiResponse<{ data: ManiphestStatus[] }>
