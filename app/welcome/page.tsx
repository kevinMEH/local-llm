"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getSettings } from "../api/settings";
import BookOpenIcon from "@/design/icons/BookOpenIcon";
import LinkIcon from "@/design/icons/LinkIcon";
import ArrowLeftIcon from "@/design/icons/ArrowLeftIcon";
import StarIcon from "@/design/icons/StarIcon";
import SearchIcon from "@/design/icons/SearchIcon";

import type { ConstructedSlideParameters } from "./SlideCommons";
import WelcomeSlide from "./WelcomeSlide";
import HuggingfaceSlide from "./HuggingfaceSlide";
import InstructionSlide from "./InstructionSlide";
import DownloadSlide from "./DownloadSlide";

export default function Page() {
    const slideCount = 4;
    const [ loadingCount, setLoadingCount ] = useState(slideCount);
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ unloadLoadingPage, setUnloadLoadingPage ] = useState(false);
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
    
    const slides: SlideInformation[] = [{
        slide: WelcomeSlide,
        title: "Welcome!",
        description: "Learn all about how Local LLM works",
        icon: StarIcon
    }, {
        slide: HuggingfaceSlide,
        title: "Huggingface Integration",
        description: "Connect Local LLM to Huggingface",
        icon: LinkIcon
    }, {
        slide: InstructionSlide,
        title: "Choosing a Model",
        description: "Learn how to choose the best model for your use case",
        icon: BookOpenIcon
    }, {
        slide: DownloadSlide,
        title: "Downloading Models",
        description: "Browse and download models for Local LLM",
        icon: SearchIcon
    }];
    
    // Star
    // Link
    // Book open
    // Search
    // Rocket

    if(slideCount !== slides.length) {
        throw new Error("Note to developer: Please update slideCount.")
    }
    
    const loading = loadingCount > 0;

    return <main className="w-full h-screen flex bg-bg-light bg-[url('/patterns/topography.svg')] overflow-clip">
        <div className="flex w-screen">
            <div className="min-w-[20rem] max-w-[25rem] basis-1/4 border-r border-highlight/75 bg-bg-dark/90 p-9 flex flex-col items-center">
                <h1 className="text-3xl font-bold text-sub text-center">Local LLM</h1>
                <div className="flex-grow flex flex-col justify-center pb-8">
                    { slides.map((slide, i) => (
                    <LinkedItems key={i} active={i === activeIndex} slide={slide} />
                    ))}
                </div>
            </div>
            <SlideDisplay
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                className="flex-1 bg-bg-light/60"
            >
                { slides.map((slide, i) => {
                    return <slide.slide
                        key={i} active={activeIndex === i} setActiveIndex={setActiveIndex} setLoadingCount={setLoadingCount}
                    />
                }) }
            </SlideDisplay>
        </div>
        { !unloadLoadingPage && <Loading loading={loading} setUnloadLoadingPage={setUnloadLoadingPage} /> }
    </main>
}

type SlideInformation = {
    slide: (props: ConstructedSlideParameters) => React.ReactNode,
    title: string,
    description: string,
    icon: (props: { size: number, className: string }) => React.JSX.Element
};

function LinkedItems({ active, slide }: { active: boolean, slide: SlideInformation }) {
    return <div className={`flex gap-5 group`}>
        <div className="flex flex-col">
            <div
                className={`border border-highlight rounded-md w-10 h-10 flex items-center justify-center
                ${active ? "opacity-100" : "opacity-50"} transition-opacity duration-500`}
            >
                <slide.icon size={20} className="text-sub" />
            </div>
            <div className="group-last:hidden border-[0.5px] ml-[20px] border-highlight flex-1 w-0 opacity-50"></div>
        </div>
        <div className={`flex-1 pb-6 ${active ? "opacity-100" : "opacity-50"} transition-opacity duration-500`}>
            <h2 className="font-medium text-main tracking-wide">{slide.title}</h2>
            <p className="text-sub text-sm min-h-10">{slide.description}</p>
        </div>
    </div>
}

function SlideDisplay({ activeIndex, setActiveIndex, children, className }: {
    activeIndex: number, setActiveIndex: Dispatch<SetStateAction<number>>, className: string, children: React.ReactNode[]
}) {
    const [ _resize, setResize ] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    
    function calculateOffset() {
        const container = containerRef.current;
        if(container) {
            const centers = [...container.children].map(element => {
                const top = (element as HTMLElement).offsetTop;
                const height = (element as HTMLElement).offsetHeight;
                return top + height / 2;
            });
            const offsets = centers.map(center => -center / 16)
            return offsets;
        }
        return [];
    }
    
    useEffect(() => {
        const observer = new ResizeObserver(() => {
            setResize(resize => resize + 1);
        });
        observer.observe(document.body);
        return () => observer.disconnect();
    }, []);

    return <div className={className + " relative"}>
        { activeIndex !== 0 &&
        <button className={`absolute top-4 left-4 px-6 py-3 rounded-md
            bg-bg-light hover:bg-bg-mid transition-colors z-10
            cursor-pointer flex gap-2 items-center text-sub`}
            onClick={() => setActiveIndex(index => index - 1)}
        >
            <ArrowLeftIcon size={16} strokeWidth={2.5} />
            <span className="font-mono">Back</span>
        </button> }
        <div className="h-full translate-y-1/2">
            <div className={`flex flex-col items-center gap-[16rem] overflow-x-visible transition-transform duration-500`}
                style={{ transform: `translate(0, ${calculateOffset()[activeIndex] + "rem"})` }}
                ref={containerRef}
            >
                { children }
            </div>
        </div>
    </div>
}

function Loading({ loading, setUnloadLoadingPage }: { loading: boolean, setUnloadLoadingPage: Dispatch<SetStateAction<boolean>> }) {
    const [ dots, setDots ] = useState("...");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(dots => ".".repeat((dots.length + 1) % 4));
        }, 500);
        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        if(!loading) {
            setTimeout(() => setUnloadLoadingPage(true), 1000);
        }
    }, [ loading, setUnloadLoadingPage ])

    return <div
        className={`absolute inset-0 pb-12 bg-bg-dark z-10
        pointer-events-none ${loading ? "opacity-100" : "opacity-0" }
        transition-opacity duration-500 flex items-center justify-center
        text-sub text-2xl font-mono`}
    >
        Loading{dots}
    </div>
}
