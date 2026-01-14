import * as z from "zod";
import { ObjectType, type ApiResponse, type PHID } from "./phorge.js";

export const TransactionConstraints = z.object({
    phids: z.custom<PHID>().array().optional(),
    authorPHIDs: z.custom<PHID<"USER">>().array().optional()
})

export type TransactionConstraints = z.infer<typeof TransactionConstraints>

export const TransactionSearchOptions = z.object({
    objectIdentifier: z.custom<PHID>().optional(),
    objectType: ObjectType.optional(),
    constraints: z.custom<TransactionConstraints>().optional(),
    before: z.number().optional(),
    after: z.number().optional(),
    limit: z.number().optional()
})

export type TransactionSearchOptions = z.infer<typeof TransactionSearchOptions>

export const TransactionComment = z.object({
    id: z.number(),
    phid: z.string(),
    version: z.number(),
    authorPHID: z.custom<PHID<"USER">>(),
    dateCreated: z.number(),
    dateModified: z.number(),
    removed: z.boolean(),
    content: z.object({ raw: z.string() })
})

export type TransactionComment = z.infer<typeof TransactionComment>

export const SearchTransactionResult = z.object({
    id: z.number(),
    phid: z.string(),
    type: z.string().nullable(),
    authorPHID: z.custom<PHID<"USER">>(),
    objectPHID: z.custom<PHID>(),
    dateCreated: z.number(),
    dateModified: z.number(),
    groupID: z.string(),
    comments: TransactionComment.array()
}).array();

export type SearchTransactionResult = z.infer<typeof SearchTransactionResult>

export type SearchTransactionResponse = ApiResponse<{ data: SearchTransactionResult[] }>

export const ProjectEditParentTransaction = z.object({
    type: z.literal("parent"),
    value: z.custom<PHID<"PROJ">>(),
});

export const ProjectEditMilestoneTransaction = z.object({
    type: z.literal("milestone"),
    value: z.custom<PHID<"PROJ">>(),
});

export const ProjectEditSpaceTransaction = z.object({
    type: z.literal("space"),
    value: z.custom<PHID<"SPCE">>(),
});

export const ProjectEditNameTransaction = z.object({
    type: z.literal("name"),
    value: z.string(),
});

export const ProjectEditDescriptionTransaction = z.object({
    type: z.literal("description"),
    value: z.string(),
});

export const ProjectEditIconTransaction = z.object({
    type: z.literal("icon"),
    value: z.string(),
});

export const ProjectEditColorTransaction = z.object({
    type: z.literal("color"),
    value: z.string(),
});

export const ProjectEditSlugsTransaction = z.object({
    type: z.literal("slugs"),
    value: z.array(z.string()),
});

export const ProjectEditMembersAddTransaction = z.object({
    type: z.literal("members.add"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const ProjectEditMembersRemoveTransaction = z.object({
    type: z.literal("members.remove"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const ProjectEditMembersSetTransaction = z.object({
    type: z.literal("members.set"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const ProjectEditViewTransaction = z.object({
    type: z.literal("view"),
    value: z.string(),
});

export const ProjectEditEditTransaction = z.object({
    type: z.literal("edit"),
    value: z.string(),
});

export const ProjectEditJoinTransaction = z.object({
    type: z.literal("join"),
    value: z.string(),
});

export const ProjectEditSubtypeTransaction = z.object({
    type: z.literal("subtype"),
    value: z.string(),
});

export const ProjectEditMfaTransaction = z.object({
    type: z.literal("mfa"),
    value: z.boolean(),
});

export const ProjectEditTransaction = z.union([
    ProjectEditParentTransaction,
    ProjectEditMilestoneTransaction,
    ProjectEditSpaceTransaction,
    ProjectEditNameTransaction,
    ProjectEditDescriptionTransaction,
    ProjectEditIconTransaction,
    ProjectEditColorTransaction,
    ProjectEditSlugsTransaction,
    ProjectEditMembersAddTransaction,
    ProjectEditMembersRemoveTransaction,
    ProjectEditMembersSetTransaction,
    ProjectEditViewTransaction,
    ProjectEditEditTransaction,
    ProjectEditJoinTransaction,
    ProjectEditSubtypeTransaction,
    ProjectEditMfaTransaction,
]);

export type ProjectEditTransaction = z.infer<typeof ProjectEditTransaction>;
