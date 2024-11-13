type Parameters = {
    width: number;
    height: number;
    className?: string;
};

function SendIcon({ width, height, className }: Parameters) {
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
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
    );
}
export default SendIcon;
