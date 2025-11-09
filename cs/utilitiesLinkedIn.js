// -------------------- Persona Uitlities ------------------------//

function showNotification(text, color, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);

  const notification = uniqueContainer.querySelector("#notification-ll");

  notification.innerText = text;
  if (color == "warning") {
    notification.style.backgroundColor = "#FFCC00";
    notification.style.color = "#222222";
  } else {
    notification.style.backgroundColor = "#28a745";
    notification.style.color = "#FFFFFF";
  }
  notification.style.display = "block";

  setTimeout(() => {
    notification.classList.add("notification-fade-out-ll");
  }, 1000);

  setTimeout(() => {
    notification.style.display = "none";
    notification.classList.remove("notification-fade-out-ll");
  }, 1500);
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

// ---------------- Persona Utility end -----------------------------//

// ----------------- Generate Content Page Start -------------------//

function manageSignalSummaryDisplay(uniqueId, value) {
  const uniqueContainer = document.getElementById(uniqueId);
  const parentDiv = uniqueContainer.querySelector(value);
  const children = parentDiv.querySelectorAll("div");

  let hasText = false;

  children.forEach((child) => {
    // Skip specific elements like headings, buttons, or specific divs
    if (
      child.matches("h4, button") ||
      child.textContent.trim() === "Drag and drop to change the priority" ||
      child.textContent.trim() === "Click to edit the angles"
    ) {
      return;
    }

    // Check if the child has meaningful text content
    if (child.textContent.trim() !== "") {
      hasText = true;
      child.style.display = "block";
    } else {
      child.style.display = "none";
    }
  });

  // Update the parentDiv's display based on content presence
  parentDiv.style.display = hasText ? "block" : "none";
}

function reverseChildren() {
  const parent = document.getElementById("generateContentResult");
  if (!parent) return;

  const children = Array.from(parent.children);
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  children.reverse().forEach((child) => parent.appendChild(child));
}

function addActionButtonsToContent(id, uniqueId, type) {
  const uniqueContainer = document.getElementById(uniqueId);
  if (uniqueContainer) {
    const emailDivs = document.querySelectorAll(
      ".generatedEmailLL:not(.accordion-ll .generatedEmailLL)"
    );

    emailDivs.forEach((emailDiv) => {
      const editableContent = document.createElement("div");
      editableContent.classList.add("editable-content-ll");
      editableContent.innerHTML = emailDiv.innerHTML;
      editableContent.contentEditable = true;

      // Clear the original emailDiv content and add the isolated editable content
      emailDiv.innerHTML = "";
      emailDiv.appendChild(editableContent);
      const copyIconFullContainer = document.createElement("div");
      copyIconFullContainer.classList.add("copy-icon-container-full-ll");
      copyIconFullContainer.style.display = "flex";
      copyIconFullContainer.style.justifyContent = "space-between";
      // Add the copy icon
      const copyIconContainer = document.createElement("div");
      copyIconContainer.classList.add("copy-icon-container-ll");
      const ptag = document.createElement("p");
      ptag.innerText = "Note: Save this message for future followup";
      ptag.classList.add("ptag-save");
      ptag.style.display = "none";

      const copyIcon = document.createElement("div");
      copyIcon.classList.add("copy-icon-ll");
      copyIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  `;
      copyIcon.style.cursor = "pointer";
      copyIcon.style.marginBottom = "5px";
      copyIcon.title = "Copy to clipboard";

      // Add copy functionality on click
      copyIcon.onclick = () => {
        //calling the copy text function and display the message .
        const textToCopy = copyTextContent(editableContent);
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            // Show "Text Copied!" message
            const copiedMessage = document.createElement("span");
            copiedMessage.classList.add("copied-message");
            copiedMessage.textContent = "Text Copied!";
            emailDiv.style.position = "relative";
            copyIcon.appendChild(copiedMessage);
            setTimeout(() => {
              copyIcon.removeChild(copiedMessage);
            }, 2000);
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
          });
      };
      copyIconContainer.appendChild(copyIcon);
      copyIconFullContainer.appendChild(ptag);
      copyIconFullContainer.appendChild(copyIconContainer);
      emailDiv.appendChild(copyIconFullContainer);

      // First add reading time and Words
      const words = editableContent.innerText.split(/\s+/).length;
      const readingTime = Math.floor(words / 4);

      // Create spans for reading time and number of words
      const readingTimeSpan = document.createElement("span");
      readingTimeSpan.classList.add("reading-time-span");
      readingTimeSpan.innerText = `Reading Time: ${readingTime} sec Words: ${words}`;
      emailDiv.insertBefore(readingTimeSpan, emailDiv.firstChild);

      const sectionTitle = document.createElement("div");
      sectionTitle.innerHTML =
        '<div style="border-top: 1px solid rgb(218, 218, 218);font-weight: 600;font-size: 14px;font-family: Manrope;padding: 10px 0px;">Shortcuts:</div>';
      emailDiv.appendChild(sectionTitle);

      // Create tabs
      const buttons = ["Modify", "Shorten", "Simplify", "Subject Lines"];
      const tabsContainer = document.createElement("div");
      tabsContainer.classList.add("tabs-container-ll");

      buttons.forEach((buttonText, index) => {
        const button = document.createElement("button");
        button.innerText = buttonText;
        button.classList.add("tab-btn-ll");
        button.onclick = () =>
          handleTabClick(emailDiv, buttonText, uniqueId, type);
        tabsContainer.appendChild(button);
      });

      emailDiv.appendChild(tabsContainer);

      // Create an empty action container for tab content
      const actionContainer = document.createElement("div");
      actionContainer.classList.add("action-container-ll");
      emailDiv.appendChild(actionContainer);

      // Trigger the first tab by default
      handleTabClick(emailDiv, "Modify", uniqueId, type);

      const contentId = document.createElement("span");
      contentId.classList.add("contentIdll");
      contentId.innerText = id;
      emailDiv.appendChild(contentId);
    });
  }
}

function handleTabClick(emailDiv, buttonText, uniqueId, type) {
  // Deactivate all tabs
  const allTabs = emailDiv.querySelectorAll(".tab-btn-ll");
  allTabs.forEach((tab) => tab.classList.remove("active"));

  // Activate the clicked tab
  const clickedTab = Array.from(allTabs).find(
    (tab) => tab.innerText === buttonText
  );
  clickedTab.classList.add("active");

  // Remove any existing action content
  const actionContainer = emailDiv.querySelector(".action-container-ll");
  if (actionContainer) {
    actionContainer.innerHTML = "";
    // Create content based on the tab clicked
    if (buttonText === "Shorten") {
      createShortenAction(emailDiv, actionContainer, uniqueId, type);
    } else if (buttonText === "Modify") {
      createIncreaseRelevanceAction(emailDiv, actionContainer, uniqueId, type);
    } else if (buttonText === "Simplify") {
      createSimplifyAction(emailDiv, actionContainer, uniqueId, type);
    } else if (buttonText === "Subject Lines") {
      createSubject(emailDiv, "Subject Lines", actionContainer, uniqueId, type);
    }
  }
}

function handleButtonClick(emailDiv, buttonText) {
  // Remove any existing action containers
  const existingActionContainer = emailDiv.querySelector(
    ".action-container-ll"
  );
  if (existingActionContainer) {
    existingActionContainer.remove();
  }

  // Create a new action container
  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action-container-ll");

  if (buttonText === "Shorten") {
    createShortenAction(emailDiv, actionContainer);
  } else if (buttonText === "Modify") {
    createIncreaseRelevanceAction(emailDiv, actionContainer);
  } else if (buttonText === "Simplify") {
    createSimplifyAction(emailDiv, actionContainer);
  } else if (buttonText === "Subject Lines") {
  }

  emailDiv.appendChild(actionContainer);
}

function createShortenAction(emailDiv, actionContainer, unique, type) {
  const sliderContainer = document.createElement("div");
  sliderContainer.classList.add("slider-container");

  const sliderLabel = document.createElement("label");
  sliderLabel.innerText = "Shorten message to:";

  const sliderLabelBelow = document.createElement("div");
  sliderLabelBelow.style.width = "100%";
  sliderLabelBelow.innerHTML =
    '<div class="sliderlabel fleft">50 words</div><div  class="sliderlabel fright">150 words</div>';

  const sliderValue = document.createElement("span");
  sliderValue.classList.add("slider-value");
  sliderValue.innerText = "60 Words";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "50";
  slider.max = "150";
  slider.value = "60";
  slider.classList.add("sliderll");

  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.classList.add("secondary-btn-ll");
  submitButton.onclick = () => {
    handleActionButtonClick(
      emailDiv,
      "Shortened Message",
      slider.value,
      unique,
      type
    );
    //actionContainer.remove(); // dont Remove the action container after submission
  };

  slider.oninput = () => {
    sliderValue.innerText = `${slider.value} words`;
  };

  sliderContainer.appendChild(sliderLabel);
  sliderContainer.appendChild(sliderValue);
  sliderContainer.appendChild(slider);
  sliderContainer.appendChild(sliderLabelBelow);
  actionContainer.appendChild(sliderContainer);
  actionContainer.appendChild(submitButton);
}

function createIncreaseRelevanceAction(
  emailDiv,
  actionContainer,
  unique,
  type
) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const buttonLabel = document.createElement("label");
  buttonLabel.innerText = "Suggest a Change:";

  // Create a textarea
  const textArea = document.createElement("textarea");
  textArea.classList.add("textarea-ll");
  textArea.placeholder = "In the second line, change the...";
  textArea.rows = 4; // Number of visible text lines
  textArea.cols = 30; // Width of the textarea

  // Create a submit button
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.classList.add("secondary-btn-ll");
  submitButton.onclick = () => {
    const textValue = textArea.value;
    if (textValue.trim() !== "") {
      handleActionButtonClick(
        emailDiv,
        "Modified Message",
        textValue,
        unique,
        type
      );
      textArea.value = ""; // Clear the textarea after submission
    } else {
      alert("Please enter some data before submitting!");
    }
  };

  buttonContainer.appendChild(buttonLabel);
  buttonContainer.appendChild(textArea);
  buttonContainer.appendChild(submitButton);

  actionContainer.appendChild(buttonContainer);
}

function createSubject(emailDiv, buttonText, actionContainer, unique, type) {
  handleActionButtonClick(emailDiv, buttonText, null, unique, type);
}

function createSimplifyAction(emailDiv, actionContainer, unique, type) {
  const sliderContainer = document.createElement("div");
  sliderContainer.classList.add("slider-container");

  const sliderLabel = document.createElement("label");
  sliderLabel.innerText = "Select grade level:";

  const sliderLabelBelow = document.createElement("div");
  sliderLabelBelow.style.width = "100%";
  sliderLabelBelow.innerHTML =
    '<div class="sliderlabel fleft">5th Grade</div><div  class="sliderlabel fright">8th Grade</div>';

  const sliderValue = document.createElement("span");
  sliderValue.classList.add("slider-value");
  sliderValue.innerText = "6";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "5";
  slider.max = "8";
  slider.value = "6";
  slider.classList.add("sliderll");

  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.classList.add("secondary-btn-ll");
  submitButton.onclick = () => {
    handleActionButtonClick(
      emailDiv,
      "Simplified Message",
      slider.value,
      unique,
      type
    );
    //actionContainer.remove(); // dont Remove the action container after submission
  };

  slider.oninput = () => {
    sliderValue.innerText = slider.value;
  };

  sliderContainer.appendChild(sliderLabel);
  sliderContainer.appendChild(sliderValue);
  sliderContainer.appendChild(slider);
  sliderContainer.appendChild(sliderLabelBelow);
  actionContainer.appendChild(sliderContainer);
  actionContainer.appendChild(submitButton);
}

function handleActionButtonClick(emailDiv, buttonText, value, unique, type) {
  const editableContentDiv = emailDiv.querySelector(".editable-content-ll");
  const emailText = Array.from(editableContentDiv.querySelectorAll("div"))
    .map((div) => div.innerText)
    .join("\n"); // Join the text content with new lines
  // cannot use innerText as button names will also come

  const id = emailDiv.querySelector(".contentIdll").innerText;

  // Determine the value based on the buttonText
  // below code note needed, as value passed to the function
  /*   let value;
  if (buttonText === 'Shorten' || buttonText === 'Simplify') {
      // Get the slider value for Shorten and Simplify
      const slider = emailDiv.querySelector('.action-container-ll input[type="range"]');
      value = slider ? slider.value : null;
  } else if (buttonText === 'Increase relevance') {
      // Get the selected button name for Increase relevance
      const selectedButton = emailDiv.querySelector('.action-container-ll button.active');
      value = selectedButton ? selectedButton.innerText : null;
  } */

  modifyGeneratedContent(emailText, buttonText, id, value, unique, type);
}
async function modifyGeneratedContent(
  emailText,
  buttonText,
  id,
  value,
  uniqueId,
  type
) {
  const uniqueContainer = document.getElementById(uniqueId);

  // Fetch and load the loader HTML into the specified container
  fetch(chrome.runtime.getURL("pages/loader.html"))
    .then((r) => r.text())
    .then((html) => {
      //based on the type I am creating the id , As we have the same functionality for both content and fine tuning
      //function is same for both

      if (type === "tune") {
        const modifiedContent = uniqueContainer.querySelector(
          "#modifiedContentll-tune"
        );

        if (!modifiedContent) {
          const newModifiedContent = document.createElement("div");
          newModifiedContent.id = "modifiedContentll-tune";
          newModifiedContent.innerHTML = html;
          uniqueContainer
            .querySelector("#regenerated-data")
            .appendChild(newModifiedContent);
        } else {
          modifiedContent.innerHTML = html;
        }
      } else {
        const modifiedContent =
          uniqueContainer.querySelector("#modifiedContentll");

        let targetElement;

        if (!modifiedContent) {
          const newModifiedContent = document.createElement("div");
          newModifiedContent.id = "modifiedContentll";
          newModifiedContent.innerHTML = html;
          uniqueContainer
            .querySelector("#generateContentResult")
            .appendChild(newModifiedContent);

          // Assign the new element to targetElement
          targetElement = newModifiedContent;
        } else {
          modifiedContent.innerHTML = html;

          // Use existing modifiedContent as the target
          targetElement = modifiedContent;
        }
      }

      // Scroll to the bottom of email creation details if present
      const emailCreationDetails = uniqueContainer.querySelector(
        "#emailCreationDetails"
      );
      if (emailCreationDetails) {
        emailCreationDetails.scrollTop = emailCreationDetails.scrollHeight;
      }
    });

  // Retrieve the user token from local storage
  let { userToken } = await chrome.storage.local.get(["userToken"]);

  // Make the API call to the email generator
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/email-generator-shorten",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        type: buttonText,
        postdata: emailText,
        id: id,
        value: value,
        Persona: uniqueContainer.querySelector("#persona-listing-name-ll")
          .value,
      }),
    }
  );

  // Update the content of modifiedContentll with the response data
  const responseData = await response.json();
  if (responseData) {
    if (type === "tune") {
      const modifiedContent = uniqueContainer.querySelector(
        "#modifiedContentll-tune"
      );
      if (modifiedContent) {
        modifiedContent.innerHTML = responseData.body;
        // const words = modifiedContent.innerText.split(/\s+/).length;

        // const readingTime = Math.floor(words / 4);
        // const data = uniqueContainer.querySelector(
        //   "#generateContentResultVtwo"
        // );
        // const readingTimeSpan = data.querySelector(".reading-time-span");
        // readingTimeSpan.innerText = `Reading Time: ${readingTime} sec Words: ${words}`;
      }
    } else {
      const modifiedContent =
        uniqueContainer.querySelector("#modifiedContentll");
      if (modifiedContent) {
        modifiedContent.innerHTML = responseData.body;
        // const words = modifiedContent.innerText.split(/\s+/).length;

        // const readingTime = Math.floor(words / 4);
        // const data = uniqueContainer.querySelector("#generateContentResult");
        // const readingTimeSpan = data.querySelector(".reading-time-span");
        // readingTimeSpan.innerText = `Reading Time: ${readingTime} sec Words: ${words}`;
      }
    }
  }
}

function deactivateButtonWithName(buttonText) {
  const buttons = document.querySelectorAll(".premise-btn-ll");
  buttons.forEach((button) => {
    if (button.textContent.includes(buttonText)) {
      button.classList.remove("active");
    }
  });
}

function makeContentEditable() {
  const emailDivs = document.querySelectorAll(".generatedEmailLL");
  emailDivs.forEach((emailDiv) => {
    const editableContent = document.createElement("div");
    editableContent.classList.add("editable-content-ll");
    editableContent.innerHTML = emailDiv.innerHTML;
    editableContent.contentEditable = true;

    // Clear the original emailDiv content and add the isolated editable content
    emailDiv.innerHTML = "";
    emailDiv.appendChild(editableContent);
  });
}

function combineConsecutiveMellDivsAndAddLabels() {
  // Select all generatedEmailLL containers
  const emailContainers = document.querySelectorAll(
    ".generatedEmailLL:not(.accordion-ll .generatedEmailLL)"
  );

  emailContainers.forEach((emailContainer) => {
    const childNodes = Array.from(emailContainer.children);

    let combinedText = "";
    let firstMellDiv = null;

    childNodes.forEach((node, index) => {
      if (node.classList.contains("mell")) {
        if (!firstMellDiv) {
          // If this is the first .mell div in the sequence, store it and start combining
          firstMellDiv = node;
          combinedText = node.innerHTML;
        } else {
          // If this is a consecutive .mell div, append its text to combinedText and remove it
          combinedText += " " + node.innerHTML;
          emailContainer.removeChild(node);
        }

        // After combining, add "You" label after the first .mell div
        if (
          index === childNodes.length - 1 ||
          !childNodes[index + 1].classList.contains("mell")
        ) {
          firstMellDiv.innerHTML = combinedText; // Update the first .mell div with combined text

          const youLabel = document.createElement("div");
          youLabel.classList.add("labelforchatright");
          youLabel.innerText = "You";
          emailContainer.insertBefore(youLabel, firstMellDiv.nextSibling);

          firstMellDiv = null; // Reset for the next sequence
          combinedText = ""; // Reset combined text
        }
      } else if (node.classList.contains("youll")) {
        // Add "Prospect" label after each .youll div
        const prospectLabel = document.createElement("div");
        prospectLabel.classList.add("labelforchatleft");
        prospectLabel.innerText = "Prospect";
        emailContainer.insertBefore(prospectLabel, node.nextSibling);
      }
    });

    // Handle the case where the last elements were .mell divs
    if (firstMellDiv) {
      firstMellDiv.innerHTML = combinedText;

      const youLabel = document.createElement("div");
      youLabel.classList.add("labelforchatright");
      youLabel.innerText = "You";
      emailContainer.insertBefore(youLabel, firstMellDiv.nextSibling);
    }
  });
}
function showNotificationSignal(text, color, unique) {
  const uniqueContainer = document.getElementById(unique);
  const notification = uniqueContainer.querySelector("#notification-signal");
  notification.innerText = text;
  if (color == "warning") {
    notification.style.backgroundColor = "#FFCC00";
    notification.style.color = "#222222";
  } else {
    notification.style.backgroundColor = "#28a745";
    notification.style.color = "#FFFFFF";
  }
  notification.style.display = "block";

  setTimeout(() => {
    notification.classList.add("notification-fade-out-ll");
  }, 1000);

  setTimeout(() => {
    notification.style.display = "none";
    notification.classList.remove("notification-fade-out-ll");
  }, 5000);
}
// ----------------- Generate Content Page End -------------------//

//--------------------- Others -------------------------------//

// udpating post time stamp //
function updateTimeAgoInAllPosts(block, createdDate) {
  const created = new Date(createdDate);
  const now = new Date();
  let divs = document.querySelectorAll(".posttimell");

  if (block != null) {
    divs = document.getElementById(block).querySelectorAll(".posttimell");
  }

  divs.forEach((div) => {
    const text = div.innerText;
    const [value, unit] = parseTimeAgo(text);
    if (value === null || unit === null) {
      return; // skip update for unknown format
    }
    const newValue = calculateNewValue(value, unit, created, now);
    if (newValue < 1) {
      div.innerText = "today";
    } else if (newValue === -1) {
      div.innerText = text;
    } else {
      div.innerText = formatNewValue(newValue);
    }
  });
}

function parseTimeAgo(text) {
  let value, unit;

  // Match cases like "22h", "1w ago", "4 months ago", "1m ago", "22 hours ago", "1 day ago"
  const match = text.match(
    /^(\d+)\s*([a-zA-Z]+)?(?:\s+(seconds|minutes|minute|hours|hour|days|day|weeks|week|months|month|years|year))?/i
  );

  if (match) {
    value = parseInt(match[1], 10);
    unit = match[2] ? match[2].toLowerCase() : match[3]?.toLowerCase();

    // Normalize unit names
    const unitMap = {
      s: "seconds",
      second: "seconds",
      seconds: "seconds",
      m: "minutes",
      minute: "minutes",
      minutes: "minutes",
      h: "hours",
      hour: "hours",
      hours: "hours",
      d: "days",
      day: "days",
      days: "days",
      w: "weeks",
      week: "weeks",
      weeks: "weeks",
      mo: "months",
      month: "months",
      months: "months",
      y: "years",
      year: "years",
      years: "years",
    };

    unit = unitMap[unit] || unit;
  }

  if (isNaN(value) || !unit) {
    return [null, null];
  }

  return [value, unit];
}

function calculateNewValue(value, unit, created, now) {
  let daysDifference = 0;
  switch (unit) {
    case "minutes":
      daysDifference = value / (24 * 60);
      break;
    case "hours":
      daysDifference = value / 24;
      break;
    case "days":
      daysDifference = value;
      break;
    case "weeks":
      daysDifference = value * 7;
      break;
    case "months":
      daysDifference = value * 30;
      break;
    case "years":
      daysDifference = value * 365;
      break;
    default:
      return -1; // Return the original string
  }
  const totalDays = (now - created) / (1000 * 60 * 60 * 24);
  //console.log(`Text: ${value} ${unit}, Total Days: ${totalDays}, Days Difference: ${daysDifference}`);
  return totalDays + daysDifference;
}

function formatNewValue(days) {
  if (days < 1) {
    return "today";
  } else if (days >= 365) {
    const years = Math.floor(days / 365);
    return `${years} ${years > 1 ? "years" : "year"} ago`;
  } else if (days >= 30) {
    const months = Math.floor(days / 30);
    return `${months} ${months > 1 ? "months" : "month"} ago`;
  } else {
    return `${Math.floor(days)} days ago`;
  }
}

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

function removeClickEvents(elementId, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  let oldElement;
  if (uniqueId) {
    oldElement = uniqueContainer.querySelector(`#${elementId}`);
  } else {
    oldElement = document.getElementById(elementId);
  }

  if (oldElement) {
    const newElement = oldElement.cloneNode(true);
    oldElement.parentNode.replaceChild(newElement, oldElement);

    // Now you can add a new event listener
    newElement.addEventListener("click", function () {
      // New click handler
    });
  }
}

// ----------------------Others end --------------------------//
async function checkPostclassNameFunction(funname, checkClass) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/get-linkedin-class",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        functionCalled: funname,
        classCalled: checkClass,
      }),
    }
  );

  const responseData = await response.json();

  if (responseData) {
    return responseData.newClass;
  }
}
// --------------------------------Remove chic
function removeCheckMarkWhileADD(post) {
  const childNodes = Array.from(post.childNodes).filter(
    (node) => !node.classList || !node.classList.contains("check-mark")
  );

  // Extract and concatenate the text content of the filtered nodes
  const inText = childNodes
    .map((node) => node.innerText || node.textContent)
    .join(" ")
    .trim();
  return inText;
}
//This function helper that return the value for adding the content in div
function constructSentence(Text, type, description = "", unique) {
  const uniqueContainer = document.getElementById(unique);
  const companyName = uniqueContainer.querySelector("#companyNameLL").innerText;
  const profileName = uniqueContainer.querySelector(
    "#profileNameGenerateContent"
  ).innerText;
  const firstName = profileName.split(" ")[0];
  if (type === "vertical") {
    return `${companyName} sells to ${Text} verticals.`;
  } else if (type === "competitor") {
    return `${companyName} competes with ${Text}.${description}`;
  } else if (type === "website") {
    return `${Text} : Reference the language used by ${companyName} on their website as an analogy to write the message.`;
  } else if (type === "market") {
    return `${companyName} sells to ${Text} segments.`;
  } else if (type === "atl") {
    return `${companyName} sells to ${Text}.`;
  } else if (type === "btl") {
    return `${companyName} engages ${Text}.`;
  } else if (type === "tech") {
    return `${companyName} uses ${Text} internally.`;
  } else if (type === "job") {
    return `${companyName} is hiring for ${Text}.`;
  } else if (type === "like") {
    return `${firstName} likes:  ${Text}.`;
  } else if (type === "dislike") {
    return `${firstName} dislikes  ${Text}.`;
  } else if (type === "interest") {
    return `${firstName} is interested in  ${Text}.`;
  } else if (type === "personal") {
    return `${firstName}’s probable problem could be: ${Text}.`;
  } else if (type === "self") {
    return `${firstName} posted this on LinkedIn - ${Text}.`;
  } else if (type === "engage") {
    return `${firstName} engaged with this post on LinkedIn - ${Text}.`;
  } else if (type === "funding") {
    return `${companyName}’s recent funding round is ${Text}.`;
  } else if (type === "companypost") {
    //to know company post and self written content I have given space between LinkedIn
    return `${companyName} posted this on LinkedIn : ${Text}.`;
  } else if (type === "present") {
    return `${firstName} currectly working in ${description} as ${Text}`;
  } else if (type === "experience") {
    return `${firstName} worked as ${Text} at ${description}`;
  } else if (type === "responsibility") {
    return `${firstName} responsibility is ${Text}`;
  }
}
function copyTextContent(editableContent) {
  const textToCopy = Array.from(editableContent.querySelectorAll("div, br"))
    .map((node) => {
      if (node.tagName === "BR") {
        return "\n"; // Single line break for <br>
      } else if (node.tagName === "DIV") {
        const content = node.textContent.trim();
        return content ? content + "\n\n" : "\n"; // Add an empty line after each <div>
      }
      return "";
    })
    .join("")
    .replace(/\n{3,}/g, "\n\n") // Avoid more than two consecutive blank lines
    .trim();

  return textToCopy;
}

