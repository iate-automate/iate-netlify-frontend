import {useState, useEffect, useRef} from 'react';
import { submitRegister } from '../../hooks/api';
import { prettyDate } from '../../hooks/utils';

export default function Checklist({days, dayNo}) {
    
    const [day, setDay] = useState(dayNo);
    const [session, setSession] = useState("AM");
    const [absent, setAbsent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const sessionRef = useRef();

    const courseID = days[0]["Cohort ID"];
    const courseName = days[0]["Feed Course"];
    const courseDays = days.map((day) => {
        return {
            date: day["Date"] || '',
            day: day["Day number"] || '',
            students: day["Feed Students"] ? day["Feed Students"].split(", ") : [],
            AM: day["Feed Unregistered AM"] ? day["Feed Unregistered AM"].split(", ") : [],
            PM: day["Feed Unregistered PM"] ? day["Feed Unregistered PM"].split(", ") : []
        }
    })

    // Check whether session has already been submitted
    const courseDayDate = (courseDays[day - 1].date) ? prettyDate(courseDays[day - 1].date) : "No date available";
    const sessionAlreadySubmitted = (session === 'AM' && days[day - 1]["AM submitted"]) || (session === 'PM' && days[day - 1]["PM submitted"]);

    // Registered students for the selected day and session
    const sessionStudents = courseDays[day - 1].students.filter((student) => !courseDays[day - 1][session].includes(student))
    const sortedStudents = sessionStudents.sort((a, b) => a.localeCompare(b))

    // Reset when day or session changes
    useEffect(() => {
        if (absent.length > 0) {
            setAbsent([]);
        }
    }, [day, session]);

    // Print Selected Absences
    // console.log(absent)

  
    return (

        <div className="register-form">

            <h2 className="course-day">Day {dayNo}<br />
            {courseDayDate}</h2>
            <div className="selections">
                <div className="select-session">
                    <label htmlFor="session">Select Session</label>
                    <select name="session" id="session" ref={sessionRef} onChange={handleSessionToggle}>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            </div>

            {sessionAlreadySubmitted
            ?
            <div className="already-submitted">
                <h2>Attendance for this session has already been submitted.</h2>
                <p>If you need to make changes please contact an administrator.</p>
            </div>
            :
            <>
            <div className="select-students">
                <div className="student-checkboxes-header">
                    <h3>Unauthorised Absences</h3>
                    <p>Please mark any <span style={{textDecoration:"underline"}}>absent</span> students on the list below.</p>
                </div>

                    <div className="student-checkboxes">
                        {sortedStudents.map((student, index) => (
                            <div className={`student-checkbox ${absent.includes(student) ? 'absent' : ''}`}
                                key={index}
                                data-student={student}
                                data-checked={absent.includes(student)}
                                onClick={(e) => {
                                    if (!absent.includes(e.currentTarget.dataset.student)) {
                                        setAbsent([...absent, e.currentTarget.dataset.student])
                                    } else {
                                        setAbsent(absent.filter((student) => student !== e.currentTarget.dataset.student))
                                    }
                                }}>
                                <div className="checkbox-icon">
                                    {absent.includes(student) ? (
                                        <i className="fa-sharp fa-regular fa-circle-xmark"></i>
                                    ) : (
                                        <i className="fa-sharp fa-regular fa-circle"></i>
                                    )}
                                </div>
                                <div className="checkbox-label">{student}</div>
                            </div>
                        ))}
                    </div>
            </div>

            <div className="register-submission">
                {loading && <p>Submitting Register...</p>}
                {feedback && <p>{feedback}</p>}
                {!loading && !feedback && <a className="btn btn-large" onClick={handleSubmit}>Confirm Absences</a>}
            </div>
            </>
            }

        </div>
    )

    async function handleSubmit() {
        
        setLoading(true)

        const register = {
            id: courseID,
            course: courseName,
            day: day,
            session: session,
            absent: absent
        }

        const res = await submitRegister(register)
        console.log(register)
        console.log(res)
        setFeedback(res.msg || res.error)
        setLoading(false)
        setAbsent([])

    }

    function handleSessionToggle() {
        setFeedback(null)
        setSession(sessionRef.current.value)
    }
}