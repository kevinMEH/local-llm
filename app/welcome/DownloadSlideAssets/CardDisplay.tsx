import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { readStreamableValue } from "ai/rsc";
import Link from "next/link";

import XIcon from "@/design/icons/XIcon";
import HeartIcon from "@/design/icons/HeartIcon";
import DownloadIcon from "@/design/icons/DownloadIcon";

import ScrollHint from "../ScrollHint";

import { bytesToReadable, calculateModelSizeBytes, getModelInformation, ModelInformation, numberToReadable } from "@/app/api/client_models";
import { deleteRevisions, downloadModel, HFCache, HFRepo, previewDeleteRevisions, PreviewDeleteRevisionsResult } from "@/app/api/server_models";


export default function CardDisplay({ cache, selectedModelId, setSelectedModelId, refreshCache, className }:
{ cache: HFCache | undefined, selectedModelId: string | undefined, setSelectedModelId: Dispatch<SetStateAction<string | undefined>>, refreshCache: () => void, className: string }) {
    const [ modelInformation, setModelInformation ] = useState(undefined as ModelInformation | undefined);
    const [ error, setError ] = useState(false as false | string);
    
    useEffect(() => {
        setModelInformation(undefined);
        setError(false);
        if(selectedModelId) {
            getModelInformation(selectedModelId).then(information => {
                if("error" in information) {
                    setError("Model not found.");
                } else {
                    setModelInformation(information);
                }
            })
        }
    }, [selectedModelId])

    const downloadedRepo = cache?.repos.find(repo => repo.repo_id === selectedModelId);
    
    return <div className={`flex flex-col items-center justify-around invert-scrollbar-color overflow-y-auto ${className}`}>
        { selectedModelId
        ? <div className="w-full p-1 gap-2 flex flex-col flex-1 text-left">
            <div className="flex justify-between gap-4">
                <Link href={`https://huggingface.co/${selectedModelId}`} target="_blank" className="font-mono text-wrap text-lg">{ selectedModelId }</Link>
                <div>
                    <button
                        onClick={() => setSelectedModelId(undefined)}
                        className="flex gap-1.5 items-center px-2 py-2 border border-highlight rounded-md
                        hover:bg-bg-dark/40 transition-colors"
                    >
                        <span className="pl-1 text-xs font-mono">Close</span>
                        <XIcon size={14} />
                    </button>
                </div>
            </div>
            { modelInformation
            ? <>
                { downloadedRepo
                ? <DownloadedModelInformation downloadedRepo={downloadedRepo} refreshCache={refreshCache} />
                : <BrowseModelInformation modelInformation={modelInformation} refreshCache={refreshCache} />
                } 
            </>
            : <p className="font-mono">Loading...</p>
            }
            { error && <p className="text-error">{ error }</p>}
        </div>
        : <p>Select a model to view details</p>
        }
    </div>
}

function DownloadedModelInformation({ downloadedRepo, refreshCache }:
{ downloadedRepo: HFRepo, refreshCache: () => void }) {
    const [ deletionPreview, setDeletionPreview ] = useState(undefined as undefined | PreviewDeleteRevisionsResult);
    
    useEffect(() => {
        setDeletionPreview(undefined);
    }, [ downloadedRepo ])

    return <div className="flex flex-col gap-4 w-full flex-1 text-sm break-words font-mono">
        <div className="w-full grid grid-cols-[auto_auto] gap-y-1 gap-x-3">
            <h3>Model Path:</h3>
            <p className="text-quiet min-w-0">
                {downloadedRepo.repo_path}
            </p>
            <h3>Last accessed:</h3>
            <p className="text-quiet min-w-0">
                { new Date(downloadedRepo.last_accessed).toLocaleString() }
            </p>
            <h3>Last modified:</h3>
            <p className="text-quiet min-w-0">
                { new Date(downloadedRepo.last_modified).toLocaleString() }
            </p>
            <h3>Storage:</h3>
            <p className="text-quiet min-w-0">
                {downloadedRepo.nb_files} files occupying {bytesToReadable(downloadedRepo.size_on_disk)}
            </p>
        </div>
        <div className="flex flex-col gap-2 flex-1">
            <p>Revisions:</p>
            <ScrollHint className="overflow-y-scroll hide-scrollbar flex-1 border border-highlight rounded-md max-h-[15rem]">
                {
                    deletionPreview
                    ? <div className="flex flex-col items-center gap-2 justify-self-center h-full justify-center">
                        <p>Deleting { deletionPreview.revisions[0].substring(0, 6) }:</p>
                        <p>Deletion expected to free { bytesToReadable(deletionPreview.expected_freed_size) }</p>
                        <div className="flex gap-4">
                            <button
                                onClick={async () => {
                                    await deleteRevisions(deletionPreview.revisions);
                                    setDeletionPreview(undefined);
                                    refreshCache();
                                }}
                                className="px-2 py-1 border border-highlight rounded-md hover:bg-bg-dark/40 transition-colors"
                            >Delete</button>
                            <button
                                onClick={() => {
                                    setDeletionPreview(undefined);
                                }}
                                className="px-2 py-1 border border-highlight rounded-md hover:bg-bg-dark/40 transition-colors"
                            >Cancel</button>
                        </div>
                    </div>
                    : <> { downloadedRepo.revisions.map((revision, index) => {
                        return <div
                            key={index}
                            className="outline outline-1 first:mt-0 mt-[1px] outline-highlight flex items-center justify-between gap-3 px-3 py-2"
                        >
                            <div className="flex gap-2 items-center font-mono">
                                { revision.refs.map((ref, index) => {
                                    return <span key={index} className="text-xs rounded-md px-2 py-1 text-quiet bg-bg-dark/50">{ ref }</span>
                                }) }
                                <p>{ revision.commit_hash.substring(0, 6) }</p>
                            </div>
                            <div className="flex gap-4 items-center text-xs">
                                <span>{ bytesToReadable(revision.size_on_disk) }</span>
                                <button
                                    onClick={() => {
                                        previewDeleteRevisions([ revision.commit_hash ]).then(preview => setDeletionPreview(preview))
                                    }}
                                    className="px-2 py-1 border border-highlight rounded-md hover:bg-bg-dark/40 transition-colors"
                                >Preview Delete</button>
                            </div>
                        </div>
                    })} </>
                }
            </ScrollHint>
        </div>
        <button
            onClick={async () => {
                await deleteRevisions(downloadedRepo.revisions.map(revision => revision.commit_hash));
                refreshCache();
            }}
            className="border border-highlight rounded-md py-2.5 hover:bg-bg-dark/40 transition-colors"
        >Delete Model</button>
    </div>
}

