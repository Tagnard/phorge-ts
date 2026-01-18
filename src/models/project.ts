import { Policy, type ApiResponse, type CreateObjectResult, type PHID } from "./phorge.js"
import * as z from "zod"

export const Icon = z.object({
    key: z.string(),
    name: z.string(),
    icon: z.string()
})

export type Icon = z.infer<typeof Icon>

export const Color = z.object({
    key: z.string(),
    name: z.string(),
})

export type Color = z.infer<typeof Color>


export const ProjectConstraints = z.object({
    ids: z.number().array().nonempty().optional(),
    phids: z.custom<PHID<"PROJ">>().array().nonempty().optional(),
    slugs: z.string().array().nonempty().optional(),
    members: z.custom<PHID<"USER">>().array().nonempty().optional(),
    watchers: z.custom<PHID<"USER">>().array().nonempty().optional(),
    status: z.enum(["active", "archived", "all"]).optional(),
    isMilestone: z.boolean().optional(),
    isRoot: z.boolean().optional(),
    minDepth: z.number().optional(),
    maxDepth: z.number().optional(),
    subtypes: z.string().array().nonempty().optional(),
    icons: z.string().array().nonempty().optional(),
    colors: z.string().array().nonempty().optional(),
    parents: z.custom<PHID<"PROJ">>().array().optional(),
    ancestors: z.custom<PHID<"PROJ">>().array().optional(),
    query: z.string().optional()
})

export type ProjectConstraints = z.infer<typeof ProjectConstraints>

export const ProjectSearchOptions = z.object({
    queryKey: z.string().optional(),
    constraints: z.custom<ProjectConstraints>().optional(),
    attachments: z.object({
        members: z.boolean().optional(),
        watchers: z.boolean().optional(),
        ancestors: z.boolean().optional(),
    }).optional(),
    order: z.enum(["priority", "updated", "outdated", "newest", "oldest", "closed", "title", "relevance"]).optional(),
    before: z.number().optional(),
    after: z.number().optional(),
    limit: z.number().optional()
})

export type ProjectSearchOptions = z.infer<typeof ProjectSearchOptions>

export const SearchProjectResult = z.object({
    id: z.number(),
    type: z.literal("PROJ"),
    phid: z.custom<PHID<"PROJ">>(),
    fields: z.object({
        name: z.string(),
        slug: z.string(),
        subtype: z.string(),
        milestone: z.number().nullable(),
        depth: z.number(),
        parent: z.custom<PHID<"PROJ">>().nullable(),
        icon: z.custom<Icon>(),
        color: z.custom<Color>(),
        status: z.enum(["active", "archived", "all"]),
        spacePHID: z.custom<PHID<"SPCE">>().nullable(),
        dateCreated: z.number(),
        dateModified: z.number(),
        policy: Policy,
        description: z.string().nullable(),
    }),
    attachments: z.object({
        members: z.object({
            members: z.object({
                phid: z.custom<PHID<"USER">>()
            }).array()
        }).optional(),
        watchers: z.object({
            watchers: z.object({
                phid: z.custom<PHID<"USER">>()
            }).array()
        }).optional(),
        ancestors: z.object({
            ancestors: z.custom<PHID<"PROJ">>().array()
        }).optional()
    })
})

export type SearchProjectResult = z.infer<typeof SearchProjectResult>

export type CreateProjectResponse = ApiResponse<{ object: CreateObjectResult }>
export type SearchProjectResponse = ApiResponse<{ data: SearchProjectResult[] }>

// Edit Transactions

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

export const ProjectEditStatusTransaction = z.object({
    type: z.literal("status"),
    value: z.enum(["active", "archived"]),
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
    ProjectEditStatusTransaction,
]);

export type ProjectEditTransaction = z.infer<typeof ProjectEditTransaction>;
