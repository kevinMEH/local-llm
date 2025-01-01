"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getSettings } from "../api/settings";
import WelcomeSlide from "./WelcomeSlide";
import HuggingfaceSlide from "./HuggingfaceSlide";

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

    return <main className="w-full h-screen pb-4 flex justify-center items-center overflow-clip">
        <SlideDisplay
            activeIndex={activeIndex}
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
    children: React.ReactNode[]
}

function SlideDisplay({ activeIndex, children }: SlideDisplayParameters) {
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

    return <div className="translate-y-1/2">
        <div className={`flex flex-col items-center gap-32 overflow-x-visible transition-transform duration-500`}
            style={{ transform: `translate(0, ${calculateOffset()[activeIndex] + "rem"})` }}
            ref={containerRef}
        >
            { children }
        </div>
    </div>
}
