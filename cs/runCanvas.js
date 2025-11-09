let selectedCanvasId = null;
let selectedPersonaId = null;
let linkedInURL = null;
let editDeleteCanvasId = null;
let deleteCanvasStatus = false;
window.activeCanvasLoaders = window.activeCanvasLoaders || {};
async function runCanvas(linkedIn, analyseCardId) {
  if (window.activeCanvasLoaders[analyseCardId]) {
    console.log(
      `⚠️ runCanvas already running for ${analyseCardId}, skipping duplicate`
    );
    return;
  }
  window.activeCanvasLoaders[analyseCardId] = true;
  linkedInURL = linkedIn;
  try {
    const analyseCard = document.getElementById(analyseCardId);
    if (!analyseCard) {
      setTimeout(() => runCanvas(linkedIn, analyseCardId), 3000);
      return;
    }

    analyseCard.innerHTML = "";

    const { userToken, canvasList: cachedCanvasList } =
      await chrome.storage.local.get(["userToken", "canvasList"]);

    let canvasList =
      cachedCanvasList && cachedCanvasList.length > 0
        ? cachedCanvasList
        : await fetch("https://betabackext-beta.leadlabs.app/get-all-canvas", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userToken,
            },
          })
            .then((res) => res.json())
            .then(
              (result) =>
                result?.data?.map((c) => ({
                  _id: c._id,
                  canvasTitle: c.canvasTitle,
                  categoryicon: c.categoryicon,
                  favorites: c.favorites,
                  categoryTitle: c.categoryTitle,
                })) || []
            );

    // Save to local storage if fetched
    if (!cachedCanvasList || cachedCanvasList.length === 0) {
      await chrome.storage.local.set({ canvasList });
    }

    if (analyseCardId == "get-canvas-center") {
      const favoriteCanvas = canvasList.filter((item) => item.favorites);
      const limitedCanvasList = favoriteCanvas.slice(0, 2);

      limitedCanvasList.forEach((canvas) => {
        const canvasItem = document.createElement("div");
        canvasItem.className = "action-btn";

        const matchedIcon = categoryIconList.find(
          (icon) => icon.id === String(canvas.categoryicon)
        );
        canvasItem.innerHTML = `
      ${matchedIcon ? matchedIcon.svg : ``}
        ${canvas.canvasTitle}
      `;

        canvasItem.addEventListener("click", async () => {
          document
            .querySelectorAll(".canvas-item-ll")
            .forEach((el) => (el.style.background = "white"));

          selectedCanvasId = canvas._id;
          let linkedinURL;
          if (linkedIn === "") {
            linkedinURL = floatSelectedUserLinkedInURL;
          } else {
            linkedinURL = linkedIn;
          }
          if (floatSelectedUserLinkedInURL) {
            await executeCanvas(canvas._id, "", userToken, linkedinURL, false);
          } else {
            const selfWrittenBtnLL =
              document.getElementById("selfWrittenBtnLL");
            if (selfWrittenBtnLL) {
              selfWrittenBtnLL.click();
              // your async code here
            }
          }
          const wrapper = document.getElementById("revaaloLLWrapper");
          if (wrapper) wrapper.style.display = "none";
        });

        analyseCard.appendChild(canvasItem);
      });
      return;
    }
    // Render all canvas items
    const groupedCanvas = {};
    canvasList.forEach((canvas) => {
      // only favorites
      const category = canvas.categoryTitle || "Others";
      if (!groupedCanvas[category]) groupedCanvas[category] = [];
      groupedCanvas[category].push(canvas);
    });
    if (
      analyseCardId == "canvas-list-container-ll" ||
      analyseCardId === "canvas-in-main"
    ) {
      // Render only categories that have favorites
      Object.keys(groupedCanvas).forEach((category) => {
        const canvases = groupedCanvas[category];
        if (canvases.length === 0) return; // skip empty categories

        const categorySection = document.createElement("div");
        categorySection.className = "ll-category-section";

        // Add category header
        const header = document.createElement("div");
        header.className = "ll-category-header";
        header.textContent =
          category.charAt(0).toUpperCase() + category.slice(1);
        const hasFavorite = canvases.some((canvas) => canvas.favorites);

        categorySection.appendChild(header);

        // Render favorite canvases
        canvases.forEach((canvas) => {
          const item = document.createElement("div");
          item.className = "ll-canvas-item canvas-item-ll";
          item.style.position = "relative";

          const matchedIcon = categoryIconList.find(
            (icon) => icon.id === String(canvas.categoryicon)
          );

          item.innerHTML = `
      <div class="ll-canvas-main">
        <div class="ll-canvas-left">
          ${matchedIcon ? matchedIcon.svg : ""}
          <span class="ll-canvas-title">${canvas.canvasTitle}</span>
        </div>
        <div class="ll-canvas-right">
          <span 
            class="ll-star ${canvas.favorites ? "active" : ""}" 
            title="Favorite">
            ${canvas.favorites ? "&#9733;" : "&#9734;"}
          </span>
          <span class="ll-dots" title="More Options">&#8942;</span>
          <div class="ll-dropdown">
            <div class="ll-dropdown-item" data-action="edit">Edit</div>
            <div class="ll-dropdown-item" data-action="delete">Delete</div>
          </div>
        </div>
      </div>
    `;

          // Main click
          item
            .querySelector(".ll-canvas-left")
            .addEventListener("click", async () => {
              document
                .querySelectorAll(".ll-canvas-item")
                .forEach((el) => (el.style.background = "white"));
              selectedCanvasId = canvas._id;

              if (linkedIn === "") {
                const selfWrittenBtnLL =
                  document.getElementById("selfWrittenBtnLL");
                if (selfWrittenBtnLL) {
                  selfWrittenBtnLL.click();
                  // your async code here
                  selectedCanvasId = canvas._id;
                }
              } else {
                await executeCanvas(canvas._id, "", userToken, linkedIn, false);
              }
              const wrapper = document.getElementById("revaaloLLWrapper");
              if (wrapper) wrapper.style.display = "none";
            });

          // Favorite toggle
          const star = item.querySelector(".ll-star");
          star.addEventListener("click", async (e) => {
            e.stopPropagation();
            const isFav = star.classList.toggle("active");
            star.innerHTML = isFav ? "&#9733;" : "&#9734;";
            await callAIForFavorite(canvas._id, isFav);
          });

          // Dropdown
          const dots = item.querySelector(".ll-dots");
          const dropdown = item.querySelector(".ll-dropdown");
          dots.addEventListener("click", (e) => {
            e.stopPropagation();
            const visible = dropdown.style.display === "block";
            document
              .querySelectorAll(".ll-dropdown")
              .forEach((dd) => (dd.style.display = "none"));
            dropdown.style.display = visible ? "none" : "block";
          });

          dropdown.addEventListener("click", (e) => {
            e.stopPropagation();
            const action = e.target.dataset.action;
            dropdown.style.display = "none";
            if (action === "edit") handleEditCanvas(canvas._id);
            else if (action === "delete") handleDeleteCanvas(canvas._id);
          });

          document.addEventListener("click", () => {
            dropdown.style.display = "none";
          });

          categorySection.appendChild(item);
        });

        analyseCard.appendChild(categorySection);
      });
      if (analyseCardId === "canvas-in-main") {
        // ➕ Add "Create Canvas" button at bottom
        const createBtn = document.createElement("div");
        createBtn.className = "ll-create-canvas-btn";
        createBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#2B303B" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.5 8H10.5" stroke="#2B303B" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 5.5V10.5" stroke="#2B303B" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Create Canvas`;
        createBtn.onclick = () => handleCreateCanvas();
        analyseCard.appendChild(createBtn);
      }
    } else {
      Object.keys(groupedCanvas).forEach((category) => {
        const canvases = groupedCanvas[category];
        if (canvases.length === 0) return; // skip empty categories

        const categorySection = document.createElement("div");
        categorySection.className = "ll-category-section";

        // Add category header
        const header = document.createElement("div");
        header.className = "ll-category-header";
        header.textContent =
          category.charAt(0).toUpperCase() + category.slice(1);
        const hasFavorite = canvases.some((canvas) => canvas.favorites);
        if (hasFavorite) {
          header.classList.add("favorites-ll");
        } else {
          header.classList.remove("favorites-ll");
        }
        header.style.display = hasFavorite ? "block" : "none";
        categorySection.appendChild(header);

        // Render favorite canvases
        canvases.forEach((canvas) => {
          const item = document.createElement("div");
          item.className = "ll-canvas-item canvas-item-ll";
          item.style.position = "relative";
          item.style.display = canvas.favorites ? "block" : "none";
          if (canvas.favorites) {
            item.classList.add("favorites-ll");
          } else {
            // Make sure to remove it if not favorite
            item.classList.remove("favorites-ll");
          }
          const matchedIcon = categoryIconList.find(
            (icon) => icon.id === String(canvas.categoryicon)
          );

          item.innerHTML = `
      <div class="ll-canvas-main">
        <div class="ll-canvas-left">
          ${matchedIcon ? matchedIcon.svg : ""}
          <span class="ll-canvas-title">${canvas.canvasTitle}</span>
        </div>
        <div class="ll-canvas-right">
          <span 
            class="ll-star ${canvas.favorites ? "active" : ""}" 
            title="Favorite">
            ${canvas.favorites ? "&#9733;" : "&#9734;"}
          </span>
          <span class="ll-dots" title="More Options">&#8942;</span>
          <div class="ll-dropdown">
            <div class="ll-dropdown-item" data-action="edit">Edit</div>
            <div class="ll-dropdown-item" data-action="delete">Delete</div>
          </div>
        </div>
      </div>
    `;

          // Main click
          item
            .querySelector(".ll-canvas-left")
            .addEventListener("click", async () => {
              document
                .querySelectorAll(".ll-canvas-item")
                .forEach((el) => (el.style.background = "white"));
              selectedCanvasId = canvas._id;

              if (linkedIn === "") {
                const selfWrittenBtnLL =
                  document.getElementById("selfWrittenBtnLL");
                if (selfWrittenBtnLL) {
                  selfWrittenBtnLL.click();
                  // your async code here
                  selectedCanvasId = canvas._id;
                }
              } else {
                await executeCanvas(canvas._id, "", userToken, linkedIn, false);
              }
              const wrapper = document.getElementById("revaaloLLWrapper");
              if (wrapper) wrapper.style.display = "none";
            });

          // Favorite toggle
          const star = item.querySelector(".ll-star");
          star.addEventListener("click", async (e) => {
            e.stopPropagation();
            const isFav = star.classList.toggle("active");
            star.innerHTML = isFav ? "&#9733;" : "&#9734;";
            await callAIForFavorite(canvas._id, isFav);
          });

          // Dropdown
          const dots = item.querySelector(".ll-dots");
          const dropdown = item.querySelector(".ll-dropdown");
          dots.addEventListener("click", (e) => {
            e.stopPropagation();
            const visible = dropdown.style.display === "block";
            document
              .querySelectorAll(".ll-dropdown")
              .forEach((dd) => (dd.style.display = "none"));
            dropdown.style.display = visible ? "none" : "block";
          });

          dropdown.addEventListener("click", (e) => {
            e.stopPropagation();
            const action = e.target.dataset.action;
            dropdown.style.display = "none";
            if (action === "edit") handleEditCanvas(canvas._id);
            else if (action === "delete") handleDeleteCanvas(canvas._id);
          });

          document.addEventListener("click", () => {
            dropdown.style.display = "none";
          });

          categorySection.appendChild(item);
        });

        analyseCard.appendChild(categorySection);
      });
      if (analyseCardId === "get-canvas-center-list") {
        // ➕ Add "Create Canvas" button at bottom
        const createBtn = document.createElement("div");
        createBtn.className = "ll-create-canvas-btn";
        createBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="#2B303B" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.5 8H10.5" stroke="#2B303B" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 5.5V10.5" stroke="#2B303B" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Create Canvas`;
        createBtn.onclick = () => handleCreateCanvas();
        analyseCard.appendChild(createBtn);
      }
    }
    document.getElementById("input-container-ll").style.display = "flex";
    const searchInput = document.getElementById("execute-action-ll");
    const svgPath = document.querySelector("#execute-action-btn svg path");
    searchInput.addEventListener("focus", () => {
      makeCardBig();
      svgPath.setAttribute("fill", "#0D4E60");
    });
    searchInput.addEventListener("input", () => {
      makeCardBig();
      const searchTerm = searchInput.value.toLowerCase();
      const allItems = document.querySelectorAll(".ll-canvas-item");
      const headers = document.querySelectorAll(".ll-category-header");
      const noResultsDiv = document.getElementById("no-action-ll"); // new no-results div

      if (searchTerm === "") {
        // Show all items and headers when cleared
        allItems.forEach((item) => (item.style.display = "flex"));
        headers.forEach((header) => (header.style.display = "block"));
        noResultsDiv.style.display = "none"; // hide 'no results' message
      } else {
        let anyVisible = false;

        // Filter items by search term
        allItems.forEach((item) => {
          const title = item.textContent.toLowerCase();
          const isMatch = title.includes(searchTerm);
          item.style.display = isMatch ? "flex" : "none";
          if (isMatch) anyVisible = true;
        });

        // Hide headers if none of their items are visible
        document.querySelectorAll(".ll-category-section").forEach((section) => {
          const visibleItems = section.querySelectorAll(
            ".ll-canvas-item:not([style*='display: none'])"
          );
          section.querySelector(".ll-category-header").style.display =
            visibleItems.length > 0 ? "block" : "none";
        });

        // Show or hide 'no results' message
        noResultsDiv.style.display = anyVisible ? "none" : "block";
      }
    });

    const searchInputMain = document.getElementById("execute-action-main-ll");
    const svgPathMain = document.querySelector(
      "#execute-action-canvas-btn svg path"
    );
    if (searchInputMain) {
      searchInputMain.addEventListener("focus", () => {
        document.getElementById("canvas-cantainer-in-main-card").style.display =
          "block";
        svgPathMain.setAttribute("fill", "#0D4E60");
      });
    }
    if (searchInputMain) {
      searchInputMain.addEventListener("input", () => {
        const searchTerm = searchInputMain.value.toLowerCase();
        const allItems = document.querySelectorAll(".ll-canvas-item");
        const headers = document.querySelectorAll(".ll-category-header");
        const noResultsDiv = document.getElementById("no-action-ll"); // new no-results div

        if (searchTerm === "") {
          // Show all items and headers when cleared
          allItems.forEach((item) => (item.style.display = "flex"));
          headers.forEach((header) => (header.style.display = "block"));
          noResultsDiv.style.display = "none"; // hide 'no results' message
        } else {
          let anyVisible = false;

          // Filter items by search term
          allItems.forEach((item) => {
            const title = item.textContent.toLowerCase();
            const isMatch = title.includes(searchTerm);
            item.style.display = isMatch ? "flex" : "none";
            if (isMatch) anyVisible = true;
          });

          // Hide headers if none of their items are visible
          document
            .querySelectorAll(".ll-category-section")
            .forEach((section) => {
              const visibleItems = section.querySelectorAll(
                ".ll-canvas-item:not([style*='display: none'])"
              );
              section.querySelector(".ll-category-header").style.display =
                visibleItems.length > 0 ? "block" : "none";
            });

          // Show or hide 'no results' message
          noResultsDiv.style.display = anyVisible ? "none" : "block";
        }
      });
    }

    const createCanvas = document.getElementById("ll-create-canvas-center-btn");

    createCanvas.removeEventListener("click", handleCreateCanvas); // remove old
    createCanvas.addEventListener("click", handleCreateCanvas); // add once

    const closeCanvas = document.getElementById("close-canvas-card-ll");
    closeCanvas.addEventListener("click", () => {
      svgPath.setAttribute("fill", "#BFD0D5");
      document.getElementById("canvas-list-bigCard").style.display = "none";
      document.getElementById("getCanvas").style.display = "block";
      document.getElementById("button-container-ll").style.display = "block";
      if (window.location.href.includes("linkedin.com/in/")) {
        document.getElementById("Previous-actions-cantainer-ll").style.display =
          "block";
      } else {
        if (floatSelectedUserID) {
          document.getElementById(
            "Previous-actions-cantainer-ll"
          ).style.display = "block";
        } else {
          document.getElementById(
            "Previous-actions-cantainer-ll"
          ).style.display = "none";
        }
      }
      document.getElementById("profile-footer-ll").style.display = "block";
    });

    const searchInputCanter = document.getElementById(
      "execute-action-center-ll"
    );
    const svgPaths = document.querySelector(
      "#execute-submit-center-ll svg path"
    );

    const actionButtons = document.getElementById("action-buttons");
    const allCanvasList = document.getElementById("all-canvas-list");
    const canvasItems = document.querySelectorAll(
      "#get-canvas-center-list .ll-canvas-item"
    );
    if (searchInputCanter) {
      // When clicking inside the input
      searchInputCanter.addEventListener("focus", () => {
        svgPaths.setAttribute("fill", "#0D4E60");
        actionButtons.style.display = "none";
        allCanvasList.style.display = "block";
        canvasItems.forEach((item) => (item.style.display = "block"));
      });

      // When typing (your existing search logic)
      searchInputCanter.addEventListener("input", () => {
        const searchTerm = searchInputCanter.value.toLowerCase();
        const allItems = document.querySelectorAll(".ll-canvas-item");
        const headers = document.querySelectorAll(".ll-category-header");
        const noResultsDiv = document.getElementById("no-action-center-ll");

        if (searchTerm === "") {
          // actionButtons.style.display = "flex";
          // allCanvasList.style.display = "none";
          noResultsDiv.style.display = "none"; // hide 'no results' message

          allItems.forEach((item) => (item.style.display = "flex"));
          headers.forEach((header) => (header.style.display = "block"));
        } else {
          allCanvasList.style.display = "block";
          actionButtons.style.display = "none";

          let anyVisible = false;
          allItems.forEach((item) => {
            const title = item.textContent.toLowerCase();
            const isMatch = title.includes(searchTerm);
            item.style.display = isMatch ? "flex" : "none";
            if (isMatch) anyVisible = true;
          });

          // Hide headers if none of their items are visible
          document
            .querySelectorAll(".ll-category-section")
            .forEach((section) => {
              const visibleItems = section.querySelectorAll(
                ".ll-canvas-item:not([style*='display: none'])"
              );
              section.querySelector(".ll-category-header").style.display =
                visibleItems.length > 0 ? "block" : "none";
            });

          // ✅ Show or hide "no results" message
          noResultsDiv.style.display = anyVisible ? "none" : "block";
        }
      });
    }
    // When clicking outside the input
    document.addEventListener("click", (event) => {
      if (searchInputCanter) {
        const isClickInside = searchInputCanter.contains(event.target);

        if (!isClickInside) {
          // Hide list and restore buttons
          actionButtons.style.display = "flex";
          allCanvasList.style.display = "none";
        }
      }
    });
  } catch (err) {
    const analyseCard = document.getElementById(analyseCardId);
    if (analyseCard)
      analyseCard.innerHTML = `<p style="color:red;">Failed to load canvas list.</p>`;
    console.error("Error fetching canvas list:", err);
  } finally {
    // Don't clear the flag immediately — wait a bit to ensure async code finishes
    setTimeout(() => {
      delete window.activeCanvasLoaders[analyseCardId];
    }, 2000);
  }
}
async function callAIForFavorite(canvasId, isFavorited) {
  favoriteCanvas(canvasId, isFavorited);
}

