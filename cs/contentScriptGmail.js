// contentScript.js

function getEmailBody(signatureDelimiter) {
  const selector =
    "div[aria-label='Message Body'], div[aria-label='Message text'], div.editable";
  const element = document.querySelector(selector);
  //console.log(element);
  if (element) {
    let emailText = element.innerHTML;
    if (signatureDelimiter && emailText.includes(signatureDelimiter)) {
      emailText = emailText
        .substring(0, emailText.indexOf(signatureDelimiter))
        .trim();
    }
    return emailText;
  }
  return null;
}

function getEmailSubject() {
  const element = document.querySelector('[aria-label="Subject"]');
  //console.log(element);

  if (element) {
    let subject = element.value;
    //console.log(subject);
    return subject;
  }
  return null;
}
//close the profile on click on thr close icon
document.addEventListener("click", (event) => {
  if (event.target.matches("#close-profile")) {
    document.getElementById("revaaloLLWrapper").style.display = "none";
  }
});
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
          if (!is_more) gifWrapper.innerHTML = ``;
          current += data.pagination.count;
          data.data.forEach((gifData) => {
            var gifCard = gifItem.cloneNode(true);
            gifCard.querySelector(".gif-container>img").src =
              gifData.images.downsized_medium.url;
            gifCard.querySelector(".gif-container>img").alt = gifData.title;
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

            const imageIdCopy = gifData.title.replaceAll(" ", "") + "copy";
            gifCard.querySelector(".gif-container>div>div").id = imageIdCopy;

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
                  alert(`${gifData.title}'s link has been copied to clipboard`);
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
        // console.log(error);
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
  searchBox.addEventListener("input", () => {
    loadGIFs();
  });

  // calling it by default
  loadGIFs(true);
}

async function showPreview() {
  document.getElementById("revaaloLL").style.display = "block";

  makeDivDraggable("revaaloLLWrapper");
  locateDivPosition("revaaloLLWrapper");

  const element = document.querySelector("#revaaloLL");
  fetch(chrome.runtime.getURL("pages/preview.html"))
    .then((r) => r.text())
    .then((html) => {
      //document.body.insertAdjacentHTML('beforeend', html);
      element.innerHTML = html;

      document.getElementById("mobileLLImg").src =
        chrome.runtime.getURL("assets/mobile.png");
      document.getElementById("watchLLImg").src =
        chrome.runtime.getURL("assets/watch.png");
      // Subject
      document.getElementById("mobileTextSubject").innerHTML = trimLength(
        getEmailSubject(),
        90
      );
      document.getElementById("watchTextSubject").innerHTML = trimLength(
        getEmailSubject(),
        35
      ); //getEmailSubject();

      // Body
      document.getElementById("mobileText").innerHTML = getEmailBody();
      document.getElementById("watchText").innerHTML = getEmailBody(); //getEmailSubject();

      // User Name
      document.getElementById("userNameLL").innerText = getUserName();
      document.getElementById("userNameLogoLL").innerText =
        getUserName().charAt(0);

      document
        .getElementById("previewWatch")
        .addEventListener("click", previewWatch);
      document
        .getElementById("previewPhone")
        .addEventListener("click", previewPhone);

      function previewWatch() {
        // show relavent image
        document.getElementById("watchLL").style.display = "block";
        document.getElementById("mobileLL").style.display = "none";
        document.getElementById("previewWatch").style.border =
          "2px #211F26 solid";
        document.getElementById("previewPhone").style.border =
          "1px #DFDCE3 solid";

        document.getElementById("mobileTextSubject").innerHTML = trimLength(
          getEmailSubject(),
          90
        );
        document.getElementById("watchTextSubject").innerHTML = trimLength(
          getEmailSubject(),
          35
        ); //getEmailSubject();
        document.getElementById("mobileText").innerHTML = getEmailBody();
        document.getElementById("watchText").innerHTML = getEmailBody(); //getEmailSubject();
      }

      function previewPhone() {
        // show relavent image
        document.getElementById("mobileLL").style.display = "block";
        document.getElementById("watchLL").style.display = "none";
        document.getElementById("previewPhone").style.border =
          "2px #211F26 solid";
        document.getElementById("previewWatch").style.border =
          "1px #DFDCE3 solid";

        document.getElementById("mobileTextSubject").innerHTML = trimLength(
          getEmailSubject(),
          90
        );
        document.getElementById("watchTextSubject").innerHTML = trimLength(
          getEmailSubject(),
          35
        ); //getEmailSubject();
        document.getElementById("mobileText").innerHTML = getEmailBody();
        document.getElementById("watchText").innerHTML = getEmailBody(); //getEmailSubject();
      }
    });
}

async function showNotificationGmail() {
  makeDivDraggable("revaaloLLWrapper");
  locateDivPosition("revaaloLLWrapper");

  document.getElementById("revaaloLL").style.display = "block";
  const element = document.querySelector("#revaaloLL");
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/api/notification/getnotification",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    }
  );

  const responseData = await response.json();

  fetch(chrome.runtime.getURL("pages/notification.html"))
    .then((r) => r.text())
    .then((html) => {
      //document.body.insertAdjacentHTML('beforeend', html);
      element.innerHTML = html;
      const notificationList = document.querySelector("#notificationList");

      for (i = 0; i < responseData.body.length; i++) {
        const notification = document.createElement("div");
        notification.innerHTML =
          '<div class="notificationcard">' +
          responseData.body[i].title +
          "</div>";
        //imageGif.src = chrome.runtime.getURL("assets/nav/nav-gif.png"); // Set the image source
        notificationList.appendChild(notification);
      }
    });
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
  const searchValue = document.getElementById("search-input-linkdinprofile");
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

// load more function
async function getShowLoadMore(str, tabselection) {
  const searchValue = document.getElementById("search-input-linkdinprofile");
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

//Draw Ui Based on Api Response for Tab Switch and search
function paintUI(data, type) {
  const profileListSearch = document.querySelector("#gmailProfileList");
  if (type !== "loadmore") {
    profileListSearch.innerHTML = "";
  }
  for (i = 0; i < data.body.length; i++) {
    const profileSearch = document.createElement("div");
    profileSearch.innerHTML =
      '<div class="gmailProfileCard">' +
      '<img src="' +
      data.body[i].image +
      '" /><div style="display:grid; margin-left: 10px;"> <span class="dotdotdot">' +
      data.body[i].name +
      '</span><span class="dotdotdot" style="font-size: 12px;">' +
      data.body[i].desc +
      "</span></div></div>";

    //imageGif.src = chrome.runtime.getURL("assets/nav/nav-gif.png"); // Set the image source
    profileListSearch.appendChild(profileSearch);
    const id = data.body[i].id;

    profileSearch.addEventListener("click", function () {
      gmailDetailedProfile(id);
    });
  }
}

async function showAllProfiles() {
  var pageLimit = 1;
  var tabselection = "Personal";
  makeDivDraggable("revaaloLLWrapper");
  locateDivPosition("revaaloLLWrapper");
  document.getElementById("revaaloLL").style.display = "block";
  const element = document.querySelector("#revaaloLL");
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

  fetch(chrome.runtime.getURL("pages/gmailProfiles.html"))
    .then((r) => r.text())
    .then((html) => {
      //document.body.insertAdjacentHTML('beforeend', html);
      element.innerHTML = html;
      const profileList = document.querySelector("#gmailProfileList");

      for (i = 0; i < responseData.body.length; i++) {
        const profile = document.createElement("div");
        profile.innerHTML =
          '<div class="gmailProfileCard">' +
          '<img src="' +
          responseData.body[i].image +
          '" /><div style="display:grid; margin-left: 10px;"> <span class="dotdotdot">' +
          responseData.body[i].name +
          '</span><span class="dotdotdot" style="font-size: 12px;">' +
          responseData.body[i].desc +
          "</span></div></div>";
        //imageGif.src = chrome.runtime.getURL("assets/nav/nav-gif.png"); // Set the image source
        profileList.appendChild(profile);
        const id = responseData.body[i].id;

        profile.addEventListener("click", function () {
          gmailDetailedProfile(id);
        });
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

          document.getElementById("load_more_profile").style.display = "block";
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

          document.getElementById("load_more_profile").style.display = "block";
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
        .getElementById("search-input-linkdinprofile")
        .addEventListener("input", function (event) {
          event.preventDefault();
          searchProfile(event.target.value, tabselection)
            .then((data) => {
              if (event.target.value === "" || event.target.value === null) {
                document.getElementById("load_more_profile").style.display =
                  "block";
                pageLimit = 1;
              } else {
                document.getElementById("load_more_profile").style.display =
                  "none";
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

async function showEmailTemplates() {
  makeDivDraggable("revaaloLLWrapper");
  locateDivPosition("revaaloLLWrapper");

  document.getElementById("revaaloLL").style.display = "block";
  const element = document.querySelector("#revaaloLL");

  fetch(chrome.runtime.getURL("pages/emailtemplate.html"))
    .then((r) => r.text())
    .then((html) => {
      //document.body.insertAdjacentHTML('beforeend', html);
      element.innerHTML = html;
    });
}

async function listGifs() {
  document.getElementById("revaaloLL").style.display = "block";

  makeDivDraggable("revaaloLLWrapper");
  locateDivPosition("revaaloLLWrapper");

  const element = document.querySelector("#revaaloLL");

  //for now hiding the whole thing below, because not showing the media for now
  // calling Giphy by default
  /*    let {userToken} = await chrome.storage.local.get(["userToken"]);
 const response = await fetch(
    "https://betabackext-beta.leadlabs.app/api/gif/getgiffile",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      "Authorization": "Bearer " + userToken,
      },
    }
  ); 

  const responseData = await response.json();
*/

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

        //for now hiding the whole thing below, because not showing the media for now
        // calling Giphy by default

        /*       //enable tab
        document
          .getElementById("showgiphy")
          .addEventListener("click", showgiphy);

        const gifList = document.querySelector("#mediaList");

        for (i = 0; i < responseData.body.length; i++) {
          const gif = document.createElement("div");
          gif.classList.add("gifrow");

          var path = responseData.body[i].gif_path;
          if (path == null) {
            path = chrome.runtime.getURL("assets/dummyimage.png");
          }

          //currently onError not working properly
          gif.innerHTML =
            '<div class="gif"><img id="img' +
            i +
            'img" src="' +
            path +
            '"></img><div class="giftitle">' +
            responseData.body[i].gif_name +
            '</div><div style="white-space: pre-wrap; position:absolute; color:'+responseData.body[i].dynamic_thumbnail_text_color +';'
            + 'top:'+Math.floor(responseData.body[i].dynamic_thumbnail_text_alignY/3.5)+'px;' + 
             'left:'+Math.floor(responseData.body[i].dynamic_thumbnail_text_alignX/3.5)+'px;' + 
             'font-size:'+Math.floor(responseData.body[i].dynamic_thumbnail_text_fontSize/3.5)+'px;' + 
            'font-weight:'+Math.floor(responseData.body[i].dynamic_thumbnail_text_fontWeight)+';' +  
            '">'
            + responseData.body[i].dynamic_thumbnail_text +'</div></div>';
          gifList.appendChild(gif);
            const name = responseData.body[i].gif_name;
            const pathImg = path;
            const imgId = responseData.body[i]._id;

            gif.addEventListener("click", function () {
              gifWizard(name, pathImg, imgId);
            });
        }
 */
      });
  } catch {}
}

async function showMinicourses() {
  makeDivDraggable("revaaloLLWrapper");
  locateDivPosition("revaaloLLWrapper");

  document.getElementById("revaaloLL").style.display = "block";
  const element = document.querySelector("#revaaloLL");
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/minicourse/get",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    }
  );

  const responseData = await response.json();

  //console.log("-------", response);

  fetch(chrome.runtime.getURL("pages/minicourse.html"))
    .then((r) => r.text())
    .then((html) => {
      //document.body.insertAdjacentHTML('beforeend', html);
      element.innerHTML = html;
      const minicourseList = document.querySelector("#minicourseList");

      for (i = 0; i < responseData.data.length; i++) {
        const minicourse = document.createElement("div");
        //const minicourseTitle = document.createElement("div");
        const minicourseImage = document.createElement("img");
        //minicourseImage.src = responseData.data[i].img_path;
        var path = responseData.data[i].img_path;
        if (path == null) {
          path = chrome.runtime.getURL("assets/dummyimage.png");
        }

        //currently onError not working properly
        minicourse.innerHTML =
          '<div class="minicourse"><img ' +
          backColorArray[Math.floor(Math.random() * 6) + 1] +
          ' src="' +
          path +
          '"></img><div class="minicoursetitle">' +
          responseData.data[i].name +
          "</div></div>";
        //imageGif.src = chrome.runtime.getURL("assets/nav/nav-gif.png"); // Set the image source
        //minicourse.appendChild(minicourseImage);
        minicourseList.appendChild(minicourse);
      }
    });
}

async function fixEmail() {
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/email-ai",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        subject: getEmailSubject(),
        html: getEmailBody(),
      }),
    }
  );

  const responseData = await response.json();
  document.getElementById("aimail").innerText = responseData.data;
}

async function sendToChatGPTAPI() {
  document.getElementById("revaaloLL").style.display = "block";

  makeDivDraggable("revaaloLLWrapper");
  locateDivPosition("revaaloLLWrapper");

  const element = document.querySelector("#revaaloLL");
  //loader
  fetch(chrome.runtime.getURL("pages/loader.html"))
    .then((r) => r.text())
    .then((html) => {
      element.innerHTML = html;
      updateLoaderTextEmail(3);
    });
  let { userToken } = await chrome.storage.local.get(["userToken"]);
  const response = await fetch(
    "https://betabackext-beta.leadlabs.app/email-score",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify({
        subject: getEmailSubject(),
        html: getEmailBody(),
      }),
    }
  );

  const responseData = await response.json();

  //console.log("Out put from API", responseData);
  //console.log("Out put from API", responseData.data);

  if (responseData) {
    fetch(chrome.runtime.getURL("pages/score.html"))
      .then((r) => r.text())
      .then((html) => {
        //document.body.insertAdjacentHTML('beforeend', html);
        element.innerHTML = html;
        // not using innerHTML as it would break js event listeners of the page
        // for now no aitab
        //document.getElementById("aitab").addEventListener("click", previewAI);
        document
          .getElementById("scoretab")
          .addEventListener("click", previewEmail);

        function previewAI() {
          // show relavent image
          document.getElementById("aimail").style.display = "block";
          document.getElementById("aitab").className = " active";

          document.getElementById("score").style.display = "none";
          document.getElementById("scoretab").className = document
            .getElementById("scoretab")
            .className.replace(" active", "");
          fixEmail();
        }

        function previewEmail() {
          // show relavent image
          document.getElementById("score").style.display = "block";
          document.getElementById("scoretab").className = " active";

          document.getElementById("aimail").style.display = "none";
          document.getElementById("aitab").className = document
            .getElementById("aitab")
            .className.replace(" active", "");
        }

        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
          acc[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
              panel.style.display = "none";
            } else {
              panel.style.display = "block";
            }
          });
        }
        // refresh score
        document
          .getElementById("refreshscore")
          .addEventListener("click", () => {
            sendToChatGPTAPI();
          });

        document.getElementById("overall-score").innerText =
          responseData.data.overall;
        if (parseInt(responseData.data.overall) < 40) {
          document.getElementById("score-grade").innerText = "Bad";
          document.getElementById("inner-circle").style.backgroundColor =
            "#C62A2F";
          document.getElementById("outer-circle").style.backgroundColor =
            "#EB9091";
        } else if (
          parseInt(responseData.data.overall) >= 40 &&
          parseInt(responseData.data.overall) <= 80
        ) {
          document.getElementById("score-grade").innerText = "Moderate";
          document.getElementById("inner-circle").style.backgroundColor =
            "#D19200";
          document.getElementById("outer-circle").style.backgroundColor =
            "#FFBA1A";
        } else {
          document.getElementById("score-grade").innerText = "Good";
        }

        document.getElementById("subject-text").innerText =
          responseData.suggestion.subject_line[
            responseData.data.subject_line.score
          ];
        document
          .getElementById("subject-score")
          .classList.add(getScoreColor(responseData.data.subject_line.score));

        document.getElementById("wordcount-text").innerText =
          responseData.suggestion.word_count[
            responseData.data.word_count.score
          ];
        document
          .getElementById("word-count")
          .classList.add(getScoreColor(responseData.data.word_count.score));

        document.getElementById("gradelevel-text").innerText =
          responseData.suggestion.grade_level[
            responseData.data.grade_level.score
          ];
        document
          .getElementById("grade-level")
          .classList.add(getScoreColor(responseData.data.grade_level.score));

        document.getElementById("clarity-text").innerText =
          responseData.suggestion.clarity[responseData.data.clarity.score];
        document
          .getElementById("clarity-score")
          .classList.add(getScoreColor(responseData.data.clarity.score));

        document.getElementById("rt-text").innerText =
          responseData.suggestion.reading_time[
            responseData.data.reading_time.score
          ];
        document
          .getElementById("rt-score")
          .classList.add(getScoreColor(responseData.data.reading_time.score));

        document.getElementById("tone-text").innerText =
          responseData.suggestion.tone[responseData.data.tone.score];
        document
          .getElementById("tone-score")
          .classList.add(getScoreColor(responseData.data.tone.score));

        document.getElementById("actionable-text").innerText =
          responseData.suggestion.actionable[
            responseData.data.actionable.score
          ];
        document
          .getElementById("actionable-score")
          .classList.add(getScoreColor(responseData.data.actionable.score));

        document.getElementById("youme-text").innerText =
          responseData.suggestion.you_me_ratio[
            responseData.data.you_me_ratio.score
          ];
        document
          .getElementById("youme-score")
          .classList.add(getScoreColor(responseData.data.you_me_ratio.score));

        document.getElementById("dw-text").innerText =
          responseData.suggestion.duplicate_words[
            responseData.data.duplicate_words.score
          ];
        document
          .getElementById("dw-score")
          .classList.add(
            getScoreColor(responseData.data.duplicate_words.score)
          );

        document.getElementById("spam-text").innerText =
          responseData.suggestion.spam_words[
            responseData.data.spam_words.score
          ];
        document
          .getElementById("spam-score")
          .classList.add(getScoreColor(responseData.data.spam_words.score));

        document.getElementById("power-text").innerText =
          responseData.suggestion.power_words[
            responseData.data.power_words.score
          ];
        document
          .getElementById("power-score")
          .classList.add(getScoreColor(responseData.data.power_words.score));

        document.getElementById("personal-text").innerText =
          responseData.suggestion.personalisation[
            responseData.data.personalisation.score
          ];
        document
          .getElementById("personal-score")
          .classList.add(
            getScoreColor(responseData.data.personalisation.score)
          );

        document.getElementById("mobile-text").innerText =
          responseData.suggestion.mobile_optimization[
            responseData.data.mobile_optimization.score
          ];
        document
          .getElementById("mobile-score")
          .classList.add(
            getScoreColor(responseData.data.mobile_optimization.score)
          );

        document.getElementById("ps-text").innerText =
          responseData.suggestion.ps_mention[
            responseData.data.ps_mention.score
          ];
        responseData.data.ps_mention.suggestion;
        document
          .getElementById("ps-score")
          .classList.add(getScoreColor(responseData.data.ps_mention.score));

        // tab and accordian functionality below
      });
  }
}
