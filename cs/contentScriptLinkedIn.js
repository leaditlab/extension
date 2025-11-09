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

const salesQuotes = [
  "Let LeadLabs take care of the busywork, so you can focus on real selling.",
  "With LeadLabs, every outreach starts with insight, not guesswork.",
  "Sales magic for the price of your daily latte.",
  "The smartest rep on your team fits right in your browser.",
  "Ready to turn cold leads into warm conversations? LeadLabs has your back.",
  "Close more deals. Stress less. That’s the LeadLabs way.",
  "No more tab overload. Everything you need is right here in LeadLabs.",
  "Say goodbye to stale lists—hello to fresh insights, every time you search.",
  "Work smart, sell smart. LeadLabs handles the rest.",
  "AI-driven sales support, now on demand.",
  "Make your first impression count with AI-personalized messaging.",
  "The only assistant who actually closes deals.",
  "LeadLabs: Where research meets results.",
  "Why guess when you can know? Real-time research with LeadLabs.",
  "The easiest follow-up you’ll ever send—one click, all done.",
  "Start every meeting prepared. LeadLabs brings the notes.",
  "Stay in the zone—LeadLabs handles the details.",
  "Turn outreach into outcomes, every single day.",
  "Smarter research, faster prep, better selling.",
  "No more guessing when to reach out. LeadLabs knows.",
  "Sales workflow, meet turbo mode.",
  "One click, zero hassle, all the sales power you need.",
  "Never miss a beat. LeadLabs keeps your deals moving.",
  "Every message personalized. Every call prepped. Every time.",
  "LeadLabs works the pipeline while you work the room.",
  "Unlock your best sales self with a little AI magic.",
  "Forget the grunt work. Focus on what matters—closing.",
  "The difference between a good day and a great day? LeadLabs.",
  "Automate the small stuff. Celebrate the big wins.",
  "Be everywhere your prospects are—with AI-powered social selling.",
  "Sales superpowers, right in your browser.",
  "LeadLabs: Making cold outreach feel warm.",
  "Work less. Sell more. Seriously.",
  "Ready to win your day? LeadLabs is.",
  "Why wing it when you can win it with LeadLabs?",
  "Meetings, messaging, nurturing—all just got easier.",
  "Research that never sleeps, so you don’t have to.",
  "Your AI sales wingman, always one click away.",
  "Spend less time prepping, more time closing.",
  "The ultimate productivity boost for modern sellers.",
  "From cold outreach to closed deal, LeadLabs is there.",
  "Do what you do best. Let LeadLabs do the rest.",
  "Your personal sales coach, 24/7.",
  "No more manual follow-ups. One click is all it takes.",
  "Find, connect, and win—faster than ever.",
  "Instant insights. Lasting relationships.",
  "Smarter selling starts here.",
  "Fuel for your pipeline, coffee for your soul.",
  "Stay two steps ahead with AI-powered insights.",
  "Say goodbye to sales busywork.",
  "Personalize every outreach without lifting a finger.",
  "Sales made simple, with a sprinkle of AI.",
  "All the tools you need. One price. No headaches.",
  "From prospecting to prepping, LeadLabs covers you.",
  "The best sales tools don’t get in the way—they get you results.",
  "Less friction. More action. That’s the LeadLabs promise.",
  "Research, messaging, follow-up—done for you.",
  "Your deals don’t sleep. Neither does LeadLabs.",
  "AI support so good, you’ll wish you had it sooner.",
  "Everything you need to sell, right where you need it.",
  "Make every outreach count with LeadLabs intelligence.",
  "Stop searching, start selling.",
  "AI messaging tailored to every prospect’s style.",
  "Don’t just work harder—work LeadLabs smart.",
  "Outreach, nurture, close—repeat.",
  "The secret weapon of productive sales teams.",
  "Because your time is better spent selling, not searching.",
  "A follow-up for every deal, even on your busiest days.",
  "LeadLabs: The coffee break your pipeline loves.",
  "Where every message is the right message.",
  "Why do it all when AI can do it better?",
  "Prospecting doesn’t have to be painful.",
  "Sales tools should work for you, not the other way around.",
  "Get in, get prepped, get results.",
  "The fastest way to sales productivity is here.",
  "Research leads, prep meetings, send follow-ups—on autopilot.",
  "Turn data into deals with LeadLabs.",
  "Make every touchpoint a win.",
  "The smarter you sell, the less you stress.",
  "No more stale outreach—every message is fresh.",
  "One click from chaos to closed.",
  "Close more with less effort.",
  "Make your pipeline move with LeadLabs.",
  "Welcome to selling on easy mode.",
  "Say yes to more deals, no to more busywork.",
  "Why struggle when you can LeadLabs?",
  "See the future of sales. Then close it.",
  "Better research. Better results.",
  "Your AI sales assistant, always ready.",
  "Stop tab surfing. Start selling.",
  "Productivity at the speed of AI.",
  "Every follow-up, perfectly timed.",
  "More insights, fewer spreadsheets.",
  "AI that knows your prospects—and your style.",
  "Stay ready. Stay sharp. Stay closing.",
  "From lead to loyal customer—LeadLabs guides you.",
  "Every conversation, tailored and thoughtful.",
  "Elevate every step of your sales process.",
  "AI-powered prep—because meetings matter.",
  "Outreach that feels human. Results that feel magical.",
  "Smarter workflows, stronger relationships.",
  "Effortless personalization, every single time.",
];