function updateLoaderText(x) {
  if (x > 0 && document.getElementById("loaderTextLL")) {
    setTimeout(() => updateLoaderText(x - 1), 1000);
    try {
      const loaderElement = document.getElementById("loaderTextLL");
      if (loaderElement.innerText === "Generating...") {
        loaderElement.innerText = "Validating...";
      } else if (loaderElement.innerText === "Validating...") {
        loaderElement.innerText = "Optimizing...";
      } else {
        loaderElement.innerText = "Optimizing...";
      }
    } catch (err) {
      console.error("loaderTextLL - couldn't find loaderTextLL", err);
    }
  }
}
function FollowUpFrameWork(moreOptions) {
  // Find the nearest dropdown menu
  const dropdownMenu = moreOptions.nextElementSibling;

  if (dropdownMenu && dropdownMenu.classList.contains("dropdown-menu-ll")) {
    // Hide all other dropdown menus
    document.querySelectorAll(".dropdown-menu-ll").forEach((menu) => {
      if (menu !== dropdownMenu) {
        menu.style.display = "none";
      }
    });

    // Toggle visibility of the current dropdown menu
    dropdownMenu.style.display =
      dropdownMenu.style.display === "block" ? "none" : "block";
  }

  // Add a document-level click event listener to hide dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.matches(".more-options-ll")) {
      document.querySelectorAll(".dropdown-menu-ll").forEach((menu) => {
        menu.style.display = "none";
      });
    }
  });
}

async function getFrameWork(count, type, unique) {
  const uniqueContainer = document.getElementById(unique);
  const frameworkSelect = uniqueContainer.querySelector("#framework-ll");
  let { userToken } = await chrome.storage.local.get(["userToken"]);

  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/get-frame-work",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        count: count,
        type: type,
      }),
    }
  );

  const responseData = await response.json();
  // // Update the options for the select dropdown
  // if (responseData && responseData.opt) {
  //   frameworkSelect.innerHTML = responseData.opt;
  // }

  // // Set the selected value
  // if (responseData && responseData.vlu) {
  //   frameworkSelect.value = responseData.vlu;
  // }

  // let selectedValue = responseData.vlu;
  // if (selectedValue.includes("(V2)")) {
  //   uniqueContainer.querySelector("#variant-ll").style.display = "none";
  //   uniqueContainer.querySelector("#variant-message-ll").style.display =
  //     "block";
  // } else {
  //   uniqueContainer.querySelector("#variant-ll").style.display = "flex";
  //   uniqueContainer.querySelector("#variant-message-ll").style.display = "none";
  // }

  const dropdownMenu = uniqueContainer.querySelector("#framework-dropdown-ll");
  const mainButton = uniqueContainer.querySelector("#framework-ll");

  const data = responseData?.array;
  dropdownMenu.innerHTML = "";
  if (data.length > 0) {
    mainButton.innerHTML = data[0].displayData;
    mainButton.setAttribute("data-value", data[0].value);
    if (data[0].value && data[0].value.includes("(V2)")) {
      uniqueContainer.querySelector("#variant-ll").style.display = "none";
      uniqueContainer.querySelector("#variant-message-ll").style.display =
        "block";
    } else {
      uniqueContainer.querySelector("#variant-ll").style.display = "flex";
      uniqueContainer.querySelector("#variant-message-ll").style.display =
        "none";
    }
  }
  data.forEach((item) => {
    const button = document.createElement("button");
    button.innerHTML = item.displayData;

    // Click event to update main button but not call API yet
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      mainButton.innerHTML = item.displayData;
      mainButton.setAttribute("data-value", item.value);
      dropdownMenu.style.display = "none";
      //for hide the varient on change on the frame work
      if (item.value && item.value.includes("(V2)")) {
        uniqueContainer.querySelector("#variant-ll").style.display = "none";
        uniqueContainer.querySelector("#variant-message-ll").style.display =
          "block";
      } else {
        uniqueContainer.querySelector("#variant-ll").style.display = "flex";
        uniqueContainer.querySelector("#variant-message-ll").style.display =
          "none";
      }
    });

    dropdownMenu.appendChild(button);
  });
}

//this function called in load company details.
//if profileUpdatedTime is less then current time then calling the loadCompanyDetails so it will call the API
//here we are converting time to UTC to IST
function isProfileUpdateWithinTwoMinutes(
  uniqueId,
  profileUpdatedTime,
  overview,
  techStack,
  website,
  jobs,
  market
) {
  // Convert UTC to IST
  const uniqueContainer = document.getElementById(uniqueId);
  const utcDate = new Date(profileUpdatedTime);
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  const istTime = new Date(utcDate.getTime() + istOffset);
  // Get current time in IST
  const currentUtcTime = new Date();
  const currentIstTime = new Date(currentUtcTime.getTime() + istOffset);
  // Calculate time difference in seconds
  const timeDifference = (currentIstTime - istTime) / 1000;

  if (timeDifference <= 80 && timeDifference > 0) {
    if (
      techStack?.length == 0 ||
      website?.length === 0 ||
      overview === "" ||
      jobs === "" ||
      market === ""
    ) {
      setTimeout(() => {
        uniqueContainer.querySelector("#progress-bar-header").style.display =
          "block";
        const remainingTime = 75 - timeDifference;
        fillProgressBar(remainingTime, uniqueId);
        loadCompanyDetails(uniqueId);
      }, 4000); // 5 seconds delay
    } else {
      uniqueContainer.querySelector("#progress-bar-header").style.display =
        "none";
    }
  } else {
    uniqueContainer.querySelector("#progress-bar-header").style.display =
      "none";
  }
  return timeDifference <= 90;
}
function fillProgressBar(remainingTime, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  const progressBarFill = uniqueContainer.querySelector(".progress-bar-fill");
  const progressText = uniqueContainer.querySelector("#signal-remaining");
  const totalDuration = 90;
  const progressPercentage =
    ((totalDuration - remainingTime) * 100) / totalDuration; // Calculate the width
  progressBarFill.style.width = `${Math.min(progressPercentage, 100)}%`; // Set the width

  let signalsRemaining;
  if (progressPercentage >= 90) {
    signalsRemaining = 1;
  } else if (progressPercentage >= 80) {
    signalsRemaining = 2;
  } else if (progressPercentage >= 70) {
    signalsRemaining = 3;
  } else if (progressPercentage >= 60) {
    signalsRemaining = 4;
  } else if (progressPercentage >= 50) {
    signalsRemaining = 5;
  } else if (progressPercentage >= 40) {
    signalsRemaining = 6;
  } else if (progressPercentage >= 30) {
    signalsRemaining = 7;
  } else if (progressPercentage >= 20) {
    signalsRemaining = 8;
  } else {
    signalsRemaining = 9;
  }

  // Update the text
  progressText.innerText = `${signalsRemaining} Signals remaining`;
}

function showContentPost(linkedInPost) {
  const allPostsDiv = document.getElementById("allPosts");
  const commentsPostsDiv = document.getElementById("commentsPosts");
  const reactionsPostsDiv = document.getElementById("reactionsPosts");
  if (!linkedInPost.some((item) => item.postType === "comments")) {
    commentsPostsDiv.innerHTML =
      '<div id="analyseComment">Click to analyse engage content</div>';

    document
      .getElementById("analyseComment")
      .addEventListener("click", function () {
        popupCenters({
          url:
            removeAfter5thSlash(window.location.toString()) +
            "recent-activity/comments",
          title: "LeadLabs",
          w: 600,
          h: 600,
        });
      });
  }
  linkedInPost.forEach((item) => {
    let content = createPostContent(item?.postType, item?.gpt_response);
    if (item.postType === "all") {
      allPostsDiv.innerHTML = content;
    } else if (item.postType === "comments") {
      commentsPostsDiv.innerHTML = content;
    } else if (item.postType === "reactions") {
      reactionsPostsDiv.innerHTML = content;
    }

    const allCommentTags = document
      .getElementById("commentsPosts")
      .querySelectorAll(".postll .tagsll");
    allCommentTags.forEach((tagsll) => {
      tagsll.innerHTML = '<div ">Comment</div>';
    });

    const allReactionTags = document
      .getElementById("reactionsPosts")
      .querySelectorAll(".postll .tagsll");
    allReactionTags.forEach((tagsll) => {
      tagsll.innerHTML =
        '<div style="background-color: rgb(243, 243, 255);color: rgb(91, 91, 214);">Reaction</div>';
    });
  });
}
function isProfileAnalysiedTwo(posts) {
  // Check if any post has an empty gpt_response
  const hasEmptyResponse = posts.some(
    (post) => !post.gpt_response || post.gpt_response.trim() === ""
  );

  if (hasEmptyResponse || posts.length < 1) {
    setTimeout(() => {
      callMainAnalysisOnceAgain();
    }, 5000); // Call after 5 seconds
  }

  return hasEmptyResponse;
}

async function callMainAnalysisOnceAgain() {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/get-linkedin-profile-byurl",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        linkdinUrl: getLinkedInURL(),
      }),
    }
  );

  const responseData = await response.json();

  if (responseData) {
    showContentPost(responseData.linkedInPost);
  }
}
function countCommas(value) {
  return (value.match(/,/g) || []).length;
}
//function tcheck the length
async function checkLenghtGenerateContent(url) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/email-generator-list",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        search_value: "",
        page_limit: 1,
        linkdinProfileURL: url,
      }),
    }
  );

  const responseData = await response.json();

  if (responseData) {
    return (
      responseData.unsavedMessages.length > 0 ||
      responseData.savedMessages.length > 0
    );
  } // Default return if no response data
}

