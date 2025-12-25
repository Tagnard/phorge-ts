export function ConstraintObjectToParams(obj: Record<string, any>, prefix = ""): URLSearchParams {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(obj)) {
        console.log(k, v)
        if (Array.isArray(v)) {
            let index = 0;
            v.forEach((item: string, j: number) => {
                const itemVal = typeof item === "string" ? item : JSON.stringify(item);
                params.append(`constraints[${k}][${index}]`, itemVal);
                index++;
            });
        } else {
            const value = typeof v === "string" ? v : JSON.stringify(v);
            params.append(`constraints[${k}]`, value);
        }
    }
    return params;
}

export function TransactionObjectToParams(obj: Record<string, any>, prefix = ""): URLSearchParams {
    const params = new URLSearchParams();
    let index = 0;
    for (const [k, v] of Object.entries(obj)) {
        let val = v
        let key = k;

        if (["parents", "subtasks", "commits", "projects", "subscribers", "members"].includes(key)) {
            if (Object.keys(v).includes("add")) {
                key = `${key}.add`
                val = val["add"]
            } else if (Object.keys(v).includes("remove")) {
                key = `${key}.remove`
                val = val["remove"]
            } else if (Object.keys(v).includes("set")) {
                key = `${key}.set`
                val = val["set"]
            }
        }

        const typeKey = `transactions[${index}][type]`;
        const valueKey = `transactions[${index}][value]`;

        params.append(typeKey, key);

        if (Array.isArray(val)) {
            val.forEach((item: string, j: number) => {
                const itemKey = `${valueKey}[${j}]`;
                const itemVal = typeof item === "string" ? item : JSON.stringify(item);
                params.append(itemKey, itemVal);
            });
        } else {
            const value = typeof v === "string" ? v : JSON.stringify(v);
            params.append(valueKey, value);
        }

        index++;
    }
    return params;
}