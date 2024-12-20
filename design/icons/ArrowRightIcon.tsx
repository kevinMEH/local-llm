type Parameters = {
    width: number;
    height: number;
    className?: string;
};

/**
 * Box 14 x 24
 */
function ArrowRightIcon({ width, height, className }: Parameters) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 14 24"
            strokeWidth={2}
            className={className}
        >
            <line x1="0" y1="12" x2="14" y2="12"></line>
            <polyline points="7 5 14 12 7 19"></polyline>
        </svg>
    );
}
export default ArrowRightIcon;
