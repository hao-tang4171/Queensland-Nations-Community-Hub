import { API_HEADERS } from "./apiHeaders.js";



export function getNewsletterFormData(form) {
  const formData = new FormData(form);

  return {
    name: formData.get("name"),
    email: formData.get("email"),
    frequency: formData.get("frequency")
  };
}

export function validateNewsletterData(data) {
  if (!data.name || !data.email || !data.frequency) {
    return "Please complete all fields.";
  }

  if (data.frequency !== "weekly" && data.frequency !== "monthly") {
    return "Please choose weekly or monthly.";
  }

  return null;
}

/* ----------------------------------------
   CONTENT SUBMISSION FUNCTIONS (form.html)
---------------------------------------- */
 
const VALID_CONTENT_TYPES = ["event", "photo", "blog", "story", "other"];
 
export function getContentFormData(form) {
  // Return the raw FormData so uploaded_image is included correctly
  return new FormData(form);
}
 
export function validateContentData(formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const contentType = formData.get("content_type");
 
  if (!title || title.trim() === "") {
    return "Please enter a title.";
  }
 
  if (title.length > 200) {
    return "Title must be 200 characters or fewer.";
  }
 
  if (!content || content.trim() === "") {
    return "Please enter your submission content.";
  }
 
  if (!contentType || !VALID_CONTENT_TYPES.includes(contentType)) {
    return "Please select a valid content type.";
  }
 
  const image = formData.get("uploaded_image");
  if (image && image.size > 10 * 1024 * 1024) {
    return "Image must be 10MB or smaller.";
  }
 
  return null;
}