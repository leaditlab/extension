let floatSelectedID = "";
//this two variable for the selected user details,Once the user is seleted from the profile listing then only these variable will get values
//based on this on click on action we are dircting to the selected user details page
let floatSelectedUserID = "";
let floatSelectedUserLinkedInURL = "";
function floatIconFunction() {
  chrome.storage.local.get("enableAllWebsite", async function (result) {
    if (
      result.enableAllWebsite !== false ||
      result.enableAllWebsite === undefined
    ) {
      // instructionPopup(window.location.toString());
      const navArray = ["PopupProfiles", "PopupGif"];
      const icons = ["assets/nav/nav-profiles.png", "assets/nav/nav-gif.png"];
      const activeIcons = [
        "assets/nav/nav-profiles-active.png",
        "assets/nav/nav-gif-active.png",
      ];

      // Set the image alt text
      const navProfiles = document.createElement("button");
      const navGif = document.createElement("button");
      if (window.revaaloLLCreating) {
        console.log("RevaaloLL popup creation already in progress.");
        return;
      }
      // ✅ Prevent duplicate creation
      if (document.getElementById("revaaloLLWrapper")) {
        console.log("RevaaloLL popup already exists.");
        return;
      }
      // Set creation lock
      window.revaaloLLCreating = true;
      try {
        if (!document.getElementById("revaaloLLWrapper")) {
          const popupWrapper = document.createElement("div");
          popupWrapper.id = "revaaloLLWrapper";
          popupWrapper.className = "lead-container";

          navProfiles.id = "PopupProfiles";
          navProfiles.innerHTML = "";

          navGif.id = "PopupGif";
          navGif.innerHTML = "";

          const popupContainer = document.createElement("div");
          popupContainer.id = "revaaloLL";

          //icon container
          const FloatContainer = document.createElement("div");
          FloatContainer.id = "floatContainer";
          FloatContainer.className = "lead-container";
          FloatContainer.style.display = "none";

          const htmlloader = await fetch(
            chrome.runtime.getURL("pages/loaderCard.html")
          )
            .then((res) => res.text())
            .catch((err) => {
              console.error("Failed to load canvasoutput.html", err);
              return "<div>Error loading output view.</div>";
            });
          FloatContainer.innerHTML = htmlloader;
          const centerContainer = document.createElement("div");
          centerContainer.id = "centerContainer-ll";
          centerContainer.style.display = "none";
          const centerDiv = await fetch(
            chrome.runtime.getURL("pages/centerCard.html")
          )
            .then((res) => res.text())
            .catch((err) => {
              console.error("Failed to load canvasoutput.html", err);
              return "<div>Error loading output view.</div>";
            });
          centerContainer.innerHTML = centerDiv;

          const reloadpagellIcon = document.createElement("div");
          reloadpagellIcon.id = "reloadPageLL";
          reloadpagellIcon.innerHTML =
            "<div><div style='font-size: 24px; margin-bottom: 10px;'>⚠️</div>LeadLabs Extension was updated. Please <strong>reload</strong> the page.</div> <button id='reloadPageBtnLL'> Reload </button>";

          const imageProfiles = document.createElement("img");
          imageProfiles.src = chrome.runtime.getURL(
            "assets/nav/nav-profiles.png"
          ); // Set the image source
          navProfiles.appendChild(imageProfiles);
          const profileToolTip = document.createElement("span");
          profileToolTip.classList.add("tooltiptextLL");
          profileToolTip.innerText = "Viewed Profiles";
          navProfiles.classList.add("tooltipLL");
          navProfiles.appendChild(profileToolTip);

          const imageGif = document.createElement("img");
          imageGif.src = chrome.runtime.getURL("assets/nav/nav-gif.png"); // Set the image source
          navGif.appendChild(imageGif);
          const gifToolTip = document.createElement("span");
          gifToolTip.classList.add("tooltiptextLL");
          gifToolTip.innerText = "Media Library";
          navGif.classList.add("tooltipLL");
          navGif.appendChild(gifToolTip);
          // const blurDiv = document.createElement("div");
          // blurDiv.className = "blur-overlay";
          const minimizeContainer = document.createElement("div");
          minimizeContainer.id = "minimizeContainer";
          minimizeContainer.style.display = "none";
          minimizeContainer.innerHTML = `   <button id="leadlabsIcon-minimize">
        <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.3657 0.446289C12.5912 0.446289 13.689 0.566433 14.4702 0.753906C14.8637 0.84834 15.1572 0.954994 15.3433 1.06055C15.4253 1.10709 15.4681 1.14478 15.4917 1.16797C15.4683 1.19111 15.4255 1.22871 15.3433 1.27539C15.1572 1.38094 14.8637 1.48857 14.4702 1.58301C13.689 1.77047 12.5912 1.88965 11.3657 1.88965C10.1403 1.88965 9.04247 1.77048 8.26123 1.58301C7.86776 1.48857 7.57421 1.38094 7.38818 1.27539C7.30537 1.22837 7.26206 1.19109 7.23877 1.16797C7.26217 1.14481 7.30557 1.10743 7.38818 1.06055C7.57421 0.954994 7.86776 0.84834 8.26123 0.753906C9.04248 0.566425 10.1402 0.446292 11.3657 0.446289Z" stroke="#0D4E60" stroke-width="0.721569"/>
        <rect x="8.11816" y="3.15234" width="1.08235" height="5.41176" fill="#0D4E60"/>
        <path d="M6.85596 1.25977H7.93831L9.20106 3.15388H8.1187L6.85596 1.25977Z" fill="#0D4E60"/>
        <path d="M14.7026 1.25977H15.7849L14.432 3.15388H13.3496L14.7026 1.25977Z" fill="#0D4E60"/>
        <rect x="13.3496" y="3.15234" width="1.08235" height="5.41176" fill="#0D4E60"/>
        <path d="M8.11765 8.56445H9.2L3.12965 18.8374C2.7033 19.5589 3.22341 20.4703 4.06147 20.4703H18.8762C19.7276 20.4703 20.2457 19.5326 19.7925 18.8118L13.349 8.56445H14.4314L20.6816 18.3016C21.6834 19.8624 20.5627 21.9135 18.7081 21.9135H4.17073C2.34168 21.9135 1.21669 19.9127 2.16703 18.3499L8.11765 8.56445Z" fill="#0D4E60"/>
        <path d="M6.94603 13.5254L16.9578 15.3293L19.1225 18.5764C19.5343 19.1379 19.1333 19.9293 18.4369 19.9293H4.56495C3.86857 19.9293 3.46755 19.1379 3.87936 18.5764L6.94603 13.5254Z" fill="#0D4E60"/>
        </svg><span class="minimize-text"> Ask LeadLabs</span>
          </button><div id="close-floaticon" class="close-btn">✕</div> `;
          if (document.body) {
            document.body.appendChild(FloatContainer); // Append the FloatContainer to the body
            document.body.appendChild(minimizeContainer);
            document.body.appendChild(centerContainer);
            document.body.appendChild(popupWrapper); // Append the popupWrapper to the body
            document.body.appendChild(reloadpagellIcon); // Append the reloadpagellIcon to the body
            // document.body.appendChild(blurDiv);
            makeDivDraggable("dragIconLLIcon", "floatContainer");
            // dragLeadlabsIcon("minimizeContainer", "dragIconLLIcon-minimize");
            const headerImg = document.getElementById("lead-icon-ll");
            headerImg.src = chrome.runtime.getURL("assets/full-logo.png");

            let { userName } = await chrome.storage.local.get(["userName"]);
            const currentHour = new Date().getHours();

            // Determine greeting
            let greeting = "";

            if (currentHour < 12) {
              greeting = "Good Morning";
            } else if (currentHour < 18) {
              greeting = "Good Afternoon";
            } else {
              greeting = "Good Evening";
            }

            // Display message
            document.getElementById(
              "user-message-ll"
            ).innerText = `${greeting}, ${userName ? userName : ""}!`;
            // Add event listener for the reload button
            reloadPageBtnLL.addEventListener("click", () => {
              window.location.reload();
            });
          }

          popupWrapper.appendChild(popupContainer);
          popupWrapper.appendChild(navProfiles);
          popupWrapper.appendChild(navGif);
          //drag foe float icon

          chrome.storage.local.get("minimizeStatus", function (result) {
            const minimizeStatus = result?.minimizeStatus;
            if (minimizeStatus === "small") {
              if (document.getElementById("floatContainer")) {
                document.getElementById("floatContainer").style.display =
                  "none";
                document.getElementById("centerContainer-ll").style.display =
                  "none";
                document.getElementById("minimizeContainer").style.display =
                  "flex";
              }
            } else if (minimizeStatus === "center") {
              if (document.getElementById("centerContainer-ll")) {
                document.getElementById("minimizeContainer").style.display =
                  "none";
                document.getElementById("centerContainer-ll").style.display =
                  "block";
                document.getElementById("floatContainer").style.display =
                  "none";
              }
            } else {
              if (document.getElementById("minimizeContainer")) {
                document.getElementById("minimizeContainer").style.display =
                  "none";
                document.getElementById("centerContainer-ll").style.display =
                  "none";
                document.getElementById("floatContainer").style.display =
                  "block";
              }
            }
          });
          //on click on the float icon we are making  enableAllWebsite false in local storge to make not visible
          if (document.getElementById("close-floaticon")) {
            document
              .getElementById("close-floaticon")
              .addEventListener("click", async () => {
                chrome.storage.local.set(
                  {
                    enableAllWebsite: false,
                  },
                  () => {
                    document.getElementById("minimizeContainer").style.display =
                      "none";
                  }
                );
              });
          }
          const minimize = document.getElementById("minimize-ll");
          minimize.addEventListener("click", () => {
            chrome.storage.local.get("minimizeStatus", function (result) {
              const minimizeStatus = result?.minimizeStatus;

              if (
                minimizeStatus === "big" &&
                document.getElementById("floatContainer").style.height ===
                  "85vh"
              ) {
                makeCardSmall();
              } else {
                chrome.storage.local
                  .set({
                    minimizeStatus: "small",
                  })
                  .then(() => {
                    // console.log("Minimized successfully!");
                  });

                document.getElementById("floatContainer").style.display =
                  "none";
                document.getElementById("minimizeContainer").style.display =
                  "flex";
              }
            });
          });
          const minimizeContainers = document.getElementById(
            "leadlabsIcon-minimize"
          );
          minimizeContainers.addEventListener("click", () => {
            chrome.storage.local
              .set({
                minimizeStatus: "big",
              })
              .then(() => {
                //console.log("Login Successfull!");
              });
            document.getElementById("floatContainer").style.display = "block";
            document.getElementById("minimizeContainer").style.display = "none";
            document.getElementById("profile-content-container").style.display =
              "none";
            makeCardSmall();
          });

          const closeCenter = document.getElementById("close-center-ll");
          closeCenter.addEventListener("click", () => {
            chrome.storage.local
              .set({
                minimizeStatus: "big",
              })
              .then(() => {
                //console.log("Login Successfull!");
              });

            document.getElementById("centerContainer-ll").style.display =
              "none";
            document.getElementById("floatContainer").style.display = "flex";
            makeCardSmall();
            document.getElementById("minimizeContainer").style.display = "none";
          });

          const centerContainerMid = document.getElementById("centerize-ll");
          centerContainerMid.addEventListener("click", () => {
            chrome.storage.local
              .set({
                minimizeStatus: "center",
              })
              .then(() => {
                //console.log("Login Successfull!");
              });
            document.getElementById("floatContainer").style.display = "none";
            document.getElementById("centerContainer-ll").style.display =
              "block";
          });
          const centerContainerMax = document.getElementById("maximize-ll");
          const svgPaths = document.querySelector(
            "#execute-submit-center-ll svg path"
          );
          centerContainerMax.addEventListener("click", () => {
            chrome.storage.local
              .set({
                minimizeStatus: "big",
              })
              .then(() => {
                //console.log("Login Successfull!");
              });
            svgPaths.setAttribute("fill", "#BFD0D5");
            document.getElementById("floatContainer").style.display = "block";
            document.getElementById("centerContainer-ll").style.display =
              "none";
            makeCardBig();
          });
          function activateNav(nav) {
            for (i = 0; i < navArray.length; i++) {
              //console.log("------", nav, navArray[i], icons[i], activeIcons[i]);
              if (nav == navArray[i]) {
                document.getElementById(navArray[i]).firstChild.src =
                  chrome.runtime.getURL(activeIcons[i]);
              } else {
                document.getElementById(navArray[i]).firstChild.src =
                  chrome.runtime.getURL(icons[i]);
              }
            }
          }

          if (document.getElementById("selfWrittenBtnLL")) {
            document
              .getElementById("selfWrittenBtnLL")
              .addEventListener("click", async () => {
                // handling chrome extension invalidated

                if (!chrome.runtime?.id) {
                  document.getElementById("reloadPageLL").style.display =
                    "block";
                  document.getElementById("floatContainer").style.display ==
                    "none";
                  document.getElementById("centerContainer-ll").style.display =
                    "none";
                } else if (
                  document.getElementById("revaaloLLWrapper").style.display ==
                    "none" ||
                  document.getElementById("revaaloLLWrapper").style.display ==
                    ""
                ) {
                  if (floatSelectedUserID && floatSelectedUserLinkedInURL) {
                    let { userToken } = await chrome.storage.local.get([
                      "userToken",
                    ]);
                    if (selectedCanvasId) {
                      await executeCanvas(
                        selectedCanvasId,
                        "",
                        userToken,
                        floatSelectedUserLinkedInURL,
                        false
                      );
                      document.getElementById(
                        "revaaloLLWrapper"
                      ).style.display = "none";
                      document.getElementById("floatContainer").style.display =
                        "none";
                      document.getElementById(
                        "centerContainer-ll"
                      ).style.display = "none";
                      selectedCanvasId = null;
                    } else {
                      gmailDetailedProfile(floatSelectedUserID);
                      document.getElementById(
                        "revaaloLLWrapper"
                      ).style.display = "none";
                      document.getElementById("floatContainer").style.display =
                        "none";
                      document.getElementById(
                        "centerContainer-ll"
                      ).style.display = "none";
                    }
                  } else {
                    document.getElementById("revaaloLLWrapper").style.display =
                      "block";
                    activateNav("PopupProfiles");
                    showAllProfiles();
                  }
                } else {
                  document.getElementById("revaaloLLWrapper").style.display =
                    "none";
                }
                const isTrailOver = await istrailOver();
                if (isTrailOver) {
                  fetch(chrome.runtime.getURL("pages/trailend.html"))
                    .then((r) => r.text())
                    .then((html) => {
                      document.getElementById("revaaloLLWrapper").innerHTML =
                        html;
                      document.getElementById(
                        "revaaloLLWrapper"
                      ).style.display = "block";
                      document
                        .getElementById("closeTrailLL")
                        .addEventListener("click", () => {
                          document.getElementById(
                            "revaaloLLWrapper"
                          ).style.display = "none";
                        });
                    });
                }
              });

            async function istrailOver() {
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
              if (responseData && responseData.body == "Your Trail Has Ended") {
                return true;
              } else return false;
            }
          }
          if (document.getElementById("searchWebBtnLL")) {
            document
              .getElementById("searchWebBtnLL")
              .addEventListener("click", async () => {
                if (!chrome.runtime?.id) {
                  document.getElementById("reloadPageLL").style.display =
                    "block";
                  document.getElementById("floatContainer").style.display ==
                    "none";
                  document.getElementById("centerContainer-ll").style.display ==
                    "none";
                } else {
                  const selfWrittenBtnLL =
                    document.getElementById("selfWrittenBtnLL");
                  if (selfWrittenBtnLL) {
                    selfWrittenBtnLL.click();
                    // your async code here
                    floatSelectedID = "search";
                  }
                }
              });
          }
          const centerSelfWritten = document.getElementById(
            "centerselfWrittenBtnLL"
          );
          centerSelfWritten.addEventListener(
            "click",
            () => {
              const selfWrittenBtnLL =
                document.getElementById("selfWrittenBtnLL");
              if (selfWrittenBtnLL) {
                selfWrittenBtnLL.click();
              }
            },
            false
          );
          if (document.getElementById("settingIcon")) {
            document
              .getElementById("settingIcon")
              .addEventListener("click", async () => {
                const selfWrittenBtnLL =
                  document.getElementById("selfWrittenBtnLL");
                if (!chrome.runtime?.id) {
                  document.getElementById("reloadPageLL").style.display =
                    "block";
                  document.getElementById("floatContainer").style.display ==
                    "none";
                  document.getElementById("centerContainer-ll").style.display ==
                    "none";
                } else {
                  let data = await callHisProfileDetails();
                  floatSelectedUserID = data?.userDetails?._id;
                  floatSelectedUserLinkedInURL = data?.userDetails?.linkdinUrl;
                  gmailDetailedProfile(data?.userDetails?._id);
                  floatSelectedID = "parsonaListing";
                }
              });
          }

          document
            .getElementById("PopupProfiles")
            .addEventListener("click", () => {
              activateNav("PopupProfiles");
              showAllProfiles();
            });

          document
            .getElementById("PopupGif")
            .addEventListener("click", async () => {
              activateNav("PopupGif");
              await listGifs();
            });
        }
        window.revaaloLLCreating = false;
        console.log("✅ RevaaloLL popup initialized successfully.");
      } catch (err) {
        console.error("❌ Failed to initialize RevaaloLL popup:", err);
        window.revaaloLLCreating = false; // ensure unlock on error
      }
      //calling function fort load more
      const loadMoreButton = document.getElementById("load_more_btn_profile");
      if (loadMoreButton) {
        loadMoreButton.addEventListener("click", function (e) {
          e.preventDefault();
          pageLimit = pageLimit + 1;
          getShowLoadMore(pageLimit, tabselection)
            .then((data) => {
              //call function for draw UI
              paintUI(data, "loadmore");
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
      }

      //functions get all the profiles

      async function showAllProfiles() {
        var pageLimit = 1;
        var tabselection = "Personal";
        document.getElementById("floatContainer").style.display = "none";
        document.getElementById("centerContainer-ll").style.display = "none";
        document.getElementById("revaaloLL").style.display = "block";
        const element = document.querySelector("#revaaloLL");
        // Display a loading spinner
        fetch(chrome.runtime.getURL("pages/loader.html"))
          .then((r) => r.text())
          .then((html) => {
            document.querySelector("#revaaloLL").innerHTML = html;
          });
        let { userToken } = await chrome.storage.local.get(["userToken"]);
        const response = await fetch(
          "https://betabackext-beta.leadlabs.app/get-all-linkedin-profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userToken,
            },
            body: JSON.stringify({
              search_value: "",
              search_type: "Personal",
              page_limit: pageLimit,
            }),
          }
        );

        const responseData = await response.json();

        fetch(chrome.runtime.getURL("pages/gmailprofiles.html"))
          .then((r) => r.text())
          .then((html) => {
            element.innerHTML = html;
            document.getElementById("revaaloLLWrapper").style.display = "block";
            const headerImg = document.getElementById("lead-icon-profile-ll");
            headerImg.src = chrome.runtime.getURL("assets/full-logo.png");
            makeDivDraggable("dragIconLL", "revaaloLLWrapper");
            document
              .getElementById("close-profile")
              .addEventListener("click", async () => {
                document.getElementById("revaaloLLWrapper").style.display =
                  "none";
                floatSelectedUserID = null;
                floatSelectedUserLinkedInURL = null;
                selectedCanvasId = null;
                chrome.storage.local.get("minimizeStatus", function (result) {
                  const minimizeStatus = result?.minimizeStatus;
                  if (minimizeStatus === "small") {
                    document.getElementById("minimizeContainer").style.display =
                      "flex";
                  } else if (minimizeStatus === "center") {
                    document.getElementById(
                      "centerContainer-ll"
                    ).style.display = "block";
                  } else {
                    document.getElementById("floatContainer").style.display =
                      "block";
                  }
                });
              });
            document
              .getElementById("profile-back-ll")
              .addEventListener("click", async () => {
                document.getElementById("revaaloLLWrapper").style.display =
                  "none";
                floatSelectedUserID = null;
                floatSelectedUserLinkedInURL = null;
                selectedCanvasId = null;
                chrome.storage.local.get("minimizeStatus", function (result) {
                  const minimizeStatus = result?.minimizeStatus;
                  if (minimizeStatus === "small") {
                    document.getElementById("minimizeContainer").style.display =
                      "flex";
                  } else if (minimizeStatus === "center") {
                    document.getElementById(
                      "centerContainer-ll"
                    ).style.display = "block";
                  } else {
                    document.getElementById("floatContainer").style.display =
                      "block";
                  }
                });
              });
            const profileList = document.querySelector("#gmailProfileList");

            for (let i = 0; i < responseData.body.length; i++) {
              const data = responseData.body[i];
              const id = data.id;

              const profile = document.createElement("div");
              profile.className = "gmailProfileCardWrapper";
              profile.innerHTML = `
                  <div class="gmailProfileCard">
                    <img src="${data.image}" />
                    <div class="info">
                      <span class="name">${data.name}</span>
                      <span class="desc">${data.desc}</span>
                    </div>
      
                  </div>
                `;

              // Handle profile card click
              profile.addEventListener("click", async function () {
                floatSelectedUserID = id;
                floatSelectedUserLinkedInURL = data?.linkedInUrl;
                if (selectedCanvasId) {
                  await executeCanvas(
                    selectedCanvasId,
                    "",
                    userToken,
                    data?.linkedInUrl,
                    false
                  );
                  document.getElementById("revaaloLLWrapper").style.display =
                    "none";
                  selectedCanvasId = null;
                  floatSelectedUserID = null;
                  floatSelectedUserLinkedInURL = null;
                } else {
                  gmailDetailedProfile(id);
                  document.getElementById("revaaloLLWrapper").style.display =
                    "none";
                }
              });
              profileList.appendChild(profile);
            }

            //calling function fort load more
            document
              .getElementById("load_more_btn_profile")
              .addEventListener("click", function (e) {
                e.preventDefault();
                pageLimit = pageLimit + 1;
                getShowLoadMore(pageLimit, tabselection)
                  .then((data) => {
                    //call function for draw UI
                    paintUI(data, "loadmore");
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              });

            //calling for personal tab
            document
              .getElementById("showPersonal")
              .addEventListener("click", function (e) {
                e.preventDefault();
                pageLimit = 1;
                document.getElementById("showPersonal").style.border =
                  "2px #211F26 solid";
                document.getElementById("showOrganizational").style.border =
                  "1px #DFDCE3 solid";
                document.getElementById("uploadList").style.border =
                  "1px #DFDCE3 solid";
                document.getElementById("gmailProfileList").style.display =
                  "block";
                document.getElementById("load_more_profile").style.display =
                  "block";
                document.getElementById("uploadList-input").style.display =
                  "none";

                tabselection = "Personal";
                getshowPersonalOrganizational("Personal")
                  .then((data) => {
                    //call function for draw UI
                    paintUI(data, "tabswitch");
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              });

            //calling for Organizational tab
            document
              .getElementById("showOrganizational")
              .addEventListener("click", function (e) {
                e.preventDefault();
                pageLimit = 1;

                document.getElementById("showOrganizational").style.border =
                  "2px #211F26 solid";
                document.getElementById("showPersonal").style.border =
                  "1px #DFDCE3 solid";

                document.getElementById("load_more_profile").style.display =
                  "block";
                tabselection = "Organizational";
                getshowPersonalOrganizational("Organizational")
                  .then((data) => {
                    //call function for draw UI
                    paintUI(data, "tabswitch");
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              });

            document
              .getElementById("uploadList")
              .addEventListener("click", function (e) {
                e.preventDefault();
                pageLimit = 1;

                document.getElementById("uploadList").style.border =
                  "2px #211F26 solid";
                document.getElementById("showPersonal").style.border =
                  "1px #DFDCE3 solid";
                document.getElementById("gmailProfileList").style.display =
                  "none";
                document.getElementById("load_more_profile").style.display =
                  "none";
                document.getElementById("uploadList-input").style.display =
                  "block";
                tabselection = "Organizational";
                getshowPersonalOrganizational("Organizational")
                  .then((data) => {
                    //call function for draw UI
                    paintUI(data, "tabswitch");
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              });
            document
              .getElementById("startProcess")
              .addEventListener("click", () => {
                const text = document
                  .getElementById("profileInput")
                  .value.trim();
                if (!text) return;

                const urls = text
                  .split("\n")
                  .map((u) => u.trim())
                  .filter((u) => u);

                chrome.runtime.sendMessage({
                  action: "startProcess",
                  urls,
                });
              });

            // New button for showPersonal
            document
              .getElementById("showPersonal")
              .addEventListener("click", () => {
                chrome.runtime.sendMessage({ action: "showPersonal" });
              });

            document
              .getElementById("search-input-linkdinprofile")
              .addEventListener("input", function (event) {
                event.preventDefault();
                searchProfile(event.target.value, tabselection)
                  .then((data) => {
                    if (
                      event.target.value === "" ||
                      event.target.value === null
                    ) {
                      document.getElementById(
                        "load_more_profile"
                      ).style.display = "block";
                      pageLimit = 1;
                    } else {
                      document.getElementById(
                        "load_more_profile"
                      ).style.display = "none";
                    }
                    //call function for draw UI
                    paintUI(data, "search");
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              });
          });
      }

      // Helper function to handle tab switching, search, and load more functionality
      function setupEventListeners(tabselection, pageLimit) {
        // Load more button
        document
          .getElementById("load_more_btn_profile")
          .addEventListener("click", function (e) {
            e.preventDefault();
            pageLimit += 1;
            getShowLoadMore(pageLimit, tabselection)
              .then((data) => paintUI(data, "loadmore"))
              .catch((error) => console.error("Error:", error));
          });

        // Personal tab
        document
          .getElementById("showPersonal")
          .addEventListener("click", function (e) {
            e.preventDefault();
            switchTab("Personal", tabselection, pageLimit);
          });

        // Organizational tab
        document
          .getElementById("showOrganizational")
          .addEventListener("click", function (e) {
            e.preventDefault();
            switchTab("Organizational", tabselection, pageLimit);
          });

        // Search input
        document
          .getElementById("search-input-linkdinprofile")
          .addEventListener("input", function (event) {
            event.preventDefault();
            searchProfile(event.target.value, tabselection)
              .then((data) => {
                document.getElementById("load_more_profile").style.display =
                  event.target.value === "" ? "block" : "none";
                paintUI(data, "search");
              })
              .catch((error) => console.error("Error:", error));
          });
      }

      // Function to switch tabs and update UI accordingly
      function switchTab(selectedTab, tabselection, pageLimit) {
        pageLimit = 1;
        document.getElementById("showPersonal").style.border =
          selectedTab === "Personal"
            ? "2px #211F26 solid"
            : "1px #DFDCE3 solid";
        document.getElementById("showOrganizational").style.border =
          selectedTab === "Organizational"
            ? "2px #211F26 solid"
            : "1px #DFDCE3 solid";
        document.getElementById("load_more_profile").style.display = "block";
        tabselection = selectedTab;
        getshowPersonalOrganizational(selectedTab)
          .then((data) => paintUI(data, "tabswitch"))
          .catch((error) => console.error("Error:", error));
      }

      // search function
      async function searchProfile(str, tabselected) {
        let { userToken } = await chrome.storage.local.get(["userToken"]);
        const response = await fetch(
          "https://betabackext-beta.leadlabs.app/get-all-linkedin-profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userToken,
            },
            body: JSON.stringify({
              search_value: str,
              search_type: tabselected,
              page_limit: 1,
            }),
          }
        );
        const responseData = await response.json();
        return Promise.resolve(responseData);
      }
      // tab Swtich function
      async function getshowPersonalOrganizational(str) {
        const searchValue = document.getElementById(
          "search-input-linkdinprofile"
        );
        let { userToken } = await chrome.storage.local.get(["userToken"]);
        const response = await fetch(
          "https://betabackext-beta.leadlabs.app/get-all-linkedin-profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userToken,
            },
            body: JSON.stringify({
              search_value: searchValue.value,
              search_type: str,
              page_limit: 1,
            }),
          }
        );
        const responseData = await response.json();
        return Promise.resolve(responseData);
      }

      async function listGifs() {
        document.getElementById("revaaloLL").style.display = "block";

        const element = document.querySelector("#revaaloLL");

        try {
          fetch(chrome.runtime.getURL("pages/media.html"))
            .then((r) => r.text())
            .then((html) => {
              //document.body.insertAdjacentHTML('beforeend', html);
              element.innerHTML = html;

              // adding record gif button options
              document
                .getElementById("createGifBtn")
                .addEventListener("click", function (e) {
                  e.preventDefault();
                  /*           window.open('http://localhost:3000/', 
                           'newwindow','resizable=no,toolbar=no,location=no,scrollbars=no,menubar=no,status=no,directories=no',
                           'width=475,height=475',
                           );  */
                  popupCenter({
                    url: "https://gifcreator.leadlabs.app/",
                    title: "Record Gif - LeadLabs",
                    w: 465,
                    h: 410,
                  });
                });

              showgiphy();
            });
        } catch {}
      }
      function showgiphy() {
        document.getElementById("gifinner").innerHTML = "<p></p>";
        document.getElementById("giphyinner").style.display = "block";
        // Gif API Key
        const apiKey = `dpTbqjve0jv7JpEeJ5xuZ7uHNEc1fnTh`;

        // Gif API Search Gif link
        const searchUrl = `https://api.giphy.com/v1/gifs/search?`;

        // Gif API Trending Gif link
        const trendingUrl = `https://api.giphy.com/v1/gifs/trending?`;

        // loader Element
        const loader = document.getElementById("loader");

        // search box element
        const searchBox = document.getElementById("search-input");

        // Gif Wrapper element
        const gifWrapper = document.getElementById("gifs-card-wrapper");

        let limit = 20;

        let current = 0;

        // Load More Button
        const loadMore = document.getElementById("load_more_btn");

        // GIF Card Item to Clone Element
        const gifItem = document.createElement("div");
        gifItem.classList.add("gif-card");
        gifItem.innerHTML = `
      <div class="gif-container">
          <img src="" alt="">
          <div class="overlayLL">
            <div class="text">Click to Copy</div>
        </div>
      </div>
      <div class="gif-details">
          <div class="gif-title"></div>
          <div class="gif-tools">
          <button class="gif-icon-btn-tool gif-copy" type="button" title="Copy Link"><span class="material-symbols-outlined">content_copy</span></button>
          <button class="gif-icon-btn-tool gif-source" type="button" title="Copy Link"><span class="material-symbols-outlined">code</span></button>
          </div>
      </div>`;

        const loadGIFs = (is_more = false) => {
          if (!is_more) gifWrapper.innerHTML = ``;
          loader.style.display = "flex";
          loadMore.style.display = "none";

          var has_search = searchBox.value == "" ? false : true;
          if (has_search) {
            var apiLink =
              searchUrl + `q=` + encodeURIComponent(searchBox.value) + "&";
          } else {
            var apiLink = trendingUrl;
          }
          apiLink = `${apiLink}api_key=${apiKey}&limit=${limit}&offset=${current}&rating=g&lang=en`;
          fetch(apiLink)
            .then((response) => {
              if (response.status == 200) {
                return response.json();
              }
            })
            .then((data) => {
              setTimeout(() => {
                if (!is_more) gifWrapper.innerHTML = "";
                current += data.pagination.count;
                data.data.forEach((gifData) => {
                  var gifCard = gifItem.cloneNode(true);
                  gifCard.querySelector(".gif-container>img").src =
                    gifData.images.downsized_medium.url;
                  gifCard.querySelector(".gif-container>img").alt =
                    gifData.title;
                  gifCard.querySelector(".gif-container>img").id =
                    gifData.title.replaceAll(" ", "");
                  gifCard.querySelector(".gif-title").innerText = gifData.title;
                  gifCard.querySelector(".gif-title").title = gifData.title;
                  var copyImg = chrome.runtime.getURL("assets/copy.png");
                  const copyGifIcon = document.createElement("img");
                  copyGifIcon.id = gifData.title.replaceAll(" ", "") + "copy";
                  copyGifIcon.src = copyImg;

                  gifWrapper.appendChild(gifCard);
                  // Hiding as of now, as giving copy directly on Giphy image
                  //gifWrapper.appendChild(copyGifIcon);

                  const imageIdCopy =
                    gifData.title.replaceAll(" ", "") + "copy";
                  gifCard.querySelector(".gif-container>div>div").id =
                    imageIdCopy;

                  const imageId = gifData.title.replaceAll(" ", "");

                  // below we had separate image for copy, removing it as of now. on click of gif directly we will copy
                  //document.getElementById(imageIdCopy).addEventListener("click", () => {
                  document
                    .getElementById(imageIdCopy)
                    .addEventListener("click", () => {
                      copyGif(imageId);
                    });

                  gifCard
                    .querySelector(".gif-copy")
                    .addEventListener("click", (e) => {
                      e.preventDefault();
                      var textarea = document.createElement("textarea");
                      textarea.value = gifData.images.original.url;
                      textarea.innerHTML = gifData.images.original.url;
                      textarea.style.width = "0px";
                      document.body.appendChild(textarea);
                      textarea.select();
                      document.execCommand("copy");
                      setTimeout(() => {
                        alert(
                          `${gifData.title}'s link has been copied to clipboard`
                        );
                        textarea.remove();
                      }, 100);
                    });
                  gifCard
                    .querySelector(".gif-source")
                    .addEventListener("click", (e) => {
                      e.preventDefault();
                      window.open(gifData.bitly_gif_url);
                    });
                });
                loader.style.display = "none";
                if (
                  data.pagination.count + data.pagination.offset <
                  data.pagination.total_count
                )
                  loadMore.style.display = "block";
              }, 1500);
            })
            .catch((error) => {
              //alert("An error occurren while fetching GIF data");
              //console.log(error);
            });
        };

        window.onload = function () {
          loadGIFs();
          searchBox.addEventListener("keyup", (e) => {
            var code = e.keyCode || e.which;
            if (code == 13) {
              current = 0;
              loadGIFs();
            }
          });
        };
        window.onscroll = function () {
          // if((document.querySelector('html').scrollHeight - document.querySelector('html').scrollTop - document.querySelector('html').clientHeight) < 1){
          //     loadGIFs(true)
          // }
        };
        loadMore.addEventListener("click", (e) => {
          e.preventDefault();
          loadGIFs(true);
        });
        searchBox.onreset = function () {
          current = 0;
          loadGIFs();
        };
        //     searchBox.addEventListener("input", () => {
        //   loadGIFs();
        // });
        // calling it by default
        loadGIFs(true);
      }
      // load more function to load the profile
      async function getShowLoadMore(str, tabselection) {
        const searchValue = document.getElementById(
          "search-input-linkdinprofile"
        );
        let { userToken } = await chrome.storage.local.get(["userToken"]);
        const response = await fetch(
          "https://betabackext-beta.leadlabs.app/get-all-linkedin-profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + userToken,
            },
            body: JSON.stringify({
              search_value: searchValue.value,
              search_type: tabselection,
              page_limit: str,
            }),
          }
        );
        const responseData = await response.json();
        return responseData;
      }

      //function to make the draw of profiles
      function paintUI(apiResponse, type) {
        const profileListSearch = document.querySelector("#gmailProfileList");

        if (type !== "loadmore") {
          profileListSearch.innerHTML = "";
        }

        for (let i = 0; i < apiResponse.body.length; i++) {
          const item = apiResponse.body[i]; // ✅ use a different name
          const id = item.id;

          const profileSearch = document.createElement("div");

          profileSearch.innerHTML = `
  <div class="gmailProfileCard">
    <img src="${item.image}" />
    <div class="info">
      <span class="name">${item.name}</span>
      <span class="desc">${item.desc}</span>
    </div>

  </div>
`;
          profileListSearch.appendChild(profileSearch);

          // Profile click
          profileSearch.addEventListener("click", function () {
            gmailDetailedProfile(id);
          });
        }
      }

      function makeDivDraggable(iconId, divId) {
        var drag = new Object();
        var dragIcon = new Object();

        dragIcon.obj = document.getElementById(iconId);
        drag.obj = document.getElementById(divId);

        dragIcon.obj.addEventListener("mousedown", function (e) {
          drag.top = parseInt(drag.obj.offsetTop);
          drag.left = parseInt(drag.obj.offsetLeft);
          drag.oldx = drag.x;
          drag.oldy = drag.y;
          drag.drag = true;
        });

        window.addEventListener("mouseup", function () {
          drag.drag = false;
        });

        window.addEventListener("mousemove", function (e) {
          drag.x = e.clientX;
          drag.y = e.clientY;
          var diffw = drag.x - drag.oldx;
          var diffh = drag.y - drag.oldy;

          if (drag.drag) {
            drag.obj.style.left = drag.left + diffw + "px";
            drag.obj.style.top = drag.top + diffh + "px";
            e.preventDefault();
          }
        });
      }
      function cleanDefaultDivs(parentDiv) {
        if (parentDiv == "companyPostsLL") {
          const postTimeElements = document.querySelectorAll(".posttimell");
          postTimeElements.forEach((element) => {
            if (
              element.innerText == "Posting time here" ||
              element.innerText == "Not Provided"
            ) {
              element.classList.add("hidden");
            } else {
              element.classList.remove("hidden");
            }
          });
        }
        if (parentDiv == "datetimell") {
          const postTimeElements = document.querySelectorAll(".datetimell");
          postTimeElements.forEach((element) => {
            if (
              element.innerText.includes("News timestamp") ||
              element.innerText.includes("DD MMM, YYYY")
            ) {
              element.classList.add("hidden");
            } else {
              element.classList.remove("hidden");
            }
          });
        }
      }

      //email creation start here
    }
  });
}
async function gmailDetailedProfile(id) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/get-linkedin-profile-main-byid",
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
    fetch(chrome.runtime.getURL("pages/profile.html"))
      .then((r) => r.text())
      .then(async (html) => {
        // Create a new unique div for each response
        const uniqueId = `gmailProfileDetails-${Math.floor(
          Math.random() * 100000
        )}`;

        const newPopupDiv = document.createElement("div");
        newPopupDiv.id = uniqueId;
        newPopupDiv.classList.add("popup-container", "lead-container");
        newPopupDiv.style.backgroundColor = "#ffffff";
        newPopupDiv.style.display = "flex";
        newPopupDiv.style.flexDirection = "column";
        newPopupDiv.style.height = "615px";
        newPopupDiv.style.width = "515px";
        newPopupDiv.style.overflow = "visible";
        newPopupDiv.style.position = "fixed";
        newPopupDiv.style.top = "120px";
        newPopupDiv.style.left = "80px";
        newPopupDiv.style.zIndex = "9999";

        const dragIconDiv = document.createElement("div");
        dragIconDiv.id = `dragIconLL-${uniqueId}`;
        dragIconDiv.className = "dragIconLL";
        dragIconDiv.style.position = "absolute";
        dragIconDiv.style.top = "1px";
        dragIconDiv.style.left = "50%";
        dragIconDiv.style.zIndex = "10000";
        dragIconDiv.style.pointerEvents = "all";
        dragIconDiv.innerHTML = `
                  <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.75098 8.625C6.75098 8.8475 6.685 9.06501 6.56138 9.25002C6.43776 9.43502 6.26206 9.57922 6.0565 9.66437C5.85093 9.74951 5.62473 9.77179 5.4065 9.72838C5.18827 9.68498 4.98782 9.57783 4.83048 9.4205C4.67315 9.26316 4.566 9.06271 4.52259 8.84448C4.47919 8.62625 4.50146 8.40005 4.58661 8.19448C4.67176 7.98891 4.81596 7.81321 5.00096 7.6896C5.18597 7.56598 5.40347 7.5 5.62598 7.5C5.92435 7.5 6.21049 7.61853 6.42147 7.82951C6.63245 8.04048 6.75098 8.32663 6.75098 8.625ZM12.001 7.5C11.7785 7.5 11.561 7.56598 11.376 7.6896C11.191 7.81321 11.0468 7.98891 10.9616 8.19448C10.8765 8.40005 10.8542 8.62625 10.8976 8.84448C10.941 9.06271 11.0481 9.26316 11.2055 9.4205C11.3628 9.57783 11.5633 9.68498 11.7815 9.72838C11.9997 9.77179 12.2259 9.74951 12.4315 9.66437C12.6371 9.57922 12.8128 9.43502 12.9364 9.25002C13.06 9.06501 13.126 8.8475 13.126 8.625C13.126 8.32663 13.0075 8.04048 12.7965 7.82951C12.5855 7.61853 12.2993 7.5 12.001 7.5ZM18.376 9.75C18.5985 9.75 18.816 9.68402 19.001 9.5604C19.186 9.43679 19.3302 9.26109 19.4153 9.05552C19.5005 8.84995 19.5228 8.62375 19.4794 8.40552C19.436 8.1873 19.3288 7.98684 19.1715 7.82951C19.0141 7.67217 18.8137 7.56503 18.5955 7.52162C18.3772 7.47821 18.151 7.50049 17.9455 7.58564C17.7399 7.67078 17.5642 7.81498 17.4406 7.99998C17.317 8.18499 17.251 8.4025 17.251 8.625C17.251 8.92337 17.3695 9.20952 17.5805 9.4205C17.7915 9.63147 18.0776 9.75 18.376 9.75ZM5.62598 14.25C5.40347 14.25 5.18597 14.316 5.00096 14.4396C4.81596 14.5632 4.67176 14.7389 4.58661 14.9445C4.50146 15.15 4.47919 15.3762 4.52259 15.5945C4.566 15.8127 4.67315 16.0132 4.83048 16.1705C4.98782 16.3278 5.18827 16.435 5.4065 16.4784C5.62473 16.5218 5.85093 16.4995 6.0565 16.4144C6.26206 16.3292 6.43776 16.185 6.56138 16C6.685 15.815 6.75098 15.5975 6.75098 15.375C6.75098 15.0766 6.63245 14.7905 6.42147 14.5795C6.21049 14.3685 5.92435 14.25 5.62598 14.25ZM12.001 14.25C11.7785 14.25 11.561 14.316 11.376 14.4396C11.191 14.5632 11.0468 14.7389 10.9616 14.9445C10.8765 15.15 10.8542 15.3762 10.8976 15.5945C10.941 15.8127 11.0481 16.0132 11.2055 16.1705C11.3628 16.3278 11.5633 16.435 11.7815 16.4784C11.9997 16.5218 12.2259 16.4995 12.4315 16.4144C12.6371 16.3292 12.8128 16.185 12.9364 16C13.06 15.815 13.126 15.5975 13.126 15.375C13.126 15.0766 13.0075 14.7905 12.7965 14.5795C12.5855 14.3685 12.2993 14.25 12.001 14.25ZM18.376 14.25C18.1535 14.25 17.936 14.316 17.751 14.4396C17.566 14.5632 17.4218 14.7389 17.3366 14.9445C17.2515 15.15 17.2292 15.3762 17.2726 15.5945C17.316 15.8127 17.4231 16.0132 17.5805 16.1705C17.7378 16.3278 17.9383 16.435 18.1565 16.4784C18.3747 16.5218 18.6009 16.4995 18.8065 16.4144C19.0121 16.3292 19.1878 16.185 19.3114 16C19.435 15.815 19.501 15.5975 19.501 15.375C19.501 15.0766 19.3824 14.7905 19.1715 14.5795C18.9605 14.3685 18.6743 14.25 18.376 14.25Z"
                fill="#383E44"
              />
            </svg>
        `;

        const closeIconDiv = document.createElement("div");
        closeIconDiv.id = `close-${uniqueId}`;
        closeIconDiv.className = "close-btn";
        closeIconDiv.style.position = "absolute"; // Fix the popup in the viewport
        closeIconDiv.style.top = "0px";
        closeIconDiv.style.left = "480px";
        closeIconDiv.innerHTML = `✕`;
        // Add the close button, drag icon, and profile details directly to the popup container
        newPopupDiv.innerHTML = `
                                  ${html}
                                 `;
        document.body.appendChild(newPopupDiv);
        // Append the new popup to the body
        // const blurOverlay = document.querySelector(".blur-overlay");
        // //We are inserting before the blur overlay so on hover of popup we can see the blur effect
        // if (blurOverlay) {
        //   document.body.insertBefore(newPopupDiv, blurOverlay);
        // } else {
        //   // fallback: append at end if blur-overlay not found
        //   document.body.appendChild(newPopupDiv);
        // }

        newPopupDiv.appendChild(dragIconDiv);
        newPopupDiv.appendChild(closeIconDiv);
        makeDivDraggable(`dragIconLL-${uniqueId}`, uniqueId);
        loadAllParsonas(uniqueId);
        loadCompanyDetails(uniqueId);
        toggleDisplayBasedOnStatus(uniqueId);
        loadEmailCreationScript(uniqueId);
        loadAllCustomQuestion(uniqueId, "");
        signalSetting(uniqueId, "");
        frameWorkSetting(uniqueId, "");
        loadCanvasScript(uniqueId, "");
        // Close the popup when the close button is clicked
        document
          .getElementById(`close-${uniqueId}`)
          .addEventListener("click", () => {
            document.getElementById(uniqueId).remove();
            chrome.storage.local.get("minimizeStatus", function (result) {
              const minimizeStatus = result?.minimizeStatus;
              if (minimizeStatus === "small") {
                document.getElementById("minimizeContainer").style.display =
                  "flex";
              } else if (minimizeStatus === "center") {
                document.getElementById("centerContainer-ll").style.display =
                  "block";
              } else {
                document.getElementById("floatContainer").style.display =
                  "block";
              }
            });
            document.getElementById("profile-content-container").style.display =
              "none";
            document.getElementById("float-content-container").style.display =
              "block";
            document.getElementById("canvas-list-bigCard").style.display =
              "none";
            document.getElementById("getCanvas").style.display = "block";
            document.getElementById("button-container-ll").style.display =
              "block";
            document.getElementById(
              "Previous-actions-cantainer-ll"
            ).style.display = "none";
            document.getElementById("profile-footer-ll").style.display =
              "block";
            floatSelectedUserID = null;
            floatSelectedUserLinkedInURL = null;
          });

        document
          .getElementById(uniqueId)
          .querySelector("#close-canvas-main-ll")
          .addEventListener("click", () => {
            document
              .getElementById(uniqueId)
              .querySelector("#canvas-cantainer-in-main-card").style.display =
              "none";
          });
        runCanvas(floatSelectedUserLinkedInURL, "canvas-in-main");
        document
          .getElementById(uniqueId)
          .querySelector("#main-back-float-ll")
          .addEventListener("click", () => {
            document.getElementById(uniqueId).remove();
            document.getElementById("revaaloLLWrapper").style.display = "none";
            chrome.storage.local.get("minimizeStatus", function (result) {
              const minimizeStatus = result?.minimizeStatus;
              if (minimizeStatus === "small") {
                document.getElementById("minimizeContainer").style.display =
                  "flex";
              } else if (minimizeStatus === "center") {
                document.getElementById("centerContainer-ll").style.display =
                  "block";
              } else {
                document.getElementById("floatContainer").style.display =
                  "block";
              }
            });
            document.getElementById("profile-content-container").style.display =
              "none";
            document.getElementById("float-content-container").style.display =
              "block";
            document.getElementById(
              "Previous-actions-cantainer-ll"
            ).style.display = "block";
            document.getElementById(
              "Previous-actions-cantainer-ll"
            ).style.display = "none";
            floatSelectedUserID = null;
            floatSelectedUserLinkedInURL = null;
          });
        //as for the new UI I have no navbar so on click we set the global varibale
        //based on that we will open the perticular tab

        document
          .getElementById(uniqueId)
          .querySelector("#user-name-float-ll").innerText =
          "/ " + responseData.profileName.split(" ")[0];
        document.getElementById("user-name").innerText =
          responseData.profileName.split(" ")[0];
        document.getElementById("user-img").src = responseData.profileImage;

        if (responseData?.activetime && responseData?.activetime.length > 0) {
          changeActiveTime(responseData?.activetime, "floatContainer");
        }
        document
          .getElementById(uniqueId)
          .querySelector("#user-name-float-ll")
          .addEventListener("click", () => {
            document.getElementById(uniqueId).remove();
            document.getElementById("revaaloLLWrapper").style.display = "none";
            chrome.storage.local.get("minimizeStatus", function (result) {
              const minimizeStatus = result?.minimizeStatus;
              if (minimizeStatus === "small") {
                document.getElementById("minimizeContainer").style.display =
                  "flex";
              } else if (minimizeStatus === "center") {
                document.getElementById("centerContainer-ll").style.display =
                  "block";
              } else {
                document.getElementById("floatContainer").style.display =
                  "block";
              }
            });
            document.getElementById("profile-content-container").style.display =
              "grid";
            document.getElementById("float-content-container").style.display =
              "none";
            makeCardBig();
            callNanoByID(floatSelectedUserLinkedInURL);
            callPerivausAction(floatSelectedUserLinkedInURL);
          });
        if (floatSelectedID === "search") {
          await previewSearch();
          document
            .getElementById(uniqueId)
            .querySelector("#page-float-header-text").innerText = "/ Ask Ai";
          document
            .getElementById(uniqueId)
            .querySelector("#page-header-actions").style.display = "none";
          floatSelectedID = "";
        } else if (floatSelectedID === "parsonaListing") {
          document
            .getElementById(uniqueId)
            .querySelector("#page-float-header-text").innerText = "/ Settings";
          document
            .getElementById(uniqueId)
            .querySelector("#page-header-actions").style.display = "none";
          await previewPersonalaListing();
          floatSelectedID = "";
        } else if (floatSelectedID === "canvasOpen") {
          document
            .getElementById(uniqueId)
            .querySelector("#page-float-header-text").innerText = "/ Canvas";
          document
            .getElementById(uniqueId)
            .querySelector("#page-header-actions").style.display = "none";

          await previewCanvas();
          const canvasBtn = document
            .getElementById(uniqueId)
            .querySelector("#create-canvas-button");
          if (canvasBtn) {
            canvasBtn.click();
          }
          floatSelectedID = "";
        } else if (editDeleteCanvasId) {
          await previewCanvas();
          document
            .getElementById(uniqueId)
            .querySelector("#page-float-header-text").innerText = "/ Canvas";
          document
            .getElementById(uniqueId)
            .querySelector("#page-header-actions").style.display = "none";
          if (deleteCanvasStatus) {
            deleteCanvasFromStartCard(editDeleteCanvasId);
          } else {
            editCanvas(editDeleteCanvasId);
          }
          editDeleteCanvasId = "";
          deleteCanvasStatus = false;
        } else {
          document
            .getElementById(uniqueId)
            .querySelector("#page-float-header-text").innerText = "/ Insight";
          document
            .getElementById(uniqueId)
            .querySelector("#page-header-actions").style.display = "flex";
        }
        // Now you can add your content and logic specific to the response inside this popup
        document
          .getElementById(uniqueId)
          .querySelector("#profileAnalysis")
          .addEventListener("click", previewProfileAnalysis);
        document
          .getElementById(uniqueId)
          .querySelector("#prospect-click")
          .addEventListener("click", previewProspectSub);
        document
          .getElementById(uniqueId)
          .querySelector("#communicatonFrameWork")
          .addEventListener("click", previewCommunicationFrameWork);
        document
          .getElementById(uniqueId)
          .querySelector("#companyDetails")
          .addEventListener("click", previewCompanyDetails);
        document
          .getElementById(uniqueId)
          .querySelector("#search")
          .addEventListener("click", previewSearch);
        document
          .getElementById(uniqueId)
          .querySelector("#parsonaListing")
          .addEventListener("click", previewPersonalaListing);
        document
          .getElementById(uniqueId)
          .querySelector("#settingProfile")
          .addEventListener("click", previewPersonalaListing);
        document
          .getElementById(uniqueId)
          .querySelector("#canvasOpen")
          .addEventListener("click", previewCanvas);
        document
          .getElementById(uniqueId)
          .querySelector("#emailCreation")
          .addEventListener("click", function (event) {
            // Disable the button

            previewEmailCreation();
          });

        function previewProfileAnalysis() {
          document
            .getElementById(uniqueId)
            .querySelectorAll(".tabcontent")
            .forEach(function (div) {
              div.style.display = "none";
            });
          document
            .getElementById(uniqueId)
            .querySelector("#profileAnalysisDetails").style.display = "block";
          toggleDisplayBasedOnStatus(uniqueId);
        }

        function previewCommunicationFrameWork() {
          document
            .getElementById(uniqueId)
            .querySelectorAll(".tabcontent-sub")
            .forEach(function (div) {
              div.style.display = "none";
            });

          document
            .getElementById(uniqueId)
            .querySelector("#communicationFrameWorkDetails").style.display =
            "block";
        }
        function previewProspectSub() {
          document
            .getElementById(uniqueId)
            .querySelectorAll(".tabcontent-sub")
            .forEach(function (div) {
              div.style.display = "none";
            });
          document
            .getElementById(uniqueId)
            .querySelector("#prospect-sub-ll").style.display = "block";
        }
        function previewCompanyDetails() {
          const uniqueContainer = document.getElementById(uniqueId);
          loadCompanyDetails(uniqueId);
          loadWorkFlowDetails(
            uniqueId,
            uniqueContainer.querySelector("#linkedinUrl").innerText
          );
          document
            .getElementById(uniqueId)
            .querySelectorAll(".tabcontent-sub")
            .forEach(function (div) {
              div.style.display = "none";
            });
          document
            .getElementById(uniqueId)
            .querySelector("#companyDetailsBlock").style.display = "block";
        }
        async function previewSearch() {
          document
            .getElementById(uniqueId)
            .querySelectorAll(".tabcontent")
            .forEach(function (div) {
              div.style.display = "none";
            });
          const searchPromptElement = document
            .getElementById(uniqueId)
            .querySelector("#searchPrompt");
          searchPromptElement.style.display = "block";
          searchPromptElement.children[0].style.display = "block";
          searchPromptElement.children[1].style.display = "none";

          // Clear any existing chat list content
          const chatListElement = document
            .getElementById(uniqueId)
            .querySelector("#chatList");
          chatListElement.innerHTML = ""; // Clear previous content

          // Create a container div with styles for the empty array message
          const emptyArray = document.createElement("div");
          emptyArray.style.display = "flex";
          emptyArray.style.justifyContent = "center";
          emptyArray.style.alignItems = "center";
          emptyArray.style.height = "45vh";
          emptyArray.classList.add("empty-chat-message");

          // Add the SVG icon and message
          emptyArray.innerHTML =
            '<div class="empty-list-ll">' +
            '<img src="' +
            chrome.runtime.getURL("assets/askAI.png") +
            '" class="empty-icon-ll" alt="Ask AI">' +
            "<p>Ask Your Question Here.</p>" +
            "</div>";

          // Append the empty message to the chatList
          chatListElement.appendChild(emptyArray);

          // Get company name
          const companyName = document
            .getElementById(uniqueId)
            .querySelector("#companyNameLL")
            .textContent.trim();
          const prospectName = document
            .getElementById(uniqueId)
            .querySelector("#profileNameGenerateContent")
            .textContent.trim();

          const buttonTexts = await getGlobleQuestion(
            floatSelectedUserLinkedInURL
          );

          const buttons = buttonTexts?.questions.map((text) =>
            text
              .replace(/{{company_name}}/g, buttonTexts?.companyName)
              .replace(/{{prospect_name}}/g, buttonTexts?.profilename)
          );

          // Clear any existing buttons inside searchQuestion div
          const searchQuestionDiv = document
            .getElementById(uniqueId)
            .querySelector("#searchQuestion");
          searchQuestionDiv.innerHTML = "";

          // Create slider structure
          const sliderContainer = document.createElement("div");
          sliderContainer.classList.add("slideshow-container");

          const buttonWrapper = document.createElement("div");
          buttonWrapper.classList.add("button-wrapper");

          const slides = [];
          for (let i = 0; i < buttons.length; i += 2) {
            const slide = document.createElement("div");
            slide.classList.add("mySlides");
            slide.style.display = "none"; // Initially hide all slides

            // Add two buttons to each slide (or one if it's the last button)
            const button1 = document.createElement("button");
            button1.setAttribute("type", "button");
            button1.setAttribute("class", "search-btn-ll");
            button1.textContent = buttons[i];
            slide.appendChild(button1);

            if (i + 1 < buttons.length) {
              const button2 = document.createElement("button");
              button2.setAttribute("type", "button");
              button2.setAttribute("class", "search-btn-ll");
              button2.textContent = buttons[i + 1];
              slide.appendChild(button2);
            }

            slides.push(slide);
            buttonWrapper.appendChild(slide);
          }

          sliderContainer.appendChild(buttonWrapper);
          searchQuestionDiv.appendChild(sliderContainer);

          const buttonholder = document.createElement("div");
          buttonholder.classList.add("prev-next-container");
          // Add navigation buttons

          const modelSelect = document.createElement("select");
          modelSelect.classList.add("model-selector");
          modelSelect.id = "search-model";
          modelSelect.style.width = "50%";
          modelSelect.style.padding = "5px";
          modelSelect.style.marginBottom = "3px";
          buttonTexts?.model.forEach((model) => {
            const option = document.createElement("option");
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
          });
          const container = document.createElement("div");
          container.style.display = "flex";
          container.style.gap = "10px";
          container.style.width = "20%";

          const prevButton = document.createElement("button");
          prevButton.classList.add("prev");
          prevButton.textContent = "❮";

          const nextButton = document.createElement("button");
          nextButton.classList.add("next");
          nextButton.textContent = "❯";

          // Append buttons to the container
          container.appendChild(prevButton);
          container.appendChild(nextButton);
          buttonholder.appendChild(modelSelect);
          buttonholder.appendChild(container);

          sliderContainer.appendChild(buttonholder);

          // Slider navigation logic
          let slideIndex = 1;

          function showSlides(n) {
            if (n > slides.length) slideIndex = 1;
            if (n < 1) slideIndex = slides.length;
            slides.forEach((slide, i) => {
              slide.style.display = i === slideIndex - 1 ? "block" : "none";
            });
          }

          prevButton.onclick = () => {
            slideIndex--;
            showSlides(slideIndex);
          };

          nextButton.onclick = () => {
            slideIndex++;
            showSlides(slideIndex);
          };

          showSlides(slideIndex);
          // Add event listeners to copy button text to chatInput
          const buttonsList =
            sliderContainer.querySelectorAll(".search-btn-ll");
          buttonsList.forEach((button) => {
            button.addEventListener("click", function () {
              const chatInput = document
                .getElementById(uniqueId)
                .querySelector("#chatInput");
              chatInput.value = button.textContent; // Copy button text to chatInput
            });
          });
        }
        function previewPersonalaListing() {
          document
            .getElementById(uniqueId)
            .querySelectorAll(".tabcontent")
            .forEach(function (div) {
              div.style.display = "none";
            });

          showPersonaListing(uniqueId);

          const parentElement = document
            .getElementById(uniqueId)
            .querySelector("#parsonaListingDetails");
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
          document
            .getElementById(uniqueId)
            .querySelector("#page-float-header-text").innerText = "/ Settings";
        }

        async function previewEmailCreation() {
          const uniqueContainer = document.getElementById(uniqueId);

          loadWorkFlowDetails(
            uniqueId,
            uniqueContainer.querySelector("#linkedinUrl").innerText
          );
          // Check if the function is on cooldown
          if (previewEmailCreation.isCooldown) {
            //console.log("Function call ignored during cooldown");
            return;
          }

          // Load company details as needed

          // Check content length by calling the API
          const hasGeneratedContent = await checkLenghtGenerateContent(
            uniqueContainer.querySelector("#linkedinUrl").innerText
          );

          // Hide all tab content
          uniqueContainer.querySelectorAll(".tabcontent").forEach((div) => {
            div.style.display = "none";
          });

          // Show or hide content sections based on result
          const emailDetails = uniqueContainer.querySelector(
            "#emailCreationDetails"
          );
          emailDetails.style.display = "block";
          emailDetails.children[0].style.display = "block";
          if (hasGeneratedContent) {
            // If result is true, show the second child and call `loadGenerateContentHistory`
            emailDetails.children[0].style.display = "none";
            emailDetails.children[2].style.display = "none";
            emailDetails.children[1].style.display = "block";
            emailDetails.children[3].style.display = "none";
            loadGenerateContentHistory(
              uniqueId,
              uniqueContainer.querySelector("#linkedinUrl").innerText
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
          const profileName = profileNameElement
            ? profileNameElement.innerText
            : "";
          const firstName = profileName.split(" ")[0];
          const button = uniqueContainer.querySelector("#ViewContentHistory");

          if (profileName && button) {
            button.innerText = `${firstName}'s Threads`;
          }

          const ptag = uniqueContainer.querySelector("#followupHeading");
          const savedMessage = uniqueContainer.querySelector("#unsavedMessage");
          if (profileName && button) {
            ptag.innerText = `Follow up with ${firstName}`;
            savedMessage.innerText = `All message history with ${firstName}`;
          }

          await getFrameWork(0, "signal", uniqueId);
          loadCompanyDetails(uniqueId);
          loadAllParsonas(uniqueId);

          // Set the cooldown
          previewEmailCreation.isCooldown = true;
          // Reset cooldown after 3 seconds
          setTimeout(() => {
            previewEmailCreation.isCooldown = false;
          }, 3000);
        }
        function previewCanvas() {
          document
            .getElementById(uniqueId)
            .querySelectorAll(".tabcontent")
            .forEach(function (div) {
              div.style.display = "none";
            });
          document
            .getElementById(uniqueId)
            .querySelector("#leadlabscanvas").style.display = "block";
          document
            .getElementById(uniqueId)
            .querySelector("#leadlabscanvas").children[0].style.display =
            "block";
          document
            .getElementById(uniqueId)
            .querySelector("#leadlabscanvas").children[1].style.display =
            "none";
        }

        document
          .getElementById(uniqueId)
          .querySelectorAll(".sub-tab")
          .forEach((tab) => {
            tab.addEventListener("click", () => {
              // Remove 'active' from all sub-tabs
              document
                .getElementById(uniqueId)
                .querySelectorAll(".sub-tab")
                .forEach((el) => el.classList.remove("active"));

              // Add 'active' to the clicked tab
              tab.classList.add("active");
            });
          });

        //THis code for on click on the postll or for the signal selection, (Globel selection)
        // document.addEventListener("click", (event) => {
        //   const post = event.target.closest(".postll");
        //   if (!post) return;

        //   // Find the nearest popup container (the one with the id)
        //   const popupContainer = post.closest(".popup-container");
        //   if (!popupContainer) return;

        //   // Get the id of the container, which is your uniqueId
        //   const uniqueId = popupContainer.id;

        //   if (!validateSignals(uniqueId));

        //   contentSelectPostData(uniqueId, post);
        //   manageSignalSummaryDisplay(uniqueId, ".signalsll");
        //   updateCounts(uniqueId);
        // });
        if (!window.hasPopupClickListener) {
          document.addEventListener("click", (event) => {
            const post = event.target.closest(".postll");
            if (!post) return;

            const popupContainer = post.closest(".popup-container");
            if (!popupContainer) return;

            const uniqueId = popupContainer.id;

            if (!validateSignals(uniqueId));

            contentSelectPostData(uniqueId, post);
            manageSignalSummaryDisplay(uniqueId, ".signalsll");
            updateCounts(uniqueId);
          });

          window.hasPopupClickListener = true; // mark as initialized
        }

        document
          .getElementById(uniqueId)
          .querySelector("#ViewContentHistory")
          .addEventListener("click", (event) => {
            const uniqueContainer = document.getElementById(uniqueId);
            uniqueContainer.querySelector(
              "#emailCreationDetails"
            ).children[0].style.display = "none";
            uniqueContainer.querySelector(
              "#emailCreationDetails"
            ).children[1].style.display = "block";

            loadGenerateContentHistory(
              uniqueId,
              uniqueContainer.querySelector("#linkedinUrl").innerText
            );
          });

        document
          .getElementById(uniqueId)
          .querySelector("#ViewContentHistoryFull")

          .addEventListener("click", (event) => {
            loadGenerateContentHistory(uniqueId);
          });

        const naviconElements = document
          .getElementById(uniqueId)
          .querySelectorAll(".naviconLL"); // Use querySelectorAll to get a NodeList

        // Add click event listeners to each element
        // Define SVG replacements
        // Define SVG replacements
        const svgIcons = {
          profileAnalysis: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5001 21.7504C16.5001 21.9494 16.4211 22.1401 16.2805 22.2808C16.1398 22.4214 15.949 22.5004 15.7501 22.5004H8.25012C8.05121 22.5004 7.86044 22.4214 7.71979 22.2808C7.57914 22.1401 7.50012 21.9494 7.50012 21.7504C7.50012 21.5515 7.57914 21.3608 7.71979 21.2201C7.86044 21.0795 8.05121 21.0004 8.25012 21.0004H15.7501C15.949 21.0004 16.1398 21.0795 16.2805 21.2201C16.4211 21.3608 16.5001 21.5515 16.5001 21.7504ZM20.2501 9.75044C20.2534 11.0007 19.9709 12.2352 19.4243 13.3597C18.8778 14.4842 18.0815 15.469 17.0964 16.2389C16.9122 16.3801 16.7627 16.5615 16.6593 16.7693C16.556 16.9772 16.5015 17.2058 16.5001 17.4379V18.0004C16.5001 18.3983 16.3421 18.7798 16.0608 19.0611C15.7795 19.3424 15.3979 19.5004 15.0001 19.5004H9.00012C8.6023 19.5004 8.22077 19.3424 7.93946 19.0611C7.65816 18.7798 7.50012 18.3983 7.50012 18.0004V17.4379C7.49997 17.2086 7.44724 16.9824 7.34599 16.7766C7.24474 16.5709 7.09766 16.3911 6.91606 16.2511C5.93337 15.4857 5.13767 14.5069 4.58916 13.3886C4.04066 12.2703 3.75374 11.0419 3.75012 9.79638C3.72575 5.32825 7.337 1.60732 11.8014 1.50044C12.9014 1.47393 13.9956 1.66774 15.0196 2.07046C16.0436 2.47317 16.9767 3.07666 17.7639 3.8454C18.5512 4.61414 19.1767 5.5326 19.6037 6.54671C20.0306 7.56083 20.2504 8.65011 20.2501 9.75044ZM17.2398 8.87482C17.0453 7.78853 16.5227 6.78791 15.7423 6.00766C14.9619 5.22741 13.9611 4.705 12.8748 4.51075C12.7777 4.49438 12.6783 4.4973 12.5823 4.51934C12.4862 4.54139 12.3955 4.58213 12.3153 4.63924C12.235 4.69634 12.1668 4.7687 12.1145 4.85218C12.0622 4.93566 12.0268 5.02862 12.0104 5.12575C11.9941 5.22289 11.997 5.3223 12.019 5.41831C12.0411 5.51432 12.0818 5.60505 12.1389 5.68531C12.196 5.76558 12.2684 5.83381 12.3519 5.88611C12.4353 5.93841 12.5283 5.97375 12.6254 5.99013C14.1789 6.25169 15.497 7.56982 15.7604 9.12607C15.7901 9.30074 15.8807 9.45927 16.0161 9.57356C16.1515 9.68785 16.3229 9.75051 16.5001 9.75044C16.5425 9.75019 16.5848 9.74674 16.6267 9.74013C16.8227 9.70666 16.9974 9.5967 17.1124 9.43443C17.2274 9.27216 17.2732 9.07087 17.2398 8.87482Z" 
    fill="#0D4E60"/>
  </svg>`,
          profileAnalysisOriginal: `<svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.25 21.75H15.75"
          stroke="#919596"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M7.37824 15.656C6.48665 14.9595 5.76449 14.07 5.266 13.0544C4.76751 12.0387 4.50566 10.9233 4.50012 9.79195C4.47762 5.72695 7.75512 2.34351 11.8192 2.24976C13.3942 2.21161 14.9412 2.67041 16.2408 3.56108C17.5403 4.45174 18.5264 5.72903 19.0591 7.21171C19.5918 8.6944 19.644 10.3072 19.2084 11.8212C18.7728 13.3353 17.8715 14.6737 16.6323 15.6466C16.359 15.8586 16.1375 16.1299 15.9846 16.4402C15.8318 16.7504 15.7516 17.0914 15.7501 17.4373V17.9998C15.7501 18.1987 15.6711 18.3894 15.5304 18.5301C15.3898 18.6707 15.199 18.7498 15.0001 18.7498H9.00012C8.8012 18.7498 8.61044 18.6707 8.46979 18.5301C8.32913 18.3894 8.25012 18.1987 8.25012 17.9998V17.4373C8.24976 17.0936 8.17104 16.7546 8.01996 16.4459C7.86888 16.1372 7.64941 15.8671 7.37824 15.656Z"
          stroke="#919596"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.75 5.25C14.625 5.56594 16.1822 7.125 16.5 9"
          stroke="#919596"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>`,
          emailCreation: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M21 4.5H3C2.80109 4.5 2.61032 4.57902 2.46967 4.71967C2.32902 4.86032 2.25 5.05109 2.25 5.25V18C2.25 18.3978 2.40804 18.7794 2.68934 19.0607C2.97064 19.342 3.35218 19.5 3.75 19.5H20.25C20.6478 19.5 21.0294 19.342 21.3107 19.0607C21.592 18.7794 21.75 18.3978 21.75 18V5.25C21.75 5.05109 21.671 4.86032 21.5303 4.71967C21.3897 4.57902 21.1989 4.5 21 4.5ZM20.25 18H3.75V6.95531L11.4928 14.0531C11.6312 14.1801 11.8122 14.2506 12 14.2506C12.1878 14.2506 12.3688 14.1801 12.5072 14.0531L20.25 6.95531V18Z" fill="#0D4E60"/>
  </svg>`,
          search: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.75 10.4998C15.75 11.5381 15.4421 12.5532 14.8652 13.4165C14.2884 14.2799 13.4684 14.9528 12.5091 15.3501C11.5498 15.7475 10.4942 15.8515 9.47581 15.6489C8.45741 15.4463 7.52194 14.9463 6.78772 14.2121C6.05349 13.4779 5.55348 12.5424 5.35091 11.524C5.14833 10.5056 5.2523 9.45 5.64966 8.49068C6.04702 7.53137 6.71993 6.71143 7.58329 6.13456C8.44664 5.55768 9.46168 5.24977 10.5 5.24977C11.8924 5.24977 13.2278 5.8029 14.2123 6.78746C15.1969 7.77203 15.75 9.10739 15.75 10.4998ZM21.5307 21.5304C21.461 21.6001 21.3783 21.6554 21.2872 21.6932C21.1962 21.7309 21.0986 21.7504 21 21.7504C20.9015 21.7504 20.8039 21.7309 20.7128 21.6932C20.6218 21.6554 20.5391 21.6001 20.4694 21.5304L15.7763 16.8363C14.1442 18.1941 12.0515 18.8705 9.93346 18.7247C7.81543 18.5789 5.83514 17.6222 4.40449 16.0536C2.97384 14.485 2.20297 12.4252 2.25222 10.3027C2.30148 8.18027 3.16707 6.15849 4.66895 4.65793C6.17083 3.15738 8.19337 2.29358 10.3159 2.2462C12.4384 2.19882 14.4975 2.97151 16.0648 4.40354C17.6322 5.83558 18.5871 7.81672 18.731 9.93488C18.8749 12.053 18.1968 14.1451 16.8375 15.776L21.5307 20.4691C21.6004 20.5388 21.6557 20.6215 21.6934 20.7126C21.7312 20.8036 21.7506 20.9012 21.7506 20.9998C21.7506 21.0983 21.7312 21.1959 21.6934 21.287C21.6557 21.378 21.6004 21.4607 21.5307 21.5304ZM10.5 17.2498C11.8351 17.2498 13.1401 16.8539 14.2501 16.1122C15.3602 15.3705 16.2253 14.3163 16.7362 13.0829C17.2471 11.8495 17.3808 10.4923 17.1203 9.18291C16.8599 7.87354 16.217 6.67081 15.273 5.7268C14.329 4.7828 13.1263 4.13992 11.8169 3.87947C10.5075 3.61902 9.15032 3.75269 7.91692 4.26359C6.68351 4.77448 5.62931 5.63964 4.88761 6.74967C4.14591 7.8597 3.75003 9.16475 3.75003 10.4998C3.75201 12.2894 4.46381 14.0051 5.72925 15.2706C6.99469 16.536 8.71043 17.2478 10.5 17.2498Z" fill="#0D4E60"/>
</svg>
`,
          parsonaListing: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.25 12.2021C20.2538 12.0671 20.2538 11.9321 20.25 11.7971L21.6488 10.0496C21.7221 9.9578 21.7729 9.85011 21.797 9.73514C21.8211 9.62018 21.8179 9.50116 21.7875 9.38768C21.5578 8.52588 21.2148 7.69836 20.7675 6.92674C20.7089 6.82579 20.6275 6.73991 20.5299 6.67595C20.4322 6.61199 20.321 6.5717 20.205 6.5583L17.9813 6.3108C17.8888 6.2133 17.795 6.11955 17.7 6.02955L17.4375 3.80018C17.424 3.68413 17.3836 3.57284 17.3195 3.47518C17.2554 3.37752 17.1693 3.29619 17.0682 3.23768C16.2966 2.79073 15.469 2.44835 14.6072 2.21955C14.4937 2.18924 14.3747 2.186 14.2598 2.2101C14.1448 2.2342 14.0371 2.28496 13.9454 2.3583L12.2025 3.74955C12.0675 3.74955 11.9325 3.74955 11.7975 3.74955L10.05 2.35362C9.95829 2.28027 9.85059 2.22951 9.73563 2.20541C9.62067 2.18131 9.50165 2.18455 9.38817 2.21487C8.52637 2.44458 7.69884 2.78757 6.92723 3.23487C6.82628 3.29348 6.7404 3.37486 6.67644 3.47251C6.61248 3.57017 6.57219 3.6814 6.55879 3.79737L6.31129 6.02487C6.21379 6.11799 6.12004 6.21174 6.03004 6.30612L3.80067 6.56205C3.68462 6.57556 3.57332 6.61598 3.47566 6.68011C3.37801 6.74424 3.29668 6.8303 3.23817 6.93143C2.79131 7.70315 2.44864 8.53066 2.21911 9.39237C2.18891 9.50592 2.18583 9.62498 2.21009 9.73995C2.23435 9.85491 2.28529 9.96257 2.35879 10.0542L3.75004 11.7971C3.75004 11.9321 3.75004 12.0671 3.75004 12.2021L2.35411 13.9496C2.28076 14.0413 2.23 14.149 2.2059 14.264C2.1818 14.3789 2.18504 14.4979 2.21536 14.6114C2.44507 15.4732 2.78806 16.3008 3.23536 17.0724C3.29397 17.1733 3.37535 17.2592 3.473 17.3232C3.57065 17.3871 3.68189 17.4274 3.79785 17.4408L6.02161 17.6883C6.11473 17.7858 6.20848 17.8796 6.30286 17.9696L6.56254 20.1989C6.57604 20.315 6.61647 20.4263 6.6806 20.5239C6.74473 20.6216 6.83079 20.7029 6.93192 20.7614C7.70363 21.2083 8.53114 21.551 9.39286 21.7805C9.50641 21.8107 9.62547 21.8138 9.74044 21.7895C9.8554 21.7652 9.96306 21.7143 10.0547 21.6408L11.7975 20.2496C11.9325 20.2533 12.0675 20.2533 12.2025 20.2496L13.95 21.6483C14.0418 21.7216 14.1495 21.7724 14.2645 21.7965C14.3794 21.8206 14.4984 21.8174 14.6119 21.7871C15.4739 21.5578 16.3014 21.2147 17.0729 20.7671C17.1738 20.7084 17.2597 20.6271 17.3236 20.5294C17.3876 20.4318 17.4279 20.3205 17.4413 20.2046L17.6888 17.9808C17.7863 17.8883 17.88 17.7946 17.97 17.6996L20.1994 17.4371C20.3155 17.4236 20.4268 17.3831 20.5244 17.319C20.6221 17.2549 20.7034 17.1688 20.7619 17.0677C21.2088 16.296 21.5514 15.4685 21.781 14.6067C21.8112 14.4932 21.8143 14.3741 21.79 14.2592C21.7657 14.1442 21.7148 14.0365 21.6413 13.9449L20.25 12.2021ZM12 15.7496C11.2584 15.7496 10.5333 15.5296 9.91665 15.1176C9.29997 14.7055 8.81932 14.1198 8.53549 13.4346C8.25167 12.7494 8.1774 11.9954 8.3221 11.268C8.46679 10.5405 8.82395 9.87235 9.34839 9.3479C9.87284 8.82346 10.541 8.4663 11.2685 8.32161C11.9959 8.17691 12.7499 8.25118 13.4351 8.53501C14.1203 8.81883 14.706 9.29948 15.1181 9.91617C15.5301 10.5329 15.75 11.2579 15.75 11.9996C15.75 12.9941 15.355 13.9479 14.6517 14.6512C13.9484 15.3545 12.9946 15.7496 12 15.7496Z" fill="#0D4E60"/>
</svg>`,
          canvasOpen: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.25 14.25C23.25 14.4489 23.171 14.6397 23.0303 14.7803C22.8897 14.921 22.6989 15 22.5 15H21V16.5C21 16.6989 20.921 16.8897 20.7803 17.0303C20.6397 17.171 20.4489 17.25 20.25 17.25C20.0511 17.25 19.8603 17.171 19.7196 17.0303C19.579 16.8897 19.5 16.6989 19.5 16.5V15H18C17.8011 15 17.6103 14.921 17.4696 14.7803C17.329 14.6397 17.25 14.4489 17.25 14.25C17.25 14.0511 17.329 13.8603 17.4696 13.7197C17.6103 13.579 17.8011 13.5 18 13.5H19.5V12C19.5 11.8011 19.579 11.6103 19.7196 11.4697C19.8603 11.329 20.0511 11.25 20.25 11.25C20.4489 11.25 20.6397 11.329 20.7803 11.4697C20.921 11.6103 21 11.8011 21 12V13.5H22.5C22.6989 13.5 22.8897 13.579 23.0303 13.7197C23.171 13.8603 23.25 14.0511 23.25 14.25ZM5.24998 6.75H6.74998V8.25C6.74998 8.44891 6.829 8.63968 6.96965 8.78033C7.1103 8.92098 7.30107 9 7.49998 9C7.69889 9 7.88966 8.92098 8.03031 8.78033C8.17096 8.63968 8.24998 8.44891 8.24998 8.25V6.75H9.74998C9.94889 6.75 10.1397 6.67098 10.2803 6.53033C10.421 6.38968 10.5 6.19891 10.5 6C10.5 5.80109 10.421 5.61032 10.2803 5.46967C10.1397 5.32902 9.94889 5.25 9.74998 5.25H8.24998V3.75C8.24998 3.55109 8.17096 3.36032 8.03031 3.21967C7.88966 3.07902 7.69889 3 7.49998 3C7.30107 3 7.1103 3.07902 6.96965 3.21967C6.829 3.36032 6.74998 3.55109 6.74998 3.75V5.25H5.24998C5.05107 5.25 4.8603 5.32902 4.71965 5.46967C4.579 5.61032 4.49998 5.80109 4.49998 6C4.49998 6.19891 4.579 6.38968 4.71965 6.53033C4.8603 6.67098 5.05107 6.75 5.24998 6.75ZM17.25 18H16.5V17.25C16.5 17.0511 16.421 16.8603 16.2803 16.7197C16.1397 16.579 15.9489 16.5 15.75 16.5C15.5511 16.5 15.3603 16.579 15.2196 16.7197C15.079 16.8603 15 17.0511 15 17.25V18H14.25C14.0511 18 13.8603 18.079 13.7196 18.2197C13.579 18.3603 13.5 18.5511 13.5 18.75C13.5 18.9489 13.579 19.1397 13.7196 19.2803C13.8603 19.421 14.0511 19.5 14.25 19.5H15V20.25C15 20.4489 15.079 20.6397 15.2196 20.7803C15.3603 20.921 15.5511 21 15.75 21C15.9489 21 16.1397 20.921 16.2803 20.7803C16.421 20.6397 16.5 20.4489 16.5 20.25V19.5H17.25C17.4489 19.5 17.6397 19.421 17.7803 19.2803C17.921 19.1397 18 18.9489 18 18.75C18 18.5511 17.921 18.3603 17.7803 18.2197C17.6397 18.079 17.4489 18 17.25 18ZM20.5603 7.5L7.49998 20.5603C7.2187 20.8414 6.83732 20.9993 6.43967 20.9993C6.04201 20.9993 5.66063 20.8414 5.37935 20.5603L3.43873 18.6216C3.2994 18.4823 3.18888 18.3169 3.11348 18.1349C3.03808 17.9529 2.99927 17.7578 2.99927 17.5608C2.99927 17.3638 3.03808 17.1687 3.11348 16.9867C3.18888 16.8047 3.2994 16.6393 3.43873 16.5L16.5 3.43969C16.6393 3.30036 16.8046 3.18984 16.9867 3.11444C17.1687 3.03904 17.3637 3.00023 17.5608 3.00023C17.7578 3.00023 17.9529 3.03904 18.1349 3.11444C18.3169 3.18984 18.4822 3.30036 18.6215 3.43969L20.5603 5.37844C20.6996 5.51773 20.8101 5.6831 20.8855 5.86511C20.9609 6.04713 20.9998 6.24221 20.9998 6.43922C20.9998 6.63623 20.9609 6.83131 20.8855 7.01332C20.8101 7.19533 20.6996 7.36071 20.5603 7.5ZM19.5 6.43969L17.5603 4.5L14.5603 7.5L16.5 9.43969L19.5 6.43969Z" fill="#0D4E60"/>
</svg>
`,
        };

        // Replace icons and manage classes
        naviconElements.forEach((element) => {
          element.addEventListener("click", function () {
            const id = this.id;

            // 1. Remove active class and reset icons for all
            naviconElements.forEach((el) => {
              el.classList.remove("active");

              const elId = el.id;

              const originalIcon = el.getAttribute("data-original-icon");
              if (originalIcon) {
                el.querySelector("svg").outerHTML = originalIcon;
              }

              if (
                elId === "profileAnalysis" &&
                svgIcons.profileAnalysisOriginal
              ) {
                el.querySelector("svg").outerHTML =
                  svgIcons.profileAnalysisOriginal;
              }
            });

            // 2. Add active to clicked icon
            this.classList.add("active");

            const currentSVG = this.querySelector("svg");

            // Save original if not saved
            if (!this.getAttribute("data-original-icon")) {
              this.setAttribute("data-original-icon", currentSVG.outerHTML);
            }

            // Set active icon
            if (svgIcons[id]) {
              currentSVG.outerHTML = svgIcons[id];
            }

            // 3. ✅ Update header — OUTSIDE the inner loop
            const headerMap = {
              profileAnalysis: "Insight",
              search: "Ask Ai",
              emailCreation: "Message Copilot",
              canvasOpen: "Canvas",
              parsonaListing: "Settings",
            };

            const pageHeaderText = document
              .getElementById(uniqueId)
              .querySelector("#page-header-text");
            const pageHeaderActions = document
              .getElementById(uniqueId)
              .querySelector("#page-header-actions");

            if (pageHeaderText) {
              pageHeaderText.textContent = headerMap[id] || "Insight";
            }

            if (id === "profileAnalysis") {
              pageHeaderActions.style.display = "inline-flex";
            } else {
              pageHeaderActions.style.display = "none";
            }
          });
        });
        document
          .getElementById(uniqueId)
          .querySelector("#submitChat")
          .addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent page refresh

            const chatInputValue = document
              .getElementById(uniqueId)
              .querySelector("#chatInput").value;
            const model = document
              .getElementById(uniqueId)
              .querySelector("#search-model").value;
            if (!chatInputValue) {
              return;
            }

            document
              .getElementById(uniqueId)
              .querySelector("#submitChat").disabled = true;

            const chatData = {
              searchvalue: chatInputValue,
              id: id,
              model: model,
            };

            // Call the function to create chat
            creatChat(chatData, uniqueId);
          });

        document
          .getElementById(uniqueId)
          .querySelector("#ViewSearchHistory")
          .addEventListener("click", (event) => {
            const searchPrompt = document
              .getElementById(uniqueId)
              .querySelector("#searchPrompt");

            searchPrompt.children[0].style.display = "none";
            searchPrompt.children[1].style.display = "block";
            getAllChat(uniqueId, id);
          });

        document.querySelectorAll(".more-options-search-ll").forEach((btn) => {
          btn.addEventListener("click", (event) => {
            event.stopPropagation();
            const dropdownMenu = btn.nextElementSibling;
            dropdownMenu.style.display =
              dropdownMenu.style.display === "block" ? "none" : "block";
          });
        });

        document.addEventListener("click", (event) => {
          if (!event.target.matches(".more-options-search-ll")) {
            document.querySelectorAll(".dropdown-menu-ll").forEach((menu) => {
              menu.style.display = "none";
            });
          }
        });
        // Back to search history page
        document
          .getElementById(uniqueId)
          .querySelector("#backToSearch")
          .addEventListener("click", (event) => {
            const searchPrompt = document
              .getElementById(uniqueId)
              .querySelector("#searchPrompt");

            searchPrompt.children[0].style.display = "block";
            searchPrompt.children[1].style.display = "none";
          });
        if (responseData?.updatedtime !== "") {
          document
            .getElementById(uniqueId)
            .querySelector("#last-run-time").innerHTML = timeAgo(
            responseData?.updatedtime
          );
        }
        document.getElementById(uniqueId).querySelector("#profileD").innerText =
          responseData.data.Dominance;
        document
          .getElementById(uniqueId)
          .querySelector("#personality").innerText =
          responseData.data.PersonalityType;
        document.getElementById(uniqueId).querySelector("#profileI").innerText =
          responseData.data.Influence;
        document.getElementById(uniqueId).querySelector("#profileS").innerText =
          responseData.data.Steadiness;
        document.getElementById(uniqueId).querySelector("#profileC").innerText =
          responseData.data.Conscientiousness;
        const personalityType = responseData.data.PersonalityType.toUpperCase();
        const personalityDescriptions = {
          D: "Dominance",
          I: "Influence",
          S: "Steadiness",
          C: "Conscientiousness",
          DI: "Dominance, Influence",
          ID: "Dominance, Influence",
          IS: "Influence, Steadiness",
          SI: "Steadiness, Influence",
          SC: "Steadiness, Conscientiousness",
          CS: "Conscientiousness, Steadiness",
          CD: "Conscientiousness, Dominance",
          DC: "Dominance, Conscientiousness",
        };
        const description = personalityDescriptions[personalityType] || "";

        document.getElementById(uniqueId).querySelector("#tags").innerHTML =
          `<div class="font-family-ll">
    A <span style="font-weight:600" class="font-family-ll" >${responseData?.data?.PersonalityType}</span>
    <span style="font-weight:500" class="font-family-ll"> (${description}) </span> profile represents:
  </div>` + responseData.tags;
        const personalityImg = document
          .getElementById(uniqueId)
          .querySelector("#personality-img");

        const availableTypes = ["D", "I", "S", "C", "DI", "SI", "CS", "DC"];

        // Try exact match
        let imageName = availableTypes.find((type) => type === personalityType);
        // If not exact match and personalityType is 2 letters
        if (!imageName && personalityType.length === 2) {
          const reversed = personalityType.split("").reverse().join("");
          if (availableTypes.includes(reversed)) {
            imageName = reversed;
          }
        }

        // Fallback to single letter if needed
        if (!imageName && personalityType.length > 0) {
          const firstLetter = personalityType[0];
          if (availableTypes.includes(firstLetter)) {
            imageName = firstLetter;
          } else {
            imageName = "D"; // final fallback
          }
        }

        personalityImg.src = chrome.runtime.getURL(
          `assets/personality/${imageName}.png`
        );

        appendAttributesToContainer(
          responseData.data.Likes,
          "profileLikes",
          "Like",
          uniqueId
        );
        appendAttributesToContainer(
          responseData.data.Dislikes,
          "profileDislikes",
          "Dislike",
          uniqueId
        );
        appendAttributesToContainer(
          responseData.data.InterestedTopics,
          "profileInterestedTopics",
          "Interest",
          uniqueId
        );

        const modifiedHTML = addClassToMainDiv(
          responseData.data.IceBreakers,
          "postll personal-attribute"
        );
        document
          .getElementById(uniqueId)
          .querySelector("#profileIceBrakers").innerHTML = modifiedHTML;

        const profileProblems = addClassToMainDiv(
          responseData.data.ProbableProblems,
          "postll personal-attribute"
        );
        document
          .getElementById(uniqueId)
          .querySelector("#profileProblems").innerHTML = profileProblems;

        if (responseData.hubspotIntegration === true) {
          document
            .getElementById(uniqueId)
            .querySelector("#displayhubspot").style.display = "block";

          document
            .getElementById(uniqueId)
            .querySelector("#displayhubspot")
            .addEventListener("click", () => {
              getSearchHubspot(responseData?.linkedinurl, uniqueId);
            });
        }

        document
          .getElementById(uniqueId)
          .querySelector("#profiletitlell").innerHTML =
          '<div class="profileblockll">' +
          '<img src="' +
          responseData.profileImage +
          '" alt="profile image">' +
          "<div>" +
          responseData.profileName +
          '<a href="' +
          responseData.linkedinurl +
          '" target="_blank" style="display:inline-block; vertical-align:middle; margin-left:5px; text-decoration: none;border-bottom:none">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#0a66c2">' +
          '<path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.3c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.3h-3v-4.5c0-1.104-.896-2-2-2s-2 .896-2 2v4.5h-3v-9h3v1.586c.591-.718 1.463-1.586 2.5-1.586 1.933 0 3.5 1.567 3.5 3.5v5.5z"/>' +
          "</svg>" +
          "</a>" +
          '<div style="margin-bottom:10px; font-size:14px; font-weight: 550;">' +
          "Personality Type (<i>" +
          responseData.data.PersonalityType +
          "</i>)</div>" +
          "<div>" +
          '<div id="profileActiveTimeSection"></div>' +
          "</div>" +
          "</div>";

        document
          .getElementById(uniqueId)
          .querySelector("#personality-user-data").innerHTML =
          '<div class="profileblockll">' +
          '<img src="' +
          responseData.profileImage +
          '" alt="profile image">' +
          '<div class="font-family-ll" style="margin-bottom:5px; font-size:14px; font-weight:600;">' +
          responseData.profileName +
          '<div class="font-family-ll" style="margin-bottom:10px; font-size:14px; font-weight:550;">' +
          "Personality Type (<i>" +
          responseData.data.PersonalityType +
          "</i>)" +
          "</div>" +
          "</div>" +
          "</div>";

        document
          .getElementById(uniqueId)
          .querySelector("#profileAboutSection").innerHTML = `
                  <h6 class="h5ll"><svg class="icon-inline" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V11C0 11.2652 0.105357 11.5196 0.292893 11.7071C0.48043 11.8946 0.734784 12 1 12H11C11.2652 12 11.5196 11.8946 11.7071 11.7071C11.8946 11.5196 12 11.2652 12 11V1C12 0.734784 11.8946 0.48043 11.7071 0.292893C11.5196 0.105357 11.2652 0 11 0ZM4 5.5C4 5.10444 4.1173 4.71776 4.33706 4.38886C4.55682 4.05996 4.86918 3.80362 5.23463 3.65224C5.60009 3.50087 6.00222 3.46126 6.39018 3.53843C6.77814 3.6156 7.13451 3.80608 7.41421 4.08579C7.69392 4.36549 7.8844 4.72186 7.96157 5.10982C8.03874 5.49778 7.99913 5.89991 7.84776 6.26537C7.69638 6.63082 7.44004 6.94318 7.11114 7.16294C6.78224 7.3827 6.39556 7.5 6 7.5C5.46957 7.5 4.96086 7.28929 4.58579 6.91421C4.21071 6.53914 4 6.03043 4 5.5ZM2.29187 11C2.54774 10.3701 2.95909 9.81532 3.4875 9.3875C4.19895 8.81319 5.08568 8.49995 6 8.49995C6.91432 8.49995 7.80105 8.81319 8.5125 9.3875C9.04091 9.81532 9.45226 10.3701 9.70813 11H2.29187ZM11 11H10.7706C10.5483 10.2923 10.1711 9.643 9.66645 9.09931C9.16179 8.55562 8.54235 8.1312 7.85312 7.85688C8.34379 7.47147 8.70208 6.94267 8.87812 6.34409C9.05415 5.74551 9.03918 5.10693 8.83528 4.51726C8.63138 3.92759 8.24871 3.41616 7.74052 3.05417C7.23233 2.69219 6.62393 2.49765 6 2.49765C5.37607 2.49765 4.76766 2.69219 4.25948 3.05417C3.75129 3.41616 3.36861 3.92759 3.16472 4.51726C2.96082 5.10693 2.94585 5.74551 3.12188 6.34409C3.29792 6.94267 3.65621 7.47147 4.14687 7.85688C3.45765 8.1312 2.83821 8.55562 2.33355 9.09931C1.82889 9.643 1.45169 10.2923 1.22937 11H1V1H11V11Z" fill="#292E30"/>
</svg> About </h6>
                    <div class="collapsedll">${responseData.about}</div>
                    <span id="toggleArrowll">▼</span>
                    <span id="toggleTextll">See more...</span>
                  `;
        //adding experience
        addExperinceFunction(responseData.experience, uniqueId);
        // update name and profile type in generate content page.

        let rolesAndRespData;

        try {
          // Parse the roles and responsibility JSON
          rolesAndRespData = JSON.parse(responseData?.rolesandresponsibility);

          // If it's still a string, parse again
          if (typeof rolesAndRespData === "string") {
            rolesAndRespData = JSON.parse(rolesAndRespData);
          }

          // Ensure it's valid and contains the Responsibility array
          if (
            !rolesAndRespData ||
            typeof rolesAndRespData !== "object" ||
            !Array.isArray(rolesAndRespData.Responsibility)
          ) {
            rolesAndRespData = { Responsibility: [] };
          }
        } catch (error) {
          rolesAndRespData = { Responsibility: [] };
        }

        // Generate HTML for responsibilities as <div>
        let rolesHTML = `
  <h6 class="h5ll" ><svg class="icon-inline" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.1857 10.0828L10.156 8.59375L8.67163 4.56094C8.58373 4.32213 8.42469 4.11604 8.21598 3.97046C8.00726 3.82488 7.75892 3.74682 7.50445 3.74682C7.24998 3.74682 7.00163 3.82488 6.79291 3.97046C6.5842 4.11604 6.42516 4.32213 6.33726 4.56094L4.84351 8.59375L0.810696 10.0781C0.57189 10.166 0.365794 10.3251 0.220216 10.5338C0.0746371 10.7425 -0.00341797 10.9908 -0.00341797 11.2453C-0.00341797 11.4998 0.0746371 11.7481 0.220216 11.9568C0.365794 12.1656 0.57189 12.3246 0.810696 12.4125L4.84351 13.9062L6.32788 17.9391C6.41579 18.1779 6.57482 18.384 6.78354 18.5295C6.99225 18.6751 7.2406 18.7532 7.49507 18.7532C7.74954 18.7532 7.99789 18.6751 8.2066 18.5295C8.41532 18.384 8.57436 18.1779 8.66226 17.9391L10.156 13.9062L14.1888 12.4219C14.4276 12.334 14.6337 12.1749 14.7793 11.9662C14.9249 11.7575 15.0029 11.5092 15.0029 11.2547C15.0029 11.0002 14.9249 10.7519 14.7793 10.5432C14.6337 10.3344 14.4276 10.1754 14.1888 10.0875L14.1857 10.0828ZM9.45288 12.8297C9.36805 12.861 9.291 12.9103 9.22707 12.9742C9.16314 13.0381 9.11384 13.1152 9.08257 13.2L7.49976 17.4883L5.92007 13.2031C5.88885 13.1174 5.83925 13.0395 5.77473 12.975C5.71022 12.9105 5.63236 12.8609 5.54663 12.8297L1.26148 11.25L5.54663 9.67031C5.63236 9.6391 5.71022 9.58949 5.77473 9.52497C5.83925 9.46046 5.88885 9.3826 5.92007 9.29688L7.49976 5.01172L9.07945 9.29688C9.11071 9.38171 9.16001 9.45875 9.22395 9.52269C9.28788 9.58662 9.36492 9.63592 9.44976 9.66719L13.738 11.25L9.45288 12.8297ZM9.99976 3.125C9.99976 2.95924 10.0656 2.80027 10.1828 2.68306C10.3 2.56585 10.459 2.5 10.6248 2.5H11.8748V1.25C11.8748 1.08424 11.9406 0.925268 12.0578 0.808058C12.175 0.690848 12.334 0.625 12.4998 0.625C12.6655 0.625 12.8245 0.690848 12.9417 0.808058C13.0589 0.925268 13.1248 1.08424 13.1248 1.25V2.5H14.3748C14.5405 2.5 14.6995 2.56585 14.8167 2.68306C14.9339 2.80027 14.9998 2.95924 14.9998 3.125C14.9998 3.29076 14.9339 3.44973 14.8167 3.56694C14.6995 3.68415 14.5405 3.75 14.3748 3.75H13.1248V5C13.1248 5.16576 13.0589 5.32473 12.9417 5.44194C12.8245 5.55915 12.6655 5.625 12.4998 5.625C12.334 5.625 12.175 5.55915 12.0578 5.44194C11.9406 5.32473 11.8748 5.16576 11.8748 5V3.75H10.6248C10.459 3.75 10.3 3.68415 10.1828 3.56694C10.0656 3.44973 9.99976 3.29076 9.99976 3.125ZM18.1248 6.875C18.1248 7.04076 18.0589 7.19973 17.9417 7.31694C17.8245 7.43415 17.6655 7.5 17.4998 7.5H16.8748V8.125C16.8748 8.29076 16.8089 8.44973 16.6917 8.56694C16.5745 8.68415 16.4155 8.75 16.2498 8.75C16.084 8.75 15.925 8.68415 15.8078 8.56694C15.6906 8.44973 15.6248 8.29076 15.6248 8.125V7.5H14.9998C14.834 7.5 14.675 7.43415 14.5578 7.31694C14.4406 7.19973 14.3748 7.04076 14.3748 6.875C14.3748 6.70924 14.4406 6.55027 14.5578 6.43306C14.675 6.31585 14.834 6.25 14.9998 6.25H15.6248V5.625C15.6248 5.45924 15.6906 5.30027 15.8078 5.18306C15.925 5.06585 16.084 5 16.2498 5C16.4155 5 16.5745 5.06585 16.6917 5.18306C16.8089 5.30027 16.8748 5.45924 16.8748 5.625V6.25H17.4998C17.6655 6.25 17.8245 6.31585 17.9417 6.43306C18.0589 6.55027 18.1248 6.70924 18.1248 6.875Z" fill="#637477"/>
</svg>
Responsibilities</h6>
  <div class="collapsedll" id="respCollapsedSection">
`;

        rolesAndRespData.Responsibility.forEach((resp) => {
          rolesHTML += `<div class="resp-box-ll postll">${resp}</div>`;
        });

        rolesHTML += `</div>
  <span id="respToggleArrowll">▼</span>
  <span id="respToggleTextll">See more...</span>
`;

        // Inject into DOM
        const container = document
          .getElementById(uniqueId)
          .querySelector("#profileRolesAndResp");
        if (container) {
          container.innerHTML = rolesHTML;
        }

        if (responseData?.activetime.length > 0) {
          changeActiveTime(responseData?.activetime, uniqueId);
        }
        document
          .getElementById(uniqueId)
          .querySelector("#profileNameGenerateContent").innerText =
          responseData.profileName;
        document
          .getElementById(uniqueId)
          .querySelector(
            "#profileNameGenerateContentfine"
          ).innerText = `Fine tune a message for ${responseData.profileName}`;

        document
          .getElementById(uniqueId)
          .querySelector("#linkedinUrl").innerText = responseData.linkedinurl;
        document
          .getElementById(uniqueId)
          .querySelector("#profileTypeGenerateContent").innerText =
          responseData.data.PersonalityType;
        document
          .getElementById(uniqueId)
          .querySelector("#profileTypeGenerateContentfine").innerText =
          responseData.data.PersonalityType;
        document
          .getElementById(uniqueId)
          .querySelector("#profileSuccess").innerHTML = responseData.success;
        document
          .getElementById(uniqueId)
          .querySelector("#profileEmail").innerHTML = responseData.emails;
        document
          .getElementById(uniqueId)
          .querySelector("#profileSpeak").innerHTML = responseData.speaking;
        document
          .getElementById(uniqueId)
          .querySelector("#firstCold").innerHTML = responseData.firstCold;
        document
          .getElementById(uniqueId)
          .querySelector("#followUpCold").innerHTML = responseData.followUpCold;
        document
          .getElementById(uniqueId)
          .querySelector("#firstLinkedIn").innerHTML =
          responseData.firstLinkedIn;
        document
          .getElementById(uniqueId)
          .querySelector("#followUpLinkedIn").innerHTML =
          responseData.followUpLinkedIn;

        document
          .getElementById(uniqueId)
          .querySelector("#frameworkProfileName").innerText =
          responseData.profileName;
        document
          .getElementById(uniqueId)
          .querySelector("#frameworkProfileName2").innerText =
          responseData.profileName;
        document
          .getElementById(uniqueId)
          .querySelector("#profileNameAdapting").innerText =
          responseData.profileName.split(" ")[0];

        document
          .getElementById(uniqueId)
          .querySelector("#strategyDiscovery").innerHTML =
          "<div class='strategyDo'>Do's:" +
          responseData.strategyDiscovery.dos +
          "</div> <div class='strategyDont'>Don'ts:" +
          responseData.strategyDiscovery.donts +
          "</div><div class='strategyOutlier'>Outlier:" +
          responseData.strategyDiscoveryOutlier +
          "</div><div class='frameworks'>Some Frameworks you can try:" +
          responseData.strategyDiscovery.frameworks +
          "</div>";

        document
          .getElementById(uniqueId)
          .querySelector("#strategyFollowup").innerHTML =
          "<div class='strategyDo'>Do's:" +
          responseData.strategyFollowup.dos +
          "</div> <div class='strategyDont'>Don'ts:" +
          responseData.strategyFollowup.donts +
          "</div><div class='strategyOutlier'>Outlier:" +
          responseData.strategyFollowupOutlier +
          "</div><div class='frameworks'>Some Frameworks you can try:" +
          responseData.strategyFollowup.frameworks +
          "</div>";

        document
          .getElementById(uniqueId)
          .querySelector("#strategyNegotiation").innerHTML =
          "<div class='strategyDo'>Do's:" +
          responseData.strategyNegotiation.dos +
          "</div> <div class='strategyDont'>Don'ts:" +
          responseData.strategyNegotiation.donts +
          "</div><div class='strategyOutlier'>Outlier:" +
          responseData.strategyNegotiationOutlier +
          "</div><div class='frameworks'>Some Frameworks you can try:" +
          responseData.strategyNegotiation.frameworks +
          "</div>";

        document
          .getElementById(uniqueId)
          .querySelector("#strategyPricing").innerHTML =
          "<div class='strategyDo'>Do's:" +
          responseData.strategyPricing.dos +
          "</div> <div class='strategyDont'>Don'ts:" +
          responseData.strategyPricing.donts +
          "</div><div class='strategyOutlier'>Outlier:" +
          responseData.strategyPricingOutlier +
          "</div><div class='frameworks'>Some Frameworks you can try:" +
          responseData.strategyPricing.frameworks +
          "</div>";

        document
          .getElementById(uniqueId)
          .querySelector("#strategyProductDemo").innerHTML =
          "<div class='strategyDo'>Do's:" +
          responseData.strategyProductDemo.dos +
          "</div> <div class='strategyDont'>Don'ts:" +
          responseData.strategyProductDemo.donts +
          "</div><div class='strategyOutlier'>Outlier:" +
          responseData.strategyProductDemoOutlier +
          "</div><div class='frameworks'>Some Frameworks you can try:" +
          responseData.strategyProductDemo.frameworks +
          "</div>";

        document
          .getElementById(uniqueId)
          .querySelector("#selectFramework").onchange = function () {
          const selectedPhase = document
            .getElementById(uniqueId)
            .querySelector("#selectFramework").value;
          switchFrameworksTo(uniqueId, selectedPhase);
        };

        function switchFrameworksTo(uniqueId, selectedPhase) {
          const phaseArray = [
            "outreachPhase",
            "discoveryPhase",
            "followupPhase",
            "negotiationPhase",
            "pricingPhase",
            "productdemoPhase",
          ];

          for (let i = 0; i < phaseArray.length; i++) {
            const phaseElement = document
              .getElementById(uniqueId)
              .querySelector(`#${phaseArray[i]}`);

            if (phaseElement) {
              if (selectedPhase === phaseArray[i]) {
                phaseElement.style.display = "block";
              } else {
                phaseElement.style.display = "none";
              }
            }
          }
        }
        // About section toggle functionality
        const profileSection = document
          .getElementById(uniqueId)
          .querySelector("#profileAboutSection");
        const aboutToggleText = document
          .getElementById(uniqueId)
          .querySelector("#toggleTextll");
        const aboutToggleArrow = document
          .getElementById(uniqueId)
          .querySelector("#toggleArrowll");
        const aboutCollapsedSection =
          profileSection.querySelector(".collapsedll");

        profileSection.addEventListener("click", () => {
          if (aboutCollapsedSection.classList.contains("collapsedll")) {
            aboutCollapsedSection.classList.remove("collapsedll");
            aboutToggleText.textContent = "See less...";
            aboutToggleArrow.textContent = "▲";
          } else {
            aboutCollapsedSection.classList.add("collapsedll");
            aboutToggleText.textContent = "See more...";
            aboutToggleArrow.textContent = "▼";
          }
        });

        // Experience section toggle functionality
        const experienceSection = document
          .getElementById(uniqueId)
          .querySelector("#profileExperienceSection");

        const experienceToggleText = experienceSection.querySelector(
          "#experienceToggleTextll"
        );
        const experienceToggleArrow = experienceSection.querySelector(
          "#experienceToggleArrowll"
        );
        const experienceCollapsedSection =
          experienceSection.querySelector(".collapsedll");

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

        // Attach click only to toggle elements
        experienceToggleText.addEventListener("click", toggleExperienceSection);
        experienceToggleArrow.addEventListener(
          "click",
          toggleExperienceSection
        );

        const containerres = document.getElementById(uniqueId);

        const profileRolesAndResp = containerres.querySelector(
          "#profileRolesAndResp"
        );
        const respToggleText = containerres.querySelector("#respToggleTextll");
        const respToggleArrow =
          containerres.querySelector("#respToggleArrowll");
        const respCollapsedSection = containerres.querySelector(
          "#respCollapsedSection"
        );

        function toggleRespSection() {
          if (respCollapsedSection.classList.contains("collapsedll")) {
            respCollapsedSection.classList.remove("collapsedll");
            respToggleText.textContent = "See less...";
            respToggleArrow.textContent = "▲";
          } else {
            respCollapsedSection.classList.add("collapsedll");
            respToggleText.textContent = "See more...";
            respToggleArrow.textContent = "▼";
          }
        }

        // Attach the event only to the toggle elements
        respToggleText.addEventListener("click", toggleRespSection);
        respToggleArrow.addEventListener("click", toggleRespSection);

        // Adapting yourself code
        if (responseData.adaptingdArrayStatus) {
          document
            .getElementById(uniqueId)
            .querySelector("#adaptingYourselfBtn").style.display = "block";
          document
            .getElementById(uniqueId)
            .querySelector("#adaptingYourselfDetails").innerHTML =
            responseData.adaptingdArray;
          document
            .getElementById(uniqueId)
            .querySelector("#adaptingYourselfDetails").style.display = "none";
          document
            .getElementById(uniqueId)
            .querySelector("#personaptagll").style.display = "none";
        } else {
          document
            .getElementById(uniqueId)
            .querySelector("#addYourLinkedIn").style.display = "block";
          document
            .getElementById(uniqueId)
            .querySelector("#personaptagll").style.display = "block";
        }
        //post

        const allPostsDiv = document
          .getElementById(uniqueId)
          .querySelector("#allPosts");
        const commentsPostsDiv = document
          .getElementById(uniqueId)
          .querySelector("#commentsPosts");
        const reactionsPostsDiv = document
          .getElementById(uniqueId)
          .querySelector("#reactionsPosts");

        // Iterate through data and append content to respective divs
        responseData.linkedInPost.forEach((item) => {
          let content = createPostContent(item.postType, item.gpt_response);
          //console.log("------------", item.postType, item.gpt_response,)
          if (item.postType === "all") {
            allPostsDiv.innerHTML = content; // instead of += doing = for now
          } else if (item.postType === "comments") {
            commentsPostsDiv.innerHTML = content; // instead of += doing = for now
          } else if (item.postType === "reactions") {
            reactionsPostsDiv.innerHTML = content; // instead of += doing = for now
          }

          if (
            commentsPostsDiv.innerHTML === "" &&
            reactionsPostsDiv.innerHTML === ""
          ) {
            commentsPostsDiv.innerHTML = "<div>No activity found</div>";
          }

          const allCommentTags = document
            .getElementById(uniqueId)
            .querySelectorAll("#commentsPosts .postll .tagsll");
          allCommentTags.forEach((tagsll) => {
            tagsll.innerHTML = "<div >Comment</div>";
          });

          const allReactionTags = document
            .getElementById(uniqueId)
            .querySelectorAll("#reactionsPosts .postll .tagsll");
          allReactionTags.forEach((tagsll) => {
            tagsll.innerHTML = "<div >Reaction</div>";
          });
        });

        document
          .getElementById(uniqueId)
          .querySelector("#adaptingYourselfBtn")
          .addEventListener("click", () => {
            if (
              document
                .getElementById(uniqueId)
                .querySelector("#adaptingYourselfDetails").style.display ===
              "block"
            ) {
              document
                .getElementById(uniqueId)
                .querySelector("#adaptingYourselfDetails").style.display =
                "none";
              document
                .getElementById(uniqueId)
                .querySelector("#adaptingYourselfBtn").innerText =
                "Click to compare your personality with " +
                responseData.profileName.split(" ")[0];
            } else {
              document
                .getElementById(uniqueId)
                .querySelector("#adaptingYourselfDetails").style.display =
                "block";
              document
                .getElementById(uniqueId)
                .querySelector("#adaptingYourselfBtn").innerText =
                "Compared to you, " + responseData.profileName + " is";
            }
          });
      });
  }
}
//-------------------------------------function to load the email creation-------------------------------
async function loadEmailCreationScript(uniqueId) {
  // Get the unique container by uniqueId
  const uniqueContainer = document.getElementById(uniqueId);

  // Select elements within the unique container
  const personaSelect = uniqueContainer.querySelector(
    "#persona-listing-name-ll"
  );
  const channelButtons = uniqueContainer.querySelectorAll(".channel-btn-ll");
  const useCaseButtons = uniqueContainer.querySelectorAll(".use-case-btn-ll");
  const premiseButtons = uniqueContainer.querySelectorAll(".premise-btn-ll");
  const frameworkSelect = uniqueContainer.querySelector("#framework-ll");
  const generateBtn = uniqueContainer.querySelector(".generate-btn-ll");
  const variantValue = uniqueContainer.querySelector("#variant-value-ll");
  const increaseVariant = uniqueContainer.querySelector("#increase-variant-ll");
  const decreaseVariant = uniqueContainer.querySelector("#decrease-variant-ll");

  const popupOverlay = uniqueContainer.querySelector("#popup-overlay-ll");
  const popupCloseBtn = uniqueContainer.querySelector("#popup-close-btn-ll");
  const popupContent = uniqueContainer.querySelector(".popup-content-ll");

  const popupOverlayInsight = uniqueContainer.querySelector(
    "#popup-overlay-insight"
  );
  const popupCloseInsight = uniqueContainer.querySelector(
    "#popup-close-btn-insight"
  );
  const popupContentInsight = uniqueContainer.querySelector(
    ".popup-content-insight"
  );
  // for view generated content history
  document
    .getElementById(uniqueId)
    .querySelector("#ViewContentHistory")
    .addEventListener("click", (event) => {
      const emailCreation = document

        .getElementById(uniqueId)
        .querySelector("#emailCreationDetails");
      const uniqueContainer = document.getElementById(uniqueId);

      emailCreation.children[0].style.display = "none";
      emailCreation.children[1].style.display = "block";
      loadGenerateContentHistory(
        uniqueId,
        uniqueContainer.querySelector("#linkedinUrl").innerText
      );
    });

  // Function to toggle the active class within button groups
  function toggleActive(buttonGroup, button) {
    buttonGroup.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  }

  // Example of other functions within the main function that operate within uniqueContainer
  function toggleIndividualBtn(button) {
    const wasActive = button.classList.contains("active");
    button.classList.toggle("active");

    if (
      wasActive &&
      uniqueContainer.querySelectorAll(".premise-btn-ll.active").length <= 1
    ) {
      logSelections(null, "premise");
    }
    return wasActive;
  }

  async function logSelections(selectedPostTitle = null, section) {
    const checkMarkContent =
      uniqueContainer.querySelector(".checkmark-ll").textContent;

    let premise =
      uniqueContainer.querySelector(".premise-btn-ll.active") &&
      uniqueContainer
        .querySelector(".premise-btn-ll.active")
        .textContent.replace(checkMarkContent, "")
        .trim();

    if (!premise) {
      premise = "Personal attributes";
    }

    // Perform further actions or API calls with `selections` as needed

    if (
      section === "channel" ||
      section === "usecase" ||
      section === "premise"
    ) {
      // Multiple premises case
      if (
        uniqueContainer.querySelectorAll(".premise-btn-ll.active").length > 1
      ) {
        const activeChannel = uniqueContainer
          .querySelector(".channel-btn-ll.active")
          ?.textContent.replace(checkMarkContent, "")
          .trim();

        if (activeChannel === "Cold Call") {
          try {
            // Fetch the framework data
            await getFrameWork(0, "coldcall", uniqueId);
          } catch (error) {
            console.error("Error fetching framework data:", error);
          }
          uniqueContainer.querySelector("#variant-ll").style.display = "flex";
          uniqueContainer.querySelector("#variant-message-ll").style.display =
            "none";
        } else {
          uniqueContainer.querySelector("#variant-ll").style.display = "none";
          uniqueContainer.querySelector("#variant-message-ll").style.display =
            "block";
        }
      }
      // Single premise flow
      else {
        uniqueContainer.querySelector("#variant-ll").style.display = "flex";
        uniqueContainer.querySelector("#variant-message-ll").style.display =
          "none";

        const activeChannel = uniqueContainer
          .querySelector(".channel-btn-ll.active")
          ?.textContent.replace(checkMarkContent, "")
          .trim();

        const activeUseCase = uniqueContainer
          .querySelector(".use-case-btn-ll.active")
          ?.textContent.replace(checkMarkContent, "")
          .trim();

        if (activeChannel === "Email") {
          try {
            await getFrameWork(0, "signal", uniqueId);
          } catch (error) {
            console.error("Error fetching framework data:", error);
          }
        } else if (activeChannel === "Cold Call") {
          try {
            await getFrameWork(0, "coldcall", uniqueId);
          } catch (error) {
            console.error("Error fetching framework data:", error);
          }
        } else {
          try {
            await getFrameWork(0, "signal", uniqueId);
          } catch (error) {
            console.error("Error fetching framework data:", error);
          }
        }

        if (premise === "Edit Signals" && activeChannel !== "Cold Call") {
          // Account-based premise logic
          if (activeUseCase === "Follow up") {
            try {
              await getFrameWork(0, "signal", uniqueId);
            } catch (error) {
              console.error("Error fetching framework data:", error);
            }
          } else if (activeChannel === "LinkedIn") {
            try {
              await getFrameWork(0, "signal", uniqueId);
            } catch (error) {
              console.error("Error fetching framework data:", error);
            }
          } else {
            try {
              await getFrameWork(0, "signal", uniqueId);
            } catch (error) {
              console.error("Error fetching framework data:", error);
            }
          }
        }
      }
    }
  }

  // Example usage of toggleActive within uniqueContainer
  channelButtons.forEach((button) => {
    button.addEventListener("click", () =>
      toggleActive(channelButtons, button)
    );
  });

  uniqueContainer
    .querySelector(".generate-btn-ll")
    .addEventListener("click", function (event) {
      event.preventDefault();

      const checkMarkContent =
        uniqueContainer.querySelector(".checkmark-ll").textContent;

      const divSelectors = ["#selected-signal"];

      const count = divSelectors
        .map((selector) => uniqueContainer.querySelector(selector))
        .filter((div) => div && div.textContent.trim() !== "").length;

      if (count > 1) {
        uniqueContainer.querySelector("#generate-btn-ll").disabled = true;

        const selfwritten = uniqueContainer.querySelector(
          "#summaryOfselfWrittenContent"
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

        const selectedinsight = uniqueContainer.querySelector(
          "#temp-selected-insight"
        ).innerText;

        //get all signal from the function,add extra data for like,dislike,interest
        const selectedsignal = getAllSelectedSignal(uniqueId);
        const channel = uniqueContainer
          .querySelector(".channel-btn-ll.active")
          .textContent.replace(checkMarkContent, "")
          .trim();

        const selections = {
          channel: channel,
          use_case: uniqueContainer
            .querySelector(".use-case-btn-ll.active")
            .textContent.replace(checkMarkContent, "")
            .trim(),
          premise: "combined",
          framework: uniqueContainer
            .querySelector("#framework-ll")
            .getAttribute("data-value"),
          // framework: uniqueContainer.querySelector("#framework-ll").value,
          additional_context: uniqueContainer.querySelector(
            "#additional-context-ll"
          ).value,
          linkdinUrl: uniqueContainer.querySelector("#linkedinUrl").innerText,
          Persona: uniqueContainer.querySelector("#persona-listing-name-ll")
            .value,
          variant: variantValue.textContent,
          selfwritten_summary: selfwritten_summary,
          selectedinsight: selectedinsight,
          selectedsignal: selectedsignal,
        };

        createCustomeMessage(selections, "combined", channel, uniqueId);
      } else if (count === 1) {
        uniqueContainer.querySelector("#generate-btn-ll").disabled = true;

        const selfwritten = uniqueContainer.querySelector(
          "#summaryOfselfWrittenContent"
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

        const selectedinsight = uniqueContainer.querySelector(
          "#temp-selected-insight"
        ).innerText;

        //get all signal from the function,add extra data for like,dislike,interest
        const selectedsignal = getAllSelectedSignal(uniqueId);
        const divSelectors = [
          {
            id: "#summaryOfselfWrittenContent",
            premise: "Self Written Content",
          },
          { id: "#summaryOfengagedContent", premise: "Engaged Content" },
        ];

        let premise =
          uniqueContainer
            .querySelector(".premise-btn-ll.active")
            ?.textContent.replace(checkMarkContent, "")
            .trim() || "Edit Signals";

        if (premise === "Edit Signals") {
          const matchedDiv = divSelectors.find(({ id }) => {
            const div = uniqueContainer.querySelector(id);
            return div && div.textContent.trim() !== "";
          });

          premise = matchedDiv ? matchedDiv.premise : "defaultPremise";
        }

        const channel = uniqueContainer
          .querySelector(".channel-btn-ll.active")
          .textContent.replace(checkMarkContent, "")
          .trim();

        const selections = {
          channel: channel,
          use_case: uniqueContainer
            .querySelector(".use-case-btn-ll.active")
            .textContent.replace(checkMarkContent, "")
            .trim(),
          premise: premise,
          framework: uniqueContainer
            .querySelector("#framework-ll")
            .getAttribute("data-value"),
          // framework: uniqueContainer.querySelector("#framework-ll").value,
          additional_context: uniqueContainer.querySelector(
            "#additional-context-ll"
          ).value,
          linkdinUrl: uniqueContainer.querySelector("#linkedinUrl").innerText,
          Persona: uniqueContainer.querySelector("#persona-listing-name-ll")
            .value,
          variant: variantValue.textContent,
          selfwritten_summary: selfwritten_summary,
          selectedinsight: selectedinsight,
          selectedsignal: selectedsignal,
        };

        createCustomeMessage(selections, premise, channel, uniqueId);
      } else {
        showNotification("Please select a persona!", "warning", uniqueId);
      }
    });

  uniqueContainer
    .querySelector("#clear-signal")
    .addEventListener("click", function (event) {
      event.preventDefault();

      // Clear shadow summary text holders as well
      uniqueContainer.querySelector("#selected-signal").innerText = "";

      // For insights
      uniqueContainer.querySelector("#temp-selected-insight").innerText = "";
      uniqueContainer.querySelector("#selected-insight").innerText = "";
      const selectedCount = uniqueContainer.querySelector("#selectedCount");
      selectedCount.innerText = `0 signal selected `;
      const signalButtonCount =
        uniqueContainer.querySelectorAll(".signal-count");

      if (signalButtonCount.length > 0) {
        signalButtonCount.forEach((el) => {
          if (el.parentElement) {
            el.parentElement.style.display = "none";
          }
        });
      }
      const selectElement = uniqueContainer.querySelector("#insight-list");
      selectElement.innerHTML = "";

      // Call the function to manage signal summary display
      manageSignalSummaryDisplay(uniqueId, ".signalsll");
      manageSignalSummaryDisplay(uniqueId, ".insight-ll");

      const popupOverlay = uniqueContainer.querySelector("#popup-overlay-ll");
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
  uniqueContainer
    .querySelector("#generate-angles")
    .addEventListener("click", function (event) {
      event.preventDefault();
      popupOverlayInsight.style.display = "flex";
      getInsight();
    });

  uniqueContainer
    .querySelector("#selected-insight-container")
    .addEventListener("click", function (event) {
      event.preventDefault();
      popupOverlayInsight.style.display = "flex";
    });
  popupCloseInsight.addEventListener("click", function () {
    popupOverlayInsight.style.display = "none";
  });

  uniqueContainer
    .querySelector("#submit-insight")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const popupOverlayInsight = uniqueContainer.querySelector(
        "#popup-overlay-insight"
      );
      if (popupOverlayInsight) {
        popupOverlayInsight.style.display = "none";
      }
    });
  async function getInsight() {
    // Load and display the loader
    fetch(chrome.runtime.getURL("pages/loader.html"))
      .then((r) => r.text())
      .then((html) => {
        const insightListElement =
          uniqueContainer.querySelector("#insight-list");
        if (insightListElement) {
          insightListElement.innerHTML = html;
        }
      });

    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const selectedsignal = getAllSelectedSignal(uniqueId);
    // Fetch insights from the API
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/generate-insight",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkdinUrl: uniqueContainer.querySelector("#linkedinUrl").innerText,
          Persona: uniqueContainer.querySelector("#persona-listing-name-ll")
            ?.value,
          signalprioritylist: selectedsignal,
        }),
      }
    );

    const responseData = await response.json();

    if (responseData) {
      const selectElement = uniqueContainer.querySelector("#insight-list");
      if (selectElement) {
        selectElement.innerHTML = responseData?.body;

        // Select all elements with the class `descriptionll`
        const descriptionElements =
          selectElement.querySelectorAll(".descriptionll");

        // Add a new div above each `descriptionll`
        descriptionElements.forEach((element) => {
          const newDiv = document.createElement("div");
          newDiv.className = "descriptionll-tag"; // Add a class to the new div
          newDiv.innerText = "Description"; // Set the content of the new div
          element.insertAdjacentElement("beforebegin", newDiv); // Insert the new div above the current element
        });

        // Select all elements with the class `valuell`
        const valuElements = selectElement.querySelectorAll(".valuell");

        // Add a new div above each `valuell`
        valuElements.forEach((element) => {
          const newDiv = document.createElement("div");
          newDiv.className = "valuell-tag"; // Add a class to the new div
          newDiv.innerText = "Value"; // Set the content of the new div
          element.insertAdjacentElement("beforebegin", newDiv); // Insert the new div above the current element
        });
      }
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
  // Assuming uniqueContainer and popupOverlay are defined
  // Assuming uniqueContainer is defined and contains the elements with unique IDs
  premiseButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      // Mark which button was clicked on the popup
      uniqueContainer.querySelector("#popupTypell").innerText = button.innerText
        .replace(checkMarkContent, "")
        .trim();

      logSelections(null, "premise");

      uniqueContainer
        .querySelector("#popup-close-btn-ll")
        .addEventListener("click", () => {
          uniqueContainer.querySelector("#popup-overlay-ll").style.display =
            "none";
        });

      if (
        button.innerText.replace(checkMarkContent, "").trim() === "Edit Signals"
      ) {
        button.disabled = true;
        await generateButtons(uniqueId);
        // Function to append content to accordion sections
        let responseData = await getAllSignalSettings();
        // Select the accordion bodies for each section using uniqueContainer
        const selfWrittenContentBody =
          uniqueContainer.querySelector("#bodySelfWritten");
        const engagedContentBody = uniqueContainer.querySelector(
          "#bodyEngagedContent"
        );
        const personalAttributesBody = uniqueContainer.querySelector(
          "#bodyPersonalAttribute"
        );
        const accountPremiseBody = uniqueContainer.querySelector(
          "#bodyAccountPremise"
        );

        const accountInsights = uniqueContainer.querySelector(
          "#bodyaccountInsights"
        );
        const workFlow = uniqueContainer.querySelector("#bodyWorkFlow");
        const AccountNewsMedia = uniqueContainer.querySelector(
          "#bodyAccountNewsMedia"
        );

        selfWrittenContentBody.innerHTML = "";
        engagedContentBody.innerHTML = "";
        personalAttributesBody.innerHTML = "";
        accountPremiseBody.innerHTML = "";
        accountInsights.innerHTML = "";
        workFlow.innerHTML = "";
        AccountNewsMedia.innerHTML = "";

        // Function to append content to accordion sections
        const appendContentToBody = (
          sourceId,
          targetBody,
          headerText,
          additionalClass
        ) => {
          const sourceElement = uniqueContainer.querySelector(`#${sourceId}`);
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
        // Chose Signals Data: Funding, Job, Opportunity
        const appendDataToPremise = (selector, targetBody, headerText) => {
          if (headerText === "Custom Workflow") {
            uniqueContainer.querySelector("#bodyWorkFlow").innerHTML = "";
          }
          const elements = uniqueContainer.querySelectorAll(selector); // Scoped to uniqueContainer
          if (targetBody && elements.length > 0) {
            // Create and append the <p> tag for the header text
            const headerParagraph = document.createElement("p");
            headerParagraph.textContent = headerText;
            headerParagraph.className = "content-heading"; // Add a class for styling
            targetBody.appendChild(headerParagraph);

            // Clone and append elements
            elements.forEach((element) => {
              const clonedElement = element.cloneNode(true);
              clonedElement.classList.add("postll"); // Add the class
              targetBody.appendChild(clonedElement); // Append the modified clone
            });
          }
        };
        // Personal Attributes: Likes, Dislikes, Interests
        const appendAttributes = (sourceId, label, displayText) => {
          const attributesDiv = uniqueContainer.querySelector(`#${sourceId}`);
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
        //function at clone the data for the Account Overview
        const appendDataToAccountOver = (selector, targetBody) => {
          const elements = uniqueContainer.querySelectorAll(selector); // Scoped to uniqueContainer
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
        const processFundingData = (sourceSelector, targetBody) => {
          const sourceElements =
            uniqueContainer.querySelectorAll(sourceSelector); // Select the source elements from uniqueContainer

          if (sourceElements && sourceElements.length > 0 && targetBody) {
            // Add the "Funds" header
            const fundsHeader = document.createElement("p");
            fundsHeader.textContent = "Funds";
            fundsHeader.className = "content-heading"; // Add a class for styling
            targetBody.appendChild(fundsHeader);

            // Loop through each source element
            sourceElements.forEach((sourceElement) => {
              // Select the first <li> inside the current source element's <ul>
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
            });
          }
        };
        const appendDataToTach = (subcategorySelector, targetBody) => {
          const subcategories =
            uniqueContainer.querySelectorAll(subcategorySelector);

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
        if (!uniqueContainer.querySelector("#submitPremise")) {
          // const submitButton = document.createElement("button");
          // submitButton.type = "button";
          // submitButton.classList.add("instruction-btn-ll");
          // submitButton.id = "submitPremise";
          // submitButton.textContent = "Submit";
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
          uniqueContainer
            .querySelector(".popup-content-ll")
            .appendChild(mainDiv);

          // Event listener to hide popup when submit button is clicked
          submitButton.addEventListener("click", function () {
            const popupOverlay =
              uniqueContainer.querySelector("#popup-overlay-ll");
            if (popupOverlay) {
              popupOverlay.style.display = "none";
              moveHiddenElementsToEnd();
              uniqueContainer.querySelector(
                "#temp-selected-insight"
              ).innerText = "";
              uniqueContainer.querySelector("#selected-insight").innerText = "";
              const selectElement =
                uniqueContainer.querySelector("#insight-list");
              selectElement.innerHTML = "";
              manageSignalSummaryDisplay(uniqueId, ".insight-ll");
              const premiseButtons =
                uniqueContainer.querySelectorAll(".premise-btn-ll");
              premiseButtons.forEach((button) => {
                button.disabled = false;
              });
            }
          });
        }

        const popupOverlay = uniqueContainer.querySelector("#popup-overlay-ll");
        popupOverlay.style.display = "flex";
      }
    });
  });

  // For drag and drop of the selected signal and giving priority
  // Select all draggable elements and the container

  const container = uniqueContainer.querySelector(".drag-area");

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
    const dragging = uniqueContainer.querySelector(".dragging");

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
      container.appendChild(element); // Append hidden elements to the end
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
    const premiseButtons = uniqueContainer.querySelectorAll(".premise-btn-ll");
    premiseButtons.forEach((button) => {
      button.disabled = false;
    });
  });

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
    manageSignalSummaryDisplay(uniqueId, ".insight-ll");
  });

  async function updateSignalCounts() {
    const uniqueContainer = document.getElementById(uniqueId); // Replace with the actual unique container ID

    if (!uniqueContainer) {
      console.error("Unique container not found.");
      return;
    }

    const insightDiv = uniqueContainer.querySelector("#selected-insight");
    const tempPostForInsight = uniqueContainer.querySelector(
      "#temp-selected-insight"
    );

    if (!insightDiv || !tempPostForInsight) {
      console.error("Required elements not found in uniqueContainer.");
      return;
    }

    const lines = [...insightDiv.children];
    const count = lines.length;

    // Update the count and content for each child in `insightDiv`
    lines.forEach((line, index) => {
      const text = line.textContent.replace(/^Signal \d+:\s*/, "");
      line.textContent = `Signal ${index + 1}: ${text}`;
    });

    // Reflect updated signals in tempPostForInsight
    tempPostForInsight.innerText = lines
      .map(
        (line, index) =>
          `Signal ${index + 1}: ${line.dataset.description || ""}`
      )
      .join(" ");

    if (count === 0) {
      updateCounts(uniqueId);
      return;
    }

    const activeChannelButton = uniqueContainer.querySelector(
      ".channel-btn-ll.active"
    );

    if (
      activeChannelButton &&
      activeChannelButton.textContent.replace(checkMarkContent, "").trim() !==
        "Cold Call"
    ) {
      try {
        // Fetch the framework data
        await getFrameWork(count, "angle", uniqueId);
      } catch (error) {
        console.error("Error fetching framework data:", error);
      }
    }
  }
}
//-------------------------Persona start here--------------------------------
async function showPersonaListing(uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  //loader
  fetch(chrome.runtime.getURL("pages/loader.html"))
    .then((r) => r.text())
    .then((html) => {
      uniqueContainer.querySelector(
        "#parsonaListingDetails"
      ).children[1].innerHTML = html;
    });

  uniqueContainer.querySelector(
    "#parsonaListingDetails"
  ).children[0].style.display = "none";
  uniqueContainer.querySelector(
    "#parsonaListingDetails"
  ).children[1].style.display = "block";
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
    generatePersonaList(responseData.body, uniqueId);
    const openCustomQuestion = uniqueContainer.querySelector("#open-persona");
    const pTag = openCustomQuestion.querySelector("p");
    pTag.textContent = `${responseData.body.length} personas created`;
  }

  const popupOverlayPersona = uniqueContainer.querySelector(
    "#popup-overlay-persona-ll"
  );

  const popupCloseBtnPersona = uniqueContainer.querySelector(
    "#popup-close-btn-persona-ll"
  );

  const manualCreationPersona = uniqueContainer.querySelector(
    `#manual-persona-creation`
  );

  const autoCreationPersona = uniqueContainer.querySelector(
    `#auto-persona-creation`
  );

  // Remove previous event listeners
  removeClickEvents("auto-persona-generate", uniqueId);
  removeClickEvents("create-btn-ll", uniqueId);

  popupCloseBtnPersona.addEventListener("click", () => {
    uniqueContainer.querySelector("#popup-persona-step-first").style.display =
      "block";
    uniqueContainer.querySelector("#popup-persona-step-second").style.display =
      "none";
    popupOverlayPersona.style.display = "none";
    //also close reset
  });

  if (manualCreationPersona) {
    manualCreationPersona.addEventListener("click", () => {
      // Set display for the first and second child elements inside "parsonaListingDetails"
      uniqueContainer.querySelector(
        "#parsonaListingDetails"
      ).children[0].style.display = "block";
      uniqueContainer.querySelector(
        "#parsonaListingDetails"
      ).children[1].style.display = "none";

      // Set the value for "persona-id-ll" within the unique container
      uniqueContainer.querySelector("#persona-id-ll").value = "";

      // Close popup
      popupOverlayPersona.style.display = "none";
    });
  }
  if (autoCreationPersona) {
    autoCreationPersona.addEventListener("click", () => {
      uniqueContainer.querySelector("#popup-persona-step-first").style.display =
        "none";
      uniqueContainer.querySelector(
        "#popup-persona-step-second"
      ).style.display = "block";
    });
  }
  uniqueContainer
    .querySelector("#auto-persona-generate")
    .addEventListener("click", async function () {
      const companyUrl = uniqueContainer.querySelector("#company-url-ll").value;
      const label = uniqueContainer.querySelector(
        "label[for='company-url-ll']"
      );
      const isATL = uniqueContainer.querySelector("#ATL").value;
      const isBTL = uniqueContainer.querySelector("#BTL").value;

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
          uniqueId
        );
        return false;
      }

      // Store the original content of the div before displaying the loading message
      const popupStepSecond = uniqueContainer.querySelector(
        "#popup-persona-step-second"
      );
      const originalContent = popupStepSecond.innerHTML;
      popupStepSecond.style.display = "none";

      // Create the loading message and append it
      const loadingDiv = document.createElement("div");
      loadingDiv.innerHTML = `<div id="loaderTextLL">Generating Persona... Please wait</div>`;
      loadingDiv.style.textAlign = "center";
      loadingDiv.style.color = "#5B5B5B";
      popupStepSecond.appendChild(loadingDiv);

      // Fetch the content from loader.html and update the innerHTML once fetched
      fetch(chrome.runtime.getURL("pages/loader.html"))
        .then((response) => response.text())
        .then((html) => {
          popupStepSecond.innerHTML = "";
          popupStepSecond.innerHTML = html;
          popupStepSecond.style.display = "block";

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
        if (responseData.header === "success") {
          popupStepSecond.innerHTML = originalContent;
          uniqueContainer.querySelector(
            "#popup-persona-step-first"
          ).style.display = "block";
          popupStepSecond.style.display = "none";
          popupOverlayPersona.style.display = "none";
          showNotification(
            "Persona Generated Successfully!",
            "success",
            uniqueId
          );
          showPersonaListing(uniqueId);

          // Clear the values after the response
          uniqueContainer.querySelector("#company-url-ll").value = "";
          uniqueContainer.querySelector("#IsATL").value = "";
          uniqueContainer.querySelector("#IsBTL").value = "";
        } else {
          showNotification(responseData?.body, "warning", uniqueId);
          popupStepSecond.innerHTML = originalContent;
          uniqueContainer.querySelector(
            "#popup-persona-step-first"
          ).style.display = "block";
          popupStepSecond.style.display = "none";
          popupOverlayPersona.style.display = "none";
        }
      } catch (error) {
        showNotification("Error contacting the server.", "warning", uniqueId);
      } finally {
        // Remove the loading icon and close the popup if needed
        loadingDiv.remove();
        showPersonaListing(uniqueId);
        popupOverlayPersona.style.display = "none";
      }
    });

  // JavaScript for Persona Creation Page
  uniqueContainer
    .querySelector("#persona-form-ll")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const personaData = {
        id: uniqueContainer.querySelector("#persona-id-ll").value,
        persona_name: uniqueContainer.querySelector("#persona-name-ll").value,
        company_name: uniqueContainer.querySelector("#company-name-ll").value,
        customer_pain_points:
          uniqueContainer.querySelector("#pain-points-ll").value,
        industry: uniqueContainer.querySelector("#industry-name-ll").value,
        value_proposition: uniqueContainer.querySelector(
          "#value-proposition-ll"
        ).value,
        results: uniqueContainer.querySelector("#results-ll").value,
        mandatory_message: uniqueContainer.querySelector(
          "#mandatory-message-ll"
        ).value,
        custom_tonality: uniqueContainer.querySelector("#custom-tonality-ll")
          .value,
      };

      // Simulate API call
      savePersona(personaData, uniqueId);
    });

  async function savePersona(data, uniqueId) {
    let uniqueContainer = document.getElementById(uniqueId);
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
      showNotification("Persona Created Successfully!", "success", uniqueId);
      //clear the data in fields
      uniqueContainer.querySelector("#persona-id-ll").value = "";
      uniqueContainer.querySelector("#persona-name-ll").value = "";
      uniqueContainer.querySelector("#company-name-ll").value = "";
      uniqueContainer.querySelector("#pain-points-ll").value = "";
      uniqueContainer.querySelector("#industry-name-ll").value = "";
      uniqueContainer.querySelector("#value-proposition-ll").value = "";
      uniqueContainer.querySelector("#results-ll").value = "";
      uniqueContainer.querySelector("#mandatory-message-ll").value = "";
      uniqueContainer.querySelector("#custom-tonality-ll").value = "";
      uniqueContainer.querySelector("#create-btn-ll").textContent =
        "Create Persona";
      if (uniqueContainer) {
        uniqueContainer.querySelector(
          "#parsonaListingDetails"
        ).children[0].style.display = "none";
        uniqueContainer.querySelector(
          "#parsonaListingDetails"
        ).children[1].style.display = "block";
      }
      //get back to listing page:
      showPersonaListing(uniqueId);
    }
  }

  uniqueContainer
    .querySelector("#backToPersonaListingPersona")
    .addEventListener("click", (event) => {
      const personaListingDetails = uniqueContainer.querySelector(
        "#parsonaListingDetails"
      );

      // Toggle display settings for children elements within persona listing details
      personaListingDetails.children[0].style.display = "none";
      personaListingDetails.children[1].style.display = "block";

      // Clear the data in the fields within uniqueContainer
      uniqueContainer.querySelector("#persona-id-ll").value = "";
      uniqueContainer.querySelector("#persona-name-ll").value = "";
      uniqueContainer.querySelector("#company-name-ll").value = "";
      uniqueContainer.querySelector("#pain-points-ll").value = "";
      uniqueContainer.querySelector("#industry-name-ll").value = "";
      uniqueContainer.querySelector("#value-proposition-ll").value = "";
      uniqueContainer.querySelector("#results-ll").value = "";
      uniqueContainer.querySelector("#mandatory-message-ll").value = "";
      uniqueContainer.querySelector("#custom-tonality-ll").value = "";
      uniqueContainer.querySelector("#create-btn-ll").textContent =
        "Create Persona";
    });

  function handleTextareaInput(event) {
    const atlValue = uniqueContainer.querySelector("#ATL").value;
    const btlValue = uniqueContainer.querySelector("#BTL").value;
    // Count total commas in both textareas
    const totalCommaCount =
      (atlValue.match(/,/g) || []).length + (btlValue.match(/,/g) || []).length;

    if (totalCommaCount > 3) {
      showNotification(
        "Please add only 3 ATL and BTL combined",
        "warning",
        uniqueId
      );
    }
  }

  // Event listeners for ATL and BTL textareas
  const atlTextarea = uniqueContainer.querySelector("#ATL");
  const btlTextarea = uniqueContainer.querySelector("#BTL");

  atlTextarea.addEventListener("input", handleTextareaInput);
  btlTextarea.addEventListener("input", handleTextareaInput);
}
// Helper function to parse gpt_response and create HTML content
function createPostContent(postType, gptResponse) {
  let content = "";

  try {
    /*  const parsedResponse = JSON.parse(gptResponse); */
    content += gptResponse;
  } catch (error) {
    console.error("Error parsing :", error);
  }

  return content;
}
// -----------------------perplexity start here------------------------------
//creating the chat
async function creatChat(data, uniqueId) {
  const chatList = document.getElementById(uniqueId).querySelector("#chatList");

  // Store the original content of the div before displaying the loading message
  const originalContent = chatList.innerHTML;

  // Create the loading message and append it
  const loadingDiv = document.createElement("div");
  loadingDiv.innerHTML = `
              <div id="loaderSearch">Generating ... Please wait</div>
            `;
  loadingDiv.style.textAlign = "center";
  loadingDiv.style.color = "#5B5B5B";
  chatList.appendChild(loadingDiv);

  // Fetch the content from loader.html and update the innerHTML once fetched
  fetch(chrome.runtime.getURL("pages/loader.html"))
    .then((response) => response.text())
    .then((html) => {
      // First, clear the existing content including the loading message
      chatList.innerHTML = "";

      chatList.innerHTML = html;

      // Display the element again
      chatList.style.display = "block";

      // Call your custom function to update the loader text
      updateSearch(4);
    })
    .catch((error) => {
      console.error("Error fetching loader.html:", error);
    });

  let { userToken } = await chrome.storage.local.get(["userToken"]);

  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/leadlabs-search",
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

  if (responseData?.header === "success") {
    chatList.innerHTML = originalContent;

    // Clear the input field after submitting
    document.getElementById(uniqueId).querySelector("#chatInput").value = "";
    const emptyMessage = chatList.querySelector(".empty-chat-message");
    if (emptyMessage) {
      emptyMessage.remove(); // This removes the div and all its content
    }

    // Extract the question and answer from the response
    const question = responseData.question;
    const answer = responseData.answer;

    // Create a container div for the chat
    const chatContainer = document.createElement("div");
    chatContainer.classList.add("chat-container");

    // Create a div for the question
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("chat-question");
    questionDiv.innerHTML = `<strong>Question:</strong> ${question}`;

    // Create a div for the answer
    const answerDiv = document.createElement("div");
    answerDiv.classList.add("chat-answer");
    answerDiv.innerHTML = `<strong>Answer:</strong> ${answer}`;

    // Append the question and answer to the chat container
    chatContainer.appendChild(questionDiv);
    chatContainer.appendChild(answerDiv);

    // Append the entire chat container to the chat list
    chatList.appendChild(chatContainer);
  }
  document
    .getElementById(uniqueId)
    .querySelector("#submitChat").disabled = false;
}
//api to get all the chat
async function getAllChat(uniqueId, id) {
  const uniqueContainer = document.getElementById(uniqueId);
  let pageLimit = 1;
  let { userToken } = await chrome.storage.local.get(["userToken"]);

  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/get-all-question-answer",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        id: id,
        page_limit: pageLimit,
      }),
    }
  );

  const responseData = await response.json();

  if (responseData) {
    const selectElement = uniqueContainer.querySelector("#search-history");
    selectElement.innerHTML = "";

    if (responseData?.body?.length === 0) {
      const container = uniqueContainer.querySelector("#search-history");
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
        "<h4>No Chat History Found</h4>" +
        "<p>Create a Chat to get started.</p>" +
        "</div>";
      container.appendChild(emptyArray);
      uniqueContainer.querySelector("#load_more_btn_search").style.display =
        "none";
    } else {
      uniqueContainer.querySelector("#load_more_btn_search").style.display =
        "block";
      responseData?.body.forEach((chatBody) => {
        // Create a container for each question-answer pair
        const chatContainer = document.createElement("div");
        chatContainer.classList.add("chat-container"); // Add a class for styling

        // Create a div for the question (perplexity_question)
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("chat-question");
        questionDiv.innerHTML = `<strong>Question:</strong> ${chatBody?.question}`;

        // Create a div for the answer (perplexity_answer)
        const answerDiv = document.createElement("div");
        answerDiv.classList.add("chat-answer");
        answerDiv.innerHTML = `<strong>Answer:</strong> ${chatBody?.answer}`;

        // Append the question and answer to the chat container
        chatContainer.appendChild(questionDiv);
        chatContainer.appendChild(answerDiv);

        // Append the entire container to the main chatList div
        selectElement.appendChild(chatContainer);
      });

      uniqueContainer.querySelector("#companyNameLL").innerText =
        responseData?.companyname;

      // Setup "load more" functionality
      uniqueContainer
        .querySelector("#load_more_btn_search")
        .addEventListener("click", function (e) {
          e.preventDefault();
          pageLimit += 1;
          getShowLoadMoreSearch(pageLimit, id)
            .then((data) => {
              // call function to add new data to the UI
              addData(data, "loadmore", uniqueId);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
    }
  }
}
//load more function
async function getShowLoadMoreSearch(str, id) {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/get-all-question-answer",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        id: id,
        page_limit: str,
      }),
    }
  );
  const responseData = await response.json();
  return responseData;
}
//to add the data once response is recived
function addData(data, type, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  const contentList = uniqueContainer.querySelector("#search-history");

  if (type !== "loadmore") {
    contentList.innerHTML = ""; // Clear existing content only if it's not a load more action
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

  // Call function to combine divs (update function to work within `uniqueContainer`)
  combineConsecutiveMellDivsAndAddLabels(uniqueId);
}
//-----------------------------perplexity end here---------------------------------

function generatePersonaList(personaList, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  const container = uniqueContainer.querySelector("#parsonaListingDetails")
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

  uniqueContainer
    .querySelector("#createPersonaPage")
    .addEventListener("click", () => {
      uniqueContainer.querySelector("#popup-overlay-persona-ll").style.display =
        "flex";
    });

  uniqueContainer
    .querySelector("#back-to-main-card-persona")
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

  if (personaList.length === 0) {
    const emptyArray = document.createElement("div");
    emptyArray.style.display = "flex";
    emptyArray.style.justifyContent = "center";
    emptyArray.style.alignItems = "center";
    emptyArray.style.height = "65vh";

    emptyArray.innerHTML = `
        <div class="empty-list-ll">
          <svg class="empty-icon-ll" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7h18v13H3z" fill="none"></path>
            <path d="M5 4h4l3 3h9v13H5z"></path>
          </svg>
          <h4>No Personas Found</h4>
          <p>Create a new persona to get started.</p>
        </div>`;
    container.appendChild(emptyArray);
  }

  personaList.forEach((persona) => {
    const personaItem = document.createElement("div");
    personaItem.className = "persona-item-ll";
    personaItem.id = `persona-item-${persona.id}`;

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
    type.textContent = persona?.isatl_btl_type;
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
    moreOptions.id = `more-options-${persona.id}`;
    moreOptions.textContent = "⋮";

    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "dropdown-menu-ll";
    dropdownMenu.id = `dropdown-menu-${persona.id}`;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = (event) =>
      editPersona(event, persona.id, persona, uniqueId);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = (event) =>
      deletePersona(event, persona.id, personaItem, uniqueId);

    dropdownMenu.appendChild(editButton);
    dropdownMenu.appendChild(deleteButton);

    optionsContainer.appendChild(type);
    optionsContainer.appendChild(expandIcon);
    optionsContainer.appendChild(moreOptions);
    optionsContainer.appendChild(dropdownMenu);

    personaHeader.appendChild(personaInfo);
    personaHeader.appendChild(optionsContainer);

    const personaDetails = document.createElement("div");
    personaDetails.innerHTML = `
        <div>
          <div style="font-weight: 600;">Industry</div><div>${
            persona.industry
          }</div>
          <div style="font-weight: 600;">Pain Points</div><div>${
            persona.customer_pain_points
          }</div>
          <div style="font-weight: 600;">Value Proposition</div><div>${
            persona.value_proposition
          }</div>
          <div style="font-weight: 600;">Results</div><div>${
            persona.results
          }</div>
          <div style="font-weight: 600;">Created Date</div><div>${
            persona.created_date.split("T")[0]
          }</div>
        </div>`;
    personaDetails.className = "persona-details-ll";
    personaDetails.style.display = "none";

    personaItem.appendChild(personaHeader);
    personaItem.appendChild(personaDetails);

    container.appendChild(personaItem);

    uniqueContainer
      .querySelector(`#more-options-${persona.id}`)
      .addEventListener("click", (event) => {
        event.stopPropagation();
        const dropdownMenu = uniqueContainer.querySelector(
          `#dropdown-menu-${persona.id}`
        );
        dropdownMenu.style.display =
          dropdownMenu.style.display === "block" ? "none" : "block";
      });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.matches(".more-options-ll")) {
      document.querySelectorAll(".dropdown-menu-ll").forEach((menu) => {
        menu.style.display = "none";
      });
    }
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

async function deletePersona(event, id, container, uniqueId) {
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
    showNotification("Persona Deleted Successfully!", "success", uniqueId);
    container.remove();
  }
}

async function editPersona(event, id, personaData, uniqueId) {
  const uniqueContainer = document.getElementById(uniqueId);
  event.stopPropagation();
  // Populate the input fields with the selected persona's data
  uniqueContainer.querySelector("#persona-id-ll").value = personaData.id;
  uniqueContainer.querySelector("#persona-name-ll").value =
    personaData.persona_name;
  uniqueContainer.querySelector("#company-name-ll").value =
    personaData.company_name;
  uniqueContainer.querySelector("#pain-points-ll").value =
    personaData.customer_pain_points;
  uniqueContainer.querySelector("#industry-name-ll").value =
    personaData.industry;
  uniqueContainer.querySelector("#value-proposition-ll").value =
    personaData.value_proposition;
  uniqueContainer.querySelector("#results-ll").value = personaData.results;
  uniqueContainer.querySelector("#mandatory-message-ll").value =
    personaData.mandatory_message;
  uniqueContainer.querySelector("#custom-tonality-ll").value =
    personaData.custom_tonality;
  uniqueContainer.querySelector(
    "#parsonaListingDetails"
  ).children[0].style.display = "block";
  uniqueContainer.querySelector(
    "#parsonaListingDetails"
  ).children[1].style.display = "none";

  uniqueContainer.querySelector("#create-btn-ll").textContent =
    "Update Persona";
}

// Persona end
