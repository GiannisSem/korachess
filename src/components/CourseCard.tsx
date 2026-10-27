export interface Course {
    color: string,
    opening: string,
    lines: string[][]
}

interface CourseCardProps {
    course: Course,
    onClick: () => void,
}

function CourseCard({ course, onClick }: CourseCardProps) {

    return (
        <div className="course-card" onClick={onClick}>
            <p className="course-eyebrow">Opening repertoire</p>
            <h3>{course.opening}</h3>
            <p className="course-summary">
                {course.lines.length === 0
                    ? "No lines saved"
                    : `${course.lines.length} ${course.lines.length === 1 ? "line" : "lines"} available`}
            </p>
        </div>
    )
}

export default CourseCard;