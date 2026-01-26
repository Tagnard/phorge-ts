import * as z from "zod";
import { Policy, type ApiResponse, type PHID } from "./phorge.js";
import { CreateObjectResult } from "./phorge.js";

// --- Transactions ---

export const PhrictionSpaceTransaction = z.object({
    type: z.literal("space"),
    value: z.custom<PHID<"SPCE">>(),
});

export const PhrictionViewTransaction = z.object({
    type: z.literal("view"),
    value: z.string(),
});

export const PhrictionEditTransaction = z.object({
    type: z.literal("edit"),
    value: z.string(),
});

export const PhrictionProjectsAddTransaction = z.object({
    type: z.literal("projects.add"),
    value: z.array(z.custom<PHID<"PROJ">>()),
});

export const PhrictionProjectsRemoveTransaction = z.object({
    type: z.literal("projects.remove"),
    value: z.array(z.custom<PHID<"PROJ">>()),
});

export const PhrictionProjectsSetTransaction = z.object({
    type: z.literal("projects.set"),
    value: z.array(z.custom<PHID<"PROJ">>()),
});

export const PhrictionSubscribersAddTransaction = z.object({
    type: z.literal("subscribers.add"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const PhrictionSubscribersRemoveTransaction = z.object({
    type: z.literal("subscribers.remove"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const PhrictionSubscribersSetTransaction = z.object({
    type: z.literal("subscribers.set"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const PhrictionCommentTransaction = z.object({
    type: z.literal("comment"),
    value: z.string(),
});

export const PhrictionMfaTransaction = z.object({
    type: z.literal("mfa"),
    value: z.boolean(),
});

export const PhrictionUpdateTransaction = z.union([
    PhrictionSpaceTransaction,
    PhrictionViewTransaction,
    PhrictionEditTransaction,
    PhrictionProjectsAddTransaction,
    PhrictionProjectsRemoveTransaction,
    PhrictionProjectsSetTransaction,
    PhrictionSubscribersAddTransaction,
    PhrictionSubscribersRemoveTransaction,
    PhrictionSubscribersSetTransaction,
    PhrictionCommentTransaction,
    PhrictionMfaTransaction,
]);

export type PhrictionUpdateTransaction = z.infer<typeof PhrictionUpdateTransaction>;

// --- Search Constraints ---

export const PhrictionConstraints = z.object({
    ids: z.number().array().optional(),
    phids: z.custom<PHID<"WIKI">>().array().optional(),
    statuses: z.enum(["active", "deleted", "moved", "stub"]).array().optional(),
    paths: z.string().array().optional(),
    parentPaths: z.string().array().optional(),
    ancestorPaths: z.string().array().optional(),
    query: z.string().optional(),
    subscribers: z.custom<PHID<"USER">>().array().optional(),
    projects: z.custom<PHID<"PROJ">>().array().optional(),
});

export type PhrictionConstraints = z.infer<typeof PhrictionConstraints>;

// --- Search Result (PhrictionDocument) ---

export const PhrictionDocument = z.object({
    id: z.number(),
    type: z.literal("WIKI"),
    phid: z.custom<PHID<"WIKI">>(),
    fields: z.object({
        path: z.string(),
        status: z.object({
            value: z.string(),
            name: z.string(),
        }),
        spacePHID: z.custom<PHID<"SPCE">>().nullable().optional(),
        policy: Policy,
    }),
    attachments: z.object({
        content: z.object({
            content: z.string(), // Based on "Document Content" description, assuming standard field name
            // Use 'unknown' for other potential fields in content attachment if not sure
        }).optional(),
        projects: z.object({
            projectPHIDs: z.custom<PHID<"PROJ">>().array()
        }).optional(),
        subscribers: z.object({
            subscriberPHIDs: z.custom<PHID<"USER">>().array(),
            subscriberCount: z.number(),
            viewerIsSubscribed: z.boolean()
        }).optional()
    })
});

export type PhrictionDocument = z.infer<typeof PhrictionDocument>;

// --- Create/Edit Content Params ---

export const PhrictionContentParams = z.object({
    slug: z.string(),
    title: z.string().optional(),
    content: z.string().optional(),
    description: z.string().optional(),
});

export type PhrictionContentParams = z.infer<typeof PhrictionContentParams>;

// --- Create/Edit Result (PhrictionInfo) ---
// Based on user provided example:
// {
//   "phid": "PHID-WIKI-...",
//   "uri": "...",
//   "slug": "...",
//   "version": 1,
//   "authorPHID": "...",
//   "title": "...",
//   "content": "...",
//   "status": "exists",
//   "description": "",
//   "dateCreated": 1769432115
// }

export const PhrictionInfo = z.object({
    phid: z.custom<PHID<"WIKI">>(),
    uri: z.string(),
    slug: z.string(),
    version: z.number(),
    authorPHID: z.custom<PHID<"USER">>(),
    title: z.string(),
    content: z.string().optional(), // 'content' might be absent in some contexts or empty
    status: z.string(),
    description: z.string().optional(),
    dateCreated: z.number(),
    dateModified: z.number().optional(), // Often present in edit results
});

export type PhrictionInfo = z.infer<typeof PhrictionInfo>;


// --- Search Options ---

export const PhrictionSearchOptions = z.object({
    queryKey: z.string().optional(),
    constraints: PhrictionConstraints.optional(),
    attachments: z.object({
        content: z.boolean().optional(),
        projects: z.boolean().optional(),
        subscribers: z.boolean().optional(),
    }).optional(),
    order: z.enum(["newest", "oldest", "relevance", "hierarchy"]).or(z.array(z.string())).optional(),
    before: z.number().optional(),
    after: z.number().optional(),
    limit: z.number().optional()
});

export type PhrictionSearchOptions = z.infer<typeof PhrictionSearchOptions>;

// --- Responses ---

export type SearchPhrictionResponse = ApiResponse<{ data: PhrictionDocument[] }>;
export type CreatePhrictionResponse = ApiResponse<PhrictionInfo>; // Assuming result is the info object
export type EditPhrictionResponse = ApiResponse<PhrictionInfo>; // Assuming result is the info object
export type UpdatePhrictionResponse = ApiResponse<{ object: CreateObjectResult }>; // Standard transaction response
