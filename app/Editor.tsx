"use client"
import { ForwardedRef, forwardRef, MutableRefObject, useEffect, useRef } from "react";
import Quill, { Delta } from "quill/core";
import { Delta as DeltaType } from "quill/core";

type EditorParameters = {
    className: string
}

const Editor = forwardRef(function Editor({ className }: EditorParameters, ref: ForwardedRef<Quill>) {
    
    const containerRef = useRef(null as null | HTMLDivElement);
    
    useEffect(() => {
        const container = containerRef.current as HTMLDivElement;
        const editorContainer = container.appendChild(container.ownerDocument.createElement("div"));
        function plainTextMatcher(node: HTMLElement, _delta: DeltaType): DeltaType {
            const plainText = node.innerText;
            return new Delta().insert(plainText);
        }
        const quill = new Quill(editorContainer, {
            placeholder: "Enter a prompt for the model",
            formats: [],
            modules: {
                clipboard: {
                    matchers: [
                        [ Node.ELEMENT_NODE, plainTextMatcher ]
                    ]
                }
            }
        });
        (ref as MutableRefObject<Quill>).current = quill;
        return () => {
            (ref as MutableRefObject<Quill | null>).current = null;
            container.innerHTML = ``;
        };
    }, [ ref ]);
    return <div className={className} ref={containerRef}></div>
});

export default Editor;