//this are the common function for float icon and linkedIn
async function editHistoryContent(
  id,
  filteredText,
  filteredHTML,
  buttontxt,
  triggerElement
) {
  let originalContent = null; // To store the original content before showing the loader
  const parentContainer = triggerElement.closest(".email-container-ll");
  try {
    // Find the nearest parent with the class 'email-container-ll'

    if (parentContainer) {
      // Store the original content of the parent container
      originalContent = parentContainer.innerHTML;

      // Fetch and set loader content inside the parent container
      const loaderHTML = await fetch(
        chrome.runtime.getURL("pages/loader.html")
      ).then((response) => response.text());
      parentContainer.innerHTML = loaderHTML;
      updateLoaderText(3);
    }

    // Retrieve the user token
    const { userToken } = await chrome.storage.local.get(["userToken"]);

    // Make the API call
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/email-generator-followup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          id: id,
          data: filteredText,
          html: filteredHTML,
          context: buttontxt,
        }),
      }
    );

    const responseData = await response.json();

    if (parentContainer) {
      // Remove the loader and set the new content
      parentContainer.innerHTML = ""; // Clear existing content
      responseData.body.forEach((emailBody) => {
        // Call your custom content generation function
        contentgenerationdisplay(
          emailBody,
          false,
          responseData?.followUpArray,
          responseData?.followUptwoArray,
          "",
          parentContainer
        );
      });
    }

    return responseData;
  } catch (error) {
    // Restore original content in case of an error
    if (parentContainer && originalContent) {
      parentContainer.innerHTML = originalContent;
    }
    throw error; // Ensure the calling code handles this error
  }
}
//common code for history content generation display
function contentgenerationdisplay(
  emailBody,
  createNewElement,
  followUpArray,
  followUptwoArray,
  selectElement,
  passedElement
) {
  const createdDateObj = new Date(emailBody.created_date);
  const today = new Date();
  const timeDiff = today - createdDateObj; // Difference in milliseconds
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days

  const relativeDateText =
    daysAgo < 1 ? "Today" : `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;

  // Create the createdDate div
  const createdDate = document.createElement("div");
  createdDate.style.display = "flex";
  createdDate.style.justifyContent = "space-between";
  createdDate.style.textTransform = "capitalize";

  if (emailBody?.channel === "LinkedIn") {
    createdDate.classList.add("linkedin-header-ll");
  } else if (emailBody?.channel === "Cold Call") {
    createdDate.classList.add("cold-header-ll");
  } else if (emailBody?.channel === "Subject Lines") {
    createdDate.classList.add("subject-lines-ll");
  } else if (emailBody?.channel === "Modified Message") {
    createdDate.classList.add("modified-lines-ll");
  } else {
    createdDate.classList.add("followup-header-ll");
  }

  const createdType = document.createElement("div");
  createdType.innerHTML = emailBody?.channel;
  createdType.classList.add("follow-up-cls");
  const createdDay = document.createElement("div");
  createdDay.innerHTML = ` ${relativeDateText}`;
  createdDay.classList.add("follow-date");

  createdDate.appendChild(createdType);
  createdDate.appendChild(createdDay);
  // Create the email div
  const email = document.createElement("div");
  email.innerHTML = emailBody.emailbody;
  email.classList.add("editable-content-ll");
  email.contentEditable = true;

  let container;
  if (createNewElement == true) {
    container = document.createElement("div");
    container.classList.add("email-container-ll");
    container.style.marginBottom = "10px";
  } else {
    if (!passedElement || !(passedElement instanceof HTMLElement)) {
      console.error("passedElement is not a valid DOM element");
      return; // Exit early to avoid further issues
    }
    container = passedElement;
    container.innerHTML = ""; // Clear existing content
  }

  const copyIcon = document.createElement("div");
  copyIcon.classList.add("copy-icon-ll");
  copyIcon.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
`;
  copyIcon.style.cursor = "pointer";
  copyIcon.title = "Copy to clipboard";

  // Add copy functionality on click
  copyIcon.onclick = () => {
    //calling the copy text function and display the message .
    const textToCopy = copyTextContent(email.firstChild);
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // Show "Text Copied!" message
        const copiedMessage = document.createElement("span");
        copiedMessage.classList.add("copied-message");
        copiedMessage.textContent = "Text Copied!";
        container.style.position = "relative";
        copyIcon.appendChild(copiedMessage);
        setTimeout(() => {
          copyIcon.removeChild(copiedMessage);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  // Create the button
  const button = document.createElement("button");
  button.textContent = followUpArray[0];
  button.classList.add("create-follow-up");
  // Add click event listener to the button
  button.onclick = async (event) => {
    const emailText = email.innerText;
    const emailHtml = email.innerHTML;
    const filteredText = emailText.replace(/follow up/gi, "");
    const id = hiddenDiv.innerText; // Get the hidden ID
    const buttontxt = button.textContent;

    // Use `event.target` to get the clicked button
    const triggerButton = event.target;
    try {
      // Call the editHistoryContent function to create the first follow up
      const returnedData = await editHistoryContent(
        id,
        filteredText,
        emailHtml,
        buttontxt,
        triggerButton
      );
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const moreOptions = document.createElement("span");
  moreOptions.className = "more-options-ll";
  moreOptions.textContent = "▼";

  moreOptions.onclick = (event) => {
    event.stopPropagation();
    FollowUpFrameWork(moreOptions);
  };

  const dropdownMenu = document.createElement("div");
  dropdownMenu.className = "dropdown-menu-ll";
  dropdownMenu.style.display = "none";

  followUpArray.forEach((followUpText) => {
    const followUpButton = document.createElement("button");
    followUpButton.textContent = followUpText;

    // Add a click event handler for each button
    followUpButton.onclick = (event) => {
      button.textContent = followUpText;
      dropdownMenu.style.display = "none";
    };
    // Append the button to the dropdown menu
    dropdownMenu.appendChild(followUpButton);
  });

  const deleteContentButton = document.createElement("button");
  deleteContentButton.textContent = "Delete";
  deleteContentButton.classList.add("delete-follow-up");
  deleteContentButton.style.marginLeft = "auto";

  // Variable to track if the button was clicked once
  let isConfirmDelete = false;

  // Function to delete the content
  deleteContentButton.onclick = async () => {
    const id = hiddenDiv.innerText; // Get the hidden ID

    if (!isConfirmDelete) {
      // Change button text to "Confirm Delete"
      deleteContentButton.textContent = "Confirm Delete";
      isConfirmDelete = true;
    } else {
      try {
        // Call the deleteContent API to delete the content
        const returnedData = await deleteContent(id);

        if (returnedData) {
          // Remove the parent container
          const parentContainer = deleteContentButton.closest(
            ".email-container-ll"
          );
          if (parentContainer) {
            parentContainer.remove();
          }
        }
      } catch (error) {
        console.error("Error updating content:", error);
      }
    }
  };

  // Create a flex container for button and select
  const buttonSelectContainer = document.createElement("div");
  buttonSelectContainer.classList.add("button-select-container");
  buttonSelectContainer.style.display = "flex";
  buttonSelectContainer.style.alignItems = "center";
  buttonSelectContainer.style.padding = "10px";
  buttonSelectContainer.style.position = "relative";

  // Append button and select to the button-select container
  if (
    emailBody?.channel === "Email" ||
    emailBody?.channel === "LinkedIn" ||
    emailBody?.channel === "Modified Message" ||
    emailBody?.channel === "Shortened Message" ||
    emailBody?.channel === "Simplified Message"
  ) {
    buttonSelectContainer.appendChild(button);
    buttonSelectContainer.appendChild(moreOptions);
    buttonSelectContainer.appendChild(dropdownMenu);
  }

  buttonSelectContainer.appendChild(deleteContentButton);

  // Create a hidden div for created_date and id
  const hiddenDiv = document.createElement("div");
  hiddenDiv.classList.add("hidden-metadata-ll");
  hiddenDiv.style.display = "none";
  hiddenDiv.innerHTML = emailBody.id;

  // Create a separate container for follow-up divs
  const followUpContainer = document.createElement("div");
  followUpContainer.classList.add("follow-up-container");

  // Loop through followupbody and add follow-up divs

  emailBody.followupbody.forEach((item, index) => {
    const resultDiv = document.createElement("div");
    resultDiv.classList.add("follow-content-ll");
    resultDiv.style.marginTop = "10px";
    resultDiv.style.marginLeft = `${20 + index * 10}px`;

    // Create a header row for FollowUp, followup_type, and date
    const headerDiv = document.createElement("div");
    headerDiv.classList.add("followup-header-ll");
    headerDiv.style.display = "flex";
    headerDiv.style.justifyContent = "space-between";
    headerDiv.style.alignItems = "center";
    headerDiv.style.marginBottom = "5px";

    // Add FollowUp number
    const followupLabel = document.createElement("div");
    followupLabel.classList.add("followup-label-ll");
    followupLabel.innerText = `Follow Up ${index + 1}`;

    // Add followup_type in the middle
    const followupType = document.createElement("div");
    followupType.classList.add("followup-type-ll");

    followupType.style.textAlign = "center";
    followupType.innerText = item.followup_type;

    // Add createdAt date
    const followupDate = document.createElement("div");
    followupDate.classList.add("follow-date");
    followupDate.style.color = "#222222";
    if (item.createdAt) {
      const followupDateObj = new Date(item.createdAt);
      const today = new Date();
      const followupDaysAgo = Math.floor(
        (today - followupDateObj) / (1000 * 60 * 60 * 24)
      );
      followupDate.innerText =
        followupDaysAgo < 1
          ? "Today"
          : `${followupDaysAgo} day${followupDaysAgo > 1 ? "s" : ""} ago`;
    } else {
      followupDate.innerText = "Date not available";
    }

    // Append FollowUp number, type, and date to the header
    headerDiv.appendChild(followupLabel);
    headerDiv.appendChild(followupType);
    headerDiv.appendChild(followupDate);

    // Add followup_response below the header
    const followupResponseDiv = document.createElement("div");
    followupResponseDiv.classList.add("followup-response-ll");
    followupResponseDiv.style.marginTop = "5px";
    followupResponseDiv.innerHTML = item.followup_response;
    followupResponseDiv.contentEditable = true;

    const copyIcon = document.createElement("div");
    copyIcon.classList.add("copy-icon-ll");
    copyIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  `;
    copyIcon.style.cursor = "pointer";
    copyIcon.title = "Copy to clipboard";

    // Add copy functionality on click
    copyIcon.onclick = () => {
      //calling the copy text function and display the message .
      const textToCopy = copyTextContent(followupResponseDiv.firstChild);
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          // Show "Text Copied!" message
          const copiedMessage = document.createElement("span");
          copiedMessage.classList.add("copied-message");
          copiedMessage.textContent = "Text Copied!";
          resultDiv.style.position = "relative";
          copyIcon.appendChild(copiedMessage);
          setTimeout(() => {
            copyIcon.removeChild(copiedMessage);
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    };
    // Create a hidden div for created_date and id
    const hiddenIdfollowUp = document.createElement("div");
    hiddenIdfollowUp.classList.add("hidden-metadata-ll");
    hiddenIdfollowUp.style.display = "none";
    hiddenIdfollowUp.innerHTML = item._id;

    // Append header and response to resultDiv
    resultDiv.appendChild(headerDiv);
    resultDiv.appendChild(followupResponseDiv);
    resultDiv.appendChild(copyIcon);
    resultDiv.appendChild(hiddenIdfollowUp);

    // Create the container div
    const followcontainer = document.createElement("div");

    followcontainer.style.marginBottom = "5px";
    followcontainer.style.marginTop = "5px";
    followcontainer.style.padding = "5px";
    followcontainer.style.display = "flex"; // Flexbox for layout
    followcontainer.style.justifyContent = "space-between";
    followcontainer.style.alignItems = "center";
    followcontainer.style.position = "relative";

    // Create the left container for button and select
    const leftContainer = document.createElement("div");
    leftContainer.classList.add("left-container-ll");
    leftContainer.style.display = "flex";
    leftContainer.style.alignItems = "center";

    // For the first follow-up, add the "create-follow-up" button and select dropdown
    if (emailBody.followupbody.length === 1 && index === 0) {
      // Create the button
      const button = document.createElement("button");
      button.textContent = followUptwoArray[0];
      button.classList.add("create-follow-up");

      // Add click event listener to the button
      button.onclick = async (event) => {
        // Initialize the followupResponseDiv
        const followupResponseDiv = button
          .closest(".follow-content-ll")
          .querySelector(".followup-response-ll");

        let contentData;
        const emailContainer = button.closest(".email-container-ll");
        if (emailContainer) {
          const generatedEmailElement =
            emailContainer.querySelector(".generatedEmailLL");
          if (generatedEmailElement) {
            contentData = generatedEmailElement.innerText;
          }
        }

        // Now, followupResponseDiv should be accessible
        if (followupResponseDiv) {
          const followupResponseDivText = followupResponseDiv.innerText;

          // Process followupResponseDiv text as needed
          const filteredText = followupResponseDivText.replace(
            /follow up/gi,
            ""
          );
          const id = hiddenDiv.innerText; // Get the hidden ID
          const buttontxt = button.textContent;
          const triggerButton = event.target;

          try {
            const returnedData = await createSecondFollowUp(
              id,
              filteredText,
              contentData,
              buttontxt,
              triggerButton
            );

            if (returnedData) {
              button.remove();
            }
          } catch (error) {
            console.error("Error updating content:", error);
          }
        } else {
          console.error("Follow-up response div not found.");
        }
      };

      const moreOptions = document.createElement("span");
      moreOptions.className = "more-options-ll";
      moreOptions.textContent = "▼";

      moreOptions.onclick = (event) => {
        event.stopPropagation();
        FollowUpFrameWork(moreOptions);
      };

      const dropdownMenu = document.createElement("div");
      dropdownMenu.className = "dropdown-menu-ll";
      dropdownMenu.style.display = "none";

      followUptwoArray.forEach((followUpText) => {
        const followUpButton = document.createElement("button");
        followUpButton.textContent = followUpText;

        // Add a click event handler for each button
        followUpButton.onclick = (event) => {
          button.textContent = followUpText;
          dropdownMenu.style.display = "none";
        };
        // Append the button to the dropdown menu
        dropdownMenu.appendChild(followUpButton);
      });
      // Append button and select to the left container
      leftContainer.appendChild(button);
      leftContainer.appendChild(moreOptions);
      leftContainer.appendChild(dropdownMenu);
    }
    const rightButton = document.createElement("button");
    rightButton.textContent = "Delete";
    rightButton.classList.add("delete-follow-up");
    rightButton.style.marginLeft = "auto";

    // Variable to track if the button was clicked once
    let isConfirmDelete = false;

    rightButton.onclick = async () => {
      const id = hiddenDiv.innerText;
      const followupIdToRemove = hiddenIdfollowUp.innerText;
      const parentElement = rightButton.closest(".email-container-ll");

      if (!isConfirmDelete) {
        rightButton.textContent = "Confirm Delete";
        isConfirmDelete = true;
      } else {
        try {
          const returnedData = await deleteFollowUp(
            id,
            followupIdToRemove,
            index
          );
          if (returnedData) {
            contentgenerationdisplay(
              returnedData?.mainbody,
              false,
              returnedData?.followUpArray,
              returnedData?.followUptwoArray,
              "",
              parentElement
            );
          }
        } catch (error) {
          console.error("Error updating content:", error);
        }
      }
    };

    // Add the left container and right button to the main container
    followcontainer.appendChild(leftContainer);
    followcontainer.appendChild(rightButton);

    // Append the container below followup-response-ll
    copyIcon.insertAdjacentElement("afterend", followcontainer);

    followUpContainer.appendChild(resultDiv);
  });
  const contentContainer = document.createElement("div");
  contentContainer.classList.add("content-container-ll");
  contentContainer.style.padding = "0px";
  contentContainer.appendChild(createdDate);
  contentContainer.appendChild(email);
  if (emailBody?.channel !== "Cold Call") {
    contentContainer.appendChild(copyIcon);
  }

  contentContainer.appendChild(buttonSelectContainer);

  container.appendChild(contentContainer);
  container.appendChild(hiddenDiv);
  container.appendChild(followUpContainer);
  // Append the container to the main selectElement
  if (createNewElement === true) {
    selectElement.appendChild(container);
  }
}

async function deleteContent(id) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/email-generator-delete",
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
    return responseData;
  }
}
async function deleteFollowUp(id, followupID, position) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/email-generator-followup-delete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        id: id,
        followupIdToRemove: followupID,
        position: position + 1,
      }),
    }
  );

  const responseData = await response.json();
  if (responseData) {
    return responseData;
  }
}

async function createSecondFollowUp(
  id,
  filteredText,
  contentData,
  buttontxt,
  triggerElement
) {
  let originalContent = null;

  try {
    //here as a parameter I am sending the targeted button
    //reading the closest parent container of that button
    //add the loader and then add the response  by caling the contentgenerationdisplay function
    const parentContainer = triggerElement.closest(".email-container-ll");

    if (parentContainer) {
      originalContent = parentContainer.innerHTML;
      const loaderHTML = await fetch(
        chrome.runtime.getURL("pages/loader.html")
      ).then((response) => response.text());

      parentContainer.innerHTML = loaderHTML;

      updateLoaderText(3);
    }

    const { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/email-generator-followup-2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          id: id,
          data: filteredText,
          context: buttontxt,
          contentText: contentData,
        }),
      }
    );

    const responseData = await response.json();

    if (parentContainer) {
      // Remove the loader and set the new content
      parentContainer.innerHTML = ""; // Clear existing content
      contentgenerationdisplay(
        responseData?.body,
        false,
        responseData?.followUpArray,
        responseData?.followUptwoArray,
        "",
        parentContainer
      );
    }

    return responseData;
  } catch (error) {
    // Restore original content in case of an error
    if (parentContainer && originalContent) {
      parentContainer.innerHTML = originalContent;
    }

    throw error; // Ensure the calling code handles this error
  }
}

//function to send the active Time
async function sendActiveTime(activeArray) {
  const uniqueActiveTime = [...new Set(activeArray)];
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/store-active-time",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        activetime: uniqueActiveTime,
        linkdinUrl: getLinkedInURL(),
      }),
    }
  );

  const responseData = await response.json();
  if (responseData) {
    return responseData;
  }
}
function changeActiveTime(data, unique) {
  const uniqueContainer = document.getElementById(unique);

  let timings = "";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeZoneAbbrMap = getTimeZoneList();
  const tzShort = timeZoneAbbrMap[tz] || tz;
  // Iterate over the data array
  data.forEach((unixTimestamp) => {
    // Convert UNIX timestamp to human-readable date
    const humanDateFormat = unixTimestampToHumanDate(unixTimestamp);

    // Extract the "from" and "to" times
    let from = new Date(humanDateFormat).getHours();
    let to = from + 1;

    // Format the "to" time
    if (to > 23) {
      to = "12 AM";
    } else if (to > 12) {
      to = to - 12 + " PM";
    } else if (to === 12) {
      to = to + " PM";
    } else {
      to = to + " AM";
    }

    // Format the "from" time
    if (from > 12) {
      from = from - 12 + " PM";
    } else if (from === 12) {
      from = from + " PM";
    } else {
      from = from + " AM";
    }

    // Check if this time range is already included
    const timeRange = `${from} to ${to}`;
    if (!timings.includes(timeRange)) {
      timings += `
        <div class="activeTime-ll" >
          ${timeRange}
        </div>`;
    }
  });

  // Add the timings and timezone to the container

  const activeTimeSection = uniqueContainer.querySelector(
    "#profileActiveTimeSection"
  );

  if (activeTimeSection) {
    if (timings.trim() === "") {
      activeTimeSection.style.display = "none";
    } else {
      activeTimeSection.style.display = "block"; // or "" to reset inline style
      activeTimeSection.innerHTML =
        `
      <p class="activeTag">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.625 5.6875L7 7V3.9375" stroke="#637477" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 12.25C5.96165 12.25 4.94662 11.9421 4.08326 11.3652C3.2199 10.7883 2.54699 9.9684 2.14963 9.00909C1.75227 8.04978 1.64831 6.99418 1.85088 5.97578C2.05345 4.95738 2.55347 4.02192 3.28769 3.28769C4.02192 2.55347 4.95738 2.05345 5.97578 1.85088C6.99418 1.64831 8.04978 1.75227 9.00909 2.14963C9.9684 2.54699 10.7883 3.2199 11.3652 4.08326C11.9421 4.94662 12.25 5.96165 12.25 7" stroke="#637477" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8.75 12.25C8.9507 11.4953 9.65781 10.9375 10.5 10.9375C11.3422 10.9375 12.0493 11.4953 12.25 12.25" stroke="#637477" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10.5 10.9375C11.2249 10.9375 11.8125 10.3499 11.8125 9.625C11.8125 8.90013 11.2249 8.3125 10.5 8.3125C9.77513 8.3125 9.1875 8.90013 9.1875 9.625C9.1875 10.3499 9.77513 10.9375 10.5 10.9375Z" stroke="#637477" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Active time:
      </p>` +
        timings +
        `<div class="active-location">Shown in your timezone - ${tz}</div>`;
    }
  }
  if (uniqueContainer.querySelector("#user-active-time")) {
    uniqueContainer.querySelector(
      "#time-zone-ll"
    ).innerHTML = `<p class="activeTag"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.625 5.6875L7 7V3.9375" stroke="#637477" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 12.25C5.96165 12.25 4.94662 11.9421 4.08326 11.3652C3.2199 10.7883 2.54699 9.9684 2.14963 9.00909C1.75227 8.04978 1.64831 6.99418 1.85088 5.97578C2.05345 4.95738 2.55347 4.02192 3.28769 3.28769C4.02192 2.55347 4.95738 2.05345 5.97578 1.85088C6.99418 1.64831 8.04978 1.75227 9.00909 2.14963C9.9684 2.54699 10.7883 3.2199 11.3652 4.08326C11.9421 4.94662 12.25 5.96165 12.25 7" stroke="#637477" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.75 12.25C8.9507 11.4953 9.65781 10.9375 10.5 10.9375C11.3422 10.9375 12.0493 11.4953 12.25 12.25" stroke="#637477" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.5 10.9375C11.2249 10.9375 11.8125 10.3499 11.8125 9.625C11.8125 8.90013 11.2249 8.3125 10.5 8.3125C9.77513 8.3125 9.1875 8.90013 9.1875 9.625C9.1875 10.3499 9.77513 10.9375 10.5 10.9375Z" stroke="#637477" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

Active Hours (${tzShort})</p> `;
    uniqueContainer.querySelector("#user-active-time").innerHTML = timings;
  }
}
function getTimeZoneList() {
  return {
    "America/New_York": "EST",
    "America/Detroit": "EST",
    "America/Kentucky/Louisville": "EST",
    "America/Kentucky/Monticello": "EST",
    "America/Indiana/Indianapolis": "EST",
    "America/Indiana/Vincennes": "EST",
    "America/Indiana/Winamac": "EST",
    "America/Indiana/Marengo": "EST",
    "America/Indiana/Petersburg": "EST",
    "America/Indiana/Vevay": "EST",
    "America/Chicago": "CST",
    "America/Indiana/Tell_City": "CST",
    "America/Indiana/Knox": "CST",
    "America/Menominee": "CST",
    "America/North_Dakota/Center": "CST",
    "America/North_Dakota/New_Salem": "CST",
    "America/North_Dakota/Beulah": "CST",
    "America/Denver": "MST",
    "America/Boise": "MST",
    "America/Phoenix": "MST",
    "America/Los_Angeles": "PST",
    "America/Anchorage": "AKST",
    "America/Juneau": "AKST",
    "America/Sitka": "AKST",
    "America/Metlakatla": "AKST",
    "America/Yakutat": "AKST",
    "America/Nome": "AKST",
    "America/Adak": "HST",
    "Pacific/Honolulu": "HST",
    "America/Toronto": "EST",
    "America/Montreal": "EST",
    "America/Vancouver": "PST",
    "America/Edmonton": "MST",
    "America/Winnipeg": "CST",
    "America/Regina": "CST",
    "America/Halifax": "AST",
    "America/St_Johns": "NST",
    "America/Mexico_City": "CST",
    "America/Cancun": "EST",
    "America/Tijuana": "PST",
    "America/Chihuahua": "MST",

    // Europe
    "Europe/London": "GMT",
    "Europe/Dublin": "GMT",
    "Europe/Berlin": "CET",
    "Europe/Paris": "CET",
    "Europe/Rome": "CET",
    "Europe/Madrid": "CET",
    "Europe/Amsterdam": "CET",
    "Europe/Brussels": "CET",
    "Europe/Vienna": "CET",
    "Europe/Prague": "CET",
    "Europe/Warsaw": "CET",
    "Europe/Budapest": "CET",
    "Europe/Zurich": "CET",
    "Europe/Stockholm": "CET",
    "Europe/Oslo": "CET",
    "Europe/Copenhagen": "CET",
    "Europe/Helsinki": "EET",
    "Europe/Athens": "EET",
    "Europe/Istanbul": "TRT",
    "Europe/Moscow": "MSK",
    "Europe/Kiev": "EET",
    "Europe/Bucharest": "EET",
    "Europe/Sofia": "EET",
    "Europe/Riga": "EET",
    "Europe/Tallinn": "EET",
    "Europe/Vilnius": "EET",
    "Europe/Minsk": "MSK",

    // Asia
    "Asia/Tokyo": "JST",
    "Asia/Shanghai": "CST",
    "Asia/Hong_Kong": "HKT",
    "Asia/Singapore": "SGT",
    "Asia/Bangkok": "ICT",
    "Asia/Jakarta": "WIB",
    "Asia/Manila": "PHT",
    "Asia/Kuala_Lumpur": "MYT",
    "Asia/Seoul": "KST",
    "Asia/Taipei": "CST",
    "Asia/Kolkata": "IST",
    "Asia/Mumbai": "IST",
    "Asia/Delhi": "IST",
    "Asia/Calcutta": "IST",
    "Asia/Karachi": "PKT",
    "Asia/Dhaka": "BST",
    "Asia/Kathmandu": "NPT",
    "Asia/Colombo": "LKT",
    "Asia/Dubai": "GST",
    "Asia/Kuwait": "AST",
    "Asia/Riyadh": "AST",
    "Asia/Qatar": "AST",
    "Asia/Bahrain": "AST",
    "Asia/Baghdad": "AST",
    "Asia/Tehran": "IRST",
    "Asia/Kabul": "AFT",
    "Asia/Tashkent": "UZT",
    "Asia/Almaty": "ALMT",
    "Asia/Yekaterinburg": "YEKT",
    "Asia/Omsk": "OMST",
    "Asia/Krasnoyarsk": "KRAT",
    "Asia/Irkutsk": "IRKT",
    "Asia/Yakutsk": "YAKT",
    "Asia/Vladivostok": "VLAT",
    "Asia/Magadan": "MAGT",
    "Asia/Sakhalin": "SAKT",
    "Asia/Kamchatka": "PETT",

    // Australia & New Zealand
    "Australia/Sydney": "AEST",
    "Australia/Melbourne": "AEST",
    "Australia/Brisbane": "AEST",
    "Australia/Adelaide": "ACST",
    "Australia/Perth": "AWST",
    "Australia/Darwin": "ACST",
    "Australia/Hobart": "AEST",
    "Australia/Canberra": "AEST",
    "Pacific/Auckland": "NZST",
    "Pacific/Chatham": "CHAST",

    // Africa
    "Africa/Cairo": "EET",
    "Africa/Johannesburg": "SAST",
    "Africa/Lagos": "WAT",
    "Africa/Nairobi": "EAT",
    "Africa/Casablanca": "WET",
    "Africa/Algiers": "CET",
    "Africa/Tunis": "CET",
    "Africa/Tripoli": "EET",
    "Africa/Khartoum": "CAT",
    "Africa/Addis_Ababa": "EAT",
    "Africa/Dar_es_Salaam": "EAT",
    "Africa/Maputo": "CAT",
    "Africa/Harare": "CAT",
    "Africa/Lusaka": "CAT",
    "Africa/Kinshasa": "WAT",
    "Africa/Brazzaville": "WAT",
    "Africa/Douala": "WAT",
    "Africa/Bangui": "WAT",
    "Africa/Ndjamena": "WAT",
    "Africa/Niamey": "WAT",
    "Africa/Bamako": "GMT",
    "Africa/Ouagadougou": "GMT",
    "Africa/Accra": "GMT",
    "Africa/Abidjan": "GMT",
    "Africa/Monrovia": "GMT",
    "Africa/Freetown": "GMT",
    "Africa/Conakry": "GMT",
    "Africa/Bissau": "GMT",
    "Africa/Dakar": "GMT",

    // South America
    "America/Sao_Paulo": "BRT",
    "America/Rio_Branco": "ACT",
    "America/Manaus": "AMT",
    "America/Fortaleza": "BRT",
    "America/Recife": "BRT",
    "America/Belem": "BRT",
    "America/Argentina/Buenos_Aires": "ART",
    "America/Argentina/Cordoba": "ART",
    "America/Argentina/Salta": "ART",
    "America/Argentina/Mendoza": "ART",
    "America/Santiago": "CLT",
    "America/Lima": "PET",
    "America/Bogota": "COT",
    "America/Caracas": "VET",
    "America/Guyana": "GYT",
    "America/Paramaribo": "SRT",
    "America/Montevideo": "UYT",
    "America/Asuncion": "PYT",
    "America/La_Paz": "BOT",

    // Middle East
    "Asia/Jerusalem": "IST",
    "Asia/Beirut": "EET",
    "Asia/Damascus": "EET",
    "Asia/Amman": "EET",
    "Asia/Nicosia": "EET",

    // Pacific Islands
    "Pacific/Fiji": "FJT",
    "Pacific/Guam": "ChST",
    "Pacific/Tahiti": "TAHT",
    "Pacific/Marquesas": "MART",
    "Pacific/Gambier": "GAMT",
    "Pacific/Pitcairn": "PST",
    "Pacific/Easter": "EAST",
    "Pacific/Galapagos": "GALT",
    "Pacific/Norfolk": "NFT",
    "Pacific/Noumea": "NCT",
    "Pacific/Port_Moresby": "PGT",
    "Pacific/Guadalcanal": "SBT",
    "Pacific/Efate": "VUT",
    "Pacific/Tongatapu": "TOT",
    "Pacific/Apia": "WST",
    "Pacific/Kiritimati": "LINT",
    "Pacific/Enderbury": "PHOT",
    "Pacific/Fakaofo": "TKT",
    "Pacific/Wallis": "WFT",
    "Pacific/Pago_Pago": "SST",
    "Pacific/Midway": "SST",
    "Pacific/Wake": "WAKT",
    "Pacific/Kosrae": "KOST",
    "Pacific/Chuuk": "CHUT",
    "Pacific/Pohnpei": "PONT",
    "Pacific/Majuro": "MHT",
    "Pacific/Kwajalein": "MHT",
    "Pacific/Tarawa": "GILT",
    "Pacific/Funafuti": "TVT",
    "Pacific/Nauru": "NRT",

    // Atlantic
    "Atlantic/Reykjavik": "GMT",
    "Atlantic/Faroe": "WET",
    "Atlantic/Azores": "AZOT",
    "Atlantic/Madeira": "WET",
    "Atlantic/Canary": "WET",
    "Atlantic/Cape_Verde": "CVT",
    "Atlantic/St_Helena": "GMT",
    "Atlantic/Bermuda": "AST",
    "Atlantic/Stanley": "FKST",
    "Atlantic/South_Georgia": "GST",

    // Indian Ocean
    "Indian/Mauritius": "MUT",
    "Indian/Maldives": "MVT",
    "Indian/Chagos": "IOT",
    "Indian/Reunion": "RET",
    "Indian/Mayotte": "EAT",
    "Indian/Comoro": "EAT",
    "Indian/Antananarivo": "EAT",
    "Indian/Kerguelen": "TFT",
    "Indian/Cocos": "CCT",
    "Indian/Christmas": "CXT",

    // Antarctica (some examples)
    "Antarctica/McMurdo": "NZST",
    "Antarctica/Casey": "AWST",
    "Antarctica/Davis": "DAVT",
    "Antarctica/DumontDUrville": "DDUT",
    "Antarctica/Mawson": "MAWT",
    "Antarctica/Palmer": "CLT",
    "Antarctica/Rothera": "ROTT",
    "Antarctica/Syowa": "SYOT",
    "Antarctica/Troll": "UTC",
    "Antarctica/Vostok": "VOST",
  };
}

async function getGlobleQuestion(linkdinUrl) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/get-global-questions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        linkdinUrl: linkdinUrl,
      }),
    }
  );

  const responseData = await response.json();
  if (responseData) {
    return responseData;
  }
}
async function callWorkflow() {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/create-workflow-answer",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        linkdinUrl: getLinkedInURL(),
      }),
    }
  );

  const responseData = await response.json();
  if (responseData) {
    return responseData;
  }
}
async function loadWorkFlowDetails(uniqueId, profileUrl) {
  const uniqueContainer = document.getElementById(uniqueId);
  const workflowAllQuestionLL = uniqueContainer.querySelector(
    "#workflowAllQuestionLL"
  );
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/get-workflow-answer",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        linkdinUrl: profileUrl,
      }),
    }
  );

  const responseData = await response.json();
  if (responseData) {
    workflowAllQuestionLL.innerHTML = "";
    responseData.body.forEach((item) => {
      // Create a container for each item
      const questionContainer = document.createElement("div");
      questionContainer.classList.add("question-container", "postll");

      // Create a div for the updated question
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("updated-question-ll");
      questionDiv.textContent = item.updated_question;

      // Create a div for the answer (parsed as HTML)
      const answerDiv = document.createElement("div");
      answerDiv.classList.add("answer-ll");
      answerDiv.innerHTML = item.answer;

      // Append the question and answer to the container
      questionContainer.appendChild(questionDiv);
      questionContainer.appendChild(answerDiv);

      // Append the container to the main workflowAllQuestionLL
      workflowAllQuestionLL.appendChild(questionContainer);
    });
  }
}

async function generateButtons(uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  if (!uniqueContainer) return;

  const container = uniqueContainer.querySelector("#content-body");
  if (!container) return;

  container.innerHTML = "";

  let data = await getAllSignalSettings();
  const allActive = data.every((category) =>
    category.list.every((item) => item.displayStatus)
  );

  const signalSetting = uniqueContainer.querySelector("#open-signal-setting p");
  if (signalSetting) {
    signalSetting.innerText = allActive
      ? "All Signals Active"
      : "Some Signals Inactive";
  }

  data.forEach((item, index) => {
    const allInactive = item.list.every((subItem) => !subItem.displayStatus);

    // If all are inactive, skip creating the button
    if (allInactive) return;

    const button = document.createElement("div");
    button.classList.add("content-selection-button");
    button.textContent = item.name;

    // Set the first valid button as active
    if (container.children.length === 0) {
      button.classList.add("active");
    }

    container.appendChild(button);
  });

  // Call contentBlockOpen after buttons are generated
  contentBlockOpen(uniqueId);
}

function contentBlockOpen(uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  if (!uniqueContainer) return;

  const buttons = uniqueContainer.querySelectorAll(".content-selection-button");
  const accordionBodies = {
    "Personal Overview": uniqueContainer.querySelector(
      "#bodyPersonalAttribute"
    ),
    "Self Authored Content": uniqueContainer.querySelector("#bodySelfWritten"),
    "Engaged Content": uniqueContainer.querySelector("#bodyEngagedContent"),
    "Account Overview": uniqueContainer.querySelector("#bodyAccountPremise"),
    "Account Insights": uniqueContainer.querySelector("#bodyaccountInsights"),
    "Account News and Media": uniqueContainer.querySelector(
      "#bodyAccountNewsMedia"
    ),
    "Custom Signals": uniqueContainer.querySelector("#bodyWorkFlow"),
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonText = button.textContent.trim();

      // Remove active class from all buttons
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Hide all accordion bodies
      Object.values(accordionBodies).forEach((body) => {
        if (body) body.style.display = "none";
      });

      // Show the matched body
      if (accordionBodies[buttonText]) {
        accordionBodies[buttonText].style.display = "block";
      }

      uniqueContainer.querySelector("#accordionExample").scrollTop = 0;
    });
  });

  // Ensure the first tab is displayed by default
  const firstButton = buttons[0];
  if (firstButton) {
    firstButton.click(); // Simulate a click to show the first tab
  }
}
function contentSelectPostData(uniqueId, post) {
  const uniqueContainer = document.getElementById(uniqueId);
  const summarySelfDiv = uniqueContainer.querySelector("#selected-signal");
  const summaryOfselfWrittenContent = uniqueContainer.querySelector(
    "#summaryOfselfWrittenContent"
  );
  const isSelected = post.style.backgroundColor === "rgb(240, 240, 240)";

  const handleCancel = async (attributeLine, post) => {
    summarySelfDiv.removeChild(attributeLine);
    post.style.backgroundColor = "";
    removeCheckMark();
    manageSignalSummaryDisplay(uniqueId, ".signalsll");

    const insightDiv = uniqueContainer.querySelector(".drag-area");

    // Filter children based on display style being 'block'
    const visibleLines = [...insightDiv.children].filter(
      (child) => window.getComputedStyle(child).display === "block"
    );

    const count = visibleLines.length;

    const checkMarkContent =
      uniqueContainer.querySelector(".checkmark-ll").textContent;
    const activeButton = uniqueContainer.querySelector(
      ".channel-btn-ll.active"
    );

    if (
      activeButton &&
      activeButton.textContent.replace(checkMarkContent, "").trim() !==
        "Cold Call"
    ) {
      try {
        // Fetch the framework data
        await getFrameWork(count, "signal", uniqueId);
      } catch (error) {
        console.error("Error fetching framework data:", error);
      }
    }
  };
  // Create or remove the check mark
  const createCheckMark = () => {
    const checkMark = document.createElement("div");
    checkMark.innerHTML = "✓"; // You can replace this with a custom check mark SVG if desired
    checkMark.className = "check-mark";
    checkMark.style.fontSize = "12px";

    // Insert the checkMark as the first child of post
    post.insertBefore(checkMark, post.firstChild);
  };

  const removeCheckMark = () => {
    const checkMark = post.querySelector(".check-mark");
    if (checkMark) {
      post.removeChild(checkMark);
    }
  };

  // Handle post deselection
  if (isSelected) {
    // Deselecting the post
    post.style.backgroundColor = "";

    const defaultSvg = `
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'
          xmlns='http://www.w3.org/2000/svg'>
          <path d='M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z'
            stroke='#637477' stroke-linecap='round' stroke-linejoin='round'/>
          <path d='M5.5 8H10.5'
            stroke='#637477' stroke-linecap='round' stroke-linejoin='round'/>
          <path d='M8 5.5V10.5'
            stroke='#637477' stroke-linecap='round' stroke-linejoin='round'/>
        </svg>
      `;

    const encoded = encodeURIComponent(defaultSvg)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");
    const url = `url("data:image/svg+xml,${encoded}")`;

    post.style.setProperty("--after-icon", url);
    // post.style.borderColor = " rgb(212, 212, 212)";
    // removeCheckMark();

    // Remove text from the temporary divs based on content

    if (
      post.parentElement?.id === "bodySelfWritten" ||
      post.parentElement?.id === "allPosts"
    ) {
      const summaryContent = post.querySelector(".summary")?.innerText;
      const detailsContent = post.querySelector(".detailsll")?.innerText;

      let combinedContent = ""; // Initialize combined content string

      if (summaryContent) {
        combinedContent += `${summaryContent}.`;
      }
      if (detailsContent) {
        combinedContent += `Details: ${detailsContent}.`;
      }

      // Only proceed if there is combined content
      if (combinedContent) {
        const constructedText = constructSentence(
          combinedContent,
          "self",
          "",
          uniqueId
        );

        const trimmedContent = normalizeText(constructedText);
        // Find matching div
        const existingDiv = [...summarySelfDiv.children].find((line) => {
          const lineClone = line.cloneNode(true);
          const cancelBtn = lineClone.querySelector(".content-cancel-button");
          if (cancelBtn) cancelBtn.remove(); // Remove 'x' before comparing
          const lineText = normalizeText(lineClone.innerText);
          return (
            lineText.substring(0, 100) === trimmedContent.substring(0, 100)
          );
        });

        if (existingDiv) {
          summarySelfDiv.removeChild(existingDiv);

          // Also remove from summaryOfselfWrittenContent
          const clonedDiv = [...summaryOfselfWrittenContent.children].find(
            (clone) => {
              const cloneClone = clone.cloneNode(true);
              const cancelBtn = cloneClone.querySelector(
                ".content-cancel-button"
              );
              if (cancelBtn) cancelBtn.remove();
              return normalizeText(cloneClone.innerText) === trimmedContent;
            }
          );

          if (clonedDiv) {
            summaryOfselfWrittenContent.removeChild(clonedDiv);
          }
        }
      }
    }
    if (
      post.parentElement?.id === "bodyEngagedContent" ||
      post.parentElement?.id === "commentsPosts"
    ) {
      const summaryContent = post.querySelector(".summary")?.innerText;
      const detailsContent = post.querySelector(".detailsll")?.innerText;

      let combinedContent = ""; // Initialize combined content string

      if (summaryContent) {
        combinedContent += `${summaryContent}. `;
      }

      if (detailsContent) {
        combinedContent += `Details: ${detailsContent}. `;
      }
      // Only proceed if there is combined content
      if (combinedContent) {
        const constructedText = constructSentence(
          combinedContent,
          "engage",
          "",
          uniqueId
        );
        const trimmedContent = constructedText.trim().replace(/x$/, "").trim();
        // Check if the combined content already exists and remove it
        const existingDiv = [...summarySelfDiv.children].find((line) => {
          // Exclude cancel button text from the comparison
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim().replace(/x$/, "").trim())
            .join(" ");
          return (
            lineContent.substring(0, 100) === trimmedContent.substring(0, 100)
          );
        });
        if (existingDiv) {
          summarySelfDiv.removeChild(existingDiv);
        }
      }
    }

    if (post.classList.contains("personal-attribute")) {
      const personalAttributeText = removeCheckMarkWhileADD(post);
      let type = "";
      let constructedText = "";
      if (post.querySelector(".pop-like")) {
        type = "like";
      } else if (post.querySelector(".pop-dislike")) {
        type = "dislike";
      } else if (post.querySelector(".pop-interest")) {
        type = "interest";
      }
      // Extract the dynamic text content, excluding the child elements with pop-* classes
      let filteredText = Array.from(post.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent.trim())
        .join(" ")
        .replace(/Like|Dislike|Interest/i, "");
      filteredText = filteredText.trim();
      if (filteredText || personalAttributeText) {
        if (type === "like" || type === "dislike" || type === "interest") {
          constructedText = constructSentence(filteredText, type, "", uniqueId);
        } else {
          constructedText = constructSentence(
            personalAttributeText,
            "personal",
            "",
            uniqueId
          );
        }

        [...summarySelfDiv.children].forEach((line) => {
          // Extract text content excluding the cancel button ('x')
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim()) // Trim text
            .join(" ") // Combine text nodes
            .replace(/x$/, "") // Remove trailing 'x'
            .trim(); // Final trim

          if (lineContent === constructedText) {
            summarySelfDiv.removeChild(line);
          }
        });
      }
    }
    if (post.querySelector(".jobtitle")) {
      const jobTitle = removeCheckMarkWhileADD(post);
      if (jobTitle) {
        const constructedText = constructSentence(
          jobTitle,
          "job",
          "",
          uniqueId
        );

        // Remove matching child elements from the summary div
        [...summarySelfDiv.children].forEach((line) => {
          // Extract text content excluding the cancel button ('x')
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim()) // Trim text
            .join(" ") // Combine text nodes
            .replace(/x$/, "") // Remove trailing 'x'
            .trim(); // Final trim

          if (lineContent === constructedText) {
            summarySelfDiv.removeChild(line);
          }
        });
      }
    } else if (post.querySelector(".cnewsnamell")) {
      const summaryContent = post.querySelector(".cnewsnamell")?.innerText;
      const detailsContent = post.querySelector(
        ".cnewsDescriptionll"
      )?.innerText;

      let combinedContent = ""; // Initialize combined content string

      if (summaryContent) {
        combinedContent += `Opportunity: ${summaryContent}. `;
      }

      if (detailsContent) {
        combinedContent += `Details: ${detailsContent}. `;
      }

      // Only proceed if there is combined content
      if (combinedContent) {
        const trimmedContent = combinedContent.trim().replace(/x$/, "").trim();

        // Check if the combined content already exists and remove it
        const existingDiv = [...summarySelfDiv.children].find((line) => {
          // Exclude cancel button text from the comparison
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim().replace(/x$/, "").trim())
            .join(" ");
          return lineContent === trimmedContent;
        });
        if (existingDiv) {
          summarySelfDiv.removeChild(existingDiv);
        }
      }
    }

    if (post.classList.contains("funding-points")) {
      const verticalsText = removeCheckMarkWhileADD(post);
      if (verticalsText) {
        const constructedText = constructSentence(
          verticalsText,
          "funding",
          "",
          uniqueId
        );

        [...summarySelfDiv.children].forEach((line) => {
          // Extract text content excluding the cancel button ('x')
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim()) // Trim text
            .join(" ") // Combine text nodes
            .replace(/x$/, "") // Remove trailing 'x'
            .trim(); // Final trim

          if (lineContent === constructedText) {
            summarySelfDiv.removeChild(line);
          }
        });
      }
    }

    if (
      post.classList.contains("btltitlell") ||
      post.classList.contains("atltitlell")
    ) {
      let ATLBTLText;
      //for atl I want to read the inner text of h3 tag only
      if (post.classList.contains("atltitlell")) {
        ATLBTLText = post?.querySelector("h3")?.innerText || "";
      } else {
        ATLBTLText = removeCheckMarkWhileADD(post);
      }
      if (ATLBTLText) {
        let constructedText = "";

        if (post.classList.contains("btltitlell")) {
          constructedText = constructSentence(ATLBTLText, "btl", "", uniqueId);
        }
        if (post.classList.contains("atltitlell")) {
          constructedText = constructSentence(ATLBTLText, "atl", "", uniqueId);
        }
        [...summarySelfDiv.children].forEach((line) => {
          // Extract text content excluding the cancel button ('x')
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim()) // Trim text
            .join(" ") // Combine text nodes
            .replace(/x$/, "") // Remove trailing 'x'
            .trim(); // Final trim

          if (
            lineContent.substring(0, 100) === constructedText.substring(0, 100)
          ) {
            summarySelfDiv.removeChild(line);
          }
        });
      }
    }

    if (post.classList.contains("market-sub-ll")) {
      const marketText = post.querySelector(".segmentll")
        ? post.querySelector(".segmentll").innerText
        : "";
      const tagText = post.querySelector(".primarytagll")
        ? post.querySelector(".primarytagll").innerText
        : post.querySelector(".secondarytagll")
        ? post.querySelector(".secondarytagll").innerText
        : "";
      if (marketText) {
        // Construct the formatted text using the helper function
        const constructedText = constructSentence(
          marketText,
          "market",
          tagText,
          uniqueId
        );

        [...summarySelfDiv.children].forEach((line) => {
          // Extract text content excluding the cancel button ('x')
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim())
            .join(" ")
            .replace(/x$/, "")
            .trim();

          if (lineContent === constructedText) {
            summarySelfDiv.removeChild(line);
          }
        });
      }
    }

    if (post.classList.contains("vertical-listll")) {
      const verticalsText = removeCheckMarkWhileADD(post);
      if (verticalsText) {
        const constructedText = constructSentence(
          verticalsText,
          "vertical",
          "",
          uniqueId
        );

        [...summarySelfDiv.children].forEach((line) => {
          // Extract text content excluding the cancel button ('x')
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim()) // Trim text
            .join(" ") // Combine text nodes
            .replace(/x$/, "") // Remove trailing 'x'
            .trim(); // Final trim

          if (lineContent === constructedText) {
            summarySelfDiv.removeChild(line);
          }
        });
      }
    }

    if (post.classList.contains("ccompanyll")) {
      const competitorName = post.querySelector(".ccompanynamell").innerText;
      const competitorDescription = post.querySelector(
        ".ccompanyDescriptionll"
      ).innerText;

      if (competitorName) {
        // Construct the sentence using the helper function
        const constructedText = constructSentence(
          competitorName,
          "competitor",
          competitorDescription,
          uniqueId
        );

        // Remove the corresponding div from the summary
        [...summarySelfDiv.children].forEach((line) => {
          // Extract text content excluding the cancel button ('x')
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim()) // Trim text
            .join(" ") // Combine text nodes
            .replace(/x$/, "") // Remove trailing 'x'
            .trim(); // Final trim

          if (lineContent === constructedText) {
            summarySelfDiv.removeChild(line);
          }
        });
      }
    }

    if (post.classList.contains("category-sub-techstackll")) {
      const techText = removeCheckMarkWhileADD(post);
      if (techText) {
        const companyName = document.getElementById("companyNameLL").innerText;

        // Construct the sentence dynamically
        const constructedText = constructSentence(
          techText,
          "tech",
          "",
          uniqueId
        );

        [...summarySelfDiv.children].forEach((line) => {
          // Extract text content excluding the cancel button ('x')
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim()) // Trim text
            .join(" ") // Combine text nodes
            .replace(/x$/, "") // Remove trailing 'x'
            .trim(); // Final trim

          if (lineContent === constructedText) {
            summarySelfDiv.removeChild(line);
          }
        });
      }
    }

    if (post.classList.contains("text-container")) {
      const techText = removeCheckMarkWhileADD(post);
      if (techText) {
        const constructedText = constructSentence(
          techText,
          "website",
          "",
          uniqueId
        );

        [...summarySelfDiv.children].forEach((line) => {
          // Extract text content excluding the cancel button ('x')
          const lineContent = Array.from(line.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim())
            .join("")
            .replace(/x$/, "")
            .trim();

          // Compare the cleaned line content with constructedText
          if (lineContent === constructedText) {
            summarySelfDiv.removeChild(line);
          }
        });
      }
    }

    if (post.classList.contains("company-overview")) {
      const techText = removeCheckMarkWhileADD(post);
      if (techText) {
        [...summarySelfDiv.children].forEach((line) => {
          // Extract text content excluding the cancel button ('x')
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim()) // Trim text
            .join(" ") // Combine text nodes
            .replace(/x$/, "") // Remove trailing 'x'
            .trim(); // Final trim

          if (lineContent === `Company Overview: ${techText}`) {
            summarySelfDiv.removeChild(line);
          }
        });
      }
    }
    if (post.classList.contains("company-post")) {
      const summaryContent = post.querySelector(".summary")?.innerText;
      const detailsContent = post.querySelector(".detailsll")?.innerText;

      let combinedContent = ""; // Initialize combined content string

      if (summaryContent) {
        combinedContent += `${summaryContent}. `;
      }

      if (detailsContent) {
        combinedContent += `Excerpt: ${detailsContent}. `;
      }

      if (combinedContent) {
        const trimmedContent = combinedContent;
        const constructedText = constructSentence(
          trimmedContent,
          "companypost",
          "",
          uniqueId
        );
        const existingDiv = [...summarySelfDiv.children].find((line) => {
          // Extract text content excluding the cancel button ('x')
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim()) // Trim text
            .join(" ") // Combine text nodes
            .replace(/x$/, "") // Remove trailing 'x'
            .trim(); // Final trim

          return (
            lineContent.substring(0, 100) === constructedText.substring(0, 100)
          );
        });

        if (existingDiv) {
          summarySelfDiv.removeChild(existingDiv);
        }
      }
    }

    if (post.classList.contains("question-container")) {
      const summaryContent = post.querySelector(
        ".updated-question-ll"
      )?.innerText;
      const detailsContent = post.querySelector(".answer-ll")?.innerText;

      let combinedContent = ""; // Initialize combined content string

      if (summaryContent) {
        combinedContent += `${summaryContent}. `;
      }
      if (detailsContent) {
        combinedContent += `Answer: ${detailsContent}. `;
      }
      // Only proceed if there is combined content
      if (combinedContent) {
        const trimmedContent = combinedContent.trim();

        // Check if the combined content already exists and remove it
        const existingDiv = [...summarySelfDiv.children].find((line) => {
          // Extract text content excluding the span with "x"
          const lineContent = Array.from(line.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE) // Include only text nodes
            .map((node) => node.textContent.trim()) // Trim the text
            .join("") // Combine into a single string
            .replace(/x$/, "") // Remove trailing 'x'
            .trim();

          return lineContent === trimmedContent;
        });

        // If an existing div is found, remove it
        if (existingDiv) {
          summarySelfDiv.removeChild(existingDiv);
        }
      }
    }
    if (post.classList.contains("experiancell")) {
      const companyName = post.querySelector("p")?.innerText?.trim();
      const role = post.querySelector(".fw-600")?.innerText?.trim();
      const durationText = post.querySelectorAll("p")[2]?.innerText?.trim();

      if (companyName && role) {
        const type = durationText.includes("Present")
          ? "present"
          : "experience";

        const constructedText = constructSentence(
          companyName,
          type,
          role,
          uniqueId
        );

        // Loop through summary div children to remove matching
        [...summarySelfDiv.children].forEach((line) => {
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim())
            .join(" ")
            .replace(/x$/, "")
            .trim();

          if (lineContent === constructedText) {
            summarySelfDiv.removeChild(line);
          }
        });
      }
    }
    if (post.classList.contains("resp-box-ll")) {
      const responsibilityText = post.innerText.trim();

      if (responsibilityText) {
        const constructedText = constructSentence(
          responsibilityText,
          "responsibility",
          "",
          uniqueId
        );

        // Loop through and remove matching entry
        [...summarySelfDiv.children].forEach((line) => {
          const lineContent = [...line.childNodes]
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim())
            .join(" ")
            .replace(/x$/, "")
            .trim();

          if (lineContent === constructedText) {
            summarySelfDiv.removeChild(line);
          }
        });
      }
    }
  } else {
    // Selecting the post
    post.style.backgroundColor = "rgb(240, 240, 240)";
    // post.style.borderColor = " rgb(97, 190, 82)";
    const clickedSvg = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 0.5C5.71442 0.5 4.45772 0.881218 3.3888 1.59545C2.31988 2.30968 1.48676 3.32484 0.994786 4.51256C0.502816 5.70028 0.374095 7.00721 0.624899 8.26809C0.875703 9.52896 1.49477 10.6872 2.40381 11.5962C3.31285 12.5052 4.47104 13.1243 5.73192 13.3751C6.99279 13.6259 8.29973 13.4972 9.48744 13.0052C10.6752 12.5132 11.6903 11.6801 12.4046 10.6112C13.1188 9.54229 13.5 8.28558 13.5 7C13.4979 5.27675 12.8123 3.6247 11.5938 2.40618C10.3753 1.18766 8.72325 0.50215 7 0.5ZM9.5 7.5H7.5V9.5C7.5 9.63261 7.44732 9.75979 7.35356 9.85355C7.25979 9.94732 7.13261 10 7 10C6.86739 10 6.74022 9.94732 6.64645 9.85355C6.55268 9.75979 6.5 9.63261 6.5 9.5V7.5H4.5C4.36739 7.5 4.24022 7.44732 4.14645 7.35355C4.05268 7.25979 4 7.13261 4 7C4 6.86739 4.05268 6.74021 4.14645 6.64645C4.24022 6.55268 4.36739 6.5 4.5 6.5H6.5V4.5C6.5 4.36739 6.55268 4.24021 6.64645 4.14645C6.74022 4.05268 6.86739 4 7 4C7.13261 4 7.25979 4.05268 7.35356 4.14645C7.44732 4.24021 7.5 4.36739 7.5 4.5V6.5H9.5C9.63261 6.5 9.75979 6.55268 9.85356 6.64645C9.94732 6.74021 10 6.86739 10 7C10 7.13261 9.94732 7.25979 9.85356 7.35355C9.75979 7.44732 9.63261 7.5 9.5 7.5Z" fill="#4C9BC6"/>
</svg>

    `;

    const encodedSvg = encodeURIComponent(clickedSvg)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");

    const svgUrl = `url("data:image/svg+xml,${encodedSvg}")`;

    // Set the new icon as the CSS variable
    post.style.setProperty("--after-icon", svgUrl);
    // createCheckMark();

    if (post.querySelector(".jobtitle")) {
      const jobTitle = removeCheckMarkWhileADD(post);
      if (jobTitle) {
        const constructedText = constructSentence(
          jobTitle,
          "job",
          "",
          uniqueId
        );

        // Create a new line element for the summary div
        const jobLine = document.createElement("div");
        jobLine.textContent = constructedText;
        jobLine.classList.add("postll", "draggable");
        jobLine.setAttribute("draggable", "true");
        // Append to the summary div

        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(jobLine, post)
        );
        jobLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(jobLine);
      }
    } else if (post.querySelector(".cnewsnamell")) {
      const summaryContent = post.querySelector(".cnewsnamell")?.innerText;
      const detailsContent = post.querySelector(
        ".cnewsDescriptionll"
      )?.innerText; // Get detailsll content

      let combinedContent = ""; // Initialize combined content string

      // Combine the contents of summary and details if they exist
      if (summaryContent) {
        combinedContent += `Opportunity: ${summaryContent}. `;
      }
      if (detailsContent) {
        combinedContent += `Details: ${detailsContent}. `;
      }

      // Only proceed if there is combined content
      if (combinedContent) {
        // Check for an existing div and remove it if found
        [...summarySelfDiv.children].forEach((line) => {
          if (line.textContent === combinedContent.trim()) {
            summarySelfDiv.removeChild(line);
          }
        });

        // Create and append the single combined div
        const combinedDiv = document.createElement("div");
        combinedDiv.textContent = combinedContent.trim();
        combinedDiv.classList.add("postll", "draggable");
        combinedDiv.setAttribute("draggable", "true");

        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(combinedDiv, post)
        );
        combinedDiv.appendChild(cancelButton);
        summarySelfDiv.appendChild(combinedDiv);
      }
    }

    if (post.classList.contains("funding-points")) {
      // Extract and concatenate the text content of the filtered nodes
      const verticalsText = removeCheckMarkWhileADD(post);
      if (verticalsText) {
        const constructedText = constructSentence(
          verticalsText,
          "funding",
          "",
          uniqueId
        );

        const attributeLine = document.createElement("div");
        attributeLine.textContent = constructedText;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");

        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );
        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }
    // Add summary details for selected post

    if (
      post.parentElement?.id === "bodySelfWritten" ||
      post.parentElement?.id === "allPosts"
    ) {
      const summaryContent = post.querySelector(".summary")?.innerText;
      const detailsContent = post.querySelector(".detailsll")?.innerText;

      let combinedContent = ""; // Initialize combined content string

      if (summaryContent) {
        combinedContent += `${summaryContent}.`;
      }
      if (detailsContent) {
        combinedContent += `Details: ${detailsContent}.`;
      }

      if (combinedContent) {
        const constructedText = constructSentence(
          combinedContent,
          "self",
          "",
          uniqueId
        );

        const attributeLine = document.createElement("div");
        attributeLine.textContent = constructedText;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");

        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );
        attributeLine.appendChild(cancelButton);

        // Append to summarySelfDiv
        summarySelfDiv.appendChild(attributeLine);

        // Clone and append to summaryOfselfWrittenContent
        const clonedDiv = attributeLine.cloneNode(true);
        summaryOfselfWrittenContent.appendChild(clonedDiv);
      }
    }

    if (
      post.parentElement?.id === "bodyEngagedContent" ||
      post.parentElement?.id === "commentsPosts"
    ) {
      const summaryEngage = post.querySelector(".summary")?.innerText;
      const detailsEngage = post.querySelector(".detailsll")?.innerText;

      let combinedEngageContent = ""; // Initialize combined content string

      // Add `summary` content if it exists
      if (summaryEngage) {
        combinedEngageContent += `${summaryEngage}. `;
      }

      // Add `detailsll` content if it exists
      if (detailsEngage) {
        combinedEngageContent += `Details: ${detailsEngage}. `;
      }
      if (combinedEngageContent) {
        const constructedText = constructSentence(
          combinedEngageContent,
          "engage",
          "",
          uniqueId
        );

        const attributeLine = document.createElement("div");
        attributeLine.textContent = constructedText;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");

        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );
        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }

    if (post.classList.contains("personal-attribute")) {
      const personalAttributeText = removeCheckMarkWhileADD(post);

      // Determine the type based on the child class
      let type = "";
      let constructedText = "";
      if (post.querySelector(".pop-like")) {
        type = "like";
      } else if (post.querySelector(".pop-dislike")) {
        type = "dislike";
      } else if (post.querySelector(".pop-interest")) {
        type = "interest";
      }
      // Extract the dynamic text content, excluding the child elements with pop-* classes
      let filteredText = Array.from(post.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent.trim())
        .join(" ")
        .replace(/Like|Dislike|Interest/i, "");
      filteredText = filteredText.trim();

      if (filteredText || personalAttributeText) {
        if (type === "like" || type === "dislike" || type === "interest") {
          constructedText = constructSentence(filteredText, type, "", uniqueId);
        } else {
          constructedText = constructSentence(
            personalAttributeText,
            "personal",
            "",
            uniqueId
          );
        }

        const attributeLine = document.createElement("div");
        attributeLine.textContent = constructedText;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");
        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );
        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }
    if (
      post.classList.contains("btltitlell") ||
      post.classList.contains("atltitlell")
    ) {
      let ATLBTLText;
      //for atl I want to read the inner text of h3 tag only
      if (post.classList.contains("atltitlell")) {
        ATLBTLText = post?.querySelector("h3")?.innerText || "";
      } else {
        ATLBTLText = removeCheckMarkWhileADD(post);
      }
      if (ATLBTLText) {
        let constructedText = "";

        // Determine the type and construct the sentence accordingly
        if (post.classList.contains("btltitlell")) {
          constructedText = constructSentence(ATLBTLText, "btl", "", uniqueId);
        }
        if (post.classList.contains("atltitlell")) {
          constructedText = constructSentence(ATLBTLText, "atl", "", uniqueId);
        }

        // Create and append a new div for the summary
        const attributeLine = document.createElement("div");
        attributeLine.textContent = constructedText;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");
        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );
        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }

    if (post.classList.contains("market-sub-ll")) {
      // Get all child elements except the 'check-mark'
      const marketText = post.querySelector(".segmentll")
        ? post.querySelector(".segmentll").innerText
        : "";
      const tagText = post.querySelector(".primarytagll")
        ? post.querySelector(".primarytagll").innerText
        : post.querySelector(".secondarytagll")
        ? post.querySelector(".secondarytagll").innerText
        : "";
      if (marketText) {
        // Use constructSentence to format the text
        const constructedText = constructSentence(
          marketText,
          "market",
          tagText,
          uniqueId
        );

        // Create and append a new div for the summary
        const attributeLine = document.createElement("div");
        attributeLine.textContent = constructedText;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");
        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );
        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }

    if (post.classList.contains("vertical-listll")) {
      // Extract and concatenate the text content of the filtered nodes
      const verticalsText = removeCheckMarkWhileADD(post);
      if (verticalsText) {
        const constructedText = constructSentence(
          verticalsText,
          "vertical",
          "",
          uniqueId
        );

        const attributeLine = document.createElement("div");
        attributeLine.textContent = constructedText;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");
        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );
        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }

    if (post.classList.contains("ccompanyll")) {
      const competitorName = post.querySelector(".ccompanynamell").innerText;
      const competitorDescription = post.querySelector(
        ".ccompanyDescriptionll"
      ).innerText;

      if (competitorName) {
        // Construct the sentence using the helper function
        const constructedText = constructSentence(
          competitorName,
          "competitor",
          competitorDescription,
          uniqueId
        );

        // Create and append a new div for the summary
        const attributeLine = document.createElement("div");
        attributeLine.textContent = constructedText;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");
        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );
        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }

    if (post.classList.contains("category-sub-techstackll")) {
      const techText = removeCheckMarkWhileADD(post);
      if (techText) {
        // Construct the sentence dynamically
        const constructedText = constructSentence(
          techText,
          "tech",
          "",
          uniqueId
        );
        // Create and append the attribute line
        const attributeLine = document.createElement("div");
        attributeLine.textContent = constructedText;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");
        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );
        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }

    if (post.classList.contains("text-container")) {
      const techText = removeCheckMarkWhileADD(post);
      if (techText) {
        // Construct the sentence using the helper function
        const constructedText = constructSentence(
          techText,
          "website",
          "",
          uniqueId
        );

        // Create and append a new div for the summary
        const attributeLine = document.createElement("div");
        attributeLine.textContent = constructedText;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");
        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );
        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }

    if (post.classList.contains("company-overview")) {
      const techText = removeCheckMarkWhileADD(post);
      if (techText) {
        const attributeLine = document.createElement("div");
        attributeLine.textContent = `Company Overview: ${techText}`;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");
        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );
        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }

    if (post.classList.contains("company-post")) {
      const summaryEngage = post.querySelector(".summary")?.innerText;
      const detailsEngage = post.querySelector(".detailsll")?.innerText;

      let combinedEngageContent = ""; // Initialize combined content string

      // Add `summary` content if it exists
      if (summaryEngage) {
        combinedEngageContent += `${summaryEngage}. `;
      }

      // Add `detailsll` content if it exists
      if (detailsEngage) {
        combinedEngageContent += `Excerpt: ${detailsEngage}. `;
      }
      if (combinedEngageContent) {
        // Check for an existing div and remove it if found
        [...summarySelfDiv.children].forEach((line) => {
          if (line.textContent === combinedEngageContent.trim()) {
            summarySelfDiv.removeChild(line);
          }
        });
        const constructedText = constructSentence(
          combinedEngageContent,
          "companypost",
          "",
          uniqueId
        );
        // Create and append the single combined div
        const combinedDiv = document.createElement("div");
        combinedDiv.textContent = constructedText.trim();
        combinedDiv.classList.add("postll", "draggable");
        combinedDiv.setAttribute("draggable", "true");
        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(combinedDiv, post)
        );
        combinedDiv.appendChild(cancelButton);
        summarySelfDiv.appendChild(combinedDiv);
      }
    }
    if (post.classList.contains("question-container")) {
      const summaryContent = post.querySelector(
        ".updated-question-ll"
      )?.innerText;
      const detailsContent = post.querySelector(".answer-ll")?.innerText;

      let combinedContent = ""; // Initialize combined content string

      // Combine the contents of summary and details if they exist
      if (summaryContent) {
        combinedContent += `${summaryContent}. `;
      }
      if (detailsContent) {
        combinedContent += `Answer: ${detailsContent}. `;
      }

      // Only proceed if there is combined content
      if (combinedContent) {
        const attributeLine = document.createElement("div");
        attributeLine.textContent = combinedContent;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");
        // Create a cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );
        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }
    if (post.classList.contains("experiancell")) {
      const companyName = post.querySelector("p")?.innerText?.trim();
      const role = post.querySelector(".fw-600")?.innerText?.trim();
      const durationText = post.querySelectorAll("p")[2]?.innerText?.trim();

      if (companyName && role) {
        const type = durationText.includes("Present")
          ? "present"
          : "experience";

        const constructedText = constructSentence(
          companyName,
          type,
          role,
          uniqueId
        );

        // Create and append new summary div
        const attributeLine = document.createElement("div");
        attributeLine.textContent = constructedText;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");

        // Cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");

        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );

        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }
    if (post.classList.contains("resp-box-ll")) {
      const responsibilityText = post.innerText.trim();

      if (responsibilityText) {
        const constructedText = constructSentence(
          responsibilityText,
          "responsibility",
          "", // no role for responsibility
          uniqueId
        );

        // Create summary div
        const attributeLine = document.createElement("div");
        attributeLine.textContent = constructedText;
        attributeLine.classList.add("postll", "draggable");
        attributeLine.setAttribute("draggable", "true");

        // Cancel button
        const cancelButton = document.createElement("span");
        cancelButton.textContent = "x";
        cancelButton.classList.add("content-cancel-button");
        cancelButton.addEventListener("click", () =>
          handleCancel(attributeLine, post)
        );

        attributeLine.appendChild(cancelButton);
        summarySelfDiv.appendChild(attributeLine);
      }
    }
  }
}
async function getAllSignalSettings() {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/api/get/getallsignalsetting",
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
    return responseData?.body;
  }
}
async function toggleDisplayBasedOnStatus(uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  if (uniqueContainer) {
    const companyAboutContainer =
      uniqueContainer.querySelector("#companyAboutLL");
    let responseData = await getAllSignalSettings();
    responseData.forEach((section) => {
      section.list.forEach((item) => {
        if (item.contentIdName) {
          const element = uniqueContainer.querySelector(
            `#${item.contentIdName}`
          );

          if (element) {
            // Set display status for the element
            if (
              item.contentIdName === "profileLikes" ||
              item.contentIdName === "profileDislikes" ||
              item.contentIdName === "profileInterestedTopics"
            ) {
              element.style.display = item.displayStatus ? "flex" : "none";
            } else if (item.contentIdName === "companyNewsLL") {
              element.style.display = item.displayStatus
                ? "inline-block"
                : "none";
            } else {
              element.style.display = item.displayStatus ? "block" : "none";
            }

            // Find the closest parent div and toggle its display status
            const parentDiv = element.parentElement;
            if (parentDiv) {
              if (item.type === "Message Co-pilot") {
                return;
              } else {
                parentDiv.style.display = item.displayStatus ? "block" : "none";
              }
            }
          }
        }

        if (item.contentClassName) {
          const className = item.contentClassName.trim();

          // Ensuring elements are scoped inside `companyAboutLL`
          const elements = companyAboutContainer
            ? companyAboutContainer.querySelectorAll(`.${className}`)
            : [];

          if (elements.length > 0) {
            // Found inside #companyAboutLL → apply displayStatus
            elements.forEach((el) => {
              el.style.display = item.displayStatus ? "block" : "none";
            });
          } else {
            // Not found inside → hide globally
            const outsideElements = uniqueContainer.querySelectorAll(
              `.${className}`
            );
            outsideElements.forEach((el) => {
              el.style.display = item.displayStatus ? "block" : "none";
            });
          }
        }
      });
    });
  }
}

async function displayGeneratedContent(responseData, messageType, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  if (!responseData) return;
  if (messageType !== "deep") {
    await typeEmail("generateContentResult", responseData, "5", uniqueId);
  } else {
    const targetElement = uniqueContainer.querySelector(
      "#generateContentResultVtwo"
    );
    if (!targetElement) return;
    if (!responseData.body || !responseData.body.length) return;

    const accordionContainers = targetElement.querySelectorAll(".accordion-ll");

    responseData.body.forEach(async (item, index) => {
      if (index >= accordionContainers.length) return;

      const accordionContainer = accordionContainers[index];
      accordionContainer.innerHTML = "";

      let accordionItem = document.createElement("div");
      accordionItem.classList.add("accordion-item");

      let header = document.createElement("div");
      header.classList.add("accordion-header");

      let loadingIcon = document.createElement("div");
      // loadingIcon.classList.add("loading-icon-ll");
      if (index === 0) {
        loadingIcon.innerHTML = ` <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_107_15)">
              <path
                d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                stroke="#0d4e60"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 12.5C11.7259 12.5 13.125 11.1009 13.125 9.375C13.125 7.64911 11.7259 6.25 10 6.25C8.27411 6.25 6.875 7.64911 6.875 9.375C6.875 11.1009 8.27411 12.5 10 12.5Z"
                stroke="#0d4e60"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.98438 15.5758C5.45462 14.6495 6.17216 13.8716 7.05745 13.3282C7.94275 12.7848 8.96123 12.4972 10 12.4972C11.0388 12.4972 12.0572 12.7848 12.9425 13.3282C13.8278 13.8716 14.5454 14.6495 15.0156 15.5758"
                stroke="#0d4e60"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_107_15">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>`;
      } else if (index === 1) {
        loadingIcon.innerHTML = ` <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_consulting)">
          <path
            d="M4 3H14C14.5523 3 15 3.44772 15 4V16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3Z"
            stroke="#0d4e60"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 7H12"
            stroke="#0d4e60"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 10H12"
            stroke="#0d4e60"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 13H9"
            stroke="#0d4e60"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14 5L16 3L17 4L15 6L14 5Z"
            stroke="#0d4e60"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_consulting">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>`;
      } else {
        loadingIcon.innerHTML = `<svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_messaging)">
          <path
            d="M16 3H4C3.44772 3 3 3.44772 3 4V13C3 13.5523 3.44772 14 4 14H7L10 17L13 14H16C16.5523 14 17 13.5523 17 13V4C17 3.44772 16.5523 3 16 3Z"
            stroke="#0d4e60"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 7H14"
            stroke="#0d4e60"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 10H11"
            stroke="#0d4e60"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_messaging">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>`;
      }

      let titleSpan = document.createElement("span");

      if (!item.data.trim()) {
        // Check if the previous index has a valid `data`
        if (index > 0 && responseData.body[index - 1].data.trim()) {
          titleSpan.innerHTML = item.title; // Use `item.title` if the previous item has data
        } else if (index === 0) {
          titleSpan.innerHTML = "<p>Analyzing selected signals</p>";
        } else if (index === 1) {
          titleSpan.innerHTML = "<p>Improving original message</p>";
        } else {
          titleSpan.innerHTML = "<p>Adjusting message based on personality</p>";
        }
      } else {
        titleSpan.innerHTML = item.title; // If data exists, show item.title
      }

      header.appendChild(loadingIcon);
      header.appendChild(titleSpan);

      let body = document.createElement("div");
      body.classList.add("accordion-content");

      if (!item.data.trim()) {
        // Data is empty, show loader
        loadingIcon.style.display = "block";
        body.innerHTML = "<div class='loading-text'>Fetching content...</div>";
      } else {
        let contentHTML = "";
        try {
          if (index >= 1) {
            let cleanData = item.data.replace(/\n/g, "").trim();
            let parsedData = JSON.parse(cleanData);
            //here for 3rd accordian i want to show only suggestion not message
            if (index === 1) {
              contentHTML += parsedData.message || "";
            } else if (index == 2) {
              contentHTML += "";
            }

            if (parsedData.suggestions) {
              let suggestionsHTML =
                "<div class='suggestions'><strong>Suggestions:</strong><ul>";
              parsedData.suggestions.forEach((suggestion) => {
                suggestionsHTML += `<li class='suggestions'> ${suggestion.suggestion} <br><em class='suggestions'>Example:</em> ${suggestion.example}</li>`;
              });
              suggestionsHTML += "</ul></div>";
              contentHTML += suggestionsHTML;
            }
          } else {
            contentHTML = item.data;
          }
        } catch (error) {
          contentHTML = item.data;
        }
        let fullHTML =
          '<div class="collapsedll-posts" style="height: 100px; overflow: hidden;">' +
          contentHTML +
          "</div>" +
          '<div class="view-more" style="cursor: pointer; color: gray;">See more...</div>';
        let parser = new DOMParser();
        let parsedHTML = parser.parseFromString(fullHTML, "text/html");
        let elements = Array.from(parsedHTML.body.childNodes);

        // Open the current accordion before typing
        await activateAccordion(header, body);

        for (const child of elements) {
          if (
            child.nodeType === Node.TEXT_NODE &&
            child.textContent.trim() !== ""
          ) {
            let span = document.createElement("span");
            span.textContent = child.textContent.trim();
            body.appendChild(span);
            await typeEffect(span, child.textContent, 30);
          } else {
            body.appendChild(child);
          }
        }

        // If it's the last accordion, close all
        if (index === responseData.body.length - 1) {
          setTimeout(() => {
            document
              .querySelectorAll(".accordion-header")
              .forEach((headerEl) => {
                headerEl.classList.remove("active");
                headerEl.nextElementSibling.style.maxHeight = null;
              });
          }, 500); // Delay for better UX
        }
      }

      accordionItem.appendChild(header);
      accordionItem.appendChild(body);
      accordionContainer.appendChild(accordionItem);
      accordianLogic(uniqueId, responseData?.body);
    });

    setTimeout(() => initializeAccordion(), 100);
  }

  highlightBoldText();
}

//this code mainly for make opacity 1 if previes accordian get the data, and change the before for the p tag in header,
function accordianLogic(uniqueId, data) {
  const container = document.getElementById(uniqueId);
  const accordions = container.querySelectorAll(".accordion-ll");

  data.forEach((item, index) => {
    const accordion = accordions[index];
    if (!accordion) return;

    const accordionHeader = accordion.querySelector(".accordion-header span");
    if (!accordionHeader) return;

    const pTags = accordionHeader.querySelectorAll("p");
    if (pTags.length < 2) return; // Ensure at least two <p> tags exist

    // Handle accordion opacity first
    if (item.data && item.data.trim() !== "") {
      // If data is available, make this accordion visible
      accordion.style.opacity = "1";

      // Make next accordion visible too if it exists
      if (index + 1 < accordions.length) {
        accordions[index + 1].style.opacity = "1";
      }
    } else if (
      index > 0 &&
      data[index - 1].data &&
      data[index - 1].data.trim() !== ""
    ) {
      // If previous accordion has data, make this one visible
      accordion.style.opacity = "1";
    }

    // Now handle styling of p tags based on data availability
    if (item.data && item.data.trim() !== "") {
      // Data is available - make ALL non-first <p> tags show dots without animation
      pTags.forEach((p, i) => {
        if (i === 0) return; // Skip first p tag

        // Completely reset the styling for this p tag
        resetPTagStyling(p, uniqueId, 1, i + 1);
        resetPTagStyling(p, uniqueId, index + 1, i + 1);
      });
    } else {
      // No data available - make last <p> show loader, others show dots
      pTags.forEach((p, i) => {
        if (i === 0) return; // Skip first p tag

        if (i === pTags.length - 1) {
          // Last p tag - keep the default loader animation
          // Remove any custom styling that might interfere with the loader
          const existingStyle = document.querySelector(
            `.p-style-${uniqueId}-${index + 1}-${i + 1}`
          );
          if (existingStyle) {
            existingStyle.remove();
          }
        } else {
          // Non-last p tags - make them dots without animation
          resetPTagStyling(p, uniqueId, 1, i + 1);
          resetPTagStyling(p, uniqueId, index + 1, i + 1);
        }
      });
    }
  });
}

// Helper function to completely reset and restyle a p tag
function resetPTagStyling(p, uniqueId, accordionIndex, pIndex) {
  // Remove any existing style element
  const existingStyle = document.querySelector(
    `.p-style-${uniqueId}-${accordionIndex}-${pIndex}`
  );
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create new style with dot and explicitly override any existing styles
  const style = document.createElement("style");
  style.className = `p-style-${uniqueId}-${accordionIndex}-${pIndex}`;
  style.textContent = `
    #${uniqueId} .accordion-ll:nth-child(${accordionIndex}) .accordion-header span p:nth-child(${pIndex})::before {
      content: "✓" !important;
      display: inline-block !important;
      width: 12px !important;
      height: 12px !important;
      animation: none !important;
      border: none !important;
      border-radius: 0 !important;
      border-top: none !important;
      margin-right: 5px !important;
      margin-top: -15px !important;
      vertical-align: middle !important;
      background-color: transparent !important;
    }
  `;
  document.head.appendChild(style);
}

async function typeEffect(element, text, speed) {
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i]; // Append one character at a time
    await new Promise((resolve) => setTimeout(resolve, speed));
  }
}

