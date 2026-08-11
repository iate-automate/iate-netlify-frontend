import axios from 'axios'

export async function fetchScheduledDays(id) {
    try {
        const response = await axios.post(import.meta.env.AIRTABLE_API + import.meta.env.AIRTABLE_BASE_TIMETABLE + "Scheduled%20days/listRecords", {
            fields: [
                "Date",
                "Day number",
                "Cohort ID",
                "AM submitted",
                "PM submitted",
                "Feed Course",
                "Feed Students",
                "Feed Unregistered AM",
                "Feed Unregistered PM"
            ],
            filterByFormula: `{Cohort ID} = "${id}"`
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + import.meta.env.AIRTABLE_API_KEY
            }
        });
        const days = response.data.records.map((record) => {
            return record.fields;
        });
        return days;
    } catch (error) {
        console.error('Error fetching scheduled days:', error);
        return [];
    }
}

export async function submitRegister(register) {

    const api = "https://api-62jcrbgdlq-uc.a.run.app/registers";
  
    try {
        const response = await axios.post(api, { registers: register }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return { msg: "Attendance register updated successfully!", data: response.data };
    } catch (error) {
        return { error: error.message };
    }
}

export async function submitContract(id) {

    const api = "https://api-62jcrbgdlq-uc.a.run.app/contract";

    try {
        const response = await axios.post(api, { id }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return { msg: "Contract submitted successfully!", data: response.data };
    } catch (error) {
        return { error: error.message };
    }
}

export async function fetchEnrolment(id) {

    try {
        const response = await axios.get(import.meta.env.AIRTABLE_API + import.meta.env.AIRTABLE_BASE_MAIN + "Enrolments/" + id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + import.meta.env.AIRTABLE_API_KEY
            }
        });
        return response.data.fields;
    } catch (error) {
        return null;
    }
}

export async function fetchWebinarSession(id) {

    try {
        const response = await axios.get(import.meta.env.AIRTABLE_API + import.meta.env.AIRTABLE_BASE_ONLINE + "Webinar%20Sessions/" + id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + import.meta.env.AIRTABLE_API_KEY
            }
        });
        return response.data.fields;
    } catch (error) {
        return error;
    }
}

export async function fetchWebinar(id) {

    try {
        const response = await axios.get(import.meta.env.AIRTABLE_API + import.meta.env.AIRTABLE_BASE_ONLINE + "Webinars/" + id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + import.meta.env.AIRTABLE_API_KEY
            }
        });
        return response.data.fields;
    } catch (error) {
        return error;
    }
}