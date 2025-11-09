function injectContentScript(tabId, changeInfo, tab) {
  //Show only if the user is logged in
  chrome.storage.local
    .get(["userToken", "enableGmail", "enableLinkedIn"])
    .then((result) => {
      if (result.userToken) {
        if (
          changeInfo.status === "complete" &&
          tab.url &&
          tab.url.includes("mail.google.com") &&
          result.enableGmail
        ) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: injectContentGmail,
          });
        }

        if (
          changeInfo.status === "complete" &&
          tab.url &&
          tab.url.includes("linkedin.com") &&
          result.enableLinkedIn
        ) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: injectContentLinkedIn,
          });
        }

        if (
          changeInfo.status === "complete" &&
          tab.url &&
          tab.url.includes("linkedin.com/in/") &&
          result.enableLinkedIn
        ) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: injectContentLinkedInProfile,
          });
        }
        //this code is added because for the comment generation.
        if (
          changeInfo.status === "complete" &&
          tab.url &&
          tab.url.includes("linkedin.com/feed/") &&
          result.enableLinkedIn
        ) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: injectContentLinkedInProfile,
          });
        }
        //for float icon

        if (
          changeInfo.status === "complete" &&
          tab &&
          tab.url &&
          //!tab.url.includes("mail.google.com") && // Exclude Gmail
          !tab.url.includes("linkedin.com") // Exclude LinkedIn profiles
        ) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: injectContentAllWebsite,
          });
        }

        if (
          changeInfo.status === "complete" &&
          tab.url &&
          (tab.url.includes("linkedin.com/company/") ||
            tab.url.includes("linkedin.com/school/")) &&
          result.enableLinkedIn
        ) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: injectContentLinkedInCompany,
          });
        }
      } else {
        //deleteAllElementsIfExists();
      }
    });
}

function injectContentLinkedInProfile() {
  addAnalyseProfileButton();
  setTimeout(() => {
    callNano();
    callPerivausAction(getLinkedInURL());
    runCanvas(getLinkedInURL(), "getCanvas");
    runCanvas(getLinkedInURL(), "canvas-list-container-ll");
    runCanvas(getLinkedInURL(), "get-canvas-center");
    runCanvas(getLinkedInURL(), "get-canvas-center-list");
    selfWrittenContentRedirect(false, true);
  }, 4000);
}

function injectContentLinkedInCompany() {
  analyseCompany();
}

function injectContentLinkedIn() {
  const navGif = document.createElement("button");
  navGif.id = "LinkedinLL";
  navGif.innerHTML = "";

  const popupContainer = document.createElement("div");
  popupContainer.id = "revaaloLL";

  /*   const closeImg = document.createElement("img");
  closeImg.src = chrome.runtime.getURL("assets/close.png"); // Set the image source
  closeImg.id="closeLL";
  popupContainer.appendChild(closeImg);
 */
  const composeBody = document.querySelector(".msg-overlay-bubble-header");

  if (composeBody) {
    //composeBody.appendChild(navGif); dont inject this, we need to inject generate comment for now
    composeBody.appendChild(popupContainer);
    // addCommentButton();
  }

  const imageGif = document.createElement("img");
  imageGif.src = chrome.runtime.getURL("assets/nav/nav-gif.png"); // Set the image source
  navGif.appendChild(imageGif);
}

