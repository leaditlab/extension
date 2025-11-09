/* -------- Persona ------------ */
function loadPersonaScript() {
  showPersonaListing();
  getFrameWork(0, "signal", "profileCardLL");
  document
    .getElementById("backToPersonaListingPersona")
    .addEventListener("click", (event) => {
      document.getElementById(
        "parsonaListingDetails"
      ).children[0].style.display = "none";
      document.getElementById(
        "parsonaListingDetails"
      ).children[1].style.display = "block";

      //Clear the  data in the field
      document.getElementById("persona-id-ll").value = "";
      document.getElementById("persona-name-ll").value = "";
      document.getElementById("company-name-ll").value = "";
      document.getElementById("pain-points-ll").value = "";
      document.getElementById("industry-name-ll").value = "";
      document.getElementById("value-proposition-ll").value = "";
      document.getElementById("results-ll").value = "";
      document.getElementById("mandatory-message-ll").value = "";
      document.getElementById("custom-tonality-ll").value = "";
      document.getElementById("create-btn-ll").textContent = "Create Persona";
    });

  /* --- code for listing ---*/

  function generatePersonaList(personaList) {
    const container = document.getElementById("parsonaListingDetails")
      .children[1];
    container.innerHTML = `
      <h5>
        <span id="back-to-main-card-persona" style="cursor: pointer; font-size: 20px; color: #202124;">
        ←
        </span>
        All Personas
      </h5>
      <div id="createPersonaPage">Create Persona →</div>
    `;

    document
      .getElementById("createPersonaPage")
      .addEventListener("click", (event) => {
        // moving the below code to popup place

        document.getElementById("popup-overlay-persona-ll").style.display =
          "flex";
      });
    document
      .getElementById("back-to-main-card-persona")
      .addEventListener("click", (event) => {
        const parentElement = document.getElementById("parsonaListingDetails");
        const childElements = Array.from(parentElement.children);

        childElements.slice(0, -1).forEach(function (child) {
          child.style.display = "none";
        });

        // Ensure the last child remains visible
        const lastChild = childElements[childElements.length - 1];
        if (lastChild) {
          lastChild.style.display = "flex";
        }
        parentElement.style.display = "block";
      });

    if (personaList.length === 0) {
      const emptyArray = document.createElement("div");
      emptyArray.style.display = "flex";
      emptyArray.style.justifyContent = "center";
      emptyArray.style.alignItems = "center";
      emptyArray.style.height = "65vh";

      emptyArray.innerHTML =
        '<div class="empty-list-ll">' +
        '<svg class="empty-icon-ll" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M3 7h18v13H3z" fill="none"></path>' +
        '<path d="M5 4h4l3 3h9v13H5z"></path>' +
        "</svg>" +
        "<h4>No Personas Found</h4>" +
        "<p>Create a new persona to get started.</p>" +
        "</div>";
      container.appendChild(emptyArray);
    }
    personaList.forEach((persona) => {
      const personaItem = document.createElement("div");
      personaItem.className = "persona-item-ll";
      personaItem.id = persona.id;

      const personaHeader = document.createElement("div");
      personaHeader.className = "persona-header-ll";
      personaHeader.onclick = togglePersonaDetails;

      const personaInfo = document.createElement("div");
      const personaName = document.createElement("h3");
      personaName.textContent = persona.persona_name;
      const companyName = document.createElement("p");
      companyName.textContent = persona.company_name;

      personaInfo.appendChild(personaName);
      personaInfo.appendChild(companyName);

      const optionsContainer = document.createElement("div");
      optionsContainer.className = "options-container-ll";

      const type = document.createElement("div");
      type.textContent = persona?.isatl_btl_type; // You can change the content as needed
      if (persona?.isatl_btl_type === "ATL") {
        type.classList.add("atl-cls");
      } else if (persona?.isatl_btl_type === "BTL") {
        type.classList.add("btl-cls");
      }
      const expandIcon = document.createElement("span");
      expandIcon.className = "expand-icon-ll";
      expandIcon.textContent = "▼";

      const moreOptions = document.createElement("span");
      moreOptions.className = "more-options-ll";
      moreOptions.textContent = "⋮";

      const dropdownMenu = document.createElement("div");
      dropdownMenu.className = "dropdown-menu-ll";

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.onclick = (event) => editPersona(event, persona.id, persona);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = (event) =>
        deletePersona(event, persona.id, personaItem);

      // hiding for now
      dropdownMenu.appendChild(editButton);
      dropdownMenu.appendChild(deleteButton);

      optionsContainer.appendChild(type);
      optionsContainer.appendChild(expandIcon);
      optionsContainer.appendChild(moreOptions);
      optionsContainer.appendChild(dropdownMenu);

      personaHeader.appendChild(personaInfo);
      personaHeader.appendChild(optionsContainer);

      const personaDetails = document.createElement("div");
      personaDetails.innerHTML =
        "<div><div style='font-weight: 600;'>Industry</div><div>" +
        persona.industry +
        "</div><div style='font-weight: 600;'>Pain Points</div><div>" +
        persona.customer_pain_points +
        "</div><div style='font-weight: 600;'>Value Proposition</div><div>" +
        persona.value_proposition +
        "</div><div style='font-weight: 600;'>Results</div><div>" +
        persona.results +
        "</div><div style='font-weight: 600;'>Created Date</div><div>" +
        persona.created_date.split("T")[0] +
        "</div></div>";
      personaDetails.className = "persona-details-ll";
      personaDetails.style.display = "none";

      personaItem.appendChild(personaHeader);
      personaItem.appendChild(personaDetails);

      container.appendChild(personaItem);
    });

    document.addEventListener("click", (event) => {
      if (!event.target.matches(".more-options-ll")) {
        document.querySelectorAll(".dropdown-menu-ll").forEach((menu) => {
          menu.style.display = "none";
        });
      }
    });
    const persoanaList = document.getElementById("parsonaListingDetails");
    persoanaList.querySelectorAll(".more-options-ll").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const dropdownMenu = btn.nextElementSibling;
        dropdownMenu.style.display =
          dropdownMenu.style.display === "block" ? "none" : "block";
      });
    });
  }

  function togglePersonaDetails(event) {
    const personaHeader = event.currentTarget;
    const personaDetails = personaHeader.nextElementSibling;
    const expandIcon = personaHeader.querySelector(".expand-icon-ll");

    if (
      personaDetails.style.display === "none" ||
      personaDetails.style.display === ""
    ) {
      personaDetails.style.display = "block";
      expandIcon.textContent = "▲";
    } else {
      personaDetails.style.display = "none";
      expandIcon.textContent = "▼";
    }
  }

  // JavaScript for Persona Creation Page
  document
    .getElementById("persona-form-ll")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const personaData = {
        id: document.getElementById("persona-id-ll").value,
        persona_name: document.getElementById("persona-name-ll").value,
        company_name: document.getElementById("company-name-ll").value,
        customer_pain_points: document.getElementById("pain-points-ll").value,
        industry: document.getElementById("industry-name-ll").value,
        value_proposition: document.getElementById("value-proposition-ll")
          .value,
        results: document.getElementById("results-ll").value,
        mandatory_message: document.getElementById("mandatory-message-ll")
          .value,
        custom_tonality: document.getElementById("custom-tonality-ll").value,
      };

      //console.log('Persona data:', personaData);

      // Simulate API call
      savePersona(personaData);
    });

  async function savePersona(data) {
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/persona-store",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          data,
        }),
      }
    );

    const responseData = await response.json();

    if (responseData) {
      // console.log("trying to close;")
      //  console.log(responseData.data)
      //document.getElementById("overlayScreen").innerText=responseData.data;

      //window.close();
      showNotification(
        "Persona Created Successfully!",
        "success",
        "profileCardLL"
      );
      //clear the data in fields
      document.getElementById("persona-id-ll").value = "";
      document.getElementById("persona-name-ll").value = "";
      document.getElementById("company-name-ll").value = "";
      document.getElementById("pain-points-ll").value = "";
      document.getElementById("industry-name-ll").value = "";
      document.getElementById("value-proposition-ll").value = "";
      document.getElementById("results-ll").value = "";
      document.getElementById("mandatory-message-ll").value = "";
      document.getElementById("custom-tonality-ll").value = "";
      document.getElementById("create-btn-ll").textContent = "Create Persona";
      //get back to listing page:
      document.getElementById(
        "parsonaListingDetails"
      ).children[0].style.display = "none";
      document.getElementById(
        "parsonaListingDetails"
      ).children[1].style.display = "block";
      showPersonaListing();
    }
  }

  async function showPersonaListing() {
    //loader
    fetch(chrome.runtime.getURL("pages/loader.html"))
      .then((r) => r.text())
      .then((html) => {
        document.getElementById("parsonaListingDetails").children[1].innerHTML =
          html;
      });

    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/persona-get-all",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      }
    );

    const responseData = await response.json();

    if (responseData) {
      generatePersonaList(responseData.body);
      const openCustomQuestion = document.getElementById("open-persona");
      const pTag = openCustomQuestion.querySelector("p");
      pTag.textContent = `${responseData.body.length} personas created`;
    }

    /*---- persona creation popup start----------*/
    /* !!!!! IMP !!!!! */
    // this showPersonaListing or LoadPersonScript is getting loaded multiple times,
    // this creates the muliple click events below, resulting in multiple backend calls.
    // to avoid this for now, cloning the object and removing the old one each time

    const popupOverlayPersona = document.getElementById(
      "popup-overlay-persona-ll"
    );
    const popupCloseBtnPersona = document.getElementById(
      "popup-close-btn-persona-ll"
    );

    const manualCreationPersona = document.getElementById(
      "manual-persona-creation"
    );
    const autoCreationPersona = document.getElementById(
      "auto-persona-creation"
    );

    removeClickEvents("auto-persona-generate");
    /*   removeClickEvents("popup-overlay-persona-ll");
  removeClickEvents("popup-close-btn-persona-ll");
  removeClickEvents("manual-persona-creation");
  removeClickEvents("auto-persona-generate"); */

    popupCloseBtnPersona.addEventListener("click", () => {
      document.getElementById("popup-persona-step-first").style.display =
        "block";
      document.getElementById("popup-persona-step-second").style.display =
        "none";
      popupOverlayPersona.style.display = "none";
      //also close reset
    });

    manualCreationPersona.addEventListener("click", (event) => {
      document.getElementById(
        "parsonaListingDetails"
      ).children[0].style.display = "block";
      document.getElementById(
        "parsonaListingDetails"
      ).children[1].style.display = "none";

      // New not edit
      document.getElementById("persona-id-ll").value = "";

      // close popup
      popupOverlayPersona.style.display = "none";
    });

    autoCreationPersona.addEventListener("click", (event) => {
      document.getElementById("popup-persona-step-first").style.display =
        "none";
      document.getElementById("popup-persona-step-second").style.display =
        "block";
    });

    document
      .getElementById("auto-persona-generate")
      .addEventListener("click", async function () {
        const companyUrl = document.getElementById("company-url-ll").value;
        const label = document.querySelector("label[for='company-url-ll']");
        const isATL = document.getElementById("ATL").value;
        const isBTL = document.getElementById("BTL").value;

        // Reset label in case of previous error
        label.innerText = "Website URL for Persona Creation";

        if (!isValidUrl(companyUrl)) {
          label.innerText = "Enter a valid website";
          return;
        }
        // Count total commas in both ATL and BTL values
        const totalCommas = countCommas(isATL) + countCommas(isBTL);

        // Validate total comma count
        if (totalCommas > 3) {
          showNotification(
            "Please add only 3 ATL and BTL combined",
            "warning",
            "profileCardLL"
          );
          return false;
        }

        // Store the original content of the div before displaying the loading message
        const originalContent = document.getElementById(
          "popup-persona-step-second"
        ).innerHTML;
        document.getElementById("popup-persona-step-second").style.display =
          "none";

        // Create the loading message and append it
        const loadingDiv = document.createElement("div");
        loadingDiv.innerHTML = `
          <div id="loaderTextLL">Generating Persona... Please wait</div>
        `;
        loadingDiv.style.textAlign = "center";
        loadingDiv.style.color = "#5B5B5B";
        document
          .getElementById("popup-persona-step-second")
          .appendChild(loadingDiv);

        // Fetch the content from loader.html and update the innerHTML once fetched
        fetch(chrome.runtime.getURL("pages/loader.html"))
          .then((response) => response.text())
          .then((html) => {
            // First, clear the existing content including the loading message
            document.getElementById("popup-persona-step-second").innerHTML = "";

            // Set the fetched HTML to the innerHTML of popup-persona-step-second
            document.getElementById("popup-persona-step-second").innerHTML =
              html;

            // Display the element again
            document.getElementById("popup-persona-step-second").style.display =
              "block";

            // Call your custom function to update the loader text
            updatePersona(4);
          })
          .catch((error) => {
            console.error("Error fetching loader.html:", error);
          });

        // Prepare the data to send to the backend API
        const data = {
          website: companyUrl,
          isATL: isATL,
          isBTL: isBTL,
        };

        // Call the backend API
        let { userToken } = await chrome.storage.local.get(["userToken"]);
        try {
          const response = await fetch(
            "https://betabackext-beta.leadlabs.app/persona-auto-store",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userToken,
              },
              body: JSON.stringify(data),
            }
          );

          const responseData = await response.json();
          // If response is successful, close the popup and remove the loading icon
          if (responseData.header === "success") {
            document.getElementById("popup-persona-step-second").innerHTML =
              originalContent;
            document.getElementById("popup-persona-step-first").style.display =
              "block";
            document.getElementById("popup-persona-step-second").style.display =
              "none";
            popupOverlayPersona.style.display = "none";
            showNotification(
              "Persona Generated Successfully!",
              "success",
              "profileCardLL"
            );
            document.getElementById(
              "parsonaListingDetails"
            ).children[0].style.display = "none";
            document.getElementById(
              "parsonaListingDetails"
            ).children[1].style.display = "block";
            showPersonaListing();
            popupOverlayPersona.style.display = "none";
            // Clear the values after the response
            document.getElementById("company-url-ll").value = "";
            document.getElementById("ATL").value = "";
            document.getElementById("BTL").value = "";
          } else {
            showNotification(responseData?.body, "warning", "profileCardLL");
            document.getElementById("popup-persona-step-second").innerHTML =
              originalContent;
            document.getElementById("popup-persona-step-first").style.display =
              "block";
            document.getElementById("popup-persona-step-second").style.display =
              "none";
            popupOverlayPersona.style.display = "none";
          }
        } catch (error) {
          showNotification(
            "Error contacting the server.",
            "warning",
            "profileCardLL"
          );
        } finally {
          // Remove the loading icon
          loadingDiv.remove();
          document.getElementById(
            "parsonaListingDetails"
          ).children[0].style.display = "none";
          document.getElementById(
            "parsonaListingDetails"
          ).children[1].style.display = "block";
          showPersonaListing();
          popupOverlayPersona.style.display = "none";
        }
      });

    //this because we are showing the notification if there is more then 3 ATl or BTL are entered in the textArea
    function handleTextareaInput(event) {
      const atlValue = document.getElementById("ATL").value;
      const btlValue = document.getElementById("BTL").value;

      // Count total commas in both textareas
      const totalCommaCount =
        (atlValue.match(/,/g) || []).length +
        (btlValue.match(/,/g) || []).length;

      if (totalCommaCount > 3) {
        showNotification(
          "Please add only 3 ATL and BTL combined",
          "warning",
          "profileCardLL"
        );
      }
    }

    // Event listeners for ATL and BTL textareas
    const atlTextarea = document.getElementById("ATL");
    const btlTextarea = document.getElementById("BTL");

    atlTextarea.addEventListener("input", handleTextareaInput);
    btlTextarea.addEventListener("input", handleTextareaInput);
    /*---- persona creation popup end----------*/
  }
}
/*-------------- persona end -------------- */
/* ------------- email creation start --------------*/
async function loadEmailCreationScript(linkedIn) {
  const personaSelect = document.getElementById("persona-listing-name-ll");
  const channelButtons = document.querySelectorAll(".channel-btn-ll");
  const useCaseButtons = document.querySelectorAll(".use-case-btn-ll");
  const premiseButtons = document.querySelectorAll(".premise-btn-ll");
  const frameworkSelect = document.getElementById("framework-ll");
  const generateBtn = document.querySelector(".generate-btn-ll");
  const variantValue = document.getElementById("variant-value-ll");
  const increaseVariant = document.getElementById("increase-variant-ll");
  const decreaseVariant = document.getElementById("decrease-variant-ll");

  const popupOverlay = document.getElementById("popup-overlay-ll");
  const popupCloseBtn = document.getElementById("popup-close-btn-ll");
  const popupContent = document.querySelector(".popup-content-ll");

  const popupOverlayInsight = document.getElementById("popup-overlay-insight");
  const popupCloseInsight = document.getElementById("popup-close-btn-insight");
  const popupContentInsight = document.querySelector(".popup-content-insight");

  function toggleActive(buttonGroup, button) {
    buttonGroup.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  }

  function toggleIndividualBtn(button) {
    const wasActive = button.classList.contains("active");
    button.classList.toggle("active");
    if (
      wasActive &&
      document.querySelectorAll(".premise-btn-ll.active").length <= 1
    ) {
      // if getting deactivated and length is 1 or less ( not combined) - get back to default premises using logselections
      logSelections(null, "premise");
    }
    return wasActive;
  }

  async function logSelections(selectedPostTitle = null, section) {
    const checkMarkContent =
      document.querySelector(".checkmark-ll").textContent;
    let premise =
      document.querySelector(".premise-btn-ll.active") &&
      document
        .querySelector(".premise-btn-ll.active")
        .textContent.replace(checkMarkContent, "")
        .trim();
    if (!premise) {
      premise = "Personal attributes";
    }

    // console.log(selections);
    // Simulate backend API call

    // changing frameWorks based on Channel and UseCase and Premise (for account based)

    if (section == "channel" || section == "usecase" || section == "premise") {
      // now if we are having multiple premises, then theres no option for user to select, but one default will be present.
      if (document.querySelectorAll(".premise-btn-ll.active").length > 1) {
        // the length could be greater than for cold call as well!!!??
        if (
          document
            .querySelector(".channel-btn-ll.active")
            .textContent.replace(checkMarkContent, "")
            .trim() === "Cold Call"
        ) {
          try {
            // Fetch the framework data
            await getFrameWork(0, "coldcall", "profileCardLL");
          } catch (error) {
            console.error("Error fetching framework data:", error);
          }
          document.getElementById("variant-ll").style.display = "flex";
          document.getElementById("variant-message-ll").style.display = "none";
        } else {
          //console.log("I am called");
          document.getElementById("variant-ll").style.display = "none";
          document.getElementById("variant-message-ll").style.display = "block";
        }
      }
      // keeping below code as is, and having a wrapper as else for single premise flow
      else {
        document.getElementById("variant-ll").style.display = "flex";
        document.getElementById("variant-message-ll").style.display = "none";
        if (
          document
            .querySelector(".channel-btn-ll.active")
            .textContent.replace(checkMarkContent, "")
            .trim() === "Email"
        ) {
          if (
            document
              .querySelector(".use-case-btn-ll.active")
              .textContent.replace(checkMarkContent, "")
              .trim() === "Introduction"
          ) {
            try {
              // Fetch the framework data
              await getFrameWork(0, "signal", "profileCardLL");
            } catch (error) {
              console.error("Error fetching framework data:", error);
            }
          } else {
            try {
              // Fetch the framework data
              await getFrameWork(0, "signal", "profileCardLL");
            } catch (error) {
              console.error("Error fetching framework data:", error);
            }
          }
        } else if (
          document
            .querySelector(".channel-btn-ll.active")
            .textContent.replace(checkMarkContent, "")
            .trim() === "Cold Call"
        ) {
          try {
            // Fetch the framework data
            await getFrameWork(0, "coldcall", "profileCardLL");
          } catch (error) {
            console.error("Error fetching framework data:", error);
          }
        } else {
          try {
            // Fetch the framework data
            await getFrameWork(0, "signal", "profileCardLL");
          } catch (error) {
            console.error("Error fetching framework data:", error);
          }
        }

        if (
          premise === "Edit Signals" &&
          document
            .querySelector(".channel-btn-ll.active")
            .textContent.replace(checkMarkContent, "")
            .trim() != "Cold Call"
        ) {
          // Below code is for account based premise, which depends on Channel, UseCase, Premise (hiring/funding)
          // if the user has not selected the post, we dont know if its hiring or funding, be defualt we will consider one

          //Case 1: if FollowUp, irrespective of hiring or funding only one
          if (
            document
              .querySelector(".use-case-btn-ll.active")
              .textContent.replace(checkMarkContent, "")
              .trim() === "Follow up"
          ) {
            try {
              // Fetch the framework data
              await getFrameWork(0, "signal", "profileCardLL");
            } catch (error) {
              console.error("Error fetching framework data:", error);
            }
          }
          //Case 2: if its LinkedIn, as of now, only one
          else if (
            document
              .querySelector(".channel-btn-ll.active")
              .textContent.replace(checkMarkContent, "")
              .trim() === "LinkedIn"
          ) {
            try {
              // Fetch the framework data
              await getFrameWork(0, "signal", "profileCardLL");
            } catch (error) {
              console.error("Error fetching framework data:", error);
            }
          }
          //Case 3: assuming its Intro, and funding
          // funding signal we will get only after user selecting it. if not default.
          else {
            try {
              // Fetch the framework data
              await getFrameWork(0, "signal", "profileCardLL");
            } catch (error) {
              console.error("Error fetching framework data:", error);
            }
          }
        }
      }
    }
  }

  document
    .getElementById("generate-btn-ll")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const checkMarkContent =
        document.querySelector(".checkmark-ll").textContent;
      const divSelectors = ["#selected-signal"];
      //here we are taking the count to know wheather one signal is seleceted or more signal selected
      const count = divSelectors
        .map((selector) => document.querySelector(selector))
        .filter((div) => div && div.textContent.trim() !== "").length;

      // writting completely new if and else, as company funding will have different premise
      if (count > 1) {
        document.getElementById("generate-btn-ll").disabled = true;

        const selfwritten = document.getElementById(
          "summaryOfselfWrittenContent"
        );
        const selfwritten_summary = [...selfwritten.children]
          .map((child, index) => {
            const signal = `Signal ${index + 1}`; // Generate signal for each child element

            // Get the content of the div, excluding the "x" in the span tag
            const content = [...child.childNodes]
              .filter((node) => node.nodeType === Node.TEXT_NODE)
              .map((node) => node.textContent.trim())
              .join(" ")
              .replace(/\s*×\s*$/, "");

            return `${signal}: ${content}`;
          })
          .join("\n");
        const selectedinsight =
          document.getElementById("selected-insight").innerText;

        //get all signal from the function,add extra data for like,dislike,interest
        const selectedsignal = getAllSelectedSignal("profileCardLL");

        let premise = "combined";
        const channel = document
          .querySelector(".channel-btn-ll.active")
          .textContent.replace(checkMarkContent, "")
          .trim();
        const selections = {
          channel: channel,
          use_case: document
            .querySelector(".use-case-btn-ll.active")
            .textContent.replace(checkMarkContent, "")
            .trim(),
          premise: premise,
          framework: document
            .getElementById("framework-ll")
            .getAttribute("data-value"),
          // framework: document.getElementById("framework-ll").value,
          additional_context: document.getElementById("additional-context-ll")
            .value,
          linkdinUrl: linkedIn,
          Persona: document.getElementById("persona-listing-name-ll").value,
          variant: variantValue.textContent,
          selfwritten_summary: selfwritten_summary,
          selectedinsight: selectedinsight,
          selectedsignal: selectedsignal,
        };
        //console.log(selections);
        createCustomeMessage(selections, premise, channel, "profileCardLL");
        // When One Premise is selected, do the respective thing
      } else if (count == 1) {
        document.getElementById("generate-btn-ll").disabled = true;

        const selfwritten = document.getElementById(
          "summaryOfselfWrittenContent"
        );

        const selfwritten_summary = [...selfwritten.children]
          .map((child, index) => {
            const signal = `Signal ${index + 1}`; // Generate signal for each child element

            // Get the content of the div, excluding the "x" in the span tag
            const content = [...child.childNodes]
              .filter((node) => node.nodeType === Node.TEXT_NODE)
              .map((node) => node.textContent.trim())
              .join(" ")
              .replace(/\s*×\s*$/, "");

            return `${signal}: ${content}`;
          })
          .join("\n");

        // Select the drag-area div
        const dragAreaDiv = document.querySelector(".drag-area");

        const selectedsignal = getAllSelectedSignal("profileCardLL");

        const selectedinsight = document.getElementById(
          "temp-selected-insight"
        ).innerText;

        const divSelectors = [
          {
            id: "#summaryOfselfWrittenContent",
            premise: "Self Written Content",
          },
        ];

        // Initialize `premise` based on active button or default
        premise =
          document
            .querySelector(".premise-btn-ll.active")
            ?.textContent.replace(checkMarkContent, "")
            .trim() || "Edit Signals";

        // Check for "Chose Signals" and update premise based on div content
        if (premise === "Edit Signals") {
          const matchedDiv = divSelectors.find(({ id }) => {
            const div = document.querySelector(id);
            return div && div.textContent.trim() !== "";
          });

          if (matchedDiv) {
            premise = matchedDiv.premise;
          }

          // else {
          //   // Fallback to the default premise if no match is found
          //   premise =
          //     document
          //       .getElementById("tempPostForCompanyPremiseDetail")
          //       ?.innerText.trim() || "defaultPremise";
          // }
        }

        const channel = document
          .querySelector(".channel-btn-ll.active")
          .textContent.replace(checkMarkContent, "")
          .trim();

        const selections = {
          channel: channel,
          use_case: document
            .querySelector(".use-case-btn-ll.active")
            .textContent.replace(checkMarkContent, "")
            .trim(),
          premise: premise,
          framework: document
            .getElementById("framework-ll")
            .getAttribute("data-value"),
          // framework: document.getElementById("framework-ll").value,
          additional_context: document.getElementById("additional-context-ll")
            .value,
          linkdinUrl: linkedIn,
          Persona: document.getElementById("persona-listing-name-ll").value,
          variant: variantValue.textContent,
          selfwritten_summary: selfwritten_summary,
          selectedinsight: selectedinsight,
          selectedsignal: selectedsignal,
        };
        //console.log(selections);
        createCustomeMessage(selections, premise, channel, "profileCardLL");
      } else {
        // show notification
        showNotification(
          "Please select a persona!",
          "warning",
          "profileCardLL"
        );
      }
    });

  document
    .getElementById("clear-signal")
    .addEventListener("click", function (event) {
      event.preventDefault();
      // clear shadow summary text holders as well
      document.getElementById("selected-signal").innerText = "";

      //for insight
      document.getElementById("temp-selected-insight").innerText = "";
      document.getElementById("selected-insight").innerText = "";
      const selectElement = document.getElementById("insight-list");
      selectElement.innerHTML = "";
      const selectedCount = document.getElementById("selectedCount");
      selectedCount.innerText = `0 signal selected `;

      const signalButtonCount = document.querySelectorAll(".signal-count");

      if (signalButtonCount.length > 0) {
        signalButtonCount.forEach((el) => {
          if (el.parentElement) {
            el.parentElement.style.display = "none";
          }
        });
      }
      manageSignalSummaryDisplay("profileCardLL", ".signalsll");
      manageSignalSummaryDisplay("profileCardLL", ".insight-ll");

      const popupOverlay = document.getElementById("popup-overlay-ll");

      if (popupOverlay) {
        const posts = popupOverlay.querySelectorAll(".postll");
        posts.forEach((post) => {
          post.style.backgroundColor = "";
          const checkMark = post.querySelector(".check-mark");
          if (checkMark) {
            post.removeChild(checkMark);
          }
        });
      }
    });

  //Insight functionality start here

  //to open the Insight pop Up
  document
    .getElementById("generate-angles")
    .addEventListener("click", function (event) {
      event.preventDefault();
      popupOverlayInsight.style.display = "flex";
      getInsight();
    });

  document
    .getElementById("selected-insight-container")
    .addEventListener("click", function (event) {
      event.preventDefault();
      popupOverlayInsight.style.display = "flex";
    });

  popupCloseInsight.addEventListener("click", function () {
    popupOverlayInsight.style.display = "none";
  });
  document
    .getElementById("submit-insight")
    .addEventListener("click", function (event) {
      event.preventDefault();
      popupOverlayInsight.style.display = "none";
    });

  async function getInsight() {
    //loader
    fetch(chrome.runtime.getURL("pages/loader.html"))
      .then((r) => r.text())
      .then((html) => {
        document.getElementById("insight-list").innerHTML = html;
      });

    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const selectedsignal = getAllSelectedSignal("profileCardLL");
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/generate-insight",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkdinUrl: linkedIn,
          Persona: document.getElementById("persona-listing-name-ll").value,
          // signalprioritylist: signalprioritylist.join(", "),
          signalprioritylist: selectedsignal,
        }),
      }
    );

    const responseData = await response.json();

    if (responseData) {
      const selectElement = document.getElementById("insight-list");
      selectElement.innerHTML = "";
      selectElement.innerHTML = responseData?.body;

      // Select all elements with the class `descriptionll`
      const descriptionElements =
        selectElement.querySelectorAll(".descriptionll");

      // Add a new div below each `descriptionll`
      descriptionElements.forEach((element) => {
        const newDiv = document.createElement("div");
        newDiv.className = "descriptionll-tag"; // Add a class to the new div
        newDiv.innerText = "Description"; // Set the content of the new div
        element.insertAdjacentElement("afterend", newDiv); // Insert the new div after the current element
      });

      // Select all elements with the class `valuell`
      const valuElements = selectElement.querySelectorAll(".valuell");

      // Add a new div below each `valuell`
      valuElements.forEach((element) => {
        const newDiv = document.createElement("div");
        newDiv.className = "valuell-tag"; // Add a class to the new div
        newDiv.innerText = "Value"; // Set the content of the new div
        element.insertAdjacentElement("afterend", newDiv); // Insert the new div after the current element
      });
    }
  }

  personaSelect.addEventListener("change", () =>
    logSelections(null, "persona")
  );

  channelButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleActive(channelButtons, button);
      logSelections(null, "channel");
    });
  });

  useCaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleActive(useCaseButtons, button);
      logSelections(null, "usecase");
    });
  });

  const checkMarkContent = document.querySelector(".checkmark-ll").textContent;
  premiseButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      // mark, which btn clicked on pop up so that, it will be helpful during post selection
      document.getElementById("popupTypell").innerText = button.innerText
        .replace(checkMarkContent, "")
        .trim();

      // Not changing anything below, as it was working for individual premise//
      logSelections(null, "premise");
      document
        .getElementById("popup-close-btn-ll")
        .addEventListener("click", () => {
          document.getElementById("popup-overlay-ll").style.display = "none";

          // if user has not selected anything in that pop-up, close the popup and deactivate that button
          deactivateButtonWithName(
            document.getElementById("popupTypell").innerText.trim()
          );
        });

      if (
        button.innerText.replace(checkMarkContent, "").trim() === "Edit Signals"
      ) {
        button.disabled = true;
        await generateButtons("profileCardLL");
        // Function to append content to accordion sections
        let responseData = await getAllSignalSettings();
        // Select the accordion bodies for each section
        const selfWrittenContentBody =
          document.querySelector("#bodySelfWritten");
        const engagedContentBody = document.querySelector(
          "#bodyEngagedContent"
        );
        const personalAttributesBody = document.querySelector(
          "#bodyPersonalAttribute"
        );
        const accountPremiseBody = document.querySelector(
          "#bodyAccountPremise"
        );
        const accountInsights = document.querySelector("#bodyaccountInsights");
        const workFlow = document.querySelector("#bodyWorkFlow");
        const AccountNewsMedia = document.querySelector(
          "#bodyAccountNewsMedia"
        );

        selfWrittenContentBody.innerHTML = "";
        engagedContentBody.innerHTML = "";
        personalAttributesBody.innerHTML = "";
        accountPremiseBody.innerHTML = "";
        accountInsights.innerHTML = "";
        workFlow.innerHTML = "";
        AccountNewsMedia.innerHTML = "";

        const appendContentToBody = (
          sourceId,
          targetBody,
          headerText,
          additionalClass
        ) => {
          const sourceElement = document.getElementById(sourceId);
          if (sourceElement && targetBody) {
            // Create and append the <p> tag for the header text
            const headerParagraph = document.createElement("p");
            headerParagraph.textContent = headerText;
            headerParagraph.className = "content-heading"; // Add a class for styling
            targetBody.appendChild(headerParagraph);

            // Clone and append children
            Array.from(sourceElement.children).forEach((child) => {
              const clonedChild = child.cloneNode(true); // Clone the child
              if (clonedChild.nodeName === "DIV") {
                // Check if it's a `div`
                clonedChild.classList.add("postll"); // Add the default class
                if (additionalClass) {
                  // Add the additional class if provided
                  clonedChild.classList.add(additionalClass);
                }
              }
              targetBody.appendChild(clonedChild); // Append the modified clone
            });
          }
        };

        const appendDataToPremise = (selector, targetBody, headerText) => {
          if (headerText === "Custom Workflow") {
            document.querySelector("#bodyWorkFlow").innerHTML = "";
          }
          const elements = document.querySelectorAll(selector);

          if (targetBody && elements.length > 0) {
            // Create and append the <p> tag for the header text
            const headerParagraph = document.createElement("p");
            headerParagraph.textContent = headerText;
            headerParagraph.className = "content-heading";
            targetBody.appendChild(headerParagraph);

            // Clone and append elements
            elements.forEach((element) => {
              const clonedElement = element.cloneNode(true);
              clonedElement.classList.add("postll");
              targetBody.appendChild(clonedElement);
            });
          }
        };

        const appendAttributes = (sourceId, label, displayText) => {
          const attributesDiv = document.getElementById(sourceId);
          if (attributesDiv && personalAttributesBody) {
            // Create and append the <p> tag for the label
            const labelParagraph = document.createElement("p");
            labelParagraph.textContent = displayText;
            labelParagraph.className = "content-heading";
            personalAttributesBody.appendChild(labelParagraph);

            const attributesArray = attributesDiv.innerText
              .split(",")
              .map((item) => item.trim());

            // Loop through attributes and append them as divs
            attributesArray.forEach((attribute) => {
              const newDiv = document.createElement("div");
              newDiv.className = "postll personal-attribute";
              newDiv.innerHTML = `
                  <div class="pop-${label}">
                    ${label.charAt(0).toUpperCase() + label.slice(1)}
                  </div> 
                  ${attribute}`;
              personalAttributesBody.appendChild(newDiv);
            });
          }
        };
        //function at clone the data for the Account Overview
        const appendDataToAccountOver = (selector, targetBody) => {
          const elements = document.querySelectorAll(selector);
          if (targetBody && elements.length > 0) {
            elements.forEach((element) => {
              // Check if the parent element has the class 'overviewll'
              if (
                element.parentElement &&
                element.parentElement.classList.contains("overviewll")
              ) {
                const clonedElement = element.cloneNode(true);
                clonedElement.classList.add("postll");
                clonedElement.classList.add("company-overview");
                targetBody.appendChild(clonedElement);
              }
            });
          }
        };

        const appendDataToTach = (subcategorySelector, targetBody) => {
          const subcategories = document.querySelectorAll(subcategorySelector);

          if (targetBody && subcategories.length > 0) {
            subcategories.forEach((subcategory) => {
              const category = subcategory.previousElementSibling;

              if (
                category &&
                category.classList.contains("category-techstackll") &&
                (category.innerText.trim() === "Analytics and Tracking" ||
                  category.innerText.trim() === "Widgets")
              ) {
                // Add the <p> tag for the category header
                const headerParagraph = document.createElement("p");
                headerParagraph.textContent = category.innerText.trim(); // Use the category name
                headerParagraph.className = "content-heading "; // Add a class for styling
                targetBody.appendChild(headerParagraph);

                // Clone and append child elements
                const childElements = subcategory.children; // Get child elements
                Array.from(childElements).forEach((child) => {
                  const clonedChild = child.cloneNode(true);
                  clonedChild.classList.add("postll");
                  clonedChild.classList.add("category-sub-techstackll");
                  targetBody.appendChild(clonedChild);
                });
              }
            });
          }
        };
        const processFundingData = (sourceSelector, targetBody) => {
          const sourceElement = document.querySelector(sourceSelector); // Select the source element
          if (sourceElement && targetBody) {
            // Add the "Funds" header
            const fundsHeader = document.createElement("p");
            fundsHeader.textContent = "Funds";
            fundsHeader.className = "content-heading"; // Add a class for styling
            targetBody.appendChild(fundsHeader);

            // Select the first <li> inside the source element
            const firstListItem = sourceElement.querySelector("ul > li");
            if (firstListItem) {
              // Create a new <div> for the first <li>
              const fundingDiv = document.createElement("div");
              fundingDiv.classList.add("postll", "funding-points"); // Add classes

              // Add the content of the first <li> to the <div>
              fundingDiv.textContent = firstListItem.textContent;

              // Append the new <div> to the target body
              targetBody.appendChild(fundingDiv);
            }
          }
        };
        const appendCompanyPostToBody = (
          sourceId,
          targetBody,
          headerText,
          additionalClass
        ) => {
          const sourceElement = document.getElementById(sourceId);
          if (sourceElement && targetBody) {
            // Create and append the <p> tag for the header text
            const headerParagraph = document.createElement("p");
            headerParagraph.textContent = headerText;
            headerParagraph.className = "content-heading";
            targetBody.appendChild(headerParagraph);

            // Clone and append only <div> elements with class "postll"
            Array.from(sourceElement.getElementsByClassName("postll")).forEach(
              (child) => {
                const clonedChild = child.cloneNode(true); // Clone the matching "postll" div
                clonedChild.classList.add("postll"); // Ensure the class remains
                if (additionalClass) {
                  clonedChild.classList.add(additionalClass);
                }
                targetBody.appendChild(clonedChild);
              }
            );
          }
        };

        responseData.forEach((category) => {
          category.list.forEach((item) => {
            if (item.displayStatus) {
              switch (item.type) {
                // Personal Overview

                case "Likes":
                  appendContentToBody(
                    "profileLikes",
                    personalAttributesBody,
                    "Like"
                  );
                  break;
                case "Dislikes":
                  appendContentToBody(
                    "profileDislikes",
                    personalAttributesBody,
                    "Dislike"
                  );
                  break;
                case "Interests":
                  appendContentToBody(
                    "profileInterestedTopics",
                    personalAttributesBody,
                    "Interest"
                  );
                  break;
                case "Ice Breakers":
                  appendContentToBody(
                    "profileIceBrakers",
                    personalAttributesBody,
                    "Ice Breaker",
                    "personal-attribute"
                  );
                  break;
                case "Probable Problems":
                  appendContentToBody(
                    "profileProblems",
                    personalAttributesBody,
                    "Probable Problems",
                    "personal-attribute"
                  );
                  break;

                // Engaged Content
                case "Engaged Contents":
                  appendContentToBody(
                    "commentsPosts",
                    engagedContentBody,
                    "Comments"
                  );
                  break;
                case "Reaction":
                  appendContentToBody(
                    "reactionsPosts",
                    engagedContentBody,
                    "Reaction"
                  );
                  break;
                case "Self Authored Contents":
                  appendContentToBody("allPosts", selfWrittenContentBody, "");
                  break;
                // Account Overview
                case "Overview":
                  appendDataToAccountOver(
                    ".summary",
                    accountPremiseBody,
                    "Company Summary"
                  );
                  break;
                case "Websites":
                  appendDataToAccountOver(
                    ".wedsitell",
                    accountPremiseBody,
                    "Website"
                  );
                  break;
                case "Company Size":
                  appendDataToAccountOver(
                    ".companysizell",
                    accountPremiseBody,
                    "Company Size"
                  );
                  break;
                case "Founded":
                  appendDataToAccountOver(
                    ".foundll",
                    accountPremiseBody,
                    "Founded Date"
                  );
                  break;
                case "Company Posts":
                  appendCompanyPostToBody(
                    "companyPostsLL",
                    accountPremiseBody,
                    "Company Post",
                    "company-post"
                  );
                  break;

                // Account Insights
                case "Funds":
                  processFundingData(
                    ".fundingDatall",
                    accountInsights,
                    "Funds",
                    "funding-points"
                  );
                  break;
                case "Jobs":
                  appendDataToPremise(".jobll", accountInsights, "Job");
                  break;
                case "Markets":
                  appendDataToPremise(
                    ".market-sub-ll",
                    accountInsights,
                    "Market"
                  );
                  break;
                case "Verticals":
                  appendDataToPremise(
                    ".vertical-listll",
                    accountInsights,
                    "Verticals"
                  );
                  break;
                case "Competitors":
                  appendDataToPremise(
                    ".ccompanyll",
                    accountInsights,
                    "Competitors"
                  );
                  break;
                case "Analytics and Trackings":
                  appendDataToTach(
                    ".subcategory-techstackll",
                    accountInsights,
                    "Tech Stack"
                  );
                  break;
                case "BTL":
                  appendDataToPremise(".btltitlell", accountInsights, "BTL");
                  break;
                case "ATL":
                  appendDataToPremise(".atltitlell", accountInsights, "ATL");
                  break;

                // Account News & Media
                case "Opportunities and Updates":
                  appendDataToPremise(
                    ".cnewsll",
                    AccountNewsMedia,
                    " Events, Opportunities, Product Updates"
                  );
                  break;
                case "Website Languages":
                  appendContentToBody(
                    "companyLinesLL",
                    AccountNewsMedia,
                    "Website Language"
                  );
                  break;

                // Custom Signals
                case "Custom Signals":
                  appendDataToPremise(
                    ".question-container",
                    workFlow,
                    "Custom Workflow"
                  );
                  break;
              }
            }
          });
        });

        // Create and append the submit button if not already present
        if (!document.getElementById("submitPremise")) {
          const mainDiv = document.createElement("div");
          mainDiv.style.display = "flex";
          mainDiv.style.justifyContent = "space-between";
          mainDiv.style.alignItems = "center";
          mainDiv.style.width = "100%";

          const countDiv = document.createElement("div");
          countDiv.classList.add("atl-cls");
          countDiv.id = "selectedCount";
          countDiv.innerText = "0 signal selected";

          const submitButton = document.createElement("button");
          submitButton.type = "button";
          submitButton.classList.add("instruction-btn-ll");
          submitButton.id = "submitPremise";
          submitButton.textContent = "Submit";

          // Append button and countDiv to mainDiv
          mainDiv.appendChild(countDiv);
          mainDiv.appendChild(submitButton);

          // Append mainDiv to the popup-content-ll
          document.querySelector(".popup-content-ll").appendChild(mainDiv);

          // Event listener to hide popup when submit button is clicked
          submitButton.addEventListener("click", function () {
            const popupOverlay = document.getElementById("popup-overlay-ll");
            if (popupOverlay) {
              popupOverlay.style.display = "none";
              moveHiddenElementsToEnd();
              //on close of the signal I am clearing the selected angle and Angle List
              //so It will help to call the API this is done because After selection of extra signal-
              //we need to call the api to get ALL the generate-insight
              document.getElementById("temp-selected-insight").innerText = "";
              document.getElementById("selected-insight").innerText = "";
              const selectElement = document.getElementById("insight-list");
              selectElement.innerHTML = "";
              manageSignalSummaryDisplay("profileCardLL", ".insight-ll");
              const premiseButtons =
                document.querySelectorAll(".premise-btn-ll");
              premiseButtons.forEach((button) => {
                button.disabled = false;
              });
            }
          });
        }

        popupOverlay.style.display = "flex";
      }
    });
  });

  //for the drag and drop of the seleccted signal and giving priority
  // Select all draggable elements and the container

  const container = document.querySelector(".drag-area");

  // Event delegation for dragstart and dragend
  container.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("draggable")) {
      e.target.classList.add("dragging");
    }
  });

  container.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("draggable")) {
      e.target.classList.remove("dragging");

      // After dragging ends, move elements with display: none to the end
      moveHiddenElementsToEnd();
    }
  });

  // Handle dragover on the container
  container.addEventListener("dragover", (e) => {
    e.preventDefault(); // Allow dropping

    // Get the currently dragging element
    const dragging = document.querySelector(".dragging");
    if (!dragging) return;
    // Find the closest sibling where the dragged item should be inserted
    const afterElement = getDragAfterElement(container, e.clientY);

    if (afterElement == null) {
      container.appendChild(dragging); // If no sibling, append to the end
    } else {
      container.insertBefore(dragging, afterElement); // Insert before the closest sibling
    }
  });

  // Helper function to determine the drop position
  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  // Function to move elements with display: none to the end
  function moveHiddenElementsToEnd() {
    const hiddenElements = [
      ...container.querySelectorAll(".draggable[style*='display: none']"),
    ];

    hiddenElements.forEach((element) => {
      container.appendChild(element);
    });
  }

  increaseVariant.addEventListener("click", () => {
    let variant = parseInt(variantValue.textContent);
    if (variant < 3) {
      variant += 1;
      variantValue.textContent = variant;
    }
    logSelections(null, "variant");
  });

  decreaseVariant.addEventListener("click", () => {
    let variant = parseInt(variantValue.textContent);
    if (variant > 1) {
      variant -= 1;
      variantValue.textContent = variant;
    }
    logSelections(null, "variant");
  });

  popupCloseBtn.addEventListener("click", () => {
    popupOverlay.style.display = "none";
    const premiseButtons = document.querySelectorAll(".premise-btn-ll");
    premiseButtons.forEach((button) => {
      button.disabled = false;
    });
  });

  //for signal selection

  popupContentInsight.addEventListener("click", (event) => {
    const post = event.target.closest(".insightll");
    if (!post) return;
    const parentSignal = post.closest(".signalll");
    if (!parentSignal) return;

    const tempPostForInsight = document.getElementById("temp-selected-insight");
    const insightDiv = document.getElementById("selected-insight");

    const previouslySelected = parentSignal.querySelector(
      ".insightll.selected"
    );
    if (previouslySelected && previouslySelected !== post) {
      previouslySelected.classList.remove("selected");
      previouslySelected.style.borderColor = "rgb(204, 204, 204)";
      previouslySelected.style.borderWidth = "1px";

      const previousDescription =
        previouslySelected.querySelector(".descriptionll")?.innerText;
      const previousValue =
        previouslySelected.querySelector(".valuell")?.innerText;

      if (previousDescription && previousValue) {
        // Remove from selected-insight
        [...insightDiv.children].forEach((line) => {
          if (
            line.dataset.description === previousDescription &&
            line.dataset.value === previousValue
          ) {
            insightDiv.removeChild(line);
          }
        });

        // Remove from temp-selected-insight
        [...tempPostForInsight.children].forEach((line) => {
          if (
            line.dataset.description === previousDescription &&
            line.dataset.value === previousValue
          ) {
            tempPostForInsight.removeChild(line);
          }
        });
      }
    }

    const isSelected = post.classList.contains("selected");

    if (isSelected) {
      post.classList.remove("selected");
      post.style.borderColor = "rgb(204, 204, 204)";
      post.style.borderWidth = "1px";

      const descriptionContent =
        post.querySelector(".descriptionll")?.innerText;
      const valueContent = post.querySelector(".valuell")?.innerText;

      if (descriptionContent && valueContent) {
        // Remove from selected-insight
        [...insightDiv.children].forEach((line) => {
          if (
            line.dataset.description === descriptionContent &&
            line.dataset.value === valueContent
          ) {
            insightDiv.removeChild(line);
          }
        });

        // Remove from temp-selected-insight
        [...tempPostForInsight.children].forEach((line) => {
          if (
            line.dataset.description === descriptionContent &&
            line.dataset.value === valueContent
          ) {
            tempPostForInsight.removeChild(line);
          }
        });
      }
    } else {
      post.classList.add("selected");
      post.style.borderColor = "rgb(91, 140, 214)";
      post.style.borderWidth = "2px";

      const descriptionContent =
        post.querySelector(".descriptionll")?.innerText;
      const valueContent = post.querySelector(".valuell")?.innerText;

      if (descriptionContent && valueContent) {
        // Add to selected-insight
        const selectedLine = document.createElement("div");
        selectedLine.dataset.description = descriptionContent;
        selectedLine.dataset.value = valueContent;
        selectedLine.textContent = `Signal ${
          insightDiv.children.length + 1
        }: Description: ${descriptionContent} - Value: ${valueContent}`;
        insightDiv.appendChild(selectedLine);

        // Add to temp-selected-insight
        const tempLine = document.createElement("div");
        tempLine.dataset.description = descriptionContent;
        tempLine.dataset.value = valueContent;
        tempLine.textContent = `Signal ${
          tempPostForInsight.children.length + 1
        }: Description: ${descriptionContent} - Value: ${valueContent}`;
        tempPostForInsight.appendChild(tempLine);
      }
    }

    // Update counts and reflect them in tempPostForInsight
    updateSignalCounts();

    // Refresh or clean up any UI summaries (optional)
    manageSignalSummaryDisplay("profileCardLL", ".insight-ll");
  });

  async function updateSignalCounts() {
    const insightDiv = document.getElementById("selected-insight");
    const tempPostForInsight = document.getElementById("temp-selected-insight");

    const lines = [...insightDiv.children];
    const count = lines.length;

    // Update the count and content for each child in `insightDiv`
    lines.forEach((line, index) => {
      const text = line.textContent.replace(/^Signal \d+:\s*/, "");
      line.textContent = `Signal ${index + 1}: ${text}`;
    });

    // Reflect updated signals in tempPostForInsight
    tempPostForInsight.innerText = lines
      .map((line, index) => `Signal ${index + 1}: ${line.dataset.description}`)
      .join(" ");
    if (count === 0) {
      updateCounts("profileCardLL");
      return;
    }

    if (
      document
        .querySelector(".channel-btn-ll.active")
        .textContent.replace(checkMarkContent, "")
        .trim() !== "Cold Call"
    ) {
      try {
        // Fetch the framework data
        await getFrameWork(count, "angle", "profileCardLL");
      } catch (error) {
        console.error("Error fetching framework data:", error);
      }
    }
  }
}

