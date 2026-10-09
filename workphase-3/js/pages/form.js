
/*
----------------------------------------
PAGE: form.html
FILE: form.js
PURPOSE: page behaviour for the community content submission form
----------------------------------------
*/
import { API_HEADERS } from "../modules/apiHeaders.js";
import { postContent } from "../modules/api.js";
import { getContentFormData, validateContentData } from "../modules/forms.js";

/* =========================
   CONSTANTS
========================= */

const form = document.querySelector("#submission-form");
const message = document.querySelector("#form-message");
const submitButton = document.querySelector("#submit-button");
const contentTypeSelect = document.querySelector("#content_type");
const eventDateGroup = document.querySelector("#event-date-group");
const eventDateInput = document.querySelector("#event_date");

/* =========================
   VARIABLES
========================= */
/* =========================
   API 
========================= */

const url = "https://deco7140-api.uqcloud.net/api/weather/?locations=Brisbane,Tokyo";

fetch(url, {
    method: "GET",
    headers: API_HEADERS
})
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });

/* =========================
   FUNCTIONS
========================= */

function toggleEventDate() {
    const isEvent = contentTypeSelect.value === "event";

    eventDateGroup.classList.toggle("form-group--hidden", !isEvent);

    // When hidden, remove the field from tab order and mark as not required
    eventDateInput.disabled = !isEvent;
    eventDateGroup.setAttribute("aria-hidden", String(!isEvent));
}

async function handleSubmit(event) {
    event.preventDefault();

    const formData = getContentFormData(form);
    const error = validateContentData(formData);

    if (error) {
        message.textContent = error;
        message.className = "form-message form-message--error";
        return;
    }

    // Loading state
    message.textContent = "Submitting…";
    message.className = "form-message";
    submitButton.disabled = true;
    submitButton.textContent = "Submitting…";

    try {
        const result = await postContent(formData);

        // Success state
        message.textContent = `Your submission "${result.title}" has been received. Thank you for sharing with the community.`;
        message.className = "form-message form-message--success";
        form.reset();
        toggleEventDate(); // reset conditional field visibility after form reset

    } catch (err) {
        // Error state — provide specific feedback by status code
        let errorMessage = "Something went wrong. Please try again.";

        if (err.message.includes("400")) {
            errorMessage = "Some required fields are missing or invalid. Please check your submission.";
        } else if (err.message.includes("403")) {
            errorMessage = "Authentication error. Please contact the site administrator.";
        } else if (err.message.includes("429")) {
            errorMessage = "Too many requests. Please wait a moment and try again.";
        }

        message.textContent = errorMessage;
        message.className = "form-message form-message--error";
        console.error(err);

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
    }
}

/* =========================
   EVENT LISTENERS
========================= */

form.addEventListener("submit", handleSubmit);
contentTypeSelect.addEventListener("change", toggleEventDate);

/* =========================
   RUN ON PAGE LOAD
========================= */

// Set initial visibility of event date field based on default select value
toggleEventDate();