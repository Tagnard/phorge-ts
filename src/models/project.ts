import { Policy, type ApiResponse, type CreateObjectResult, type PHID } from "./phorge.js"
import * as z from "zod"

export const ProjectIcon = z.object({
    key: z.string(),
    name: z.string(),
    icon: z.string()
})

export type ProjectIcon = z.infer<typeof ProjectIcon>

export const ProjectColor = z.object({
    key: z.string(),
    name: z.string(),
})

export type ProjectColor = z.infer<typeof ProjectColor>


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

export const Project = z.object({
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
        icon: z.custom<ProjectIcon>(),
        color: z.custom<ProjectColor>(),
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

export type Project = z.infer<typeof Project>

export type CreateProjectResponse = ApiResponse<{ object: CreateObjectResult }>
export type SearchProjectResponse = ApiResponse<{ data: Project[] }>

// Update Transactions

export const ProjectUpdateParentTransaction = z.object({
    type: z.literal("parent"),
    value: z.custom<PHID<"PROJ">>(),
});

export const ProjectUpdateMilestoneTransaction = z.object({
    type: z.literal("milestone"),
    value: z.custom<PHID<"PROJ">>(),
});

export const ProjectUpdateSpaceTransaction = z.object({
    type: z.literal("space"),
    value: z.custom<PHID<"SPCE">>(),
});

export const ProjectUpdateNameTransaction = z.object({
    type: z.literal("name"),
    value: z.string(),
});

export const ProjectUpdateDescriptionTransaction = z.object({
    type: z.literal("description"),
    value: z.string(),
});

export const ProjectUpdateIconTransaction = z.object({
    type: z.literal("icon"),
    value: z.string(),
});

export const ProjectUpdateColorTransaction = z.object({
    type: z.literal("color"),
    value: z.string(),
});

export const ProjectUpdateSlugsTransaction = z.object({
    type: z.literal("slugs"),
    value: z.array(z.string()),
});

export const ProjectUpdateMembersAddTransaction = z.object({
    type: z.literal("members.add"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const ProjectUpdateMembersRemoveTransaction = z.object({
    type: z.literal("members.remove"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const ProjectUpdateMembersSetTransaction = z.object({
    type: z.literal("members.set"),
    value: z.array(z.custom<PHID<"USER">>()),
});

export const ProjectUpdateViewTransaction = z.object({
    type: z.literal("view"),
    value: z.string(),
});

export const ProjectUpdateEditTransaction = z.object({
    type: z.literal("edit"),
    value: z.string(),
});

export const ProjectUpdateJoinTransaction = z.object({
    type: z.literal("join"),
    value: z.string(),
});

export const ProjectUpdateSubtypeTransaction = z.object({
    type: z.literal("subtype"),
    value: z.string(),
});

export const ProjectUpdateMfaTransaction = z.object({
    type: z.literal("mfa"),
    value: z.boolean(),
});

export const ProjectUpdateTransaction = z.union([
    ProjectUpdateParentTransaction,
    ProjectUpdateMilestoneTransaction,
    ProjectUpdateSpaceTransaction,
    ProjectUpdateNameTransaction,
    ProjectUpdateDescriptionTransaction,
    ProjectUpdateIconTransaction,
    ProjectUpdateColorTransaction,
    ProjectUpdateSlugsTransaction,
    ProjectUpdateMembersAddTransaction,
    ProjectUpdateMembersRemoveTransaction,
    ProjectUpdateMembersSetTransaction,
    ProjectUpdateViewTransaction,
    ProjectUpdateEditTransaction,
    ProjectUpdateJoinTransaction,
    ProjectUpdateSubtypeTransaction,
    ProjectUpdateMfaTransaction,
]);

export type ProjectUpdateTransaction = z.infer<typeof ProjectUpdateTransaction>;
