import { postNewsletterSubscription } from "../modules/api.js";
import { getNewsletterFormData, validateNewsletterData } from "../modules/forms.js";
/*
----------------------------------------
PAGE: events.html
FILE: events.js
PURPOSE: "Join Us" opens the subscription dialog and handles the same
         newsletter submission used on the homepage.
----------------------------------------
*/

/* =========================
   CONSTANTS
========================= */

const form = document.querySelector("#newsletter-form");
const message = document.querySelector("#form-message");
const submitButton = document.querySelector("#submit-button");

const dialog = document.querySelector("#subscribe-dialog");
const openButton = document.querySelector("#join-open");
const closeButton = document.querySelector("#subscribe-close");

let lastFocusedTrigger = null;

/* =========================
   FUNCTIONS 
========================= */

async function handleNewsletterSubmit(event) {
  event.preventDefault();

  const data = getNewsletterFormData(form);
  const error = validateNewsletterData(data);

  if (error) {
    message.textContent = error;
    return;
  }

  message.textContent = "Submitting...";
  submitButton.disabled = true;

  try {
    const result = await postNewsletterSubscription(data);
    message.textContent = `Thanks ${result.name}. Your ${result.frequency} subscription has been created.`;
    form.reset();
  } catch (error) {
    message.textContent = "Something went wrong. Please check your details and try again.";
    console.error(error);
  } finally {
    submitButton.disabled = false;
  }
}

/* =========================
   FUNCTIONS 
========================= */

function openDialog(event) {
  lastFocusedTrigger = event.currentTarget;
  message.textContent = "";
  dialog.showModal();
  const nameInput = form.querySelector("#name");
  if (nameInput) nameInput.focus();
}

function handleBackdropClick(event) {
  if (event.target === dialog) dialog.close();
}

function handleDialogClose() {
  if (lastFocusedTrigger) lastFocusedTrigger.focus();
}

/* =========================
   EVENT LISTENERS
========================= */

if (form) form.addEventListener("submit", handleNewsletterSubmit);
if (openButton) openButton.addEventListener("click", openDialog);
if (closeButton) closeButton.addEventListener("click", () => dialog.close());
if (dialog) {
  dialog.addEventListener("click", handleBackdropClick);
  dialog.addEventListener("close", handleDialogClose);
}