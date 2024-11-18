import { ForwardedRef, forwardRef, MutableRefObject, useEffect, useRef } from "react";
import Quill, { Delta } from "quill/core";
import { Delta as DeltaType } from "quill/core";

type EditorParameters = {
    className: string,
    onSubmitRef: MutableRefObject<() => void>
}

const Editor = forwardRef(function Editor({ className, onSubmitRef }: EditorParameters, ref: ForwardedRef<Quill>) {
    const containerRef = useRef(null as null | HTMLDivElement);
    
    useEffect(() => {
        function onSubmit() {
            onSubmitRef.current();
        }

        const container = containerRef.current as HTMLDivElement;
        const editorContainer = container.appendChild(container.ownerDocument.createElement("div"));
        function plainTextMatcher(node: HTMLElement): DeltaType {
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
                },
                keyboard: {
                    bindings: {
                        custom: {
                            key: ["Enter"],
                            shiftKey: false,
                            handler: onSubmit
                        }
                    }
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