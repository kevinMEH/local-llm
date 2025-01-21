"use server";

import { createStreamableValue } from "ai/rsc";

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

export async function downloadModel(modelId: string) {
    const stream = createStreamableValue([] as [string, string, string][]);
    
    (async () => {
        const response = await fetch("http://127.0.0.1:2778/models/download_model", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                repository: modelId
            })
        });
        if(response.status !== 200 || response.body === null) {
            console.error("Error: Model download failed for some unknown reason.");
            stream.error("Error: Model download failed for some unknown reason.");
            return;
        }
        const decoder = new TextDecoder();
        for await(const data of (response.body as unknown as AsyncIterable<Uint8Array>)) {
            const parts = decoder.decode(data).trim().split("\n");
            if(parts[0] === "event: progress") {
                const dataPart = parts.slice(1).join("\n");
                const progressStrings = JSON.parse(dataPart.substring(6));
                stream.update(progressStrings as [string, string, string][]);
            } else if(parts[0] === "event: error") {
                stream.error("An error was encountered while downloading the model.");
            }
        }
        stream.done();
    })();
    
    return { output: stream.value };
}

export type PreviewDeleteRevisionsResult = {
    revisions: string[],
    expected_freed_size: number,
    blobs: string[], // Paths, usually empty
    refs: string[], // Paths
    repos: string[], // Paths
    snapshots: string[], // Paths, usually empty
}

// TODO: Make this useful
export async function previewDeleteRevisions(revisions: string[]): Promise<PreviewDeleteRevisionsResult> {
    const response = await fetch("http://127.0.0.1:2778/models/preview_delete_revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            revisions: revisions
        })
    });
    const json = await response.json();
    json.revisions = [ ...revisions ];
    return json;
}

export async function deleteRevisions(revisions: string[]): Promise<void> {
    await fetch("http://127.0.0.1:2778/models/delete_revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            revisions: revisions
        })
    });
}