function updateLoaderTextProfile() {
  makeDivDraggable("drag-initial-IconLL", "profileCardLL");

  document.getElementById("analyseLL").style.display = "none";
  document.getElementById("centerContainer-ll").style.display = "none";
  const analyseImg = document.getElementById("lead-initial-logo");
  analyseImg.src = chrome.runtime.getURL("assets/full-logo.png");
  const insightItems = document.querySelectorAll(".insight-item");
  let currentInsight = 0;

  document.getElementById("initial-closeLL")?.addEventListener("click", () => {
    const canvasOutput = document.getElementById("profileCardLL");
    if (canvasOutput) {
      canvasOutput.remove();
      if (document.getElementById("analyseLL")) {
        document.getElementById("analyseLL").style.display = "block";
      }
    }
  });

  function processInsightItem(itemIndex) {
    const item = insightItems[itemIndex];
    item.style.display = "flex";
    item.style.marginLeft = "-10px";
    item.style.marginRight = "-10px";

    const descriptions = item.querySelectorAll(".description");
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

      // ✅ Safe insert fix
      if (currentDescription && currentDescription.parentNode === wrapper) {
        wrapper.insertBefore(loader, currentDescription);
      } else {
        wrapper.appendChild(loader);
      }

      wrapper.style.display = "flex";
      if (currentP > 0) lines[currentP - 1].style.display = "block";

      setTimeout(() => {
        if (
          itemIndex === insightItems.length - 1 &&
          currentP === wrappers.length - 1
        ) {
          // ✅ Last item → keep loader
          loader.style.display = "inline-block";
        } else {
          // Normal → replace loader with checkmark
          const checkMark = document.createElement("div");
          checkMark.innerHTML = `
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 9.5C7.48528 9.5 9.5 7.48528 9.5 5C9.5 2.51472 7.48528 0.5 5 0.5C2.51472 0.5 0.5 2.51472 0.5 5C0.5 7.48528 2.51472 9.5 5 9.5Z" fill="#D3E6F0"/>
            </svg>
          `;
          checkMark.style.display = "flex";
          checkMark.style.alignItems = "center";
          loader.replaceWith(checkMark);
        }

        currentP++;
        if (currentP < wrappers.length) {
          wrappers[currentP].style.display = "flex";
        } else {
          clearInterval(interval);

          if (itemIndex !== insightItems.length - 1) {
            // ✅ For first and second item → hide completed
            wrappers.forEach((w) => (w.style.display = "none"));
            lines.forEach((l) => (l.style.display = "none"));

            const signalBadge = item.querySelector(".signal-badge");
            if (signalBadge) {
              const badgeMessages = [
                "Found 11 signals",
                "Merged 74 signals",
                "Found 21 signals",
              ];
              const message = badgeMessages[itemIndex] || "Completed";
              signalBadge.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 14C4.6862 14 2 11.3138 2 8C2 4.6862 4.6862 2 8 2C11.3138 2 14 4.6862 14 8C14 11.3138 11.3138 14 8 14ZM7.4018 10.4L11.6438 6.1574L10.7954 5.309L7.4018 8.7032L5.7044 7.0058L4.856 7.8542L7.4018 10.4Z" fill="#2FA884"/>
                </svg>
                ${message}
              `;
            }

            item.style.marginLeft = "0px";
            item.style.marginRight = "0px";

            // proceed to next insight-item
            setTimeout(() => processInsightItem(itemIndex + 1), 1000);
          }
        }
      }, 140);
    }, 180);
  }

  document.querySelectorAll(".insight-item").forEach((item) => {
    item.style.display = "none";
  });

  processInsightItem(currentInsight);

  const quote = document.querySelector("#quote-ll");
  const author = document.querySelector(".quote-author");
  const patment = document.querySelector("#header-image");

  if (patment) {
    const bgUrl = chrome.runtime.getURL("assets/canvasBackground.png");
    patment.style.backgroundImage = `url('${bgUrl}')`;
    patment.style.backgroundSize = "cover";
    patment.style.backgroundPosition = "center";
    patment.style.backgroundRepeat = "no-repeat";
  }

  if (quote && quote.textContent.trim() === "") {
    const randomIndex = Math.floor(Math.random() * salesQuotes.length);
    const selectedQuote = salesQuotes[randomIndex];
    quote.textContent = `"${selectedQuote}"`;
  }
}

function updateLoaderTextSupport(x) {
  if (x > 0 && document.getElementById("supportingCommentLL")) {
    setTimeout(function () {
      updateLoaderTextSupport(x - 1);
    }, 2000);
    try {
      if (
        document.getElementById("supportingCommentLL").innerText ===
        "Choose a comment tone"
      ) {
        document.getElementById("supportingCommentLL").innerText =
          "Generating...";
      } else if (
        document.getElementById("supportingCommentLL").innerText ===
        "Generating..."
      ) {
        document.getElementById("supportingCommentLL").innerText =
          "Validating...";
      } else if (
        document.getElementById("supportingCommentLL").innerText ===
        "Validating..."
      ) {
        document.getElementById("supportingCommentLL").innerText =
          "Optimizing...";
      }
    } catch (err) {
      //console.log("updateLoaderTextProfile - couldnt find supportingCommentLL");
    }
  }
}

function updateLoaderTextContra(x) {
  //(console.log("--am here--", x))
  if (x > 0 && document.getElementById("contradictoryCommentLL")) {
    setTimeout(function () {
      updateLoaderTextContra(x - 1);
    }, 2000);
    try {
      if (
        document.getElementById("contradictoryCommentLL").innerText ===
        "Choose a comment tone"
      ) {
        document.getElementById("contradictoryCommentLL").innerText =
          "Generating...";
      } else if (
        document.getElementById("contradictoryCommentLL").innerText ===
        "Generating..."
      ) {
        document.getElementById("contradictoryCommentLL").innerText =
          "Validating...";
      } else if (
        document.getElementById("contradictoryCommentLL").innerText ===
        "Validating..."
      ) {
        document.getElementById("contradictoryCommentLL").innerText =
          "Optimizing...";
      }
    } catch (err) {
      // console.log("updateLoaderTextProfile - couldnt find supportingCommentLL");
    }
  }
}

function updateLoaderTextJointheDots(x) {
  if (x > 0 && document.getElementById("joinTheDotsResultLL")) {
    setTimeout(function () {
      updateLoaderTextSupport(x - 1);
    }, 1500);
    try {
      if (document.getElementById("joinTheDotsResultLL").innerText === "") {
        document.getElementById("joinTheDotsResultLL").innerText =
          "Generating...";
      } else if (
        document.getElementById("joinTheDotsResultLL").innerText ===
        "Generating..."
      ) {
        document.getElementById("joinTheDotsResultLL").innerText =
          "Validating...";
      } else if (
        document.getElementById("joinTheDotsResultLL").innerText ===
        "Validating..."
      ) {
        document.getElementById("joinTheDotsResultLL").innerText =
          "Optimizing...";
      }
    } catch (err) {
      //console.log("updateLoaderTextProfile - couldnt find supportingCommentLL");
    }
  }
}

function updatePersona(x) {
  const messages = [
    "Searching Website...",
    "Gathering Information...",
    "Creating Personas...",
    "Finalizing...",
  ];

  if (x > 0 && document.getElementById("loaderTextLL")) {
    // Set the current message based on x
    document.getElementById("loaderTextLL").innerText = messages[4 - x];

    // Keep calling updatePersona until it reaches "Finalizing..."
    setTimeout(function () {
      updatePersona(x - 1);
    }, 3000); // Delay of 3 seconds between each message
  } else if (x === 0 && document.getElementById("loaderTextLL")) {
    // Once x reaches 0, display "Finalizing..." and stop
    document.getElementById("loaderTextLL").innerText = messages[3];
  }
}

function updateSearch(x) {
  const messages = [
    "Searching Website...",
    "Gathering Information...",
    "Creating answer...",
    "Finalizing...",
  ];
  if (x > 0 && document.getElementById("loaderSearch")) {
    // Set the current message based on x
    document.getElementById("loaderSearch").innerText = messages[4 - x];
    // Keep calling updatePersona until it reaches "Finalizing..."
    setTimeout(function () {
      updatePersona(x - 1);
    }, 3000); // Delay of 3 seconds between each message
  } else if (x === 0 && document.getElementById("loaderSearch")) {
    // Once x reaches 0, display "Finalizing..." and stop
    document.getElementById("loaderSearch").innerText = messages[3];
  }
}

function sharedStartString(array) {
  var A = array.concat().sort(),
    a1 = A[0],
    a2 = A[A.length - 1],
    L = a1.length,
    i = 0;
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
  return a1.substring(0, i);
}

function getLinkedInProfile(signatureDelimiter) {
  const selector =
    "div[class='pv-top-card-v2-ctas pv-top-card-v2-ctas__custom']";
  const element = document.querySelector(selector);
  // console.log(element);

  if (element) {
    let emailText = element.innerHTML;
    if (signatureDelimiter && emailText.includes(signatureDelimiter)) {
      emailText = emailText
        .substring(0, emailText.indexOf(signatureDelimiter))
        .trim();
    }
    return element;
  }

  return null;
}

async function generatePostComment(post, type, style, tone) {
  if (type === "support") {
    const htmlloader = await fetch(chrome.runtime.getURL("pages/loader.html"))
      .then((res) => res.text())
      .catch((err) => {
        console.error("Failed to load canvasoutput.html", err);
        return "<div>Error loading output view.</div>";
      });
    document.getElementById("loadersupportingCommentLL").innerHTML = htmlloader;
  } else {
    const htmlloader = await fetch(chrome.runtime.getURL("pages/loader.html"))
      .then((res) => res.text())
      .catch((err) => {
        console.error("Failed to load canvasoutput.html", err);
        return "<div>Error loading output view.</div>";
      });
    document.getElementById("loadercontradictoryCommentLL").innerHTML =
      htmlloader;
  }

  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/linkedin-comment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        html: post,
        type: type,
        tone: tone,
        style: style,
      }),
    }
  );

  const responseData = await response.json();
  //console.log(responseData)
  if (responseData && responseData.body != "Your Trail Has Ended") {
    const btns = document.querySelectorAll(".btn-comment");
    btns.forEach(function (btn) {
      btn.classList.remove("active");
    });
    if (type === "support") {
      document.getElementById("loadersupportingCommentLL").innerHTML = "";
      document.getElementById("supportingCommentLL-title").style.display =
        "block";
      const container = document.getElementById("supportingCommentLL");

      responseData.data.forEach((item) => {
        // Wrapper div
        const commentWrapper = document.createElement("div");
        commentWrapper.className = "comment-output";
        commentWrapper.style.position = "relative"; // for copy button

        // Comment text
        const commentDiv = document.createElement("div");
        commentDiv.innerText = item.supportingComment;
        commentDiv.className = "comment-output";
        commentDiv.style.border = "none";
        // Tags container
        const tagsContainer = document.createElement("div");
        tagsContainer.style.display = "flex";
        tagsContainer.style.flexWrap = "wrap";
        tagsContainer.style.gap = "5px";
        const tagArray = [
          { type: "Sarcasm & Humor", value: "sh" },
          { type: "Insightful", value: "i" },
          { type: "Sarcasm & Humor - Short", value: "shs" },
          { type: "Conversational", value: "c" },
          { type: "Delighted", value: "d" },
        ];
        // Add each tag as separate div
        item.tags.forEach((tag) => {
          const tagDiv = document.createElement("div");
          tagDiv.className = "btl-cls";
          tagDiv.style.textTransform = "capitalize";
          tagDiv.style.borderRadius = "5px";
          // find if tag exists in tagArray
          const matchedTag = tagArray.find((t) => t.value === tag);

          // display type if found, else raw tag
          tagDiv.innerText = matchedTag ? matchedTag.type : tag;

          tagsContainer.appendChild(tagDiv);
        });

        // Copy button
        const copyBtn = document.createElement("button");
        copyBtn.innerText = "Copy";
        copyBtn.className = "copy-btn";
        copyBtn.style.position = "absolute";
        copyBtn.style.right = "5px";
        copyBtn.style.bottom = "5px";
        copyBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(item.supportingComment).then(() => {
            copyBtn.innerText = "Copied!";
            setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
          });
        });

        // append elements
        commentWrapper.appendChild(commentDiv);
        commentWrapper.appendChild(tagsContainer);
        commentWrapper.appendChild(copyBtn);

        container.prepend(commentWrapper);
      });

      //store current input in commentRefreshLL for refresh
      document.getElementById("commentRefreshLL").innerText = JSON.stringify({
        post: post,
        type: type,
        tone: tone,
        style: style,
      });
    } else {
      document.getElementById("loadercontradictoryCommentLL").innerHTML = "";
      document.getElementById("contradictoryCommentLL-title").style.display =
        "block";
      const container = document.getElementById("contradictoryCommentLL");
      responseData.data.forEach((item) => {
        // Wrapper div
        const commentWrapper = document.createElement("div");
        commentWrapper.className = "comment-output";
        commentWrapper.style.position = "relative"; // for copy button

        // Comment text
        const commentDiv = document.createElement("div");
        commentDiv.innerText = item.contradictoryComment;
        commentDiv.className = "comment-output";
        commentDiv.style.border = "none";
        // Tags container
        const tagsContainer = document.createElement("div");
        tagsContainer.style.display = "flex";
        tagsContainer.style.flexWrap = "wrap";
        tagsContainer.style.gap = "5px";
        const tagArray = [
          { type: "Sarcasm & Humor", value: "sh" },
          { type: "Insightful", value: "i" },
          { type: "Sarcasm & Humor - Short", value: "shs" },
          { type: "Conversational", value: "c" },
          { type: "Delighted", value: "d" },
        ];
        // Add each tag as separate div
        item.tags.forEach((tag) => {
          const tagDiv = document.createElement("div");
          tagDiv.className = "btl-cls";
          tagDiv.style.textTransform = "capitalize";
          tagDiv.style.borderRadius = "5px";
          // find if tag exists in tagArray
          const matchedTag = tagArray.find((t) => t.value === tag);

          // display type if found, else raw tag
          tagDiv.innerText = matchedTag ? matchedTag.type : tag;

          tagsContainer.appendChild(tagDiv);
        });

        // Copy button
        const copyBtn = document.createElement("button");
        copyBtn.innerText = "Copy";
        copyBtn.className = "copy-btn";
        copyBtn.style.position = "absolute";
        copyBtn.style.right = "5px";
        copyBtn.style.bottom = "5px";
        copyBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(item.comment).then(() => {
            copyBtn.innerText = "Copied!";
            setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
          });
        });

        // append elements
        commentWrapper.appendChild(commentDiv);
        commentWrapper.appendChild(tagsContainer);
        commentWrapper.appendChild(copyBtn);

        container.prepend(commentWrapper);
      });

      //store current input in commentRefreshLL for refresh
      document.getElementById("commentRefreshLL").innerText = JSON.stringify({
        post: post,
        type: type,
        tone: tone,
        style: style,
      });
    }
  } else if (responseData && responseData.body == "Your Trail Has Ended") {
    fetch(chrome.runtime.getURL("pages/trailend.html"))
      .then((r) => r.text())
      .then((html) => {
        document.getElementById("commentCardwrapperLL").innerHTML = html;
        const trailLink = document.getElementById("trail-link-ll");
        if (trailLink) {
          trailLink.href = responseData.url;
        }
        document
          .getElementById("closeTrailLL")
          .addEventListener("click", () => {
            document.getElementById("commentCardwrapperLL").style.display =
              "none";
          });
      });
  }
}

function getActiveToneSupport() {
  if (document.getElementById("supportformal").classList.contains("active")) {
    return "formal";
  } else if (
    document.getElementById("supportneutral").classList.contains("active")
  ) {
    return "neautral";
  } else if (
    document.getElementById("supportcasual").classList.contains("active")
  ) {
    return "casual";
  } else return "formal";
}

function getActiveToneContra() {
  if (document.getElementById("contraformal").classList.contains("active")) {
    return "formal";
  } else if (
    document.getElementById("contraneutral").classList.contains("active")
  ) {
    return "neautral";
  } else if (
    document.getElementById("contracasual").classList.contains("active")
  ) {
    return "casual";
  } else return "formal";
}

async function addCommentButton() {
  const Commentboxes = document.querySelectorAll(".linkedinLLComments");
  Commentboxes.forEach((box) => {
    box.remove();
  });

  var posts = document.getElementsByClassName("feed-shared-social-action-bar");
  for (i = 0; i < posts.length; i++) {
    const commentItem = document.createElement("div");
    commentItem.classList.add("linkedinLLComments");
    commentItem.style.display = "flex";
    //commentItem.style.cursor = "pointer";

    commentItem.innerHTML = `
      <div style="margin:auto; font-size:12px; padding: 7px 20px; font-weight:600; width: 100%;">
          Generate Comment with LeadLabs AI
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3946 9.19922C13.3959 9.40308 13.334 9.60233 13.2173 9.76955C13.1007 9.93676 12.9351 10.0637 12.7434 10.133L9.51525 11.3205L8.32776 14.5461C8.25743 14.7371 8.1302 14.902 7.96323 15.0185C7.79626 15.1349 7.59758 15.1974 7.39401 15.1974C7.19043 15.1974 6.99175 15.1349 6.82478 15.0185C6.65781 14.902 6.53058 14.7371 6.46026 14.5461L5.26963 11.3242L2.04338 10.1367C1.85234 10.0664 1.68746 9.93917 1.571 9.77219C1.45453 9.60522 1.39209 9.40654 1.39209 9.20297C1.39209 8.99939 1.45453 8.80072 1.571 8.63374C1.68746 8.46677 1.85234 8.33954 2.04338 8.26922L5.27151 7.08172L6.45901 3.85609C6.52933 3.66505 6.65656 3.50017 6.82353 3.38371C6.9905 3.26725 7.18918 3.2048 7.39276 3.2048C7.59633 3.2048 7.79501 3.26725 7.96198 3.38371C8.12895 3.50017 8.25618 3.66505 8.32651 3.85609L9.51401 7.08422L12.7396 8.27172C12.9311 8.33998 13.0968 8.46573 13.214 8.63175C13.3312 8.79778 13.3943 8.99597 13.3946 9.19922ZM9.89463 3.19922H10.8946V4.19922C10.8946 4.33183 10.9473 4.459 11.0411 4.55277C11.1348 4.64654 11.262 4.69922 11.3946 4.69922C11.5272 4.69922 11.6544 4.64654 11.7482 4.55277C11.842 4.459 11.8946 4.33183 11.8946 4.19922V3.19922H12.8946C13.0272 3.19922 13.1544 3.14654 13.2482 3.05277C13.342 2.959 13.3946 2.83183 13.3946 2.69922C13.3946 2.56661 13.342 2.43943 13.2482 2.34567C13.1544 2.2519 13.0272 2.19922 12.8946 2.19922H11.8946V1.19922C11.8946 1.06661 11.842 0.939434 11.7482 0.845665C11.6544 0.751897 11.5272 0.699219 11.3946 0.699219C11.262 0.699219 11.1348 0.751897 11.0411 0.845665C10.9473 0.939434 10.8946 1.06661 10.8946 1.19922V2.19922H9.89463C9.76202 2.19922 9.63484 2.2519 9.54108 2.34567C9.44731 2.43943 9.39463 2.56661 9.39463 2.69922C9.39463 2.83183 9.44731 2.959 9.54108 3.05277C9.63484 3.14654 9.76202 3.19922 9.89463 3.19922ZM15.3946 5.19922H14.8946V4.69922C14.8946 4.56661 14.842 4.43943 14.7482 4.34567C14.6544 4.2519 14.5272 4.19922 14.3946 4.19922C14.262 4.19922 14.1348 4.2519 14.0411 4.34567C13.9473 4.43943 13.8946 4.56661 13.8946 4.69922V5.19922H13.3946C13.262 5.19922 13.1348 5.2519 13.0411 5.34567C12.9473 5.43943 12.8946 5.56661 12.8946 5.69922C12.8946 5.83183 12.9473 5.959 13.0411 6.05277C13.1348 6.14654 13.262 6.19922 13.3946 6.19922H13.8946V6.69922C13.8946 6.83183 13.9473 6.959 14.0411 7.05277C14.1348 7.14654 14.262 7.19922 14.3946 7.19922C14.5272 7.19922 14.6544 7.14654 14.7482 7.05277C14.842 6.959 14.8946 6.83183 14.8946 6.69922V6.19922H15.3946C15.5272 6.19922 15.6544 6.14654 15.7482 6.05277C15.842 5.959 15.8946 5.83183 15.8946 5.69922C15.8946 5.56661 15.842 5.43943 15.7482 5.34567C15.6544 5.2519 15.5272 5.19922 15.3946 5.19922Z" fill="#5B5BD6"/>
          </svg>
          <button class="commentLL" style="float:right; border: 1px solid #5B5BD6; padding: 7px 10px; border-radius: 5px; color: #5B5BD6;" >
            Comment
          </button>
      </div>
`;
    posts[i].parentNode.parentElement.appendChild(commentItem);
  }

  var elements = document.getElementsByClassName("linkedinLLComments");

  var myFunction = function () {
    let checkPostClassName = ".feed-shared-update-v2__description";

    // Locate the parent element
    const parentElement = this.parentNode.parentElement;

    // Check if the class exists in the DOM
    let postDiv = parentElement.querySelector(checkPostClassName);

    if (!postDiv) {
      // If postDiv is null, resolve the correct class name
      checkPostclassNameFunction("commentBotton", checkPostClassName)
        .then((resolvedValue) => {
          postDiv = this.parentNode.parentElement.querySelector(resolvedValue);
          if (postDiv.innerHTML !== null) {
            showPostComment(postDiv.innerHTML);
          }
          if (postDiv?.innerHTML) {
            showPostComment(postDiv.innerHTML);
          }
        })
        .catch((error) => {
          console.error("Error resolving checkPostclassNameFunction:", error);
        });
    } else {
      // If postDiv exists, handle it directly
      if (postDiv.innerHTML) {
        showPostComment(postDiv.innerHTML);
      }
    }
  };

  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", myFunction, false);
  }
}

function logVisiblePostContent() {
  function getVisiblePosts() {
    const posts = document.querySelectorAll(".feed-shared-update-v2");
    let visiblePosts = [];

    posts.forEach((post) => {
      const rect = post.getBoundingClientRect();
      const visibleHeight =
        Math.min(window.innerHeight, rect.bottom) - Math.max(0, rect.top);

      if (visibleHeight > 0) {
        let descriptionElement = post.querySelector(
          ".feed-shared-update-v2__description"
        );
        let postText = descriptionElement
          ? descriptionElement.innerText.trim()
          : "";
        postText = postText.replace("…more", "").trim();
        let postHTML = descriptionElement ? descriptionElement.innerHTML : "";
        postHTML = postHTML.replace("…more", "").trim();
        if (postHTML !== "" && postText !== "") {
          visiblePosts.push({
            text: postText,
            html: postHTML,
          });
        }
      }
    });

    if (visiblePosts.length > 0) {
      let commentCard = document.getElementById("commentCardwrapperLL");
      let displayStaus;
      if (commentCard) {
        displayStaus = "block";
      } else {
        displayStaus = "none";
      }
      showPostComment(visiblePosts.slice(0, 3), displayStaus);
    }
  }

  // Throttle function to prevent excessive calls on scroll
  function throttle(func, delay) {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }

  window.addEventListener("scroll", throttle(getVisiblePosts, 300));
}

async function showPostComment(visiblePosts, displayStaus) {
  let commentCard = document.getElementById("commentCardwrapperLL");
  let isFirstTimeRendering = false;

  if (!commentCard) {
    isFirstTimeRendering = true;
    commentCard = document.createElement("div");
    commentCard.id = "commentCardwrapperLL";
    Object.assign(commentCard.style, {
      position: "fixed",
      zIndex: 100,
      top: "8vh",
      right: "0px",
      backgroundColor: "#FFFFFF",
      width: "30%",
      overflow: "auto",
      height: "80vh",
      borderRadius: "10px",
    });
    if (displayStaus !== undefined) {
      commentCard.style.display = displayStaus;
    }
    //on scroll the div is getting appended so based on the display status I am append the data
    //on close if we do scroll then the sidepopup is opening so here If id is present then the we are sending dislpay status as block else none

    if (displayStaus !== "none") {
      document.body.appendChild(commentCard);
      //as ShowPostComment function calling many times, multiple Draggable is happening,
      //so here we are calling function only once when the id is appending
    }
    const html = await fetch(chrome.runtime.getURL("pages/comment.html")).then(
      (r) => r.text()
    );
    //if comment page is already there then do not need to set html page
    let commentCardLL = document.getElementById("commentCardLL");
    if (!commentCardLL) {
      commentCard.innerHTML = html;
    }

    //as ShowPostComment function calling many times, multiple Draggable is happening,
    //so here we are calling function only once when the id is appending

    makeDivDraggable("drag-comment-IconLL", "commentCardwrapperLL");

    document.getElementById("analyseLL").style.display = "none";
    document.getElementById("centerContainer-ll").style.display = "none";
    const analyseImg = document.getElementById("lead-comment-logo");
    analyseImg.src = chrome.runtime.getURL("assets/full-logo.png");
    // Set up event listeners only once when the component is first created
    setupEventListeners();

    // If we're just initializing the component without posts, return early
    if (!visiblePosts || visiblePosts.length === 0) {
      return;
    }
  }

  let postWarning = document.getElementById("postWarning");
  let postHeading = document.getElementById("postHeading");
  const postLL = document.getElementById("postcontent");
  postLL.innerHTML = "";

  // Move selectedDiv to a higher scope or use a more persistent approach
  // We'll use a data attribute on the comment card to track the selected post
  commentCard.selectedDiv = null;

  if (visiblePosts && visiblePosts.length > 0) {
    postWarning.style.display = "none";
    postHeading.style.display = "block";
    visiblePosts.forEach((post) => {
      // Main wrapper div
      const mainDiv = document.createElement("div");
      mainDiv.className = "collapsedll-posts";
      mainDiv.style.height = "80px";
      mainDiv.style.overflow = "hidden";
      mainDiv.style.border = "1px #eceaef solid";
      mainDiv.style.borderRadius = "5px";
      // Post item div
      const postDiv = document.createElement("div");
      postDiv.className = "post-item";
      postDiv.innerText = `${post.text}`;
      postDiv.style.padding = "10px";
      postDiv.style.height = "160px";
      postDiv.style.overflowY = "scroll";
      postDiv.style.cursor = "pointer";

      postDiv.style.margin = "5px 0";
      // "See More" div (placed separately)
      const seeMoreDiv = document.createElement("div");
      seeMoreDiv.className = "view-more";
      seeMoreDiv.innerText = "See more...";
      seeMoreDiv.style.cursor = "pointer";
      seeMoreDiv.style.color = "gray";

      // Selection behavior
      mainDiv.addEventListener("click", () => {
        const allPosts = document.querySelectorAll(".collapsedll-posts");
        allPosts.forEach((post) => {
          post.style.border = "1px #eceaef solid";
        });
        mainDiv.style.border = "1px solid rgb(97, 190, 82)";
        commentCard.selectedDiv = mainDiv;
      });

      // Append elements
      mainDiv.appendChild(postDiv);
      postLL.appendChild(mainDiv); // Append mainDiv first
      postLL.appendChild(seeMoreDiv); // Append "See More" div separately
    });
  } else {
    postWarning.style.display = "block";
    postHeading.style.display = "none";
  }

  // Function to set up all event listeners (will be called only once)
  function setupEventListeners() {
    const addClickListener = (id, handler) => {
      const element = document.getElementById(id);
      if (element) {
        element.removeEventListener("click", handler); // Remove any existing listener
        element.addEventListener("click", handler);
      }
    };

    // Close button event listener
    addClickListener("comment-closeLL", () => {
      const commentCardWrapper = document.getElementById(
        "commentCardwrapperLL"
      );
      document.getElementById("analyseLL").style.display = "flex";
      if (commentCardWrapper) {
        commentCardWrapper.remove();
      }
    });
    addClickListener("main-comment-back-ll", () => {
      const commentCardWrapper = document.getElementById(
        "commentCardwrapperLL"
      );
      document.getElementById("analyseLL").style.display = "flex";
      if (commentCardWrapper) {
        commentCardWrapper.remove();
      }
    });

    const toggleActive = (clickedId, groupIds) => {
      document.getElementById(clickedId)?.classList.add("active");
      groupIds.forEach((id) =>
        document.getElementById(id)?.classList.remove("active")
      );
    };

    [
      ["supportformal", ["supportneutral", "supportcasual"]],
      ["supportneutral", ["supportformal", "supportcasual"]],
      ["supportcasual", ["supportneutral", "supportformal"]],
      ["contraformal", ["contraneutral", "contracasual"]],
      ["contraneutral", ["contraformal", "contracasual"]],
      ["contracasual", ["contraneutral", "contraformal"]],
    ].forEach(([id, group]) =>
      addClickListener(id, () => toggleActive(id, group))
    );

    const commentButtons = [
      { id: "supportsh", type: "support", value: "sh" },
      { id: "supporti", type: "support", value: "i" },
      { id: "supportshs", type: "support", value: "shs" },
      { id: "supportc", type: "support", value: "c" },
      { id: "supportd", type: "support", value: "d" },
      { id: "contrash", type: "contra", value: "sh" },
      { id: "contrai", type: "contra", value: "i" },
      { id: "contrashs", type: "contra", value: "shs" },
    ];

    commentButtons.forEach(({ id, type, value }) => {
      addClickListener(id, () => {
        const commentCard = document.getElementById("commentCardwrapperLL");
        if (!commentCard.selectedDiv) {
          showNotificationComment("Please select a post!", "warning");
        } else {
          generatePostComment(
            commentCard.selectedDiv.innerHTML,
            type,
            value,
            type === "support" ? getActiveToneSupport() : getActiveToneContra()
          );
        }
      });
    });

    addClickListener(
      "supportBlockLL",
      () =>
        (document.getElementById("supportCommentBlockLL").style.display =
          "flex")
    );
    addClickListener(
      "contraBlockLL",
      () =>
        (document.getElementById("contraCommentBlockLL").style.display = "flex")
    );
  }
}

function setActiveTone(activeId, allIds) {
  allIds.forEach((id) => {
    document.getElementById(id).classList.toggle("active", id === activeId);
  });
}
function showNotificationComment(text, color) {
  const notification = document.getElementById("notification-comment-ll");

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

async function showProfileSummary(
  post,
  profileName,
  linkdinUrl,
  linkdinImage,
  linkdinDesc,
  companyUrls,
  ownProfile,
  displayStatus,
  reanalysestatus
) {
  //this function is for the create workflow answer API
  //we need to call this api only when side popup is opening
  //not on window popup. because we are calling this API while opening the window popup also,
  //so we are passing the display status and based on that we are opening the

  let { userToken } = await chrome.storage.local.get(["userToken"]);

  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/linkedin-profile-main",
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
        reanalysestatus: reanalysestatus,
      }),
    }
  );

  const responseData = await response.json();

  // console.log(responseData);
  if (responseData && responseData.body != "Your Trail Has Ended") {
    //this is to remove loader once we get response only when that tab is active else will contitue the code exce
    const prospectTab = document.getElementById("prospect-click");
    const prospectSub = document.getElementById("prospect-sub-ll");

    if (prospectTab.classList.contains("active")) {
      prospectSub.style.display = "block";
      document.getElementById("prospect-sub-loader-ll").innerHTML = "";
    }
    document.getElementById("analyseLL").style.display = "none";
    document.getElementById("centerContainer-ll").style.display = "none";
    if (document.getElementById("pop-up-instruction")) {
      document.getElementById("pop-up-instruction").style.display = "none";
    }

    if (responseData?.updatedtime !== "") {
      document.getElementById("last-run-time").innerHTML = timeAgo(
        responseData?.updatedtime
      );
    }
    // data populations
    document.getElementById("profileD").innerText = responseData.data.Dominance;
    document.getElementById("profileI").innerText = responseData.data.Influence;
    document.getElementById("profileS").innerText =
      responseData.data.Steadiness;
    document.getElementById("profileC").innerText =
      responseData.data.Conscientiousness;
    document.getElementById("personality").innerText =
      responseData.data.PersonalityType;
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

    document.getElementById("tags").innerHTML =
      `<div class="font-family-ll">
          A <span style="font-weight:600" class="font-family-ll">${responseData.data.PersonalityType}</span>
          <span style="font-weight:500" class="font-family-ll"> (${description}) </span> profile represents:
        </div>` + responseData.tags;

    const personalityImg = document.getElementById("personality-img");

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

    // Call the function for each
    appendAttributesToContainer(
      responseData.data.Likes,
      "profileLikes",
      "Like",
      "profileCardLL"
    );
    appendAttributesToContainer(
      responseData.data.Dislikes,
      "profileDislikes",
      "Dislike",
      "profileCardLL"
    );
    appendAttributesToContainer(
      responseData.data.InterestedTopics,
      "profileInterestedTopics",
      "Interest",
      "profileCardLL"
    );
    const modifiedHTML = addClassToMainDiv(
      responseData.data.IceBreakers,
      "postll personal-attribute"
    );
    document.getElementById("profileIceBrakers").innerHTML = modifiedHTML;

    const profileProblems = addClassToMainDiv(
      responseData.data.ProbableProblems,
      "postll personal-attribute"
    );
    document.getElementById("profileProblems").innerHTML = profileProblems;
    // document.getElementById("profileProblems").innerHTML =
    //   responseData.data.ProbableProblems;

    if (responseData.hubspotIntegration === true) {
      document.getElementById("displayhubspot").style.display = "block";
      document
        .getElementById("displayhubspot")
        .addEventListener("click", () => {
          getSearchHubspot(getLinkedInURL(), "profileCardLL");
        });
    }

    if (
      responseData.experience === "" ||
      responseData.experience === null ||
      responseData.experience === undefined
    ) {
      callExperineceOnceAgain("profileCardLL");
    } else {
      addExperinceFunction(responseData.experience, "profileCardLL");

      // Experience Section Toggle and adding the click event

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
    // Render the profile section
    document.getElementById("profiletitlell").innerHTML =
      '<div class="profileblockll">' +
      '<img src="' +
      responseData.profileImage +
      '" alt="profile image">' +
      "<div>" +
      responseData.profileName +
      '<div style="margin-bottom:10px; font-size:14px; font-weight: 550;">' +
      "Personality Type (<i>" +
      responseData.data.PersonalityType +
      "</i>)</div>" +
      "<div>" +
      '<div id="profileActiveTimeSection"></div>' +
      "</div>" +
      "</div>";
    document.getElementById("profileAboutSection").innerHTML = `
            <h6 class="h5ll"><svg class="icon-inline" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V11C0 11.2652 0.105357 11.5196 0.292893 11.7071C0.48043 11.8946 0.734784 12 1 12H11C11.2652 12 11.5196 11.8946 11.7071 11.7071C11.8946 11.5196 12 11.2652 12 11V1C12 0.734784 11.8946 0.48043 11.7071 0.292893C11.5196 0.105357 11.2652 0 11 0ZM4 5.5C4 5.10444 4.1173 4.71776 4.33706 4.38886C4.55682 4.05996 4.86918 3.80362 5.23463 3.65224C5.60009 3.50087 6.00222 3.46126 6.39018 3.53843C6.77814 3.6156 7.13451 3.80608 7.41421 4.08579C7.69392 4.36549 7.8844 4.72186 7.96157 5.10982C8.03874 5.49778 7.99913 5.89991 7.84776 6.26537C7.69638 6.63082 7.44004 6.94318 7.11114 7.16294C6.78224 7.3827 6.39556 7.5 6 7.5C5.46957 7.5 4.96086 7.28929 4.58579 6.91421C4.21071 6.53914 4 6.03043 4 5.5ZM2.29187 11C2.54774 10.3701 2.95909 9.81532 3.4875 9.3875C4.19895 8.81319 5.08568 8.49995 6 8.49995C6.91432 8.49995 7.80105 8.81319 8.5125 9.3875C9.04091 9.81532 9.45226 10.3701 9.70813 11H2.29187ZM11 11H10.7706C10.5483 10.2923 10.1711 9.643 9.66645 9.09931C9.16179 8.55562 8.54235 8.1312 7.85312 7.85688C8.34379 7.47147 8.70208 6.94267 8.87812 6.34409C9.05415 5.74551 9.03918 5.10693 8.83528 4.51726C8.63138 3.92759 8.24871 3.41616 7.74052 3.05417C7.23233 2.69219 6.62393 2.49765 6 2.49765C5.37607 2.49765 4.76766 2.69219 4.25948 3.05417C3.75129 3.41616 3.36861 3.92759 3.16472 4.51726C2.96082 5.10693 2.94585 5.74551 3.12188 6.34409C3.29792 6.94267 3.65621 7.47147 4.14687 7.85688C3.45765 8.1312 2.83821 8.55562 2.33355 9.09931C1.82889 9.643 1.45169 10.2923 1.22937 11H1V1H11V11Z" fill="#292E30"/>
</svg>
 About </h6>
            <div class="collapsedll">${responseData.about}</div>
            <span id="toggleArrowll">▼</span>
            <span id="toggleTextll">See more...</span>
          `;
    document.getElementById("personality-user-data").innerHTML =
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
    if (responseData?.activetime.length > 0) {
      changeActiveTime(responseData?.activetime, "profileCardLL");
    } else {
      const time = await addActiveTimings(true, true);
      if (time) {
        changeActiveTime(time, "profileCardLL");
      }
    }
    //displaying the responsibility
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
  <h6 class="h5ll"><svg class="icon-inline" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    const container = document.getElementById("profileRolesAndResp");
    if (container) {
      container.innerHTML = rolesHTML;
    }

    // update name and profile type in generate content page.
    document.getElementById("profileNameGenerateContent").innerText =
      responseData.profileName;
    document.getElementById("profileTypeGenerateContent").innerText =
      responseData.data.PersonalityType;
    document.getElementById(
      "profileNameGenerateContentfine"
    ).innerText = `Fine tune a message for ${responseData.profileName}`;

    // document.getElementById(
    //   "generateTalkingPoints"
    // ).textContent = `Generate talking point for ${responseData.profileName}`;

    document.getElementById(
      "persona-header-talking"
    ).innerText = `What is  ${responseData.profileName}'s persona?`;

    document.getElementById("profileTypeGenerateContentfine").innerText =
      responseData.data.PersonalityType;

    document.getElementById("profileSuccess").innerHTML = responseData.success;
    document.getElementById("profileEmail").innerHTML = responseData.emails;
    document.getElementById("profileSpeak").innerHTML = responseData.speaking;
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
    const profileAboutSection = document.getElementById("profileAboutSection");
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

    const profileRolesAndResp = document.getElementById("profileRolesAndResp");
    const respToggleText = document.getElementById("respToggleTextll");
    const respToggleArrow = document.getElementById("respToggleArrowll");
    const respCollapsedSection = document.getElementById(
      "respCollapsedSection"
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

    // Attach click event only to toggle elements
    respToggleText.addEventListener("click", toggleRespSection);
    respToggleArrow.addEventListener("click", toggleRespSection);

    showContentPost(responseData.linkedInPost);
    isProfileAnalysiedTwo(responseData.linkedInPost);

    /* End of code for Post Analysis */
    // updateTimeAgoInAllPosts(null, responseData.postupdatedtime);
    responseData?.linkedInPost.forEach((post) => {
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
  } else if (responseData && responseData.body == "Your Trail Has Ended") {
    fetch(chrome.runtime.getURL("pages/trailend.html"))
      .then((r) => r.text())
      .then((html) => {
        document.getElementById("profileCardLL").innerHTML = html;
        document.getElementById("analyseLL").style.display = "none";
        document.getElementById("centerContainer-ll").style.display = "none";
        const trailLink = document.getElementById("trail-link-ll");
        if (trailLink) {
          trailLink.href = responseData.url;
        }
        document
          .getElementById("closeTrailLL")
          .addEventListener("click", () => {
            document.getElementById("profileCardLL").style.display = "none";
          });
      });
  }
}
async function showProfileSummaryShort(
  post,
  profileName,
  linkdinUrl,
  linkdinImage,
  linkdinDesc,
  companyUrls,
  ownProfile,
  displayStatus,
  reanalysestatus
) {
  const removeElement = document.querySelectorAll("#profileCardLL");
  for (var i = 0; i < removeElement.length; i++) {
    removeElement[i].remove();
  }

  //this function is for the create workflow answer API
  //we need to call this api only when side popup is opening
  //not on window popup. because we are calling this API while opening the window popup also,
  //so we are passing the display status and based on that we are opening the
  if (displayStatus !== "none") {
    await callWorkflow();
  }
  const profileCard = document.createElement("div");
  profileCard.id = "profileCardLL";
  profileCard.className = "profileCardLL";
  if (displayStatus === "none") {
    profileCard.style.display = "none";
  } else {
    profileCard.style.display = "flex";
  }

  profileCard.style.position = "fixed";
  profileCard.style.flexDirection = "column";
  profileCard.style.zIndex = 100;
  profileCard.style.top = "7vh";
  profileCard.style.right = "0px";
  profileCard.style.backgroundColor = "#FFFFFF";
  profileCard.style.width = "34%";
  //profileCard.style.overflow="auto";
  profileCard.style.height = "85vh";
  profileCard.style.borderRadius = "5px";
  profileCard.style.minWidth = "430px";

  document.getElementById("profile-content").appendChild(profileCard);
  let { userToken } = await chrome.storage.local.get(["userToken"]);

  if (selectedCanvasId) {
    if (displayStatus !== "none") {
      document.getElementById("profileCardLL").style.display = "none";
      await executeCanvas(selectedCanvasId, "", userToken, linkdinUrl, false);
      if (document.getElementById("canvasOutputCardwrapperLL")) {
        document.getElementById("canvasOutputCardwrapperLL").style.display =
          "block";
      }
    }
  } else {
    //loader
    fetch(chrome.runtime.getURL("pages/initialLoader.html"))
      .then((r) => r.text())
      .then((html) => {
        document.getElementById("profileCardLL").innerHTML = html;
        document.getElementById("analyseLL").style.display = "none";
        document.getElementById("centerContainer-ll").style.display = "none";
        updateLoaderTextProfile(4);
      });
  }

  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/linkedin-profile-main-short",
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
        reanalysestatus: reanalysestatus,
      }),
    }
  );
  showProfileSummary(
    post,
    profileName,
    linkdinUrl,
    linkdinImage,
    linkdinDesc,
    companyUrls,
    ownProfile,
    displayStatus,
    reanalysestatus
  );

  const responseData = await response.json();

  if (responseData && responseData.body != "Your Trail Has Ended") {
    fetch(chrome.runtime.getURL("pages/profile.html"))
      .then((r) => r.text())
      .then(async (html) => {
        document.getElementById("profileCardLL").innerHTML = html;
        document.getElementById("analyseLL").style.display = "none";
        document.getElementById("centerContainer-ll").style.display = "none";
        if (document.getElementById("pop-up-instruction")) {
          document.getElementById("pop-up-instruction").style.display = "none";
        }
        document.getElementById("closeLL").addEventListener("click", () => {
          document.getElementById("profileCardLL").style.display = "none";
          chrome.storage.local.get("minimizeStatus", function (result) {
            const minimizeStatus = result?.minimizeStatus;
            if (minimizeStatus === "small") {
              document.getElementById("minimizeContainer").style.display =
                "flex";
            } else if (minimizeStatus === "center") {
              document.getElementById("centerContainer-ll").style.display =
                "block";
            } else {
              document.getElementById("analyseLL").style.display = "flex";
            }
            document.getElementById("canvas-list-bigCard").style.display =
              "none";
            document.getElementById("getCanvas").style.display = "block";
            document.getElementById("button-container-ll").style.display =
              "block";
            document.getElementById(
              "Previous-actions-cantainer-ll"
            ).style.display = "block";
            document.getElementById("profile-footer-ll").style.display =
              "block";
          });

          callNano();
          callPerivausAction(getLinkedInURL());
          runCanvas(getLinkedInURL(), "getCanvas");
          runCanvas(getLinkedInURL(), "canvas-list-container-ll");
          runCanvas(getLinkedInURL(), "get-canvas-center");
          runCanvas(getLinkedInURL(), "get-canvas-center-list");
        });
        runCanvas(getLinkedInURL(), "canvas-in-main");
        document
          .getElementById("close-canvas-main-ll")
          .addEventListener("click", () => {
            document.getElementById(
              "canvas-cantainer-in-main-card"
            ).style.display = "none";
          });
        //this function make the card big when user click on the any button inside the card
        makeCardBig();
        document
          .getElementById("main-back-ll")
          .addEventListener("click", () => {
            document.getElementById("profileCardLL").style.display = "none";
            document.getElementById("analyseLL").style.display = "flex";
            callNano();
            callPerivausAction(getLinkedInURL());
            runCanvas(getLinkedInURL(), "getCanvas");
            runCanvas(getLinkedInURL(), "canvas-list-container-ll");
            runCanvas(getLinkedInURL(), "get-canvas-center");
            runCanvas(getLinkedInURL(), "get-canvas-center-list");
          });
        if (profileCard) {
          makeDivDraggable("dragIconLL", "profileCardLL");
        }
        let linkedIn = getLinkedInURL();

        loadEmailCreationScript(linkedIn);
        loadPersonaScript();
        loadAllParsonas("profileCardLL");
        loadAllCustomQuestion("profileCardLL", linkedIn);
        signalSetting("profileCardLL", linkedIn);

        frameWorkSetting("profileCardLL", linkedIn);
        loadCanvasScript("profileCardLL", linkedIn);
        loadSearch(linkedIn);
        //as for the new UI I have no navbar so on click we set the global varibale
        //based on that we will open the perticular tab
        if (clickID === "search") {
          await previewSearch();
          document.getElementById("page-header-text").innerText = "Ask Ai";
          document.getElementById("page-header-actions").style.display = "none";
          clickID = "";
        } else if (clickID === "parsonaListing") {
          await previewPersonalaListing();
          document.getElementById("page-header-text").innerText = "Settings";
          document.getElementById("page-header-actions").style.display = "none";
          clickID = "";
        } else if (clickID === "canvasOpen") {
          await previewCanvas();
          const canvasBtn = document.getElementById("create-canvas-button");
          if (canvasBtn) {
            canvasBtn.click();
          }
          clickID = "";
          document.getElementById("page-header-text").innerText = "Canvas";
          document.getElementById("page-header-actions").style.display = "none";
        } else if (editDeleteCanvasId) {
          await previewCanvas();
          document.getElementById("page-header-text").innerText = "Canvas";
          document.getElementById("page-header-actions").style.display = "none";
          if (deleteCanvasStatus) {
            deleteCanvasFromStartCard(editDeleteCanvasId);
          } else {
            editCanvas(editDeleteCanvasId);
          }
          editDeleteCanvasId = "";
          deleteCanvasStatus = false;
        } else {
          document.getElementById("page-header-text").innerText = "Insight";
          document.getElementById("page-header-actions").style.display = "flex";
        }

        document
          .getElementById("settingProfile")
          .addEventListener("click", function () {
            document.getElementById("page-header-actions").style.display =
              "none";
            previewPersonalaListing();
          });

        // tabs
        document
          .getElementById("profileAnalysis")
          .addEventListener("click", previewProfileAnalysis);
        document
          .getElementById("communicatonFrameWork")
          .addEventListener("click", previewCommunicationFrameWork);
        document
          .getElementById("prospect-click")
          .addEventListener("click", previewProspectSub);

        document
          .getElementById("companyDetails")
          .addEventListener("click", previewCompanyDetails);
        document
          .getElementById("search")
          .addEventListener("click", previewSearch);
        document
          .getElementById("parsonaListing")
          .addEventListener("click", previewPersonalaListing);
        document
          .getElementById("emailCreation")
          .addEventListener("click", previewEmailCreation);
        document
          .getElementById("canvasOpen")
          .addEventListener("click", previewCanvas);

        function previewProfileAnalysis() {
          document.querySelectorAll(".tabcontent").forEach(function (div) {
            div.style.display = "none";
          });
          document.getElementById("profileAnalysisDetails").style.display =
            "block";
          //this function help to display the signal card based on the status
          toggleDisplayBasedOnStatus("profileCardLL");
        }

        function previewCommunicationFrameWork() {
          document.querySelectorAll(".tabcontent-sub").forEach(function (div) {
            div.style.display = "none";
          });
          document.getElementById(
            "communicationFrameWorkDetails"
          ).style.display = "block";
        }
        function previewProspectSub() {
          document.querySelectorAll(".tabcontent-sub").forEach(function (div) {
            div.style.display = "none";
          });
          //if main response is not recived also if user clcik on prospect tab we need to show the loader
          //so once we recive the resp then there we are checking is user in prospect tab then we will make
          //prospect-sub-ll block.if data is not yet recived then show the loader
          if (document.getElementById("profileLikes").innerHTML === "") {
            fetch(chrome.runtime.getURL("pages/loader.html"))
              .then((r) => r.text())
              .then((html) => {
                document.getElementById("prospect-sub-loader-ll").innerHTML =
                  html;
              });
            document.getElementById("prospect-sub-ll").style.display = "none";
            document.getElementById("prospect-sub-loader-ll").style.display =
              "block";
          } else {
            document.getElementById("prospect-sub-ll").style.display = "block";
            document.getElementById("prospect-sub-loader-ll").style.display =
              "none";
          }
        }
        function previewCompanyDetails() {
          document.querySelectorAll(".tabcontent-sub").forEach(function (div) {
            div.style.display = "none";
          });
          document.getElementById("companyDetailsBlock").style.display =
            "block";
          loadCompanyDetails("profileCardLL");
          loadWorkFlowDetails("profileCardLL", getLinkedInURL());
        }

        async function previewSearch() {
          document.querySelectorAll(".tabcontent").forEach(function (div) {
            div.style.display = "none";
          });

          document.getElementById("searchPrompt").style.display = "block";
          document.getElementById("searchPrompt").children[0].style.display =
            "block";
          document.getElementById("searchPrompt").children[1].style.display =
            "none";

          // Clear any existing chat list content
          const selectElement = document.getElementById("chatList");
          selectElement.innerHTML = "";

          // Create a container div with styles for the empty array message
          const emptyArray = document.createElement("div");
          emptyArray.style.display = "flex";
          emptyArray.style.justifyContent = "center";
          emptyArray.style.alignItems = "center";
          emptyArray.style.height = "45vh";
          emptyArray.classList.add("empty-chat-message");
          emptyArray.innerHTML =
            '<div class="empty-list-ll">' +
            '<img src="' +
            chrome.runtime.getURL("assets/askAI.png") +
            '" class="empty-icon-ll" alt="Ask AI">' +
            "<p>Ask Your Question Here.</p>" +
            "</div>";

          selectElement.appendChild(emptyArray);

          // Get company and prospect names
          const buttonTexts = await getGlobleQuestion(getLinkedInURL());

          const buttons = buttonTexts?.questions.map((text) =>
            text
              .replace(/{{company_name}}/g, buttonTexts?.companyName)
              .replace(/{{prospect_name}}/g, buttonTexts?.profilename)
          );

          const searchQuestionDiv = document.getElementById("searchQuestion");
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
              const chatInput = document.getElementById("chatInput");
              chatInput.value = button.textContent; // Copy button text to chatInput
            });
          });
        }

        function previewPersonalaListing() {
          document.querySelectorAll(".tabcontent").forEach(function (div) {
            div.style.display = "none";
          });

          const parentElement = document.getElementById(
            "parsonaListingDetails"
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
          document.getElementById("page-header-text").innerText = "Settings";
          parentElement.style.display = "block";
        }

        //on click on the
        async function previewEmailCreation() {
          loadWorkFlowDetails("profileCardLL", getLinkedInURL());
          // Check content length by calling the API. BAsed on the response length we are making block and none of the clild
          const hasGeneratedContent = await checkLenghtGenerateContent(
            getLinkedInURL()
          );

          // Hide all tab content
          document.querySelectorAll(".tabcontent").forEach(function (div) {
            div.style.display = "none";
          });

          // Show or hide content sections based on result
          const emailDetails = document.getElementById("emailCreationDetails");
          emailDetails.style.display = "block";
          document.getElementById(
            "emailCreationDetails"
          ).children[0].style.display = "block";
          if (hasGeneratedContent) {
            document.getElementById(
              "emailCreationDetails"
            ).children[0].style.display = "none";
            document.getElementById(
              "emailCreationDetails"
            ).children[2].style.display = "none";
            document.getElementById(
              "emailCreationDetails"
            ).children[1].style.display = "block";
            document.getElementById(
              "emailCreationDetails"
            ).children[3].style.display = "none";
            loadGenerateContentHistory("profileCardLL", getLinkedInURL());
          } else {
            // If result is false, show the first child
            document.getElementById(
              "emailCreationDetails"
            ).children[0].style.display = "block";
            document.getElementById(
              "emailCreationDetails"
            ).children[1].style.display = "none";
            document.getElementById(
              "emailCreationDetails"
            ).children[2].style.display = "none";
            document.getElementById(
              "emailCreationDetails"
            ).children[3].style.display = "none";
          }
          //this is for dynamiv Text change in View Button Histoty
          // Get the name from profileNameGenerateContent
          const profileNameElement = document.getElementById(
            "profileNameGenerateContent"
          );
          const profileName = profileNameElement
            ? profileNameElement.innerText
            : "";
          const firstName = profileName.split(" ")[0];
          const button = document.getElementById("ViewContentHistory");
          if (profileName && button) {
            button.innerText = `${firstName}'s Threads`;
          }

          const ptag = document.getElementById("followupHeading");
          const savedMessage = document.getElementById("unsavedMessage");
          if (profileName && button) {
            ptag.innerText = `Follow up with ${firstName}`;
            savedMessage.innerText = `All message history with ${firstName}`;
          }

          // Load company details as needed
          loadCompanyDetails("profileCardLL");

          await getFrameWork(0, "signal", "profileCardLL");
        }
        function previewCanvas() {
          document.querySelectorAll(".tabcontent").forEach(function (div) {
            div.style.display = "none";
          });
          document.getElementById("leadlabscanvas").style.display = "block";
          document.getElementById("leadlabscanvas").children[0].style.display =
            "block";
          document.getElementById("leadlabscanvas").children[1].style.display =
            "none";
        }
        // for view generated content history
        document
          .getElementById("ViewContentHistory")
          .addEventListener("click", (event) => {
            document.getElementById(
              "emailCreationDetails"
            ).children[0].style.display = "none";
            document.getElementById(
              "emailCreationDetails"
            ).children[1].style.display = "block";
            loadGenerateContentHistory("profileCardLL", getLinkedInURL());
          });

        document
          .getElementById("ViewContentHistoryFull")
          .addEventListener("click", (event) => {
            loadGenerateContentHistory("profileCardLL", "");
          });

        const naviconElements = document.querySelectorAll(".naviconLL");

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

            const pageHeaderText = document.getElementById("page-header-text");
            const pageHeaderActions = document.getElementById(
              "page-header-actions"
            );

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

        document.querySelectorAll(".sub-tab").forEach((tab) => {
          tab.addEventListener("click", () => {
            // Remove 'active' from all sub-tabs
            document
              .querySelectorAll(".sub-tab")
              .forEach((el) => el.classList.remove("active"));

            // Add 'active' to the clicked tab
            tab.classList.add("active");
          });
        });

        //On clcik on view insight same function is called if it is a new profile,so that shepherdInjection is getting called
        //so for fresh profile this is not working fine
        //so i have added this condition that so only call if display status is !=none i.e after analysing the same function is calling
        //now it is woking super.....
        // if (displayStatus !== "none") {
        //   chrome.storage.local.get(["shepherdTourState"], (result) => {
        //     const state = result.shepherdTourState;
        //     if (!state || state === "not_started") {
        //       shepherdInjection();
        //     }
        //   });
        // }

        // Attach listener after DOM is ready

        const reanalyseBtn = document.getElementById("reanalyse-btn");

        if (reanalyseBtn) {
          reanalyseBtn.addEventListener("click", () => {
            // ✅ Call your function
            addAnalyseProfileButton(true, "", true);
          });
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
        document.getElementById("personality").innerText =
          responseData.data.PersonalityType;
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

        document.getElementById("tags").innerHTML =
          `<div class="font-family-ll">
          A <span style="font-weight:600" class="font-family-ll">${responseData.data.PersonalityType}</span>
          <span style="font-weight:500" class="font-family-ll"> (${description}) </span> profile represents:
        </div>` + responseData.tags;

        const personalityImg = document.getElementById("personality-img");

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

        let linkdinImage = responseData?.linkdinImage || getLinkedInImage();
        if (
          !(
            linkdinImage.includes("media.licdn") ||
            linkdinImage.includes("leadlabs.s3")
          )
        ) {
          linkdinImage =
            "https://betabackext-beta.leadlabs.app/imagepath/linkedin-profile-images/default-profile.jpg";
        }
        // Render the profile section
        document.getElementById("profiletitlell").innerHTML =
          '<div class="profileblockll">' +
          '<img src="' +
          linkdinImage +
          '" alt="profile image">' +
          "<div>" +
          responseData.profileName +
          '<div style="margin-bottom:10px; font-size:14px; font-weight: 550;">' +
          "Personality Type (<i>" +
          responseData.data.PersonalityType +
          "</i>)</div>" +
          "<div>" +
          '<div id="profileActiveTimeSection"></div>' +
          "</div>" +
          "</div>";

        document.getElementById("personality-user-data").innerHTML =
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

        //If active time from the backend is empty the get the time from the frontend
        if (responseData?.activetime.length > 0) {
          changeActiveTime(responseData?.activetime, "profileCardLL");
        } else {
          const time = await addActiveTimings(true, true);
          if (time) {
            changeActiveTime(time, "profileCardLL");
          }
        }

        // update name and profile type in generate content page.
        document.getElementById("profileNameGenerateContent").innerText =
          responseData.profileName;
        document.getElementById("profileTypeGenerateContent").innerText =
          responseData.data.PersonalityType;
        document.getElementById(
          "profileNameGenerateContentfine"
        ).innerText = `Fine tune a message for ${responseData.profileName}`;

        // document.getElementById(
        //   "generateTalkingPoints"
        // ).textContent = `Generate talking point for ${responseData.profileName}`;

        // Adapting yourself code
        if (responseData.adaptingdArrayStatus) {
          document.getElementById("adaptingYourselfBtn").style.display =
            "block";
          document.getElementById("adaptingYourselfDetails").innerHTML =
            responseData.adaptingdArray;
          document.getElementById("adaptingYourselfDetails").style.display =
            "none";
          document.getElementById("personaptagll").style.display = "none";
        } else {
          document.getElementById("addYourLinkedIn").style.display = "block";
          document.getElementById("personaptagll").style.display = "block";
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
        document.getElementById(
          "persona-header-talking"
        ).innerText = `What is  ${responseData.profileName}'s persona?`;

        document.getElementById("profileTypeGenerateContentfine").innerText =
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
        toggleDisplayBasedOnStatus("profileCardLL");
      });
  } else if (responseData && responseData.body == "Your Trail Has Ended") {
    fetch(chrome.runtime.getURL("pages/trailend.html"))
      .then((r) => r.text())
      .then((html) => {
        document.getElementById("profileCardLL").innerHTML = html;
        document.getElementById("analyseLL").style.display = "none";
        document.getElementById("centerContainer-ll").style.display = "none";
        const trailLink = document.getElementById("trail-link-ll");
        if (trailLink) {
          trailLink.href = responseData.url;
        }
        document
          .getElementById("closeTrailLL")
          .addEventListener("click", () => {
            document.getElementById("profileCardLL").style.display = "none";
          });
      });
  }
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

// Helper function to parse gpt_response and create HTML content
function createPostContent(postType, gptResponse) {
  let content = "";
  //console.log("createPostContent");
  try {
    /*  const parsedResponse = JSON.parse(gptResponse); */
    if (
      gptResponse === "" ||
      gptResponse === "undefined" ||
      gptResponse === undefined
    ) {
      content +=
        "Please wait as we process this data. Try clicking the reload button once. ";
    } else {
      content += gptResponse;
    }
    /*       if (Array.isArray(parsedResponse)) {
          // If parsedResponse is an array (for 'all' postType)
          parsedResponse.forEach(post => {
              content += `<div class="post">
                  <p><strong>Summary:</strong> ${post.summary}</p>
                  <p><strong>Excerpt One:</strong> ${post.excerpt.excerpt_one}</p>
                  <p><strong>Excerpt Two:</strong> ${post.excerpt.excerpt_two}</p>
                  <p><strong>Excerpt Three:</strong> ${post.excerpt.excerpt_three}</p>
                  <p><strong>Purpose:</strong> ${post.purpose}</p>
                  <p><strong>Theme:</strong> ${post.theme}</p>
              </div>`;
          });
      } else if (typeof parsedResponse === 'object') {
          // If parsedResponse is an object (for 'comments' and 'reactions' postTypes)
          for (const key in parsedResponse) {
              if (parsedResponse.hasOwnProperty(key)) {
                  const post = parsedResponse[key];
                  content += `<div class="post">
                      <p><strong>Author:</strong> ${post.Author}</p>
                      <p><strong>Summary:</strong> ${post.Summary}</p>
                      <p><strong>Probable Reasons:</strong> ${post.Probable_Reasons}</p>
                      <p><strong>Probable Problems:</strong> ${post.Probable_Problems}</p>
                  </div>`;
              }
          }
      } */
  } catch (error) {
    console.error("Error parsing :", error);
  }

  return content;
}

async function getJoinTheDot() {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const topic1 = document.getElementById("topic1LL").value;
  const topic2 = document.getElementById("topic2LL").value;
  document.getElementById("joinTheDotsResultLL").innerHTML = "";
  updateLoaderTextJointheDots(4);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/get-topic-result",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        topic1: topic1,
        topic2: topic2,
      }),
    }
  );

  const responseData = await response.json();
  // console.log(responseData);

  if (responseData) {
    //console.log(responseData);
    document.getElementById("joinTheDotsResultLL").innerHTML =
      responseData.body;
    //document.getElementById("joinTheDotRefresh").style.visibility = "inherit";
    document.getElementById("joinTheDotSubmit").innerText = "Refresh ⟳";
  }
}

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
      //console.log("(phaseArray[i]", phaseArray[i]);
    } else {
      document.getElementById(phaseArray[i]).style.display = "none";
    }
  }
}

