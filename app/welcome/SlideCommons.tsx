import ArrowLeftIcon from "@/design/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/design/icons/ArrowRightIcon";
import { Dispatch, SetStateAction } from "react";

type SlideParameters = {
    active: boolean,
    widthTailwindClass: string,
    children: React.ReactNode
}

export function Slide({ active, widthTailwindClass, children }: SlideParameters) {
    return <div className={
            `${active ? "opacity-100" : "opacity-50"} flex-shrink-0
            transition-opacity ${widthTailwindClass} min-h-[26rem] bg-bg-mid
            border border-highlight rounded-xl py-10 px-12 space-y-16
            flex flex-col justify-between`
    }>
        { children }
    </div>
}

type ButtonParameters = {
    setActiveIndex: Dispatch<SetStateAction<number>>,
    disabled: boolean
}

export function NextButton({ setActiveIndex, disabled }: ButtonParameters) {
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

export function PreviousButton({ setActiveIndex, disabled }: ButtonParameters) {
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

export type ConstructedSlideParameters = {
    active: boolean,
    widthTailwindClass: string,
    setActiveIndex: Dispatch<SetStateAction<number>>,
    setLoadingCount: Dispatch<SetStateAction<number>>
}