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
    last_accessed: number, // Unix time seconds
    last_modified: number // Unix time seconds
}

type HFRevision = {
    commit_hash: string,
    snapshot_path: string,
    size_on_disk: number,
    files: HFFiles[],
    refs: string[],
    last_modified: number // Unix time seconds
}

type HFFiles = {
    file_name: string,
    file_path: string,
    blob_path: string,
    size_on_disk: number,
    blob_last_accessed: number, // Unix time seconds
    blob_last_modified: number // Unix time seconds
}

export async function getCache(): Promise<HFCache> {
    const response = await fetch("http://127.0.0.1:2778/models/get_cache", {
        method: "POST"
    });
    const json = await response.json();
    return json as HFCache;
}
