import {useState, useRef} from 'react'

export default function Form({webinar, source}) {

    const title = webinar["Title"]
    const id = webinar["Record ID"]
    const formRef = useRef(null);
    const marketingRef = useRef(null);

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <div>
            
            {error && <p className="feedback__error block">{error}</p>}
            {success && <p className="feedback__success block">{success}</p>}
            {loading && <p className="feedback__success block">Registering...</p>}

            {!loading && !success && !error &&
                <form onSubmit={handleSubmit} ref={formRef}>
                    <div className="form__input">
                        <label htmlFor="fname">First Name</label>
                        <input type="text" id="fname" name="fname" required />
                    </div>
                    <div className="form__input">
                        <label htmlFor="lname">Last Name</label>
                        <input type="text" id="lname" name="lname" required />
                    </div>
                    <div className="form__input">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form__submit">
                        <button className="btn" type="submit">Register</button>
                    </div>
                    
                    <input type="hidden" name="webinar" value={id} />

                    <div className="marketing-opt-in">
                        <input type="checkbox" ref={marketingRef} id="marketing" name="marketing" defaultChecked={true}/>
                        <label htmlFor="marketing">I would like to receive marketing emails</label>
                    </div>
                </form>
            }

        </div>
    )

    // Functions

    async function handleSubmit(event) {

        event.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        const formData = new FormData(formRef.current)
        const data = Object.fromEntries(formData.entries())
        data["marketing"] = marketingRef.current.checked
        data["source"] = source
        console.log('Form submitted:', data)

        try {
            const response = await fetch('https://api-62jcrbgdlq-uc.a.run.app/webinar-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            console.log('Registration result:', result);
            if (result.error) {
                setLoading(false);
                setError(result.error);
                setSuccess(null);
            } else {
                setLoading(false);
                setSuccess(result.success);
                setError(null);

                // 
            }
        } catch (error) {
            console.error('Error registering:', error);
            setLoading(false);
            setError('Hmmm. Something went wrong. Please refresh your browser window and try again. If the problem persists, please contact us.');
        }
    }
}