/**
 * @typedef {Object} Validation
 * @property {string} fields The fields to query; will be passed to {@link Validation.getError}
 * @property {((fields: NodeListOf<HTMLInputElement>) => string?)} getError Returns an error message if present, null otherwise
 */
/**@type {Validation[]} */
const checks = [
    {
        fields: "input[type=password]",
        // Expected to only be 2 fields; first being password, second the repeat
        getError: function (fields) {
            if (fields.item(0).value != fields.item(1).value)
                return "Passwords do not match";

            // Some more checks I can't be bothered with

            return null;
        }
    }
]

/**@type {{fields: NodeListOf<HTMLInputElement>, errorMsg: HTMLElement[]}[]} */
let invalidFields = [];


function validate() {
    for (let i = 0; i < invalidFields.length; i++) {
        invalidFields[i].errorMsg.forEach((element) => element.remove());
        invalidFields[i].fields.forEach((element) => element.style.backgroundColor = "none");
    }
    invalidFields = [];
    
    let valid = true;

    for (let i = 0; i < checks.length; i++) {
        const check = checks[i];
        
        const fields = form.querySelectorAll(check.fields),
            errorMsg = check.getError(fields);
        if (errorMsg) {
            valid = false;

            // Create error message span
            const errorMsgSpan = document.createElement("span");
            errorMsgSpan.innerText = errorMsg;
            errorMsgSpan.classList.add("error");

            // Append it after the last field
            const lastField = fields.item(fields.length-1), parent = lastField.parentNode;
            if (lastField.nextSibling != null)
                parent.insertBefore(errorMsgSpan, lastField.nextSibling);
            else
                parent.appendChild(errorMsgSpan);
            // Append a break before the error
            const br = parent.insertBefore(document.createElement("br"), errorMsgSpan);

            // Make all fields glow red
            for (let i = 0; i < fields.length; i++)
                fields.item(i).style.backgroundColor = "red";
            // Focus on the first one
            fields.item(0).focus();

            invalidFields.push({
                errorMsg: [errorMsgSpan, br],
                fields: fields
            });
        }
    }

    return valid;
}