type Parameters = {
    size: number;
    strokeWidth?: number;
    className?: string;
};

function CodeIcon({ size, strokeWidth = 2, className }: Parameters) {
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
                d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
            />
        </svg>
    );
}
export default CodeIcon;
