import { useEffect } from "react";
import { ConstructedSlideParameters, Slide } from "./SlideCommons";
import RocketIcon from "@/design/icons/RocketIcon";
import Link from "next/link";
import { getSettings, setSettings } from "../api/settings";

export default function FinalSlide({ active, setLoadingCount }: ConstructedSlideParameters) {
    useEffect(() => {
        setLoadingCount(count => count - 1);
    }, [setLoadingCount]);
    
    useEffect(() => {
        if(active) {
            (async () => {
                const settings = await getSettings();
                settings.completedWelcome = true;
                setSettings(settings);
            })();
        }
    }, [active]);
    
    return <Slide active={active}>
        <div className="space-y-8 text-sub text-justify">
            <h1 className="text-3xl font-semibold text-main text-center">Welcome to Local LLM!</h1>
            <div className="space-y-4 pb-2">
                <p>
                    You are now ready to use Local LLM! But first, a few final
                    words of advice:
                </p>
                <p>
                    If you ever need to come back to this welcome page, simply
                    put <span className="font-mono">/welcome</span> after the
                    base URL of Local LLM (likely <span className="font-mono">localhost:2777</span>).
                </p>
                <p>
                    Note that as of right now, Local LLM limits generations to
                    be processed one at a time. This is because your computer
                    likely does not have enough RAM / processing power to handle
                    multiple generations at a time.
                </p>
                <p>
                    If you need to download more models, you can do so by
                    clicking the model selector button on the top left. Aside
                    from letting you choose which models to use for generation,
                    you can also manage downloaded models and download more
                    models from that page.
                </p>
                <p>
                    Press the button below to go to the chat page and start
                    chatting now!
                </p>
            </div>
            <div className="flex justify-center">
                <Link
                    className={`w-80 py-3 rounded-md bg-transparent text-sub hover:bg-bg-mid
                    flex gap-2 items-center justify-center`}
                    href={"/"}
                >
                    <span className="font-mono">Lets go!</span>
                    <RocketIcon size={16} />
                </Link>
            </div>
        </div>
    </Slide>
}