function handleEditCanvas(id) {
  editDeleteCanvasId = id;

  // ✅ Trigger click on #selfWrittenBtnLL if it exists
  const selfWrittenBtn = document.getElementById("selfWrittenBtnLL");
  if (selfWrittenBtn) {
    selfWrittenBtn.click();
  } else {
    console.warn("Element #selfWrittenBtnLL not found.");
  }
}
async function handleCreateCanvas() {
  clickID = "canvasOpen";
  floatSelectedID = "canvasOpen";
  if (window.location.href.includes("linkedin.com/")) {
    const selfWrittenBtn = document.getElementById("selfWrittenBtnLL");
    if (selfWrittenBtn) {
      selfWrittenBtn.click();
    } else {
      console.warn("Element #selfWrittenBtnLL not found.");
    }
  } else {
    document.getElementById("floatContainer").style.display = "none";
    let data = await callHisProfileDetails();
    floatSelectedUserID = data?.userDetails?._id;
    floatSelectedUserLinkedInURL = data?.userDetails?.linkdinUrl;
    clickID = "canvasOpen";
    floatSelectedID = "canvasOpen";
    await gmailDetailedProfile(data?.userDetails?._id);
  }
}
function handleDeleteCanvas(id) {
  editDeleteCanvasId = id;
  deleteCanvasStatus = true;
  const selfWrittenBtn = document.getElementById("selfWrittenBtnLL");
  if (selfWrittenBtn) {
    selfWrittenBtn.click();
  } else {
    console.warn("Element #selfWrittenBtnLL not found.");
  }

  // your delete logic
}
async function executeCanvas(canvasId, personaId, token, linkedIn, status) {
  try {
    // Create output container if not already present
    let canvasOutputCardwrapperLL = document.getElementById(
      "canvasOutputCardwrapperLL"
    );
    if (!canvasOutputCardwrapperLL) {
      canvasOutputCardwrapperLL = document.createElement("div");
      canvasOutputCardwrapperLL.id = "canvasOutputCardwrapperLL";
      Object.assign(canvasOutputCardwrapperLL.style, {
        right: "0%",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        position: "fixed",
        zIndex: 100,
        top: "8vh",
        right: "0px",
        width: "30%",
        height: "80vh",
        borderRadius: "5px",
      });
      document.body.appendChild(canvasOutputCardwrapperLL);
    } else {
      canvasOutputCardwrapperLL.innerHTML = ""; // clear old content
    }

    // Load canvasoutput.html into the container
    const html = await fetch(chrome.runtime.getURL("pages/canvasoutput.html"))
      .then((res) => res.text())
      .catch((err) => {
        console.error("Failed to load canvasoutput.html", err);
        return "<div>Error loading output view.</div>";
      });

    canvasOutputCardwrapperLL.innerHTML = html;
    const analyseImg = document.getElementById("lead-canvas-logo");
    analyseImg.src = chrome.runtime.getURL("assets/full-logo.png");
    if (document.getElementById("analyseLL")) {
      document.getElementById("analyseLL").style.display = "none";
      document.getElementById("centerContainer-ll").style.display = "none";
      makeDivDraggable("drag-canvas-IconLL", "canvasOutputCardwrapperLL");
    }
    if (document.getElementById("profileCardLL")) {
      document.getElementById("profileCardLL").style.display = "none";
    }
    document
      .getElementById("closeRunCanvasCardBtn")
      ?.addEventListener("click", () => {
        const canvasOutput = document.getElementById(
          "canvasOutputCardwrapperLL"
        );
        if (canvasOutput) {
          canvasOutput.remove();
          selectedCanvasId = null;
          if (document.getElementById("analyseLL")) {
            document.getElementById("analyseLL").style.display = "block";
          }
          if (document.getElementById("floatContainer")) {
            document.getElementById("floatContainer").style.display = "block";
          }
        }
        if (window.location.href.includes("linkedin.com/in")) {
          callNano();
          callPerivausAction(linkedIn);
          runCanvas(linkedIn, "getCanvas");
          runCanvas(linkedIn, "canvas-list-container-ll");
          runCanvas(linkedIn, "get-canvas-center");
          runCanvas(linkedIn, "get-canvas-center-list");
        }
      });

    const htmlloader = await fetch(
      chrome.runtime.getURL("pages/precanvasloader.html")
    )
      .then((res) => res.text())
      .catch((err) => {
        console.error("Failed to load canvasoutput.html", err);
        return "<div>Error loading output view.</div>";
      });
    canvasOutputCardwrapperLL.querySelector("#run-canvas-output").innerHTML =
      htmlloader;
    if (window.location.href.includes("linkedin.com/in")) {
      if (document.getElementById("analyseLL")) {
        document.getElementById("analyseLL").style.display = "none";
      }
      if (document.getElementById("centerContainer-ll")) {
        document.getElementById("centerContainer-ll").style.display = "none";
      }
      const userName = getPersonNameFromHomePage();
      document.getElementById("user-name-ll").innerText = userName;

      // Check for profile image
      var linkdinImage = getLinkedInImage();
      if (
        !(
          linkdinImage.includes("media.licdn") ||
          linkdinImage.includes("leadlabs.s3")
        )
      ) {
        linkdinImage =
          "https://betabackext-beta.leadlabs.app/imagepath/linkedin-profile-images/default-profile.jpg";
      }

      // If image is found, set it
      if (linkdinImage) {
        const userImg = document.getElementById("user-img-ll");
        if (userImg) {
          userImg.src = linkdinImage;
        }
      }

      let companyData = getPersonaCompanyData();

      let company = getCompanyNameFromHomePage();

      let matchingCompany = companyData.find((item) =>
        item.linkdinDesc.includes(company)
      );
      let finalCompanyData = matchingCompany || companyData[0];
      company !== null ? finalCompanyData : companyData[0];

      const userImg = document.getElementById("company-img-ll");
      if (userImg) {
        userImg.src = finalCompanyData?.linkdinComapanyProfileurl;
      }
      document.getElementById("company-name-ll").innerText =
        finalCompanyData?.companyAltText;
    } else {
      document.getElementById("persona-data-loader-ll").style.display = "none";
    }
    const data = {
      linkedinUrl: linkedIn,
      canvasId: canvasId,
      personaID: personaId,
      reRun: status,
    };
    // Now execute the canvas
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/execute-canvas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (result && result.body == "LinkedIn profile not found") {
      const btn = document.getElementById("selfWrittenBtnLL");
      if (btn) {
        btn.click();
      }
    } else if (result?.executionId) {
      pollCanvasExecution(result.executionId, result);
    }
  } catch (error) {
    console.error("Error executing canvas:", error);
  }
}

