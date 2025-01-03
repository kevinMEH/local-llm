type Parameters = {
    size: number;
    strokeWidth?: number;
    className?: string;
};

function ChevronDownIcon({ size, strokeWidth = 2, className }: Parameters) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            strokeWidth={strokeWidth}
            className={className}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
        </svg>
    );
}
export default ChevronDownIcon;