async function manageReloadPopup() {
  // managing reload page options
  const reloadpagellIcon = document.createElement("div");
  reloadpagellIcon.id = "reloadPageLL";
  reloadpagellIcon.innerHTML =
    "<div><div style='font-size: 24px; margin-bottom: 10px;'>⚠️</div>LeadLabs Extension was updated. Please <strong>reload</strong> the page.</div> <button id='reloadPageBtnLL'> Reload </button>";
  document.body.appendChild(reloadpagellIcon);
  reloadpagellIcon.addEventListener("click", () => {
    window.location.reload();
  });
}

function removeAfter5thSlash(url) {
  // Define regex pattern to match up to the 5th slash
  var pattern = /(https?:\/\/(?:[^\/]+\/){5}).*/;

  // Use regex to match and replace
  var result = url.replace(pattern, "$1");

  return result;
}
function getLinkedInURL() {
  let linkedIn;
  if (window.location.href.includes("linkedin.com/in/me/")) {
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
    } catch {
      //console.log("error finding user linkedin Url")
    }
    linkedIn = sharedStartString(stringArray);
  } else {
    linkedIn = removeAfter5thSlash(window.location.toString());
  }
  return linkedIn;
}
function getTextFromNestedDiv() {
  const divElement = document.querySelector(
    ".pv-text-details__right-panel li button span .inline-show-more-text--is-collapsed"
  );
  return divElement ? divElement.textContent : null;
}

