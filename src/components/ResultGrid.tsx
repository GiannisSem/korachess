import type {Match} from "../types.ts";

interface ResultGridProps {
    list: Match[]
    n: number
}

function ResultGrid({list, n}: ResultGridProps) {

    return (
        <div className="results-grid">
            {list.map((item: Match, index: number) => (
                <div key={index} className={`result-box result-${item.result}`} onClick={async () => await navigator.clipboard.writeText(item.pgn)}>
                    {item.result} color: {item.playerColor}
                </div>
            ))}
            {list.length < 5 && (
                <>
                    {Array.from({ length: n-list.length }, (_, index) => (
                        <div key={index} className={`result-box result-none`}>
                            ...
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default ResultGrid