function typeEmail(containerId, content, speed = 5, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  return new Promise((resolve) => {
    // Get the main container
    const mainContainer = uniqueContainer.querySelector(`#${containerId}`);
    if (!mainContainer) {
      console.error(`Element with ID "${containerId}" not found.`);
      resolve();
      return;
    }

    // Create a temporary div to hold the full structure
    const tempDiv = document.createElement("div");

    // Index to track our position in the content
    let index = 0;
    let currentHTML = "";

    // Function to type the next character
    function typeNextChar() {
      if (index < content.length) {
        // Add the next character to our current HTML
        currentHTML += content[index];
        index++;

        // Update the container with the full structure
        tempDiv.innerHTML = currentHTML;
        mainContainer.innerHTML = tempDiv.innerHTML;

        // Schedule the next character
        setTimeout(typeNextChar, speed);
      } else {
        resolve();
      }
    }

    // Start typing
    typeNextChar();
  });
}

async function activateAccordion(header, body) {
  // Close all other accordions
  document.querySelectorAll(".accordion-header").forEach((headerEl) => {
    headerEl.classList.remove("active");
    headerEl.nextElementSibling.style.maxHeight = null;
  });
  document.querySelectorAll(".accordion-content").forEach((headerEl) => {
    headerEl.classList.remove("active");
    headerEl.style.maxHeight = "0px";
  });

  // Open the current accordion
  header.classList.add("active");
  body.classList.add("active");
  body.style.maxHeight = "auto";
}