function getFirstCompanyURL() {
  const aTags = document.querySelectorAll(
    'a[data-field="experience_company_logo"]'
  );
  return aTags.length > 0 ? aTags[0].href : null;
}
//in linkedIn map API i wnat to send the company name. so we are reading the data from li card
//check if there is two li if there then we are send the name else null
//as because some profile company will be there else school name will be there
function getCompanyNameFromHomePage() {
  const firstCard = document.querySelector(".artdeco-card");
  if (firstCard) {
    // const firstLi = firstCard.querySelector("li");
    // return firstLi ? firstLi.innerText.trim() : null;

    const listItems = firstCard.querySelectorAll("li");
    return listItems.length === 2 ? listItems[0].innerText.trim() : null;
  }
  return null;
}
function getPersonNameFromHomePage() {
  const firstCard = document.querySelector(".artdeco-card");
  if (firstCard) {
    const firstLi = firstCard.querySelector("h1");
    return firstLi ? firstLi.innerText.trim() : null;
  }
  return null;
}
function getPersonaCompanyData() {
  {
    const headings = document.querySelectorAll("h1");
    let name = "";

    if (headings.length > 0 && headings[0]) {
      name = headings[0].innerText;
    }

    if (name.length < 4) {
      name = headings;
    }

    let checkPostclassName = "scaffold-layout__content";
    let main;
    let allMainSections;

    // Check if the class exists in the DOM

    main = document.getElementsByClassName(checkPostclassName);

    allMainSections = main[0].getElementsByClassName("artdeco-card");
    var companyUrls = [];

    for (let i = 0; i < allMainSections.length; i++) {
      const section = allMainSections[i];

      // Check if this section contains a child div with the experience ID
      const experienceDiv = section.querySelector("#experience");

      if (experienceDiv) {
        // If found, retrieve company details from `artdeco-list__item` elements
        const listItems = section.getElementsByClassName("artdeco-list__item");
        for (let j = 0; j < listItems.length; j++) {
          const listItem = listItems[j];

          // Find the company name span and image

          const companyLink = listItem.querySelector("a");
          const img = listItem.querySelector("img");

          // Extract company name and URL if available

          const linkdinComapanyUrl = companyLink ? companyLink.href : "";
          const linkdinComapanyProfileurl = img && img.src ? img.src : "";
          const imagealt = img && img.alt ? img.alt : "";
          const companyAltText = imagealt.replace(/logo/gi, "").trim();
          const linkdinDesc = listItem.innerText.trim();

          // Push the company details including the image src and innerText
          if (linkdinComapanyUrl) {
            companyUrls.push({
              linkdinComapanyUrl,
              companyAltText,
              linkdinComapanyProfileurl,
              linkdinDesc,
            });
          }
        }
        break; // Exit the loop once the experience section is found and processed
      }
    }
  }
  return companyUrls;
}

