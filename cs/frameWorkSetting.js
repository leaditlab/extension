function frameWorkSetting(uniqueId, linkdinUrl) {
  const uniqueContainer = document.getElementById(uniqueId);
  showFrameWorList();
  getStatusBarData();
  uniqueContainer
    .querySelector("#create-framework-button")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector(
        "#popup-select-overlay-framework-ll"
      ).style.display = "flex";
    });
  //    popup-overlay-framework-ll

  uniqueContainer
    .querySelector("#open-frameWork-setting")
    .addEventListener("click", (event) => {
      const parentElement = uniqueContainer.querySelector(
        "#parsonaListingDetails"
      );
      const childElements = Array.from(parentElement.children);

      childElements.forEach(function (child) {
        child.style.display = "none";
      });
      uniqueContainer.querySelector("#generate-framework-ll").style.display =
        "block";
      showFrameWorList();
    });

  uniqueContainer
    .querySelector("#backToFrameworkList")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector("#generate-framework-ll").style.display =
        "block";
      uniqueContainer.querySelector(
        "#popup-overlay-framework-ll"
      ).style.display = "none";
      clearValue();
    });
  uniqueContainer
    .querySelector("#popup-close-btn-framework-ll")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector(
        "#popup-select-overlay-framework-ll"
      ).style.display = "none";
      clearValue();
    });

  uniqueContainer
    .querySelector("#simple-framework-creation")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector(
        "#popup-select-overlay-framework-ll"
      ).style.display = "none";
      uniqueContainer.querySelector("#generate-framework-ll").style.display =
        "none";
      uniqueContainer.querySelector(
        "#popup-overlay-framework-ll"
      ).style.display = "block";
      uniqueContainer.querySelector(
        "#framework-advance-prompt-container"
      ).style.display = "none";
      uniqueContainer.querySelector("#framework-type-ll").value = "simple";
    });

  uniqueContainer
    .querySelector("#advanced-framework-creation")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector(
        "#popup-select-overlay-framework-ll"
      ).style.display = "none";
      uniqueContainer.querySelector("#generate-framework-ll").style.display =
        "none";
      uniqueContainer.querySelector(
        "#popup-overlay-framework-ll"
      ).style.display = "block";
      uniqueContainer.querySelector(
        "#framework-advance-prompt-container"
      ).style.display = "block";
      uniqueContainer.querySelector("#framework-type-ll").value = "advanced";
    });

  uniqueContainer
    .querySelector("#back-to-card")
    .addEventListener("click", (event) => {
      const parentElement = uniqueContainer.querySelector(
        "#parsonaListingDetails"
      );
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

  const textarea = uniqueContainer.querySelector("#framework-prompt");

  textarea.addEventListener("input", () => {
    const originalValue = textarea.value;

    // 1. Count how many numbered signals are already there
    const existingSignals = originalValue.match(/{{Signal (\d+)}}/g) || [];
    const numbers = existingSignals.map((sig) => parseInt(sig.match(/\d+/)[0]));
    const maxNumber = numbers.length ? Math.max(...numbers) : 0;

    let counter = maxNumber;

    // 2. Replace only the unnumbered {{Signal}} (skip those already numbered)
    const updatedValue = originalValue.replace(/{{Signal}}(?! \d+)/g, () => {
      counter++;
      return `{{Signal ${counter}}}`;
    });

    // 3. Update only if value changed to avoid caret jump
    if (updatedValue !== originalValue) {
      textarea.value = updatedValue;
    }
  });
  let validationWarningShown = false;
  uniqueContainer
    .querySelector("#framework-generate")
    .addEventListener("click", async function () {
      let api;
      const title = uniqueContainer.querySelector("#framework-title-ll").value;
      const frameWorkPromt =
        uniqueContainer.querySelector("#framework-prompt").value;
      const frameWorkPromtadvanced = uniqueContainer.querySelector(
        "#framework-advanced-prompt"
      ).value;
      const frameWorkType =
        uniqueContainer.querySelector("#framework-type-ll").value;
      const checkMarkContent = document.querySelector(
        "#frame-work-channel .checkmark-ll"
      ).textContent;
      const channel = document
        .querySelector("#frame-work-channel .channel-btn-ll.active")
        .textContent.replace(checkMarkContent, "")
        .trim();
      const id = uniqueContainer.querySelector("#framework-id-ll").value;
      if (id !== "") {
        api = "https://betabackext-beta.leadlabs.app/update-framework";
      } else {
        api = "https://betabackext-beta.leadlabs.app/create-framework";
      }
      // Check if all  frame have {{company_name}} or {{prospect_name}}
      const isValid =
        frameWorkPromt.includes("{{company_name}}") ||
        frameWorkPromt.includes("{{prospect_name}}");

      if (!isValid) {
        if (!validationWarningShown) {
          // Show the warning on the first click
          showNotification(
            "{{company_name}} or {{prospect_name}} is needed",
            "warning",
            uniqueId
          );
          validationWarningShown = true;
          return; // Exit early
        }
      }

      // Fetch the content from loader.html and update the innerHTML once fetched
      fetch(chrome.runtime.getURL("pages/loader.html"))
        .then((response) => response.text())
        .then((html) => {
          uniqueContainer.querySelector("#custom-question-list").innerHTML =
            html;
        })
        .catch((error) => {
          console.error("Error fetching loader.html:", error);
        });

      // Prepare the data to send to the backend API
      const data = {
        frameworkTitle: title,
        prompt: frameWorkPromt,
        id: id,
        channel: channel,
        advancedprompt: frameWorkPromtadvanced,
        prompttype: frameWorkType,
      };

      // Call the backend API
      let { userToken } = await chrome.storage.local.get(["userToken"]);

      try {
        const response = await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
          body: JSON.stringify(data),
        });

        const responseData = await response.json();
        if (responseData.header === "success") {
          uniqueContainer.querySelector(
            "#popup-overlay-framework-ll"
          ).style.display = "none";
          uniqueContainer.querySelector(
            "#generate-framework-ll"
          ).style.display = "block";
          showFrameWorList();
          clearValue();
          validationWarningShown = false;
        } else {
          clearValue();
          validationWarningShown = false;
        }
      } catch (error) {
        showNotification("Error contacting the server.", "warning", uniqueId);
        clearValue();
        validationWarningShown = false;
      }
    });
  function clearValue() {
    uniqueContainer.querySelector("#framework-title-ll").value = "";
    uniqueContainer.querySelector("#framework-id-ll").value = "";
    uniqueContainer.querySelector("#framework-prompt").value = "";
    uniqueContainer.querySelector("#framework-type-ll").value = "";
    uniqueContainer.querySelector("#framework-advanced-prompt").value = "";
    uniqueContainer.querySelector("#framework-generate").textContent =
      "Create framework";
    uniqueContainer.querySelector(
      "#framework-advance-prompt-container"
    ).display = "none";
  }
  async function showFrameWorList() {
    //loader
    fetch(chrome.runtime.getURL("pages/loader.html"))
      .then((r) => r.text())
      .then((html) => {
        uniqueContainer.querySelector("#custom-framework-list").innerHTML =
          html;
      });
    uniqueContainer.querySelector("#popup-overlay-framework-ll").style.display =
      "none";
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/get-custom-framework",
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
      uniqueContainer.querySelector("#custom-framework-list").innerHTML = "";
      generatedQuestion(responseData.body);
      const openCustomQuestion = uniqueContainer.querySelector(
        "#open-frameWork-setting"
      );
      const pTag = openCustomQuestion.querySelector("p");
      pTag.textContent = `${responseData.body.length} frameworks created`;
    }
  }

  function generatedQuestion(frameworkList) {
    const container = uniqueContainer.querySelector("#custom-framework-list");

    if (frameworkList.length === 0) {
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
        "<h4>No Custom Framework found</h4>" +
        "<p>Create a new Custom Framework.</p>" +
        "</div>";
      container.appendChild(emptyArray);
    }

    frameworkList.forEach((persona) => {
      const personaItem = document.createElement("div");
      personaItem.className = "persona-item-ll";
      personaItem.id = persona.id;

      const personaHeader = document.createElement("div");
      personaHeader.className = "persona-header-ll";
      personaHeader.onclick = togglePersonaDetails;

      const personaInfo = document.createElement("div");
      const personaName = document.createElement("h3");
      personaName.textContent = persona?.frameworkTitle;
      personaName.style.marginBottom = "0px";

      const createdDateContainer = document.createElement("p");

      const createdDateValue = document.createElement("p");
      createdDateValue.className = "workflow-data-p";
      createdDateValue.textContent = new Date(
        persona.date
      ).toLocaleDateString();

      createdDateContainer.appendChild(createdDateValue);
      personaInfo.appendChild(personaName);
      personaInfo.appendChild(createdDateContainer);

      const optionsContainer = document.createElement("div");
      optionsContainer.className = "options-container-ll";

      const statusElement = document.createElement("div");
      statusElement.textContent = persona.status ? "Active" : "Inactive";
      statusElement.classList.add(persona.status ? "atl-cls" : "btl-cls");
      const switchLabel = document.createElement("label");
      switchLabel.className = "switch-custom";

      const switchInput = document.createElement("input");
      switchInput.type = "checkbox";
      switchInput.checked = persona.status;
      switchInput.onchange = () =>
        updateStatus(persona.id, switchInput.checked);
      const switchSlider = document.createElement("span");
      switchSlider.className = "slider-custom rounded";

      switchLabel.appendChild(switchInput);
      switchLabel.appendChild(switchSlider);

      // Add switchnext to the status element
      const statusContainer = document.createElement("div");
      statusContainer.className = "status-container";
      statusContainer.appendChild(statusElement);
      statusContainer.appendChild(switchLabel);

      const expandIcon = document.createElement("span");
      expandIcon.className = "expand-icon-ll";
      expandIcon.textContent = "▼";

      const moreOptions = document.createElement("span");
      moreOptions.className = "more-options-ll";
      moreOptions.textContent = "⋮";

      const dropdownMenu = document.createElement("div");
      dropdownMenu.className = "dropdown-menu-ll";
      moreOptions.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent closing immediately
        dropdownMenu.style.display =
          dropdownMenu.style.display === "block" ? "none" : "block";
      });
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.onclick = (event) => editFrameWork(event, persona.id, persona);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = (event) =>
        deleteFramework(event, persona.id, personaItem);

      // Hiding for now
      dropdownMenu.appendChild(editButton);
      dropdownMenu.appendChild(deleteButton);

      optionsContainer.appendChild(statusElement);
      optionsContainer.appendChild(statusContainer);
      optionsContainer.appendChild(expandIcon);
      optionsContainer.appendChild(moreOptions);
      optionsContainer.appendChild(dropdownMenu);

      personaHeader.appendChild(personaInfo);
      personaHeader.appendChild(optionsContainer);

      const personaDetails = document.createElement("div");
      personaDetails.className = "persona-details-ll";
      personaDetails.style.display = "none";

      const personaPrompt = document.createElement("p");
      personaPrompt.textContent = persona.prompt;

      personaDetails.appendChild(personaPrompt);
      personaItem.appendChild(personaHeader);
      personaItem.appendChild(personaDetails);

      container.appendChild(personaItem);
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
  async function editFrameWork(event, id, frameWorkData) {
    console.log(frameWorkData, "frameWorkData");
    event.stopPropagation();

    uniqueContainer.querySelector("#popup-overlay-framework-ll").style.display =
      "block";
    uniqueContainer.querySelector("#generate-framework-ll").style.display =
      "none";
    uniqueContainer.querySelector("#framework-title-ll").value =
      frameWorkData.frameworkTitle;
    uniqueContainer.querySelector("#framework-prompt").value =
      frameWorkData.prompt;

    if (frameWorkData.prompttype === "simple") {
      uniqueContainer.querySelector(
        "#framework-advance-prompt-container"
      ).display = "none";
      uniqueContainer.querySelector("#framework-advanced-prompt").value = "";
      uniqueContainer.querySelector("#framework-type-ll").value = "simple";
    } else {
      uniqueContainer.querySelector(
        "#framework-advance-prompt-container"
      ).display = "block";
      uniqueContainer.querySelector("#framework-advanced-prompt").value =
        frameWorkData.advancedprompt;
      uniqueContainer.querySelector("#framework-type-ll").value = "advanced";
    }
    uniqueContainer.querySelector("#framework-id-ll").value = frameWorkData.id;

    const channelButtons = uniqueContainer.querySelectorAll(
      "#frame-work-channel .channel-btn-ll"
    );

    channelButtons.forEach((btn) => {
      // Get only the button label text (ignoring inner checkmark div)
      const btnLabel = btn.firstChild.nodeValue.trim(); // This grabs just "Email", "LinkedIn", etc.
      const isMatch = btnLabel === frameWorkData.channel;

      // Toggle the active class
      btn.classList.toggle("active", isMatch);
    });
    uniqueContainer.querySelector("#framework-generate").textContent =
      "Update framework";
  }
  async function updateStatus(personaId, newStatus) {
    // API call to update the status
    // Implement delete functionality
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/update-framework-status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          id: personaId,
          status: newStatus,
        }),
      }
    );
    const responseData = await response.json();
    if (responseData) {
      uniqueContainer.querySelector("#generate-framework-ll").style.display =
        "block";
      showFrameWorList();
      showNotification(
        "Custom Framework status updated Successfully!",
        "success",
        uniqueId
      );
    }
  }
  async function deleteFramework(event, id, container) {
    event.stopPropagation();

    // Implement delete functionality
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/delete-framework",
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
    if (responseData?.header === "success") {
      showNotification(
        "Custom Framework Deleted Successfully!",
        "success",
        uniqueId
      );
      container.remove();
    }
  }
  //signal count in first page and company page
  //on click it should redirect to message generation
  const signalButtons = uniqueContainer.querySelectorAll(
    ".signal-count-container"
  );

  signalButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Hide all tabcontent divs inside the container with id=uniqueId
      document
        .getElementById(uniqueId)
        .querySelectorAll(".tabcontent")
        .forEach(function (div) {
          div.style.display = "none";
        });

      // Show only the first section and hide the rest inside #emailCreationDetails
      const emailDetails = uniqueContainer.querySelector(
        "#emailCreationDetails"
      );
      emailDetails.style.display = "block";
      emailDetails.children[0].style.display = "block";
      emailDetails.children[1].style.display = "none";
      emailDetails.children[2].style.display = "none";
      emailDetails.children[3].style.display = "none";

      const naviconElements = uniqueContainer.querySelectorAll(".naviconLL");
      naviconElements.forEach((el) => el.classList.remove("active"));

      const emailNavIcon = uniqueContainer.querySelector("#emailCreation");
      if (emailNavIcon) {
        emailNavIcon.classList.add("active");
      }
    });
  });

  async function getStatusBarData() {
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/get-remaining-views",
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
      if (responseData?.body === "Access denied.") {
        uniqueContainer.querySelectorAll(".tabcontent").forEach((el) => {
          el.style.marginTop = "20px";
        });

        uniqueContainer.querySelector("#state-bar-ll").style.display = "none";
        uniqueContainer.querySelector("#tutorial-header").style.display =
          "none";
        const tabContents = uniqueContainer.querySelectorAll(".tabcontent");
        tabContents.forEach((tab) => {
          tab.style.height = "79.5vh";
        });
      } else {
        const total =
          responseData.body.viewedCount + responseData.body.remainingViews;
        const used = responseData.body.viewedCount;
        const remaining = responseData.body.remainingViews;
        const percent = ((used / total) * 100).toFixed(2);
        const dashArray = `${percent}, 100`;

        uniqueContainer.querySelector("#state-bar-ll").innerHTML = `
      <div class="status-bar-container" style="color:#637477">
       <div class="plan-text"> Upgrade to<span class="plan-link"></span>to get unlimited access.</div> 
        <div class="usage">
          <svg class="circle-progress" width="16" height="16" viewBox="0 0 36 36">
            <path
              class="circle-bg"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#CFE5F1"
              stroke-width="3.8"
            />
            <path
              class="circle"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#0D4E60"
              stroke-width="3.8"
              stroke-dasharray="${dashArray}"
              stroke-linecap="round"
            />
          </svg>
          <span class="usage-text">${remaining}/${total} remaining</span>
        </div>
      </div>
    `;
        uniqueContainer.querySelectorAll(".tabcontent").forEach((el) => {
          el.style.marginTop = "68px";
        });

        chrome.storage.local.get(["tutorialStatus"], (result) => {
          if (result.tutorialStatus !== "done") {
            // Tutorial not completed → enable events
            uniqueContainer
              .querySelector("#close-tutorial")
              .addEventListener("click", () => {
                // Show tutorial container
                const tutorialContainer =
                  uniqueContainer.querySelector("#tutorial-ll");
                tutorialContainer.style.display = "block";

                // Insert GIF inside tutorial-gif-ll
                const gifContainer =
                  uniqueContainer.querySelector("#tutorial-gif-ll");
                gifContainer.innerHTML = `<img src="${chrome.runtime.getURL(
                  "assets/tutorial.gif"
                )}" 
         alt="Tutorial" style="max-width: 100%;">`;

                // Dim tab content
                uniqueContainer
                  .querySelectorAll(".tabcontent")
                  .forEach((el) => {
                    el.style.opacity = "0.5";
                  });
              });
            uniqueContainer
              .querySelector("#tutorial-link-ll")
              .addEventListener("click", async () => {
                const link = await gettutorialLink();

                if (link) {
                  window.open(link, "_blank"); // Open in a new tab
                } else {
                  console.error("No link returned");
                }
              });
            uniqueContainer
              .querySelector("#done-tutorial-ll")
              .addEventListener("click", () => {
                // Save tutorial status
                chrome.storage.local.set({ tutorialStatus: "done" }, () => {});

                // Hide tutorial
                uniqueContainer.querySelector("#tutorial-ll").style.display =
                  "none";
                uniqueContainer.querySelector(
                  "#tutorial-header"
                ).style.display = "none";

                // Restore tab content
                uniqueContainer
                  .querySelectorAll(".tabcontent")
                  .forEach((el) => {
                    el.style.opacity = "1";
                  });
              });
          } else {
            // Tutorial already completed → hide header
            const tutorialHeader =
              uniqueContainer.querySelector("#tutorial-header");
            if (tutorialHeader) {
              tutorialHeader.style.display = "none";

              uniqueContainer.querySelectorAll(".tabcontent").forEach((el) => {
                el.style.marginTop = "50px";
              });
            }
          }
        });
      }
    }
  }

  uniqueContainer.querySelectorAll(".inner-sub-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove 'active' from all tabs
      document
        .querySelectorAll(".inner-sub-tab")
        .forEach((el) => el.classList.remove("active"));

      // Add 'active' to clicked tab
      tab.classList.add("active");

      // Scroll to the target section
      const targetId = tab.getAttribute("data-target");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}
