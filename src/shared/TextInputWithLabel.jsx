import { forwardRef } from "react";
import styles from "../styles/ui.module.css";

const TextInputWithLabel = forwardRef(function TextInputWithLabel(
  {
    elementId,
    labelText,
    onChange,
    value,
    maxLength,
    placeholder = "",
    required = false,
    type = "text",
    helperText = "",
  },
  ref,
) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor={elementId}>
        {labelText}
      </label>
      <input
        className={styles.input}
        type={type}
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        required={required}
      />
      {helperText ? <p className={styles.helperText}>{helperText}</p> : null}
    </div>
  );
});

export default TextInputWithLabel;
