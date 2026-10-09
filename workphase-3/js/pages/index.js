import { postNewsletterSubscription } from "../modules/api.js";
import { getNewsletterFormData, validateNewsletterData } from "../modules/forms.js";
import { fetchNarrativePreviews, renderPreviews, renderPreviewError } from "../modules/home-preview.js";
/*
----------------------------------------
PAGE: index.html
FILE: index.js
PURPOSE: homepage behaviour — newsletter subscription (in a modal dialog)
         and the "Latest Stories" preview.
----------------------------------------
*/


/* =========================
   CONSTANTS
========================= */

const form = document.querySelector("#newsletter-form");
const message = document.querySelector("#form-message");
const submitButton = document.querySelector("#submit-button");


const dialog = document.querySelector("#subscribe-dialog");
const openButtons = document.querySelectorAll("#subscribe-open-header, #subscribe-open-hero");
const closeButton = document.querySelector("#subscribe-close");


const NARRATIVES_URL = "data/narratives.json";
const previewContainer = document.querySelector("#story-preview");

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

let lastFocusedTrigger = null;

function openDialog(event) {
  lastFocusedTrigger = event.currentTarget;
  message.textContent = "";          
  dialog.showModal();                
  const nameInput = form.querySelector("#name");
  if (nameInput) nameInput.focus();  
}

function closeDialog() {
  dialog.close();
}


function handleBackdropClick(event) {
  if (event.target === dialog) {
    dialog.close();
  }
}


function handleDialogClose() {
  if (lastFocusedTrigger) lastFocusedTrigger.focus();
}

/* =========================
   FUNCTIONS 
========================= */

async function initStoryPreview() {
  if (!previewContainer) return;

  previewContainer.innerHTML = `<p class="preview-status" role="status">Loading stories…</p>`;

  try {
    const narratives = await fetchNarrativePreviews(NARRATIVES_URL);
    if (narratives.length === 0) {
      
      const section = document.querySelector("#story-preview-section");
      if (section) section.hidden = true;
      return;
    }
    renderPreviews(previewContainer, narratives, 3);
  } catch (error) {
    renderPreviewError(previewContainer);
  }
}

/* =========================
   EVENT LISTENERS
========================= */

if (form) {
  form.addEventListener("submit", handleNewsletterSubmit);
}

openButtons.forEach((btn) => btn.addEventListener("click", openDialog));
if (closeButton) closeButton.addEventListener("click", closeDialog);
if (dialog) {
  dialog.addEventListener("click", handleBackdropClick);
  dialog.addEventListener("close", handleDialogClose);
}

/* =========================
   RUN ON PAGE LOAD
========================= */

initStoryPreview();