// function setupEventListeners() {
//   const canvasCard = document.getElementById("canvasCardwrapperLL");

//   if (!canvasCard ) return;

//   canvasCard.addEventListener("mouseleave", () => {
//     setTimeout(() => {
//       if (!personaCard.matches(":hover")) {
//         // personaCard.style.display = "none";
//         canvasCard.style.display = "none";
//       }
//     }, 200);
//   });

// }

async function pollCanvasExecution(id, data) {
  const { userToken } = await chrome.storage.local.get(["userToken"]);
  const uniqueContainer = document.getElementById("run-canvas-output");

  // Load loader
  const loaderHTML = await fetch(
    chrome.runtime.getURL("pages/canvasLoader.html")
  ).then((r) => r.text());
  uniqueContainer.innerHTML = loaderHTML;

  const blockList = uniqueContainer.querySelector("#block-list-ll");
  const popupContent = document.getElementById("run-canvas-output");
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
    const container = document.getElementById("run-canvas-output");

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

            // ✅ Show card now that step is done
            currentCard.style.display = "block";
            smoothScrollToCard(currentCard, "smooth", "end");

            resultContainer.addEventListener("copy", (e) => {
              e.preventDefault();
              const selection = window.getSelection().toString();
              e.clipboardData.setData("text/plain", selection);
            });
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
      const allDone = stepStatuses.every((s) => s.status === "success");
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

  var linkdinImage;
  var linkedIncompanyimage;
  var linkedInCompanyName;
  if (window.location.href.includes("linkedin.com/in")) {
    linkdinImage = data?.linkdinImage || getLinkedInImage();
    if (
      !(
        linkdinImage.includes("media.licdn") ||
        linkdinImage.includes("leadlabs.s3")
      )
    ) {
      linkdinImage =
        "https://betabackext-beta.leadlabs.app/imagepath/linkedin-profile-images/default-profile.jpg";
    }
    let companyData = getPersonaCompanyData();

    let company = getCompanyNameFromHomePage();

    let matchingCompany = companyData.find((item) =>
      item.linkdinDesc.includes(company)
    );
    let finalCompanyData = matchingCompany || companyData[0];
    company !== null ? finalCompanyData : companyData[0];

    linkedIncompanyimage =
      data?.linkedIncompanyimage === null
        ? finalCompanyData?.linkdinComapanyProfileurl
        : data?.linkedIncompanyimage;

    linkedInCompanyName =
      data?.linkedIncompanyname === null
        ? finalCompanyData?.companyAltText
        : data?.linkedIncompanyname;
  } else {
    linkdinImage = data?.linkdinImage;
    linkedIncompanyimage = data?.linkedIncompanyimage;
    linkedInCompanyName = data?.linkedIncompanyname;
  }
  document.getElementById("user-name-canvas-float-ll").innerText =
    data?.linkdinName || "";
  fetch(chrome.runtime.getURL("pages/merger-flow-ui.html"))
    .then((response) => response.text())
    .then((html) => {
      uniqueContainer.querySelector("#persona-data-ll").innerHTML = html;
      uniqueContainer.querySelector("#profile-img-ll").src = linkdinImage;
      uniqueContainer.querySelector("#company-profile-ll").src =
        linkedIncompanyimage;
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
  //   linkedIncompanyimage +
  //   '" alt="profile image">' +
  //   "<div>" +
  //   linkedInCompanyName +
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
      const { userToken } = await chrome.storage.local.get(["userToken"]);
      await executeCanvas(selectedCanvasId, "", userToken, linkedInURL, true);
    });
  uniqueContainer
    .querySelector("#main-back-float-canvas-ll")
    ?.addEventListener("click", () => {
      const canvasOutput = document.getElementById("canvasOutputCardwrapperLL");
      if (canvasOutput) {
        canvasOutput.remove();
        document.getElementById("revaaloLLWrapper").style.display = "none";
        document.getElementById("floatContainer").style.display = "block";
        document.getElementById("float-content-container").style.display =
          "block";
        document.getElementById("profile-content-container").style.display =
          "none";

        floatSelectedUserID = null;
        floatSelectedUserLinkedInURL = null;
        selectedCanvasId = null;
      }
    });
  uniqueContainer
    .querySelector("#user-name-canvas-float-ll")
    ?.addEventListener("click", () => {
      const canvasOutput = document.getElementById("canvasOutputCardwrapperLL");
      if (canvasOutput) {
        canvasOutput.remove();
        document.getElementById("revaaloLLWrapper").style.display = "none";
        document.getElementById("floatContainer").style.display = "block";
        document.getElementById("profile-content-container").style.display =
          "none";
        selectedCanvasId = null;
      }
    });
}
