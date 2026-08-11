import { useState } from 'react'
import { submitContract } from '../../hooks/api'

export default function ContractSubmitButton({id, alreadySigned}) {

    const [loading, setLoading] = useState(false)
    const [feedback, setFeedback] = useState(alreadySigned ? "Contract submitted successfully!" : null)
    const [error, setError] = useState(null)

    return (
        <div>
            {loading && <p className="feedback">Sending Confirmation...</p>}
            {error && <div className="block"> 
                <p className="feedback feedback__error">{error}</p>
                <p>There was an error submitting your agreement. Please refresh the page and try again. If the problem persists please <a href="https://artspsychotherapy.org/contact-us">contact us</a> for assistance.</p>
            </div>}
            {feedback && <div className="block">
                <p className="feedback feedback__success">{feedback}</p>
                <p>A signed copy of this agreement will be emailed to you shortly. If you have any questions or concerns don't hesitate to <a href="https://artspsychotherapy.org/contact-us">get in touch</a>.</p>
            </div>}
            {!loading && !feedback && !error &&
                <div className="btn" onClick={handleSubmit}>I agree to these terms</div>
            }
        </div>
    )

    async function handleSubmit() {          
            
        setLoading(true)
        console.log("Confirming contract for Record ID: " + id)
        const res = await submitContract(id)

        if (res.error) {
            console.log("There was an error submitting the contract:", res.error)
            setError("Oops! Something went wrong.")
        } else {
            setFeedback(res.msg)
        }
        setLoading(false)
    }
}
