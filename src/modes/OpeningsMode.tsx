import CourseCard, {type Course} from "../components/CourseCard.tsx";
import courses from "../assets/openings.json"
import {useState} from "react";
import Button from "../components/Button.tsx";

function OpeningsMode() {

    const [course, setCourse] = useState<Course | null>(null);

    return (
        <>
            {
                !course ? (
                    <div className="openings-grid">
                        {courses.map((course: Course) => (
                            <CourseCard key={course.opening} course={course} onClick={() => setCourse(course)}/>
                        ))}
                    </div>
                ) : (
                    <div className="openings-course">
                        { /* Impara il corso */ }
                        { /* line[0] e [1] per nome e linea */ }
                        { /* Implementare Learn e Repeat */}

                        <Button content="Back" onClick={() => setCourse(null)} />
                    </div>
                )
            }
        </>

    )
}

export default OpeningsMode;