"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getSettings } from "../api/settings";
import WelcomeSlide from "./WelcomeSlide";
import HuggingfaceSlide from "./HuggingfaceSlide";
import SendIcon from "@/design/icons/SendIcon";

export default function Page() {
    const slideCount = 2;
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

    const maxWidthTailwindClass = "max-w-[40rem]";
    
    const slides: React.ReactNode[] = [
        <WelcomeSlide key={0}
            active={activeIndex === 0}
            setActiveIndex={setActiveIndex}
            setLoadingCount={setLoadingCount}
            widthTailwindClass={maxWidthTailwindClass}
        />,
        <HuggingfaceSlide key={1}
            active={activeIndex === 1}
            setActiveIndex={setActiveIndex}
            setLoadingCount={setLoadingCount}
            widthTailwindClass={maxWidthTailwindClass}
        />,
    ]
    
    if(slideCount !== slides.length) {
        throw new Error("Note to developer: Please update slideCount.")
    }
    
    const loading = loadingCount > 0;

    return <main className="w-full h-screen flex bg-bg-light overflow-clip">
        <div className="flex w-screen">
            <div className="min-w-[25rem] border-r border-highlight bg-bg-dark px-12 py-12 flex flex-col">
                <h1 className="text-3xl font-bold pb-12 text-sub">Local LLM</h1>
                <div className="space-y-6 flex-grow flex flex-col justify-center pb-28 pr-8">
                    {
                        [
                            "Welcome",
                            "Huggingface Setup",
                            "Tips for Finding Models",
                            "Downloading Models",
                            "You're Done!",
                        ].map((text, i) => <div key={i} className={`flex gap-4 ${i === 3 ? "opacity-100" : "opacity-50"}`}>
                            <div className="border border-highlight rounded-md w-10 h-10 flex items-center justify-center">
                                <SendIcon width={20} height={20} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-main">{text}</h2>
                                <p className="text-sub">Lorem ipsum dolor sit amet</p>
                            </div>
                        </div>)
                    }
                </div>
            </div>
            <SlideDisplay
                widthTailwindClass={maxWidthTailwindClass}
                activeIndex={activeIndex}
                className="flex-1"
            >
                { slides }
            </SlideDisplay>
        </div>
        { !unloadLoadingPage && <Loading loading={loading} setUnloadLoadingPage={setUnloadLoadingPage} /> }
    </main>
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

type SlideDisplayParameters = {
    widthTailwindClass: string,
    activeIndex: number,
    className: string,
    children: React.ReactNode[]
}

function SlideDisplay({ activeIndex, children, className }: SlideDisplayParameters) {
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

    return <div className={className}>
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