// Function to inject the content script
function injectContentGmail() {
  const navArray = [
    "PopupProfiles",
    "PopupGif",
    "PopupScore",
    "PopupMicrosite",
    "PopupEmail",
    "PopupPreview",
    "PopupNotification",
    "PopupLogout",
  ];

  const icons = [
    "assets/nav/nav-profiles.png",
    "assets/nav/nav-gif.png",
    "assets/nav/nav-score.png",
    "assets/nav/nav-microsite.png",
    "assets/nav/nav-email.png",
    "assets/nav/nav-preview.png",
    "assets/nav/nav-notification.png",
    "assets/nav/nav-logout.png",
  ];

  const activeIcons = [
    "assets/nav/nav-profiles-active.png",
    "assets/nav/nav-gif-active.png",
    "assets/nav/nav-score-active.png",
    "assets/nav/nav-microsite-active.png",
    "assets/nav/nav-email-active.png",
    "assets/nav/nav-preview-active.png",
    "assets/nav/nav-notification-active.png",
    "assets/nav/nav-logout-active.png",
  ];

  // Set the image alt text
  const navProfiles = document.createElement("button");
  const navGif = document.createElement("button");
  const navScore = document.createElement("button");
  const navMicrosite = document.createElement("button");
  const navEmail = document.createElement("button");
  const navPreview = document.createElement("button");
  const navNotification = document.createElement("button");
  const navLogout = document.createElement("button");

  if (!document.getElementById("revaaloLLWrapper")) {
    const popupWrapper = document.createElement("div");
    popupWrapper.id = "revaaloLLWrapper";

    navProfiles.id = "PopupProfiles";
    navProfiles.innerHTML = "";

    navGif.id = "PopupGif";
    navGif.innerHTML = "";

    navScore.id = "PopupScore";
    navScore.innerHTML = "";

    navMicrosite.id = "PopupMicrosite";
    navMicrosite.innerHTML = "";

    navEmail.id = "PopupEmail";
    navEmail.innerHTML = "";

    navPreview.id = "PopupPreview";
    navPreview.innerHTML = "";

    navNotification.id = "PopupNotification";
    navNotification.innerHTML = "";

    navLogout.id = "PopupLogout";
    navLogout.innerHTML = "";

    const popupContainer = document.createElement("div");
    popupContainer.id = "revaaloLL";

    const leadlabsIcon = document.createElement("button");
    leadlabsIcon.id = "leadlabsIcon";
    leadlabsIcon.style.display = "none";
    const llIcon = document.createElement("img");
    llIcon.style.width = "35px";
    llIcon.src = chrome.runtime.getURL("assets/leadlabs.png"); // Set the image source
    leadlabsIcon.appendChild(llIcon);

    const reloadpagellIcon = document.createElement("div");
    reloadpagellIcon.id = "reloadPageLL";
    reloadpagellIcon.innerHTML =
      "<div><div style='font-size: 24px; margin-bottom: 10px;'>⚠️</div>LeadLabs Extension was updated. Please <strong>reload</strong> the page.</div> <button id='reloadPageBtnLL'> Reload </button>";

    const imageProfiles = document.createElement("img");
    imageProfiles.src = chrome.runtime.getURL("assets/nav/nav-profiles.png"); // Set the image source
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

    const imageScore = document.createElement("img");
    imageScore.src = chrome.runtime.getURL("assets/nav/nav-score.png"); // Set the image source
    navScore.appendChild(imageScore);
    const scoreToolTip = document.createElement("span");
    scoreToolTip.classList.add("tooltiptextLL");
    scoreToolTip.innerText = "Email Score";
    navScore.classList.add("tooltipLL");
    navScore.appendChild(scoreToolTip);

    const imageMicrosite = document.createElement("img");
    imageMicrosite.src = chrome.runtime.getURL("assets/nav/nav-microsite.png"); // Set the image source
    navMicrosite.appendChild(imageMicrosite);
    const microSiteToolTip = document.createElement("span");
    microSiteToolTip.classList.add("tooltiptextLL");
    microSiteToolTip.innerText = "Microsites";
    navMicrosite.classList.add("tooltipLL");
    navMicrosite.appendChild(microSiteToolTip);

    const imageEmail = document.createElement("img");
    imageEmail.src = chrome.runtime.getURL("assets/nav/nav-email.png"); // Set the image source
    navEmail.appendChild(imageEmail);
    const emailToolTip = document.createElement("span");
    emailToolTip.classList.add("tooltiptextLL");
    emailToolTip.innerText = "Email Templates";
    navEmail.classList.add("tooltipLL");
    navEmail.appendChild(emailToolTip);

    const imagePreview = document.createElement("img");
    imagePreview.src = chrome.runtime.getURL("assets/nav/nav-preview.png"); // Set the image source
    navPreview.appendChild(imagePreview);
    const previewToolTip = document.createElement("span");
    previewToolTip.classList.add("tooltiptextLL");
    previewToolTip.innerText = "Email Preview";
    navPreview.classList.add("tooltipLL");
    navPreview.appendChild(previewToolTip);

    const imageNotification = document.createElement("img");
    imageNotification.src = chrome.runtime.getURL(
      "assets/nav/nav-notification.png"
    ); // Set the image source
    navNotification.appendChild(imageNotification);
    const notificationToolTip = document.createElement("span");
    notificationToolTip.classList.add("tooltiptextLL");
    notificationToolTip.innerText = "Notifications";
    navNotification.classList.add("tooltipLL");
    navNotification.appendChild(notificationToolTip);

    const imageLogout = document.createElement("img");
    imageLogout.src = chrome.runtime.getURL("assets/nav/nav-logout.png"); // Set the image source
    navLogout.appendChild(imageLogout);
    const logoutToolTip = document.createElement("span");
    logoutToolTip.classList.add("tooltiptextLL");
    logoutToolTip.innerText = "Logout";
    navLogout.classList.add("tooltipLL");
    navLogout.appendChild(logoutToolTip);

    navScore.addEventListener("click", async function () {});

    /*   const composeBody = document.querySelector(".inboxsdk__size_fixer"); */

    /* this is working but everything is coming inside the editor */
    /*  const selector =
"div[aria-label='Message Body'], div[aria-label='Message text'], div.editable";
const composeBody = document.querySelector(selector).parentNode.parentElement;  */

    // same issue with below
    //const composeBody = document.querySelector('[aria-label="Discard draft ‪(Ctrl-Shift-D)‬"]').parentNode.parentElement;

    //since above things are not working properly, trying to place the div where free-html-editor-for-gmail-cloudhq is placing it
    const composeBody = document.querySelector('div[role="dialog"]');

    if (composeBody) {
      composeBody.appendChild(popupWrapper);
      composeBody.appendChild(leadlabsIcon);
      composeBody.appendChild(reloadpagellIcon);

      reloadPageBtnLL.addEventListener("click", () => {
        window.location.reload();
      });
    }

    popupWrapper.appendChild(popupContainer);
    popupWrapper.appendChild(navProfiles);
    popupWrapper.appendChild(navScore);
    popupWrapper.appendChild(navGif);
    popupWrapper.appendChild(navMicrosite);
    popupWrapper.appendChild(navEmail);
    popupWrapper.appendChild(navPreview);
    popupWrapper.appendChild(navNotification);
    popupWrapper.appendChild(navLogout);

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

    /* function enableButtons(){
  //adding close button 
  document.getElementById("closeLL").src = chrome.runtime.getURL("assets/close.png");
  document.getElementById("dragLL").src = chrome.runtime.getURL("assets/drag.png"); 
}
 */
    if (document.getElementById("leadlabsIcon")) {
      document
        .getElementById("leadlabsIcon")
        .addEventListener("click", async () => {
          const isTrailOver = await istrailOver();

          // handling chrome extension invalidated
          if (!chrome.runtime?.id) {
            document.getElementById("reloadPageLL").style.display = "block";
          } else if (
            document.getElementById("revaaloLLWrapper").style.display ==
              "none" ||
            document.getElementById("revaaloLLWrapper").style.display == ""
          ) {
            document.getElementById("revaaloLLWrapper").style.display = "block";
            activateNav("PopupPreview");
            showPreview();
          } else {
            document.getElementById("revaaloLLWrapper").style.display = "none";
          }

          if (isTrailOver) {
            fetch(chrome.runtime.getURL("pages/trailend.html"))
              .then((r) => r.text())
              .then((html) => {
                document.getElementById("revaaloLLWrapper").innerHTML = html;
                document.getElementById("revaaloLLWrapper").style.display =
                  "block";
                document
                  .getElementById("closeTrailLL")
                  .addEventListener("click", () => {
                    document.getElementById("revaaloLLWrapper").style.display =
                      "none";
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

    const popupScoreButton = document.getElementById("PopupScore");
    if (popupScoreButton) {
      popupScoreButton.addEventListener("click", () => {
        activateNav("PopupScore");
        sendToChatGPTAPI();
      });
    }

    const popupProfilesButton = document.getElementById("PopupProfiles");
    if (popupProfilesButton) {
      popupProfilesButton.addEventListener("click", () => {
        activateNav("PopupProfiles");
        showAllProfiles();
      });
    }

    const popupGifButton = document.getElementById("PopupGif");
    if (popupGifButton) {
      popupGifButton.addEventListener("click", async () => {
        activateNav("PopupGif");
        await listGifs();
        // enableButtons();
      });
    }

    const popupMicrositeButton = document.getElementById("PopupMicrosite");
    if (popupMicrositeButton) {
      popupMicrositeButton.addEventListener("click", () => {
        activateNav("PopupMicrosite");
        showMinicourses();
      });
    }

    const popupEmailButton = document.getElementById("PopupEmail");
    if (popupEmailButton) {
      popupEmailButton.addEventListener("click", () => {
        activateNav("PopupEmail");
        showEmailTemplates();
      });
    }

    const popupPreviewButton = document.getElementById("PopupPreview");
    if (popupPreviewButton) {
      popupPreviewButton.addEventListener("click", () => {
        activateNav("PopupPreview");
        showPreview();
      });
    }

    const popupNotificationButton =
      document.getElementById("PopupNotification");
    if (popupNotificationButton) {
      popupNotificationButton.addEventListener("click", () => {
        activateNav("PopupNotification");
        showNotificationGmail();
      });
    }

    const popupLogoutButton = document.getElementById("PopupLogout");
    if (popupLogoutButton) {
      popupLogoutButton.addEventListener("click", () => {
        activateNav("PopupLogout");
        showLogout();
      });
    }
  }
}
//function ti inject the float icon
function injectContentAllWebsite() {
  floatIconFunction();
  setTimeout(() => {
    runCanvas("", "getCanvas");
    runCanvas("", "canvas-list-container-ll");
    runCanvas("", "get-canvas-center");
    runCanvas("", "get-canvas-center-list");
  }, 3000);
}
// Listen for changes in the browser tab
chrome.tabs.onUpdated.addListener(injectContentScript);

chrome.runtime.onInstalled.addListener((details) => {
  //console.log("uninstall called 1");
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.setUninstallURL("https://leadlabs.formaloo.co/5jbycn");
    //console.log("uninstall called 2");
  }
});

// redirecting in LinkedIn
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.redirect) {
    // Redirect the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.update(activeTab.id, { url: message.redirect });
    });
  }
});

// below code for creating popUp and closing it, id is maintained in an arrray and all the ids are closed.
// serivce worker cannot close, something created by background.
// why are we creating using background? becuase  chrome.windows.create provides window options !
// let createdWindowIds = [];
// // Track the original tab ID for each popup window
// const popupTabs = {};

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "createWindow" && message.url) {
//     // Store the original tab ID before creating the popup
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       if (tabs.length > 0) {
//         const originalTabId = tabs[0].id;

//         // Create the popup window
//         chrome.windows.create(
//           {
//             url: message.url,
//             type: "popup",
//             width: Math.floor(message.w),
//             height: Math.floor(message.h),
//             top: Math.floor(message.t),
//             left: Math.floor(message.l),
//           },
//           function (newWindow) {
//             createdWindowIds.push(newWindow.id);

//             // Store the original tab ID with the popup window ID
//             popupTabs[newWindow.id] = originalTabId;

//             const tabId = newWindow.tabs[0].id;

//             chrome.scripting.executeScript({
//               target: { tabId: tabId },
//               func: function (windowId) {
//                 window.chromeExtensionWindowId = windowId;
//               },
//               args: [newWindow.id],
//             });
//           }
//         );
//       }
//     });
//   }

//   if (message.action === "closeWindow" && message.wid) {
//     console.log("Close Window");
//     const windowId = parseInt(message.wid);

//     // Send a message to the original tab associated with this popup window
//     const originalTabId = popupTabs[windowId];
//     if (originalTabId) {
//       chrome.tabs.sendMessage(
//         originalTabId,
//         { action: "windowClosed" },
//         (response) => {
//           if (chrome.runtime.lastError) {
//             console.error(
//               "Error sending message to content script:",
//               chrome.runtime.lastError.message
//             );
//           } else {
//             // console.log("Message sent to original tab with ID:", originalTabId);

//             // Close the popup window after the message is sent
//             chrome.windows.remove(windowId, (removed) => {
//               if (chrome.runtime.lastError) {
//                 console.error(
//                   "Error closing window:",
//                   chrome.runtime.lastError.message
//                 );
//               } else {
//                 // console.log("Window with ID", windowId, "has been closed.");

//                 // Remove the tab from the tracking object
//                 delete popupTabs[windowId];
//               }
//             });
//           }
//         }
//       );
//     } else {
//       // If no original tab is found, still close the window
//       chrome.windows.remove(windowId, (removed) => {
//         if (chrome.runtime.lastError) {
//           console.error(
//             "Error closing window:",
//             chrome.runtime.lastError.message
//           );
//         } else {
//           // console.log("Window with ID", windowId, "has been closed.");
//         }
//       });
//     }
//   }
// });

let createdWindowIds = [];
// Track the original tab ID for each popup window
const popupTabs = {};
// Track auto-close timers for each popup window
const popupTimers = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "createWindow" && message.url) {
    // Store the original tab ID before creating the popup
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const originalTabId = tabs[0].id;

        // Create the popup window
        chrome.windows.create(
          {
            url: message.url,
            type: "popup",
            width: Math.floor(message.w),
            height: Math.floor(message.h),
            top: Math.floor(message.t),
            left: Math.floor(message.l),
          },
          function (newWindow) {
            createdWindowIds.push(newWindow.id);

            // Store the original tab ID with the popup window ID
            popupTabs[newWindow.id] = originalTabId;

            const tabId = newWindow.tabs[0].id;

            chrome.scripting.executeScript({
              target: { tabId: tabId },
              func: function (windowId) {
                window.chromeExtensionWindowId = windowId;
              },
              args: [newWindow.id],
            });

            // 🔴 Set auto-close timer for 60s
            if (popupTimers[newWindow.id]) {
              clearTimeout(popupTimers[newWindow.id]);
            }
            popupTimers[newWindow.id] = setTimeout(() => {
              chrome.windows.remove(newWindow.id, () => {
                if (chrome.runtime.lastError) {
                  console.warn(
                    "Window already closed or error:",
                    chrome.runtime.lastError.message
                  );
                } else {
                  console.log("⏰ Auto-closed window ID:", newWindow.id);
                  delete popupTabs[newWindow.id];
                  delete popupTimers[newWindow.id];
                }
              });
            }, 60000); // 60 sec
          }
        );
      }
    });
  }

  if (message.action === "closeWindow" && message.wid) {
    console.log("Close Window");
    const windowId = parseInt(message.wid);

    // Clear auto-close timer if exists
    if (popupTimers[windowId]) {
      clearTimeout(popupTimers[windowId]);
      delete popupTimers[windowId];
    }

    const originalTabId = popupTabs[windowId];
    if (originalTabId) {
      chrome.tabs.sendMessage(originalTabId, { action: "windowClosed" }, () => {
        if (chrome.runtime.lastError) {
          console.warn(
            `Tab ${originalTabId} not available:`,
            chrome.runtime.lastError.message
          );
        }
        // Always close the window regardless
        chrome.windows.remove(windowId, () => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error closing window:",
              chrome.runtime.lastError.message
            );
          } else {
            delete popupTabs[windowId];
          }
        });
      });
    } else {
      chrome.windows.remove(windowId, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error closing window:",
            chrome.runtime.lastError.message
          );
        }
      });
    }
  }
});

