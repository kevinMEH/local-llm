"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSettings } from "../api/settings";
import Link from "next/link";

import { loggedIn, login } from "../api/welcome";
import ArrowRightIcon from "@/design/icons/ArrowRightIcon";
import ArrowLeftIcon from "@/design/icons/ArrowLeftIcon";
import SendIcon from "@/design/icons/SendIcon";

export default function Page() {
    const slideCount = 2;
    const [ loadingCount, setLoadingCount ] = useState(slideCount);
    const [ activeIndex, setActiveIndex ] = useState(0);
    const router = useRouter();
    
    useEffect(() => {
        console.log(loadingCount);
    }, [loadingCount])
    
    useEffect(() => {
        (async () => {
            const settings = await getSettings();
            if(settings.completedWelcome) {
                router.push("/");
            }
        })();
    }, [router]);

    const widthTailwindClass = "w-[48rem]";
    const gapTailwindClass = "gap-[12rem]";
    const transformWidthRem = 60;
    
    const slides: React.ReactNode[] = [
        <WelcomeSlide key={0}
            active={activeIndex === 0}
            setActiveIndex={setActiveIndex}
            setLoadingCount={setLoadingCount}
            widthTailwindClass={widthTailwindClass}
        />,
        <HuggingfaceSlide key={1}
            active={activeIndex === 1}
            setActiveIndex={setActiveIndex}
            setLoadingCount={setLoadingCount}
            widthTailwindClass={widthTailwindClass}
        />,
    ]
    
    if(slideCount !== slides.length) {
        throw new Error("Note to developer: Please update slideCount.")
    }
    
    const loading = loadingCount > 0;

    return <main className="w-full h-screen pb-12 flex justify-center items-center overflow-clip">
        <SlideDisplay
            activeIndex={activeIndex}
            widthTailwindClass={widthTailwindClass}
            gapTailwindClass={gapTailwindClass}
            transformWidthRem={transformWidthRem}
        >
            { slides }
        </SlideDisplay>
        <Loading loading={loading} />
    </main>
}

function Loading({ loading }: { loading: boolean }) {
    const [ dots, setDots ] = useState("...");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(dots => ".".repeat((dots.length + 1) % 4));
        }, 500);
        return (() => clearInterval(interval));
    }, []);

    return <div
        className={`absolute left-0 right-0 top-0 bottom-0 pb-12 bg-bg-dark z-10
        pointer-events-none ${loading ? "opacity-100" : "opacity-0" }
        transition-opacity duration-500 flex items-center justify-center
        text-sub text-2xl font-mono`}
    >
        Loading{dots}
    </div>
}

type SlideDisplayParameters = {
    activeIndex: number,
    widthTailwindClass: string,
    gapTailwindClass: string,
    transformWidthRem: number,
    children: React.ReactNode
}

function SlideDisplay({
    activeIndex,
    widthTailwindClass,
    gapTailwindClass,
    transformWidthRem,
    children
}: SlideDisplayParameters) {
    return <div className={`${widthTailwindClass}`}>
        <div className={`flex items-center ${gapTailwindClass} overflow-x-visible transition-transform duration-500`}
            style={{ transform: `translate(${"-" + (activeIndex * transformWidthRem) + "rem"})` }}
        >
            { children }
        </div>
    </div>
}

type ButtonParameters = {
    setActiveIndex: Dispatch<SetStateAction<number>>,
    disabled: boolean
}

function NextButton({ setActiveIndex, disabled }: ButtonParameters) {
    return <button
        className={`border border-highlight bg-bg-mid ${disabled ? "text-quiet opacity-50" : "text-sub hover:bg-bg-light"}
        transition-colors w-28 py-2.5 rounded-md text-sub flex gap-3 items-center justify-center`}
        onClick={() => setActiveIndex(old => old + 1)}
        disabled={disabled}
    >
        <span className="font-mono pl-1">Next</span>
        <ArrowRightIcon height={17} width={12} />
    </button>
}

function PreviousButton({ setActiveIndex, disabled }: ButtonParameters) {
    return <button
        className={`border border-highlight bg-bg-mid ${disabled ? "text-quiet opacity-50" : "text-sub hover:bg-bg-light"}
        transition-colors w-28 py-2.5 rounded-md text-sub flex gap-3 items-center justify-center`}
        onClick={() => setActiveIndex(old => old - 1)}
        disabled={disabled}
    >
        <ArrowLeftIcon height={17} width={12} />
        <span className="font-mono pr-1">Back</span>
    </button>
}

