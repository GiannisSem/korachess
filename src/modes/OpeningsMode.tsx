import CourseCard, {type Course} from "../components/CourseCard.tsx";
import openings from "../assets/openings.json"
import {useEffect, useState} from "react";
import Button from "../components/Button.tsx";
import ColorPicker from "../components/ColorPicker.tsx";
import type {Color, Move} from "chess.js";
import {type ArrowData, ChessBoard, type MovePayload} from "../components/ChessBoard";
import {getCurrentMove, getFirstFen} from "../services/chessUtils.ts";
import {getTheme} from "../services/utils.ts";

function OpeningsMode() {

    const [color, setColor] = useState<Color | undefined>(undefined);
    const [course, setCourse] = useState<Course | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);

    const [mode, setMode] = useState<"Study" | "Drill">("Study");

    const [lineIndex, setLineIndex] = useState<number>(0);

    const [counter, setCounter] = useState(0);
    const [engineMove, setEngineMove] = useState<MovePayload>();
    const [lineFinished, setLineFinished] = useState(false);
    const lineMoves = course?.lines[lineIndex]?.[1].split(" ") ?? [];
    const nextMove = lineMoves[counter + 1];
    const engineArrows: ArrowData[] = nextMove ? [getCurrentMove(nextMove)] : [];

    useEffect(() => {
        const list = color
            ? openings.filter((op: Course) => op.color === color)
            : openings;
        setCourses(list);
    }, [color])

    const handleChangeLine = (shift: number) => {
        const nextLineIndex = lineIndex + shift;
        if (course && nextLineIndex >= 0 && nextLineIndex < course.lines.length) {
            setLineIndex(nextLineIndex);
            setCounter(color === "w" ? -1 : 0);
            setEngineMove(undefined);
            setLineFinished(false);
        }
    }

    const handlePlayerMove = (_fen: string, move?: Move): boolean => {
        const expectedMove = lineMoves[counter + 1];
        if (!expectedMove || !move) return false;

        const targetMove = getCurrentMove(expectedMove);
        if (move.from !== targetMove.from || move.to !== targetMove.to) {
            return false;
        }

        const engineMoveString = lineMoves[counter + 2];
        setEngineMove(engineMoveString ? getCurrentMove(engineMoveString) : undefined);
        setCounter(counter + 2);
        setLineFinished(counter + 2 >= lineMoves.length - 1);
        return true;
    };

    return (
        <>
            {
                !course ? (
                    <>
                        <ColorPicker onClick={setColor} />
                        <div className="openings-grid">
                            {courses.map((course: Course) => (
                                <CourseCard
                                    key={course.opening}
                                    course={course}
                                    onClick={() => {
                                        setCourse(course);
                                        setColor(course.color as Color);
                                        setLineIndex(0);
                                        setCounter((color ?? course.color) === "w" ? -1 : 0);
                                        setEngineMove(undefined);
                                        setLineFinished(false);
                                    }}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="openings-course">
                        <h1>{course.opening + "➡" + course.lines[lineIndex][0] }</h1>

                        <div className="board-stage">
                            <ChessBoard
                                key={`${course.opening}-${lineIndex}-${lineMoves.join(" ")}`}
                                initialFen={getFirstFen((color === "w") ? "start" : lineMoves[0])}
                                theme={getTheme(localStorage.getItem("theme") ?? "classic")}
                                playerColor={color}
                                reversed={color === "b"}
                                onMove={handlePlayerMove}
                                engineMove={engineMove}
                                engineArrows={mode === "Drill" || lineFinished ? undefined : engineArrows}
                                viewOnly={lineFinished}
                            />
                        </div>

                        <div className="opening-controls">
                            <Button content="Back" onClick={() => {
                                setCourse(null);
                                setColor(undefined);
                                setLineIndex(0);
                                setCounter(color === "w" ? -1 : 0);
                                setEngineMove(undefined);
                                setLineFinished(false);
                            }} />
                            <div className="line-navigation" aria-label="Line navigation">
                                <Button
                                    content="⬅"
                                    ariaLabel="Previous line"
                                    disabled={lineIndex === 0}
                                    onClick={() => handleChangeLine(-1)}
                                />
                                <span className="line-indicator">
                                    Line {lineIndex + 1} of {course.lines.length}
                                </span>
                                <Button
                                    content="➡"
                                    ariaLabel="Next line"
                                    disabled={lineIndex >= course.lines.length - 1}
                                    onClick={() => handleChangeLine(1)}
                                />
                            </div>
                            <Button content={mode === "Study" ? "🧠 Drill" : "📖 Study"} onClick={() => setMode((mode === "Study") ? "Drill" : "Study")} />
                        </div>
                    </div>
                )
            }
        </>

    )
}

export default OpeningsMode;