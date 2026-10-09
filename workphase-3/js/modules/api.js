import { API_HEADERS } from "./apiHeaders.js";





export async function postNewsletterSubscription(subscriptionData) {
    const response = await fetch("https://deco7140-api.uqcloud.net/api/newsletter/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Student-Number": "s4945076",
            "X-API-Token": "Banana-Wallaby-21",
            // Add the required authentication header for the course API here.
        },
        body: JSON.stringify(subscriptionData)
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
}

export async function postContent(formData) {
    const response = await fetch("https://deco7140-api.uqcloud.net/api/posts/", {
        method: "POST",
        headers: {
            // Do NOT set Content-Type here — the browser sets it automatically
            // to multipart/form-data with the correct boundary when using FormData
            "X-Student-Number": "s4945076",
            "X-API-Token": "Banana-Wallaby-21",
        },
        body: formData
    });
 
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
 
    return await response.json();
}