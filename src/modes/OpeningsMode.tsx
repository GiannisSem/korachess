import CourseCard, {type Course} from "../components/CourseCard.tsx";
import courses from "../assets/openings.json"

function OpeningsMode() {

    return (
        <div className="openings-grid">
            {courses.map((course: Course) => (
                <CourseCard key={course.opening} course={course} onClick={() => console.log("wow")}/>
            ))}
        </div>
    )
}

export default OpeningsMode;