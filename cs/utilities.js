async function gifWizard(name, path, id) {
  //responseData.body[i].gif_name, path, responseData.body[i]._id
  document.getElementById("gifPop").style.display = "block";
  document.getElementById("gifPopImg").src = path;
  document.getElementById("gifPopTxt").innerText = name;
  //console.log(name);
  document.getElementById("gifcloseLL").addEventListener("click", () => {
    document.getElementById("childGifList").innerHTML = "";
    document.getElementById("gifPop").style.display = "none";
  });

  // call all the available child gifs
  const response = await fetch(
    "https://betaback.leadlabs.app/api/get/childgif?parent_gif_id=" + id,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  const responseData = await response.json();
  if (responseData.data && responseData.data.length > 0) {
    const childGifList = document.getElementById("childGifList");
    childGifList.style.display = "block";

    for (i = 0; i < responseData.data.length; i++) {
      const childgif = document.createElement("div");
      childgif.classList.add("childgif");

      var path = responseData.data[i].gif_path;
      var copyImg = chrome.runtime.getURL("assets/copy.png");

      if (path == null) {
        path = chrome.runtime.getURL("assets/dummyimage.png");
      }

      //currently onError not working properly
      childgif.innerHTML =
        '<div style="display:flex; margin-bottom: 10px;"><img id="img' +
        i +
        'img" src="' +
        path +
        '"></img><div class="tooltipLL" style="width:25px;"><img id="img' +
        i +
        'imgcopy" style="cursor:pointer; width: 25px;padding: 20px;" src="' +
        copyImg +
        '"></img><span class="tooltiptextLL">Copy Image<span></div></div>';
      childGifList.appendChild(childgif);

      const imageId = "img" + i + "img";
      const imageIdCopy = "img" + i + "imgcopy";
      document.getElementById(imageIdCopy).addEventListener("click", () => {
        copyGif(imageId);
      });
    }
  }
}

async function gmailDetailedProfiles(id) {
  //console.log("gmailDetailedProfile", id);
  document.getElementById("profilePop").style.display = "block";
  document.getElementById("profilePopcloseLL").addEventListener("click", () => {
    document.getElementById("profilePop").style.display = "none";
  });
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
  //console.log(responseData);

  if (responseData) {
    fetch(chrome.runtime.getURL("pages/profile.html"))
      .then((r) => r.text())
      .then((html) => {
        document.getElementById("gmailProfileDetails").innerHTML = html;

        // tabs
        document
          .getElementById("profileAnalysis")
          .addEventListener("click", previewProfileAnalysis);
        document
          .getElementById("communicatonFrameWork")
          .addEventListener("click", previewCommunicationFrameWork);
        //document.getElementById("strategyFramework").addEventListener("click", previewStrategyFramework);

        function previewProfileAnalysis() {
          // show relavent image
          document.getElementById("profileAnalysisDetails").style.display =
            "block";
          document.getElementById("profileAnalysis").className = " active";

          document.getElementById(
            "communicationFrameWorkDetails"
          ).style.display = "none";
          document.getElementById("communicatonFrameWork").className = document
            .getElementById("communicatonFrameWork")
            .className.replace(" active", "");
          /*       document.getElementById("strategyFrameworkDetails").style.display = "none";
      document.getElementById("strategyFramework").className =  document.getElementById("strategyFramework").className.replace(" active",""); */
        }

        function previewCommunicationFrameWork() {
          // show relavent image
          document.getElementById(
            "communicationFrameWorkDetails"
          ).style.display = "block";
          document.getElementById("communicatonFrameWork").className =
            " active";

          document.getElementById("profileAnalysisDetails").style.display =
            "none";
          document.getElementById("profileAnalysis").className = document
            .getElementById("profileAnalysis")
            .className.replace(" active", "");
          /*       document.getElementById("strategyFrameworkDetails").style.display = "none";
      document.getElementById("strategyFramework").className =  document.getElementById("strategyFramework").className.replace(" active",""); */
        }

        function previewStrategyFramework() {
          // show relavent image
          document.getElementById("strategyFrameworkDetails").style.display =
            "block";
          document.getElementById("strategyFramework").className = " active";

          document.getElementById("profileAnalysisDetails").style.display =
            "none";
          document.getElementById("profileAnalysis").className = document
            .getElementById("profileAnalysis")
            .className.replace(" active", "");
          document.getElementById(
            "communicationFrameWorkDetails"
          ).style.display = "none";
          document.getElementById("communicatonFrameWork").className = document
            .getElementById("communicatonFrameWork")
            .className.replace(" active", "");
        }

        // data populations
        document.getElementById("profileD").innerText =
          responseData.data.Dominance;
        document.getElementById("profileI").innerText =
          responseData.data.Influence;
        document.getElementById("profileS").innerText =
          responseData.data.Steadiness;
        document.getElementById("profileC").innerText =
          responseData.data.Conscientiousness;

        document.getElementById("profileLikes").innerText =
          responseData.data.Likes;
        document.getElementById("profileDislikes").innerText =
          responseData.data.Dislikes;
        document.getElementById("profileInterestedTopics").innerText =
          responseData.data.InterestedTopics;
        document.getElementById("profileIceBrakers").innerHTML =
          responseData.data.IceBreakers.replace(/\[|\]/g, "");
        document.getElementById("profileProblems").innerHTML =
          responseData.data.ProbableProblems;

        if (responseData.hubspotIntegration === true) {
          document.getElementById("displayhubspot").style.display = "block";
          document
            .getElementById("displayhubspot")
            .addEventListener("click", () => {
              getSearchHubspot(getLinkedInURL());
            });
        }
        //here from the back end the experience is a json data so we are converting the data to array and
        //using the map function display the experience
        let experienceData;

        try {
          // Attempt to parse experience data
          experienceData = JSON.parse(responseData.experience);

          // If the parsed data is still a string, parse again
          if (typeof experienceData === "string") {
            experienceData = JSON.parse(experienceData);
          }

          // Check if experienceData is an array, if not, set to empty array
          if (!Array.isArray(experienceData)) {
            experienceData = [];
          }
        } catch (error) {
          experienceData = []; // Default to empty array if parsing fails
        }

        // Create HTML for experience section
        let experienceHTML = "<h3>Experience</h3><div class='collapsedll'>";

        experienceData.forEach((item) => {
          experienceHTML += `
            <div class="experiancell">
              <img src="${item?.companyImageUrl}" alt="Company Logo" />
              <p>${item.companyname}</p>
              <p class="fw-600">${item.jobtitle}</p>
                  <p>${item?.startdate} ${item?.enddate}</p>
          `;

          // Check if `samecompany` has more than 2 elements
          if (item.samecompany && item.samecompany.length > 1) {
            experienceHTML += `<div class="samecompany-section"><ul>`;

            item.samecompany.forEach((position) => {
              experienceHTML += `
                <li>
                  <p class="fw-600"> ${position.position}</p>
                <p>${position?.startdate} ${position?.enddate}</p>
                </li>
              `;
            });

            experienceHTML += `</ul></div>`;
          }

          experienceHTML += `</div>`; // Close the `experiancell` div
        });

        experienceHTML += `</div>`; // Close the `collapsedll` div

        // Append "See more" functionality
        experienceHTML +=
          "</div><span id='experienceToggleArrowll'>▼</span><span id='experienceToggleTextll'>See more...</span>";

        document.getElementById("profiletitlell").innerHTML =
          "About  " +
          '<div class="profileblockll"><img src="' +
          responseData.profileImage +
          '" alt="profile image"> <div>' +
          responseData.profileName +
          '<div style="margin-bottom:10px; font-size:14px; font-weight: 550;">Personality Type (<i>' +
          responseData.data.PersonalityType +
          '</i>)</div><div style="margin-bottom: 20px">' +
          responseData.tags +
          "</div><div id='profileAboutSection'> <h3> About </h3><div  class='collapsedll'>" +
          responseData.about +
          "</div><span id='toggleArrowll'>▼</span><span id='toggleTextll'>See more...</span></div>";

        //adding Experience
        document.getElementById("profileExperienceSection").innerHTML =
          experienceHTML;

        // update name and profile type in generate content page.
        document.getElementById("profileNameGenerateContent").innerText =
          responseData.profileName;
        document.getElementById("profileTypeGenerateContent").innerText =
          responseData.data.PersonalityType;
        document.getElementById("profileSuccess").innerHTML =
          responseData.success;
        document.getElementById("profileEmail").innerHTML = responseData.emails;
        document.getElementById("profileSpeak").innerHTML =
          responseData.speaking;
        document.getElementById("firstCold").innerHTML = responseData.firstCold;
        document.getElementById("followUpCold").innerHTML =
          responseData.followUpCold;
        document.getElementById("firstLinkedIn").innerHTML =
          responseData.firstLinkedIn;
        document.getElementById("followUpLinkedIn").innerHTML =
          responseData.followUpLinkedIn;

        document.getElementById("frameworkProfileName").innerText =
          responseData.profileName;
        document.getElementById("frameworkProfileName2").innerText =
          responseData.profileName;
        document.getElementById("profileNameAdapting").innerText =
          responseData.profileName.split(" ")[0];

        document.getElementById("strategyDiscovery").innerHTML =
          "<div class='strategyDo'>Do's:" +
          responseData.strategyDiscovery.dos +
          "</div> <div class='strategyDont'>Don'ts:" +
          responseData.strategyDiscovery.donts +
          "</div><div class='strategyOutlier'>Outlier:" +
          responseData.strategyDiscoveryOutlier +
          "</div><div class='frameworks'>Some Frame works you can try:" +
          responseData.strategyDiscovery.frameworks +
          "</div>";

        document.getElementById("strategyFollowup").innerHTML =
          "<div class='strategyDo'>Do's:" +
          responseData.strategyFollowup.dos +
          "</div> <div class='strategyDont'>Don'ts:" +
          responseData.strategyFollowup.donts +
          "</div><div class='strategyOutlier'>Outlier:" +
          responseData.strategyFollowupOutlier +
          "</div><div class='frameworks'>Some Frame works you can try:" +
          responseData.strategyFollowup.frameworks +
          "</div>";

        document.getElementById("strategyNegotiation").innerHTML =
          "<div class='strategyDo'>Do's:" +
          responseData.strategyNegotiation.dos +
          "</div> <div class='strategyDont'>Don'ts:" +
          responseData.strategyNegotiation.donts +
          "</div><div class='strategyOutlier'>Outlier:" +
          responseData.strategyNegotiationOutlier +
          "</div><div class='frameworks'>Some Frame works you can try:" +
          responseData.strategyNegotiation.frameworks +
          "</div>";

        document.getElementById("strategyPricing").innerHTML =
          "<div class='strategyDo'> Do's:" +
          responseData.strategyPricing.dos +
          "</div> <div class='strategyDont'>Don'ts:" +
          responseData.strategyPricing.donts +
          "</div><div class='strategyOutlier'>Outlier:" +
          responseData.strategyPricingOutlier +
          "</div><div class='frameworks'>Some Frame works you can try:" +
          responseData.strategyPricing.frameworks +
          "</div>";

        document.getElementById("strategyProductDemo").innerHTML =
          "<div class='strategyDo'>Do's:" +
          responseData.strategyProductDemo.dos +
          "</div> <div class='strategyDont'>Don'ts:" +
          responseData.strategyProductDemo.donts +
          "</div><div class='strategyOutlier'>Outlier:" +
          responseData.strategyProductDemoOutlier +
          "</div><div class='frameworks'>Some Frame works you can try:" +
          responseData.strategyProductDemo.frameworks +
          "</div>";

        document.getElementById("selectFramework").onchange = function () {
          //console.log("selected value", document.getElementById('selectFramework').value)
          switchFrameworksTo(document.getElementById("selectFramework").value);
        };

        // About Section Toggle
        const profileAboutSection = document.getElementById(
          "profileAboutSection"
        );
        const aboutToggleText = document.getElementById("toggleTextll");
        const aboutToggleArrow = document.getElementById("toggleArrowll");
        const aboutCollapsedSection =
          profileAboutSection.querySelector(".collapsedll");

        profileAboutSection.addEventListener("click", () => {
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

        profileExperienceSection.addEventListener("click", () => {
          if (experienceCollapsedSection.classList.contains("collapsedll")) {
            experienceCollapsedSection.classList.remove("collapsedll");
            experienceToggleText.textContent = "See less...";
            experienceToggleArrow.textContent = "▲";
          } else {
            experienceCollapsedSection.classList.add("collapsedll");
            experienceToggleText.textContent = "See more...";
            experienceToggleArrow.textContent = "▼";
          }
        });

        // Adapting yourself code
        if (responseData.adaptingdArrayStatus) {
          document.getElementById("adaptingYourselfBtn").style.display =
            "block";
          document.getElementById("adaptingYourselfDetails").innerHTML =
            responseData.adaptingdArray;
          document.getElementById("adaptingYourselfDetails").style.display =
            "none";
        } else {
          document.getElementById("addYourLinkedIn").style.display = "block";
        }
        document
          .getElementById("adaptingYourselfBtn")
          .addEventListener("click", () => {
            //Toggle
            if (
              document.getElementById("adaptingYourselfDetails").style
                .display === "block"
            ) {
              document.getElementById("adaptingYourselfDetails").style.display =
                "none";
              // change text as well
              document.getElementById("adaptingYourselfBtn").innerText =
                "Click to compare your personality with " +
                responseData.profileName.split(" ")[0];
            } else {
              document.getElementById("adaptingYourselfDetails").style.display =
                "block";
              // change text as well
              document.getElementById("adaptingYourselfBtn").innerText =
                "Compared to you, " + responseData.profileName + " is";
            }
          });

        /* code for Post Analysis */
        const allPostsDiv = document.getElementById("allPosts");
        const commentsPostsDiv = document.getElementById("commentsPosts");
        const reactionsPostsDiv = document.getElementById("reactionsPosts");

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
            .getElementById("commentsPosts")
            .querySelectorAll(".postll .tagsll");
          allCommentTags.forEach((tagsll) => {
            tagsll.innerHTML = "<div>Comment</div>";
          });

          const allReactionTags = document
            .getElementById("reactionsPosts")
            .querySelectorAll(".postll .tagsll");
          allReactionTags.forEach((tagsll) => {
            tagsll.innerHTML = "<div >Reaction</div>";
          });
        });
      });
  }
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
function showAdaptingDetails() {}

function switchFrameworksTo(selectedPhase) {
  const phaseArray = [
    "outreachPhase",
    "discoveryPhase",
    "followupPhase",
    "negotiationPhase",
    "pricingPhase",
    "productdemoPhase",
  ];

  for (i = 0; i < phaseArray.length; i++) {
    if (selectedPhase == phaseArray[i]) {
      document.getElementById(phaseArray[i]).style.display = "block";
      // console.log("(phaseArray[i]", phaseArray[i]);
    } else {
      document.getElementById(phaseArray[i]).style.display = "none";
    }
  }
}

function getUserName() {
  const fullText = document
    .querySelectorAll("[aria-label^='Google Account:']")[0]
    .getAttribute("aria-label");
  return fullText.substring(fullText.indexOf(":") + 2, fullText.indexOf("("));
}

function copyGif(id) {
  //console.log("copyCalled", id);
  window.getSelection().removeAllRanges();
  let range = document.createRange();
  //let imageElem = document.querySelector(`#img2img`);
  //let imageElem = document.querySelector(id);
  let imageElem = document.getElementById(id);
  // console.log(imageElem);

  range.selectNode(imageElem);
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}

function makeDivDraggable(divId) {
  var drag = new Object();
  drag.obj = document.getElementById(divId);

  drag.obj.addEventListener("mousedown", function (e) {
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

function locateDivPosition(divId) {
  if (
    screen.width >
    document.getElementById(divId).parentNode.parentElement.clientWidth * 1.8
  ) {
    document.getElementById(divId).style.left = "-400px";
  } else {
    if (
      document
        .getElementsByClassName("aSt")[0]
        .classList.contains("revaaloast") &&
      document.getElementsByClassName("aSt")[0].style.width <
        0.78 * screen.width
    ) {
      document.getElementById(divId).style.right = "-400px";
    } else {
      document.getElementById(divId).style.right = "-400px";
      document.getElementsByClassName("aSt")[0].style.width =
        document.getElementsByClassName("aSt")[0].clientWidth - 350 + "px";
      document.getElementsByClassName("aSt")[0].classList.add("revaaloast");
    }
  }
}

function trimLength(str, count) {
  if (str.length > count) {
    return str.substring(0, count - 2) + "..";
  } else return str;
}

const backColorArray = [
  'style="background-color:#FA5971;"',
  'style="background-color:#FC7A56;"',
  'style="background-color:#FFDC65;"',
  'style="background-color:#48D1CB;"',
  'style="background-color:#08A296;"',
  'style="background-color:#B1D9E5;"',
  'style="background-color:#F79E4E;"',
];

function updateLoaderTextEmail(x) {
  if (x > 0 && document.getElementById("loaderTextLL")) {
    setTimeout(updateLoaderTextEmail(x - 1), 5000);
    try {
      if (
        document.getElementById("loaderTextLL").innerText === "Generating..."
      ) {
        document.getElementById("loaderTextLL").innerText = "Validating...";
      } else if (
        document.getElementById("loaderTextLL").innerText === "Validating..."
      ) {
        document.getElementById("loaderTextLL").innerText = "Optimizing...";
      } else {
        document.getElementById("loaderTextLL").innerText = "Optimizing...";
      }
    } catch (err) {
      //console.log("updateLoaderTextEmail - couldnt find loaderTextLL");
    }
  }
}

function closerevaaloLL() {
  //console.log("close called");
  document.getElementById("revaaloLL").style.display = "none";
}

function getScoreColor(score) {
  if (score === "Poor") {
    return "ratingred";
  }
  if (score === "Moderate") {
    return "ratingyellow";
  } else {
    return "ratinggreen";
  }
}

const popupCenter = ({ url, title, w, h }) => {
  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  const newWindow = window.open(
    url,
    title,
    `
    scrollbars=yes,
    width=${w / systemZoom}, 
    height=${h / systemZoom}, 
    top=${top}, 
    left=${left}
    `
  );

  if (window.focus) newWindow.focus();
};
