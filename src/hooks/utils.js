import DOMPurify from "isomorphic-dompurify"
import { marked } from "marked"
marked.setOptions({
    gfm: true, // Enable GitHub-Flavored Markdown
    breaks: true, // Treat single carriage returns as <br>
})


export function sortByKey(array, key) {
    return array.sort((a, b) => {
        return a[key] - b[key];
    });
}

export function prettyDate(dateStr) {
        
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return `${day}th`;
        switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
        }
    }
    
    const [year, month, day] = dateStr.split("-").map(Number);
    const monthName = months[month - 1]; // Month is 0-indexed in the array
    const dayWithSuffix = getOrdinalSuffix(day);
    return `${dayWithSuffix} ${monthName} ${year}`;
}

export function markdownToHtml(markdown) {
    return DOMPurify.sanitize(marked(markdown));
}