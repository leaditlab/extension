async function instructionPopup(url) {
  if (
    // window.location.href.includes("linkedin.com/in") ||
    window.location.href.includes("salesloft.com") ||
    window.location.href.includes("mail.google") ||
    window.location.href.includes("outreach.io") ||
    window.location.href.includes("meet.google")
  ) {
    let instructionCard = document.getElementById("pop-up-instruction");
    if (!instructionCard) {
      const result = await getInstruction(url);
      const analyseButton = document.createElement("div");
      analyseButton.id = "pop-up-instruction";
      analyseButton.innerHTML = `
    <div class="notification-sub-container ">
      <div
        id="instruction-closeLL"
        style="    top: 0px;
    right: 26px;
    position: absolute;
    cursor: pointer;"
      >
        <div
          style="
            width: 16px;
            height: 16px;
            left: 4px;
            top: 4px;
            position: absolute;
            display:flex;
           
          "
        >
          <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Dismiss">
              <path
                id="Shape"
                d="M4.2097 4.53554L4.29289 4.44133C4.65338 4.08085 5.22061 4.05312 5.6129 4.35814L5.70711 4.44133L12 10.7334L18.2929 4.44133C18.6834 4.05081 19.3166 4.05081 19.7071 4.44133C20.0976 4.83186 20.0976 5.46502 19.7071 5.85554L13.415 12.1484L19.7071 18.4413C20.0676 18.8018 20.0953 19.369 19.7903 19.7613L19.7071 19.8555C19.3466 20.216 18.7794 20.2438 18.3871 19.9387L18.2929 19.8555L12 13.5634L5.70711 19.8555C5.31658 20.2461 4.68342 20.2461 4.29289 19.8555C3.90237 19.465 3.90237 18.8319 4.29289 18.4413L10.585 12.1484L4.29289 5.85554C3.93241 5.49506 3.90468 4.92783 4.2097 4.53554L4.29289 4.44133L4.2097 4.53554Z"
                fill="#BCBAC7"
              />
            </g>
          </svg>
        </div>
      </div>
      <div>
        Hello 
        <div>${result.message}</div>
      </div>
    </div>`;
      if (
        window.location.href.includes("salesloft.com") ||
        window.location.href.includes("mail.google") ||
        window.location.href.includes("outreach.io") ||
        window.location.href.includes("meet.google")
      ) {
        document.body.appendChild(analyseButton);
        document
          .getElementById("instruction-closeLL")
          .addEventListener("click", () => {
            const popup = document.getElementById("pop-up-instruction");
            if (popup) popup.style.display = "none"; // remove the element instead of hiding it
          });
      }

      async function getInstruction(url) {
        let { userToken } = await chrome.storage.local.get(["userToken"]);
        const response = await fetch(
          "https://betabackext-beta.leadlabs.app/get-instruction",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userToken,
            },
            body: JSON.stringify({ url: url }),
          }
        );

        const result = await response.json(); // parse the JSON
        return result;
      }
    }
  }
}
