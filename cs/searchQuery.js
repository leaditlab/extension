function loadSearch(linkedIn) {
  getAllChat();

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
  document
    .getElementById("submitChat")
    .addEventListener("click", async function (event) {
      event.preventDefault(); // Prevent page refresh

      const chatInputValue = document.getElementById("chatInput").value;
      const model = document.getElementById("search-model").value;
      if (!chatInputValue) {
        return;
      }
      document.getElementById("submitChat").disabled = true;
      const chatData = {
        searchvalue: chatInputValue,
        linkdinUrl: linkedIn,
        model: model,
      };

      // Call the function to create chat
      creatChat(chatData);
    });

  // for view search  history
  document
    .getElementById("ViewSearchHistory")
    .addEventListener("click", (event) => {
      document.getElementById("searchPrompt").children[0].style.display =
        "none";
      document.getElementById("searchPrompt").children[1].style.display =
        "block";
      document.getElementById("searchPrompt").children[2].style.display =
        "none";
      getAllChat();
    });

  //back to search histoty page
  document.getElementById("backToSearch").addEventListener("click", (event) => {
    document.getElementById("searchPrompt").children[0].style.display = "block";
    document.getElementById("searchPrompt").children[1].style.display = "none";
    document.getElementById("searchPrompt").children[2].style.display = "none";
  });

  // JavaScript for chat Creation
  async function creatChat(data) {
    // Store the original content of the div before displaying the loading message
    const originalContent = document.getElementById("chatList").innerHTML;

    // Create the loading message and append it
    const loadingDiv = document.createElement("div");
    loadingDiv.innerHTML = `
              <div id="loaderSearch">Generating ... Please wait</div>
            `;
    loadingDiv.style.textAlign = "center";
    loadingDiv.style.color = "#5B5B5B";
    document.getElementById("chatList").appendChild(loadingDiv);

    // Fetch the content from loader.html and update the innerHTML once fetched
    fetch(chrome.runtime.getURL("pages/loader.html"))
      .then((response) => response.text())
      .then((html) => {
        // First, clear the existing content including the loading message
        document.getElementById("chatList").innerHTML = "";

        document.getElementById("chatList").innerHTML = html;

        // Display the element again
        document.getElementById("chatList").style.display = "block";

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
    // Assuming responseData contains the backend response
    if (responseData?.header === "success") {
      document.getElementById("chatList").innerHTML = originalContent;

      // Clear the input field after submitting
      document.getElementById("chatInput").value = "";
      const emptyMessage = document.querySelector(".empty-chat-message");
      if (emptyMessage) {
        emptyMessage.remove(); // This removes the div and all its content
      }

      // Extract the question and answer from the response
      const question = responseData.question;
      const answer = responseData.answer; // This contains the HTML response

      // Select the element where the chat should be appended
      const selectElement = document.getElementById("chatList");

      // Create a container div for the chat
      const chatContainer = document.createElement("div");
      chatContainer.classList.add("chat-container"); // Add a class for styling

      // Create a div for the question
      const questionDiv = document.createElement("div");
      questionDiv.classList.add("chat-question"); // Add a class for styling
      questionDiv.innerHTML = `<strong>Question:</strong> ${question}`;

      // Create a div for the answer (HTML content needs to be handled carefully)
      const answerDiv = document.createElement("div");
      answerDiv.classList.add("chat-answer"); // Add a class for styling
      answerDiv.innerHTML = `<strong>Answer:</strong> ${answer}`; // The response answer is HTML, so use innerHTML

      // Append the question and answer to the chat container
      chatContainer.appendChild(questionDiv);
      chatContainer.appendChild(answerDiv);

      // Append the entire chat container to the chat list
      selectElement.appendChild(chatContainer);
    }
    document.getElementById("submitChat").disabled = false;
  }
  async function getAllChat() {
    var pageLimit = 1;
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
          linkdinUrl: linkedIn,
          page_limit: pageLimit,
        }),
      }
    );

    const responseData = await response.json();

    if (responseData) {
      const selectElement = document.getElementById("search-history");
      selectElement.innerHTML = ""; // Clear existing content
      if (responseData?.body?.length === 0) {
        const container = document.getElementById("search-history");
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
        document.getElementById("load_more_btn_search").style.display = "none";
      } else {
        document.getElementById("load_more_btn_search").style.display = "block";
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
        document
          .getElementById("load_more_btn_search")
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
      "https://betabackext-beta.leadlabs.app/get-all-question-answer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          linkdinUrl: linkedIn,
          page_limit: str,
        }),
      }
    );
    const responseData = await response.json();
    return responseData;
  }

  function addData(data, type) {
    const contentList = document.querySelector("#search-history");
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
}