function initializeAccordion() {
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      header.classList.toggle("active");
      const content = header.nextElementSibling;
      content.classList.toggle("active");

      // Smooth transition using max-height
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}
async function loadGenerateContentHistory(uniqueId, url) {
  const uniqueContainer = document.getElementById(uniqueId);
  // Loader
  fetch(chrome.runtime.getURL("pages/loader.html"))
    .then((r) => r.text())
    .then((html) => {
      const generatedContentListing = uniqueContainer.querySelector(
        "#generated-content-listing-ll"
      );
      if (generatedContentListing) {
        generatedContentListing.innerHTML = html;
      }
    });

  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/email-generator-list",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        search_value: "",
        page_limit: 1,
        linkdinProfileURL: url,
      }),
    }
  );

  const responseData = await response.json();

  if (responseData) {
    const selectElement = uniqueContainer.querySelector(
      "#generated-content-listing-ll"
    );
    selectElement.innerHTML = "";
    const savedElement = uniqueContainer.querySelector(
      "#generated-saved-content-listing-ll"
    );
    savedElement.innerHTML = "";

    if (responseData.savedMessages.length > 0) {
      uniqueContainer.querySelector("#savedMessage").style.display = "block";
    } else {
      uniqueContainer.querySelector("#savedMessage").style.display = "none";
    }
    if (responseData.unsavedMessages.length > 0) {
      uniqueContainer.querySelector("#unsavedMessage").style.display = "block";
    } else {
      uniqueContainer.querySelector("#unsavedMessage").style.display = "none";
    }
    if (
      responseData.unsavedMessages.length === 0 &&
      responseData.savedMessages.length === 0
    ) {
      const profileNameElement = uniqueContainer.querySelector(
        "#profileNameGenerateContent"
      );

      const profileName = profileNameElement
        ? profileNameElement.innerText
        : "this user";
      const firstName = profileName.split(" ")[0];
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
        `<h4>No messages created for ${firstName}</h4>` +
        "<p>Get started by createing a new message thread.</p>" +
        "</div>";
      selectElement.appendChild(emptyArray);
    } else {
      if (selectElement) {
        responseData.savedMessages.forEach((emailBody) => {
          contentgenerationdisplay(
            emailBody,
            true,
            responseData?.followUpArray,
            responseData?.followUptwoArray,
            savedElement
          );
        });
        responseData.unsavedMessages.forEach((emailBody) => {
          contentgenerationdisplay(
            emailBody,
            true,
            responseData?.followUpArray,
            responseData?.followUptwoArray,
            selectElement
          );
        });

        // For combining divs and adding label
        combineConsecutiveMellDivsAndAddLabels();

        var pageLimit = 1;

        // Calling function for load more
        const loadMoreBtn = uniqueContainer.querySelector(
          "#load_more_btn_content"
        );
        if (loadMoreBtn) {
          //as loadGenerateContentHistory is calling multiple time multiple click event is taking place
          //so I removed the previes event and assign the click event
          loadMoreBtn.replaceWith(loadMoreBtn.cloneNode(true));
          const newLoadMoreBtn = uniqueContainer.querySelector(
            "#load_more_btn_content"
          );
          newLoadMoreBtn.addEventListener("click", function (e) {
            e.preventDefault();
            pageLimit = pageLimit + 1;
            getShowLoadMoreContent(pageLimit, uniqueId, url)
              .then((data) => {
                // Call function for drawing UI
                paintUIForContent(data, "loadmore", uniqueId);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          });
        }

        const searchInput = uniqueContainer.querySelector(
          "#search-input-content"
        );

        if (searchInput) {
          // Remove all existing event listeners
          searchInput.replaceWith(searchInput.cloneNode(true));

          // Select the newly cloned element
          const newSearchInput = uniqueContainer.querySelector(
            "#search-input-content"
          );

          newSearchInput.addEventListener("input", function (event) {
            event.preventDefault();
            searchContent(event.target.value, url)
              .then((data) => {
                const loadMoreContent =
                  uniqueContainer.querySelector("#load_more_content");

                if (event.target.value === "" || event.target.value === null) {
                  if (loadMoreContent) {
                    loadMoreContent.style.display = "block";
                  }
                  pageLimit = 1;
                } else {
                  if (loadMoreContent) {
                    loadMoreContent.style.display = "none";
                  }
                }

                // Call function for drawing UI
                paintUIForContent(data, "search", uniqueId);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          });
        }
      }
    }
    highlightBoldText();
  }
}
async function getShowLoadMoreContent(str, uniqueId, url) {
  const uniqueContainer = document.getElementById(uniqueId);
  const searchValue = uniqueContainer.querySelector("#search-input-content");
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/email-generator-list",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        search_value: searchValue.value,
        page_limit: str,
        linkdinProfileURL: url,
      }),
    }
  );
  const responseData = await response.json();
  return responseData;
}
function paintUIForContent(data, type, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  const contentList = uniqueContainer.querySelector(
    "#generated-content-listing-ll"
  );
  const savedElement = uniqueContainer.querySelector(
    "#generated-saved-content-listing-ll"
  );
  if (type !== "loadmore") {
    contentList.innerHTML = "";
    savedElement.innerHTML = "";
  }

  const selectElement = uniqueContainer.querySelector(
    "#generated-content-listing-ll"
  );
  if (data?.savedMessages.length > 0) {
    uniqueContainer.querySelector("#savedMessage").style.display = "block";
  } else {
    uniqueContainer.querySelector("#savedMessage").style.display = "none";
  }
  if (data?.unsavedMessages.length > 0) {
    uniqueContainer.querySelector("#unsavedMessage").style.display = "block";
  } else {
    uniqueContainer.querySelector("#unsavedMessage").style.display = "none";
  }

  data?.savedMessages.forEach((emailBody) => {
    contentgenerationdisplay(
      emailBody,
      true,
      data?.followUpArray,
      data?.followUptwoArray,
      savedElement
    );
  });
  data?.unsavedMessages.forEach((emailBody) => {
    contentgenerationdisplay(
      emailBody,
      true,
      data?.followUpArray,
      data?.followUptwoArray,
      selectElement
    );
  });

  // combine divs to show as one
  combineConsecutiveMellDivsAndAddLabels();

  highlightBoldText();
}