// let processingTabId = null;
// let profileQueue = []; // global queue in background
// let currentIndex = 0;

// // Receive list from popup
// chrome.runtime.onMessage.addListener((msg, sender) => {
//   if (msg.action === "startProcess") {
//     const urls = msg.urls; // array of URLs from popup
//     profileQueue = urls.map((url) => ({
//       linkedinUrl: url.trim(),
//       status: "notcomplete",
//     }));
//     currentIndex = 0;

//     if (profileQueue.length > 0) {
//       openNextProfile();
//     }
//   }

//   if (msg.action === "profileDone") {
//     // Mark complete
//     profileQueue[currentIndex].status = "complete";
//     currentIndex++;
//     openNextProfile();
//   }
// });

// // Open the next profile
// function openNextProfile() {
//   if (currentIndex >= profileQueue.length) {
//     console.log("✅ All profiles processed");

//     // Close the tab if still open
//     if (processingTabId) {
//       chrome.tabs.remove(processingTabId, () => {
//         console.log("🔒 Closed processing tab");
//         processingTabId = null;
//       });
//     }
//     return;
//   }

//   const current = profileQueue[currentIndex];
//   if (!current) return;

//   // Create new tab if none exists
//   if (!processingTabId) {
//     chrome.tabs.create({ url: current.linkedinUrl, active: true }, (tab) => {
//       processingTabId = tab.id;
//       waitForPageAndTrigger(tab.id);
//     });
//   } else {
//     // Reuse tab
//     chrome.tabs.update(processingTabId, { url: current.linkedinUrl }, () => {
//       waitForPageAndTrigger(processingTabId);
//     });
//   }
// }
let processingTabId = null;
let profileQueue = [];
let currentIndex = 0;
let sourceTabId = null; // 👈 track the tab where process started

