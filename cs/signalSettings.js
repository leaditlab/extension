function signalSetting(uniqueId, linkdinUrl) {
  const uniqueContainer = document.getElementById(uniqueId);

  uniqueContainer.querySelector("#selectFrameworkFine").onchange = function () {
    const selectedPhase = uniqueContainer.querySelector(
      "#selectFrameworkFine"
    ).value;
    // Now you can use selectedPhase as needed
  };
  showAllSignal();

  uniqueContainer
    .querySelector("#open-signal-setting")
    .addEventListener("click", (event) => {
      const parentElement = uniqueContainer.querySelector(
        "#parsonaListingDetails"
      );
      const childElements = Array.from(parentElement.children);

      childElements.forEach(function (child) {
        child.style.display = "none";
      });
      uniqueContainer.querySelector("#popup-signal-setting").style.display =
        "block";
      showAllSignal();
    });

  uniqueContainer
    .querySelector("#backTocustom")
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
  let data = [
    {
      name: "Personal Overview",
      list: [
        {
          id: 1,
          type: "Likes",
          displayStatus: true,
          contentIdName: "profileLikes",
        },
        {
          id: 2,
          type: "Dislikes",
          displayStatus: true,
          contentIdName: "profileDislikes",
        },
        {
          id: 3,
          type: "Interests",
          displayStatus: true,
          contentIdName: "profileInterestedTopics",
        },
        {
          id: 4,
          type: "Ice Breakers",
          displayStatus: true,
          contentIdName: "profileIceBrakers",
        },
        {
          id: 5,
          type: "Probable Problems",
          displayStatus: true,
          contentIdName: "profileProblems",
        },
      ],
    },
    {
      name: "Self Authored Content",
      list: [
        {
          id: 6,
          type: "Self Authored Contents",
          displayStatus: true,
          contentIdName: "allPosts",
        },
      ],
    },
    {
      name: "Engaged Content",
      list: [
        {
          id: 7,
          type: "Engaged Contents",
          displayStatus: true,
          contentIdName: "commentsPosts",
        },
        // {
        //   id: 8,
        //   type: "Reaction",
        //   displayStatus: true,
        //   contentIdName: "commentsPosts",
        // },
      ],
    },
    {
      name: "Account Overview",
      list: [
        {
          id: 9,
          type: "Overview",
          displayStatus: true,
          contentClassName: "summary",
        },
        {
          id: 10,
          type: "Websites",
          displayStatus: true,
          contentClassName: "wedsitell",
        },

        {
          id: 11,
          type: "Company Size",
          displayStatus: true,
          contentClassName: "companysizell",
        },
        {
          id: 12,
          type: "Founded",
          displayStatus: true,
          contentClassName: "foundll",
        },
        {
          id: 13,
          type: "Company Posts",
          displayStatus: true,
          contentIdName: "companyPostsLL",
        },
      ],
    },
    {
      name: "Account Insights",
      list: [
        {
          id: 14,
          type: "Funds",
          displayStatus: true,
          contentClassName: "fundingDatall",
        },
        {
          id: 15,
          type: "Jobs",
          displayStatus: true,
          contentIdName: "companyJobsLL",
        },
        {
          id: 16,
          type: "Markets",
          displayStatus: true,
          contentClassName: "marketsegll",
        },
        {
          id: 17,
          type: "Verticals",
          displayStatus: true,
          contentClassName: "verticalsll",
        },
        {
          id: 18,
          type: "Competitors",
          displayStatus: true,
          contentIdName: "companyCompetitorsLL",
        },
        {
          id: 19,
          type: "Analytics and Trackings",
          displayStatus: true,
          contentIdName: "companyTechStackLL",
        },
        {
          id: 20,
          type: "Widgets",
          displayStatus: true,
          contentIdName: "companyTechStackLL",
        },
        { id: 21, type: "BTL", displayStatus: true, contentClassName: "btl" },
        { id: 22, type: "ATL", displayStatus: true, contentClassName: "atl" },
      ],
    },
    {
      name: "Account News and Media",
      list: [
        {
          id: 23,
          type: "Opportunities and Updates",
          displayStatus: true,
          contentIdName: "companyNewsLL",
        },
        {
          id: 24,
          type: "Website Languages",
          displayStatus: true,
          contentIdName: "companyLinesLL",
        },
      ],
    },
    {
      name: "Custom Signals",
      list: [
        {
          id: 25,
          type: "Custom Signals",
          displayStatus: true,
          contentIdName: "workflowAllQuestionLL",
        },
      ],
    },
    {
      name: "Message Co-pilot",
      list: [
        {
          id: 25,
          type: "Message Co-pilot",
          displayStatus: false,
          contentIdName: "emailCreation",
        },
      ],
    },
  ];
  let arrayData;
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

  async function showAllSignal() {
    const container = uniqueContainer.querySelector("#signal-list-ll");
    container.innerHTML = "";

    //loader
    fetch(chrome.runtime.getURL("pages/loader.html"))
      .then((r) => r.text())
      .then((html) => {
        uniqueContainer.querySelector("#signal-list-ll").innerHTML = html;
      });

    let responseData = await getAllSignalSettings();
    container.innerHTML = "";

    const allActive = responseData.every((category) =>
      category.list.every((item) => item.displayStatus)
    );

    const signalSetting = uniqueContainer.querySelector(
      "#open-signal-setting p"
    );
    if (signalSetting) {
      signalSetting.innerText = allActive
        ? "All Signals Active"
        : "Some Signals Inactive";
    }

    if (responseData?.length !== 0) {
      arrayData = responseData;
    } else {
      arrayData = data;
      updateArrayData(data);
    }

    arrayData.forEach((category) => {
      const categoryItem = document.createElement("div");
      categoryItem.className = "persona-item-ll";
      categoryItem.draggable = true; // Enable dragging
      categoryItem.dataset.id = category.name; // Set unique identifier

      const categoryHeader = document.createElement("div");
      categoryHeader.className = "persona-header-ll";
      categoryHeader.onclick = togglePersonaDetails;

      const categoryInfo = document.createElement("div");
      const categoryName = document.createElement("h3");
      categoryName.textContent = category.name;
      categoryName.style.marginBottom = "0px";

      categoryInfo.appendChild(categoryName);
      categoryHeader.appendChild(categoryInfo);

      const expandIcon = document.createElement("span");
      expandIcon.className = "expand-icon-ll";
      expandIcon.textContent = "▼";
      categoryHeader.appendChild(expandIcon);
      categoryItem.appendChild(categoryHeader);

      const categoryDetails = document.createElement("div");
      categoryDetails.className = "persona-details-ll";
      categoryDetails.style.display = "none";

      category.list.forEach((persona) => {
        const personaItem = document.createElement("div");
        personaItem.className = "persona-item-ll";
        personaItem.style.paddingBottom = "5px";
        personaItem.style.paddingTop = "5px";
        personaItem.id = persona.id;
        personaItem.draggable = true; // Enable dragging
        personaItem.dataset.id = persona.id; // Assign ID for tracking

        const personaHeader = document.createElement("div");
        personaHeader.className = "persona-header-ll";
        personaHeader.style.margin = "0px";

        const personaInfo = document.createElement("div");
        const personaName = document.createElement("h3");

        personaName.textContent = persona.type;
        personaName.style.marginBottom = "0px";
        personaName.style.fontWeight = "500";

        personaInfo.appendChild(personaName);

        const optionsContainer = document.createElement("div");
        optionsContainer.className = "options-container-ll";

        const statusContainer = document.createElement("div");
        statusContainer.className = "status-container";

        const statusElement = document.createElement("span");
        statusElement.textContent = persona.displayStatus
          ? "Active"
          : "Inactive";
        statusElement.classList.add(
          persona.displayStatus ? "atl-cls" : "btl-cls"
        );

        const switchLabel = document.createElement("label");
        switchLabel.className = "switch-custom";

        const switchInput = document.createElement("input");
        switchInput.type = "checkbox";
        switchInput.checked = persona.displayStatus;
        switchInput.onchange = () => {
          persona.displayStatus = switchInput.checked;
          statusElement.textContent = switchInput.checked
            ? "Active"
            : "Inactive";
          statusElement.className = switchInput.checked ? "atl-cls" : "btl-cls";
          updateStatus(persona.id, switchInput.checked);
        };

        const switchSlider = document.createElement("span");
        switchSlider.className = "slider-custom rounded";

        switchLabel.appendChild(switchInput);
        switchLabel.appendChild(switchSlider);
        statusContainer.appendChild(statusElement);
        statusContainer.appendChild(switchLabel);

        optionsContainer.appendChild(statusContainer);

        personaHeader.appendChild(personaInfo);
        personaHeader.appendChild(optionsContainer);

        personaItem.appendChild(personaHeader);
        categoryDetails.appendChild(personaItem);
      });

      categoryItem.appendChild(categoryDetails);
      container.appendChild(categoryItem);
    });

    enableDragAndDrop();
  }

  function updateStatus(personaId, newStatus) {
    data.forEach((category) => {
      category.list.forEach((persona) => {
        if (persona.id === personaId) {
          persona.displayStatus = newStatus; // Update the arrayData
        }
      });
    });

    updateArrayData(data);
  }

  // Function to enable drag and drop
  function enableDragAndDrop() {
    let draggedItem = null;

    document.querySelectorAll(".persona-item-ll").forEach((item) => {
      item.setAttribute("draggable", true); // Ensure items are draggable

      item.addEventListener("dragstart", (e) => {
        draggedItem = item;
        e.dataTransfer.setData("text/plain", item.dataset.id);
        setTimeout(() => {
          item.style.display = "none";
        }, 0);
      });

      item.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      item.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedItem) {
          let targetItem = e.target.closest(".persona-item-ll");

          if (targetItem && targetItem !== draggedItem) {
            let parent = targetItem.parentNode;

            // Find the next sibling or append to the end if no sibling exists
            let nextSibling = targetItem.nextElementSibling;

            if (nextSibling) {
              parent.insertBefore(draggedItem, nextSibling);
            } else {
              parent.appendChild(draggedItem);
            }

            updateDataOrder();
          } else {
            // If no valid drop target, append at the end
            draggedItem.parentNode.appendChild(draggedItem);
            updateDataOrder();
          }
        }
      });

      item.addEventListener("dragend", () => {
        draggedItem.style.display = "block";
        draggedItem = null;
      });
    });
  }

  // Function to update `data` array order based on new DOM structure
  function updateDataOrder() {
    let newData = [];
    document.querySelectorAll(".persona-item-ll").forEach((item) => {
      let category = data.find((cat) => cat.name === item.dataset.id);
      if (category) {
        newData.push(category);
      }
    });
    data = newData; // Update data array
    updateArrayData(data);
  }

  async function updateArrayData(data) {
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/api/update/allsignalsetting",
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
          signalArray: data,
        }),
      }
    );

    const responseData = await response.json();
    if (responseData) {
      // return responseData?.questions;
      toggleDisplayBasedOnStatus(uniqueId);
    }
  }
  //This code for re generate content---I am writing this code here because I want to genaralize the code for float and linkedin aste

  const popupOverlayRegenerate = uniqueContainer.querySelector(
    "#popup-overlay-regenerate"
  );

  uniqueContainer
    .querySelector("#regenerate-btn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      popupOverlayRegenerate.style.display = "flex";
    });

  uniqueContainer
    .querySelector("#submit-regenerate")
    .addEventListener("click", async function (event) {
      event.preventDefault();
      const container = uniqueContainer.querySelector("#regenerated-data");
      container.innerHTML = "";

      //loader
      fetch(chrome.runtime.getURL("pages/loader.html"))
        .then((r) => r.text())
        .then((html) => {
          uniqueContainer.querySelector("#regenerated-data").innerHTML = html;
        });

      let { userToken } = await chrome.storage.local.get(["userToken"]);
      const response = await fetch(
        "https://betabackext-beta.leadlabs.app/simplify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
          body: JSON.stringify({
            personalityType: uniqueContainer.querySelector(
              "#profileTypeGenerateContent"
            ).innerText,
            MsgData: uniqueContainer.querySelector("#regenerate-text").value,
            playbook: uniqueContainer.querySelector("#selectFrameworkFine")
              .value,
            personname: uniqueContainer.querySelector(
              "#profileNameGenerateContentfine"
            ).innerText,
            linkdinUrl:
              linkdinUrl !== ""
                ? linkdinUrl
                : uniqueContainer.querySelector("#linkedinUrl").innerText,
          }),
        }
      );

      const responseData = await response.json();

      if (responseData) {
        container.innerHTML = responseData?.body;
      }
    });
  async function startAutoReload(type) {
    let intervalCount = 0;
    const maxIntervals = 6;

    const intervalId = setInterval(async () => {
      // Call the reload function
      const responseData = await callReloadFunction(type);

      if (responseData && responseData.body) {
        // Check if any response has status "pending"
        const hasPendingStatus = responseData.body.some(
          (item) => item.status === "pending"
        );

        if (!hasPendingStatus || intervalCount >= maxIntervals) {
          clearInterval(intervalId);
        }
      }

      intervalCount++;
    }, 20000);
  }

  // Updated callReloadFunction that returns responseData
  async function callReloadFunction(type) {
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/refresh-result",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          type: type === "selfwritten" ? [type, "engaged"] : [type], //for selft written content enage content is not coming so button is comming in UI,so to slove thiswe added this condition
          linkdinUrl:
            linkdinUrl !== ""
              ? linkdinUrl
              : uniqueContainer.querySelector("#linkedinUrl").innerText,
          linkdinComapanyUrl:
            uniqueContainer.querySelector("#companyURLll").innerText,
        }),
      }
    );

    const responseData = await response.json();
    //here we are calling the same function because reload for self and engeged is there only for linkedin not for float icon
    //so no need to use the unique id here
    //but for job we need reload icon for both linkedin and floating icon so we are using the unique id here
    if (type === "engaged" || type === "selfwritten") {
      showContentPost(responseData.body);
      // updateTimeAgoInAllPosts(null, responseData.body[0]?.updatedAt);
      responseData?.body.forEach((post) => {
        let firstParam = null;

        if (post.postType === "comments") {
          firstParam = "commentsPosts";
        } else if (post.postType === "all") {
          firstParam = "allPosts";
        } else if (post.postType === "reactions") {
          firstParam = "reactionsPosts";
        }

        updateTimeAgoInAllPosts(firstParam, post.updatedAt);
      });
    } else if (type === "jobs") {
      // Processing company posts data
      const companyPostsElement =
        uniqueContainer.querySelector("#companyJobsLL");

      if (
        responseData?.body[0]?.gpt_response &&
        responseData?.body[0]?.gpt_response !== "<div>Not enough data</div>"
      ) {
        let modifiedData = responseData?.body[0]?.gpt_response.replaceAll(
          "<div>Not enough data</div>",
          ""
        );

        companyPostsElement.innerHTML =
          '<div class="collapsedll-job">' +
          (modifiedData ||
            "<div class='noDataFound'> No company posts data found</div>") +
          "</div>" +
          '<div id="toggleTextll-job">See more...</div>';

        uniqueContainer
          .querySelector("#toggleTextll-job")
          .addEventListener("click", function () {
            let postContainer =
              uniqueContainer.querySelector(".collapsedll-job");

            if (postContainer.style.height === "auto") {
              postContainer.style.height = "100px";
              this.innerText = "See more...";
            } else {
              postContainer.style.height = "auto";
              this.innerText = "See less";
            }
          });
      }
    } else {
      uniqueContainer.querySelector("#companyPostsLL").innerHTML =
        '<div class="collapsedll-posts">' +
        (responseData?.body[0]?.gpt_response
          ? responseData?.body[0]?.gpt_response
          : "<div class='noDataFound'> No company posts data found</div>") +
        "</div>" +
        '<div id="toggleTextll-posts">See more...</div>';

      uniqueContainer
        .querySelector("#toggleTextll-posts")
        .addEventListener("click", function () {
          let postContainer =
            uniqueContainer.querySelector(".collapsedll-posts");

          if (postContainer.style.height === "auto") {
            postContainer.style.height = "100px";
            this.innerText = "See more...";
          } else {
            postContainer.style.height = "auto";
            this.innerText = "See less";
          }
        });

      updateTimeAgoInAllPosts(
        "companyPostsLL",
        responseData.body[0]?.updatedAt
      );
    }

    return responseData; // Return responseData to check for pending status
  }

  // Example of triggering auto-reload
  uniqueContainer.querySelectorAll(".reload-btn").forEach((button) => {
    button.addEventListener("click", async function () {
      const reloadDiv = this.closest(".reload-div");
      const messageDiv = reloadDiv.nextElementSibling;

      if (messageDiv && messageDiv.tagName === "DIV") {
        messageDiv.style.display = "block"; // Show the div

        // Hide the div after 2 seconds
        setTimeout(() => {
          messageDiv.style.display = "none";
        }, 2000);
      }

      let contentText = this.closest(".reload-div")?.textContent.trim();

      let contentType = contentText.includes("Engagement Activity")
        ? "engaged"
        : contentText.includes("Self Written Content")
        ? "selfwritten"
        : contentText.includes("Jobs")
        ? "jobs"
        : contentText.includes("Company Posts:")
        ? "posts"
        : null;

      if (contentType) {
        // callReloadFunction(contentType);
        const responseData = await callReloadFunction(contentType);
        const hasPendingStatus = responseData.body.some(
          (item) => item.status === "pending"
        );
        if (hasPendingStatus) {
          startAutoReload(contentType);
        }
      }
    });
  });

  uniqueContainer
    .querySelector("#search-input-jobs")
    .addEventListener("input", function (event) {
      event.preventDefault();
      const searchValue = event.target.value.toLowerCase();

      // Get all job listings
      const jobElements = uniqueContainer.querySelectorAll(".jobll");

      jobElements.forEach((job) => {
        const jobTitle = job.querySelector(".jobtitle").innerText.toLowerCase();
        const jobLocation = job
          .querySelector(".joblocation")
          .innerText.toLowerCase();

        // Show or hide based on search value (title or location match)
        if (
          jobTitle.includes(searchValue) ||
          jobLocation.includes(searchValue)
        ) {
          job.style.display = "block";
        } else {
          job.style.display = "none";
        }
      });
    });

  // uniqueContainer
  //   .querySelector("#search-input-jobs")
  //   .addEventListener("input", function (event) {
  //     event.preventDefault();
  //     searchJobContent(event.target.value)
  //       .then((data) => {
  //         // Processing company posts data
  //         const companyPostsElement =
  //           uniqueContainer.querySelector("#companyPostsLL");

  //         if (data && data !== "<div>Not enough data</div>") {
  //           let modifiedData = responseData?.body[0]?.gpt_response.replaceAll(
  //             "<div>Not enough data</div>",
  //             ""
  //           );

  //           companyPostsElement.innerHTML =
  //             '<div class="collapsedll-posts">' +
  //             (modifiedData ||
  //               "<div class='noDataFound'> No company posts data found</div>") +
  //             "</div>" +
  //             '<div id="toggleTextll-posts">See more...</div>';

  //           uniqueContainer
  //             .querySelector("#toggleTextll-posts")
  //             .addEventListener("click", function () {
  //               let postContainer = document
  //                 .getElementById(uniqueId)
  //                 .querySelector(".collapsedll-posts");

  //               if (postContainer.style.height === "auto") {
  //                 postContainer.style.height = "100px";
  //                 this.innerText = "See more...";
  //               } else {
  //                 postContainer.style.height = "auto";
  //                 this.innerText = "See less";
  //               }
  //             });
  //         } else {
  //           companyPostsElement.innerHTML =
  //             "<div class='noDataFound'> No company posts data found</div>";
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   });

  // async function searchJobContent(str) {
  //   let { userToken } = await chrome.storage.local.get(["userToken"]);
  //   const response = await fetch("https://betabackext-beta.leadlabs.app/email-generator-list", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + userToken,
  //     },
  //     body: JSON.stringify({
  //       search_value: str,
  //       page_limit: 1,
  //     }),
  //   });
  //   const responseData = await response.json();
  //   return Promise.resolve(responseData);
  // }
  //I am continuing this code for talking points because It is easy to to genaralize the code for linkedIN and floatIcon
  //this file is genaralized to I am continuing here

  uniqueContainer
    .querySelector("#generateTalkingPoints")
    .addEventListener("click", async function (event) {
      event.preventDefault();

      uniqueContainer.querySelector(
        "#emailCreationDetails"
      ).children[0].style.display = "none";
      uniqueContainer.querySelector(
        "#emailCreationDetails"
      ).children[1].style.display = "none";
      uniqueContainer.querySelector(
        "#emailCreationDetails"
      ).children[2].style.display = "block";
      const container = uniqueContainer.querySelector(
        "#generated-talking-list-ll"
      );
      container.innerHTML = "";

      //loader
      fetch(chrome.runtime.getURL("pages/loader.html"))
        .then((r) => r.text())
        .then((html) => {
          uniqueContainer.querySelector(
            "#generated-talking-list-ll"
          ).innerHTML = html;
        });

      let { userToken } = await chrome.storage.local.get(["userToken"]);
      const companyDetailsBlock = uniqueContainer.querySelector(
        "#companyDetailsBlock"
      );

      const excludedIDs = ["companyTechStackLL", "companyLinesLL"];
      const excludedWords = ["Website Language", "Tech Stack"];

      // Find the parent of an excluded ID
      let excludedParents = new Set();
      excludedIDs.forEach((id) => {
        let element = document.getElementById(id);
        if (element?.parentElement) {
          excludedParents.add(element.parentElement);
        }
      });

      function extractTextRecursively(element) {
        // Skip if this element is a parent of an excluded ID
        if (excludedParents.has(element)) return "";

        let text = "";

        // If the element has text content, add it
        if (element.nodeType === Node.TEXT_NODE) {
          text += element.textContent.trim() + " ";
        }

        // Recursively process child elements
        element.childNodes.forEach((child) => {
          text += extractTextRecursively(child);
        });

        return text;
      }

      // Extract text from all children inside companyDetailsBlock
      let textContent = extractTextRecursively(companyDetailsBlock);

      // Remove excluded words
      textContent = textContent
        .split(/\s+/)
        .filter((word) => !excludedWords.includes(word))
        .join(" ");

      const elements = [
        { id: "profileAboutSection", label: "" },
        { id: "PersonalAttributes", label: "" },
        { id: "allPosts", label: "Self Written Content " },
      ];

      let combinedText = "";

      elements.forEach(({ id, label }) => {
        const element = uniqueContainer.querySelector(`#${id}`);
        if (element) {
          // Remove "See more" from the inner text
          const text = element.innerText.replace(/▼See more.../gi, "").trim();
          if (text) {
            combinedText += `${label}${text}\n`;
          }
        }
      });

      const response = await fetch(
        "https://betabackext-beta.leadlabs.app/create-personal-points",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
          body: JSON.stringify({
            companyData: textContent.substring(0, 10000),
            profileData: combinedText.substring(0, 10000),
            linkdinUrl:
              linkdinUrl !== ""
                ? linkdinUrl
                : uniqueContainer.querySelector("#linkedinUrl").innerText,
            Persona: uniqueContainer.querySelector(
              "#persona-listing-name-talking-ll"
            ).value,
          }),
        }
      );

      const responseData = await response.json();
      if (responseData) {
        container.innerHTML = "";
        await addDataForTalkingPoint(
          responseData?.body?.profileTalkingPoints,
          "Profile-Centric Talking Points"
        );
        await addDataForTalkingPoint(
          responseData?.body?.companyTalkingPoints,
          "Account-Centric Talking Points"
        );
      }
    });

  uniqueContainer
    .querySelector("#backToCreateContent")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector(
        "#emailCreationDetails"
      ).children[0].style.display = "block";
      uniqueContainer.querySelector(
        "#emailCreationDetails"
      ).children[1].style.display = "none";
      uniqueContainer.querySelector(
        "#emailCreationDetails"
      ).children[2].style.display = "none";
    });
  function addDataForTalkingPoint(data, title) {
    const selectElement = uniqueContainer.querySelector(
      "#generated-talking-list-ll"
    );
    // Create a section container for each title
    const sectionTitle = document.createElement("h2");
    sectionTitle.innerText = title;
    sectionTitle.classList.add("talking-header");
    selectElement.appendChild(sectionTitle); // Append the title for the section

    data.forEach((item) => {
      // Create a container for each question-answer pair
      const chatContainer = document.createElement("div");
      chatContainer.classList.add("chat-container");

      const questionDiv = document.createElement("div");
      questionDiv.classList.add("chat-question");
      questionDiv.innerHTML = ` ${item?.title}`;

      const answerDiv = document.createElement("div");
      answerDiv.classList.add("chat-answer");
      answerDiv.innerHTML = ` ${item?.description}`;

      // Append the question and answer to the chat container
      chatContainer.appendChild(questionDiv);
      chatContainer.appendChild(answerDiv);

      selectElement.appendChild(chatContainer);
    });
  }

  uniqueContainer.querySelectorAll(".content-pill").forEach((pill) => {
    pill.addEventListener("click", async function () {
      // Check the inner text and toggle display accordingly
      if (this.innerText.trim() === "New Message") {
        uniqueContainer.querySelector(
          "#emailCreationDetails"
        ).children[0].style.display = "block";
        uniqueContainer.querySelector(
          "#emailCreationDetails"
        ).children[1].style.display = "none";
        uniqueContainer.querySelector(
          "#emailCreationDetails"
        ).children[2].style.display = "none";
        uniqueContainer.querySelector(
          "#emailCreationDetails"
        ).children[3].style.display = "none";
      } else if (this.innerText.trim() === "Follow Up") {
        uniqueContainer.querySelector(
          "#emailCreationDetails"
        ).children[0].style.display = "none";
        uniqueContainer.querySelector(
          "#emailCreationDetails"
        ).children[1].style.display = "block";
        uniqueContainer.querySelector(
          "#emailCreationDetails"
        ).children[2].style.display = "none";
        uniqueContainer.querySelector(
          "#emailCreationDetails"
        ).children[3].style.display = "none";
        loadGenerateContentHistory(
          uniqueId,
          linkdinUrl !== ""
            ? linkdinUrl
            : uniqueContainer.querySelector("#linkedinUrl").innerText
        );
      } else if (this.innerText.trim() === "Personality Tuning") {
        uniqueContainer.querySelector("#regenerate-text").value = "";
        uniqueContainer.querySelector("#regenerated-data").innerHTML = "";
        uniqueContainer.querySelector(
          "#emailCreationDetails"
        ).children[0].style.display = "none";
        uniqueContainer.querySelector(
          "#emailCreationDetails"
        ).children[1].style.display = "none";
        uniqueContainer.querySelector(
          "#emailCreationDetails"
        ).children[2].style.display = "none";
        uniqueContainer.querySelector(
          "#emailCreationDetails"
        ).children[3].style.display = "block";
      }
    });
  });
}
