type Parameters = {
    width: number,
    height: number,
    className?: string
}

function PlusIcon({ width, height, className }: Parameters) {
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
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}
export default PlusIcon;
