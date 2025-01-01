"use client";

import React, { useEffect, useState } from "react";
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
