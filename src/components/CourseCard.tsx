export interface Course {
    color: string,
    opening: string,
    lines: string[][]
}

interface CourseCardProps {
    course: Course
}

function CourseCard({ course }: CourseCardProps) {

    return (
        <div className="course-card">
            <h1>{course.opening}</h1>
            <p>Nel corso sono presenti {course.lines.length} linee</p>
        </div>
    )
}

export default CourseCard;