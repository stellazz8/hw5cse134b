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

// disallowed character regexes (one per field if you like)
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

    commentsInfo.classList.toggle("warning", remaining <= 30 && remaining >= 0);
    commentsInfo.classList.toggle("error", remaining < 0);
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

    field.setCustomValidity("");

    if (!field.checkValidity()) {
      hasErrors = true;

      const v = field.validity;
      const errorType = validityToType(v);

      // Optional: custom messages
      if (v.tooShort) {
        field.setCustomValidity(`${field.name} is too short.`);
      } else if (v.valueMissing) {
        field.setCustomValidity(`${field.name} is required.`);
      }

      thisAttemptErrors.push({
        field: field.name,
        value: field.value,
        errorType,
        message: field.validationMessage,
        time: new Date().toISOString(),
      });
    }
  }

  if (hasErrors) {
    event.preventDefault();

    showError("Please fix the highlighted fields before submitting.");
    formErrors.push(...thisAttemptErrors);
    formErrorsField.value = JSON.stringify(formErrors);
  } else {
    // Valid submission – still send record of previous errors
    showInfo("Thanks! Your message is being submitted.");
    formErrorsField.value = JSON.stringify(formErrors);
  }
});

