async function analyseYourSelf() {
  analyseCard = document.createElement("div");
  analyseCard.id = "analyseYourselfCardwrapperLL";
  Object.assign(analyseCard.style, {
    position: "fixed",
    zIndex: 100,
    top: "8vh",
    right: "0px",
    backgroundColor: "#FFFFFF",
    width: "30%",
    overflow: "auto",
    height: "80vh",
    borderRadius: "4px",
    background: "#FFFFFF",
    border: "1px solid #E1E4EA",
    boxShadow:
      "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
  });

  document.body.appendChild(analyseCard);

  const html = await fetch(
    chrome.runtime.getURL("pages/analyseYourSelf.html")
  ).then((r) => r.text());
  analyseCard.innerHTML = html;
  document.getElementById("analyseLL").style.display = "none";
  document.getElementById("centerContainer-ll").style.display = "none";
  setupEventListenerssetUp();
  makeDivDraggable("drag-yourself-IconLL", "analyseYourselfCardwrapperLL");
}

function setupEventListenerssetUp() {
  const analyseImg = document.getElementById("lead-analyse-logo");
  analyseImg.src = chrome.runtime.getURL("assets/full-logo.png");
  const welcomeImg = document.getElementById("welcome-img");
  welcomeImg.src = chrome.runtime.getURL("assets/welcome.png");

  const addClickListener = (id, handler) => {
    const element = document.getElementById(id);
    if (element) {
      element.removeEventListener("click", handler); // Remove any existing listener
      element.addEventListener("click", handler);
    }
  };

  // Close button event listener
  addClickListener("closeAnalyseCardBtn", () => {
    const cardWrapper = document.getElementById("analyseYourselfCardwrapperLL");
    if (cardWrapper) {
      cardWrapper.remove();
      document.getElementById("analyseLL").style.display = "block";
    }
  });

  document
    .getElementById("submitAnswersBtn")
    .addEventListener("click", async () => {
      const reasons = Array.from(
        document.querySelectorAll("input[name='reason']:checked")
      ).map((el) => el.value);
      const role = document.querySelector("input[name='role']:checked")?.value;
      const segments = Array.from(
        document.querySelectorAll("input[name='segment']:checked")
      ).map((el) => el.value);
      const usecases = Array.from(
        document.querySelectorAll("input[name='usecase']:checked")
      ).map((el) => el.value);

      let { userToken } = await chrome.storage.local.get(["userToken"]);
      const response = await fetch(
        "https://betabackext-beta.leadlabs.app/submit-onboarding-answers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
          body: JSON.stringify({
            signupReason: reasons,
            currentRole: role,
            sellSegments: segments,
            interestedUseCases: usecases,
          }),
        }
      );
      if (response) {
        const responseData = await response.json();
        if (responseData && responseData.body == "Your Trail Has Ended") {
          fetch(chrome.runtime.getURL("pages/trailend.html"))
            .then((r) => r.text())
            .then((html) => {
              document.getElementById(
                "analyseYourselfCardwrapperLL"
              ).style.display = "none";
              document.getElementById("profileCardLL").style.display = "flex";
            });
        } else {
          chrome.storage.local
            .set({
              onboardingStatus: responseData?.onboardingStatus,
            })
            .then(() => {
              //console.log("Login Successfull!");
            });

          document.getElementById("stepOneDiv").style.display = "none";
          document.getElementById("stepTwoDiv").style.display = "block";
          getCompanyDetails();
        }
      }
    });

  document
    .getElementById("submitCompany")
    .addEventListener("click", async function () {
      const companyUrl = document.getElementById("company-url").value;
      const isATL = document.getElementById("ATL-ll").value;
      const isBTL = document.getElementById("BTL-ll").value;

      // Fetch the content from loader.html and update the innerHTML once fetched
      fetch(chrome.runtime.getURL("pages/loader.html"))
        .then((response) => response.text())
        .then((html) => {
          // First, clear the existing content including the loading message
          document.getElementById("stepTwoDiv").innerHTML = html;
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
          document.getElementById("stepTwoDiv").style.display = "none";
          document.getElementById("stepThreeDiv").style.display = "block";

          //loader
          fetch(chrome.runtime.getURL("pages/onboardinglLoader.html"))
            .then((r) => r.text())
            .then((html) => {
              document.getElementById("onboarding-loader").innerHTML = html;

              simulateSteps();
            });
        }
      } catch (error) {
        // showNotification(
        //   "Error contacting the server.",
        //   "warning",
        //   "profileCardLL"
        // );
      }
    });

  document.querySelectorAll(".next-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentStep = btn.closest(".wizard-step");
      const currentStepId = currentStep?.id;

      let isValid = true; // default to true

      switch (currentStepId) {
        case "q2": // Validate: role (radio)
          isValid = !!document.querySelector("input[name='role']:checked");
          break;

        case "q3": // Validate: segment (checkbox)
          isValid =
            document.querySelectorAll("input[name='segment']:checked").length >
            0;
          break;

        case "q4": // Validate: reason (checkbox)
          isValid =
            document.querySelectorAll("input[name='reason']:checked").length >
            0;
          break;

        case "q5": // Validate: usecase (checkbox)
          isValid =
            document.querySelectorAll("input[name='usecase']:checked").length >
            0;
          break;
      }

      if (!isValid) {
        showNotificationAnalyse(
          "Please select at least one option to proceed!",
          "warning"
        );
        return;
      }
      if (currentStep?.id === "q1") {
        selfWrittenContentRedirect(false);
        document.querySelector(".phase-ll").style.display = "flex";
      }
      const nextId = btn.getAttribute("data-next");
      if (nextId) {
        currentStep.style.display = "none";
        document.getElementById(nextId).style.display = "block";
      }
    });
  });

  document.querySelectorAll(".back-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const currentStep = btn.closest(".wizard-step");
      const backId = btn.getAttribute("data-back");
      if (backId) {
        currentStep.style.display = "none";
        document.getElementById(backId).style.display = "block";
      }
      if (backId === "q1") {
        document.querySelector(".phase-ll").style.display = "none";
      }
    });
  });

  async function getCompanyDetails(uniqueId) {
    // Get user token from local storage
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    let linkedInURL;
    if (window.location.href.includes("linkedin.com/in/me")) {
      const stringArray = [];

      try {
        const url1 = document.getElementById(
          "navigation-create-post-Create-a-post"
        ).href;

        if (isValidUrl(url1)) {
          stringArray.push(url1);
        }
        const url2 = document.getElementById(
          "navigation-index-edit-education"
        ).href;

        if (isValidUrl(url2)) {
          stringArray.push(url2);
        }
        const url3 = document.getElementById(
          "navigation-index-see-all-companies"
        ).href;

        if (isValidUrl(url3)) {
          stringArray.push(url3);
        }
      } catch {
        //console.log("error finding user linkedin Url")
      }
      linkedInURL = sharedStartString(stringArray);
    } else {
      linkedInURL = removeAfter5thSlash(window.location.toString());
    }
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
          linkdinUrl: linkedInURL,
        }),
      }
    );

    const responseData = await response.json();
    if (
      responseData?.body &&
      Array.isArray(responseData.body) &&
      responseData.body.length > 5 &&
      responseData.body[5]?.mainDomain
    ) {
      document.getElementById("company-url").value =
        responseData.body[5].mainDomain;
      document.getElementById("company-url").style.display = "none";
      document.getElementById("company-img-ll").src =
        responseData.body[0].linkedIncompanyimage;
      document.getElementById("company-name-your-ll").innerText =
        responseData.body[0].linkedIncompanyname;
      document.getElementById("company-followers-ll").innerText =
        responseData.body[0].linkedIncompanysubdesc?.[0]?.followers || "";
    } else {
      document.getElementById("company-container-ll").style.display = "none";
    }
  }
  function showNotificationAnalyse(text, color) {
    const notification = document.getElementById("notification-analyse-ll");

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

  function simulateSteps() {
    const container = document.getElementById("stepThreeDiv");
    const insightItems = document.querySelectorAll(".insight-item");
    let currentInsight = 0;

    const badgeMessages = [
      "Found 11 signals",
      "Merged 74 signals",
      "Found 21 signals",
      "Finalized persona",
    ];

    function processInsightItem(itemIndex) {
      const item = insightItems[itemIndex];
      if (!item) return;

      item.style.display = "flex";
      item.style.marginLeft = "-10px";
      item.style.marginRight = "-10px";

      // ✅ When second or later item starts, update previous badge
      if (itemIndex > 0) {
        const prevItem = insightItems[itemIndex - 1];
        const prevBadge = prevItem.querySelector(".signal-badge");

        if (prevBadge) {
          const newMessage = badgeMessages[itemIndex - 1] || "Completed";
          prevBadge.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4018 10.4L11.6438 6.1574L10.7954 5.309L7.4018 8.7032L5.7044 7.0058L4.856 7.8542L7.4018 10.4Z" fill="#2FA884"/>
          </svg>
          ${newMessage}
        `;
        }
      }

      const descriptions = item.querySelectorAll(".description");
      if (!descriptions || descriptions.length === 0) {
        proceedToNext(); // No description content
        return;
      }

      const wrappers = [];
      const lines = [];
      descriptions.forEach((p, i) => {
        const wrapper = document.createElement("div");
        wrapper.className = "description-wrapper";
        wrapper.style.display = "none";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "8px";

        p.parentNode.insertBefore(wrapper, p);
        wrapper.appendChild(p);
        wrappers.push(wrapper);

        if (i < descriptions.length - 1) {
          const line = document.createElement("div");
          line.className = "loader-line-ll";
          line.style.display = "none";
          wrapper.parentNode.insertBefore(line, wrapper.nextSibling);
          lines.push(line);
        }
      });

      let currentP = 0;
      const interval = setInterval(() => {
        const wrapper = wrappers[currentP];
        const currentDescription = wrapper.querySelector(".description");

        const loader = document.createElement("div");
        loader.className = "loading-circle";
        wrapper.insertBefore(loader, currentDescription);
        wrapper.style.display = "flex";

        if (currentP > 0) lines[currentP - 1].style.display = "block";

        setTimeout(() => {
          const checkMark = document.createElement("div");
          checkMark.innerHTML = `
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 9.5C7.48528 9.5 9.5 7.48528 9.5 5C9.5 2.51472 7.48528 0.5 5 0.5C2.51472 0.5 0.5 2.51472 0.5 5C0.5 7.48528 2.51472 9.5 5 9.5Z" fill="#D3E6F0"/>
          </svg>`;
          checkMark.style.display = "flex";
          checkMark.style.alignItems = "center";
          loader.replaceWith(checkMark);

          currentP++;
          if (currentP < wrappers.length) {
            wrappers[currentP].style.display = "flex";
          } else {
            clearInterval(interval);
            finishStep();
          }
        }, 800);
      }, 3000);

      function finishStep() {
        wrappers.forEach((w) => {
          w.classList.add("completed-ll");
          w.style.display = "none";
        });
        lines.forEach((l) => (l.style.display = "none"));

        item.style.marginLeft = "0px";
        item.style.marginRight = "0px";

        proceedToNext();
      }

      function proceedToNext() {
        if (itemIndex + 1 < insightItems.length) {
          setTimeout(() => processInsightItem(itemIndex + 1), 1000);
        } else {
          // ✅ All blocks completed — execute your logic here
          container.style.display = "none";
          const cardWrapper = document.getElementById(
            "analyseYourselfCardwrapperLL"
          );
          if (cardWrapper) {
            cardWrapper.remove();
            const eleSelfWritten = document.getElementById("selfWrittenBtnLL");
            if (eleSelfWritten) {
              eleSelfWritten.click();
            }
          }
        }
      }
    }

    // Hide all items initially
    insightItems.forEach((item) => {
      item.style.display = "none";
    });

    // Start first block
    processInsightItem(currentInsight);

    // Optional: background and quote setup
    const patment = document.querySelector("#header-image");
    if (patment) {
      const bgUrl = chrome.runtime.getURL("assets/canvasBackground.png");
      patment.style.backgroundImage = `url('${bgUrl}')`;
      patment.style.backgroundSize = "cover";
      patment.style.backgroundPosition = "center";
      patment.style.backgroundRepeat = "no-repeat";
    }

    const quote = document.querySelector("#quote-ll");
    if (quote && quote.textContent.trim() === "") {
      const randomIndex = Math.floor(Math.random() * salesQuotes.length);
      const selectedQuote = salesQuotes[randomIndex];
      quote.textContent = `"${selectedQuote}"`;
    }
  }

  let selectedRole = "";
  let selectedSegments = [];
  let selectedReasons = [];

  // Event listeners for all 3 steps
  document.querySelectorAll('input[name="role"]').forEach((input) => {
    input.addEventListener("change", () => {
      selectedRole = input.value;
      updateAllQuestions();
    });
  });

  document.querySelectorAll('input[name="segment"]').forEach((input) => {
    input.addEventListener("change", () => {
      selectedSegments = getCheckedValues("segment");
      updateAllQuestions();
    });
  });

  document.querySelectorAll('input[name="reason"]').forEach((input) => {
    input.addEventListener("change", () => {
      selectedReasons = getCheckedValues("reason");
      updateAllQuestions();
    });
  });

  function getCheckedValues(name) {
    return Array.from(
      document.querySelectorAll(`input[name="${name}"]:checked`)
    ).map((input) => input.value);
  }

  function formatList(arr) {
    if (arr.length === 0) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
    return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;
  }

  function updateAllQuestions() {
    if (selectedRole === "Others") {
      selectedRole = "";
    }
    const roleText = selectedRole ? `As a ${selectedRole}, ` : "";
    const segmentList = formatList(selectedSegments);
    const reasonList = formatList(selectedReasons).toLowerCase();

    // Question 2
    document.getElementById(
      "question3"
    ).innerText = `${roleText}What segment do you sell to?`;

    // Question 3
    let q4Intro = [roleText, segmentList ? `selling to ${segmentList}` : ""]
      .filter(Boolean)
      .join("");
    document.getElementById(
      "question4"
    ).innerText = ` ${q4Intro}, what is the main goal of your AI assistant?`;

    // Question 4
    let q5Intro = [
      roleText,
      segmentList ? `selling to ${segmentList}` : "",
      reasonList ? `with a goal to ${reasonList}` : "",
    ]
      .filter(Boolean)
      .join(",");
    document.getElementById(
      "question5"
    ).innerText = `${q5Intro}, what are some top use cases of your AI assistant?`;
  }
}
