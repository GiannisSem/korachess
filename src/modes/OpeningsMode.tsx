import CourseCard, {type Course} from "../components/CourseCard.tsx";
import openings from "../assets/openings.json"
import {useEffect, useState} from "react";
import Button from "../components/Button.tsx";
import ColorPicker from "../components/ColorPicker.tsx";
import type {Color} from "chess.js";
import {ChessBoard} from "../components/ChessBoard";
import {getFirstFen} from "../services/chessUtils.ts";
import {getTheme} from "../services/utils.ts";

function OpeningsMode() {

    const [color, setColor] = useState<Color | undefined>(undefined);
    const [course, setCourse] = useState<Course | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);

    const [mode, setMode] = useState<"Study" | "Drill">("Study");

    useEffect(() => {
        const list = color
            ? openings.filter((op: Course) => op.color === color)
            : openings;
        setCourses(list);
    }, [color])

    return (
        <>
            {
                !course ? (
                    <div className="openings-grid">
                        <ColorPicker onClick={setColor} />
                        {courses.map((course: Course) => (
                            <CourseCard key={course.opening} course={course} onClick={() => setCourse(course)}/>
                        ))}
                    </div>
                ) : (
                    <div className="openings-course">
                        { /* Impara il corso */ }
                        { /* line[0] e [1] per nome e linea */ }
                        { /* Implementare Learn e Repeat */}
                        <ChessBoard
                            initialFen={getFirstFen((color === "w") ? "start" : lineMoves[0])}
                            theme={getTheme(localStorage.getItem("theme") ?? "classic")}
                            playerColor={color}
                            reversed={color === "b"}
                            onMove={handlePlayerMove}
                            engineMove={engineMove}
                        />

                        <Button content={mode === "Study" ? "Drill" : "Study"} onClick={() => setMode((mode === "Study") ? "Drill" : "Study")} />
                        <Button content="Back" onClick={() => setCourse(null)} />
                    </div>
                )
            }
        </>

    )
}

export default OpeningsMode;