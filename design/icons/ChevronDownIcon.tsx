type Parameters = {
    width: number,
    height: number,
    className?: string
}

function ChevronDownIcon({ width, height, className }: Parameters) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            strokeWidth={2}
            className={className}
        >
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    );
}
export default ChevronDownIcon;
