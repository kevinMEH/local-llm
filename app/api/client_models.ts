"use client";

export type ModelEntry = {
    id: string;
    // modelId: string; // Same as id
    likes: number;
    trendingScore: number;
    // private: boolean;
    downloads: number;
    tags: string[];
    createdAt: string;
};
const desiredModelEntryKeys: string[] = [
    "likes", "trendingScore", "downloads", "tags", "createdAt"
] satisfies (keyof ModelEntry)[];

type ListModelsParameters = {
    search?: string;
    author?: string;
    filter?: string[];
    limit?: number;
};

/**
 * WARNING: If you set hardLimit to infinity, this generator is effectively
 * INFINITE!!! Therefore, do not put it inside a for of loop. Make sure that
 * this generator is only processed using generator.next()!!
 */
async function* _listModels(
    {
        search = undefined,
        author = undefined,
        filter = undefined,
        limit = 50,
    }: ListModelsParameters,
    hardLimit: number = 500
): AsyncGenerator<ModelEntry, undefined> {
    const parameters = new URLSearchParams();
    if (search) parameters.append("search", search);
    if (author) parameters.append("author", author);
    if (filter) filter.forEach(tag => parameters.append("filter", tag));
    parameters.append("limit", limit.toString());
    desiredModelEntryKeys.forEach(key => parameters.append("expand", key));

    let count = 0;
    let url = `https://huggingface.co/api/models?${parameters.toString()}`;
    while (true) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Request failed with code " + response.status);
        }
        const models = await response.json();
        for (const model of models) {
            yield model as ModelEntry;
            count++;
            if (count === hardLimit) {
                return;
            }
        }
        const next = response.headers.get("Link");
        if (next === null) {
            return;
        }
        url = next.substring(next.indexOf("<") + 1, next.indexOf(">"));
    }
}

/**
 * Type to prevent users from calling for of loop on the result.
 * Calling a for of loop on an infinite generator will effectively put the
 * program inside an infinite loop!!!
 */
export type InfiniteAsyncGenerator<T, TReturn = unknown> = {
    next(): Promise<IteratorResult<T, TReturn>>;
};

/**
 * Wrapper for _listModels which forces the user to call next() to process the
 * generator.
 */
export async function* listModels(parameters: ListModelsParameters = {}): InfiniteAsyncGenerator<ModelEntry, undefined> {
    yield* _listModels(parameters, Infinity);
    return;
}

export async function getGeneratorBatch<T>(generator: InfiniteAsyncGenerator<T>, batchSize: number): Promise<T[]> {
    // Cannot use Promise<T>[] and Promise.all because async generators force await on yield.
    const values: T[] = [];
    for(let i = 0; i < batchSize; i++) {
        const { done, value } = await generator.next();
        if(!done) {
            values.push(value);
        } else {
            return values;
        }
    }
    return values;
}

export type ModelInformation = {
    id: string;
    // modelId: string; // Same as id
    author: string;
    sha: string;
    lastModified: string;
    // private: boolean;
    // disabled: boolean;
    gated: "auto" | "manual" | false;
    pipeline_tag?: "text-generation" | string;
    tags: string[];
    downloads: number;
    likes: number;
    siblings: {
        rfilename: string,
        size: number,
        blob_id: string,
    }[];
    createdAt: string;
    safetensors?: {
        parameters: Record<string, number>;
        total: number;
    };
};
const desiredModelInformationKeys: string[] = [
    "author", "sha", "lastModified", "gated", "pipeline_tag",
    "tags", "downloads", "likes", "siblings", "createdAt", "safetensors"
] satisfies (keyof ModelInformation)[];

export async function getModelInformation(modelId: string): Promise<ModelInformation | { error: string }> {
    const parameters = new URLSearchParams();
    parameters.append("blobs", "true");
    desiredModelInformationKeys.forEach(key => parameters.append("expand", key));
    const response = await fetch(
        `https://huggingface.co/api/models/${modelId}?${parameters.toString()}`
    );
    if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
    }
    const modelInformation = await response.json();
    return modelInformation as ModelInformation | { error: string };
}

export function calculateModelSizeBytes(model: ModelInformation): number {
    let size = 0;
    for(const sibling of model.siblings) {
        size += sibling.size;
    }
    return size;
}

/**
 * You may wonder why 1000 is used instead of 1024:
 * We always consider the worst case scenario for the user, thus we try to make
 * the storage size as large as possible.
 */
 export function bytesToReadable(bytes: number): string {
    const units = [ " B", " KB", " MB", " GB" ];
    return unitize(bytes, units);
}

export function numberToReadable(number: number): string {
    return unitize(number, ["", "k", "M"]);
}

function unitize(amount: number, units: string[]) {
    let unitsIndex = 0;
    while(amount > 1000 && unitsIndex < units.length - 1) {
        amount = amount / 1000;
        unitsIndex += 1;
    }
    if(unitsIndex !== 0) {
        return amount.toFixed(2) + "" + units[unitsIndex];
    } else {
        return amount + "" + units[unitsIndex];
    }
}