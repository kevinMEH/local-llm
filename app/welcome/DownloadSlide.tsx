import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import RefreshIcon from "@/design/icons/RefreshIcon";
import { ConstructedSlideParameters, NextButton, Slide } from "./SlideCommons";
import { getGeneratorBatch, InfiniteAsyncGenerator, listModels, ModelEntry } from "../api/client_models";
import { getCache, HFCache, HFRepo } from "../api/server_models";

export default function DownloadSlide({ active, setActiveIndex, setLoadingCount }: ConstructedSlideParameters) {
    const [ cache, setCache ] = useState<HFCache>();

    useEffect(() => {
        getCache().then(cache => {
            setCache(cache);
        }).finally(() => {
            setLoadingCount(count => count - 1);
        })
    }, [setLoadingCount]);
    
    useEffect(() => {
        if(active) {
            refreshCache();
        }
    }, [active]);
    
    function refreshCache(event?: React.MouseEvent<HTMLButtonElement>) {
        event?.stopPropagation();
        event?.preventDefault();
        getCache().then(cache => setCache(cache));
    }
    
    return <Slide active={active}>
        <div className="space-y-8 text-sub">
            <h1 className="text-3xl font-semibold text-main text-center">Downloading Models</h1>
            <div className="space-y-4 pb-2 text-justify">
                <p>
                    Browse from a selection of trending models from the search
                    box below, or find your own model on <Link href="https://huggingface.co/models?pipeline_tag=text-generation&sort=trending" target="_blank">
                        Huggingface
                    </Link> and input the model name (Example: meta-llama/Llama-3.2-1B-Instruct)
                    into the search bar.
                </p>
                <div className="space-y-4 mx-auto max-w-[30rem] max-h-96 flex flex-col">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-main">Downloaded Models:</h2>
                        <button
                            className="px-5 py-2.5
                            rounded-md border border-highlight bg-transparent hover:bg-bg-mid
                            transition-colors flex gap-2 items-center justify-center"
                            onClick={refreshCache}
                        >
                            <span className="font-mono text-sm">Refresh</span>
                            <RefreshIcon size={14} />
                        </button>
                    </div>
                    <div className="overflow-y-scroll invert-scrollbar-color border border-highlight rounded-xl pl-[15px] py-3 pr-0">
                        { cache?.repos.map(
                            (repo, i) => <ExistingModelElement key={i} repo={repo} />
                        ) }
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <NextButton disabled={false} setActiveIndex={setActiveIndex} />
            </div>
        </div>
    </Slide>
}

/**
 * You may wonder why 1000 is used instead of 1024:
 * We always consider the worst case scenario for the user, thus we try to make
 * the storage size as large as possible.
 */
 function bytesToReadable(bytes: number): string {
    const units = [ "B", "KB", "MB", "GB" ];
    let unitsIndex = 0;
    while(bytes > 1000 && unitsIndex < units.length - 1) {
        bytes = bytes / 1000;
        unitsIndex += 1;
    }
    return bytes.toFixed(2) + " " + units[unitsIndex] + "s";
}