/* --------- email creation end ------------------- */

async function deletePersona(event, id, container) {
  event.stopPropagation();
  //alert('Delete persona clicked!');
  // Implement delete functionality
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/persona-delete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        id: id,
      }),
    }
  );
  const responseData = await response.json();
  if (responseData) {
    showNotification(
      "Persona Deleted Successfully!",
      "success",
      "profileCardLL"
    );
    container.remove();
  }
}

async function editPersona(event, id, personaData) {
  event.stopPropagation();
  // Populate the input fields with the selected persona's data
  document.getElementById("persona-id-ll").value = personaData.id;
  document.getElementById("persona-name-ll").value = personaData.persona_name;
  document.getElementById("company-name-ll").value = personaData.company_name;
  document.getElementById("pain-points-ll").value =
    personaData.customer_pain_points;
  document.getElementById("industry-name-ll").value = personaData.industry;
  document.getElementById("value-proposition-ll").value =
    personaData.value_proposition;
  document.getElementById("results-ll").value = personaData.results;
  document.getElementById("mandatory-message-ll").value =
    personaData.mandatory_message;
  document.getElementById("custom-tonality-ll").value =
    personaData.custom_tonality;

  document.getElementById("parsonaListingDetails").children[0].style.display =
    "block";
  document.getElementById("parsonaListingDetails").children[1].style.display =
    "none";

  document.getElementById("create-btn-ll").textContent = "Update Persona";
}

document.addEventListener("click", (event) => {
  const post = event.target.closest(".postll");
  if (!post) return;

  if (!validateSignals("profileCardLL")) {
  }

  contentSelectPostData("profileCardLL", post);
  manageSignalSummaryDisplay("profileCardLL", ".signalsll");
  updateCounts("profileCardLL");
});
