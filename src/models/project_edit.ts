import * as z from "zod";
import type { PHID } from "./phorge.js";

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
