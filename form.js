const form = document.querySelector("#contact-form");

const errorOutput = document.querySelector("#error-output");
const infoOutput = document.querySelector("#info-output");
const textarea = document.querySelector("#comments");
const formErrorsField = document.querySelector("#form-errors");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");

const formErrors = []; // array of {field, value, errorType, message, time}

function showError(message) {
  errorOutput.textContent = message;
  errorOutput.classList.add("visible");
}

function clearError() {
  errorOutput.textContent = "";
  errorOutput.classList.remove("visible");
}

function showInfo(message) {
  infoOutput.textContent = message;
  infoOutput.classList.add("visible");
}

function clearInfo() {
  infoOutput.textContent = "";
  infoOutput.classList.remove("visible");
}

function validityToType(v) {
  if (v.valueMissing) return "valueMissing";
  if (v.typeMismatch) return "typeMismatch";
  if (v.patternMismatch) return "patternMismatch";
  if (v.tooShort) return "tooShort";
  if (v.tooLong) return "tooLong";
  return "other";
}


const disallowedNameChars = /[^A-Za-z\s'-]/;

function setupIllegalCharGuard(input, disallowedRe, fieldLabel) {
  input.addEventListener("beforeinput", (event) => {
    if (!event.data || event.inputType.startsWith("delete")) return;

    if (disallowedRe.test(event.data)) {
      event.preventDefault();
      input.classList.add("flash");
      showError(`"${event.data}" is not allowed in ${fieldLabel}.`);

      setTimeout(() => {
        input.classList.remove("flash");
        clearError();
      }, 1500);
    }
  });
}

setupIllegalCharGuard(nameInput, disallowedNameChars, "Name");

if (textarea && textarea.maxLength > 0) {
  const max = textarea.maxLength;
  const commentsInfo = document.querySelector("#comments-info") || infoOutput;

  function updateCount() {
    const remaining = max - textarea.value.length;
    commentsInfo.textContent = `${remaining} characters remaining`;
  }

  textarea.addEventListener("input", updateCount);
  updateCount();
}

form.addEventListener("submit", (event) => {
  clearError();
  clearInfo();

  let hasErrors = false;
  const thisAttemptErrors = [];

  for (const field of form.elements) {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) continue;
    if (!field.name) continue;
    if (field.type === "hidden") continue;

    field.setCustomValidity("")

    // CUSTOM UPPERCASE CHECK
    if (field.name === "name" && field.validity.patternMismatch) {
      field.setCustomValidity(
        "the field must be at least three characters long and start with an uppercase letter"
      );
    } 

    const v = field.validity;

    if (!field.checkValidity()) {
      hasErrors = true;

       // fallback custom messages
      if (!field.validationMessage) {
        if (v.valueMissing) {
          field.setCustomValidity(`${field.name} is required.`);
        } else if (v.tooShort) {
          field.setCustomValidity(`${field.name} is too short.`);
        }
      }
      thisAttemptErrors.push({
        field: field.name,
        value: field.value,
        errorType: validityToType(v),
        message: field.validationMessage,
        time: new Date().toISOString(),
      });

      field.reportValidity();
      showError("Please fix the highlighted fields before submitting.");
      event.preventDefault();
      break;
    }
  }

  if (hasErrors) {

    formErrors.push(...thisAttemptErrors);
    formErrorsField.value = JSON.stringify(formErrors);
  } else {
    showInfo("Thanks! Your message is being submitted.");
    formErrorsField.value = JSON.stringify(formErrors);
  }
});