// Receive list from popup
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "startProcess") {
    const urls = msg.urls;
    profileQueue = urls.map((url) => ({
      linkedinUrl: url.trim(),
      status: "notcomplete",
    }));
    currentIndex = 0;
    sourceTabId = sender.tab?.id || null; // 👈 save original tabId

    if (profileQueue.length > 0) {
      openNextProfile();
    }
  }

  if (msg.action === "profileDone") {
    profileQueue[currentIndex].status = "complete";
    currentIndex++;
    openNextProfile();
  }
});

// Open the next profile
function openNextProfile() {
  if (currentIndex >= profileQueue.length) {
    console.log("✅ All profiles processed");

    if (processingTabId) {
      chrome.tabs.remove(processingTabId, () => {
        console.log("🔒 Closed processing tab");
        processingTabId = null;

        // 👈 Return to original tab
        if (sourceTabId) {
          chrome.tabs.update(sourceTabId, { active: true }, () => {
            if (sourceTabId !== null) {
              chrome.scripting.executeScript({
                target: { tabId: sourceTabId },
                func: () => {
                  const btn = document.getElementById("showPersonal");
                  if (btn) btn.click();
                },
              });
            }
            // reset after execution
            sourceTabId = null;
          });
        }
      });
    }

    return;
  }

  const current = profileQueue[currentIndex];
  if (!current) return;

  if (!processingTabId) {
    chrome.tabs.create({ url: current.linkedinUrl, active: true }, (tab) => {
      processingTabId = tab.id;
      waitForPageAndTrigger(tab.id);
    });
  } else {
    chrome.tabs.update(processingTabId, { url: current.linkedinUrl }, () => {
      waitForPageAndTrigger(processingTabId);
    });
  }
}

// Wait for page load then tell content script to click
function waitForPageAndTrigger(tabId) {
  function listener(tabIdUpdated, changeInfo) {
    if (tabIdUpdated === tabId && changeInfo.status === "complete") {
      chrome.tabs.sendMessage(tabId, {
        action: "clickSelfWrittenBtn",
        index: currentIndex,
      });
      chrome.tabs.onUpdated.removeListener(listener);
    }
  }
  chrome.tabs.onUpdated.addListener(listener);
}
