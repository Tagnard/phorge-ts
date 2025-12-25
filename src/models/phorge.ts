import * as z from "zod";

export const ObjectType = z.enum(["ABND","ACNT","ADEV","AEML","AINT","AKEY","AMSG","ANAM","ANET","ANSW","APAS","APPE","ASRV","AUTH","BDGE","BLOG","BOOK","BULK","CART","CDTL","CDWN","CEVT","CEXP","CIMP","CMIT","CONF","CONP","CTNM","DIFF","DREV","DRYB","DSHB","DSHP","FBAK","FILE","FITV","FORM","FPRV","HMBB","HMBD","HMCP","HMCS","HRUL","HWBH","HWBR","LEGD","MCRO","MOCK","NUAI","NUAQ","NUAS","OASC","OPKG","PANL","PAYM","PCOL","PHPR","PHRL","PMRC","POLL","POST","PPAK","PPUB","PROJ","PRTL","PSET","PSTE","PSUB","PVAR","PVER","QUES","REPO","RIDT","RURI","SPCE","TASK","USER","WIKI","WTRG"]);
export type ObjectType = z.infer<typeof ObjectType>;

export type ObjectPHID<TYPE extends ObjectType | string = ObjectType> = `PHID-${TYPE}-${string}`
export type TransactionPHID<TYPE extends ObjectType | string = ObjectType> = `PHID-XACT-${TYPE}-${string}`
export type PHID<TYPE extends ObjectType | string = ObjectType> = ObjectPHID<TYPE> | TransactionPHID<TYPE>

export type List<T> = {
    add?: [T, ...T[]],
    remove?: [T, ...T[]],
    set?: [T, ...T[]]
}

export type ManiphestAPI = "maniphest.search"
export type ProjectAPI = "project.search"

export type PhorgeApis = ManiphestAPI | ProjectAPI

export type Policy = {
    view: string
    edit: string
    join: string
}

export type Cursor = {
    limit: number;
    after: string | null;
    before: string | null;
    order: string | null;
};

// Uncertain if this is correct at this moment
type Query = {
    queryKey: string | null;
};

// Generic success result
export type SuccessResult<TData> = {
    data: TData[];
    maps: Record<string, unknown>;
    query: Query;
    cursor: Cursor;
};


// Success response
export type SuccessResponse<TData> = {
    result: TData;
    error_code: null;
    error_info: null;
};

// Error response
export type ErrorResponse = {
    result?: never;
    error_code: string;
    error_info: string;
};

// Final API response type
export type ApiResponse<TData> =
    | SuccessResponse<TData>
    | ErrorResponse;

export const CreateObjectResult = z.object({
    id: z.string(),
    phid: z.custom<PHID>()
})

export type CreateObjectResult = z.infer<typeof CreateObjectResult>;

export class PhorgeError extends Error {
    constructor(public error_code: ErrorResponse['error_code'], public error_info: ErrorResponse['error_info']) {
        super(String(error_info ?? error_code ?? 'API Error'));
        this.name = 'PhorgeError';
        Object.setPrototypeOf(this, PhorgeError.prototype);
    }
}