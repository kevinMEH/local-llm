import { useEffect, useState } from "react";
import Link from "next/link";

import { getCache, HFCache } from "../api/server_models";

import { ConstructedSlideParameters, NextButton, Slide } from "./SlideCommons";
import ModelDisplay from "./DownloadSlideAssets/ModelDisplay";
import CardDisplay from "./DownloadSlideAssets/CardDisplay";

export default function DownloadSlide({ active, setActiveIndex, setLoadingCount }: ConstructedSlideParameters) {
    const [ cache, setCache ] = useState<HFCache>();
    const [ selectedModelId, setSelectedModelId ] = useState(undefined as string | undefined);

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
    
    return <Slide className="!max-w-[54rem]" active={active}>
        <div className="space-y-8 text-sub">
            <h1 className="text-3xl font-semibold text-main text-center">Downloading Models</h1>
            <div className="space-y-4 pb-2 text-justify flex flex-col items-center">
                <p className="px-4">
                    Browse from a selection of trending models using the search
                    box below, or find your own model on <Link href="https://huggingface.co/models?pipeline_tag=text-generation&sort=trending" target="_blank">
                        Huggingface
                    </Link> and input the model name (Example: meta-llama/Llama-3.2-1B-Instruct)
                    into the search bar.
                </p>
                <div className="*:h-[30rem] grid grid-cols-2 w-full *:w-full gap-8 flex-grow">
                    <ModelDisplay cache={cache} setSelectedModelId={setSelectedModelId}
                        className="border border-highlight rounded-xl px-3 py-3 min-w-0"
                    />
                    <CardDisplay
                        cache={cache}
                        selectedModelId={selectedModelId}
                        setSelectedModelId={setSelectedModelId}
                        refreshCache={refreshCache}
                        className="border border-highlight rounded-xl px-3 py-3 min-w-0"
                    />
                </div>
            </div>
            <div className="flex justify-center">
                <NextButton disabled={false} setActiveIndex={setActiveIndex} />
            </div>
        </div>
    </Slide>
}