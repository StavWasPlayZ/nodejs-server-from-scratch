const form = document.querySelector("form");


// Add required to labels for every required input
form.querySelectorAll("input[required]").forEach((input) =>
    form.querySelector(`label[for=${input.id}]`).setAttribute("required", "")
);

form.querySelectorAll("[section]").forEach((section) => {
    // Add a line seperator just for the looks idk
    if (section.nextSibling != null)
        form.insertBefore(document.createElement("hr"), section.nextSibling);

    // Create a header for the section according to the provided value
    const sectionTitle = document.createElement("h2");
    sectionTitle.innerText = section.getAttribute("section");
    form.insertBefore(sectionTitle, section);

    // If the wrapper has the attribute "require", make all input children required
    if (section.hasAttribute("require"))
        section.querySelectorAll("*").forEach((input) => 
            input.setAttribute("required", "")
        )
})