type Parameters = {
    size: number;
    strokeWidth?: number;
    className?: string;
};

function ArrowRightIcon({ size, strokeWidth = 2, className }: Parameters) {
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
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
        </svg>
    );
}
export default ArrowRightIcon;
