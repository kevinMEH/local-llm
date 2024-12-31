"use server";

export type HFCache = {
    size_on_disk: number,
    repos: HFRepo[],
    warnings: string[]
}

export type HFRepo = {
    repo_id: string,
    repo_type: string,
    repo_path: string,
    size_on_disk: number,
    nb_files: number,
    revisions: HFRevision[],
    last_accessed: number,
    last_modified: number
}

export type HFRevision = {
    commit_hash: string,
    snapshot_path: string,
    size_on_disk: number,
    files: HFFiles[],
    refs: string[],
    last_modified: number
}

export type HFFiles = {
    file_name: string,
    file_path: string,
    blob_path: string,
    size_on_disk: number,
    blob_last_accessed: number,
    blob_last_modified: number
}

export async function getCache(): Promise<HFCache> {
    const response = await fetch("http://127.0.0.1:2778/models/get_cache", {
        method: "POST"
    });
    const json = await response.json();
    return json as HFCache;
}
