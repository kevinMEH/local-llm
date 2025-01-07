import { useEffect, useRef, useState } from "react";

export default function ScrollHint({ scrollToTop = 0, className, children }: { scrollToTop?: number, className: string, children: React.ReactNode }) {
    const [ topShadow, setTopShadow ] = useState(false);
    const [ bottomShadow, setBottomShadow ] = useState(false);
    const [ previousScrollToTop, setPreviousScrollToTop ] = useState(scrollToTop);
    
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(scrollToTop !== previousScrollToTop) {
            const element = elementRef.current;
            if(element) {
                element.scrollTop = 0;
            }
            setPreviousScrollToTop(scrollToTop);
        }
    }, [previousScrollToTop, scrollToTop]);
    
    function toppedOut() {
        const element = elementRef.current;
        if(element) {
            return element.scrollTop < 1;
        }
        return true;
    }
    
    function bottomedOut() {
        const element = elementRef.current;
        if(element) {
            return Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) <= 1;
        }
        return false;
    }
    
    function overflowing() {
        const element = elementRef.current;
        if(element) {
            return element.scrollHeight > element.clientHeight;
        }
        return false;
    }
    
    function scrollHandler() {
        if(overflowing()) {
            setBottomShadow(!bottomedOut());
            setTopShadow(!toppedOut());
        } else {
            setBottomShadow(false);
            setTopShadow(false);
        }
    }
    
    useEffect(() => {
        if(overflowing()) {
            setBottomShadow(!bottomedOut());
            setTopShadow(!toppedOut());
        } else {
            setBottomShadow(false);
            setTopShadow(false);
        }
    }, [children])
    
    const shadowClass = bottomShadow
    ? (
        topShadow
        ? "[mask-image:linear-gradient(transparent,#000_48px,#000_calc(100%_-_48px),transparent)]" // Both
        : "[mask-image:linear-gradient(180deg,#000_calc(100%_-_48px),transparent)]" // Bottom only
    ) : (
        topShadow
        ? "[mask-image:linear-gradient(0deg,#000_calc(100%_-_48px),transparent)]" // Top only
        : ""
    );

    return <div ref={elementRef} className={`${shadowClass} ${className}`} onScroll={scrollHandler}>
        { children }
    </div>
}