// search function
async function searchContent(str, url) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/email-generator-list",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        search_value: str,
        page_limit: 1,
        linkdinProfileURL: url,
      }),
    }
  );
  const responseData = await response.json();
  return Promise.resolve(responseData);
}
//on edit in the generATED content If i do edit the this logic help to change the count and time
document.addEventListener("input", function (event) {
  if (event.target.classList.contains("editable-content-ll")) {
    updateReadingTime(event.target);
    addSaveIcon(event.target);
  }
});

function updateReadingTime(editableElement) {
  // Get word count from the editable div
  const words = editableElement.innerText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  // Calculate reading time (assuming 4 words per second)
  const readingTime = Math.floor(words / 4);

  // Find the nearest reading-time-span inside the same container
  const container =
    editableElement.closest(".accordion-content") ||
    editableElement.parentElement;
  const readingTimeSpan = container?.querySelector(".reading-time-span");

  if (readingTimeSpan) {
    readingTimeSpan.innerText = `Reading Time: ${readingTime} sec Words: ${words}`;
  }
}

function addSaveIcon(editableElement) {
  // Find the nearest .copy-icon-ll
  const container =
    editableElement.closest(".accordion-content") ||
    editableElement.parentElement;
  const copyIconContainer = container?.querySelector(".copy-icon-container-ll");
  const ptag = container?.querySelector(".ptag-save");
  ptag.style.display = "block";

  if (copyIconContainer && !copyIconContainer.querySelector(".save-icon-ll")) {
    // Create the save icon button
    const saveIcon = document.createElement("div");
    saveIcon.className = "save-icon-ll";
    saveIcon.title = "Save changes";
    saveIcon.style =
      "cursor: pointer; margin-left: 8px; color: gray; display: flex; align-items: center;";

    // Create the SVG icon for the save button
    saveIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
    `;

    // Append save icon next to copy icon
    // copyIconContainer.appendChild(saveIcon);
    copyIconContainer.prepend(saveIcon);
    // Add event listener for save action
    saveIcon.addEventListener("click", function () {
      handleSaveAction(editableElement, saveIcon, ptag);
    });
  }
}
function handleSaveAction(editableElement, saveIcon, ptag) {
  // Find the nearest .contentIdll
  const container =
    editableElement.closest(".accordion-content") ||
    editableElement.parentElement;
  const contentIdElement = container?.querySelector(".contentIdll");

  // Get contentIdll innerText
  const contentId = contentIdElement
    ? contentIdElement.innerText.trim()
    : "N/A";

  // Get editable-content-ll innerHTML
  let contentHTML = editableElement.innerHTML.trim();

  // Remove all <span> tags while keeping text content
  contentHTML = contentHTML.replace(/<\/?span[^>]*>/g, "");

  // Wrap contentHTML in a div with the class 'generatedEmailLL'
  contentHTML = `<div class="generatedEmailLL">${contentHTML}</div>`;

  sendToServer(contentId, contentHTML, saveIcon, ptag);
}

async function sendToServer(contentId, content, saveIcon, ptag) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);

  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/update-generated-email-byid",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        editedemail: content,
        id: contentId,
      }),
    }
  );

  const responseData = await response.json();

  if (responseData) {
    const copiedMessage = document.createElement("span");
    copiedMessage.classList.add("copied-message");
    copiedMessage.textContent = "Saved.";

    // Apply styles for visibility
    copiedMessage.style.cssText = `
   
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      top: -25px;
      right: 0;
      opacity: 1;
      transition: opacity 0.3s ease-in-out;
    `;

    // Append the message AFTER saveIcon (for better visibility)
    saveIcon.parentElement.appendChild(copiedMessage);

    // Remove message after 2 seconds
    setTimeout(() => {
      copiedMessage.style.opacity = "0";
      setTimeout(() => copiedMessage.remove(), 300);
    }, 2000);

    // Remove save icon AFTER the message disappears
    setTimeout(() => {
      saveIcon.remove();
      ptag.style.display = "none";
    }, 2500);
  }
}

function highlightBoldText() {
  const emailDivs = document.querySelectorAll(".generatedEmailLL");
  if (!emailDivs.length) return;

  emailDivs.forEach((emailDiv) => {
    let htmlContent = emailDiv.innerHTML;

    // Replace text between ** with a span wrapping it
    htmlContent = htmlContent.replace(
      /\*\*(.*?)\*\*/g,
      '<span class="highlight">$1</span>'
    );

    emailDiv.innerHTML = htmlContent;
  });
}
function dragLeadlabsIcon(container, iconid) {
  const floatContainer = document.getElementById(container);
  const dragIcon = document.getElementById(iconid);

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let viewportHeight = window.innerHeight;

  dragIcon.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = floatContainer.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    floatContainer.style.transition = "none";
    floatContainer.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const newLeft = e.clientX - offsetX;
      const newTop = e.clientY - offsetY;

      floatContainer.style.left = `${newLeft}px`;
      floatContainer.style.top = `${newTop}px`;
      floatContainer.style.right = "auto";
      floatContainer.style.bottom = "auto";
    }
  });

  document.addEventListener("mouseup", (e) => {
    if (isDragging) {
      isDragging = false;
      floatContainer.style.transition = "all 0.3s ease";
      floatContainer.style.cursor = "grab";

      // Calculate the bottom position dynamically
      const rect = floatContainer.getBoundingClientRect();
      const newBottom = viewportHeight - rect.bottom; // Calculate distance from bottom of viewport

      // Snap back to the rightmost position
      floatContainer.style.right = "0";
      floatContainer.style.bottom = `${newBottom}px`;
      floatContainer.style.left = "auto";
      floatContainer.style.top = "auto";
    }
  });

  // Update viewport height on resize
  window.addEventListener("resize", () => {
    viewportHeight = window.innerHeight;
  });
}

function getAllSelectedSignal(uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  const dragAreaDiv = uniqueContainer.querySelector(".drag-area");

  const selectedsignal = [...dragAreaDiv.children]
    .filter((child) => window.getComputedStyle(child).display !== "none") // Only consider visible divs
    .map((child, index) => {
      const signal = `Signal ${index + 1}`; // Generate signal for each visible div

      // Get the content of the div, excluding the "x" in the span tag
      let content = [...child.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent.trim())
        .join(" ")
        .replace(/\s*×\s*$/, "");

      // Fix "likes:" to "likes"
      content = content.replace(/\blike:s\b/, "likes");

      // Add contextual data
      if (content.includes("likes")) {
        content +=
          " (Use the signal as an analogy and tie it to the problem statement)";
      } else if (content.includes("dislikes")) {
        content +=
          " (Use the signal as an analogy and tie it to the problem statement)";
      } else if (content.includes("interested in")) {
        content +=
          "(Use the signal as an analogy and tie it to the problem statement)";
      }

      if (content.includes("posted this on LinkedIn :")) {
        content = content.replace(
          /(posted this on LinkedIn)/,
          `$1 (This is posted from the company account and not the personal account)`
        );
        content = `${content}`;
      }

      return `${signal}: ${content}`;
    })
    .join("\n");

  return selectedsignal;
}

async function createCustomeMessage(data, type, channel, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  const loaderHTML = await fetch(
    chrome.runtime.getURL("pages/loader.html")
  ).then((r) => r.text());

  const deepLoaderHTML = await fetch(
    chrome.runtime.getURL("pages/deeploader.html")
  ).then((r) => r.text());

  if (data && data.framework && data.framework.trim().endsWith("(V2)")) {
    uniqueContainer.querySelector("#generateContentResult").style.display =
      "none";
    uniqueContainer.querySelector("#generateContentResultVtwo").style.display =
      "block";
    uniqueContainer.querySelector("#generateContentResultVtwo").innerHTML =
      deepLoaderHTML;

    const companyName =
      uniqueContainer.querySelector("#companyNameLL").innerText;
    const profileName = uniqueContainer.querySelector(
      "#profileNameGenerateContent"
    ).innerText;

    if (companyName && profileName && companyName != "") {
      uniqueContainer.querySelector("#titleDescLoader").innerText =
        "Analyzing selected signals for " + profileName + " and " + companyName;
    }
  } else {
    uniqueContainer.querySelector("#generateContentResult").innerHTML =
      loaderHTML;
    uniqueContainer.querySelector("#generateContentResultVtwo").style.display =
      "none";
  }

  /*uniqueContainer.querySelector("#emailCreationDetails").scrollBy(0, 400);*/
  uniqueContainer.querySelector("#emailCreationDetails").scrollTop =
    uniqueContainer.querySelector("#emailCreationDetails").scrollHeight;

  let { userToken } = await chrome.storage.local.get(["userToken"]);
  let api;
  if (channel === "Cold Call") {
    api = "https://betabackext-beta.leadlabs.app/email-generator";
  } else {
    api = "https://betabackext-beta.leadlabs.app/email-generator-new";
  }
  const response = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + userToken,
    },
    body: JSON.stringify({
      data,
    }),
  });

  let responseData = await response.json();

  if (responseData) {
    uniqueContainer.querySelector("#generate-btn-ll").disabled = false;
    if (
      responseData.status === "Inprogress" &&
      responseData.body.length > 0 &&
      responseData.body[0].messagetype === "deep"
    ) {
      uniqueContainer.querySelector("#generateContentResult").style.display =
        "none";
      uniqueContainer.querySelector("#generateContentResult").innerHTML = "";
      uniqueContainer.querySelector(
        "#generateContentResultVtwo"
      ).style.display = "block";
      await displayGeneratedContent(responseData, "deep", uniqueId);
      pollForStatus(
        responseData.body[0].id,
        userToken,
        uniqueId,
        responseData?.body[0].timestamp
      ); // Start polling with correct ID
    } else {
      uniqueContainer.querySelector(
        "#generateContentResultVtwo"
      ).style.display = "none";
      uniqueContainer.querySelector("#generateContentResult").style.display =
        "block";
      if (
        responseData.body.length > 0 &&
        responseData.body[0].type !== "Cold Call"
      ) {
        await displayGeneratedContent(responseData?.body[0].data, "", uniqueId);
        addActionButtonsToContent(responseData.body[0].id, uniqueId);
      } else {
        uniqueContainer.querySelector("#generateContentResult").innerHTML =
          responseData?.body[0].data;
        combineConsecutiveMellDivsAndAddLabels();
      }
    }
  }
}
async function pollForStatus(id, userToken, uniqueId, postTime) {
  const uniqueContainer = document.getElementById(uniqueId);
  try {
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/get-generated-email-byid",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({ emailgeneratedid: id }),
      }
    );

    const result = await response.json();

    await displayGeneratedContent(result, "deep", uniqueId);

    const utcDate = new Date(postTime);
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    const istTime = new Date(utcDate.getTime() + istOffset);
    // Get current time in IST
    const currentUtcTime = new Date();
    const currentIstTime = new Date(currentUtcTime.getTime() + istOffset);
    // Calculate time difference in seconds
    const timeDifference = (currentIstTime - istTime) / 1000;

    if (result.status === "Inprogress" && timeDifference < 60) {
      // Wait 3 seconds before polling again
      setTimeout(() => pollForStatus(id, userToken, uniqueId, postTime), 3000);
    } else if (result.status === "completed") {
      let cleanData = result?.body[2].data;
      let parsedData = JSON.parse(cleanData);
      let message = parsedData.message;
      uniqueContainer.querySelector("#generateContentResult").style.display =
        "block";

      await displayGeneratedContent(message, "", uniqueId);

      if (result.body.length > 0 && result.body[2].type !== "Cold Call") {
        addActionButtonsToContent(result.body[2].id, uniqueId);
      } else {
        combineConsecutiveMellDivsAndAddLabels();
      }
    }
  } catch (error) {
    console.error("Error polling status:", error);
  }
}

//this is the same code for float and linkedin to get the persona
//load persona for the option using the unique ID
async function loadAllParsonas(uniqueId) {
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
    // Locate the unique container with uniqueId
    const uniqueContainer = document.getElementById(uniqueId);
    const selectElementTalk = uniqueContainer.querySelector(
      "#persona-listing-name-talking-ll"
    );
    // Find the target element within the uniqueContainer where the select element will be placed
    const selectElementContainer = uniqueContainer.querySelector(
      "#persona-listing-name-ll"
    );

    // Clear any previous options if needed
    selectElementContainer.innerHTML = "";
    selectElementTalk.innerHTML = "";
    // Populate the select element with options from responseData
    responseData.body.forEach((persona) => {
      // Create option for selectElement
      const option1 = document.createElement("option");
      option1.value = persona.id;
      option1.textContent = `${persona.persona_name} / ${persona.industry} / ${persona.company_name}`;

      // Create option for selectElementTalk
      const option2 = option1.cloneNode(true); // Clone the first option

      selectElementContainer.appendChild(option1);
      selectElementTalk.appendChild(option2);
    });
  }
}
//common code for linkedin and float icom by using the unique ID
async function loadCompanyDetails(uniqueId) {
  // Display a loading spinner
  fetch(chrome.runtime.getURL("pages/loader.html"))
    .then((r) => r.text())
    .then((html) => {
      document
        .getElementById(uniqueId)
        .querySelector("#companyDetailsBlockLoader").innerHTML = html;
    });

  // Get user token from local storage
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  let linkedInURL = getLinkedInURL();

  // Fetch company details from the API
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/linkedin-company-profile-get-all",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        linkdinUrl:
          document.getElementById(uniqueId).querySelector("#linkedinUrl")
            .innerText !== ""
            ? document.getElementById(uniqueId).querySelector("#linkedinUrl")
                .innerText
            : linkedInURL,
      }),
    }
  );

  const responseData = await response.json();
  toggleDisplayBasedOnStatus(uniqueId);
  // Check if the response has valid data and call the function to add data to div and send respoanse and uniqueId in parameter
  addCompanyDataToDiv(responseData, uniqueId);
}
function addCompanyDataToDiv(responseData, uniqueId) {
  if (
    responseData &&
    responseData.body &&
    responseData.body[0] &&
    responseData.body[0].linkedIncompanyredriecturl != ""
  ) {
    // Hide the loader and display the company details block
    document
      .getElementById(uniqueId)
      .querySelector("#companyDetailsBlockLoader").style.display = "none";
    document
      .getElementById(uniqueId)
      .querySelector("#companyBlockDetailsLL").style.display = "block";

    // Update company logo, followers, and other details
    document
      .getElementById(uniqueId)
      .querySelector(
        "#companyDetailsImgLL"
      ).innerHTML = `<img src="${responseData.body[0].linkedIncompanyimage}" alt="Company Logo" style="border-radius: 5px; margin-right: 10px;">`;
    document
      .getElementById(uniqueId)
      .querySelector("#companyFollowersLL").innerText =
      responseData.body[0].linkedIncompanysubdesc?.[0]?.followers || "";
    document
      .getElementById(uniqueId)
      .querySelector("#companyNameLL").innerText =
      responseData.body[0].linkedIncompanyname;
    document
      .getElementById(uniqueId)
      .querySelector("#companyDescriptionLL").innerText =
      responseData.body[0].linkedIncompanydesc;
    document.getElementById(uniqueId).querySelector("#companyURLll").innerText =
      responseData.body[0].linkedIncompanyUrl;

    // document
    //   .getElementById(uniqueId)
    //   .querySelector("#companyFundingLL").innerHTML =
    //   responseData.body[1].fundingData;
    const modifiedHtml = addClassToChildDiv(
      responseData.body[1].fundingData,
      "postll funding-points"
    );
    document
      .getElementById(uniqueId)
      .querySelector("#companyFundingLL").innerHTML = modifiedHtml;

    let data = addClassToChildDiv(
      responseData.body[1].data,
      "postll company-overview"
    );
    document
      .getElementById(uniqueId)
      .querySelector("#companyAboutLL").innerHTML = data;
    let AboutMarketingLL = addClassToChildDiv(
      responseData.body[1].market_details,
      "postll"
    );
    document
      .getElementById(uniqueId)
      .querySelector("#companyAboutMarketingLL").innerHTML = AboutMarketingLL;

    // Handle company posts and jobs
    if (
      responseData.body[2].data &&
      responseData.body[2].data !== "<div>Not enough data</div>"
    ) {
      let modifiedData = responseData.body[2].data.replaceAll(
        "<div>Not enough data</div>",
        ""
      );
      let data = addClassToMainDiv(modifiedData, "company-post");
      document
        .getElementById(uniqueId)
        .querySelector("#companyPostsLL").innerHTML =
        '<div class="collapsedll-posts">' +
        (modifiedData
          ? data
          : "<div class='noDataFound'> No company posts data found</div>") +
        "</div>" +
        '<div id="toggleTextll-posts">See more...</div>';

      document
        .getElementById(uniqueId)
        .querySelector("#toggleTextll-posts")
        .addEventListener("click", function () {
          let postContainer = document
            .getElementById(uniqueId)
            .querySelector(".collapsedll-posts");

          if (postContainer.style.height === "auto") {
            postContainer.style.height = "100px";
            this.innerText = "See more...";
          } else {
            postContainer.style.height = "auto";
            this.innerText = "See less";
          }
        });
    } else {
      document
        .getElementById(uniqueId)
        .querySelector("#companyPostsLL").innerHTML =
        "<div class='noDataFound'> No company posts data found</div>";
    }
    if (
      responseData.body[3].data &&
      responseData?.body[3].data !== "<div>No job details found</div>"
    ) {
      let data = addClassToChildDiv(responseData.body[3].data, "postll");
      document
        .getElementById(uniqueId)
        .querySelector("#companyJobsLL").innerHTML =
        '<div class="collapsedll-job">' +
        (responseData.body[3].data
          ? data
          : "<div class='noDataFound'> No job data found</div>") +
        "</div>" +
        '<div id="toggleTextll-job">See more...</div>';

      document
        .getElementById(uniqueId)
        .querySelector("#toggleTextll-job")
        .addEventListener("click", function () {
          let jobContainer = document
            .getElementById(uniqueId)
            .querySelector(".collapsedll-job");

          if (jobContainer.style.height === "auto") {
            jobContainer.style.height = "100px";
            this.innerText = "See more...";
          } else {
            jobContainer.style.height = "auto";
            this.innerText = "See less";
          }
        });
    } else {
      document
        .getElementById(uniqueId)
        .querySelector("#companyJobsLL").innerHTML =
        "<div class='noDataFound'> No job data found</div>";
    }

    // Handle company people and tech stack
    document
      .getElementById(uniqueId)
      .querySelector("#companyPeopleLL").innerHTML =
      responseData.body[4].data ||
      "<div class='noDataFound'> No people data found</div>";

    const container = document
      .getElementById(uniqueId)
      .querySelector("#companyTechStackLL");
    container.innerHTML = "";
    isProfileUpdateWithinTwoMinutes(
      uniqueId,
      responseData?.profileupdatedtime,
      responseData.body[1].data,
      responseData.body[5].categories,
      responseData.body[6].h1,
      responseData.body[3].data,
      responseData.body[1].market_details
    );
    // Populate the tech stack categories and subcategories
    if (
      responseData.body[5].categories &&
      responseData.body[5].categories.length > 0
    ) {
      responseData.body[5].categories.forEach((category) => {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category-techstackll";
        categoryDiv.innerText = category.categoryName;
        container.appendChild(categoryDiv);

        const subcategoryContainer = document.createElement("div");
        subcategoryContainer.className = "subcategory-techstackll";

        category.data.forEach((subcategory) => {
          const subcategoryDiv = document.createElement("div");
          subcategoryDiv.classList.add("category-sub-techstackll", "postll");
          subcategoryDiv.innerHTML = `<img src="${subcategory.subcategoryNameImage}" alt="${subcategory.subcategoryName}"> ${subcategory.subcategoryName}`;
          subcategoryContainer.appendChild(subcategoryDiv);
        });

        container.appendChild(subcategoryContainer);

        categoryDiv.addEventListener("click", () => {
          const isVisible = subcategoryContainer.style.display === "block";
          subcategoryContainer.style.display = isVisible ? "none" : "block";
        });
      });
    }

    // Handle competitors section
    if (
      responseData.body[7].data != "" &&
      responseData.body[7].data != undefined
    ) {
      // document
      //   .getElementById(uniqueId)
      //   .querySelector("#companyCompetitorsLL").innerHTML =
      //   responseData.body[7].data;

      const modifiedHTML = addClassToMainDiv(
        responseData.body[7].data,
        "postll"
      );
      document
        .getElementById(uniqueId)
        .querySelector("#companyCompetitorsLL").innerHTML = modifiedHTML;
    } else {
      document
        .getElementById(uniqueId)
        .querySelector("#companyCompetitorsWrapperLL").style.display = "none";
    }

    // Handle news, product updates, and revenue
    if (
      responseData.body[8].data1 != "" &&
      responseData.body[8].data1 != undefined
    ) {
      // document
      //   .getElementById(uniqueId)
      //   .querySelector("#companyNewsLL").innerHTML =
      //   responseData.body[8].data1.replaceAll("No data found", "");
      // document
      //   .getElementById(uniqueId)
      //   .querySelector("#companyProductUpdatesLL").innerHTML =
      //   responseData.body[8].data2.replaceAll("No data found", "");

      // document
      //   .getElementById(uniqueId)
      //   .querySelector("#companyRevenueLL").innerHTML =
      //   responseData.body[8].data4.replaceAll("No data found", "");
      // document
      //   .getElementById(uniqueId)
      //   .querySelector("#revenuegrowthLL").innerHTML =
      //   responseData.body[8].data5.replaceAll("No data found", "");
      // document
      //   .getElementById(uniqueId)
      //   .querySelector("#companyexpansionll").innerHTML =
      //   responseData.body[8].data6.replaceAll("No data found", "");
      const postClass = "postll";

      const companyNews = addClassToMainDiv(
        responseData.body[8].data1.replaceAll("No data found", ""),
        postClass
      );
      document
        .getElementById(uniqueId)
        .querySelector("#companyNewsLL").innerHTML = companyNews;

      const productUpdates = addClassToMainDiv(
        responseData.body[8].data2.replaceAll("No data found", ""),
        postClass
      );
      document
        .getElementById(uniqueId)
        .querySelector("#companyProductUpdatesLL").innerHTML = productUpdates;

      const companyRevenue = addClassToMainDiv(
        responseData.body[8].data4.replaceAll("No data found", ""),
        postClass
      );
      document
        .getElementById(uniqueId)
        .querySelector("#companyRevenueLL").innerHTML = companyRevenue;

      const revenueGrowth = addClassToMainDiv(
        responseData.body[8].data5.replaceAll("No data found", ""),
        postClass
      );
      document
        .getElementById(uniqueId)
        .querySelector("#revenuegrowthLL").innerHTML = revenueGrowth;

      const companyExpansion = addClassToMainDiv(
        responseData.body[8].data6.replaceAll("No data found", ""),
        postClass
      );
      document
        .getElementById(uniqueId)
        .querySelector("#companyexpansionll").innerHTML = companyExpansion;
    } else {
      document
        .getElementById(uniqueId)
        .querySelector("#companyNewsWrapperLL").style.display = "none";
    }
    cleanDefaultDivs("datetimell");

    // dummy data for Company Lines
    const contentDiv = document
      .getElementById(uniqueId)
      .querySelector("#companyLinesLL");
    contentDiv.innerHTML = "";
    const headings = ["h1", "h2", "h3", "h4", "h5", "h6"];

    headings.forEach((heading) => {
      responseData.body[6][heading].forEach((text) => {
        const div = document.createElement("div");
        div.classList.add("text-container", "postll");
        div.textContent = text;
        contentDiv.appendChild(div);
      });
    });
    // Additional logic for rendering charts, graphs, or posts as needed
    const peopleElements = document
      .getElementById(uniqueId)
      .querySelectorAll(".peoplell");

    const maxNumber = Math.max(
      ...Array.from(peopleElements).map((el) =>
        parseInt(el.querySelector(".peopleNumberll").innerText.replace(",", ""))
      )
    );

    peopleElements.forEach((el) => {
      const number = parseInt(
        el.querySelector(".peopleNumberll").innerText.replace(",", "")
      );
      const barInner = el.querySelector(".bar-inner");
      const widthPercentage = (number / maxNumber) * 100;
      barInner.style.width = widthPercentage + "%";

      // hiding places which are not country
      const location = el.querySelector(".peopleLocationll").textContent.trim();
      if (!countries.includes(location)) {
        el.style.display = "none";
      }
    });

    // for expansion for ATL and BTL
    const containersBtl = document.querySelectorAll(".btltitlell");

    containersBtl.forEach((container) => {
      let isExpanded = false;

      container.addEventListener("click", function () {
        const listItems = this.querySelectorAll("ul li:not(:first-child)");

        listItems.forEach((li) => {
          li.style.display = isExpanded ? "none" : "list-item";
        });

        isExpanded = !isExpanded;
      });
    });

    const containersAtl = document.querySelectorAll(".atltitlell");

    containersAtl.forEach((container) => {
      let isExpanded = false;

      container.addEventListener("click", function () {
        const listItems = this.querySelectorAll("ul li:not(:first-child)");

        listItems.forEach((li) => {
          li.style.display = isExpanded ? "none" : "list-item";
        });

        isExpanded = !isExpanded;
      });
    });

    // Clean default divs within scoped section
    cleanDefaultDivs(uniqueId, "companyPostsLL");

    // Update post date in all posts
    updateTimeAgoInAllPosts("companyPostsLL", responseData.profileupdatedtime);
  } else {
    // No company data found, display an empty state message
    document
      .getElementById(uniqueId)
      .querySelector("#companyDetailsBlockLoader").innerHTML =
      '<div style="margin-top: 125px;" class="empty-list-ll">' +
      '<svg class="empty-icon-ll" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M3 7h18v13H3z" fill="none"></path>' +
      '<path d="M5 4h4l3 3h9v13H5z"></path>' +
      "</svg>" +
      "<h4>No Company Account Data</h4>" +
      '<p>Click "Analyse Account" to get account details</p>' +
      "</div>";
  }
}
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("view-more")) {
    let collapsedPosts = event.target.previousElementSibling; // Target .collapsedll-posts

    if (
      collapsedPosts &&
      collapsedPosts.classList.contains("collapsedll-posts")
    ) {
      if (collapsedPosts.style.height === "auto") {
        collapsedPosts.style.height = "80px"; // Collapse back
        event.target.textContent = "See more...";
      } else {
        collapsedPosts.style.height = "auto"; // Expand
        event.target.textContent = "See less...";
      }
    }
  }
});

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("add-more-details-ll")) {
    let detailsDiv = event.target.nextElementSibling; // Target the next div

    if (detailsDiv) {
      if (detailsDiv.style.display === "block") {
        detailsDiv.style.display = "none";
      } else {
        detailsDiv.style.display = "block";
      }
    }
  }
});

/* for Hubspot update contact */

async function closeHubspotProfileList(uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  uniqueContainer.querySelector("#hubspotProfileList").style.display = "none";
  uniqueContainer.querySelector("#hubspotProfileListCloseBtn").style.display =
    "none";
  uniqueContainer.querySelector("#hubspotProfileList").innerHTML = "";
}

/* for Hubspot serach */
async function getSearchHubspot(linkdinUrl, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  uniqueContainer.querySelector("#hubspotProfileList").innerHTML =
    "<div class='loading-ll'></div>";
  uniqueContainer.querySelector("#hubspotProfileList").style.display = "block";
  uniqueContainer.querySelector("#hubspotProfileListCloseBtn").style.display =
    "block";
  uniqueContainer
    .querySelector("#hubspotProfileListCloseBtn")
    .addEventListener("click", () => {
      closeHubspotProfileList(uniqueId);
    });

  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/hubspot-search-contact",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        linkdinUrl: linkdinUrl,
      }),
    }
  );

  const responseData = await response.json();
  //console.log(responseData)
  const profileListSearch = uniqueContainer.querySelector(
    "#hubspotProfileList"
  );
  if (responseData.header === "success") {
    uniqueContainer.querySelector("#hubspotProfileList").innerHTML = "";
    if (responseData.hubspotIntergration === true) {
      for (i = 0; i < responseData.body.length; i++) {
        const profileSearch = document.createElement("div");
        profileSearch.innerHTML =
          '<div class="hubspotProfileCard">' +
            '<div style="display:grid;"> <span class="dotdotdot">' +
            responseData.body[i].properties.firstname +
            '</span><span style="font-size:12px; color:#999999">' +
            responseData.body[i].properties.email ||
          responseData.body[i].properties.company + "</span></div></div>";

        //imageGif.src = chrome.runtime.getURL("assets/nav/nav-gif.png"); // Set the image source
        profileListSearch.appendChild(profileSearch);
        const id = responseData.body[i].id;

        profileSearch.addEventListener("click", function () {
          // console.log(id);
          setUpdateHubspot(id, linkdinUrl, uniqueId);
        });
      }
      const createNewContact = document.createElement("div");
      createNewContact.innerHTML =
        '<div style="padding:5px; text-align:center;"><button type="button" style="padding: 3px 17px;border: 1px solid #E0E0FC;border-radius: 17px;color: #5B5BD6;background-color: #F3F3FF;font-size: 12px;font-weight: 600;" id="createHubspot">Create a new contact</button></div>';
      profileListSearch.appendChild(createNewContact);
    }
  } else if (responseData.header === "failure") {
    uniqueContainer.querySelector("#hubspotProfileList").innerHTML = "";
    const profileSearch = document.createElement("div");
    profileSearch.innerHTML =
      '<div class="hubspotProfileCard">' +
      '<div style="display:grid; margin-left: 10px;"> <span class="dotdotdot">' +
      responseData.error_msg +
      "</span></div></div>";

    //imageGif.src = chrome.runtime.getURL("assets/nav/nav-gif.png"); // Set the image source
    profileListSearch.appendChild(profileSearch);

    const createNewContact = document.createElement("div");
    createNewContact.innerHTML =
      '<div style="padding:5px; text-align:center;"><button type="button" style="padding: 3px 17px;border: 1px solid #E0E0FC;border-radius: 17px;color: #5B5BD6;background-color: #F3F3FF;font-size: 12px;font-weight: 600;" id="createHubspot">Create a new contact</button></div>';
    profileListSearch.appendChild(createNewContact);
  }

  uniqueContainer
    .querySelector("#createHubspot")
    .addEventListener("click", () => {
      setCreateHubspot(linkdinUrl, uniqueId);
    });
}
async function setUpdateHubspot(hubspotId, linkdinUrl, uniqueId) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/hubspot-create-contact",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        linkdinUrl: linkdinUrl,
        hubspotID: hubspotId,
      }),
    }
  );

  const responseData = await response.json();
  if (responseData) {
    showHubspotNotification(
      "Contact Created Successfully",
      "success",
      uniqueId
    );
  }
}

/* for Hubspot Create contact */
async function setCreateHubspot(linkdinUrl, uniqueId) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/hubspot-create-contact",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        linkdinUrl: linkdinUrl,
      }),
    }
  );

  const responseData = await response.json();
  if (responseData) {
    showHubspotNotification(
      "Contact Created Successfully",
      "success",
      uniqueId
    );
  }
}
function showHubspotNotification(text, color, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);

  const notification = uniqueContainer.querySelector(
    "#notification-hubspot-ll"
  );

  notification.innerText = text;
  if (color == "warning") {
    notification.style.backgroundColor = "#FFCC00";
    notification.style.color = "#222222";
  } else {
    notification.style.backgroundColor = "#28a745";
    notification.style.color = "#FFFFFF";
  }
  notification.style.display = "block";

  setTimeout(() => {
    notification.classList.add("notification-fade-out-ll");
  }, 1000);

  setTimeout(() => {
    notification.style.display = "none";
    notification.classList.remove("notification-fade-out-ll");
  }, 1500);
}
function normalizeText(text) {
  return text
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/x$/, "") // Remove trailing 'x' if any
    .trim();
}

function addClassToMainDiv(htmlString, classNameString) {
  const classNames = classNameString.split(" ").filter(Boolean); // Split string into class names
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${htmlString}</div>`, "text/html");
  const wrapper = doc.body.firstChild;

  // Add class only to direct child divs (top-level divs in htmlString)
  Array.from(wrapper.children).forEach((child) => {
    if (child.tagName === "DIV") {
      child.classList.add(...classNames);
    }
  });

  return wrapper.innerHTML;
}

