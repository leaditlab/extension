let uniqueContainer;
let canvasData;
let originalCanvasData;
let selectedIconData = null;
let linkedinUrlCanvas = "";
function loadCanvasScript(uniqueId, linkedinUrl) {
  linkedinUrlCanvas = linkedinUrl;
  uniqueContainer = document.getElementById(uniqueId);

  uniqueContainer
    .querySelector("#create-canvas-button")
    .addEventListener("click", (event) => {
      getCanvasPlaceHolder();
      addCategoryToSelect("selectCategory");

      uniqueContainer.querySelector("#popup-for-canvas-create").style.display =
        "flex";
    });

  uniqueContainer
    .querySelector("#canvasOpen")
    .addEventListener("click", () => showCanvasList());

  uniqueContainer
    .querySelector("#backTocanvasList")
    .addEventListener("click", (event) => {
      const id = uniqueContainer.querySelector("#canvas-id-ll").value;
      if (id !== "") {
        if (JSON.stringify(canvasData) !== JSON.stringify(originalCanvasData)) {
          event.preventDefault(); // stop going back
          uniqueContainer.querySelector(
            "#popup-for-canvas-unsave"
          ).style.display = "flex";

          // showNotification("You have unsaved changes!", "warning", uniqueId); // show your error message
          return;
        }
      }
      closeCallFunction();
    });

  uniqueContainer
    .querySelector("#close-unsave-canvas")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector("#popup-for-canvas-unsave").style.display =
        "none";
      closeCallFunction();
    });
  uniqueContainer
    .querySelector("#close-btn-conform-ll")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector("#popup-for-canvas-unsave").style.display =
        "none";
    });

  uniqueContainer
    .querySelector("#save-continue-canvas-ll")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector("#popup-for-canvas-unsave").style.display =
        "none";
      uniqueContainer.querySelector("#create-canvas").click();
      closeCallFunction();
    });
  function closeCallFunction() {
    uniqueContainer.querySelector(
      "#leadlabscanvas-details-page"
    ).style.display = "none";
    uniqueContainer.querySelector(
      "#leadlabscanvas-category-list"
    ).style.display = "none";

    uniqueContainer.querySelector("#leadlabscanvas-list").style.display =
      "block";
    showCanvasList();
    uniqueContainer.querySelector("#canvas-name-ll").value = "";
    uniqueContainer.querySelector("#canvas-id-ll").value = "";
    uniqueContainer.querySelector("#selectCategory-id").value = "";
    canvasData = [];
    originalCanvasData = [];
    uniqueContainer.querySelector("#create-canvas").textContent = "Save Canvas";
  }
  uniqueContainer.querySelector("#close-canvas-delete").onclick = () => {
    uniqueContainer.querySelector("#popup-for-canvas-delete").style.display =
      "none";
    window.canvasToDelete = null;
  };

  uniqueContainer
    .querySelector("#addCanvasBlock")
    .addEventListener("click", async () => {
      const lastBlock = canvasData[canvasData.length - 1] || {};
      const lastTags = lastBlock.input?.tags || [];
      const lastOutputTag = lastBlock?.outputTag || "default_output";

      const cleanTitle = lastOutputTag
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^\w_]/g, "");

      const newOutputTag = `${cleanTitle}`;

      const newTag = {
        tagname: newOutputTag,
        tagDes: "Canvas output",
      };

      const updatedTags = JSON.parse(JSON.stringify(lastTags));
      const canvasGroup = updatedTags.find(
        (group) => group.tagheader === "Canvas Variables"
      );

      if (canvasGroup) {
        canvasGroup.tagList.push(newTag);
      } else {
        updatedTags.push({
          tagheader: "Canvas Variables",
          tagList: [newTag],
        });
      }
      const newCanvasData = await getCanvasJSON(true);
      const newBlock = newCanvasData[newCanvasData.length - 1];

      const blockNumber = canvasData.length + 1; // if 1 existing, this will be 2
      const numberWords = [
        "Zero",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
      ];
      const titleText =
        blockNumber <= 10
          ? `Block ${numberWords[blockNumber]}`
          : `Block ${blockNumber}`;
      const OutputTag =
        titleText.toLowerCase().replace(/[^a-z0-9]/g, "") + "_output";
      newBlock.title = titleText;
      newBlock.outputTag = OutputTag;
      if (updatedTags.length > 1) {
        newBlock.input.tags = updatedTags;
      }
      canvasData.push(newBlock);
      displayCanvasJSON(canvasData);
    });

  uniqueContainer
    .querySelector("#popup-close-btn-canvas-ll")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector("#popup-for-canvas-output").style.display =
        "none";
    });

  uniqueContainer
    .querySelector("#create-canvas-ll")
    .addEventListener("click", async function () {
      const prompt = uniqueContainer.querySelector("#create-prompt").value;
      const categoriesId =
        uniqueContainer.querySelector("#selectCategory-id").value;

      if (prompt === "") {
        showNotification("Enter Canvas prompt.", "warning", uniqueId);
        return;
      }
      uniqueContainer.querySelector("#popup-for-canvas-create").style.display =
        "none";
      uniqueContainer.querySelector(
        "#popup-for-canvas-create-loader"
      ).style.display = "flex";
      animateCanvasSteps();
      uniqueContainer.querySelector("#create-canvas-ll").disabled = true;
      const data = {
        userPrompt: prompt,
        categoryId: categoriesId,
      };

      // Call the backend API
      let { userToken } = await chrome.storage.local.get(["userToken"]);

      try {
        const response = await fetch(
          "https://betabackext-beta.leadlabs.app/get-auto-canvas",
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

        if (responseData) {
          uniqueContainer.querySelector(
            "#popup-for-canvas-create-loader"
          ).style.display = "none";
          uniqueContainer.querySelector("#create-canvas-ll").disabled = false;
          uniqueContainer.querySelector("#create-canvas-loader").innerHTML = "";
          uniqueContainer.querySelector("#leadlabscanvas-list").style.display =
            "none";
          uniqueContainer.querySelector("#create-prompt").value = "";

          uniqueContainer.querySelector(
            "#leadlabscanvas-details-page"
          ).style.display = "block";
          await addCategoryToSelect("selectCategory-canvas");

          uniqueContainer.querySelector("#selectCategory-id").value =
            responseData?.data?.categoryId;
          const matchedIcon = categoryIconList.find(
            (icon) => icon.id === String(responseData.categoryIcon)
          );
          const selected = uniqueContainer.querySelector(".selectedCategory");
          selected.innerHTML = `${matchedIcon ? matchedIcon.svg : ""} <span>${
            responseData?.categoryTitle
          }</span>`;
          uniqueContainer.querySelector("#canvas-id-ll").value =
            responseData?.data?._id;
          uniqueContainer.querySelector("#canvas-name-ll").value =
            responseData?.data?.canvasTitle;
          showNotification(
            "Canvas Created Successfully!.",
            "success",
            uniqueId
          );
          showCanvasList(true);
          displayCanvasJSON(responseData?.data?.canvasJson);
          canvasData = responseData?.data?.canvasJson;
        }
      } catch (error) {
        showNotification("Error contacting the server.", "warning", uniqueId);
      }
    });

  function animateCanvasSteps() {
    const messages = [
      "Expanding your prompt into a detailed blueprint…",
      "Transforming your request into a tailored, actionable plan…",
      "Identifying web search needs with Perplexity…",
      "Routing complex logic and synthesis to Claude’s advanced AI…",
      "Designing your custom canvas structure…",
      "Building a visually clear and effective layout for your workflow…",
      "Generating and deploying all blocks in LeadLabs…",
      "Assembling every piece and launching your interactive canvas now…",
    ];

    const previewStepsContainer = uniqueContainer.querySelector(
      "#create-canvas-loader"
    );
    previewStepsContainer.innerHTML = ""; // Clear previous content

    const displayQueue = [];

    // Create steps and lines
    messages.forEach((msg, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "description-wrapper";
      wrapper.style.display = "none";
      wrapper.style.alignItems = "center";

      const iconDiv = document.createElement("div");
      iconDiv.className = "preview-check-icon";
      iconDiv.innerHTML = `<div class="loading-p-circle"></div>`;

      const desc = document.createElement("div");
      desc.className = "description";
      desc.innerText = msg;

      wrapper.appendChild(iconDiv);
      wrapper.appendChild(desc);
      previewStepsContainer.appendChild(wrapper);
      displayQueue.push(wrapper);

      if (index < messages.length - 1) {
        const line = document.createElement("div");
        line.className = "loader-line-ll";
        line.style.display = "none";
        previewStepsContainer.appendChild(line);
        displayQueue.push(line);
      }
    });

    let currentIndex = 0;

    const interval = setInterval(() => {
      const current = displayQueue[currentIndex];

      if (!current) {
        clearInterval(interval);
        // previewStepsContainer.style.display = "none";

        const lastStep = displayQueue[currentIndex - 1];
        if (lastStep && lastStep.classList.contains("description-wrapper")) {
          const lastIcon = lastStep.querySelector(".preview-check-icon");
          // if (lastIcon) {
          //   lastIcon.innerHTML = `
          //   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          //     <path d="M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4018 10.4L11.6438 6.1574L10.7954 5.309L7.4018 8.7032L5.7044 7.0058L4.856 7.8542L7.4018 10.4Z" fill="#2FA884"/>
          //   </svg>`;
          // }
        }

        return;
      }

      current.style.display = current.classList.contains("description-wrapper")
        ? "flex"
        : "block";

      if (
        currentIndex > 0 &&
        displayQueue[currentIndex - 1].classList.contains("description-wrapper")
      ) {
        const prevIcon = displayQueue[currentIndex - 1].querySelector(
          ".preview-check-icon"
        );
        if (prevIcon) {
          prevIcon.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4018 10.4L11.6438 6.1574L10.7954 5.309L7.4018 8.7032L5.7044 7.0058L4.856 7.8542L7.4018 10.4Z" fill="#2FA884"/>
          </svg>`;
        }
      }

      currentIndex++;
    }, 1000);
  }

  async function getCanvasJSON(status) {
    //loader
    fetch(chrome.runtime.getURL("pages/loader.html"))
      .then((r) => r.text())
      .then((html) => {
        uniqueContainer.querySelector("#create-custome-canvas").innerHTML =
          html;
      });

    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/get-canvas-json",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      }
    );

    if (status) {
      return await response.json();
    } else {
      canvasData = await response.json();
      displayCanvasJSON(canvasData);
    }
  }

  const textarea = uniqueContainer.querySelector("#create-prompt");
  let placeholderData = [];
  let currentIndex = 0;
  let charIndex = 0;
  let typingInterval;
  const delayAfterFullText = 2000;
  textarea.addEventListener("input", () => {
    clearInterval(typingInterval);
    clearTimeout(typingTimeout);
    charIndex = 0;
    currentIndex = 0;
  });

  async function getCanvasPlaceHolder() {
    let { userToken } = await chrome.storage.local.get(["userToken"]);

    try {
      const response = await fetch(
        "https://betabackext-beta.leadlabs.app/get-canvas-placeholder",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        }
      );

      const data = await response.json();
      showSuggestion(data);
      if (Array.isArray(data) && data.length > 0) {
        clearInterval(typingInterval);
        placeholderData = data;
        currentIndex = 0;
        charIndex = 0;
        typePlaceholder();
      } else {
        textarea.placeholder = "Enter your prompt ";
      }
    } catch (error) {
      console.error("Error fetching placeholder data:", error);
      textarea.placeholder = "Enter your prompt";
    }
  }

  function typePlaceholder() {
    const fullText = placeholderData[currentIndex].desc;
    const commonPrefix = "I want to ";
    const dynamicText = fullText.startsWith(commonPrefix)
      ? fullText.slice(commonPrefix.length)
      : fullText;

    textarea.placeholder = commonPrefix; // Set static part immediately

    typingInterval = setInterval(() => {
      textarea.placeholder =
        commonPrefix + dynamicText.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === dynamicText.length) {
        clearInterval(typingInterval);
        typingTimeout = setTimeout(() => {
          currentIndex = (currentIndex + 1) % placeholderData.length;
          charIndex = 0;
          typePlaceholder();
        }, delayAfterFullText);
      }
    }, 20);
  }

  uniqueContainer
    .querySelector("#skip-canvas")
    .addEventListener("click", (event) => {
      uniqueContainer.querySelector("#popup-for-canvas-create").style.display =
        "none";
      clearInterval(typingInterval);
      placeholderData = "";
      currentIndex = 0;
      charIndex = 0;
      uniqueContainer.querySelector("#leadlabscanvas-list").style.display =
        "none";
      uniqueContainer.querySelector(
        "#leadlabscanvas-details-page"
      ).style.display = "block";
      addCategoryToSelect("selectCategory-canvas");
      getCanvasJSON();
    });
  function showSuggestion(data) {
    const container = uniqueContainer.querySelector("#placeholder-suggestion");
    const textarea = uniqueContainer.querySelector("#create-prompt");

    container.innerHTML = ""; // clear previous content

    data.forEach((item) => {
      const suggestionDiv = document.createElement("div");
      suggestionDiv.textContent = item.button;
      suggestionDiv.className = "suggestion-canvas";

      // On click, set the textarea value to the desc
      suggestionDiv.addEventListener("click", () => {
        clearInterval(typingInterval);
        textarea.value = item.desc; // Copy desc to textarea
        textarea.placeholder = "";
      });

      container.appendChild(suggestionDiv);
    });
  }

  uniqueContainer.querySelector("#close-btn-create-ll").onclick = () => {
    // Hide popup
    uniqueContainer.querySelector("#popup-for-canvas-create").style.display =
      "none";

    // Stop typing animation
    clearInterval(typingInterval);
    closeCallFunction();
  };
  uniqueContainer.querySelector("#close-btn-regenerate-ll").onclick = () => {
    // Hide popup
    uniqueContainer.querySelector("#popup-for-regenrate-prompt").style.display =
      "none";
  };
  uniqueContainer
    .querySelector("#create-canvas")
    .addEventListener("click", async function () {
      let api;
      const name = uniqueContainer.querySelector("#canvas-name-ll").value;
      const id = uniqueContainer.querySelector("#canvas-id-ll").value;
      const categoryId =
        uniqueContainer.querySelector("#selectCategory-id").value;
      if (name === "") {
        showNotification("Enter Canvas title.", "warning", uniqueId);
        return;
      }
      if (categoryId === "") {
        showNotification("Select Category.", "warning", uniqueId);
        return;
      }
      if (id !== "") {
        api = "https://betabackext-beta.leadlabs.app/edit-canvas";
      } else {
        api = "https://betabackext-beta.leadlabs.app/create-canvas";
      }

      canvasData.forEach((block) => {
        if (block.textPrompt) {
          block.textPrompt = convertSpansToTags(block.textPrompt);
        }
      });

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
        canvasTitle: name,
        canvas: canvasData,
        categoryId: categoryId,
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
        if (responseData) {
          canvasData = responseData?.data?.canvasJson
            ? JSON.parse(JSON.stringify(responseData?.data?.canvasJson))
            : [];
          originalCanvasData = responseData?.data?.canvasJson
            ? JSON.parse(JSON.stringify(responseData?.data?.canvasJson))
            : [];
          displayCanvasJSON(canvasData);
          showCanvasList(true);
          if (id !== "") {
            showNotification(
              "Canvas Edited Successfully!.",
              "success",
              uniqueId
            );
          } else {
            uniqueContainer.querySelector("#canvas-id-ll").value =
              responseData?.canvasId;
            showNotification(
              "Canvas Created Successfully!.",
              "success",
              uniqueId
            );
          }
        }
      } catch (error) {
        showNotification("Error contacting the server.", "warning", uniqueId);
      }
    });
  uniqueContainer
    .querySelector("#run-canvas")
    .addEventListener("click", async function (e) {
      e.stopPropagation(); // Prevent immediate document click closing
      const id = uniqueContainer.querySelector("#canvas-id-ll").value;

      if (id === "") {
        showNotification("Save and Run the canvas.", "warning", uniqueId);
        return;
      }

      runCanvasWithPersona(id, true);
    });

  uniqueContainer.querySelector("#delete-canvas-ll").onclick = async () => {
    let id = uniqueContainer.querySelector("#canvas-id-ll").value;
    if (!id) return;

    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/delete-canvas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({ id }),
      }
    );

    const responseData = await response.json();
    if (responseData) {
      showNotification(
        "Custom Canvas Deleted Successfully!",
        "success",
        uniqueId
      );
      showCanvasList(true, true);
      uniqueContainer.querySelector("#canvas-id-ll").value = "";
    }

    // Close the popup
    uniqueContainer.querySelector("#popup-for-canvas-delete").style.display =
      "none";
    // window.canvasToDelete = null;
  };

  async function updateCanvasStatus(personaId, newStatus) {
    // API call to update the status
    // Implement delete functionality
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/update-canvas-status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          _id: personaId,
          canvasStatus: newStatus,
        }),
      }
    );
    const responseData = await response.json();
    if (responseData) {
      showCanvasList();
      showNotification(
        "Custom Canvas status updated Successfully!",
        "success",
        uniqueId
      );
    }
  }

  uniqueContainer
    .querySelector("#submit-category-ll")
    .addEventListener("click", async function () {
      let api;
      const categoryName = uniqueContainer.querySelector("#categoryName").value;
      const id = uniqueContainer.querySelector("#category-id").value;

      if (!categoryName.trim()) {
        showNotification(
          "Please select an icon and enter a name.",
          "warning",
          uniqueId
        );
        return;
      }
      if (id !== "") {
        api = "https://betabackext-beta.leadlabs.app/edit-category";
      } else {
        api = "https://betabackext-beta.leadlabs.app/create-category";
      }

      // Fetch the content from loader.html and update the innerHTML once fetched
      fetch(chrome.runtime.getURL("pages/loader.html"))
        .then((response) => response.text())
        .then((html) => {
          uniqueContainer.querySelector("#category-loader").innerHTML = html;
        })
        .catch((error) => {
          console.error("Error fetching loader.html:", error);
        });

      // Prepare the data to send to the backend API

      const data = {
        categoryTitle: categoryName,
        categoryicon: selectedIconData,
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
        if (responseData) {
          uniqueContainer.querySelector("#category-loader").innerHTML = "";
          uniqueContainer.querySelector("#categoryName").value = "";
          uniqueContainer.querySelector("#category-id").value = "";
          uniqueContainer.querySelector("#selectedIcon").innerHTML = "";

          uniqueContainer.querySelector(
            "#popup-for-canvas-create-category"
          ).style.display = "none";

          uniqueContainer.querySelector(
            "#leadlabscanvas-category-list"
          ).style.display = "none";
          uniqueContainer.querySelector(
            "#popup-for-canvas-create"
          ).style.display = "flex";
          addCategoryToSelect("selectCategory");

          if (id !== "") {
            showNotification(
              "Category Edited Successfully!.",
              "success",
              uniqueId
            );
          } else {
            showNotification(
              "category Created Successfully!.",
              "success",
              uniqueId
            );
          }
        }
      } catch (error) {
        showNotification("Error contacting the server.", "warning", uniqueId);
      }
    });

  uniqueContainer
    .querySelector("#manage-categories-ll")
    .addEventListener("click", () => {
      uniqueContainer.querySelector("#popup-for-canvas-create").style.display =
        "none";
      uniqueContainer.querySelector(
        "#leadlabscanvas-category-list"
      ).style.display = "block";
      uniqueContainer.querySelector(
        "#leadlabscanvas-details-page"
      ).style.display = "none";
      uniqueContainer.querySelector("#leadlabscanvas-list").style.display =
        "none";
      categoryList();
    });
  uniqueContainer
    .querySelector("#manage-categories-canvas-ll")
    .addEventListener("click", () => {
      uniqueContainer.querySelector("#popup-for-canvas-create").style.display =
        "none";
      uniqueContainer.querySelector(
        "#leadlabscanvas-category-list"
      ).style.display = "block";
      uniqueContainer.querySelector(
        "#leadlabscanvas-details-page"
      ).style.display = "none";
      uniqueContainer.querySelector("#leadlabscanvas-list").style.display =
        "none";
      categoryList();
    });

  uniqueContainer
    .querySelector("#close-category-create")
    .addEventListener("click", () => {
      uniqueContainer.querySelector(
        "#popup-for-canvas-create-category"
      ).style.display = "none";
    });

  uniqueContainer
    .querySelector("#backTocanvasAuto-create")
    .addEventListener("click", () => {
      uniqueContainer.querySelector("#popup-for-canvas-create").style.display =
        "flex";
      uniqueContainer.querySelector(
        "#leadlabscanvas-category-list"
      ).style.display = "none";
      uniqueContainer.querySelector(
        "#leadlabscanvas-details-page"
      ).style.display = "none";
      uniqueContainer.querySelector("#leadlabscanvas-list").style.display =
        "block";
    });

  async function categoryList() {
    const categories = await getCategory(); // Fetch categories
    const container = uniqueContainer.querySelector("#category-list-ll");
    container.innerHTML = ""; // Clear existing

    categories.forEach((category) => {
      // Create category card
      const card = document.createElement("div");
      card.className = "category-card-ll";

      // Category info
      const info = document.createElement("div");
      info.className = "category-info";

      const iconSpan = document.createElement("span");
      iconSpan.className = "category-icon";
      // iconSpan.innerHTML = category.categoryicon || "";
      const matchedIcon = categoryIconList.find(
        (icon) => icon.id === category.categoryicon
      );

      // If found, set its SVG
      if (matchedIcon) {
        iconSpan.innerHTML = matchedIcon.svg;
      } else {
        iconSpan.innerHTML = ""; // fallback (optional)
      }
      const titleSpan = document.createElement("span");
      titleSpan.className = "category-title";
      titleSpan.textContent = category.categoryTitle;

      info.appendChild(iconSpan);
      info.appendChild(titleSpan);

      // Menu wrapper
      const menuWrapper = document.createElement("div");
      menuWrapper.className = "menu-wrapper";

      // Three-dot button
      const dotMenu = document.createElement("button");
      dotMenu.className = "more-btn";
      dotMenu.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 7.0498C8.52467 7.0498 8.9502 7.47533 8.9502 8C8.9502 8.52467 8.52467 8.9502 8 8.9502C7.47533 8.9502 7.0498 8.52467 7.0498 8C7.0498 7.47533 7.47533 7.0498 8 7.0498Z" fill="#2B303B" stroke="#99A0AE" stroke-width="0.1"/>
      <path d="M3.75 9C4.30228 9 4.75 8.55228 4.75 8C4.75 7.44772 4.30228 7 3.75 7C3.19772 7 2.75 7.44772 2.75 8C2.75 8.55228 3.19772 9 3.75 9Z" fill="#2B303B"/>
      <path d="M12.25 9C12.8023 9 13.25 8.55228 13.25 8C13.25 7.44772 12.8023 7 12.25 7C11.6977 7 11.25 7.44772 11.25 8C11.25 8.55228 11.6977 9 12.25 9Z" fill="#2B303B"/>
    </svg>`;

      // Dropdown menu
      const dropdown = document.createElement("div");
      dropdown.className = "category-dropdown hidden"; // Add .hidden to hide initially

      // Edit option
      const editOption = document.createElement("div");
      editOption.className = "category-dropdown-item";
      editOption.textContent = "Edit";
      editOption.onclick = () =>
        editCategory({
          id: category._id,
          title: category.categoryTitle,
          icon: category.categoryicon,
        });

      // Delete option
      const deleteOption = document.createElement("div");
      deleteOption.className = "category-dropdown-item";
      deleteOption.textContent = "Delete";
      deleteOption.onclick = () => {
        deleteCategory(category._id); // Call your API
      };

      dropdown.appendChild(editOption);
      dropdown.appendChild(deleteOption);

      // Toggle dropdown on dot click
      dotMenu.onclick = (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
      };

      // Close dropdown if clicked outside
      document.addEventListener("click", () => {
        dropdown.classList.add("hidden");
      });

      // Append menu and dropdown to wrapper
      menuWrapper.appendChild(dotMenu);
      menuWrapper.appendChild(dropdown);

      // Append info and menu to card
      card.appendChild(info);
      card.appendChild(menuWrapper);

      // Append card to container
      container.appendChild(card);
    });
  }

  // Example functions
  function editCategory({ id, title, icon }) {
    uniqueContainer.querySelector(
      "#popup-for-canvas-create-category"
    ).style.display = "flex";
    uniqueContainer.querySelector("#categoryName").value = title;
    uniqueContainer.querySelector("#category-id").value = id;
    selectedIconData = icon;
    assignCategoryIcon();
    const matchedIcon = categoryIconList.find((ic) => ic.id === icon);
    if (matchedIcon) {
      uniqueContainer.querySelector("#selectedIcon").innerHTML =
        matchedIcon.svg;
    }
  }

  async function deleteCategory(id) {
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/delete-category",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({ id }),
      }
    );

    const responseData = await response.json();
    if (responseData) {
      showNotification("Category Deleted Successfully!", "success", uniqueId);
      categoryList();
      addCategoryToSelect("selectCategory");
    }
  }
}
//in edit time from backend i am getting {{###}} data so i am converting into span tag here
const restoreHighlightTags = (textPrompt) => {
  return textPrompt.replace(/{{(.*?)}}/g, (_, tagName) => {
    const cleanName = tagName.trim();
    return `<span class="highlighted-tag" contenteditable="false"><span>${cleanName}</span><span class="cancel-tag" style="cursor: pointer; margin-left: 4px; font-size: 10px;font-weight: 600;">✕</span></span>`;
  });
};
//
const convertSpansToTags = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Replace each highlighted-tag with {{...}} text
  tempDiv.querySelectorAll(".highlighted-tag").forEach((el) => {
    const tagTextSpan = el.querySelector("span:not(.cancel-tag)");
    const tagText = tagTextSpan ? tagTextSpan.textContent.trim() : "";
    if (tagText) {
      el.replaceWith(document.createTextNode(`{{${tagText}}}`));
    } else {
      el.remove();
    }
  });

  // Replace <br> with \n
  tempDiv.querySelectorAll("br").forEach((br) => {
    br.replaceWith(document.createTextNode("\n"));
  });

  // Replace <div> with its content plus newline
  tempDiv.querySelectorAll("div").forEach((div) => {
    const fragment = document.createDocumentFragment();
    Array.from(div.childNodes).forEach((node, idx, arr) => {
      fragment.appendChild(node.cloneNode(true));
    });
    // Add a newline after each div
    fragment.appendChild(document.createTextNode("\n"));
    div.replaceWith(fragment);
  });

  // Remove any leftover empty spans
  tempDiv.querySelectorAll("span").forEach((el) => {
    if (!el.textContent.trim()) el.remove();
  });

  // Remove &nbsp;, collapse multiple newlines/spaces, trim
  let result = tempDiv.textContent
    .replace(/\u00a0/g, " ")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ ]{2,}/g, " ")
    .trim();

  return result;
};
async function showCanvasList(status, deleteStatus) {
  //loader
  if (!status || status === undefined) {
    fetch(chrome.runtime.getURL("pages/loader.html"))
      .then((r) => r.text())
      .then((html) => {
        uniqueContainer.querySelector("#leadlabs-all-canvas").innerHTML = html;
      });
    uniqueContainer.querySelector(
      "#leadlabscanvas-details-page"
    ).style.display = "none";

    uniqueContainer.querySelector("#leadlabscanvas-list").style.display =
      "block";
  }
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/get-all-canvas",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    }
  );

  const responseData = await response.json();

  if (status) {
    canvasList =
      responseData?.data?.map((c) => ({
        _id: c._id,
        canvasTitle: c.canvasTitle,
        categoryicon: c.categoryicon,
        favorites: c.favorites,
        categoryTitle: c.categoryTitle,
      })) || [];

    // Save to local storage
    await chrome.storage.local.set({ canvasList });
    //for delete the canvas I want to stay in the same page also want to update the canvas list so we are maintaineing the status of delete
    if (!deleteStatus || deleteStatus === undefined) {
      return;
    }
  }

  if (responseData) {
    uniqueContainer.querySelector("#leadlabs-all-canvas").innerHTML = "";
    generatedCanvas(responseData.data);
  }
}
async function runCanvasWithPersona(id, status) {
  const data = {
    linkedinUrl:
      linkedinUrlCanvas !== ""
        ? linkedinUrlCanvas
        : uniqueContainer.querySelector("#linkedinUrl").innerText,
    canvasId: id,
    reRun: status,
  };

  // Call the backend API
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const htmlloader = await fetch(chrome.runtime.getURL("pages/loader.html"))
    .then((res) => res.text())
    .catch((err) => {
      console.error("Failed to load canvasoutput.html", err);
      return "<div>Error loading output view.</div>";
    });
  uniqueContainer.querySelector("#popup-for-canvas-output").style.display =
    "flex";
  uniqueContainer.querySelector("#canvas-output").innerHTML = htmlloader;
  try {
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/execute-canvas",
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
    if (responseData) {
      executeCanvasId(responseData?.executionId, responseData);
    }
  } catch (error) {
    showNotification("Error contacting the server.", "warning", uniqueId);
  }
}
async function executeCanvasId(id, data) {
  const { userToken } = await chrome.storage.local.get(["userToken"]);
  const container = uniqueContainer.querySelector("#canvas-output");

  const loaderHTML = await fetch(
    chrome.runtime.getURL("pages/canvasLoader.html")
  ).then((r) => r.text());
  container.innerHTML = loaderHTML;

  const blockList = container.querySelector("#block-list-ll");
  const popupContent = uniqueContainer.querySelector("#scroll-output-canvas");
  let previousStatuses = [];
  const stepCollapseState = {};
  const typingTrackers = {};

  // Global variables for scroll management
  let userHasScrolledUp = false;
  let lastScrollTop = 0;
  let autoScrolling = false; // Flag to  scroll
  // Detect user scrolling
  //if a user scroll manualy then we need to stop the scroll down will type and add markdown text
  function detectUserScroll(e) {
    if (autoScrolling) return; // Prevent detection during auto-scroll

    const currentScrollTop = e.target.scrollTop;

    // Detect if user scrolled up
    if (currentScrollTop < lastScrollTop) {
      userHasScrolledUp = true;
    }

    lastScrollTop = currentScrollTop;
  }
  // Add scroll listener if a user do the scroll
  if (popupContent) {
    popupContent.addEventListener("scroll", detectUserScroll, {
      passive: true,
    });
  }

  // Smooth scroll function that respects user scrolling
  function smoothScrollToCard(card, behavior = "smooth", block = "end") {
    if (userHasScrolledUp) return; //if user do the scroll up then then we are making the  userHasScrolledUp true
    //if userHasScrolledUp true then we are not making the scroll down
    const container = uniqueContainer.querySelector("#scroll-output-canvas");

    if (container.scrollHeight > container.clientHeight) {
      container.scrollTop = container.scrollHeight; // Scroll to bottom
    }
  }
  //this is the function which we are calling every 2 sec until the all the object status is sucess or failed
  async function poll() {
    try {
      const response = await fetch(
        "https://betabackext-beta.leadlabs.app/get-executed-canvas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
          body: JSON.stringify({ executionId: id }),
        }
      );

      const responseData = await response.json();
      if (!blockList) return;

      if (uniqueContainer.querySelector("#canvas-run-date").innerHTML === "") {
        uniqueContainer.querySelector("#canvas-run-date").innerHTML = timeAgo(
          responseData?.createdAt,
          "Canvas last run"
        );
      }

      const stepStatuses = responseData?.stepStatuses || [];
      const lastStep = stepStatuses[stepStatuses.length - 1];
      const hasChanged =
        JSON.stringify(previousStatuses) !== JSON.stringify(stepStatuses);

      if (!hasChanged) {
        setTimeout(poll, 2000);
        return;
      }

      previousStatuses = stepStatuses;

      // Create all cards but keep hidden until step is done
      for (const step of stepStatuses) {
        const existingCard = blockList.querySelector(
          `[data-step-id="${step.stepId}"]`
        );

        if (!existingCard) {
          const card = document.createElement("div");
          card.className = "card generated-card";
          card.dataset.stepId = step.stepId;
          card.style.display = "none";

          const cardContent = document.createElement("div");
          cardContent.className = "card-content";

          const cardHeader = document.createElement("div");
          cardHeader.className = "card-header";

          const cardTitle = document.createElement("div");
          cardTitle.className = "card-title";

          const cardIcon = document.createElement("div");
          cardIcon.className = "card-icon";
          cardIcon.innerHTML = `<i data-lucide="activity"></i>`;

          const stepLabel = document.createElement("span");
          stepLabel.textContent = step.stepId;

          const toggleBtn = document.createElement("button");
          toggleBtn.textContent = "▼";
          toggleBtn.className = "expand-btn";
          toggleBtn.style.marginLeft = "auto";

          cardTitle.appendChild(stepLabel);
          cardTitle.appendChild(toggleBtn);
          cardHeader.appendChild(cardTitle);
          cardContent.appendChild(cardHeader);

          const subtasks = document.createElement("div");
          subtasks.className = "subtasks";

          const subtask = document.createElement("div");
          subtask.className = "subtask";

          const resultContainer = document.createElement("div");
          resultContainer.className = "canvas-result";
          resultContainer.style.display = "none";

          cardHeader.addEventListener("click", () => {
            const isVisible = resultContainer.style.display === "block";
            resultContainer.style.display = isVisible ? "none" : "block";
            toggleBtn.textContent = isVisible ? "▼" : "▲";
            stepCollapseState[step.stepId] = !isVisible;
          });

          subtask.appendChild(resultContainer);
          subtasks.appendChild(subtask);
          cardContent.appendChild(subtasks);
          card.appendChild(cardContent);
          blockList.appendChild(card);
        }
      }

      // Typing/Execution logic
      for (let i = 0; i < stepStatuses.length; i++) {
        const step = stepStatuses[i];
        const currentCard = blockList.querySelector(
          `[data-step-id="${step.stepId}"]`
        );
        const resultContainer = currentCard?.querySelector(".canvas-result");
        const subtask = currentCard?.querySelector(".subtask");
        const toggleBtn = currentCard?.querySelector(".expand-btn");
        const stepLabel = currentCard?.querySelector(".card-title span");

        if (
          !resultContainer ||
          !subtask ||
          !toggleBtn ||
          !currentCard ||
          !stepLabel
        )
          continue;

        // Initialize typing tracker if not exists
        if (!typingTrackers[step.stepId]) {
          typingTrackers[step.stepId] = {
            typed: "",
            inProgress: false,
            cancelled: false,
            hasShownTyping: false,
            initialScrollDone: false, // Track if initial scroll was done
          };
        }

        const tracker = typingTrackers[step.stepId];
        const currentResult = step.result || "Searching... ";
        // Check if this is a Perplexity model
        const isPerplexityModel =
          step.modelUsed &&
          (step.modelUsed.includes("Perplexity Sonar") ||
            step.modelUsed.includes("Perplexity Sonar Pro") ||
            step.modelUsed.includes("Perplexity Reasoning Pro (SEC)") ||
            step.modelUsed.includes("Perplexity Reasoning"));

        if (step.status === "running" && step.result === "") {
          if (i === 0) {
            // First index running empty → show card
            currentCard.style.display = "block";
          } else {
            // Other running empty → hide card if result is empty
            currentCard.style.display = "none";
            continue;
          }
        }
        // Show "Now executing..." above card while running (but card still hidden)
        if (step.status === "running" && !stepLabel.dataset.tempShown) {
          stepLabel.dataset.tempShown = "true";

          const execNotice = document.createElement("div");
          execNotice.className = "exec-notice";
          execNotice.innerText = `Now executing ${step.stepId}...`;
          execNotice.style.textAlign = "start";
          execNotice.style.fontWeight = "400";
          execNotice.style.fontSize = "13px";
          execNotice.style.padding = "5px 0";
          execNotice.style.color = "rgb(145, 149, 150)";

          currentCard.parentNode.insertBefore(execNotice, currentCard);

          setTimeout(() => {
            execNotice.remove();
            // ✅ Immediately show the card after execNotice is removed
            currentCard.style.display = "block";
          }, 1000);
        }

        // Step is running → typing effect (but keep card hidden)
        if (
          step.status === "running" &&
          currentResult.length > tracker.typed.length &&
          !tracker.inProgress &&
          !tracker.cancelled
        ) {
          subtask.classList.add("in-progress");
          currentCard.style.display = "block";
          resultContainer.style.display = "block";

          toggleBtn.textContent = "▲";

          tracker.inProgress = true;

          // Modified typeEffectAppend with scroll management
          typeEffectAppendWithScrollControl(
            resultContainer,
            tracker,
            currentResult,
            currentCard,
            15,
            () => {
              tracker.inProgress = false;
            }
          );
        }

        // Step finished → handle Perplexity models with artificial typing effect
        else if (step.status === "success") {
          subtask.classList.remove("in-progress");
          //here if all the status is success then we are skiping the typing for isPerplexityModel model
          //as it is doing typing effect for success
          const allDone = stepStatuses.every((s) => s.status === "success");
          //to know the status of next step
          const nextStep = stepStatuses[i + 1];
          const nextStepIsSuccess = nextStep && nextStep.status === "success";
          // For Perplexity models, show typing effect first if not already shown
          if (
            isPerplexityModel &&
            !tracker.hasShownTyping &&
            !tracker.inProgress &&
            !allDone &&
            !nextStepIsSuccess
          ) {
            tracker.hasShownTyping = true;
            tracker.inProgress = true;

            // Show card immediately for Perplexity models
            currentCard.style.display = "block";
            subtask.classList.add("in-progress");
            resultContainer.style.display = "block";
            toggleBtn.textContent = "▲";

            // Start typing effect
            tracker.typed = ""; // Reset typed content
            typeEffectAppendWithScrollControl(
              resultContainer,
              tracker,
              currentResult,
              currentCard,
              20,
              () => {
                // After typing is complete
                tracker.inProgress = false;
                subtask.classList.remove("in-progress");
                subtask.classList.add("completed");

                // Wait 500ms then show final markdown
                setTimeout(() => {
                  const rawMarkdown = step.result
                    .replace(/<br\s*\/?>/gi, "\n")
                    .replace(/```markdown/g, "")
                    .replace(/```/g, "")
                    .replace(/\n/g, "<br>");

                  const parsedHtml = marked.parse(rawMarkdown);
                  const sanitizedHtml = DOMPurify.sanitize(parsedHtml);
                  resultContainer.innerHTML = sanitizedHtml;

                  resultContainer.addEventListener("copy", (e) => {
                    e.preventDefault();
                    const selection = window.getSelection().toString();
                    e.clipboardData.setData("text/plain", selection);
                  });

                  smoothScrollToCard(currentCard, "smooth", "end");
                }, 500);
              }
            );
          }
          // For non-Perplexity models or already processed Perplexity models
          else if (
            !isPerplexityModel ||
            tracker.hasShownTyping ||
            allDone ||
            nextStepIsSuccess
          ) {
            subtask.classList.add("completed");
            tracker.cancelled = true;
            tracker.inProgress = false;

            const rawMarkdown = step.result
              .replace(/<br\s*\/?>/gi, "\n")
              .replace(/```markdown/g, "")
              .replace(/```/g, "")
              .replace(/\n/g, "<br>");

            const parsedHtml = marked.parse(rawMarkdown);
            const sanitizedHtml = DOMPurify.sanitize(parsedHtml);
            resultContainer.innerHTML = sanitizedHtml;
            resultContainer.style.display = "block";
            toggleBtn.textContent = "▲";

            resultContainer.addEventListener("copy", (e) => {
              e.preventDefault();
              const selection = window.getSelection().toString();
              e.clipboardData.setData("text/plain", selection);
            });

            // ✅ Show card now that step is done
            currentCard.style.display = "block";
            smoothScrollToCard(currentCard, "smooth", "end");
          }
        }

        // Pending step (not started yet) → keep card hidden
        if (step.status === "pending" && !resultContainer.innerHTML) {
          currentCard.style.display = "none";
          resultContainer.innerHTML = `
          <div style="display:flex;gap:10px;align-items: center;">
            <div class="loading-circle"></div>
            <span> ⏳ Waiting...</span>
          </div>
        `;
          resultContainer.style.display = "block";
          toggleBtn.textContent = "▲";
          // Keep card hidden until it starts typing or succeeds
        }
      }

      if (window.lucide) lucide.createIcons();

      // Collapse logic after all are done
      const allDone = stepStatuses.every(
        (s) => s.status === "success" || s.status === "failed"
      );
      if (allDone) {
        stepStatuses.forEach((step, index) => {
          const card = blockList.querySelector(
            `[data-step-id="${step.stepId}"]`
          );
          const resultContainer = card?.querySelector(".canvas-result");
          const toggleBtn = card?.querySelector(".expand-btn");

          if (card && resultContainer && toggleBtn) {
            const isLast = index === stepStatuses.length - 1;
            resultContainer.style.display = isLast ? "block" : "none";
            toggleBtn.textContent = isLast ? "▲" : "▼";
            stepCollapseState[step.stepId] = !isLast;
          }
        });
      }

      // if (lastStep.status !== "success" && lastStep.status !== "failed") {
      //   setTimeout(poll, 2000);
      // }
      const allStepsComplete = stepStatuses.every(
        (s) => s.status === "success" || s.status === "failed"
      );

      if (!allStepsComplete) {
        setTimeout(poll, 2000);
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  }
  // Modified typing function with scroll control
  function typeEffectAppendWithScrollControl(
    resultContainer,
    tracker,
    fullText,
    card,
    speed = 10,
    onComplete = null
  ) {
    if (tracker.cancelled) return;

    const textToAdd = fullText.substring(tracker.typed.length);
    if (textToAdd.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    let currentIndex = 0;
    let scrollCounter = 0; // Counter to limit scroll frequency

    function typeNextChar() {
      if (tracker.cancelled || currentIndex >= textToAdd.length) {
        tracker.typed = fullText;
        if (onComplete) onComplete();
        return;
      }

      const char = textToAdd[currentIndex];
      tracker.typed += char;
      resultContainer.innerHTML = tracker.typed.replace(/\n/g, "<br>");

      // Only scroll every 100 characters and ONLY if user hasn't scrolled up
      scrollCounter++;
      if (scrollCounter % 100 === 0 && !userHasScrolledUp) {
        smoothScrollToCard(card, "auto", "end");
      }

      currentIndex++;
      setTimeout(typeNextChar, speed);
    }

    typeNextChar();
  }
  let linkdinImage =
    data?.linkdinImage ||
    "https://betabackext-beta.leadlabs.app/imagepath/linkedin-profile-images/default-profile.jpg";
  fetch(chrome.runtime.getURL("pages/merger-flow-ui.html"))
    .then((response) => response.text())
    .then((html) => {
      uniqueContainer.querySelector("#persona-data-ll").innerHTML = html;
      uniqueContainer.querySelector("#profile-img-ll").src = linkdinImage;
      uniqueContainer.querySelector("#company-profile-ll").src =
        data?.linkedIncompanyimage;
      uniqueContainer.querySelector("#login-profile-ll").src =
        data?.loginUserImage;
      uniqueContainer.querySelector("#company-login-ll").src =
        data?.loginUserCompanyImage;
      uniqueContainer.querySelector("#leadlabs-logo-ll").src =
        chrome.runtime.getURL("assets/Favicon-4.png");
    })
    .catch((error) => {
      console.error("Error fetching loader.html:", error);
    });
  // uniqueContainer.querySelector("#persona-data-ll").innerHTML =
  //   '<div class="profileblockll">' +
  //   '<img src="' +
  //   linkdinImage +
  //   '" alt="profile image">' +
  //   "<div>" +
  //   data?.linkdinName +
  //   "</div></div>" +
  //   '<div class="profileblockll">' +
  //   '<img src="' +
  //   data?.linkedIncompanyimage +
  //   '" alt="profile image">' +
  //   "<div>" +
  //   data?.linkedIncompanyname +
  //   "</div>";

  const stepsPreview = data?.stepsPreview || [];

  if (stepsPreview.length) {
    const previewCard = document.createElement("div");
    previewCard.className = "card preview-card";

    const cardContent = document.createElement("div");
    cardContent.className = "card-content";

    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";

    const cardTitle = document.createElement("div");
    cardTitle.className = "card-title";
    cardTitle.innerHTML = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.9375 7.3125H1.6875C1.37684 7.3125 1.125 7.56434 1.125 7.875V10.125C1.125 10.4357 1.37684 10.6875 1.6875 10.6875H3.9375C4.24816 10.6875 4.5 10.4357 4.5 10.125V7.875C4.5 7.56434 4.24816 7.3125 3.9375 7.3125Z" stroke="#4C9BC6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.625 2.8125H11.25C10.9393 2.8125 10.6875 3.06434 10.6875 3.375V6.75C10.6875 7.06066 10.9393 7.3125 11.25 7.3125H14.625C14.9357 7.3125 15.1875 7.06066 15.1875 6.75V3.375C15.1875 3.06434 14.9357 2.8125 14.625 2.8125Z" stroke="#4C9BC6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14.625 10.6875H11.25C10.9393 10.6875 10.6875 10.9393 10.6875 11.25V14.625C10.6875 14.9357 10.9393 15.1875 11.25 15.1875H14.625C14.9357 15.1875 15.1875 14.9357 15.1875 14.625V11.25C15.1875 10.9393 14.9357 10.6875 14.625 10.6875Z" stroke="#4C9BC6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4.5 9H7.875" stroke="#4C9BC6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.6875 12.9375H9C8.70163 12.9375 8.41548 12.819 8.20451 12.608C7.99353 12.397 7.875 12.1109 7.875 11.8125V6.1875C7.875 5.88913 7.99353 5.60298 8.20451 5.39201C8.41548 5.18103 8.70163 5.0625 9 5.0625H10.6875" stroke="#4C9BC6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Steps`;

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "▼";
    toggleBtn.className = "expand-btn";
    toggleBtn.style.marginLeft = "auto";

    cardHeader.appendChild(cardTitle);
    cardHeader.appendChild(toggleBtn);
    cardContent.appendChild(cardHeader);

    const previewStepsContainer = document.createElement("div");
    previewStepsContainer.className = "preview-steps";

    const displayQueue = []; // Flat queue of elements to show one by one
    const wrappers = []; // Track main step wrappers for tick icons

    stepsPreview.forEach((step, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "description-wrapper";
      wrapper.style.display = "none";

      const icon = document.createElement("div");
      icon.className = "preview-check-icon";
      icon.innerHTML = `<div class="loading-p-circle"></div>`;

      const title = document.createElement("p");
      title.className = "description";

      // Create a container (span) to hold the title with images
      const titleContent = document.createElement("span");

      // Split the title by space or comma while preserving them
      step.title.split(/(\s|,)/).forEach((word) => {
        const wordLower = word.toLowerCase();
        let iconSrc = null;

        if (wordLower.includes("perplexity")) {
          iconSrc = chrome.runtime.getURL("assets/perplexity-icon.png");
        } else if (wordLower.includes("claude")) {
          iconSrc = chrome.runtime.getURL("assets/claude-icon.png");
        } else if (wordLower.includes("chatgpt")) {
          iconSrc = chrome.runtime.getURL("assets/chatgpt-icon.png");
        }

        if (iconSrc) {
          const img = document.createElement("img");
          img.src = iconSrc;
          img.alt = word;
          img.style.width = "16px";
          img.style.height = "16px";
          img.style.verticalAlign = "middle";
          img.style.marginRight = "4px";
          titleContent.appendChild(img);
        }

        titleContent.appendChild(document.createTextNode(word));
      });

      title.appendChild(titleContent);

      wrapper.appendChild(icon);
      wrapper.appendChild(title);
      previewStepsContainer.appendChild(wrapper);

      displayQueue.push(wrapper); // Add main step to display queue
      wrappers.push(wrapper);

      // If this step has subTitles, add each as a separate p outside the wrapper
      if (Array.isArray(step.subTitle)) {
        step.subTitle.forEach((sub) => {
          const subTitleEl = document.createElement("p");
          subTitleEl.className = "step-subtitle-p";
          subTitleEl.textContent = sub;
          subTitleEl.style.display = "none"; // initially hidden
          previewStepsContainer.appendChild(subTitleEl);
          displayQueue.push(subTitleEl);
        });
      }

      // Add loader line (only between main steps, not after last)
      if (index < stepsPreview.length - 1) {
        const line = document.createElement("div");
        line.className = "loader-line-ll";
        line.style.display = "none"; // hide initially
        previewStepsContainer.appendChild(line);
        displayQueue.push(line);
      }
    });

    cardContent.appendChild(previewStepsContainer);
    previewCard.appendChild(cardContent);
    if (blockList.firstChild && blockList.contains(blockList.firstChild)) {
      blockList.insertBefore(previewCard, blockList.firstChild);
    } else {
      blockList.appendChild(previewCard);
    }

    cardHeader.addEventListener("click", () => {
      const isVisible = previewStepsContainer.style.display !== "none";
      previewStepsContainer.style.display = isVisible ? "none" : "block";
      toggleBtn.textContent = isVisible ? "▼" : "▲";
    });

    // Sequentially show each item in the queue
    let currentIndex = 0;
    const interval = setInterval(() => {
      const current = displayQueue[currentIndex];

      if (!current) {
        clearInterval(interval);
        previewStepsContainer.style.display = "none";
        toggleBtn.textContent = "▼";

        // ✅ Fix: After the loop ends, check if the last item was a description-wrapper and update its icon
        const lastStep = displayQueue[currentIndex - 1];
        if (lastStep && lastStep.classList.contains("description-wrapper")) {
          const lastIcon = lastStep.querySelector(".preview-check-icon");
          if (lastIcon) {
            lastIcon.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4018 10.4L11.6438 6.1574L10.7954 5.309L7.4018 8.7032L5.7044 7.0058L4.856 7.8542L7.4018 10.4Z" fill="#2FA884"/>
        </svg>`;
          }
        }

        // ✅ Call poll after all steps are shown
        poll();
        return;
      }

      current.style.display = current.classList.contains("description-wrapper")
        ? "flex"
        : "block";

      // Add tick for previous main step (not subtitle or line)
      if (
        currentIndex > 0 &&
        displayQueue[currentIndex - 1].classList.contains("description-wrapper")
      ) {
        const prevIcon = displayQueue[currentIndex - 1].querySelector(
          ".preview-check-icon"
        );
        if (prevIcon) {
          prevIcon.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4018 10.4L11.6438 6.1574L10.7954 5.309L7.4018 8.7032L5.7044 7.0058L4.856 7.8542L7.4018 10.4Z" fill="#2FA884"/>
        </svg>`;
        }
      }

      currentIndex++;
    }, 350);
  }
  uniqueContainer
    .querySelector("#rerun-canvas")
    .addEventListener("click", async function (e) {
      e.stopPropagation(); // Prevent immediate document click closing
      const id = uniqueContainer.querySelector("#canvas-id-ll").value;

      runCanvasWithPersona(id, true);
    });
}
async function generatedCanvas(canvasList) {
  const container = uniqueContainer.querySelector("#leadlabs-all-canvas");

  if (canvasList.length === 0) {
    const emptyArray = document.createElement("div");
    emptyArray.style.display = "flex";
    emptyArray.style.justifyContent = "center";
    emptyArray.style.alignItems = "center";
    emptyArray.style.height = "65vh";

    // emptyArray.innerHTML =
    //   '<div class="empty-list-ll">' +
    //   '<svg class="empty-icon-ll" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    //   '<path d="M3 7h18v13H3z" fill="none"></path>' +
    //   '<path d="M5 4h4l3 3h9v13H5z"></path>' +
    //   "</svg>" +
    //   "<h4>No Canvas found</h4>" +
    //   "<p>Create a new Canvas.</p>" +
    //   "</div>";

    emptyArray.innerHTML =
      '<div class="empty-list-ll">' +
      '<img src="' +
      chrome.runtime.getURL("assets/workflow.png") +
      '"  alt="Ask AI">' +
      "<h4>No Canvas found</h4>" +
      "<p>Create a new Canvas.</p>" +
      "</div>";
    container.appendChild(emptyArray);
  }

  if (canvasList.length > 0) {
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
  } else {
    container.style.display = "block";
  }

  // Create persona dropdown once
  // let personaDropdown = uniqueContainer.querySelector(
  //   "#persona-dropdown-canvas"
  // );

  // if (!personaDropdown) {
  //   // Create and append the dropdown only if it doesn't exist
  //   personaDropdown = document.createElement("div");
  //   personaDropdown.className = "persona-dropdown hidden";
  //   personaDropdown.id = "persona-dropdown-canvas";
  //   container.appendChild(personaDropdown);

  //   // Add header
  //   const header = document.createElement("div");
  //   header.textContent = "Select Persona";
  //   header.className = "start-canvas-header";

  //   personaDropdown.appendChild(header);

  //   // Load personas
  //   const { userToken } = await chrome.storage.local.get(["userToken"]);
  //   const personaList = await getAllPersonas(userToken);

  //   // Populate persona dropdown
  //   personaList?.body.forEach((persona) => {
  //     const item = document.createElement("div");
  //     item.className = "persona-item";
  //     item.textContent = persona.persona_name;

  //     item.addEventListener("click", () => {
  //       if (personaDropdown.canvasId) {
  //         runCanvasWithPersona(personaDropdown.canvasId, persona.id);
  //         personaDropdown.classList.add("hidden");
  //       }
  //     });

  //     personaDropdown.appendChild(item);
  //   });
  // }

  // Canvas card generation
  canvasList.forEach((item) => {
    const card = document.createElement("div");
    card.className = "canvas-card-ll";
    card.id = item._id;

    // === Three-dot menu ===
    const menuWrapper = document.createElement("div");
    menuWrapper.className = "canvas-menu-wrapper";

    const dotMenu = document.createElement("div");
    dotMenu.className = "canvas-three-dot";
    dotMenu.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 11.25C10.6904 11.25 11.25 10.6904 11.25 10C11.25 9.30964 10.6904 8.75 10 8.75C9.30964 8.75 8.75 9.30964 8.75 10C8.75 10.6904 9.30964 11.25 10 11.25Z" fill="#525866"/>
<path d="M4.6875 11.25C5.37786 11.25 5.9375 10.6904 5.9375 10C5.9375 9.30964 5.37786 8.75 4.6875 8.75C3.99714 8.75 3.4375 9.30964 3.4375 10C3.4375 10.6904 3.99714 11.25 4.6875 11.25Z" fill="#525866"/>
<path d="M15.3125 11.25C16.0029 11.25 16.5625 10.6904 16.5625 10C16.5625 9.30964 16.0029 8.75 15.3125 8.75C14.6221 8.75 14.0625 9.30964 14.0625 10C14.0625 10.6904 14.6221 11.25 15.3125 11.25Z" fill="#525866"/>
</svg>`;

    const dropdown = document.createElement("div");
    dropdown.className = "canvas-dropdown hidden";

    const editOption = document.createElement("div");
    editOption.className = "canvas-dropdown-item";
    editOption.textContent = "Edit";
    editOption.onclick = (e) => editCanvas(e, item._id);

    const deleteOption = document.createElement("div");
    deleteOption.className = "canvas-dropdown-item";
    deleteOption.textContent = "Delete";
    deleteOption.onclick = (e) => {
      e.stopPropagation();
      uniqueContainer.querySelector("#canvas-id-ll").value = item._id;
      uniqueContainer.querySelector("#popup-for-canvas-delete").style.display =
        "flex";
    };

    const statusOption = document.createElement("div");
    statusOption.className = "canvas-dropdown-item";
    statusOption.textContent = item.canvasStatus ? "Deactivate" : "Activate";
    statusOption.onclick = () => {
      updateCanvasStatus(item._id, !item.canvasStatus);
      item.canvasStatus = !item.canvasStatus;
      statusOption.textContent = item.canvasStatus ? "Deactivate" : "Activate";
    };

    dropdown.appendChild(editOption);
    dropdown.appendChild(deleteOption);
    dropdown.appendChild(statusOption);
    dotMenu.onclick = (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
    };

    menuWrapper.appendChild(dotMenu);
    menuWrapper.appendChild(dropdown);
    card.appendChild(menuWrapper);

    // === Sections ===
    const sectionContainer = document.createElement("div");
    sectionContainer.className = "canvas-sections-ll";
    const blocksToShow =
      item.canvasJson.length > 3 ? item.canvasJson.slice(-3) : item.canvasJson;
    blocksToShow.forEach((block, index) => {
      const section = document.createElement("div");
      section.className = "canvas-section-ll";
      const dotColor = ["#B7FBA1", "#E4C9FF", "#FAD893"][index % 3];

      const sectionBox = document.createElement("div");
      sectionBox.className = "canvas-section-box-ll";

      const dot = document.createElement("span");
      dot.className = "canvas-dot-ll";
      dot.style.backgroundColor = dotColor;

      const label = document.createElement("span");
      label.className = "canvas-label-ll";
      label.textContent = block.title || "Untitled";

      sectionBox.appendChild(dot);
      sectionBox.appendChild(label);
      section.appendChild(sectionBox);

      if (index < item.canvasJson.length - 1) {
        const line = document.createElement("div");
        line.className = "canvas-line-ll";
        section.appendChild(line);
      }

      sectionContainer.appendChild(section);
    });

    // === Body section ===
    const body = document.createElement("div");
    body.className = "canvas-body-ll";
    body.style.position = "relative";

    const title = document.createElement("div");
    title.className = "canvas-header-ll";
    title.textContent = item.canvasTitle;

    const updatedAt = document.createElement("div");
    updatedAt.className = "canvas-updated-ll";
    updatedAt.textContent = `Last updated: ${new Date(
      item.createdAt
    ).toLocaleDateString()}`;

    const runBtn = document.createElement("button");
    runBtn.innerHTML = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.4359 10.0828L10.4063 8.59375L8.92188 4.56094C8.83397 4.32213 8.67494 4.11604 8.46622 3.97046C8.25751 3.82488 8.00916 3.74682 7.75469 3.74682C7.50022 3.74682 7.25187 3.82488 7.04316 3.97046C6.83444 4.11604 6.67541 4.32213 6.5875 4.56094L5.09375 8.59375L1.06094 10.0781C0.822134 10.166 0.616039 10.3251 0.47046 10.5338C0.324881 10.7425 0.246826 10.9908 0.246826 11.2453C0.246826 11.4998 0.324881 11.7481 0.47046 11.9568C0.616039 12.1656 0.822134 12.3246 1.06094 12.4125L5.09375 13.9062L6.57813 17.9391C6.66603 18.1779 6.82507 18.384 7.03378 18.5295C7.2425 18.6751 7.49085 18.7532 7.74532 18.7532C7.99979 18.7532 8.24813 18.6751 8.45685 18.5295C8.66556 18.384 8.8246 18.1779 8.9125 17.9391L10.4063 13.9062L14.4391 12.4219C14.6779 12.334 14.884 12.1749 15.0295 11.9662C15.1751 11.7575 15.2532 11.5092 15.2532 11.2547C15.2532 11.0002 15.1751 10.7519 15.0295 10.5432C14.884 10.3344 14.6779 10.1754 14.4391 10.0875L14.4359 10.0828ZM9.70313 12.8297C9.61829 12.861 9.54125 12.9103 9.47731 12.9742C9.41338 13.0381 9.36408 13.1152 9.33281 13.2L7.75 17.4883L6.17031 13.2031C6.1391 13.1174 6.08949 13.0395 6.02498 12.975C5.96046 12.9105 5.88261 12.8609 5.79688 12.8297L1.51172 11.25L5.79688 9.67031C5.88261 9.6391 5.96046 9.58949 6.02498 9.52497C6.08949 9.46046 6.1391 9.3826 6.17031 9.29688L7.75 5.01172L9.32969 9.29688C9.36096 9.38171 9.41026 9.45875 9.47419 9.52269C9.53812 9.58662 9.61517 9.63592 9.7 9.66719L13.9883 11.25L9.70313 12.8297ZM10.25 3.125C10.25 2.95924 10.3158 2.80027 10.4331 2.68306C10.5503 2.56585 10.7092 2.5 10.875 2.5H12.125V1.25C12.125 1.08424 12.1908 0.925268 12.3081 0.808058C12.4253 0.690848 12.5842 0.625 12.75 0.625C12.9158 0.625 13.0747 0.690848 13.1919 0.808058C13.3092 0.925268 13.375 1.08424 13.375 1.25V2.5H14.625C14.7908 2.5 14.9497 2.56585 15.0669 2.68306C15.1842 2.80027 15.25 2.95924 15.25 3.125C15.25 3.29076 15.1842 3.44973 15.0669 3.56694C14.9497 3.68415 14.7908 3.75 14.625 3.75H13.375V5C13.375 5.16576 13.3092 5.32473 13.1919 5.44194C13.0747 5.55915 12.9158 5.625 12.75 5.625C12.5842 5.625 12.4253 5.55915 12.3081 5.44194C12.1908 5.32473 12.125 5.16576 12.125 5V3.75H10.875C10.7092 3.75 10.5503 3.68415 10.4331 3.56694C10.3158 3.44973 10.25 3.29076 10.25 3.125ZM18.375 6.875C18.375 7.04076 18.3092 7.19973 18.1919 7.31694C18.0747 7.43415 17.9158 7.5 17.75 7.5H17.125V8.125C17.125 8.29076 17.0592 8.44973 16.9419 8.56694C16.8247 8.68415 16.6658 8.75 16.5 8.75C16.3342 8.75 16.1753 8.68415 16.0581 8.56694C15.9408 8.44973 15.875 8.29076 15.875 8.125V7.5H15.25C15.0842 7.5 14.9253 7.43415 14.8081 7.31694C14.6908 7.19973 14.625 7.04076 14.625 6.875C14.625 6.70924 14.6908 6.55027 14.8081 6.43306C14.9253 6.31585 15.0842 6.25 15.25 6.25H15.875V5.625C15.875 5.45924 15.9408 5.30027 16.0581 5.18306C16.1753 5.06585 16.3342 5 16.5 5C16.6658 5 16.8247 5.06585 16.9419 5.18306C17.0592 5.30027 17.125 5.45924 17.125 5.625V6.25H17.75C17.9158 6.25 18.0747 6.31585 18.1919 6.43306C18.3092 6.55027 18.375 6.70924 18.375 6.875Z" fill="white"/>
      </svg>
      Run Canvas`;
    runBtn.className = "run-btn-ll";

    // Initial styles
    runBtn.style.position = "absolute";
    runBtn.style.top = "50%";
    runBtn.style.left = "50%";
    runBtn.style.transform = "translate(-50%, -50%)";
    runBtn.style.zIndex = "2";
    runBtn.style.width = "90%";

    // Fade transition setup
    runBtn.style.opacity = "0";
    runBtn.style.visibility = "hidden";
    runBtn.style.transition = "opacity 0.3s ease, visibility 0.3s ease";

    runBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      runCanvasWithPersona(item._id, false);
      uniqueContainer.querySelector("#canvas-id-ll").value = item._id;
      // personaDropdown.canvasId = item._id;

      // // Get button position relative to container
      // const btnRect = runBtn.getBoundingClientRect();
      // const containerRect = container.getBoundingClientRect();

      // // Position the dropdown relative to container
      // personaDropdown.style.position = "absolute";
      // personaDropdown.style.top = `${
      //   btnRect.bottom - containerRect.top + 4
      // }px`;
      // personaDropdown.style.left = `${btnRect.left - containerRect.left}px`;

      // personaDropdown.classList.remove("hidden");
    });

    body.addEventListener("mouseenter", () => {
      runBtn.style.opacity = "1";
      runBtn.style.visibility = "visible";
    });

    // Hide on leave
    body.addEventListener("mouseleave", () => {
      runBtn.style.opacity = "0";
      runBtn.style.visibility = "hidden";
    });

    body.appendChild(title);
    body.appendChild(updatedAt);
    body.appendChild(runBtn);
    card.appendChild(sectionContainer);
    card.appendChild(body);
    container.appendChild(card);

    // // Hide dropdown when clicking outside
    // document.addEventListener("click", (e) => {
    //   if (
    //     !menuWrapper.contains(e.target) &&
    //     !personaDropdown.contains(e.target)
    //   ) {
    //     dropdown.classList.add("hidden");
    //     personaDropdown.classList.add("hidden");
    //   }
    // });
  });
}
//this function will get the data and map the dtat and show the UI
async function displayCanvasJSON(data) {
  const container = uniqueContainer.querySelector("#create-custome-canvas");
  container.innerHTML = "";
  data.forEach((block, index) => {
    if (block.displayStatus !== true) return;

    const card = document.createElement("div");
    card.className = "canvas-card";
    card.style.position = "relative";

    // Header with Title and 3-dot menu
    const header = document.createElement("div");
    header.className = "card-header";

    const titleWrapper = document.createElement("div");
    titleWrapper.style.display = "flex";
    titleWrapper.style.alignItems = "center";
    titleWrapper.style.gap = "6px";

    const title = document.createElement("h5");
    title.textContent = block.title;
    title.className = "editable-title";
    title.style.cursor = "pointer";

    // Create the edit icon (you can replace with any other SVG or emoji)
    const editIcon = document.createElement("span");
    editIcon.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" fill="gray" viewBox="0 0 24 24">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.41l-2.34-2.34a1.003 1.003 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
`;
    editIcon.style.cursor = "pointer";
    editIcon.style.display = "flex";
    // Shared click handler
    const handleEditClick = () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = block.title;
      input.className = "";
      input.classList.add("title-input", "font-family-ll");
      input.style.fontSize = "14px";
      input.style.color = "rgb(5, 14, 21)";
      input.style.width = "60%";

      input.addEventListener("blur", () => {
        const newTitle = input.value.trim() || "Untitled";
        const oldOutputTag = block.outputTag;

        const cleanName = newTitle
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^\w_]/g, "");

        const newOutputTag = `${cleanName}_output`;

        block.title = newTitle;
        block.outputTag = newOutputTag;

        data.forEach((b) => {
          if (b.input && Array.isArray(b.input.tags)) {
            b.input.tags.forEach((tagGroup) => {
              if (Array.isArray(tagGroup.tagList)) {
                tagGroup.tagList.forEach((tag) => {
                  if (tag.tagname === oldOutputTag) {
                    tag.tagname = newOutputTag;
                  }
                });
              }
            });
          }
        });

        displayCanvasJSON(data);
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
      });

      header.replaceChild(input, titleWrapper);
      input.focus();
    };

    // Attach click handlers
    title.addEventListener("click", handleEditClick);
    editIcon.addEventListener("click", handleEditClick);

    // Assemble elements
    titleWrapper.appendChild(title);
    titleWrapper.appendChild(editIcon);
    header.appendChild(titleWrapper);
    const buttonWrapper = document.createElement("span");
    buttonWrapper.className = "button-wrapper";
    buttonWrapper.style.display = "flex";
    buttonWrapper.style.alignItems = "center";
    buttonWrapper.style.gap = "4px";
    // === Regenerate Button ===
    const regenerateBtn = document.createElement("span");
    regenerateBtn.className = "regenerate-btn";
    regenerateBtn.innerHTML = `<div class="btl-cls">Rewrite</div>
        `;
    regenerateBtn.style.cursor = "pointer";
    regenerateBtn.style.padding = "4px";
    buttonWrapper.appendChild(regenerateBtn);

    // === Click Event ===
    regenerateBtn.addEventListener("click", () => {
      const popup = uniqueContainer.querySelector(
        "#popup-for-regenrate-prompt"
      );
      if (popup) popup.style.display = "flex";

      // Set title to block.title
      const popupHeading = popup.querySelector("h2");
      if (popupHeading)
        popupHeading.textContent = block.title || "Regenerate Prompt";

      // Show preview of block.textPrompt (max 2 lines)
      const promptTextContainer =
        uniqueContainer.querySelector("#prompt-text-ll");
      if (promptTextContainer) {
        const previewDiv = document.createElement("div");
        previewDiv.innerHTML = restoreHighlightTags(block.textPrompt || "");
        previewDiv.classList.add("preview-text");

        const textarea = document.createElement("textarea");
        textarea.id = "regen-textarea";
        textarea.style.width = "100%";
        textarea.style.height = "120px";
        textarea.style.padding = "8px";
        textarea.style.fontSize = "14px";
        textarea.placeholder = "Provide changes required in the prompt here...";

        promptTextContainer.innerHTML = ""; // clear old
        promptTextContainer.appendChild(previewDiv);
        promptTextContainer.appendChild(textarea);
      }

      // Submit event
      const submitBtn = uniqueContainer.querySelector("#regenerate-block-btn");
      if (submitBtn) {
        submitBtn.onclick = async () => {
          const textarea = uniqueContainer.querySelector("#regen-textarea");
          if (!textarea || !textarea.value.trim()) {
            showNotification(`Enter prompt Details..`, "warning", uniqueId);
            return;
          }

          const userValue = textarea.value.trim();
          let { userToken } = await chrome.storage.local.get(["userToken"]);

          // Save original button text & set loading text
          const originalBtnText = submitBtn.textContent;
          submitBtn.textContent = "Loading...";
          submitBtn.disabled = true;

          try {
            // Call API
            const res = await fetch(
              "https://betabackext-beta.leadlabs.app/regenarate-block-prompt",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + userToken,
                },
                body: JSON.stringify({
                  feedback: userValue,
                  prompt: convertSpansToTags(block.textPrompt),
                }),
              }
            );

            const dataRes = await res.json();

            // Replace original prompt with API's response
            if (dataRes && dataRes.body) {
              block.textPrompt = dataRes.body;
            }

            showNotification(
              `Prompt updated successfully`,
              "success",
              uniqueId
            );

            // Close popup & refresh UI
            popup.style.display = "none";
            displayCanvasJSON(data);
          } catch (err) {
            console.error("Error regenerating prompt:", err);
            alert("Failed to regenerate prompt");
          } finally {
            // Restore original button text
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
          }
        };
      }
    });

    // 3-dot menu button
    const menuButton = document.createElement("span");
    menuButton.className = "menu-button";
    menuButton.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 8.375C9.34518 8.375 9.625 8.65482 9.625 9C9.625 9.34518 9.34518 9.625 9 9.625C8.65482 9.625 8.375 9.34518 8.375 9C8.375 8.65482 8.65482 8.375 9 8.375Z" fill="black" stroke="#292E30"/>
      <path d="M4.21875 10.125C4.84007 10.125 5.34375 9.62132 5.34375 9C5.34375 8.37868 4.84007 7.875 4.21875 7.875C3.59743 7.875 3.09375 8.37868 3.09375 9C3.09375 9.62132 3.59743 10.125 4.21875 10.125Z" fill="black"/>
      <path d="M13.7812 10.125C14.4026 10.125 14.9062 9.62132 14.9062 9C14.9062 8.37868 14.4026 7.875 13.7812 7.875C13.1599 7.875 12.6562 8.37868 12.6562 9C12.6562 9.62132 13.1599 10.125 13.7812 10.125Z" fill="black"/>
    </svg>
  `;
    menuButton.style.cursor = "pointer";
    menuButton.style.padding = "4px";
    buttonWrapper.appendChild(menuButton);
    header.appendChild(buttonWrapper);
    // Popup menu
    const popupMenu = document.createElement("div");
    popupMenu.className = "popup-menu";
    popupMenu.style.position = "absolute";
    popupMenu.style.right = "10px";
    popupMenu.style.top = "35px";
    popupMenu.style.background = "#fff";
    popupMenu.style.border = "1px solid #ccc";
    popupMenu.style.borderRadius = "6px";
    popupMenu.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
    popupMenu.style.zIndex = "1000";
    popupMenu.style.padding = "6px 0";
    popupMenu.style.minWidth = "150px";
    popupMenu.style.display = "none";

    // Add query
    const addQuery = document.createElement("div");
    addQuery.innerHTML = `
   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#292E30" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5.5 8H10.5" stroke="#292E30" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 5.5V10.5" stroke="#292E30" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Add query
  `;
    addQuery.className = "canvas-popup";
    addQuery.style.display = "none";
    addQuery.addEventListener("click", () => {
      alert(`You clicked Add Query for "${block.title}"`);
    });
    popupMenu.appendChild(addQuery);

    // Remove section
    const removeSection = document.createElement("div");
    removeSection.innerHTML = ` <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 3.5H2.5" stroke="#FB3748" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.5 6.5V10.5" stroke="#FB3748" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.5 6.5V10.5" stroke="#FB3748" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12.5 3.5V13C12.5 13.1326 12.4473 13.2598 12.3536 13.3536C12.2598 13.4473 12.1326 13.5 12 13.5H4C3.86739 13.5 3.74021 13.4473 3.64645 13.3536C3.55268 13.2598 3.5 13.1326 3.5 13V3.5" stroke="#FB3748" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.5 3.5V2.5C10.5 2.23478 10.3946 1.98043 10.2071 1.79289C10.0196 1.60536 9.76522 1.5 9.5 1.5H6.5C6.23478 1.5 5.98043 1.60536 5.79289 1.79289C5.60536 1.98043 5.5 2.23478 5.5 2.5V3.5" stroke="#FB3748" stroke-linecap="round" stroke-linejoin="round"/>
    </svg> 
    Remove block`;

    removeSection.style.color = "red";
    removeSection.className = "canvas-popup";

    const warnedToDelete = new Set(); // Stores indices that have been warned
    removeSection.addEventListener("click", () => {
      //as we are storing the selected tag in html we need to convert the html to raw text {{}} because outputTag are
      // like in {{}} formate
      const outputTagToDelete = data[index].outputTag;

      // Normalize all textPrompts to raw text with {{tag}} format before checking
      const isTagUsed = data.some((block, i) => {
        if (i === index || !block.textPrompt) return false;

        // Create a temporary container to parse HTML
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = block.textPrompt;

        // Replace <span class="highlighted-tag"><span>Tag</span></span> with {{Tag}}
        tempDiv.querySelectorAll(".highlighted-tag").forEach((tagEl) => {
          const tagText = tagEl.querySelector("span")?.textContent?.trim();
          const replacement = document.createTextNode(`{{${tagText}}}`);
          tagEl.replaceWith(replacement);
        });

        const normalizedText = tempDiv.textContent;

        return normalizedText.includes(`{{${outputTagToDelete}}}`);
      });

      if (isTagUsed && !warnedToDelete.has(index)) {
        showNotification(
          `The "${outputTagToDelete}" is used in another block's textPrompt. Click again to confirm deletion.`,
          "warning",
          uniqueId
        );
        warnedToDelete.add(index);
        return;
      }

      // Either tag not used or this is the second click
      warnedToDelete.delete(index); // clear warning state
      data.splice(index, 1);
      displayCanvasJSON(data);
      canvasData = data;
    });

    popupMenu.appendChild(removeSection);

    // Toggle menu
    menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      popupMenu.style.display =
        popupMenu.style.display === "block" ? "none" : "block";
    });

    // Close menu on outside click
    document.addEventListener("click", () => {
      popupMenu.style.display = "none";
    });

    header.appendChild(popupMenu);
    card.appendChild(header);
    const cardbody = document.createElement("div");
    cardbody.className = "canvas-card-body";
    // Description
    const desc = document.createElement("p");
    desc.className = "desc-canvas";
    desc.textContent = block.description;
    cardbody.appendChild(desc);

    // 1. Create wrapper div
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.width = "100%";
    cardbody.appendChild(wrapper);

    // 2. Create textarea

    const textarea = document.createElement("div");
    textarea.innerHTML = restoreHighlightTags(block.textPrompt);
    textarea.contentEditable = true;
    textarea.setAttribute("placeholder", block.placeholder || "");
    textarea.className = "custom-textarea";

    wrapper.appendChild(textarea);

    if ((textarea.textContent || "").trim() !== "") {
      // Wait for rendering
      requestAnimationFrame(() => {
        textarea.style.height = "auto"; // Reset
        const scrollHeight = textarea.scrollHeight;
        const visibleHeight = Math.max(scrollHeight * 0.4, 100);
        textarea.style.height = `${visibleHeight}px`;
      });
    }
    textarea.addEventListener("click", (e) => {
      if (e.target.classList.contains("cancel-tag")) {
        const parent = e.target.closest(".highlighted-tag");
        if (parent) {
          parent.remove();
          block.textPrompt = convertSpansToTags(textarea.innerHTML);
        }
      }
    });
    textarea.addEventListener("keydown", (e) => {
      if (e.key !== "Backspace" && e.key !== "Delete") return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const isRangeSelected = !selection.isCollapsed;

      // ✅ Case 1: Handle selection that includes tags
      if (isRangeSelected) {
        const selectedContent = range.cloneContents();
        const tagsInSelection =
          selectedContent.querySelectorAll(".highlighted-tag");

        if (tagsInSelection.length > 0) {
          e.preventDefault();

          tagsInSelection.forEach((tag) => {
            const originalTag = [
              ...textarea.querySelectorAll(".highlighted-tag"),
            ].find((t) => t.textContent === tag.textContent);
            if (originalTag) originalTag.remove();
          });

          range.deleteContents();
          selection.removeAllRanges();
          selection.addRange(range);

          block.textPrompt = textarea.innerHTML;
          return;
        }
      }

      // ✅ Case 2: No selection, check if caret is right next to a tag
      const container = range.startContainer;
      const offset = range.startOffset;
      let tagToRemove = null;

      const isTextNode = container.nodeType === Node.TEXT_NODE;

      if (e.key === "Backspace") {
        if (isTextNode && container.parentNode) {
          const prev = container.previousSibling;
          if (prev?.classList?.contains("highlighted-tag") && offset === 0) {
            tagToRemove = prev;
          }
        } else if (container.nodeType === 1 && offset > 0) {
          const node = container.childNodes[offset - 1];
          if (node?.classList?.contains("highlighted-tag")) {
            tagToRemove = node;
          }
        }
      } else if (e.key === "Delete") {
        if (isTextNode && container.parentNode) {
          const next = container.nextSibling;
          if (
            next?.classList?.contains("highlighted-tag") &&
            offset === container.length
          ) {
            tagToRemove = next;
          }
        } else if (container.nodeType === 1) {
          const node = container.childNodes[offset];
          if (node?.classList?.contains("highlighted-tag")) {
            tagToRemove = node;
          }
        }
      }

      if (tagToRemove) {
        e.preventDefault();
        tagToRemove.remove();
        block.textPrompt = textarea.innerHTML;
        return;
      }

      // ✅ Case 3: Fallback for other edits
      setTimeout(() => {
        block.textPrompt = textarea.innerHTML;
      }, 0);
    });

    // 3. Create dropdown
    const dropdown = document.createElement("div");
    dropdown.className = "mention-dropdown";
    dropdown.style.position = "absolute";
    dropdown.style.background = "#fff";
    dropdown.style.border = "1px solid #ccc";
    dropdown.style.zIndex = 999;
    dropdown.style.display = "none";
    dropdown.style.maxHeight = "120px";
    dropdown.style.overflowY = "auto";
    dropdown.style.fontSize = "14px";
    dropdown.style.boxShadow = "0px 4px 8px rgba(0,0,0,0.2)";
    dropdown.style.borderRadius = "4px";
    dropdown.style.padding = "4px";
    dropdown.style.minWidth = "190px";
    wrapper.appendChild(dropdown);

    // 4. Tag description box
    const tagDescBox = document.createElement("div");
    tagDescBox.className = "mention-tag-description";
    tagDescBox.style.position = "absolute";
    tagDescBox.style.background = "#f9f9f9";
    tagDescBox.style.border = "1px solid #ccc";
    tagDescBox.style.borderRadius = "4px";
    tagDescBox.style.padding = "8px";
    tagDescBox.style.fontSize = "13px";
    tagDescBox.style.color = "#333";
    tagDescBox.style.display = "none";
    tagDescBox.style.maxWidth = "220px";
    tagDescBox.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
    tagDescBox.style.zIndex = "1001";
    wrapper.appendChild(tagDescBox);

    // 5. Function to get cursor position in textarea
    const getCursorPosition = (editableDiv) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return { x: 0, y: 0 };

      const range = selection.getRangeAt(0).cloneRange();

      // Create a temporary marker span at caret
      const marker = document.createElement("span");
      marker.textContent = "\u200b"; // Zero-width space
      marker.style.display = "inline-block";
      marker.style.width = "1px";
      marker.style.height = "1em";
      marker.style.backgroundColor = "transparent"; // avoid visible flicker

      range.insertNode(marker);

      // Get position
      const markerRect = marker.getBoundingClientRect();
      const containerRect = editableDiv.getBoundingClientRect();

      // Important: Also get scrollTop & scrollLeft of editable div
      const scrollTop = editableDiv.scrollTop;
      const scrollLeft = editableDiv.scrollLeft;

      const x = marker.offsetLeft - editableDiv.offsetLeft - scrollLeft;
      const y = marker.offsetTop - editableDiv.offsetTop - scrollTop;

      marker.remove();

      return {
        x,
        y: y + 20, // adjust vertical offset below caret
      };
    };

    // 6. Input and caret tracking handler
    const updateDropdown = () => {
      data[index].textPrompt = textarea.innerHTML;
      const val = textarea.textContent;
      // data[index].textPrompt = val;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        dropdown.style.display = "none";
        return;
      }

      const range = selection.getRangeAt(0);
      const caretOffset = range.startOffset;
      const container = range.startContainer;

      let beforeCursor = container.textContent.slice(0, caretOffset);
      const match = beforeCursor.match(/@(\w*)$/);

      dropdown.innerHTML = "";
      tagDescBox.style.display = "none";

      if (match) {
        const search = match[1].toLowerCase();

        const matchingGroups = (block.input?.tags || [])
          .map((group) => {
            const filteredTags = group.tagList.filter((tag) =>
              tag.tagname.toLowerCase().includes(search)
            );
            return filteredTags.length
              ? { tagheader: group.tagheader, tagList: filteredTags }
              : null;
          })
          .filter(Boolean);

        if (matchingGroups.length) {
          matchingGroups.forEach((group) => {
            const header = document.createElement("div");
            header.textContent = group.tagheader;
            header.style.fontWeight = "bold";
            header.style.padding = "6px 4px 2px";
            header.style.borderBottom = "1px solid #eee";
            header.style.marginBottom = "4px";
            dropdown.appendChild(header);

            group.tagList.forEach((tag) => {
              const tagItem = document.createElement("div");
              tagItem.className = "mention-item";
              tagItem.style.display = "flex";
              tagItem.style.justifyContent = "space-between";
              tagItem.style.alignItems = "center";
              tagItem.style.padding = "4px 6px";
              tagItem.style.cursor = "pointer";
              tagItem.style.position = "relative";

              const tagName = document.createElement("span");
              tagName.className = "font-family-ll";
              tagName.textContent = tag.tagname;
              tagItem.appendChild(tagName);

              tagItem.addEventListener("mouseenter", () => {
                tagDescBox.textContent = tag.tagDes;
                tagDescBox.style.display = "block";
                const dropdownRect = dropdown.getBoundingClientRect();
                tagDescBox.style.top = `${dropdown.offsetTop}px`;
                tagDescBox.style.left = `${
                  dropdown.offsetLeft + dropdown.offsetWidth + 10
                }px`;
              });

              tagItem.addEventListener("mouseleave", () => {
                tagDescBox.style.display = "none";
              });

              tagItem.addEventListener("click", () => {
                const cleanTagName = tag.tagname.replace(/^[^\w@{]+/, "");

                // Create span element for visual display
                const span = document.createElement("span");
                span.className = "highlighted-tag";
                span.contentEditable = "false";

                const textNode = document.createElement("span");
                textNode.textContent = cleanTagName;
                span.appendChild(textNode);

                // Create cancel button
                const cancelBtn = document.createElement("span");
                cancelBtn.className = "cancel-tag";
                cancelBtn.textContent = "✕";
                cancelBtn.style.cursor = "pointer";
                cancelBtn.style.marginLeft = "4px";
                cancelBtn.style.fontSize = "10px";
                cancelBtn.style.fontWeight = "600";

                span.appendChild(cancelBtn);

                // Remove matched text from textarea
                const fullText = container.textContent;
                const matchStart = caretOffset - match[0].length;
                const matchEnd = caretOffset;
                container.textContent =
                  fullText.slice(0, matchStart) + fullText.slice(matchEnd);

                // Insert span at cursor
                const newRange = document.createRange();
                const sel = window.getSelection();
                newRange.setStart(container, matchStart);
                newRange.collapse(true);
                sel.removeAllRanges();
                sel.addRange(newRange);
                sel.getRangeAt(0).insertNode(span);

                // Optional whitespace after tag
                const space = document.createTextNode("\u00A0"); // non-breaking space
                span.after(space);

                // Update data and focus
                data[index].textPrompt = textarea.innerHTML;
                // textarea.focus();

                dropdown.style.display = "none";
                tagDescBox.style.display = "none";
              });

              dropdown.appendChild(tagItem);
            });
          });

          // Reuse your existing cursor offset logic
          const cursorPos = getCursorPosition(textarea);
          const textareaWidth = textarea.clientWidth;
          const dropdownWidth = 190;

          const isRightSide = cursorPos.x > textareaWidth * 0.6;
          dropdown.style.top = `${cursorPos.y}px`;
          dropdown.style.left = isRightSide
            ? `${Math.max(0, cursorPos.x - dropdownWidth)}px`
            : `${cursorPos.x}px`;

          dropdown.style.display = "block";
          dropdown.scrollTop = 0;
        } else {
          dropdown.style.display = "none";
        }
      } else {
        dropdown.style.display = "none";
      }
    };

    // Attach input/keyup/paste listeners
    textarea.addEventListener("input", updateDropdown);
    textarea.addEventListener("keyup", updateDropdown);
    textarea.addEventListener("paste", () => {
      setTimeout(updateDropdown, 10);
    });

    // 7. Hide dropdown on blur
    // Flag to track dropdown interaction
    let isClickInsideDropdown = false;

    dropdown.addEventListener("mousedown", () => {
      isClickInsideDropdown = true;
    });

    textarea.addEventListener("blur", () => {
      setTimeout(() => {
        if (!isClickInsideDropdown) {
          dropdown.style.display = "none";
          tagDescBox.style.display = "none";
        }
        isClickInsideDropdown = false; // reset for next time
      }, 100);
    });

    card.appendChild(cardbody);

    // Model
    const modelContainer = document.createElement("div");
    modelContainer.className = "modelContainer";

    const modelLabel = document.createElement("div");
    modelLabel.className = "label-model";
    modelLabel.textContent = "Model:";
    modelContainer.appendChild(modelLabel);

    // Selected display
    const selectedDisplay = document.createElement("div");
    selectedDisplay.className = "selected-model";
    modelContainer.appendChild(selectedDisplay);

    // Dropdown list container
    const dropdownList = document.createElement("div");
    dropdownList.className = "model-dropdown hidden";
    modelContainer.appendChild(dropdownList);

    // Set initial selected model display
    const selectedModelName = data[index].selectedModel;
    const selectedModel = block.models.find(
      (m) => m.modelName === selectedModelName
    );

    if (selectedModel) {
      selectedDisplay.innerHTML = `
    <div class="model-selection">
      <div>
        <p class="model-name">${selectedModel.modelName}</p>
      </div>
      <span class="dropdown-arrow">▼</span>
    </div>`;
    } else {
      selectedDisplay.innerHTML = `
    <div class="model-selection">
      <div>
        <p class="model-name">Select model</p>
      </div>
      <span class="dropdown-arrow">▼</span>
    </div>`;
    }

    // Populate dropdown options
    block.models.forEach((model) => {
      const item = document.createElement("div");
      item.className = "model-option";
      item.innerHTML = `<p class="model-name">${model.modelName}</p> <p class="model-sub-name">${model.modelDesc}</p>`;

      item.addEventListener("click", () => {
        selectedDisplay.innerHTML = `
          <div class="model-selection">
            <div>
              <p class="model-name">${model.modelName}</p>
            </div>
            <span class="dropdown-arrow">▼</span>
          </div>`;
        data[index].selectedModel = model.modelName;
        dropdownList.classList.add("hidden");
      });

      dropdownList.appendChild(item);
    });

    // Toggle dropdown
    selectedDisplay.addEventListener("click", () => {
      dropdownList.classList.toggle("hidden");
    });

    card.appendChild(modelContainer);

    container.appendChild(card);
  });
}
async function editCanvas(eventOrId, maybeId) {
  // Determine parameters
  let id;
  if (typeof eventOrId === "object" && eventOrId.stopPropagation) {
    // called from onclick => editCanvas(e, id)
    eventOrId.stopPropagation();
    id = maybeId;
  } else {
    // called programmatically => editCanvas(id)
    id = eventOrId;
  }
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const ids = {
    canvasId: id,
  };
  try {
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/get-canvas-id",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify(ids),
      }
    );

    const data = await response.json();
    const CanvasData = data?.canvas;
    const categoryData = data?.category ? data?.category : "";
    uniqueContainer.querySelector("#leadlabscanvas-list").style.display =
      "none";
    uniqueContainer.querySelector(
      "#leadlabscanvas-details-page"
    ).style.display = "block";
    await addCategoryToSelect("selectCategory-canvas");
    uniqueContainer.querySelector("#selectCategory-id").value =
      categoryData?.categoryId;
    const matchedIcon = categoryIconList.find(
      (icon) => icon.id === String(categoryData.categoryicon)
    );
    const selected = uniqueContainer.querySelector(".selectedCategory");
    selected.innerHTML = `${matchedIcon ? matchedIcon.svg : ""} <span>${
      categoryData?.categoryTitle
    }</span>`;
    // Populate the input fields with the selected persona's data
    uniqueContainer.querySelector("#canvas-id-ll").value = CanvasData._id;
    uniqueContainer.querySelector("#canvas-name-ll").value =
      CanvasData.canvasTitle;
    canvasData = CanvasData?.canvasJson
      ? JSON.parse(JSON.stringify(CanvasData.canvasJson))
      : [];
    originalCanvasData = CanvasData?.canvasJson
      ? JSON.parse(JSON.stringify(CanvasData.canvasJson))
      : [];

    displayCanvasJSON(canvasData);
    uniqueContainer.querySelector("#create-canvas").textContent =
      "Update Canvas";
  } catch (error) {
    console.error("Error fetching placeholder data:", error);
  }
}
//If user click on the delete canvas from the start card we are calling tis function
async function deleteCanvasFromStartCard(id) {
  uniqueContainer.querySelector("#canvas-id-ll").value = id;
  uniqueContainer.querySelector("#popup-for-canvas-delete").style.display =
    "flex";
  showCanvasList();
}
async function favoriteCanvas(Id, status) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const ids = {
    _id: Id,
    favorites: status,
  };
  try {
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/update-favorite-status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify(ids),
      }
    );

    const responseData = await response.json();

    canvasList =
      responseData?.data?.map((c) => ({
        _id: c._id,
        canvasTitle: c.canvasTitle,
        categoryicon: c.categoryicon,
        favorites: c.favorites,
        categoryTitle: c.categoryTitle,
      })) || [];

    // Save to local storage
    await chrome.storage.local.set({ canvasList });
  } catch (error) {
    console.error("Error fetching placeholder data:", error);
  }
}
async function addCategoryToSelect(containerId) {
  const container = uniqueContainer.querySelector(`#${containerId}`);
  container.innerHTML = "";
  container.className = "custom-select"; // Ensure styling
  let categories = await getCategory();

  // Selected div
  const selected = document.createElement("div");
  selected.className = "selectedCategory";
  selected.innerHTML =
    "<span style=\"font-family: 'Manrope'; font-size: 14px;\">Select Category</span>";

  container.appendChild(selected);

  // Dropdown div
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";
  categories.forEach((cat) => {
    const item = document.createElement("div");
    item.className = "dropdown-item";

    // Find the matching SVG by ID
    const matchedIcon = categoryIconList.find(
      (icon) => icon.id === String(cat.categoryicon)
    );

    // Use the SVG if found, otherwise empty string
    const iconSvg = matchedIcon ? matchedIcon.svg : "";

    // Render the item
    item.innerHTML = `${iconSvg} <span>${cat.categoryTitle}</span>`;

    item.onclick = (e) => {
      e.stopPropagation();

      // Update selected element with the same icon
      selected.innerHTML = `${iconSvg} <span>${cat.categoryTitle}</span>`;

      // Store the category ID in hidden input
      uniqueContainer.querySelector("#selectCategory-id").value = cat._id;

      // Hide dropdown
      dropdown.classList.remove("show");
    };

    dropdown.appendChild(item);
  });

  // "Create Category" option
  const createItem = document.createElement("div");
  createItem.className = "dropdown-item";
  createItem.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#408EB5" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.5 8H10.5" stroke="#408EB5" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 5.5V10.5" stroke="#408EB5" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
<span>
        Create new category
      </span>`;
  // createItem.textContent = "Create Category";
  createItem.onclick = (e) => {
    e.stopPropagation();
    uniqueContainer.querySelector(
      "#popup-for-canvas-create-category"
    ).style.display = "flex";
    uniqueContainer.querySelector("#popup-for-canvas-create").style.display =
      "none";
    assignCategoryIcon();
    dropdown.classList.remove("show"); // hide dropdown after click
  };
  dropdown.appendChild(createItem);

  container.appendChild(dropdown);

  // Toggle dropdown on selected click
  selected.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show"); // toggle visibility
  });

  // Close dropdown if click outside
  document.addEventListener("click", () => {
    dropdown.classList.remove("show");
  });
}
// Category Code
async function getCategory() {
  //loader

  fetch(chrome.runtime.getURL("pages/loader.html"))
    .then((r) => r.text())
    .then((html) => {
      uniqueContainer.querySelector("#category-list-ll").innerHTML = html;
    });

  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/get-categories",
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
    return responseData.data;
  }
}
async function assignCategoryIcon() {
  const dropdown = uniqueContainer.querySelector("#iconDropdown");
  const dropdownList = uniqueContainer.querySelector("#iconDropdownList");
  const selectedIcon = uniqueContainer.querySelector("#selectedIcon");

  dropdownList.innerHTML = "";
  dropdownList.style.display = "none";
  dropdownList.style.flexDirection = "column";

  // Populate options
  categoryIconList.forEach((item) => {
    const option = document.createElement("div");
    option.style.display = "flex";
    option.style.alignItems = "center";
    option.style.justifyContent = "center";
    option.style.padding = "8px";
    option.style.cursor = "pointer";
    option.style.borderBottom = "1px solid #f0f0f0";
    option.style.transition = "background 0.2s ease";
    option.innerHTML = item.svg || "";

    option.addEventListener("mouseenter", () => {
      option.style.background = "#f2f6f8";
    });
    option.addEventListener("mouseleave", () => {
      option.style.background = "white";
    });

    option.addEventListener("click", (e) => {
      e.stopPropagation(); // Important to stop event bubbling
      selectedIcon.innerHTML = item.svg;
      selectedIconData = item.id;

      // ✅ Close dropdown immediately after selecting
      dropdownList.style.display = "none";
    });

    dropdownList.appendChild(option);
  });

  // ✅ Add dropdown toggle only once
  if (!dropdown._hasListener) {
    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownList.style.display =
        dropdownList.style.display === "none" ||
        dropdownList.style.display === ""
          ? "flex"
          : "none";
    });
    dropdown._hasListener = true;
  }

  // ✅ Close dropdown on outside click only once
  if (!document._hasOutsideClickListener) {
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !dropdownList.contains(e.target)) {
        dropdownList.style.display = "none";
      }
    });
    document._hasOutsideClickListener = true;
  }
}