function BrowseModelInformation({ modelInformation, refreshCache }:
{ modelInformation: ModelInformation, refreshCache: () => void }) {
    const [ downloading, setDownloading ] = useState(false);
    const [ progress, setProgress ] = useState([] as [string, string, string][]);
    const [ downloadError, setDownloadError ] = useState(false);
    
    useEffect(() => {
        setDownloading(false);
        setProgress([]);
        setDownloadError(false);
    }, [ modelInformation.id ]);
    
    async function downloadModelHandler() {
        try {
            setDownloading(true);
            const outputStream = (await downloadModel(modelInformation.id)).output;
            for await (const progress of readStreamableValue(outputStream)) {
                if(progress) {
                    setProgress(progress);
                }
            }
            setDownloading(false);
        } catch(_error) {
            setDownloadError(true);
        } finally {
            refreshCache();
        }
    }

    return <div className="flex flex-col gap-4 w-full flex-1 text-sm break-words font-mono">
        <div className="w-full grid grid-cols-[auto_auto] gap-y-1 gap-x-3">
            <div className="col-span-2 flex gap-3 items-center text-xs">
                <span className="flex gap-1 items-center">
                    <HeartIcon size={14} />
                    <span>{ numberToReadable(modelInformation.likes) }</span>
                </span>
                <span className="flex gap-1 items-center">
                    <DownloadIcon size={14} />
                    <span>{ numberToReadable(modelInformation.downloads) }</span>
                </span>
                { modelInformation.pipeline_tag && <span className="px-1.5 py-1 bg-bg-dark rounded-md ">{ modelInformation.pipeline_tag }</span> }
            </div>
            <h3>Created on:</h3>
            <p className="text-quiet min-w-0">
                { new Date(modelInformation.createdAt).toLocaleString() }
            </p>
            <h3>Last modified:</h3>
            <p className="text-quiet min-w-0">
                { new Date(modelInformation.lastModified).toLocaleString() }
            </p>
            <h3>Model size:</h3>
            <p className="text-quiet min-w-0">
                {modelInformation.siblings.length} files occupying {bytesToReadable(calculateModelSizeBytes(modelInformation))}
            </p>
            { modelInformation.gated && <>
                <h3>Gated:</h3>
                <p className="text-quiet min-w-0">
                    This model is gated. Make sure to <Link target="_blank" href={`https://huggingface.co/${modelInformation.id}`}>obtain permission</Link> before downloading.
                </p>
            </> }
        </div>
        <div className="flex flex-col gap-2 flex-1">
            {
            downloading
            ? <div className="flex-1 border border-highlight rounded-md px-3 py-2 text-xs">
                { downloadError
                ? <div className="flex items-center justify-around text-base">
                    There was an error downloading the model.
                </div>
                : <>
                    { progress.map((file, index) => {
                        return <div key={index} className="text-quiet break-all">
                            <p>{ file[0] } | { file[2] }</p>
                            <pre>{ file[1] }</pre>
                        </div>
                    }) }
                </>
                }
            </div>
            : <>
                <div className="flex justify-between">
                    <p>Files:</p>
                </div>
                <ScrollHint className="overflow-y-scroll hide-scrollbar flex-1 border border-highlight rounded-md max-h-[15rem]">
                    { modelInformation.siblings.map((file, index) => {
                        return <div
                            key={index}
                            className="outline outline-1 first:mt-0 mt-[1px] outline-highlight flex items-center justify-between gap-3 px-3 py-2"
                        >
                            <p className="font-mono overflow-hidden overflow-ellipsis text-nowrap">{file.rfilename}</p>
                            <p className="text-nowrap text-quiet">{bytesToReadable(file.size)}</p>
                        </div>
                    }) }
                </ScrollHint>
            </>
            }
        </div>
        {
            !downloading && <button
                onClick={downloadModelHandler}
                className="border border-highlight rounded-md py-2.5 hover:bg-bg-dark/40 transition-colors"
            >Download Model</button>
        }
    </div>
}