function ExistingModelElement({ repo }: { repo: HFRepo }) {
    const {
        repo_id, size_on_disk, nb_files, last_accessed
    } = repo;
    const lastAccessedDate = new Date(last_accessed * 1000);
    const readableSizeOnDisk = bytesToReadable(size_on_disk);
    
    const repoOwner = repo_id.substring(0, repo_id.indexOf("/"));
    
    const [ avatarUrl, setAvatarUrl ] = useState<string>("https://cdn-avatars.huggingface.co/v1/production/uploads/64a32c8cd9dd1da3508366b0/HyiBEJCSZa-YXSGRH1nzi.png");
    useEffect(() => {
        (async () => {
            const response = await fetch(`https://huggingface.co/api/organizations/${repoOwner}/avatar`);
            const data = await response.json();
            if(data.avatarUrl) {
                setAvatarUrl(data.avatarUrl as string);
            } else {
                const response = await fetch(`https://huggingface.co/api/users/${repoOwner}/avatar`);
                const data = await response.json();
                if(data.avatarUrl) {
                    setAvatarUrl(data.avatarUrl as string);
                }
            }
        })();
    }, [repoOwner]);
    
    return <div className="border border-highlight first:mt-0 -mt-[1px] first:rounded-t-md last:rounded-b-md px-5 py-3 flex gap-5">
        <div className="flex items-center">
            <Image src={avatarUrl} alt={`${repoOwner}'s avatar`} width={40} height={40} />
        </div>
        <div>
            <h3 className="font-mono text-sm">{repo_id}</h3>
            <p className="text-xs text-quiet">Last accessed: {lastAccessedDate.toLocaleString()}</p>
            <p className="text-xs text-quiet">{nb_files} file(s) occupying {readableSizeOnDisk}</p>
        </div>
    </div>
}

function ModelPageDisplay({ cache }: { cache: HFCache }) {
    const [ generator, setGenerator ] = useState<InfiniteAsyncGenerator<ModelEntry, undefined>>(listModels());
    const [ models, setModels ] = useState<ModelEntry[]>([]);
    const [ page, setPage ] = useState(0);
    const [ pageLimit, setPageLimit ] = useState(Infinity);
    const [ searchText, setSearchText ] = useState("");
    const [ searchTimeout, setSearchTimeout ] = useState<number | undefined>(undefined);
    const [ realSearch, setRealSearch ] = useState("");
    
    const itemsPerPage = 10;
    
    useEffect(() => {
        setGenerator(listModels({
            search: realSearch ? realSearch : undefined,
            filter: [ "text-generation" ]
        }));
        setPage(0);
        setPageLimit(Infinity);
    }, [ realSearch ]);
    
    // We will always have current page and next page ready
    useEffect(() => {
        if(page === 0) {
            (async () => {
                const currentBatch = await getGeneratorBatch(generator, itemsPerPage);
                const nextBatch = await getGeneratorBatch(generator, itemsPerPage);
                setModels(currentBatch.concat(nextBatch));
                if(currentBatch.length < itemsPerPage || nextBatch.length === 0) {
                    setPageLimit(page);
                } else if(nextBatch.length < itemsPerPage) {
                    setPageLimit(page + 1);
                }
            })();
        } else {
            (async () => {
                const nextBatch = await getGeneratorBatch(generator, itemsPerPage);
                if(nextBatch.length === 0) {
                    setPageLimit(page);
                } else {
                    setModels(models.concat(nextBatch));
                    if(nextBatch.length < itemsPerPage) {
                        setPageLimit(page + 1);
                    }
                }
            })();
        }
    }, [ generator, page, models ]);
    
    function setSearch(event: ChangeEvent<HTMLInputElement>) {
        clearTimeout(searchTimeout);
        const value = event.target.value;
        setSearchText(value);
        setSearchTimeout(window.setTimeout(() => {
            setRealSearch(value);
        }, 5000));
    }
    
    const currentPageModels = models.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    return <div className="rounded-lg border border-highlignt p-5">
        <input
            className="font-mono bg-transparent rounded-md border border-highlight px-5 py-3 outline-none w-full placeholder:text-quiet"
            value={searchText} onChange={setSearch}
            placeholder="Search for models..."
        />
        <div>
        </div>
    </div>
}

/*
    id: string;
    likes: number;
    trendingScore: number;
    downloads: number;
    tags: string[];
    createdAt: string;
    
    repo_id: string,
    repo_type: string,
    repo_path: string,
    size_on_disk: number,
    nb_files: number,
    revisions: HFRevision[],
    last_accessed: number,
    last_modified: number
*/
function ModelElement({ model }: { model: ModelEntry | HFRepo }) {
    return <div>
        
    </div>
}