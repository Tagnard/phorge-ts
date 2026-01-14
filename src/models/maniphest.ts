import * as z from "zod"
import { Policy, type ApiResponse, type PHID } from "./phorge.js";
import { CreateObjectResult } from "./phorge.js";

export const TaskParentTransaction = z.object({
    type: z.literal("parent"),
    value: z.custom<PHID<"TASK">>(),
});

export const TaskColumnTransaction = z.object({
    type: z.literal("column"),
    value: z.custom<PHID<"COLN">>(),
});

export const TaskSpaceTransaction = z.object({
    type: z.literal("space"),
    value: z.custom<PHID<"SPCE">>(),
});

export const TaskTitleTransaction = z.object({
    type: z.literal("title"),
    value: z.string(),
});

export const TaskOwnerTransaction = z.object({
    type: z.literal("owner"),
    value: z.custom<PHID<"USER">>(),
});

export const TaskStatusTransaction = z.object({
    type: z.literal("status"),
    value: z.string(),
});

export const TaskPriorityTransaction = z.object({
    type: z.literal("priority"),
    value: z.string(),
});

export const TaskDescriptionTransaction = z.object({
    type: z.literal("description"),
    value: z.string(),
});

export const TaskParentsAddTransaction = z.object({
    type: z.literal("parents.add"),
    value: z.array(z.custom<PHID<"TASK">>()),
});

export const TaskParentsRemoveTransaction = z.object({
    type: z.literal("parents.remove"),
    value: z.array(z.custom<PHID<"TASK">>()),
});

export const TaskParentsSetTransaction = z.object({
    type: z.literal("parents.set"),
    value: z.array(z.custom<PHID<"TASK">>()),
});

export const TaskSubtasksAddTransaction = z.object({
    type: z.literal("subtasks.add"),
    value: z.array(z.custom<PHID<"TASK">>()),
});

export const TaskSubtasksRemoveTransaction = z.object({
    type: z.literal("subtasks.remove"),
    value: z.array(z.custom<PHID<"TASK">>()),
});

export const TaskSubtasksSetTransaction = z.object({
    type: z.literal("subtasks.set"),
    value: z.array(z.custom<PHID<"TASK">>()),
});

export const TaskCommitsAddTransaction = z.object({
    type: z.literal("commits.add"),
    value: z.array(z.custom<PHID<"CMIT">>()),
});

export const TaskCommitsRemoveTransaction = z.object({
    type: z.literal("commits.remove"),
    value: z.array(z.custom<PHID<"CMIT">>()),
});

export const TaskCommitsSetTransaction = z.object({
    type: z.literal("commits.set"),
    value: z.array(z.custom<PHID<"CMIT">>()),
});

export const TaskViewTransaction = z.object({
    type: z.literal("view"),
    value: z.string(),
});

export const TaskEditTransaction = z.object({
    type: z.literal("edit"),
    value: z.string(),
});

export const TaskProjectsAddTransaction = z.object({
    type: z.literal("projects.add"),
    value: z.array(z.custom<PHID<"PROJ">>()),
});

export const TaskProjectsRemoveTransaction = z.object({
    type: z.literal("projects.remove"),
    value: z.array(z.custom<PHID<"PROJ">>()),
});

export const TaskProjectsSetTransaction = z.object({
    type: z.literal("projects.set"),
    value: z.array(z.custom<PHID<"PROJ">>()),
});

export const TaskSubscribersAddTransaction = z.object({
    type: z.literal("subscribers.add"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const TaskSubscribersRemoveTransaction = z.object({
    type: z.literal("subscribers.remove"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const TaskSubscribersSetTransaction = z.object({
    type: z.literal("subscribers.set"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const TaskSubtypeTransaction = z.object({
    type: z.literal("subtype"),
    value: z.string(),
});

export const TaskCommentTransaction = z.object({
    type: z.literal("comment"),
    value: z.string(),
});

export const TaskMfaTransaction = z.object({
    type: z.literal("mfa"),
    value: z.string(),
});

export const TaskTransaction = z.union([
    TaskParentTransaction,
    TaskColumnTransaction,
    TaskSpaceTransaction,
    TaskTitleTransaction,
    TaskOwnerTransaction,
    TaskStatusTransaction,
    TaskPriorityTransaction,
    TaskDescriptionTransaction,
    TaskParentsAddTransaction,
    TaskParentsRemoveTransaction,
    TaskParentsSetTransaction,
    TaskSubtasksAddTransaction,
    TaskSubtasksRemoveTransaction,
    TaskSubtasksSetTransaction,
    TaskCommitsAddTransaction,
    TaskCommitsRemoveTransaction,
    TaskCommitsSetTransaction,
    TaskViewTransaction,
    TaskEditTransaction,
    TaskProjectsAddTransaction,
    TaskProjectsRemoveTransaction,
    TaskProjectsSetTransaction,
    TaskSubscribersAddTransaction,
    TaskSubscribersRemoveTransaction,
    TaskSubscribersSetTransaction,
    TaskSubtypeTransaction,
    TaskCommentTransaction,
    TaskMfaTransaction,
]);

export type TaskTransaction = z.infer<typeof TaskTransaction>;

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