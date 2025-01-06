import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";

import { getGeneratorBatch, InfiniteAsyncGenerator, listModels, ModelEntry } from "../api/client_models";
import { getCache, HFCache } from "../api/server_models";

import ScrollHint from "./ScrollHint";
import { DownloadedModelElement, ListedModelElement } from "./ModelElements";
import { ConstructedSlideParameters, NextButton, Slide } from "./SlideCommons";

import RefreshIcon from "@/design/icons/RefreshIcon";

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
    
    return <Slide className="!max-w-none" active={active}>
        <div className="space-y-8 text-sub">
            <h1 className="text-3xl font-semibold text-main text-center">Downloading Models</h1>
            <div className="space-y-4 pb-2 text-justify flex flex-col items-center">
                <p className="max-w-[52rem]">
                    Browse from a selection of trending models from the search
                    box below, or find your own model on <Link href="https://huggingface.co/models?pipeline_tag=text-generation&sort=trending" target="_blank">
                        Huggingface
                    </Link> and input the model name (Example: meta-llama/Llama-3.2-1B-Instruct)
                    into the search bar.
                </p>
                <div className="*:h-[22rem] grid grid-cols-2 gap-8 min-w-0">
                    <div
                        className="border border-highlight rounded-xl
                        max-w-[30rem] h-full px-4 py-3 flex flex-col min-w-0"
                    >
                        <div className="flex justify-between items-center pb-3 px-3">
                            <h2 className="text-xl font-semibold text-main pt-1">Downloaded Models:</h2>
                            <button
                                className="px-3 py-2
                                rounded-md border border-highlight bg-transparet hover:bg-bg-mid
                                transition-colors flex gap-2 items-center justify-center"
                                onClick={refreshCache}
                            >
                                <span className="font-mono text-xs">Refresh</span>
                                <RefreshIcon size={12} />
                            </button>
                        </div>
                        <ScrollHint className="overflow-y-scroll hide-scrollbar">
                            { cache?.repos.map(
                                (repo, i) => <DownloadedModelElement key={i} repo={repo} />
                            ) }
                        </ScrollHint>
                    </div>
                    <ModelPageDisplay cache={cache}
                        className="border border-highlight rounded-xl
                        max-w-[30rem] h-full px-4 py-3 flex flex-col min-w-0"
                    />
                </div>
            </div>
            <div className="flex justify-center">
                <NextButton disabled={false} setActiveIndex={setActiveIndex} />
            </div>
        </div>
    </Slide>
}

function ModelPageDisplay({ cache, className }: { cache: HFCache | undefined, className: string }) {
    const [ generator, setGenerator ] = useState<InfiniteAsyncGenerator<ModelEntry, undefined>>(listModels({
        filter: [ "text-generation" ]
    }));
    const [ models, setModels ] = useState<ModelEntry[]>([]);
    const [ page, setPage ] = useState(0);
    const [ pageLimit, setPageLimit ] = useState(Infinity);
    const [ searchText, setSearchText ] = useState("");
    const [ searchTimeout, setSearchTimeout ] = useState<number | undefined>(undefined);
    
    const itemsPerPage = 10;
    
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
                    setModels(models => models.concat(nextBatch));
                    if(nextBatch.length < itemsPerPage) {
                        setPageLimit(page + 1);
                    }
                }
            })();
        }
    }, [ generator, page ]);
    
    function setSearch(event: ChangeEvent<HTMLInputElement>) {
        clearTimeout(searchTimeout);
        const value = event.target.value;
        setSearchText(value);
        setSearchTimeout(window.setTimeout(() => {
            setGenerator(listModels({
                search: value ? value : undefined,
                filter: [ "text-generation" ]
            }));
            setPage(0);
            setPageLimit(Infinity);
        }, 5000));
    }
    
    const currentPageModels = models.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    return <div className={className}>
        {/* <input
            className="font-mono bg-transparent rounded-md border text-sm border-highlight px-5 py-3 outline-none placeholder:text-quiet"
            value={searchText} onChange={setSearch}
            placeholder="Search for models..."
        /> */}
        <ScrollHint className="overflow-y-scroll hide-scrollbar">
            { currentPageModels.map((model, i) => <ListedModelElement key={i} model={model} downloaded={i%2 === 0} /> )}
        </ScrollHint>
    </div>
}
