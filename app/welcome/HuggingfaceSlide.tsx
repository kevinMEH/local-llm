import { useEffect, useState } from "react";
import Link from "next/link";

import { ConstructedSlideParameters, NextButton, Slide } from "./SlideCommons";
import { loggedIn, login } from "../api/welcome";
import SendIcon from "@/design/icons/SendIcon";

export default function HuggingfaceSlide({ active, setActiveIndex, setLoadingCount }: ConstructedSlideParameters) {
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

    return <Slide active={active}>
        <div className="space-y-8 text-sub">
            <h1 className="text-3xl font-semibold text-main text-center">Huggingface Integration</h1>
            <div className="space-y-4 pb-2">
                <div className="space-y-4">
                    <p>
                        Local LLM uses Huggingface as its source for model information.
                        To begin, please provide your Huggingface access token, which
                        Local LLM will use to download models.
                    </p>
                    <h2 className="text-xl font-semibold text-main">Retrieving Your Access Token:</h2>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Visit <Link href="https://huggingface.co/" target="_blank">Huggingface.co</Link> and log in to your account.</li>
                        <li>Go to your account settings and havigate to the <Link href="https://huggingface.co/settings/tokens" target="_blank">Access Tokens section.</Link></li>
                        <li>Create a new token (or use an existing one) and enter it below.</li>
                    </ol>
                </div>
                <div className={`space-y-4`}>
                    {<div className={`space-y-4 ${hasSavedToken || tokenSupplied ? "opacity-50" : "opacity-100"}`}>
                        <p className="text-quiet font-mono">Enter access token:</p>
                        <div className="flex gap-6">
                            <input
                                className="font-mono bg-transparent rounded-md border border-highlight px-5 py-3 outline-none w-full placeholder:text-quiet"
                                value={token} onChange={event => setToken(event.target.value)}
                                placeholder="Enter access token here..."
                                disabled={hasSavedToken || tokenSupplied}
                            />
                            <button className="px-8 h-auto border border-highlight rounded-md transition-colors hover:bg-bg-light flex items-center gap-1.5"
                                onClick={submit}
                                disabled={hasSavedToken || tokenSupplied}
                            >
                                <span className="font-mono">Submit</span>
                                <SendIcon size={16} />
                            </button>
                        </div>
                        { tokenError && !tokenSupplied && <p className="text-sm text-error">{ tokenError }</p> }
                    </div>}
                    { tokenSupplied && 
                        <p>Local LLM has saved your access token and you may move on to the next step!</p>
                    }
                    { hasSavedToken &&
                        <p>Local LLM has detected a saved access token. You may move on to the next step.</p>
                    }
                </div>
            </div>
            <div className="flex justify-center">
                <NextButton disabled={!hasSavedToken && !tokenSupplied} setActiveIndex={setActiveIndex} />
            </div>
        </div>
    </Slide>
}