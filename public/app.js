const shortenForm = document.querySelector(".shorten-form");
const urlElement = document.querySelector("#url");
const errorElement = document.querySelector(".error");
const linkElement = document.querySelector(".link");

function showLink(link) {
    errorElement.setAttribute("style", "display: none;");
    linkElement.removeAttribute("style");
    linkElement.innerHTML = "Your shortened link has been generated:<br>";

    const a = document.createElement("a");
    a.href = link;
    a.target = "_blank";
    a.innerText = link;
    linkElement.appendChild(a);
}

function showError(error) {
    linkElement.setAttribute("style", "display: none;");
    errorElement.removeAttribute("style");
    errorElement.innerText = "Error: " + error;
}

shortenForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const url = urlElement.value;
    urlElement.value = "";

    if (!url) return;

    let result = {};
    try {
        const response = await fetch("/api/url", {
            method: "POST",
            credentials: "omit",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url
            })
        });

        result = await response.json();
    } catch (error) {
        console.error(error);
        showError("Failed to connect to the server!");
        return;
    }

    if (result.error) showError(result.error);
    else showLink(result.link);
});