function addClassToChildDiv(htmlString, classNameString) {
  const overviewClassNames = classNameString.split(" ").filter(Boolean);
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${htmlString}</div>`, "text/html");
  const wrapper = doc.body.firstElementChild;

  // 1. Add classes to children of .overviewll
  const overview = wrapper.querySelector(".overviewll");
  if (overview) {
    Array.from(overview.children).forEach((child) => {
      if (child.tagName === "DIV") {
        child.classList.add(...overviewClassNames);
      }
    });
  }

  // 2. Add class "postll" to .btltitlell and .atltitlell inside .profilesll
  const profileWrapper = wrapper.querySelector(".profilesll");
  if (profileWrapper) {
    profileWrapper
      .querySelectorAll(".btltitlell, .atltitlell")
      .forEach((el) => {
        el.classList.add("postll");
      });
  }

  // 3. Add class "postll" to .market-sub-ll and .vertical-listll inside .mvll
  const mvWrapper = wrapper.querySelector(".mvll");
  if (mvWrapper) {
    mvWrapper
      .querySelectorAll(".market-sub-ll, .vertical-listll")
      .forEach((el) => {
        el.classList.add("postll");
      });
  }

  // 4. Add class "postll" to each .jobll inside .alljobsll
  const allJobsWrapper = wrapper.querySelector(".alljobsll");
  if (allJobsWrapper) {
    allJobsWrapper.querySelectorAll(".jobll").forEach((job) => {
      job.classList.add("postll");
    });
  }
  const fundingWrapper = wrapper.querySelector(".fundingDatall");
  if (fundingWrapper) {
    const firstLi = fundingWrapper.querySelector("ul > li");
    if (firstLi) {
      firstLi.classList.add("postll", "funding-points");
    }
  }
  return wrapper.outerHTML;
}
function appendAttributesToContainer(dataString, containerId, label, unique) {
  const uniqueContainer = document.getElementById(unique);
  const container = uniqueContainer?.querySelector(`#${containerId}`);
  if (!container) return;

  // Optional: clear previous content
  container.innerHTML = "";

  const attributesArray = String(dataString || "")
    .split(",")
    .map((item) => item.trim());

  attributesArray.forEach((attribute) => {
    const newDiv = document.createElement("div");
    newDiv.className = "postll personal-attribute";
    newDiv.innerHTML = `
      <div class="pop-${label.toLowerCase()}">${label}</div>
      ${attribute}
    `;
    container.appendChild(newDiv);
  });
}

//making common function for the linkedin and other website for validateSignals and updateCount for signale selection

