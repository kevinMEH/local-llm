type Parameters = {
    width: number;
    height: number;
    className?: string;
};

function CheckIcon({ width, height, className }: Parameters) {
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
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );
}
export default CheckIcon;