async function selfWrittenContentRedirect(calibrationStatus, pageLoadStatus) {
  //if the DOM is not loaded then we are calling the same function once again after 5 sec

  if (
    document.getElementsByClassName("scaffold-layout__content").length === 0
  ) {
    setTimeout(() => {
      selfWrittenContentRedirect(calibrationStatus, pageLoadStatus);
    }, 5000);
    return;
  }

  const eleSelfWritten = document.getElementById("selfWrittenBtnLL");
  const textSpan = document.getElementById("buttonText");

  if (!chrome.runtime?.id) {
    // handling extesion invalidated
    manageReloadPopup();
  } else {
    // Call the function and log the result
    if (!pageLoadStatus) {
      eleSelfWritten.disabled = true;
      eleSelfWritten.classList.add("fetching");
      textSpan.innerHTML = `Fetching <span class="dots">
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </span>`;
    }
    const nestedDivText = getTextFromNestedDiv();
    //console.log("company nameeeee:", nestedDivText);

    //send User URL and Company URL, needed for mapping and also needed for redirect from recent activity
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    let companyData = getPersonaCompanyData();

    let company = getCompanyNameFromHomePage();

    let matchingCompany = companyData.find((item) =>
      item.linkdinDesc.includes(company)
    );
    //if match not found then consider the first element in array
    let finalCompanyData = matchingCompany || companyData[0];
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/linkedin-url-mapping",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkdinUrl: getLinkedInURL(),
          allWorkedCompany: companyData,
          //if match not found then consider the first element in array
          companyLinkedInURL:
            company !== null
              ? finalCompanyData.linkdinComapanyUrl
              : companyData[0]?.linkdinComapanyUrl,
          companyName:
            company !== null ? company : companyData[0]?.companyAltText,
          profileName: getPersonNameFromHomePage(),
          companyData: company !== null ? finalCompanyData : companyData[0],

          //here only checking the company name and sening the expirence
          // companyLinkedInURL:company!==null?matchingCompany?.linkdinComapanyUrl: companyData[0]?.linkdinComapanyUrl,
          // companyName:company!==null?company: companyData[0]?.companyAltText,
          // profileName: getPersonNameFromHomePage(),
          // companyData:company!==null? matchingCompany:companyData[0],

          //1st version code
          // companyLinkedInURL: matchingCompany?.linkdinComapanyUrl,
          // companyName: company,
          // profileName: getPersonNameFromHomePage(),
          // companyData: matchingCompany,
        }),
      }
    );

    const responseData = await response.json();
    //this is for on page load we are calling the mapping api, here we need to call only and not to do anything
    // so we are passiing one parameter as this is called in background js file
    if (pageLoadStatus) {
      return;
    }
    if (responseData) {
      textSpan.innerHTML = `View insights`;

      eleSelfWritten.disabled = false;
    }
    if (responseData && responseData.body != "Your Trail Has Ended") {
      // redirect only after getting the response

      // adding condition that, if already analysed within 24 hours, do not analyze again
      if (responseData.body == "freshprofile" && calibrationStatus) {
        // dont open popup, just open profile window
        addAnalyseProfileButton(true);
        checkSelfPostInHomePage("all");
      } else if (responseData.body == "freshprofile" && !calibrationStatus) {
        addAnalyseProfileButton(true, "none");
      } else if (!window.location.toString().includes("recent-activity/all")) {
        // below code was writen to pass the message to background so that, it can get the active tab and open this link in the same tab
        // chrome.runtime.sendMessage({redirect: removeAfter5thSlash(window.location.toString())+'recent-activity/all/'});

        // since trying to open the new tab
        popupCenters({
          url:
            removeAfter5thSlash(window.location.toString()) +
            "recent-activity/comments",
          title: "LeadLabs",
          w: 600,
          h: 600,
        });
        checkSelfPostInHomePage("all");
        //setTimeout(function() {toggleGradiantClass()}, 20000);
        toggleGradiantClass();
        addAnalyseProfileButton(true, "none");
      }
    } else if (responseData && responseData.body == "Your Trail Has Ended") {
      fetch(chrome.runtime.getURL("pages/trailend.html"))
        .then((r) => r.text())
        .then((html) => {
          // creation of Profile card needed here as it was only done in analyse profile
          if (!document.getElementById("profileCardLL")) {
            const profileCard = document.createElement("div");
            profileCard.id = "profileCardLL";
            profileCard.style.display = "flex";
            profileCard.style.position = "fixed";
            profileCard.style.zIndex = 100;
            profileCard.style.top = "7vh";
            profileCard.style.right = "0px";
            profileCard.style.backgroundColor = "#FFFFFF";
            profileCard.style.width = "30%";
            //profileCard.style.overflow="auto";
            profileCard.style.height = "80vh";
            profileCard.style.borderRadius = "10px";
            document.getElementById("profile-content").appendChild(profileCard);
          } else {
            document.getElementById("profileCardLL").style.display = "block";
          }

          document.getElementById("profileCardLL").innerHTML = html;
          document.getElementById("analyseLL").style.display = "none";
          document.getElementById("centerContainer-ll").style.display = "none";
          //adding the link in trail end page
          const trailLink = document.getElementById("trail-link-ll");
          if (trailLink) {
            trailLink.href = responseData.url;
          }
          document
            .getElementById("closeTrailLL")
            .addEventListener("click", () => {
              document.getElementById("profileCardLL").style.display = "none";
              document.getElementById("analyseLL").style.display = "block";
            });
        });
    }
  }
}

const toggleGradiantClass = () => {
  if (
    document
      .getElementById("selfWrittenBtnLL")
      .classList.contains("btngradiantll")
  ) {
    document
      .getElementById("selfWrittenBtnLL")
      .classList.remove("btngradiantll");
    document.getElementById("selfWrittenBtnLL").classList.add("fixedborderll");
    document.getElementById("profileBtnLL").classList.add("btngradiantll");
    document.getElementById("profileBtnLL").classList.remove("fixedborderll");
  }
};
async function checkSelfPostInHomePage(type) {
  const defaultClass = "scaffold-finite-scroll__content";
  let postClass = defaultClass;
  let allPosts = document.getElementsByClassName(postClass);

  if (allPosts.length === 0) {
    try {
      // Call API to get the updated class name
      postClass = await checkPostclassNameFunction(
        "checkSelfPostInHomePage",
        postClass
      );
      allPosts = document.getElementsByClassName(postClass);
    } catch (error) {
      console.error("Error resolving class name from API:", error);
      return; // Exit the function if the class cannot be resolved
    }
  }
  // Check if the length of allPosts is greater than 0
  if (allPosts.length > 0) {
    let postData = "";
    let containsCommentedOnPost = false;

    // Collect post data and check for the specific text
    for (let i = 0; i < allPosts.length; i++) {
      const postText = allPosts[i].innerText;

      if (postText.includes("commented on a post")) {
        containsCommentedOnPost = true;
        break; // Exit loop if the condition is met
      }

      postData += postText;
    }

    // If "commented on a post" is found, skip the API call
    if (containsCommentedOnPost) {
      // console.log("Post contains 'commented on a post'. Skipping API call.");
      return null;
    }

    if (postData.trim()) {
      let { userToken } = await chrome.storage.local.get(["userToken"]);
      const response = await fetch(
        "https://betabackext-beta.leadlabs.app/linkedin-profile-recent-all",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
          body: JSON.stringify({
            postData: postData,
            linkedInUrl: getLinkedInURL(),
            type: type,
          }),
        }
      );

      const responseData = await response.json();

      if (responseData) {
        return responseData.companyurl;
      }
    }
  } else {
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/linkedin-profile-recent-all",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          postData: "No Posts Found",
          linkedInUrl: getLinkedInURL(),
          type: type,
        }),
      }
    );

    const responseData = await response.json();

    if (responseData) {
      return responseData.companyurl;
    }
  }
}

