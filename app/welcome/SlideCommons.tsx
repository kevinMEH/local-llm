import ArrowRightIcon from "@/design/icons/ArrowRightIcon";
import { Dispatch, SetStateAction } from "react";

type SlideParameters = {
    active: boolean,
    widthTailwindClass: string,
    className?: string,
    children: React.ReactNode
}

export function Slide({ active, widthTailwindClass, className = "", children }: SlideParameters) {
    return <div className="h-screen flex items-center px-8 pb-20 pt-16">
        <div className={`${active ? "opacity-100" : "opacity-50"} transition-opacity ${widthTailwindClass} ${className}`}>
            { children }
        </div>
    </div>
}

export function NextButton({ setActiveIndex, disabled }: {
    setActiveIndex: Dispatch<SetStateAction<number>>,
    disabled: boolean
}) {
    return <button
        className={`w-80 py-3 rounded-md bg-transparent ${disabled ? "text-quiet opacity-50" : "text-sub hover:bg-bg-mid"}
        transition-colors flex gap-2 items-center justify-center`}
        onClick={() => setActiveIndex(old => old + 1)}
        disabled={disabled}
    >
        <span className="font-mono">Next</span>
        <ArrowRightIcon size={16} strokeWidth={2.5} />
    </button>
}


export type ConstructedSlideParameters = {
    active: boolean,
    widthTailwindClass: string,
    setActiveIndex: Dispatch<SetStateAction<number>>,
    setLoadingCount: Dispatch<SetStateAction<number>>
}