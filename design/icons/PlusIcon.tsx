type Parameters = {
    size: number;
    strokeWidth?: number;
    className?: string;
};

function PlusIcon({ size, strokeWidth = 2, className }: Parameters) {
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
                d="M12 4.5v15m7.5-7.5h-15"
            />
        </svg>
    );
}
export default PlusIcon;
