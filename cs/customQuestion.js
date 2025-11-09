async function loadAllCustomQuestion(uniqueId, linkdinUrl) {
  const uniqueContainer = document.getElementById(uniqueId);

  const dropdownMenu = uniqueContainer.querySelector("#framework-dropdown-ll");
  const frameworkElement = uniqueContainer.querySelector("#framework-ll");
  const moreOptionsElement = uniqueContainer.querySelector(".more-options-ll");

  function toggleDropdown(event) {
    event.stopPropagation();
    dropdownMenu.style.display =
      dropdownMenu.style.display === "none" ? "block" : "none";
  }

  // Ensure dropdown starts as hidden
  dropdownMenu.style.display = "none";

  // Add event listeners to both elements
  frameworkElement.addEventListener("click", toggleDropdown);
  moreOptionsElement.addEventListener("click", toggleDropdown);

  // Close dropdown when clicking outside
  document.addEventListener("click", function () {
    dropdownMenu.style.display = "none";
  });

  // Prevent dropdown from closing when clicking inside it
  dropdownMenu.addEventListener("click", function (event) {
    event.stopPropagation();
  });
  // // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".button-select-container")) {
      dropdownMenu.style.display = "none";
    }
  });

  uniqueContainer
    .querySelector("#framework-ll")
    .addEventListener("change", function () {
      let selectedValue = this.value;
      if (selectedValue.includes("(V2)")) {
        uniqueContainer.querySelector("#variant-ll").style.display = "none";
        uniqueContainer.querySelector("#variant-message-ll").style.display =
          "block";
      } else {
        uniqueContainer.querySelector("#variant-ll").style.display = "flex";
        uniqueContainer.querySelector("#variant-message-ll").style.display =
          "none";
      }
    });
  showAllCustomMessage();
  getPaymentDetails(uniqueId);

  //this below code will add the src for the image along with chrome ID
  const dashboardImg = uniqueContainer.querySelector("#dashboard-img");
  dashboardImg.src = chrome.runtime.getURL("assets/workflow.png");
  //set the image to the header

  const headerImg = uniqueContainer.querySelector("#lead-logo");
  headerImg.src = chrome.runtime.getURL("assets/full-logo.png");
  // Set the src attribute for the "contact-img"
  const contactImg = uniqueContainer.querySelector("#contact-img");
  contactImg.src = chrome.runtime.getURL("assets/persona.png");

  const signalImg = uniqueContainer.querySelector("#signal-img");
  signalImg.src = chrome.runtime.getURL("assets/signal.png");

  const framework = uniqueContainer.querySelector("#framework-img");
  framework.src = chrome.runtime.getURL("assets/framework.png");
  const patment = uniqueContainer.querySelector("#payment-img");
  patment.src = chrome.runtime.getURL("assets/framework.png");
  const canvasImg = uniqueContainer.querySelector("#canvas-img");
  canvasImg.src = chrome.runtime.getURL("assets/persona.png");

  const openCanvasCount = document.getElementById("canvasOpen");
  const pTag = openCanvasCount.querySelector("p");

  const result = await chrome.storage.local.get(["canvasList"]);
  const canvasList = result.canvasList || [];

  pTag.textContent = `${canvasList.length} canvas created`;
  uniqueContainer
    .querySelector("#create-question-button")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector("#generate-question-ll").style.display =
        "none";
      uniqueContainer.querySelector(
        "#popup-overlay-question-ll"
      ).style.display = "block";
    });

  uniqueContainer
    .querySelector("#open-custom-question")
    .addEventListener("click", (event) => {
      const parentElement = uniqueContainer.querySelector(
        "#parsonaListingDetails"
      );
      const childElements = Array.from(parentElement.children);

      childElements.forEach(function (child) {
        child.style.display = "none";
      });

      uniqueContainer.querySelector("#generate-question-ll").style.display =
        "block";
      showAllCustomMessage();
    });

  uniqueContainer
    .querySelector("#back-to-main-card")
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
  uniqueContainer
    .querySelector("#backTocustomList")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector("#generate-question-ll").style.display =
        "block";
      uniqueContainer.querySelector(
        "#popup-overlay-question-ll"
      ).style.display = "none";
      uniqueContainer.querySelector("#question-ll").value = "";
      uniqueContainer.querySelector("#question-id-ll").value = "";
      resetWorkflowQuestions();
      uniqueContainer.querySelector("#question-generate").textContent =
        "Create Workflow";
    });

  uniqueContainer
    .querySelector("#open-persona")
    .addEventListener("click", (event) => {
      const parentElement = uniqueContainer.querySelector(
        "#parsonaListingDetails"
      );
      const childElements = Array.from(parentElement.children);

      childElements.forEach(function (child) {
        child.style.display = "none";
      });
      uniqueContainer.querySelector("#persona-listing-ll").style.display =
        "block";
    });

  //-----------------------code for workflow history
  uniqueContainer
    .querySelector("#ViewWorkflowHistory")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector("#searchPrompt").children[0].style.display =
        "none";
      uniqueContainer.querySelector("#searchPrompt").children[1].style.display =
        "none";
      uniqueContainer.querySelector("#searchPrompt").children[2].style.display =
        "block";
      getAllWorkflow();
    });

  uniqueContainer
    .querySelector("#backToSearchChat")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector("#searchPrompt").children[0].style.display =
        "block";
      uniqueContainer.querySelector("#searchPrompt").children[1].style.display =
        "none";
      uniqueContainer.querySelector("#searchPrompt").children[2].style.display =
        "none";
    });

  //to add the question and delete while create the workflow

  const workflowQuestionsContainer = uniqueContainer.querySelector(
    "#workflow-questions-container"
  );
  const addQuestionBtn = uniqueContainer.querySelector("#add-question-btn");

  // Function to create a new workflow question with a delete button
  function createWorkflowQuestion(value = "") {
    const questionDiv = document.createElement("div");
    questionDiv.className = "workflow-question";
    questionDiv.innerHTML = `
         <textarea
            type="text"
            name="workflow-question"
              value="${value}"
            placeholder="Find all podcast for {{prospect_name}} from {{company_name}}"
            required
          ></textarea>
      <button type="button" class="delete-question-btn instruction-btn-ll">Delete</button>
    `;
    workflowQuestionsContainer.appendChild(questionDiv);

    // Add delete functionality to the new question's delete button
    const deleteBtn = questionDiv.querySelector(".delete-question-btn");
    deleteBtn.addEventListener("click", function () {
      questionDiv.remove();
    });
  }

  // Event listener for adding new workflow questions
  addQuestionBtn.addEventListener("click", function () {
    createWorkflowQuestion();
  });

  /* --- code for listing ---*/

  function generatedQuestion(questionList) {
    const container = uniqueContainer.querySelector("#custom-question-list");

    if (questionList.length === 0) {
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
        "<h4>No Signal work flows found</h4>" +
        "<p>Create a new signal workflow.</p>" +
        "</div>";

      container.appendChild(emptyArray);
    }

    questionList.forEach((persona) => {
      const personaItem = document.createElement("div");
      personaItem.className = "persona-item-ll";
      personaItem.id = persona.id;

      const personaHeader = document.createElement("div");
      personaHeader.className = "persona-header-ll";
      personaHeader.onclick = togglePersonaDetails;

      const personaInfo = document.createElement("div");
      const personaName = document.createElement("h3");
      personaName.textContent = persona.title;
      personaName.style.marginBottom = "0px";

      const createdDateContainer = document.createElement("p");
      const createdDateValue = document.createElement("p");
      createdDateValue.className = "workflow-data-p";
      createdDateValue.textContent = new Date(
        persona.date
      ).toLocaleDateString();

      // createdDateContainer.appendChild(createdDateLabel);
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
      editButton.onclick = (event) => editQuestion(event, persona.id, persona);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.onclick = (event) =>
        deleteQuestion(event, persona.id, personaItem);

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

      // Populate questions
      const questionsContainer = document.createElement("div");
      persona.questions.forEach((questionObj) => {
        const questionDiv = document.createElement("div");
        questionDiv.style.marginBottom = "10px";

        const questionText = document.createElement("div");
        questionText.textContent = questionObj.questions;
        questionDiv.appendChild(questionText);
        questionsContainer.appendChild(questionDiv);
      });

      personaDetails.appendChild(questionsContainer);

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

  async function showAllCustomMessage() {
    //loader
    fetch(chrome.runtime.getURL("pages/loader.html"))
      .then((r) => r.text())
      .then((html) => {
        uniqueContainer.querySelector("#custom-question-list").innerHTML = html;
      });
    uniqueContainer.querySelector("#popup-overlay-question-ll").style.display =
      "none";

    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/getall-workflow",
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
      uniqueContainer.querySelector("#custom-question-list").innerHTML = "";
      generatedQuestion(responseData.body);

      const dropdownMenu = uniqueContainer.querySelector(
        "#work-flow-ll-select-list"
      );
      const selectButton = uniqueContainer.querySelector(
        "#work-flow-ll-select"
      );
      selectButton.textContent = responseData.body[0]?.title;
      selectButton.dataset.selectedId = responseData.body[0]?.id;

      selectButton.onclick = () => {
        const selectedId = selectButton.dataset.selectedId;
        loadWorkFlowInSearch(selectedId);
      };
      dropdownMenu.innerHTML = "";

      responseData.body.forEach((workflow) => {
        const followUpButton = document.createElement("button");
        // followUpButton.className = "more-options-ll";
        followUpButton.textContent = workflow?.title;
        followUpButton.value = workflow.id;
        // Add a click event handler for each button
        followUpButton.onclick = (event) => {
          selectButton.textContent = workflow?.title;
          selectButton.dataset.selectedId = workflow.id; //we are setting the id because as I need the ID in Main button submit
          dropdownMenu.style.display = "none";
        };

        // Append the button to the dropdown menu
        dropdownMenu.appendChild(followUpButton);
      });

      const openCustomQuestion = uniqueContainer.querySelector(
        "#open-custom-question"
      );
      const pTag = openCustomQuestion.querySelector("p");
      pTag.textContent = `${responseData.body.length} workflows created`;
    }
  }

  let validationWarningShown = false;
  uniqueContainer
    .querySelector("#question-generate")
    .addEventListener("click", async function () {
      let api;
      const question = uniqueContainer.querySelector("#question-ll").value;
      const workflowQuestions = getWorkflowQuestions();
      const id = uniqueContainer.querySelector("#question-id-ll").value;
      if (id !== "") {
        api = "https://betabackext-beta.leadlabs.app/edit-workflow-byid";
      } else {
        api = "https://betabackext-beta.leadlabs.app/create-workflow";
      }
      // Check if all workflow questions have {{company_name}} or {{prospect_name}}
      const isValid = workflowQuestions.every(
        ({ questions }) =>
          questions.includes("{{company_name}}") ||
          questions.includes("{{prospect_name}}")
      );

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
        title: question,
        questions: workflowQuestions,
        id: id,
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
            "#popup-overlay-question-ll"
          ).style.display = "none";
          showAllCustomMessage();
          uniqueContainer.querySelector("#generate-question-ll").style.display =
            "block";
          // Clear the values after the response
          uniqueContainer.querySelector("#question-ll").value = "";
          uniqueContainer.querySelector("#question-id-ll").value = "";
          uniqueContainer.querySelector("#question-generate").textContent =
            "Create Workflow";
          resetWorkflowQuestions();
          validationWarningShown = false;
        } else {
          uniqueContainer.querySelector("#question-ll").value = "";
          uniqueContainer.querySelector("#question-id-ll").value = "";
          uniqueContainer.querySelector("#question-generate").textContent =
            "Create Workflow";
          resetWorkflowQuestions();
          validationWarningShown = false;
        }
      } catch (error) {
        showNotification("Error contacting the server.", "warning", uniqueId);
        uniqueContainer.querySelector("#question-ll").value = "";
        uniqueContainer.querySelector("#question-id-ll").value = "";
        uniqueContainer.querySelector("#question-generate").textContent =
          "Create Workflow";
        resetWorkflowQuestions();
        validationWarningShown = false;
      }
    });

  function getWorkflowQuestions() {
    const questionsContainer = uniqueContainer.querySelector(
      "#workflow-questions-container"
    );
    const questionInputs = questionsContainer.querySelectorAll(
      "textarea[name='workflow-question']"
    );

    const questions = Array.from(questionInputs).map((input) => ({
      questions: input.value.trim(), // Create an object for each input
    }));

    return questions.filter((question) => question.questions !== ""); // Exclude objects with empty questions
  }

  function resetWorkflowQuestions() {
    const questionsContainer = uniqueContainer.querySelector(
      "#workflow-questions-container"
    );
    const questionInputs = questionsContainer.querySelectorAll(
      "textarea[name='workflow-question']"
    );

    questionInputs.forEach((input) => {
      input.value = ""; // Set each input field's value to an empty string
    });
  }
  async function editQuestion(event, id, questionData) {
    event.stopPropagation();
    uniqueContainer.querySelector("#popup-overlay-question-ll").style.display =
      "block";
    uniqueContainer.querySelector("#generate-question-ll").style.display =
      "none";
    // Populate the input fields with the selected persona's data
    uniqueContainer.querySelector("#question-id-ll").value = questionData.id;
    uniqueContainer.querySelector("#question-ll").value = questionData.title;
    populateWorkflowQuestions(questionData?.questions);

    uniqueContainer.querySelector("#popup-overlay-question-ll").style.display =
      "block";

    uniqueContainer.querySelector("#question-generate").textContent =
      "Update Workflow";
  }

  function populateWorkflowQuestions(questions) {
    workflowQuestionsContainer.innerHTML = "";

    questions.forEach((q, index) => {
      if (index === 0) {
        // Create the first question without a delete button
        const firstQuestionDiv = document.createElement("div");
        firstQuestionDiv.className = "workflow-question";
        firstQuestionDiv.innerHTML = `
          <textarea
          name="workflow-question"
          placeholder="Find all podcast for {{prospect_name}} from {{company_name}}"
          required
        >${q.questions}</textarea>
            `;
        workflowQuestionsContainer.appendChild(firstQuestionDiv);
      } else {
        // Create subsequent questions with delete buttons
        createWorkflowQuestion(q.questions);
      }
    });
  }
  async function deleteQuestion(event, id, container) {
    event.stopPropagation();

    // Implement delete functionality
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/delete-workflow-byid",
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
        "Custom Signals Deleted Successfully!",
        "success",
        uniqueId
      );
      container.remove();
    }
  }
  async function updateStatus(personaId, newStatus) {
    // API call to update the status
    // Implement delete functionality
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/update-workflow-status",
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
      uniqueContainer.querySelector("#generate-question-ll").style.display =
        "block";
      showAllCustomMessage();

      showNotification(
        "Custom Signals status updated Successfully!",
        "success",
        uniqueId
      );
    }
  }

  uniqueContainer
    .querySelector("#company-name-span")
    .addEventListener("click", function () {
      copyToClipboardById("company-name-span");
    });

  uniqueContainer
    .querySelector("#prospect-name-span")
    .addEventListener("click", function () {
      copyToClipboardById("prospect-name-span");
    });

  uniqueContainer
    .querySelector("#signal-frame-span")
    .addEventListener("click", function () {
      copyToClipboardById("signal-frame-span");
    });

  uniqueContainer
    .querySelector("#prospect-frame-span")
    .addEventListener("click", function () {
      copyToClipboardById("prospect-frame-span");
    });
  uniqueContainer
    .querySelector("#prospect_company_name")
    .addEventListener("click", function () {
      copyToClipboardById("prospect_company_name");
    });

  uniqueContainer
    .querySelector("#prospect_title")
    .addEventListener("click", function () {
      copyToClipboardById("prospect_title");
    });
  uniqueContainer
    .querySelector("#your_company_name")
    .addEventListener("click", function () {
      copyToClipboardById("your_company_name");
    });

  function copyToClipboardById(spanId) {
    const span = uniqueContainer.querySelector(`#${spanId}`); // Add # to select by ID
    if (!span) {
      console.error(`Element with ID "${spanId}" not found.`);
      return; // Exit the function if the element doesn't exist
    }
    const text = span.innerText; // Get the text content of the span

    // Create a temporary textarea to hold the text
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = text; // Set the value to the text to be copied
    document.body.appendChild(tempTextarea); // Add it to the DOM
    tempTextarea.select(); // Select the text
    tempTextarea.setSelectionRange(0, 99999); // For mobile devices

    try {
      document.execCommand("copy"); // Copy the text to the clipboard
      showNotification(`Copied "${text}" to clipboard!`, "success", uniqueId); // Optional: Notify user
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }

    document.body.removeChild(tempTextarea); // Remove the temporary textarea
  }
  async function loadWorkFlowInSearch(id) {
    // Store the original content of the div before displaying the loading message
    const originalContent =
      uniqueContainer.querySelector("#chatList").innerHTML;

    // Create the loading message and append it
    const loadingDiv = document.createElement("div");
    loadingDiv.innerHTML = `
              <div id="loaderSearch">Generating ... Please wait</div>
            `;
    loadingDiv.style.textAlign = "center";
    loadingDiv.style.color = "#5B5B5B";
    uniqueContainer.querySelector("#chatList").appendChild(loadingDiv);

    // Fetch the content from loader.html and update the innerHTML once fetched
    fetch(chrome.runtime.getURL("pages/loader.html"))
      .then((response) => response.text())
      .then((html) => {
        // First, clear the existing content including the loading message
        uniqueContainer.querySelector("#chatList").innerHTML = "";

        uniqueContainer.querySelector("#chatList").innerHTML = html;

        // Display the element again
        uniqueContainer.querySelector("#chatList").style.display = "block";

        // Call your custom function to update the loader text
        updateSearch(4);
      })
      .catch((error) => {
        console.error("Error fetching loader.html:", error);
      });
    let { userToken } = await chrome.storage.local.get(["userToken"]);

    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/create-workflow-answer-wid",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkdinUrl:
            linkdinUrl !== ""
              ? linkdinUrl
              : uniqueContainer.querySelector("#linkedinUrl").innerText,
          wid: id,
        }),
      }
    );

    const responseData = await response.json();

    // Assuming responseData contains the backend response
    if (responseData?.header === "success") {
      // Select the element where the chat should be appended
      const selectElement = uniqueContainer.querySelector("#chatList");

      // Clear the original content before appending new chats
      selectElement.innerHTML = "";

      // Iterate through the response data
      responseData.body.forEach((data) => {
        // Create a container div for the chat
        const chatContainer = document.createElement("div");
        chatContainer.classList.add("chat-container"); // Add a class for styling

        // Create a div for the updated question
        const updatedQuestionDiv = document.createElement("div");
        updatedQuestionDiv.classList.add("chat-updatedquestion"); // Add a class for styling
        updatedQuestionDiv.innerHTML = `<strong> Question:</strong> ${data.updatedQuestion}`;

        // Create a div for the extracted HTML (handle HTML carefully)
        const extractedHtmlDiv = document.createElement("div");
        extractedHtmlDiv.classList.add("chat-extractedhtml"); // Add a class for styling
        extractedHtmlDiv.innerHTML = `<strong>Answer:</strong> ${data.extractedHtml}`;

        chatContainer.appendChild(updatedQuestionDiv);
        chatContainer.appendChild(extractedHtmlDiv);

        // Append the entire chat container to the chat list
        selectElement.appendChild(chatContainer);
      });
    }
    uniqueContainer.querySelector("#submitChat").disabled = false;
  }
  async function getAllWorkflow() {
    var pageLimit = 1;
    let { userToken } = await chrome.storage.local.get(["userToken"]);

    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/get-workflow-answer-profileurl",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkdinUrl:
            linkdinUrl !== ""
              ? linkdinUrl
              : uniqueContainer.querySelector("#linkedinUrl").innerText,
          page_limit: pageLimit,
        }),
      }
    );

    const responseData = await response.json();

    if (responseData) {
      const selectElement = uniqueContainer.querySelector("#workflow-history");
      selectElement.innerHTML = ""; // Clear existing content
      if (responseData?.body?.length === 0) {
        const container = uniqueContainer.querySelector("#workflow-history");
        container.innerHTML = "";
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
          "<h4>No Signal work flows found</h4>" +
          "<p>Create a new signal workflow.</p>" +
          "</div>";
        container.appendChild(emptyArray);
        uniqueContainer.querySelector("#load_more_btn_workflow").style.display =
          "none";
      } else {
        uniqueContainer.querySelector("#load_more_btn_workflow").style.display =
          "block";
        responseData?.body.forEach((chatBody) => {
          // Create a container for each question-answer pair
          const chatContainer = document.createElement("div");
          chatContainer.classList.add("chat-container"); // Add a class for styling

          // Create a div for the question (perplexity_question)
          const questionDiv = document.createElement("div");
          questionDiv.classList.add("chat-question"); // Add a class for styling
          questionDiv.innerHTML = `<strong>Question:</strong> ${chatBody?.question}`;

          // Create a div for the answer (perplexity_answer)
          const answerDiv = document.createElement("div");
          answerDiv.classList.add("chat-answer"); // Add a class for styling
          answerDiv.innerHTML = `<strong>Answer:</strong> ${chatBody?.answer}`;

          // Append the question and answer to the chat container
          chatContainer.appendChild(questionDiv);
          chatContainer.appendChild(answerDiv);

          // Append the entire container to the main chatList div
          selectElement.appendChild(chatContainer);
        });

        document.getElementById("companyNameLL").innerText =
          responseData?.companyname;

        var pageLimit = 1;
        //calling function fort load more
        uniqueContainer
          .querySelector("#load_more_btn_workflow")
          .addEventListener("click", function (e) {
            e.preventDefault();
            pageLimit = pageLimit + 1;
            getShowLoadMore(pageLimit)
              .then((data) => {
                //call function for draw UI
                addData(data, "loadmore");
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          });
      }
    }
  }
  async function getShowLoadMore(str) {
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/get-workflow-answer-profileurl",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkdinUrl:
            linkdinUrl !== ""
              ? linkdinUrl
              : uniqueContainer.querySelector("#linkedinUrl").innerText,
          page_limit: str,
        }),
      }
    );
    const responseData = await response.json();
    return responseData;
  }

  function addData(data, type) {
    const contentList = uniqueContainer.querySelector("#workflow-history");
    if (type !== "loadmore") {
      contentList.innerHTML = "";
    }

    data?.body.forEach((chatBody) => {
      // Create a container for each question-answer pair
      const chatContainer = document.createElement("div");
      chatContainer.classList.add("chat-container"); // Add a class for styling

      // Create a div for the question (perplexity_question)
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("chat-question"); // Add a class for styling
      questionDiv.innerHTML = `<strong>Question:</strong> ${chatBody?.question}`;

      // Create a div for the answer (perplexity_answer)
      const answerDiv = document.createElement("div");
      answerDiv.classList.add("chat-answer"); // Add a class for styling
      answerDiv.innerHTML = `<strong>Answer:</strong> ${chatBody?.answer}`;

      // Append the question and answer to the chat container
      chatContainer.appendChild(questionDiv);
      chatContainer.appendChild(answerDiv);

      // Append the entire container to the main chatList div
      contentList.appendChild(chatContainer);
    });

    // combine divs to show as one
    combineConsecutiveMellDivsAndAddLabels();
  }

  const talkingDiv = uniqueContainer.querySelector("#talking-points");
  if (talkingDiv) {
    const talkingImg = talkingDiv.querySelector("img");
    if (talkingImg) {
      talkingImg.src = chrome.runtime.getURL("assets/lamp.png");
    }

    talkingDiv.addEventListener("click", () => {
      uniqueContainer.querySelectorAll(".tabcontent").forEach((div) => {
        div.style.display = "none";
      });
      //here we are loading the company details only for linkedin because mainly for tuning I want to send the company data
      //company data is loading only after click on the sidnav so for the tuning data We are calling api here for linkedin
      //for floating icon the on click on profile name company data is loading
      if (linkdinUrl !== "") {
        loadCompanyDetails("profileCardLL");
      }
      const emailDetails = uniqueContainer.querySelector(
        "#emailCreationDetails"
      );
      emailDetails.style.display = "block";
      if (emailDetails) {
        emailDetails.children[0].style.display = "none";
        emailDetails.children[1].style.display = "none";
        emailDetails.children[2].style.display = "block";
        emailDetails.children[3].style.display = "none";
      }

      const name = uniqueContainer
        .querySelector("#profileNameGenerateContent")
        .textContent.trim();
      const selectElement = uniqueContainer.querySelector(
        "#persona-listing-name-talking-ll"
      );
      const selectedOptionText =
        selectElement.options[selectElement.selectedIndex].text;
      const title = selectedOptionText.split("/")[0].trim();

      // Update the text content
      uniqueContainer.querySelector(
        "#"
      ).textContent = `Generate talking point for ${name} (${title})`;
    });
  }

  const Writemessagediv = uniqueContainer.querySelector("#Writemessage");
  const Writemessage = Writemessagediv.querySelector("img");
  if (Writemessage) {
    Writemessage.src = chrome.runtime.getURL("assets/email.png");
  }

  Writemessagediv.addEventListener("click", async () => {
    loadWorkFlowDetails(
      uniqueId,
      linkdinUrl !== ""
        ? linkdinUrl
        : uniqueContainer.querySelector("#linkedinUrl").innerText
    );
    // Check content length by calling the API
    const hasGeneratedContent = await checkLenghtGenerateContent(
      linkdinUrl !== ""
        ? linkdinUrl
        : uniqueContainer.querySelector("#linkedinUrl").innerText
    );

    // Hide all tab content
    uniqueContainer.querySelectorAll(".tabcontent").forEach((div) => {
      div.style.display = "none";
    });

    // Show or hide content sections based on result
    const emailDetails = uniqueContainer.querySelector("#emailCreationDetails");
    emailDetails.style.display = "block";
    if (hasGeneratedContent) {
      emailDetails.children[0].style.display = "none";
      emailDetails.children[2].style.display = "none";
      emailDetails.children[1].style.display = "block";
      emailDetails.children[3].style.display = "none";

      loadGenerateContentHistory(
        uniqueId,
        linkdinUrl !== ""
          ? linkdinUrl
          : uniqueContainer.querySelector("#linkedinUrl").innerText
      );
    } else {
      // If result is false, show the first child
      emailDetails.children[0].style.display = "block";
      emailDetails.children[1].style.display = "none";
      emailDetails.children[2].style.display = "none";
      emailDetails.children[3].style.display = "none";
    }

    // Get the name from profileNameGenerateContent
    const profileNameElement = uniqueContainer.querySelector(
      "#profileNameGenerateContent"
    );
    const profileName = profileNameElement ? profileNameElement.innerText : "";
    const firstName = profileName.split(" ")[0];
    const button = uniqueContainer.querySelector("#ViewContentHistory");

    if (profileName && button) {
      button.innerText = `${firstName}'s Threads`;
    }

    const ptag = uniqueContainer.querySelector("#followupHeading");
    if (profileName && button) {
      ptag.innerText = `Follow up with ${firstName}`;
    }
    await getFrameWork(0, "signal", uniqueId);
    loadCompanyDetails(uniqueId);
    loadAllParsonas(uniqueId);
  });

  const personalityDiv = uniqueContainer.querySelector("#personality-tune");
  if (personalityDiv) {
    const personalityImg = personalityDiv.querySelector("img");
    if (personalityImg) {
      personalityImg.src = chrome.runtime.getURL("assets/brain.png");
    }

    personalityDiv.addEventListener("click", () => {
      uniqueContainer.querySelectorAll(".tabcontent").forEach((div) => {
        div.style.display = "none";
      });

      const emailDetails = uniqueContainer.querySelector(
        "#emailCreationDetails"
      );
      if (emailDetails) {
        emailDetails.style.display = "block";

        emailDetails.children[0].style.display = "none";
        emailDetails.children[1].style.display = "none";
        emailDetails.children[2].style.display = "none";
        emailDetails.children[3].style.display = "block";
      }
    });
  }

  uniqueContainer
    .querySelector("#persona-listing-name-talking-ll")
    .addEventListener("change", function () {
      const name = uniqueContainer
        .querySelector("#profileNameGenerateContent")
        .textContent.trim();
      const selectElement = uniqueContainer.querySelector(
        "#persona-listing-name-talking-ll"
      );
      const selectedOptionText =
        selectElement.options[selectElement.selectedIndex].text;
      const title = selectedOptionText.split("/")[0].trim();

      // Update the text content
      uniqueContainer.querySelector(
        "#"
      ).textContent = `Generate talking point for ${name} (${title})`;
    });

  const reanalyseCompany = uniqueContainer.querySelector("#reanalyse-company");
  reanalyseCompany.addEventListener("click", async () => {
    const response = await callCompanyReset();
    if (response) {
      popupCenters({
        url:
          removeAfter5thSlash(window.location.toString()) +
          "recent-activity/comments",
        title: "LeadLabs",
        w: 600,
        h: 600,
      });
    }
  });
  async function callCompanyReset() {
    let { userToken } = await chrome.storage.local.get(["userToken"]);

    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/re-analyse-company",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          companyLinkedInURL:
            uniqueContainer.querySelector("#companyURLll").innerText,
          linkdinUrl:
            linkdinUrl !== ""
              ? linkdinUrl
              : uniqueContainer.querySelector("#linkedinUrl").innerText,
        }),
      }
    );

    const responseData = await response.json();
    return responseData;
  }
}
