import { useEffect, useState } from "react";
import { ConstructedSlideParameters, NextButton, Slide } from "./SlideCommons";


export default function WelcomeSlide({ active, widthTailwindClass, setActiveIndex, setLoadingCount }: ConstructedSlideParameters) {
    const [ hasInternet, setHasInternet ] = useState(true);

    useEffect(() => {
        fetch("https://huggingface.co/api/models/meta-llama/Llama-3.2-3B-Instruct").catch(() => {
            setHasInternet(false);
        }).finally(() => {
            setLoadingCount(count => count - 1);
        });
    }, [setLoadingCount]);

    return <Slide active={active} widthTailwindClass={widthTailwindClass}>
        <div className={`space-y-4 text-sub ${active ? "" : "select-none"}`}>
            <h1 className="text-3xl font-semibold text-main">Welcome to Local LLM!</h1>
            <p>
                Welcome to Local LLM! Local LLM is an application that enables
                you to run Large Language Models (LLMs) and other AI models
                locally on your computer without requiring access to the internet.
            </p>
            { hasInternet
            ? <p>
                The next few slides will guide you through the setup process for
                Local LLM. Note that an internet connection is required to
                download models for offline use.
            </p>
            : <p>
                Unfortunately, an internet connection is required for initial setup
                and to download models for offline use. Please connect to the
                internet before continuing with the setup process.
            </p> }
        </div>
        <div className="flex justify-end">
            <NextButton setActiveIndex={setActiveIndex} disabled={!hasInternet || !active} />
        </div>
    </Slide>
}