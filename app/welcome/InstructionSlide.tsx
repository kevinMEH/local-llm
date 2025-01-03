import { useEffect } from "react";

import { ConstructedSlideParameters, NextButton, Slide } from "./SlideCommons";
import Link from "next/link";

export default function InstructionSlide({ active, setActiveIndex, setLoadingCount }: ConstructedSlideParameters) {
    useEffect(() => {
        setLoadingCount(count => count - 1);
    }, [setLoadingCount]);
    
    return <Slide active={active}>
        <div className={`space-y-8 text-sub text-justify`}>
            <h1 className="text-3xl font-semibold text-main text-center">Downloading Models</h1>
            <div className="space-y-4 pb-2">
                <p>
                    You are now ready to download your first model!
                    Browse from a selection of trending models on the next page 
                    or find your own model on <Link href="https://huggingface.co/models?pipeline_tag=text-generation&sort=trending" target="_blank">
                        Huggingface
                    </Link> and input the model name
                    (Example: meta-llama/Llama-3.2-1B-Instruct) into the download field.
                </p>
                <p>
                    Here are some tips for choosing models:
                </p>
                <ul className="list-disc px-5 space-y-1.5">
                    <li>
                        Take note of your system's capabilities
                        (specifically, GPU/TPU memory, and to a lesser extent, main
                        memory) when deciding which model to use.
                    </li>
                    <li>
                        As a rule of thumb, you will need 2 GBs of memory for every
                        1 billion parameters on 16 bit precision.
                    </li>
                    <li>
                        Smaller models may not give the best results, but models
                        that are too large will result in extremely slow generation.
                    </li>
                    <li>
                        When searching for models, make sure to find ones made for
                        text generation. In addition, models labelled with "Instruct"
                        are better suited for chatting experiences.
                    </li>
                    <li>
                        If you have no idea which models to choose, we recommend
                        <Link target="_blank" href="https://huggingface.co/meta-llama">
                            Meta's Llama family of models.
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="flex justify-center">
                <NextButton disabled={!active} setActiveIndex={setActiveIndex} />
            </div>
        </div>
    </Slide>
}
