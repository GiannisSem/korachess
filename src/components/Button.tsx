interface ButtonProps {
    content: string
    onClick: () => void;
}

function Button({content, onClick}: ButtonProps) {

    return (
        <button className="button" onClick={onClick}>{content}</button>
    )
}

export default Button;