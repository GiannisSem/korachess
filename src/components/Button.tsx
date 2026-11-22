interface ButtonProps {
    content: string
    onClick: () => void;
    disabled?: boolean;
    ariaLabel?: string;
}

function Button({content, onClick, disabled, ariaLabel}: ButtonProps) {

    return (
        <button className="button" onClick={onClick} disabled={disabled} aria-label={ariaLabel}>{content}</button>
    )
}

export default Button;