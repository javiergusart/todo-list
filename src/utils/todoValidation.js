import DOMPurify from "dompurify";

export const MAX_TODO_TITLE_LENGTH = 80;

function normalizeWhitespace(title) {
  return title.replace(/\s+/g, " ").trim();
}

export function getTodoTitleValidationMessage(title) {
  const normalizedTitle = normalizeWhitespace(title);

  if (!normalizedTitle) {
    return "Enter a todo title.";
  }

  if (normalizedTitle.length > MAX_TODO_TITLE_LENGTH) {
    return `Todo titles must be ${MAX_TODO_TITLE_LENGTH} characters or fewer.`;
  }

  return "";
}

export function sanitizeTodoTitle(title) {
  return DOMPurify.sanitize(normalizeWhitespace(title), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

export function prepareTodoTitle(title) {
  const validationMessage = getTodoTitleValidationMessage(title);

  if (validationMessage) {
    return {
      sanitizedTitle: "",
      error: validationMessage,
    };
  }

  const sanitizedTitle = sanitizeTodoTitle(title);

  if (!sanitizedTitle) {
    return {
      sanitizedTitle: "",
      error: "Enter a todo title using readable text.",
    };
  }

  return {
    sanitizedTitle,
    error: "",
  };
}

export function isValidTodoTitle(title) {
  return prepareTodoTitle(title).error === "";
}