const popupCenters = ({ url, title, w, h }) => {
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
  /*   const newWindow = window.open(
    url,
    title,
    `
    scrollbars=no,
    width=${w}, 
    height=${h}, 
    top=${top}, 
    left=${left},
    location=no,
    toolbar=no,
    menubar=no,
    status=no,
    `
  );

  // removing systemZoom above seems to be working!
  // ${h / systemZoom} --> ${h}, so on for w

  if (window.focus) newWindow.focus(); */

  chrome.runtime.sendMessage({
    action: "createWindow",
    url: url, // Your URL here
    w: w,
    h: h,
    t: top,
    l: left,
  });
};
let clickID;
async function addAnalyseProfileButton(
  command,
  displayStatus,
  reanalysestatus
) {
  //as in linked run the script twice for adding the button, we are adding one flag to avoid multiple calls

  if (window.isAnalyseProfileButtonLoading) {
    console.log("⏳ addAnalyseProfileButton already running. Skipping...");
    return;
  }
  window.isAnalyseProfileButtonLoading = true;
  try {
    const windowId = sessionStorage.getItem("chromeExtensionWindowId");
    document.body.style.display = "block";
    if (!window.location.toString().includes("recent-activity")) {
      const allSections = document.getElementsByClassName("artdeco-card");
      var actionButton;
      //alert(allSections.length);

      if (allSections !== null) {
        if (allSections.length > 0) {
          //actionButton = allSections[0].children[1].querySelector(".pv-top-card-v2-ctas");
          // class was changed, and then even that class was removed. Hence trying to find other way
          const elementsMore = document.querySelectorAll(
            '[aria-label="More actions"]'
          );

          actionButton = allSections[0];
        }
      }

      if (actionButton !== null) {
        const removeElement = document.querySelectorAll("#analyseLL");
        for (var i = 0; i < removeElement.length; i++) {
          removeElement[i].remove();
        }
        const removeElementminimize =
          document.querySelectorAll(".minimizeContainer");
        for (var i = 0; i < removeElementminimize.length; i++) {
          removeElementminimize[i].remove();
        }
        const centerContainerll = document.querySelectorAll(
          "#centerContainer-ll"
        );
        for (var i = 0; i < centerContainerll.length; i++) {
          centerContainerll[i].remove();
        }

        const analyseButton = document.createElement("div");
        analyseButton.id = "analyseLL";
        analyseButton.style.display = "none";
        const htmlloader = await fetch(
          chrome.runtime.getURL("pages/loaderCard.html")
        )
          .then((res) => res.text())
          .catch((err) => {
            console.error("Failed to load canvasoutput.html", err);
            return "<div>Error loading output view.</div>";
          });
        analyseButton.innerHTML = htmlloader;

        const minimizeContainer = document.createElement("div");
        minimizeContainer.id = "minimizeContainer";
        minimizeContainer.className = "minimizeContainer";
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
          </button> `;
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
        if (
          window.location.href.includes("linkedin.com/in") ||
          window.location.href.includes("linkedin.com/feed")
        ) {
          document.body.appendChild(analyseButton);
          document.body.appendChild(minimizeContainer);
          document.body.appendChild(centerContainer);
          //dragLeadlabsIcon("analyseLL", "dragIconLLIcon");
          makeDivDraggable("dragIconLLIcon", "analyseLL");

          // dragLeadlabsIcon("minimizeContainer", "dragIconLLIcon-minimize");
          const headerImg = document.getElementById("lead-icon-ll");
          headerImg.src = chrome.runtime.getURL("assets/full-logo.png");
          if (window.location.href.includes("linkedin.com/feed")) {
            document.getElementById("analyseLL").style.display = "block";
            document.getElementById("selfWrittenBtnLL").style.display = "none";
            document.getElementById("name-time-container").style.display =
              "none";
            document.getElementById("commentbuttonText").style.display =
              "block";
            document.getElementById("getCanvas").style.display = "none";
            document.getElementById(
              "user-active-time-container"
            ).style.display = "none";
            document.getElementById("user-tags").style.display = "none";
            document.getElementById("centerize-ll").style.display = "none";
            document.getElementById("settingIcon").style.display = "none";
            document.getElementById("searchWebBtnLL").style.display = "none";
            document.getElementById("profile-content-container").style.display =
              "none";
            document.getElementById("input-container-ll").style.display =
              "none";
            document.getElementById("analyseLL").style.width = "19%";
            document.getElementById("analyseLL").style.height = "17vh";
            document.getElementById("analyseLL").style.top = "70vh";
            document.getElementById("lead-container").style.height = "13vh";
          } else {
            chrome.storage.local.get("onboardingStatus", function (result) {
              const onboardingStatus = result?.onboardingStatus;
              if (onboardingStatus) {
                document.getElementById("analyseLL").style.display = "block";
                document.getElementById("selfWrittenBtnLL").style.display =
                  "flex";
                document.getElementById("name-time-container").style.display =
                  "flex";
                document.getElementById("writeCommentBtnLL").style.display =
                  "flex";
                document.getElementById("analyseYoursefltBtnLL").style.display =
                  "none";
                // chrome.storage.local.get(
                //   ["initialShepherdTourState"],
                //   (result) => {
                //     const state = result.initialShepherdTourState;

                //     if (!state || state === "not_started") {
                //       initialShepherdInjection();
                //     }
                //   }
                // );
              } else {
                document.getElementById("selfWrittenBtnLL").style.display =
                  "none";
                document.getElementById("name-time-container").style.display =
                  "none";
                document.getElementById("writeCommentBtnLL").style.display =
                  "none";
                document.getElementById("getCanvas").style.display = "none";
                document.getElementById(
                  "user-active-time-container"
                ).style.display = "none";
                document.getElementById("user-tags").style.display = "none";
                document.getElementById("centerize-ll").style.display = "none";
                document.getElementById("settingIcon").style.display = "none";
                document.getElementById("searchWebBtnLL").style.display =
                  "none";
                document.getElementById(
                  "profile-content-container"
                ).style.display = "none";
                document.getElementById("input-container-ll").style.display =
                  "none";
                document.getElementById("analyseLL").style.width = "19%";
                document.getElementById("analyseLL").style.height = "17vh";
                document.getElementById("analyseLL").style.top = "70vh";
                document.getElementById("lead-container").style.height = "13vh";
                document.getElementById("analyseYoursefltBtnLL").style.display =
                  "block";
                if (!window.location.href.includes("linkedin.com/in/me/")) {
                  document.getElementById("analyseLL").style.display = "block";
                  document.getElementById("analyseYoursefltBtnLL").textContent =
                    "Setup my AI assistant";
                  document.querySelector(
                    ".selfwritten-container"
                  ).style.height = "auto";
                  document.getElementById("analyseYourtext").innerHTML = `
                <div class="leadlabs-message">Oops! Looks like you have not calibrated<br>Leadlabs AI for yourself yet.</div>
                <div class="leadlabs-note">Note: You will be redirected to your LinkedIn Profile<br>during this process.</div>
                <div class="leadlabs-time">(Takes about ~2 min)</div> `;
                  document.getElementById(
                    "login-text"
                  ).innerHTML = `<div class="leadlabs-note" style="
    text-align: center;
    margin-top: 5px;
    margin-bottom: -5px;
    "
>Make sure that you have signed in before <br>starting calibration</div>`;
                } else {
                  //as click on begin calibration addAnalyseProfileButton called once again so i am checking if
                  // id is persent then we are not calling the function
                  //so double click problem get sloved
                  if (
                    !document.getElementById("analyseYourselfCardwrapperLL")
                  ) {
                    analyseYourSelf();
                  }
                  document.getElementById("analyseLL").style.display = "none";
                }
              }
            });
          }
          chrome.storage.local.get("minimizeStatus", function (result) {
            const minimizeStatus = result?.minimizeStatus;
            if (minimizeStatus === "small") {
              if (document.getElementById("analyseLL")) {
                document.getElementById("analyseLL").style.display = "none";
                document.getElementById("centerContainer-ll").style.display =
                  "none";
                document.getElementById("minimizeContainer").style.display =
                  "flex";
              }
            } else if (minimizeStatus === "center") {
              if (document.getElementById("minimizeContainer")) {
                document.getElementById("minimizeContainer").style.display =
                  "none";
                document.getElementById("centerContainer-ll").style.display =
                  "block";
                document.getElementById("analyseLL").style.display = "none";
              }
            } else {
              if (document.getElementById("minimizeContainer")) {
                document.getElementById("minimizeContainer").style.display =
                  "none";
                document.getElementById("centerContainer-ll").style.display =
                  "none";
                document.getElementById("analyseLL").style.display = "block";
              }
            }
          });
          if (selectedCanvasId) {
            if (document.getElementById("analyseLL")) {
              document.getElementById("analyseLL").style.display = "none";
            }
          }

          const userName = getPersonNameFromHomePage();

          if (userName) {
            sessionStorage.removeItem("pageReloadedOnce"); // reset for next time
          } else {
            if (!sessionStorage.getItem("pageReloadedOnce")) {
              sessionStorage.setItem("pageReloadedOnce", "true");
              location.reload();
            } else {
              console.log(
                "⛔ User name still not found after reload, stopping."
              );
            }
          }
          document.getElementById("user-name").innerText = userName;
          const allDivs = document.querySelectorAll(
            "div[data-generated-suggestion-target]"
          );
          document.getElementById("user-position-ll").innerText =
            allDivs[0].innerText.trim();

          // Set user image and active time array, On page load the post are not loaded correctly and also when we load
          //load the another profile in linkedin loading profile photo is taking time so to slove this written the code
          //that call the function for 3 times after 2 sec

          let attempts = 0;
          let maxAttempts = 3;
          async function tryGetActiveTime() {
            let time;
            if (command) {
              time = await addActiveTimings(true);
            } else {
              time = await addActiveTimings(true, true);
            }
            // Flag to check if image assigned successfully
            let imageAssigned = false;

            // Check if active time exists
            if (time && time.length > 0) {
              changeActiveTime(time, "analyseLL");
            }

            // Check for profile image
            let linkdinImage = getLinkedInImage();

            if (linkdinImage) {
              const userImg = document.getElementById("user-img");

              if (
                !(
                  linkdinImage.includes("media.licdn") ||
                  linkdinImage.includes("leadlabs.s3")
                )
              ) {
                linkdinImage =
                  "https://betabackext-beta.leadlabs.app/imagepath/linkedin-profile-images/default-profile.jpg";
              }

              if (userImg) {
                userImg.src = linkdinImage;
                userImg.alt = "User Image";
                userImg.style.width = "48px";
                userImg.style.height = "48px";
                userImg.style.borderRadius = "24px";
                userImg.style.objectFit = "cover";

                imageAssigned = true; // ✅ Image is set
              }
            }

            // ✅ Stop retrying if both time & image are set
            if (time && time.length > 0 && imageAssigned) {
              console.log(
                "Active time and image successfully set. Stopping retries."
              );
              return;
            }

            // Otherwise, retry logic
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(tryGetActiveTime, 2000); // Retry after 2 seconds
            } else {
              console.log("Max retry attempts reached. Data might be missing.");
            }
          }

          // Start process

          tryGetActiveTime();
        }
      }
      const minimize = document.getElementById("minimize-ll");
      minimize.addEventListener("click", () => {
        chrome.storage.local.get("minimizeStatus", function (result) {
          const minimizeStatus = result?.minimizeStatus;

          if (
            minimizeStatus === "big" &&
            document.getElementById("analyseLL").style.height === "85vh"
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

            document.getElementById("analyseLL").style.display = "none";
            document.getElementById("minimizeContainer").style.display = "flex";
          }
        });
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

        document.getElementById("centerContainer-ll").style.display = "none";
        document.getElementById("analyseLL").style.display = "flex";
        makeCardSmall();
        document.getElementById("minimizeContainer").style.display = "none";
      });

      const minimizeContainer = document.getElementById(
        "leadlabsIcon-minimize"
      );
      minimizeContainer.addEventListener("click", () => {
        chrome.storage.local
          .set({
            minimizeStatus: "big",
          })
          .then(() => {
            //console.log("Login Successfull!");
          });
        //        if (window.location.href.includes("linkedin.com/in") &&
        //     !window.location.href.includes("linkedin.com/in/me/")) {
        //   makeCardSmall();
        // }
        chrome.storage.local.get("onboardingStatus", function (result) {
          const onboardingStatus = result?.onboardingStatus;

          const currentUrl = window.location.href;

          if (
            currentUrl.includes("linkedin.com/in") &&
            !currentUrl.includes("linkedin.com/in/me/")
          ) {
            // Call for all profiles except your own
            makeCardSmall();
          } else if (
            currentUrl.includes("linkedin.com/in/me/") &&
            onboardingStatus === true
          ) {
            // Call for your own profile only if onboardingStatus is true
            makeCardSmall();
          }
        });

        document.getElementById("analyseLL").style.display = "block";
        document.getElementById("minimizeContainer").style.display = "none";
      });
      const centerContainer = document.getElementById("centerize-ll");
      centerContainer.addEventListener("click", () => {
        chrome.storage.local
          .set({
            minimizeStatus: "center",
          })
          .then(() => {
            //console.log("Login Successfull!");
          });
        document.getElementById("analyseLL").style.display = "none";
        document.getElementById("centerContainer-ll").style.display = "block";
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
        document.getElementById("analyseLL").style.display = "block";
        document.getElementById("centerContainer-ll").style.display = "none";
        makeCardBig();
      });
      // instructionPopup(window.location.toString());
      const element = document.getElementById("profileBtnLL");
      element.style.color = "var(--color-text-low-emphasis-shift)";
      element.style.padding = "7px 12px";
      element.style.border = "3px solid rgb(204, 204, 204)";
      element.style.borderRadius = "16px";
      element.style.borderColor = "var(--color-background-none)";
      element.style.fontWeight = "600";
      element.style.cursor = "pointer";
      element.style.boxShadow = "inset 0 0 0 1px var(--color-border)";

      // const eleSelfWritten = document.getElementById("selfWrittenBtnLL");
      // eleSelfWritten.addEventListener(
      //   "click",
      //   () => {

      //     selfWrittenContentRedirect(true);
      //   },
      //   false
      // );
      const eleSelfWritten = document.getElementById("selfWrittenBtnLL");
      eleSelfWritten.onclick = () => {
        selfWrittenContentRedirect(true);
      };

      const centerSelfWritten = document.getElementById(
        "centerselfWrittenBtnLL"
      );
      centerSelfWritten.addEventListener(
        "click",
        () => {
          selfWrittenContentRedirect(true);
        },
        false
      );
      const searchWebBtnLL = document.getElementById("searchWebBtnLL");
      searchWebBtnLL.addEventListener(
        "click",
        () => {
          selfWrittenContentRedirect(true);
          clickID = "search";
        },
        false
      );
      const settingIconBtnLL = document.getElementById("settingIcon");
      settingIconBtnLL.addEventListener(
        "click",
        () => {
          selfWrittenContentRedirect(true);
          clickID = "parsonaListing";
        },
        false
      );

      const CommentWritten = document.getElementById("writeCommentBtnLL");
      CommentWritten.addEventListener(
        "click",
        () => {
          let commentCard = document.getElementById("commentCardwrapperLL");

          if (commentCard) {
            // commentCard.style.display =
            //   commentCard.style.display === "block" ? "none" : "block";
            commentCard.remove();
          } else {
            showPostComment();
            logVisiblePostContent();
          }
        },
        false
      );
      const centerCommentWritten = document.getElementById(
        "centerwriteCommentBtnLL"
      );
      centerCommentWritten.addEventListener(
        "click",
        () => {
          let commentCard = document.getElementById("commentCardwrapperLL");

          if (commentCard) {
            // commentCard.style.display =
            //   commentCard.style.display === "block" ? "none" : "block";
            commentCard.remove();
          } else {
            showPostComment();
            logVisiblePostContent();
          }
        },
        false
      );
      const analyseYourButton = document.getElementById(
        "analyseYoursefltBtnLL"
      );
      if (analyseYourButton) {
        analyseYourButton.addEventListener(
          "click",
          () => {
            if (!window.location.href.includes("linkedin.com/in/me/")) {
              window.location.href = "https://www.linkedin.com/in/me/";

              return; // prevent running analyseYourSelf() if we're navigating away
            }
            analyseYourSelf();
          },
          false
        );
      }
      //getCanvas code

      // const runCanvasButton = document.getElementById("getCanvas");
      // if (runCanvasButton) {
      //   runCanvasButton.addEventListener("click", () => {
      //     runCanvas(getLinkedInURL());
      //   });
      // }

      var myFunction = function () {
        if (!chrome.runtime?.id) {
          // handling extesion invalidated
          manageReloadPopup();
        } else {
          const headings = document.querySelectorAll("h1");
          let name = headings[0].innerText;
          if (name.length < 4) {
            name = headings;
          }
          //console.log("profile name: ", name);

          let checkPostclassName = "scaffold-layout__content";
          let main;
          let allMainSections;
          var sectionArray = [];
          var sectionText = "";
          // Check if the class exists in the DOM
          if (
            document.getElementsByClassName(checkPostclassName).length === 0
          ) {
            // Use .then to handle the Promise
            checkPostclassNameFunction("myFunction", checkPostclassName)
              .then((resolvedValue) => {
                // Assuming the response is an  class names,

                main = document.getElementsByClassName(resolvedValue);

                if (main.length > 0) {
                  allMainSections =
                    main[0].getElementsByClassName("artdeco-card");

                  // Process the sections if needed
                  processSections(
                    allMainSections,
                    displayStatus,
                    reanalysestatus
                  );
                }
                // });
              })
              .catch((error) => {
                console.error(
                  "Error resolving checkPostclassNameFunction:",
                  error
                );
              });
          } else {
            main = document.getElementsByClassName(checkPostclassName);

            allMainSections = main[0].getElementsByClassName("artdeco-card");
            processSections(allMainSections, displayStatus, reanalysestatus);
          }

          // Function to process sections (this is where you can extract and handle the text)
          function processSections(sections, displayStatus, reanalysestatus) {
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
            if (
              window.location.toString() === "https://www.linkedin.com/in/me/"
            ) {
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
              } catch {
                //console.log("error finding user linkedin Url")
              }
              showProfileSummaryShort(
                sectionText,
                name,
                sharedStartString(stringArray),
                linkdinImage,
                linkdinDesc,
                companyUrls,
                true,
                displayStatus,
                reanalysestatus
              );
            } else {
              showProfileSummaryShort(
                sectionText,
                name,
                window.location.toString(),
                linkdinImage,
                linkdinDesc,
                companyUrls,
                false,
                displayStatus,
                reanalysestatus
              );
            }
          }
        }
      };

      element.addEventListener("click", myFunction, false);

      //can we add the intro video here? checking
      //addIntroShephard();
    }

    //assuming landed in recent-activity/all/ for now
    else if (
      window.location.toString().includes("recent-activity/comments") &&
      window.chromeExtensionWindowId != undefined
      // here we can consider window.chromeExtensionWindowId as its the first link and will be present
      // for later redirected URL we will have to take it from session storage
    ) {
      // Store the window ID in sessionStorage required to pass it on redictions to /comments/ /rections/ / company etc.
      sessionStorage.setItem(
        "chromeExtensionWindowId",
        window.chromeExtensionWindowId
      );

      // this is for hiding the screen
      //console.log("window.chromeExtensionWindowId", window.chromeExtensionWindowId);
      const overlay = document.createElement("div");
      overlay.id = "overlayScreen";
      document.body.appendChild(overlay);

      fetch(chrome.runtime.getURL("pages/contentanalysispopup.html"))
        .then((r) => r.text())
        .then((html) => {
          overlay.innerHTML = html;
          document.getElementById("profileImgLoading").src = getImageSrcByAlt(
            getFirstH3()
          );
          document.getElementById("binocularImgLoading").src =
            chrome.runtime.getURL("assets/binoculars.png");
          document.getElementById("profileNamePopup").innerText = getFirstH3();
          document.getElementById("loadingSelfWritten").style.display = "block";
        });

      /*  overlay.innerHTML =
      '<h3 style="text-align:center; max-width:70%;"> (1/3) </br> Please wait as we analyse the profile for you... </br> <span class="overlayBtnll"> Do not close! <span></h3>';
  */
      setTimeout(function () {
        getAllPosts("comments");
      }, 2000);
    } else if (
      window.location.toString().includes("recent-activity/comments") &&
      windowId != undefined
    ) {
      // this is for hiding the screen
      const overlay = document.createElement("div");
      overlay.id = "overlayScreen";
      document.body.appendChild(overlay);
      fetch(chrome.runtime.getURL("pages/contentanalysispopup.html"))
        .then((r) => r.text())
        .then((html) => {
          overlay.innerHTML = html;
          document.getElementById("profileImgLoading").src = getImageSrcByAlt(
            getFirstH3()
          );
          document.getElementById("binocularImgLoading").src =
            chrome.runtime.getURL("assets/binoculars.png");
          document.getElementById("profileNamePopup").innerText = getFirstH3();
          document.getElementById("loadingEngaged").style.display = "block";
        });

      setTimeout(function () {
        getAllPosts("comments");
        //window.location.href =  window.location.toString().replace('recent-activity/comments','recent-activity/reactions');
      }, 2000);
    } else if (
      window.location.toString().includes("recent-activity/reactions") &&
      windowId != undefined
    ) {
      // this is for hiding the screen
      const overlay = document.createElement("div");
      overlay.id = "overlayScreen";
      document.body.appendChild(overlay);
      fetch(chrome.runtime.getURL("pages/contentanalysispopup.html"))
        .then((r) => r.text())
        .then((html) => {
          overlay.innerHTML = html;
          document.getElementById("profileImgLoading").src = getImageSrcByAlt(
            getFirstH3()
          );
          document.getElementById("binocularImgLoading").src =
            chrome.runtime.getURL("assets/binoculars.png");
          document.getElementById("profileNamePopup").innerText = getFirstH3();
          document.getElementById("loadingEngaged").style.display = "block";
        });

      setTimeout(function () {
        getAllPosts("reactions");
      }, 2000);
    }

    if (command === true) {
      myFunction(displayStatus);
    }
  } finally {
    window.isAnalyseProfileButtonLoading = false;
  }
}
//this code is done because As we append the analyse button to body,when we navigate to message or other page the Button is visible so
//below code will Observe the URL change If URL changed then It will check call function to append the data,else remove the ICon if it there.
//!important
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log("URL changed to", url);
    if (window.location.href.includes("linkedin.com/in/")) {
      let page = document.getElementById("profileCardLL");
      if (page) {
        page.remove();
      }
      const removeElement = document.querySelectorAll("#profileCardLL");
      for (var i = 0; i < removeElement.length; i++) {
        removeElement[i].remove();
      }

      let canvas = document.getElementById("canvasOutputCardwrapperLL");
      if (canvas) {
        canvas.remove();
      }
      let canvasList = document.getElementById("canvasCardwrapperLL");
      if (canvasList) {
        canvasList.remove();
      }
      const analyseYourselfCardwrapperLL = document.getElementById(
        "analyseYourselfCardwrapperLL"
      );
      if (analyseYourselfCardwrapperLL) {
        analyseYourselfCardwrapperLL.remove();
      }
      const commentCardwrapperLL = document.getElementById(
        "commentCardwrapperLL"
      );
      if (commentCardwrapperLL) {
        commentCardwrapperLL.remove();
      }
      selectedCanvasId = null;

      addAnalyseProfileButton();
    } else {
      const iconId = document.getElementById("analyseLL");
      const commentCardwrapperLL = document.getElementById(
        "commentCardwrapperLL"
      );
      const centerLL = document.getElementById("centerContainer-ll");
      const smallLL = document.getElementById("minimizeContainer");
      if (iconId) {
        iconId.remove();
      }
      if (commentCardwrapperLL) {
        commentCardwrapperLL.remove();
      }
      if (centerLL) {
        centerLL.remove();
      }
      if (smallLL) {
        smallLL.remove();
      }
    }
    if (window.location.href.includes("recent-activity")) {
      const iconId = document.getElementById("analyseLL");
      const commentCardwrapperLL = document.getElementById(
        "commentCardwrapperLL"
      );
      const centerLL = document.getElementById("centerContainer-ll");
      const smallLL = document.getElementById("minimizeContainer");
      if (iconId) {
        iconId.remove();
      }
      if (commentCardwrapperLL) {
        commentCardwrapperLL.remove();
      }
      if (centerLL) {
        centerLL.remove();
      }
      if (smallLL) {
        smallLL.remove();
      }
    }
  }
}).observe(document, { subtree: true, childList: true });

async function getAllPosts(type) {
  const windowId = sessionStorage.getItem("chromeExtensionWindowId");
  // Initialize elapsed time
  let waitingTime = 8000;
  if (type == "reactions") {
    waitingTime = 12000;
  }
  let elapsedTime = 0;
  let companyURLofTheUser = "";
  // Set interval to check every second
  const intervalId = setInterval(async () => {
    //console.log("calling check post", type);
    const result = await checkPosts(type);
    if (result) {
      companyURLofTheUser = result;
      handleRedirectForProfile(type);
    } else {
      //console.log(result);
      handleRedirectForProfile(type);
    }
    //console.log('companyURLofTheUser',companyURLofTheUser);
    elapsedTime += 2000;

    // Clear the interval after 8 seconds
    if (elapsedTime >= waitingTime) {
      clearInterval(intervalId);
      //console.log("Stopped checking after 8 seconds.");
      handleRedirectForProfile(type);
    }
  }, 2000);

  function handleRedirectForProfile(type) {
    if (type == "all") {
      //we are commenting this code because i dont want to redirect to reaction,comment
      //so directly redireting to company url

      // window.location.href = window.location
      //   .toString()
      //   .replace("recent-activity/all", "recent-activity/comments");

      if (companyURLofTheUser == "closewindow") {
        //window.close();
        chrome.runtime.sendMessage({
          action: "closeWindow",
          wid: windowId,
        });
      } else if (companyURLofTheUser != "") {
        // get the fucking company url and redirect to it !!!
        window.location.href = companyURLofTheUser;
      } else {
        // no idea what to do, hence closing
        //window.close();
        chrome.runtime.sendMessage({
          action: "closeWindow",
          wid: windowId,
        });
      }
    } else if (type == "comments") {
      if (companyURLofTheUser == "closewindow") {
        //window.close();
        chrome.runtime.sendMessage({
          action: "closeWindow",
          wid: windowId,
        });
      } else if (companyURLofTheUser != "") {
        // get the fucking company url and redirect to it !!!
        window.location.href = companyURLofTheUser;
      } else {
        // no idea what to do, hence closing
        //window.close();
        chrome.runtime.sendMessage({
          action: "closeWindow",
          wid: windowId,
        });
      }
      // window.location.href = window.location
      //   .toString()
      //   .replace("recent-activity/comments", "recent-activity/reactions");
    } else if (type == "reactions") {
      //console.log("companyURLofTheUser", companyURLofTheUser);

      if (companyURLofTheUser == "closewindow") {
        //window.close();
        chrome.runtime.sendMessage({
          action: "closeWindow",
          wid: windowId,
        });
      } else if (companyURLofTheUser != "") {
        // get the fucking company url and redirect to it !!!
        window.location.href = companyURLofTheUser;
      } else {
        // no idea what to do, hence closing
        //window.close();
        chrome.runtime.sendMessage({
          action: "closeWindow",
          wid: windowId,
        });
      }
    } else {
      //window.close();
      chrome.runtime.sendMessage({
        action: "closeWindow",
        wid: windowId,
      });
    }
  }

  async function checkPosts(type) {
    const defaultClass = "feed-shared-update-v2__control-menu-container-i";
    let postClass = defaultClass;
    let allPosts = document.getElementsByClassName(postClass);

    if (allPosts.length === 0) {
      try {
        // Call API to get the updated class name
        postClass = await checkPostclassNameFunction("checkPosts", postClass);
        allPosts = document.getElementsByClassName(postClass);
      } catch (error) {
        console.error("Error resolving class name from API:", error);
        return; // Exit the function if the class cannot be resolved
      }
    }

    if (allPosts.length > 0) {
      let postData = "";
      clearInterval(intervalId); // Clear the interval if posts are found

      // Collect post data
      for (const post of allPosts) {
        postData += post.innerText;
      }

      try {
        const { userToken } = await chrome.storage.local.get(["userToken"]);
        const response = await fetch(
          "https://betabackext-beta.leadlabs.app/linkedin-profile-recent-all",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              postData,
              linkedInUrl: window.location.href,
              type,
            }),
          }
        );

        const responseData = await response.json();
        return responseData.companyurl || null;
      } catch (error) {
        console.error("Error sending post data to the server:", error);
      }
    } else {
      try {
        const { userToken } = await chrome.storage.local.get(["userToken"]);
        const response = await fetch(
          "https://betabackext-beta.leadlabs.app/linkedin-profile-recent-all",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              postData: "No Posts Found",
              linkedInUrl: window.location.href,
              type,
            }),
          }
        );

        const responseData = await response.json();
        return responseData.companyurl || null;
      } catch (error) {
        console.error("Error sending 'No Posts Found' to the server:", error);
      }
    }
  }
}

async function analyseCompany() {
  const windowId = sessionStorage.getItem("chromeExtensionWindowId");
  document.body.style.display = "block";

  // close window if the user is admin of the same page for now
  if (
    window.location.toString().includes("linkedin.com/company/") &&
    window.location.toString().includes("/admin/") &&
    window.chromeExtensionWindowId != undefined
  ) {
    chrome.runtime.sendMessage({
      action: "closeWindow",
      wid: windowId,
    });
  }

  if (
    (window.location.toString().includes("linkedin.com/company/") ||
      window.location.toString().includes("linkedin.com/school/")) &&
    !window.location.toString().includes("/posts/") &&
    !window.location.toString().includes("/about/") &&
    !window.location.toString().includes("/jobs/") &&
    !window.location.toString().includes("/people/") &&
    windowId != undefined
  ) {
    // this is for hiding the screen
    const overlay = document.createElement("div");
    overlay.id = "overlayScreen";
    document.body.appendChild(overlay);

    fetch(chrome.runtime.getURL("pages/contentanalysispopup.html"))
      .then((r) => r.text())
      .then((html) => {
        overlay.innerHTML = html;
        document.getElementById("profileImgLoading").src = getCompanyImage();
        document.getElementById("binocularImgLoading").src =
          chrome.runtime.getURL("assets/binoculars.png");
        document.getElementById("profileNamePopup").innerText =
          getCompanyName();
        document.getElementById("loadingCompanyProfile").style.display =
          "block";
      });

    setTimeout(function () {
      const homePosts = getAllCompanyPosts("home");
    }, 1500);
  } else if (
    (window.location.toString().includes("linkedin.com/company/") ||
      window.location.toString().includes("linkedin.com/school/")) &&
    window.location.toString().includes("/about/") &&
    windowId != undefined
  ) {
    // this is for hiding the screen
    const overlay = document.createElement("div");
    overlay.id = "overlayScreen";
    document.body.appendChild(overlay);

    fetch(chrome.runtime.getURL("pages/contentanalysispopup.html"))
      .then((r) => r.text())
      .then((html) => {
        overlay.innerHTML = html;
        document.getElementById("profileImgLoading").src = getCompanyImage();
        document.getElementById("binocularImgLoading").src =
          chrome.runtime.getURL("assets/binoculars.png");
        document.getElementById("profileNamePopup").innerText =
          getCompanyName();
        document.getElementById("loadingCompanyProfile").style.display =
          "block";
        document.getElementById("loadingTitleLL").innerText =
          "Fetching company funding...";
      });

    setTimeout(function () {
      const aboutPosts = getAllCompanyPosts("about");
    }, 1500);
  } else if (
    (window.location.toString().includes("linkedin.com/company/") ||
      window.location.toString().includes("linkedin.com/school/")) &&
    window.location.toString().includes("/posts/") &&
    windowId != undefined
  ) {
    // this is for hiding the screen
    const overlay = document.createElement("div");
    overlay.id = "overlayScreen";
    document.body.appendChild(overlay);

    fetch(chrome.runtime.getURL("pages/contentanalysispopup.html"))
      .then((r) => r.text())
      .then((html) => {
        overlay.innerHTML = html;
        document.getElementById("profileImgLoading").src = getCompanyImage();
        document.getElementById("binocularImgLoading").src =
          chrome.runtime.getURL("assets/binoculars.png");
        document.getElementById("profileNamePopup").innerText =
          getCompanyName();
        document.getElementById("loadingCompanyProfile").style.display =
          "block";
        document.getElementById("loadingTitleLL").innerText =
          "Fetching company ICP...";
      });

    setTimeout(function () {
      const postPosts = getAllCompanyPosts("posts");
    }, 1500);
  } else if (
    (window.location.toString().includes("linkedin.com/company/") ||
      window.location.toString().includes("linkedin.com/school/")) &&
    window.location.toString().includes("/jobs/") &&
    windowId != undefined
  ) {
    // scroll by 500px as jobs arent shown before that,
    window.scrollBy(0, 500);

    const nextButton = document.querySelector(
      '[aria-label="Next set of recently posted jobs"]'
    );
    const noOfJobsCards = document.getElementsByClassName(
      "job-card-square__main"
    );

    // when the number of cards are less and next Btn will result in removing the existing card. so no data is captured
    if (nextButton && noOfJobsCards && noOfJobsCards.length > 2) {
      nextButton.click();
      // below thing works, but first 2 jobs will be deleted by linkedin. so will find a way later.
      /*   setTimeout(function () {
    nextButton.click();
  }, 300); */
    }

    // this is for hiding the screen
    const overlay = document.createElement("div");
    overlay.id = "overlayScreen";
    document.body.appendChild(overlay);

    fetch(chrome.runtime.getURL("pages/contentanalysispopup.html"))
      .then((r) => r.text())
      .then((html) => {
        overlay.innerHTML = html;
        document.getElementById("profileImgLoading").src = getCompanyImage();
        document.getElementById("binocularImgLoading").src =
          chrome.runtime.getURL("assets/binoculars.png");
        document.getElementById("profileNamePopup").innerText =
          getCompanyName();
        document.getElementById("loadingCompanyProfile").style.display =
          "block";
        document.getElementById("loadingTitleLL").innerText =
          "Fetching company jobs...";
      });

    setTimeout(function () {
      const jobPosts = getAllCompanyPosts("jobs");
    }, 1500);
  } else if (
    (window.location.toString().includes("linkedin.com/company/") ||
      window.location.toString().includes("linkedin.com/school/")) &&
    window.location.toString().includes("/people/") &&
    windowId != undefined
  ) {
    window.scrollBy(0, 500);
    // this is for hiding the screen
    const overlay = document.createElement("div");
    overlay.id = "overlayScreen";
    document.body.appendChild(overlay);

    fetch(chrome.runtime.getURL("pages/contentanalysispopup.html"))
      .then((r) => r.text())
      .then((html) => {
        overlay.innerHTML = html;
        document.getElementById("profileImgLoading").src = getCompanyImage();
        document.getElementById("binocularImgLoading").src =
          chrome.runtime.getURL("assets/binoculars.png");
        document.getElementById("profileNamePopup").innerText =
          getCompanyName();
        document.getElementById("loadingCompanyProfile").style.display =
          "block";
        document.getElementById("loadingTitleLL").innerText =
          "Fetching company demography...";
      });

    setTimeout(function () {
      const peoplePosts = getAllCompanyPosts("people");
    }, 3000);
    // looks like this alone needs more time
  } else if (window.chromeExtensionWindowId != undefined) {
    chrome.runtime.sendMessage({
      action: "closeWindow",
      wid: windowId,
    });
  }
}

async function getAllCompanyPosts(type) {
  const windowId = sessionStorage.getItem("chromeExtensionWindowId");
  document.body.style.display = "block";

  const baseCompanyURL = removeAfter5thSlash(window.location.toString());
  //console.log("calling check company post", type, baseCompanyURL);
  const generatePost = await checkCompanyPosts(type);

  setTimeout(function () {
    if (type == "home") {
      //this is because for  paid user backend will send closeWindow
      //so the next analysis take care by admin chrome extenction
      //for unpaid user flow continu
      if (generatePost.status && generatePost.status == "closewindow") {
        //window.close();
        chrome.runtime.sendMessage({
          action: "closeWindow",
          wid: windowId,
        });
      } else {
        window.location.href =
          window.location.href.split("/").slice(0, 5).join("/") + "/about/";
      }
    } else if (type == "about") {
      window.location.href =
        window.location.href.split("/").slice(0, 5).join("/") + "/posts/";
    } else if (type == "posts") {
      window.location.href =
        window.location.href.split("/").slice(0, 5).join("/") + "/jobs/";
    } else if (type == "jobs") {
      window.location.href =
        window.location.href.split("/").slice(0, 5).join("/") + "/people/";
    } else {
      // no idea what to do, hence closing
      //window.close();

      chrome.runtime.sendMessage({
        action: "closeWindow",
        wid: windowId,
      });
    }
  }, 2000);
}

async function checkCompanyPosts(type) {
  if (type == "home") {
    const linkdinCompanyImage = await getCompanyImage();
    const linkdinCompanyDesc = await getCompanyDescription();
    const linkdinCompanySubDesc = await getCompanyDescriptionSub();
    const linkedIncompanyname = await getCompanyName();

    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/linkedin-company-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkdinCompanyImage: linkdinCompanyImage,
          linkdinCompanyDesc: linkdinCompanyDesc,
          linkdinCompanySubDesc: linkdinCompanySubDesc,
          linkdinCompanyUrlNumber: window.document.referrer || null,
          linkedIncompanyname: linkedIncompanyname,
          type: type,
          linkedInCompanyUrl: getLinkedInURL(),
          postData: "",
        }),
      }
    );

    const responseData = await response.json();

    if (responseData) {
      // return responseData.companyurl;
      return responseData;
    }
  }

  if (type == "about") {
    const linkedIncompanyname = await getCompanyName();
    const postData = await getCompanyAboutSection();
    const fundingData = await getCompanyFundingData();

    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/linkedin-company-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkedInCompanyUrl: getLinkedInURL(),
          postData: postData,
          fundingData: fundingData,
          linkedIncompanyname: linkedIncompanyname,
          type: type,
        }),
      }
    );

    const responseData = await response.json();

    if (responseData) {
      return responseData.companyurl;
    }
  }

  if (type == "posts") {
    const postData = await getCompanyPostSection();
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/linkedin-company-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkedInCompanyUrl: getLinkedInURL(),
          postData: postData,
          type: type,
        }),
      }
    );

    const responseData = await response.json();

    if (responseData) {
      return responseData.companyurl;
    }
  }

  if (type == "jobs") {
    const postData = await getCompanyJobsSection();
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/linkedin-company-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkedInCompanyUrl: getLinkedInURL(),
          postData: postData,
          type: type,
        }),
      }
    );

    const responseData = await response.json();

    if (responseData) {
      return responseData.companyurl;
    }
  }

  if (type == "people") {
    const postData = await getCompanyPeopleSection();
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/linkedin-company-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkedInCompanyUrl: getLinkedInURL(),
          postData: postData,
          type: type,
        }),
      }
    );

    const responseData = await response.json();

    if (responseData) {
      return responseData.companyurl;
    }
  }
}

function getImageSrcByAlt(altText) {
  // Use querySelector with an attribute selector to find the image
  const img = document.querySelector(`img[alt="${altText.trim()}"]`);

  // Return the src attribute if the image is found, otherwise return null
  return img ? img.src : chrome.runtime.getURL("assets/person.png");
}

function getFirstH3() {
  let h3 = "";
  const h3s = document.getElementsByTagName("h3");

  if (h3s.length > 0) {
    h3 = h3s[0].innerText;
  }
  return h3;
}

function getCompanyPeopleSection() {
  let sectionText = "";

  //its only one div with this class actually
  const postSection = document.getElementsByClassName(
    "org-people-bar-graph-module__geo-region"
  );
  for (i = 0; i < postSection.length; i++) {
    sectionText += postSection[i].innerText;
  }
  return sectionText;
}

function getCompanyJobsSection() {
  let sectionText = "";

  // heading to get the number
  const jobHeading = document.getElementsByClassName(
    "org-jobs-job-search-form-module__headline"
  );
  if (jobHeading.length > 0) {
    for (let i = 0; i < jobHeading.length; i++) {
      sectionText += jobHeading[i].innerText;
    }
  }

  // actual posts
  const postSection = document.getElementsByClassName("job-card-square__main");
  if (postSection.length > 0) {
    for (let i = 0; i < postSection.length; i++) {
      sectionText += postSection[i].innerText;
    }
  } else {
    const postSectionOther = document.getElementsByClassName("main-job-card");
    for (let i = 0; i < postSectionOther.length; i++) {
      sectionText += postSectionOther[i].innerText;
    }
  }

  return sectionText;
}

function getCompanyPostSection() {
  let sectionText = "";
  const postSection = document.getElementsByClassName("feed-shared-update-v2");
  for (i = 0; i < postSection.length; i++) {
    sectionText += postSection[i].innerText;
  }
  return sectionText;
}

function getCompanyAboutSection() {
  const companyDesc = document.getElementsByClassName(
    "org-page-details-module__card-spacing"
  );
  return companyDesc[0] ? companyDesc[0].innerText : null;
}

function getCompanyFundingData() {
  const companyFundingDesc = document.getElementsByClassName(
    "org-funding__card-spacing"
  );
  return companyFundingDesc[0] ? companyFundingDesc[0].innerText : null;
}

function getCompanyImage() {
  const imgTag = document.getElementsByClassName(
    "org-top-card-primary-content__logo"
  );
  return imgTag[0] ? imgTag[0].src : null;
}

function getCompanyName() {
  const h1Tag = document.querySelector("h1");
  return h1Tag ? h1Tag.innerHTML : null;
}

function getCompanyDescription() {
  const companyDesc = document.getElementsByClassName(
    "org-top-card-summary__tagline"
  );
  return companyDesc[0] ? companyDesc[0].innerText : null;
}

function getCompanyDescriptionSub() {
  const companyDescSub = document.getElementsByClassName(
    "org-top-card-summary-info-list"
  );
  return companyDescSub[0] ? companyDescSub[0].innerText : null;
}

function extractUnixTimestamp(postId) {
  // BigInt needed as we need to treat postId as 64 bit decimal. This reduces browser support.
  const asBinary = BigInt(postId).toString(2);
  const first41Chars = asBinary.slice(0, 41);
  const timestamp = parseInt(first41Chars, 2);
  return timestamp;
}

function unixTimestampToHumanDate(timestamp) {
  const dateObject = new Date(timestamp);
  const humanDateFormat = dateObject.toUTCString() + " (UTC)";
  return humanDateFormat;
}

async function addActiveTimings(status, callStoreAPI) {
  // Remove existing timings
  const removeElement = document.querySelectorAll("#profiletimeLL");
  for (var i = 0; i < removeElement.length; i++) {
    removeElement[i].remove();
  }

  // setTimeout(function () {
  // Select elements based on available classes
  const allPostsAnchor = document.getElementsByClassName(
    "feed-mini-update-optional-navigation-context-wrapper"
  );
  const alternatePostsAnchor = document.getElementsByClassName(
    "feed-shared-update-v2--minimal-padding"
  );

  var timings = "";

  const postsToProcess =
    allPostsAnchor.length > 0 ? allPostsAnchor : alternatePostsAnchor;
  let unixTimestampFullArray = [];
  for (var i = 0; i < postsToProcess.length && i < 7; i++) {
    let postId = null;

    // Check which class is being processed and extract the identifier
    if (allPostsAnchor.length > 0) {
      var completeLink = postsToProcess[i].getAttribute("href");
      if (completeLink) {
        var postLink = completeLink.substring(0, completeLink.indexOf("?"));
        postId = postLink.substring(postLink.lastIndexOf(":") + 1);
      }
    } else if (alternatePostsAnchor.length > 0) {
      const dataUrn = postsToProcess[i].getAttribute("data-urn");
      if (dataUrn) {
        postId = dataUrn.split(":").pop(); // Extract the activity ID from data-urn
      }
    }

    if (!postId) continue; // Skip if postId couldn't be determined

    // Convert postId to a human-readable timestamp
    var unixTimestamp = extractUnixTimestamp(postId);
    if (unixTimestamp !== undefined && unixTimestamp !== null) {
      unixTimestampFullArray.push(unixTimestamp);
    }

    var humanDateFormat = unixTimestampToHumanDate(unixTimestamp);

    var from = new Date(humanDateFormat).getHours();
    var to = from + 1;
    if (to > 23) {
      to = "12 AM";
    } else if (to > 12) {
      to = to - 12;
      to = to + " PM";
    } else if (to == 12) {
      to = to + " PM";
    } else {
      to = to + " AM";
    }
    if (from > 12) {
      from = from - 12;
      from = from + " PM";
    } else if (from == 12) {
      from = from + " PM";
    } else {
      from = from + " AM";
    }

    if (!timings.includes(to)) {
      timings +=
        '<div style="border:1px solid #E0E0FC; font-size: 12px; color: #5B5BD6; margin-right: 10px; padding: 0px 5px; float: left; background: #F3F3FF; border-radius: 15px; font-weight: 600; line-height: 22px;">' +
        from +
        " to " +
        to +
        " </div>";
    }
  }
  //as addActiveTimings is loaded when ever the addAnalyseProfileButton called so not to call multiple times
  //I just need to store the data only on page load and when the activeTime is [] then need to call
  //so I am sending the callStoreAPI based on this status I am calling the API
  if (unixTimestampFullArray.length > 0 && callStoreAPI) {
    sendActiveTime(unixTimestampFullArray);
  }
  if (status) {
    return unixTimestampFullArray;
  }
}
document.addEventListener("click", function (event) {
  const post = event.target.closest(".postll");
  if (!post) return;

  const details = post.querySelector(".detailsll");
  if (!details) return;

  // Toggle visibility
  details.style.display = details.style.display === "block" ? "none" : "block";
});

// Initially hide all details (handles dynamically added elements too)
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".detailsll").forEach((details) => {
    details.style.display = "none";
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "windowClosed") {
    if (window.location.href.includes("linkedin.com/in/me/")) {
      addAnalyseProfileButton(true, "none");
    } else {
      addAnalyseProfileButton(true);
    }
    sendResponse({ status: "success" });
  }
});
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "clickSelfWrittenBtn") {
    // Try up to 3 times, 4s apart
    waitForButtonWithRetry("#selfWrittenBtnLL", 3, 4000)
      .then((btn) => {
        console.log("✅ Found button, clicking...");
        btn.click();

        // Wait for the API to complete
        waitForApiResult(
          "https://betabackext-beta.leadlabs.app/linkedin-profile-main-short"
        ).then(() => {
          chrome.runtime.sendMessage({
            action: "profileDone",
            index: msg.index,
          });
        });
      })
      .catch(() => {
        console.warn("⚠️ Button not found after retries, moving next");
        chrome.runtime.sendMessage({
          action: "profileDone",
          index: msg.index,
        });
      });
  }
});

// Retry function
function waitForButtonWithRetry(selector, retries = 3, interval = 4000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const tryFind = () => {
      const el = document.querySelector(selector);
      if (el) {
        resolve(el);
      } else {
        attempts++;
        if (attempts >= retries) {
          reject();
        } else {
          console.log(
            `⏳ Button not found, retrying ${attempts}/${retries}...`
          );
          setTimeout(tryFind, interval);
        }
      }
    };

    tryFind();
  });
}

// Wait for API response (same as before)
function waitForApiResult(targetUrl) {
  return new Promise((resolve) => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (args[0].includes(targetUrl)) resolve();
      return response;
    };

    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this.addEventListener("load", () => {
        if (url.includes(targetUrl)) resolve();
      });
      return open.call(this, method, url, ...rest);
    };
  });
}