function validateSignals(uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  // Get the active channel's checkmark text
  const activeChannel = uniqueContainer.querySelector(
    ".channel-btn-ll.active .checkmark-ll"
  )?.textContent;

  if (!activeChannel) {
    console.error("No active channel found. Please select a channel.");
    return false;
  }

  // Extract the channel name from the active button
  const channelName = uniqueContainer
    .querySelector(".channel-btn-ll.active")
    ?.childNodes[0]?.textContent.trim();

  if (!channelName) {
    console.error("Unable to determine the channel name.");
    return false;
  }

  // Map channel names to their maximum allowed signals
  const signalLimits = {
    Email: 4,
    LinkedIn: 2,
    "Cold Call": 2,
  };

  // Calculate the total count of selected signals within the unique container
  const totalSignals = uniqueContainer.querySelectorAll(
    "#selected-signal > div"
  ).length;

  // Determine the maximum signals allowed for the active channel
  const maxSignals = signalLimits[channelName];
  let maxText;
  if (maxSignals === 4) {
    maxText = "Four";
  } else {
    maxText = "Two";
  }
  if (maxSignals !== undefined) {
    if (totalSignals >= maxSignals) {
      showNotificationSignal(
        `${maxText} or fewer signals are recommended for a ${channelName} touch point.`,
        "warning",
        uniqueId
      );
      return false; // Prevent further selections
    }
  } else {
    console.error(`No signal limit defined for the channel: '${channelName}'`);
  }

  return true; // Allow selection if within limits
}

async function updateCounts(uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  const insightDiv = uniqueContainer.querySelector(".drag-area");
  const checkMarkContent = document.querySelector(".checkmark-ll").textContent;
  if (!insightDiv) {
    console.error("Insight div not found within uniqueContainer.");
    return;
  }

  // Filter children based on display style being 'block'
  const visibleLines = [...insightDiv.children].filter(
    (child) => window.getComputedStyle(child).display === "block"
  );

  const count = visibleLines.length;
  const selectedCount = uniqueContainer.querySelector("#selectedCount");
  if (selectedCount) {
    selectedCount.innerText = `${count} signal selected `;
  }
  const signalButtonCount = uniqueContainer.querySelectorAll(".signal-count");

  if (signalButtonCount.length > 0) {
    signalButtonCount.forEach((el) => {
      if (count > 0) {
        el.textContent = `${count} Insight Selected`;
        if (el.parentElement) {
          //el.parentElement.style.display = "flex";
          el.parentElement.style.display = "none";
        }
      } else {
        if (el.parentElement) {
          el.parentElement.style.display = "none";
        }
      }
    });
  }

  if (count === 0) {
    showNotificationSignal(`Select one or more signals`, "warning", uniqueId);
    return;
  }

  const activeButton = uniqueContainer.querySelector(".channel-btn-ll.active");
  if (
    activeButton &&
    activeButton.textContent.replace(checkMarkContent, "").trim() !==
      "Cold Call"
  ) {
    try {
      // Fetch the framework data
      await getFrameWork(count, "signal", uniqueId);
    } catch (error) {
      console.error("Error fetching framework data:", error);
    }
  }
}

//here from the back end the experience is a json data so we are converting the data to array and
//using the map function display the experience
function addExperinceFunction(data, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  let experienceData;

  try {
    // Parse if data is a string
    if (typeof data === "string") {
      experienceData = JSON.parse(data);

      // Parse again if still a string (e.g., double stringified)
      if (typeof experienceData === "string") {
        experienceData = JSON.parse(experienceData);
      }
    } else {
      experienceData = data; // if already an object or array
    }

    // Ensure experienceData is an array
    if (Array.isArray(experienceData)) {
      // it's good
    } else if (typeof experienceData === "object" && experienceData !== null) {
      // wrap object into array
      experienceData = [experienceData];
    } else {
      experienceData = [];
    }
  } catch (error) {
    experienceData = [];
  }

  // Create HTML for experience section
  let experienceHTML = `<h6 class="h5ll"><svg class="icon-inline" width="13" height="13" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.3334 5.49719C17.2006 7.31109 17.3653 9.38197 16.7955 11.3101C16.2257 13.2383 14.9619 14.887 13.248 15.9382C11.5341 16.9893 9.49153 17.3684 7.51459 17.0021C5.53765 16.6358 3.76645 15.5503 2.54283 13.9549C1.31921 12.3595 0.729922 10.3675 0.888692 8.36315C1.04746 6.35884 1.94304 4.48439 3.40257 3.10156C4.8621 1.71873 6.78213 0.925559 8.79208 0.87512C10.802 0.824682 12.7594 1.52055 14.2865 2.82844L16.0576 1.05656C16.1749 0.939286 16.3339 0.873401 16.4998 0.873401C16.6656 0.873401 16.8247 0.939286 16.942 1.05656C17.0592 1.17384 17.1251 1.3329 17.1251 1.49875C17.1251 1.6646 17.0592 1.82366 16.942 1.94094L9.44195 9.44094C9.32468 9.55821 9.16562 9.6241 8.99976 9.6241C8.83391 9.6241 8.67485 9.55821 8.55758 9.44094C8.4403 9.32366 8.37442 9.1646 8.37442 8.99875C8.37442 8.8329 8.4403 8.67384 8.55758 8.55656L10.7232 6.39094C10.1363 6.00277 9.43555 5.82405 8.73443 5.88371C8.0333 5.94336 7.37283 6.23789 6.85993 6.71962C6.34703 7.20136 6.01172 7.84209 5.90829 8.53811C5.80486 9.23412 5.93936 9.94467 6.29001 10.5547C6.64066 11.1648 7.18695 11.6387 7.84043 11.8996C8.49391 12.1606 9.21634 12.1933 9.89076 11.9926C10.5652 11.7919 11.1521 11.3694 11.5566 10.7936C11.961 10.2178 12.1593 9.52236 12.1193 8.81984C12.1147 8.73777 12.1263 8.65558 12.1534 8.57799C12.1806 8.50039 12.2227 8.42891 12.2775 8.3676C12.3323 8.3063 12.3986 8.25639 12.4726 8.22072C12.5467 8.18504 12.6271 8.1643 12.7091 8.15969C12.8749 8.15036 13.0376 8.20727 13.1614 8.31788C13.2227 8.37266 13.2726 8.43897 13.3083 8.51303C13.3439 8.58709 13.3647 8.66745 13.3693 8.74953C13.4263 9.74389 13.1423 10.7279 12.5642 11.539C11.9862 12.3501 11.1487 12.9396 10.1901 13.2102C9.2316 13.4809 8.20944 13.4163 7.29257 13.0273C6.3757 12.6382 5.61902 11.948 5.14759 11.0706C4.67616 10.1933 4.5182 9.18134 4.69981 8.20205C4.88143 7.22276 5.39175 6.33475 6.14643 5.68479C6.90112 5.03482 7.85498 4.66182 8.85038 4.62743C9.84577 4.59303 10.8231 4.89931 11.6209 5.49562L13.3982 3.71828C12.0957 2.63687 10.4396 2.07481 8.74793 2.14006C7.05628 2.2053 5.44837 2.89325 4.23304 4.07177C3.0177 5.25029 2.28063 6.83628 2.16339 8.52512C2.04615 10.214 2.55702 11.8866 3.59786 13.2217C4.6387 14.5569 6.13613 15.4604 7.80254 15.7587C9.46895 16.0571 11.1868 15.7293 12.6263 14.8382C14.0657 13.9471 15.1252 12.5557 15.6012 10.931C16.0772 9.30643 15.9362 7.56323 15.2052 6.03625C15.1337 5.88665 15.1246 5.71478 15.1799 5.55845C15.2351 5.40212 15.3502 5.27414 15.4998 5.20265C15.6494 5.13117 15.8212 5.12204 15.9776 5.17728C16.1339 5.23251 16.2619 5.34759 16.3334 5.49719Z" fill="#525866"/>
</svg>
Experience</h6><div class='collapsedll'>`;

  experienceData.forEach((item) => {
    experienceHTML += `
        <div class="experiancell postll">
          ${
            item?.companyImageUrl
              ? `<img src="${item.companyImageUrl}" alt="Company Logo" />`
              : ""
          }
          <p>${item?.companyname || ""}</p>
          <p class="fw-600">${item?.jobtitle || ""}</p>
          ${
            item?.description
              ? `<p class="exce-description">${item.description}</p>`
              : ""
          }
          <p>${item?.startdate || ""} ${item?.enddate || ""}</p>
      `;

    // Handle samecompany
    if (Array.isArray(item?.samecompany) && item.samecompany.length > 0) {
      experienceHTML += `<div class="samecompany-section"><ul>`;

      item.samecompany.forEach((position) => {
        experienceHTML += `
              <li>
                <p class="fw-600">${position?.position || ""}</p>
                <p>${position?.startdate || ""} ${position?.enddate || ""}</p>
              </li>
            `;
      });

      experienceHTML += `</ul></div>`;
    }

    experienceHTML += `</div>`;
  });

  experienceHTML += `</div>`;

  // Append "See more" functionality
  experienceHTML +=
    "</div><span id='experienceToggleArrowll'>▼</span><span id='experienceToggleTextll'>See more...</span>";

  //adding Experience
  uniqueContainer.querySelector("#profileExperienceSection").innerHTML =
    experienceHTML;
}

//if experence is not there then we are calling the function with APi for 3 time and set the data to the ID
async function callExperineceOnceAgain(uniqueId, attempt = 1) {
  if (attempt > 4) return; // Stop after 3 attempts

  // Wait for 5 seconds before making the next attempt
  setTimeout(async () => {
    const { userToken } = await chrome.storage.local.get(["userToken"]);

    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/get-linkedin-profile-byurl",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkdinUrl: getLinkedInURL(),
        }),
      }
    );

    const responseData = await response.json();

    if (
      responseData.experience === "" ||
      responseData.experience === null ||
      responseData.experience === undefined
    ) {
      callExperineceOnceAgain(uniqueId, attempt + 1);

      return;
    } else {
      addExperinceFunction(responseData.experience, uniqueId);

      // Experience Section Toggle

      const profileExperienceSection = document.getElementById(
        "profileExperienceSection"
      );
      const experienceToggleText = document.getElementById(
        "experienceToggleTextll"
      );
      const experienceToggleArrow = document.getElementById(
        "experienceToggleArrowll"
      );
      const experienceCollapsedSection =
        profileExperienceSection.querySelector(".collapsedll");

      function toggleExperienceSection() {
        if (experienceCollapsedSection.classList.contains("collapsedll")) {
          experienceCollapsedSection.classList.remove("collapsedll");
          experienceToggleText.textContent = "See less...";
          experienceToggleArrow.textContent = "▲";
        } else {
          experienceCollapsedSection.classList.add("collapsedll");
          experienceToggleText.textContent = "See more...";
          experienceToggleArrow.textContent = "▼";
        }
      }

      // Attach listener only to toggle elements
      experienceToggleText.addEventListener("click", toggleExperienceSection);
      experienceToggleArrow.addEventListener("click", toggleExperienceSection);
    }
  }, 6000);
}

async function getAllPersonas(userToken) {
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

  return await response.json();
}
async function getPaymentDetails(unique) {
  const uniqueContainer = document.getElementById(unique);
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  let { userEmail } = await chrome.storage.local.get(["userEmail"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/create-checkout-session",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({ email: userEmail }),
    }
  );
  const responseData = await response.json();
  const paymentLink = uniqueContainer.querySelector("#payment-link");
  if (responseData && paymentLink) {
    paymentLink.href = responseData?.url;

    const planLink = uniqueContainer.querySelector(".plan-link");

    if (responseData?.url && planLink) {
      const upgradeLink = document.createElement("a");
      upgradeLink.href = responseData.url;
      upgradeLink.textContent = "Pro Plan";
      upgradeLink.target = "_blank"; // optional: opens link in new tab
      upgradeLink.style.color = "#007bff"; // style as needed

      planLink.appendChild(upgradeLink);
    }

    const signalSetting = uniqueContainer.querySelector("#payment-card p");

    if (signalSetting) {
      if (responseData?.type === "Free") {
        signalSetting.innerText = `Remaining profiles: ${
          responseData?.remainingProfile ?? 0
        }/${responseData?.totalProfile ?? 25}`;
      } else {
        const packageDate = new Date(
          responseData?.currentPeriodEnd
        ).toLocaleDateString();
        if (!isNaN(new Date(packageDate))) {
          signalSetting.innerText = `Subscription Renewal date ${packageDate}`;
        } else {
          signalSetting.innerText = `Upgrade your plan here`;
        }
      }
    }
  }
}
function callNano() {
  if (window.location.href.includes("linkedin.com/in/")) {
    const headings = document.querySelectorAll("h1");

    if (headings.length > 0) {
      let name = headings[0].innerText || "";

      if (name.length < 4) {
        name = headings;
      }
    }

    //console.log("profile name: ", name);

    let checkPostclassName = "scaffold-layout__content";
    let main;
    let allMainSections;
    var sectionArray = [];
    var sectionText = "";
    // Check if the class exists in the DOM
    if (document.getElementsByClassName(checkPostclassName).length === 0) {
      setTimeout(() => {
        callNano();
      }, 5000);
    } else {
      main = document.getElementsByClassName(checkPostclassName);

      allMainSections = main[0].getElementsByClassName("artdeco-card");
      processSections(allMainSections);
    }

    // Function to process sections (this is where you can extract and handle the text)
    function processSections(sections) {
      for (let i = 0; i < sections.length; i++) {
        // while visiting your own profile, there are a lot of unnecessary divs with same class name,
        // so i upto 6-7 is not enough, for now keeping at 12, later, we have to find a way to remove unwanted divs by
        // pre processing
        if (i < 12) {
          // Add the text content to the sectionText variable
          sectionText += sections[i].innerText;
        }
      }

      var linkdinImage = getLinkedInImage();
      //to get the URL for expirence section

      var companyUrls = getPersonaCompanyData();

      const ProfileDescription =
        document.getElementsByClassName("text-body-medium");
      var linkdinDesc = ProfileDescription[0].innerText;

      // need to check if its own profile or not
      // id url is /me/
      if (window.location.toString() === "https://www.linkedin.com/in/me/") {
        // now we need to get the actual url of the person to store it in db
        // that can be get from different divs
        const stringArray = [];
        try {
          const url1 = document.getElementById(
            "navigation-create-post-Create-a-post"
          ).href;
          //console.log(url1);
          if (isValidUrl(url1)) {
            stringArray.push(url1);
          }
          const url2 = document.getElementById(
            "navigation-index-edit-education"
          ).href;
          //console.log(url2);
          if (isValidUrl(url2)) {
            stringArray.push(url2);
          }
          const url3 = document.getElementById(
            "navigation-index-see-all-companies"
          ).href;
          //console.log(url3);
          if (isValidUrl(url3)) {
            stringArray.push(url3);
          }
          //console.log(sharedStartString(stringArray));
        } catch {
          //console.log("error finding user linkedin Url")
        }
        callNanoAPI(
          sectionText,
          name,
          sharedStartString(stringArray),
          linkdinImage,
          linkdinDesc,
          companyUrls,
          true
        );
      } else {
        callNanoAPI(
          sectionText,
          name,
          window.location.toString(),
          linkdinImage,
          linkdinDesc,
          companyUrls,
          false
        );
      }
    }
  }
}
async function callNanoAPI(
  post,
  profileName,
  linkdinUrl,
  linkdinImage,
  linkdinDesc,
  companyUrls,
  ownProfile
) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/linkedin-profile-main-nano",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        html: post.substring(0, 15000),
        profileName: profileName,
        linkdinUrl: linkdinUrl,
        linkdinImage: linkdinImage,
        companyUrls: companyUrls,
        linkdinDesc: linkdinDesc,
        ownProfile: ownProfile,
      }),
    }
  );

  const responseData = await response.json();
  if (responseData?.tags) {
    document.getElementById("user-tags").innerHTML = responseData?.tags;
  } else {
    document.getElementById("user-tags").innerHTML = "";
  }
}

async function callNanoByID(linkdinUrl) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/linkedin-profile-main-nano-byid",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        linkdinUrl: linkdinUrl,
      }),
    }
  );

  const responseData = await response.json();
  if (responseData?.tags) {
    document.getElementById("user-tags").style.display = "block";
    document.getElementById("user-tags").innerHTML = responseData?.tags;
  } else {
    document.getElementById("user-tags").innerHTML = "";
  }
}
async function callPerivausAction(linkdinUrl) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/linkdin-recent-activity",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        linkedinUrl: linkdinUrl,
      }),
    }
  );

  const responseData = await response.json();

  const container = document.getElementById("Previous-actions-ll");
  container.innerHTML = ""; // clear previous content

  if (
    responseData?.latestActivities &&
    Array.isArray(responseData.latestActivities) &&
    responseData.latestActivities.length > 0
  ) {
    responseData.latestActivities.forEach((item) => {
      const actionDiv = document.createElement("div");
      actionDiv.classList.add("previous-action-item");

      actionDiv.innerHTML = `
      <div class="previous-action-title">${item.title}</div>
      <div class="previous-action-subtitle">${item.subtitle}</div>
    `;

      container.appendChild(actionDiv);
    });
  } else {
    document.getElementById("Previous-actions-header-ll").innerText =
      "Suggested actions";
    // Empty case → show default actions
    const defaultActions = [
      { title: "View insights", clickId: "selfWrittenBtnLL" },
      { title: "Leave a comment", clickId: "writeCommentBtnLL" },
    ];

    defaultActions.forEach((action) => {
      const div = document.createElement("div");
      div.classList.add("previous-action-item");

      div.innerHTML = `
      <div class="previous-action-title">${action.title}</div>
      <div class="previous-action-subtitle"></div>
    `;

      // Click event triggers respective button
      div.addEventListener("click", () => {
        const btn = document.getElementById(action.clickId);
        if (btn) btn.click(); // simulate click
      });

      container.appendChild(div);
    });
  }
}
function timeAgo(dateString, prefix = "Analysed") {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffMs = now - createdDate; // difference in milliseconds
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  //after first analysed we are taking undefined so it is returning few sec ago
  if (dateString === undefined) return `${prefix} few seconds ago`;
  if (diffSec < 10) return `${prefix} few seconds ago`;
  if (diffSec < 60) return `${prefix} ${diffSec} seconds ago`;
  if (diffMin < 60) return `${prefix} ${diffMin} min ago`;
  if (diffHour < 24)
    return `${prefix} ${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  if (diffDay < 30)
    return `${prefix} ${diffDay} day${diffDay > 1 ? "s" : ""} ago`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12)
    return `${prefix} ${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`;

  const diffYear = Math.floor(diffMonth / 12);
  return `${prefix} ${diffYear} year${diffYear > 1 ? "s" : ""} ago`;
}
async function gettutorialLink() {
  let { userToken } = await chrome.storage.local.get(["userToken"]);

  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/get-tutorial-link",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    }
  );

  const result = await response.json(); // parse the JSON
  return result?.link;
}
function getLinkedInImage() {
  var linkdinImage = "";
  const ProfileImage = document.getElementsByClassName(
    "pv-top-card-profile-picture__image"
  );
  const ProfileImageOtherClass = document.getElementsByClassName(
    "pv-top-card-profile-picture__image--show"
  );

  if (ProfileImage.length > 0) {
    linkdinImage = ProfileImage[0].src;
  } else if (ProfileImageOtherClass.length > 0) {
    linkdinImage = ProfileImageOtherClass[0].src;
  } else {
    const ProfileImageSelf = document.getElementsByClassName(
      "profile-photo-edit__preview"
    );
    if (ProfileImageSelf.length > 0) {
      linkdinImage = ProfileImageSelf[0].src;
    }
  }

  return linkdinImage;
}
function makeCardBig() {
  if (document.getElementById("analyseLL")) {
    document.getElementById("analyseLL").style.width = "34%";
    document.getElementById("analyseLL").style.height = "85vh";
    document.getElementById("analyseLL").style.top = "7vh";
    document.getElementById("analyseLL").style.right = "0px";
    document.getElementById("analyseLL").style.left = "";
  }
  if (document.getElementById("floatContainer")) {
    document.getElementById("floatContainer").style.width = "34%";
    document.getElementById("floatContainer").style.height = "85vh";
    document.getElementById("floatContainer").style.top = "7vh";
    document.getElementById("floatContainer").style.right = "0px";
    document.getElementById("floatContainer").style.left = "";
  }
  document.getElementById("header-help-ll").style.fontSize = "14px";
  document.getElementById("lead-container").style.height = "85vh";
  document.getElementById("user-tags").style.display = "block";

  document.getElementById("getCanvas").style.display = "none";
  document.getElementById("canvas-list-bigCard").style.display = "flex";
  document.getElementById("profile-footer-ll").style.display = "none";
  document.getElementById("button-container-ll").style.display = "none";
  if (window.location.href.includes("linkedin.com/in/")) {
    document.getElementById("Previous-actions-cantainer-ll").style.display =
      "none";
  } else {
    if (floatSelectedUserID) {
      document.getElementById("Previous-actions-cantainer-ll").style.display =
        "block";
    } else {
      document.getElementById("Previous-actions-cantainer-ll").style.display =
        "none";
    }
  }
  document.querySelectorAll("#getCanvas .ll-canvas-item").forEach((item) => {
    item.style.display = "block";
  });
  document.getElementById("profile-content-container").style.border =
    "0.5px solid #e1e4ea";

  document
    .querySelectorAll("#getCanvas .ll-category-header")
    .forEach((item) => {
      item.style.display = "block";
    });
}
function makeCardSmall() {
  if (document.getElementById("analyseLL")) {
    document.getElementById("analyseLL").style.width = "20%";
    document.getElementById("analyseLL").style.height = "45vh";
    document.getElementById("analyseLL").style.top = "40vh";
  }
  if (document.getElementById("floatContainer")) {
    document.getElementById("floatContainer").style.width = "22%";
    document.getElementById("floatContainer").style.height = "45vh";
    document.getElementById("floatContainer").style.top = "40vh";
  }
  document.getElementById("profile-content-container").style.border = "none";
  document.getElementById("header-help-ll").style.fontSize = "12px";
  document.getElementById("getCanvas").style.display = "block";
  document.getElementById("canvas-list-bigCard").style.display = "none";
  document.getElementById("button-container-ll").style.display = "block";
  document.getElementById("lead-container").style.height = "45vh";
  document.getElementById("user-tags").style.display = "none";
  document.getElementById("Previous-actions-cantainer-ll").style.display =
    "none";
  document.getElementById("profile-footer-ll").style.display = "block";
  //as for the small card we want to show only the favorites so hiding all other canvas items Then makeing the fav display block
  document.querySelectorAll("#getCanvas .ll-canvas-item").forEach((item) => {
    item.style.display = "none";
  });
  document
    .querySelectorAll("#getCanvas .ll-category-header")
    .forEach((item) => {
      item.style.display = "none";
    });
  document.querySelectorAll("#getCanvas .favorites-ll").forEach((item) => {
    item.style.display = "block";
  });
}
async function callHisProfileDetails() {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/user-login-details",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    }
  );

  const responseData = await response.json();
  return responseData;
}