type ConstructedSlideParameters = {
    active: boolean,
    widthTailwindClass: string,
    setActiveIndex: Dispatch<SetStateAction<number>>,
    setLoadingCount: Dispatch<SetStateAction<number>>
}

function WelcomeSlide({ active, widthTailwindClass, setActiveIndex, setLoadingCount }: ConstructedSlideParameters) {
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

function HuggingfaceSlide({ active, widthTailwindClass, setActiveIndex, setLoadingCount }: ConstructedSlideParameters) {
    const [ hasSavedToken, setHasSavedToken ] = useState(false);
    const [ token, setToken ] = useState("");
    const [ tokenSupplied, setTokenSupplied ] = useState(false);
    const [ tokenError, setTokenError ] = useState("");
    
    useEffect(() => {
        (async () => {
            try {
                setHasSavedToken(await loggedIn());
            } finally {
                setLoadingCount(count => count - 1);
            }
        })();
    }, [setLoadingCount]);
    
    async function submit(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        const success = await login(token);
        if(success) {
            setTokenSupplied(true);
        } else {
            setTokenError("There was an error logging in. Please check the validity of the token.");
        }
    }

    return <Slide active={active} widthTailwindClass={widthTailwindClass}>
        <div className={`space-y-8 text-sub ${active ? "" : "select-none"}`}>
            <div className="space-y-4">
                <h1 className="text-3xl font-semibold text-main">Huggingface Access</h1>
                <p>
                    Local LLM uses Huggingface as its source for model information.
                    To begin, please provide your Huggingface access token, which
                    Local LLM will use to download models.
                </p>
                { hasSavedToken && <p>
                    Local LLM has detected a saved access token.
                    You may move on to the next step.
                </p> }
            </div>
            { !hasSavedToken
            && <>
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-main">Retrieving Your Access Token:</h2>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Visit <Link href="https://huggingface.co/">Huggingface.co</Link> and log in to your account.</li>
                            <li>Go to your account settings and havigate to the <Link href="https://huggingface.co/settings/tokens">Access Tokens section.</Link></li>
                            <li>Create a new token (or use an existing one) and enter it below.</li>
                        </ol>
                    </div>
                    <div className="space-y-3">
                        {
                            !tokenSupplied
                            ? <>
                                <p className="text-quiet font-mono">Enter access token:</p>
                                <div className="flex gap-6">
                                    <input
                                        className="font-mono bg-transparent rounded-md border border-highlight px-5 py-3 outline-none w-full placeholder:text-quiet"
                                        value={token} onChange={event => setToken(event.target.value)}
                                        placeholder="Enter access token here..."
                                    />
                                    <button className="px-8 h-auto border border-highlight rounded-md transition-colors hover:bg-bg-light flex items-center gap-1.5"
                                        onClick={submit}
                                    >
                                        <span className="font-mono">Submit</span>
                                        <SendIcon width={16} height={16} className="rotate-45" />
                                    </button>
                                </div>
                                { tokenError && <p className="text-sm text-error">{ tokenError }</p> }
                            </>
                            : <p>Local LLM has saved your access token and you may move on to the next step!</p>
                        }
                    </div>
                </>
            }
        </div>
        <div className="flex justify-between">
            <PreviousButton disabled={!active} setActiveIndex={setActiveIndex} />
            <NextButton disabled={(!hasSavedToken && !tokenSupplied) || !active} setActiveIndex={setActiveIndex} />
        </div>
    </Slide>
}

type SlideParameters = {
    active: boolean,
    widthTailwindClass: string,
    children: React.ReactNode
}

function Slide({ active, widthTailwindClass, children }: SlideParameters) {
    return <div className={
            `${active ? "opacity-100" : "opacity-50"} flex-shrink-0
            transition-opacity ${widthTailwindClass} min-h-[26rem] bg-bg-mid
            border border-highlight rounded-xl py-10 px-12 space-y-16
            flex flex-col justify-between`
    }>
        { children }
    </div>
}