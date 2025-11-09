document.addEventListener("DOMContentLoaded", function () {
  var GoogleSignInButton = document.getElementById("GoogleSignIn");
  var GoogleSignUpButton = document.getElementById("GoogleSignUp");
  var statusDivSignUp = document.getElementById("statusDivSignUp");
  var loginButton = document.getElementById("signInBtnLL");
  var signoutButton = document.getElementById("signoutBtnLL");
  var manageBtnLL = document.getElementById("manageBtnLL");
  var tutorialBtnLL = document.getElementById("tutorial-ll");
  var enableGmailButton = document.getElementById("enableGmail");
  var enableLinkedInButton = document.getElementById("enableLinkedIn");
  var enableAllWebsiteButton = document.getElementById("enableAllWebsite");
  var enableEnableblitzModeButton = document.getElementById("enableblitzMode");
  var enableSignInButton = document.getElementById("enableSignIn");
  var enableSignUpButton = document.getElementById("enableSignUp");
  var createAccountButton = document.getElementById("signUpBtnLL");
  var submitOTPButton = document.getElementById("enterOTPBtnLL");

  // based on the token deside which screen to show
  // we can add the expiry etc a little later
  chrome.storage.local
    .get([
      "userToken",
      "userName",
      "userEmail",
      "enableGmail",
      "enableAllWebsite",
      "enableLinkedIn",
      "enableblitzMode",
      "OTPSentTime",
      "OTPEmail",
      "OTPName",
    ])
    .then((result) => {
      if (result.userToken) {
        document.getElementById("loginScreenLL").style.display = "none";
        document.getElementById("signUpScreenLL").style.display = "none";
        document.getElementById("signOutScreenLL").style.display = "block";
        document.getElementById("loginScreenProfileNameLL").innerText =
          result.userName;
        document.getElementById("loginScreenProfileEmailLL").innerText =
          result.userEmail;
        document.getElementById("enableGmail").checked = result.enableGmail;
        document.getElementById("enableLinkedIn").checked =
          result.enableLinkedIn;
        document.getElementById("enableAllWebsite").checked =
          result.enableAllWebsite;
        document.getElementById("enableblitzMode").checked =
          result.enableblitzMode;

        getPaymentType(result?.userToken, result.enableGmail);
      }
      // to manage OTP screen intact wait for 10 min if otp is generated
      else if (result.OTPSentTime && result.OTPEmail) {
        if (Date.now() - result.OTPSentTime < 10 * 60 * 1000) {
          document.getElementById("loginScreenLL").style.display = "none";
          document.getElementById("signOutScreenLL").style.display = "none";
          document.getElementById("signUpScreenLL").style.display = "block";

          document.getElementById("enableNameLL").style.display = "none";
          document.getElementById("enableSignUpEmailLL").style.display = "none";
          document.getElementById("enableSignUpBtn").style.display = "none";
          document.getElementById("enablePasswordBtn").style.display = "flex";
          document.getElementById("enableOTPBtn").style.display = "flex";
          document.getElementById("enableOTPSubmitBtn").style.display = "flex";
          document.getElementById("enterOTPLL").placeholder =
            "Enter OTP sent to " + result.OTPEmail;
          document.getElementById("nameLL").value = result.OTPName;
          document.getElementById("signUpEmailLL").value = result.OTPEmail;
        }
      }
    });

  async function getPaymentType(token, email) {
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/get-user-paymenttype",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ email: email }),
      }
    );

    const result = await response.json(); // parse the JSON

    document.getElementById("user-payment-type").innerText =
      result?.paymentType;
    document.getElementById("end-date").innerText = result?.currentPeriodEnd;
    // document.getElementById("remaining-day").innerText = result?.daysRemaining;
  }
  //Send OTP for creating account
  createAccountButton.addEventListener("click", async function () {
    try {
      if (
        validateEmail(document.getElementById("signUpEmailLL").value) &&
        validateName(document.getElementById("nameLL").value)
      ) {
        // Call the OTP Generate API
        const generatedOTP = await generateOTP(
          document.getElementById("signUpEmailLL").value
        );

        statusDivSignUp.innerText = generatedOTP.body;
        if (generatedOTP.body == "OTP Sent Successfully") {
          document.getElementById("enableNameLL").style.display = "none";
          document.getElementById("enableSignUpEmailLL").style.display = "none";
          document.getElementById("enableSignUpBtn").style.display = "none";
          document.getElementById("enablePasswordBtn").style.display = "flex";
          document.getElementById("enableOTPBtn").style.display = "flex";
          document.getElementById("enableOTPSubmitBtn").style.display = "flex";
          document.getElementById("enterOTPLL").placeholder =
            "Enter OTP sent to " +
            document.getElementById("signUpEmailLL").value;

          // to keep the otp screen alive
          chrome.storage.local.set({
            OTPSentTime: Date.now(),
            OTPEmail: document.getElementById("signUpEmailLL").value,
            OTPName: document.getElementById("nameLL").value,
          });
        }
      } else {
        statusDivSignUp.innerText = "Enter valid Email or Name";
      }
    } catch (error) {
      // console.log("Error Sending OTP :", error);
      statusDivSignUp.innerText = "Error: " + error.message;
    }
  });

  //create Account final button
  submitOTPButton.addEventListener("click", async function () {
    try {
      statusDivSignUp.innerText = "Creating your account. Please wait...";
      const password = document.getElementById("passwordLL").value;
      const name = document.getElementById("nameLL").value;
      const email = document.getElementById("signUpEmailLL").value;
      const otp = document.getElementById("enterOTPLL").value;

      const createdUser = await createNewAccount(name, email, password, otp);

      //statusDivSignUp.innerText = createdUser.body;
      if (createdUser.header === "success") {
        chrome.storage.local
          .set({
            userToken: createdUser.body.accessToken,
            userEmail: createdUser.body.user.eid,
            userId: createdUser.body.user.id,
            userName: createdUser.body.user.name,
            userCompanyId: createdUser.body.user.institute_id,
            enableblitzMode: createdUser.body.user.blitzmode,
            onboardingStatus: createdUser.body.user.onboardingStatus,
            enableGmail: true,
            enableAllWebsite: true,
            enableLinkedIn: true,
          })
          .then(() => {
            //console.log("Login Successfull!");
          });
        statusDiv.innerText = "Login Successfull!";

        //Change the scren to logged in
        document.getElementById("loginScreenLL").style.display = "none";
        document.getElementById("signOutScreenLL").style.display = "block";
        document.getElementById("signUpScreenLL").style.display = "none";

        document.getElementById("loginScreenProfileNameLL").innerText =
          createdUser.body.user.name;
        document.getElementById("loginScreenProfileEmailLL").innerText =
          createdUser.body.user.eid;
        document.getElementById("enableblitzMode").checked =
          createdUser.body.user.blitzmode;
        // hide create account screens
        getPaymentType(createdUser.body.accessToken, createdUser.body.user.eid);
        if (!createdUser.body.user.onboardingStatus) {
          window.open("https://www.linkedin.com/in/me/", "_blank");
        }
      }
    } catch (error) {
      // console.log("Error creating account:", error);
    }
  });

  // SignUp with Google

  GoogleSignUpButton.addEventListener("click", async function () {
    let userInfo;
    try {
      ///////////// start /////////////
      // below code is purely for bringing the user select screen after logout. ref Dev document///
      chrome.identity.clearAllCachedAuthTokens(() => {});
      let { userGoogleToken } = await chrome.storage.local.get([
        "userGoogleToken",
      ]);
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "https://accounts.google.com/o/oauth2/revoke?token=" + userGoogleToken
      );
      xhr.send();
      ////////////// end ////////////

      const user = await chrome.identity.getAuthToken({ interactive: true });
      //console.log("user --------", user);
      //console.log(chrome.identity.getAuthToken({ 'interactive': true }));

      userInfo = await getUserSignUpGoogle(user.token);

      //store the Google token so that it can be used to clearALLtokens, (selecting diffrent users)
      chrome.storage.local.set({ userGoogleToken: user.token }).then(() => {
        //console.log("Saved Google token!");
      });

      if (userInfo.header === "success") {
        chrome.storage.local
          .set({
            userToken: userInfo.body.accessToken,
            userEmail: userInfo.body.user.eid,
            userId: userInfo.body.user.id,
            userName: userInfo.body.user.name,
            userCompanyId: userInfo.body.user.institute_id,
            enableblitzMode: userInfo.body.user.blitzmode,
            onboardingStatus: userInfo.body.user.onboardingStatus,
            enableGmail: true,
            enableAllWebsite: true,
            enableLinkedIn: true,
          })
          .then(() => {
            //console.log("Login Successfull!");
          });
        statusDiv.innerText = "Login Successfull!";
        //Change the scren to logged in
        document.getElementById("loginScreenLL").style.display = "none";
        document.getElementById("signOutScreenLL").style.display = "block";
        document.getElementById("loginScreenProfileNameLL").innerText =
          userInfo.body.user.name;
        document.getElementById("loginScreenProfileEmailLL").innerText =
          userInfo.body.user.eid;
        document.getElementById("enableblitzMode").checked =
          userInfo.body.user.blitzmode;
        // hide create account screens
        document.getElementById("signUpScreenLL").style.display = "none";
        getPaymentType(userInfo.body.accessToken, userInfo.body.user.eid);
        if (!userInfo.body.user.onboardingStatus) {
          window.open("https://www.linkedin.com/in/me/", "_blank");
        }
      } else {
        statusDivSignUp.innerText = userInfo?.body;
      }
    } catch (error) {
      statusDivSignUp.innerText = userInfo?.body;
    }
  });

  // Toggle screen to signUp
  enableSignInButton.addEventListener("click", async function () {
    document.getElementById("loginScreenLL").style.display = "block";
    document.getElementById("signOutScreenLL").style.display = "none";
    document.getElementById("signUpScreenLL").style.display = "none";
    statusDiv.innerText = "";
  });
  // Toggle screen to SignIn
  enableSignUpButton.addEventListener("click", async function () {
    document.getElementById("loginScreenLL").style.display = "none";
    document.getElementById("signOutScreenLL").style.display = "none";
    document.getElementById("signUpScreenLL").style.display = "block";
    statusDivSignUp.innerText = "";

    document.getElementById("enableNameLL").style.display = "flex";
    document.getElementById("enableSignUpEmailLL").style.display = "flex";
    document.getElementById("enableSignUpBtn").style.display = "flex";
    document.getElementById("enablePasswordBtn").style.display = "none";
    document.getElementById("enableOTPBtn").style.display = "none";
    document.getElementById("enableOTPSubmitBtn").style.display = "none";
  });

  // add event for SignOut
  //after signout the key of shepherd js (we have 2 shepherd js so two status) should not removed before we clear store te value in temp and
  // assign after clearing so that shepherd will not come once again.
  //as like that we are storing the status for minimize and tutorialStatus status
  signoutButton.addEventListener("click", async function () {
    try {
      // Step 1: Preserve tour states from chrome.storage.local
      chrome.storage.local.get(
        [
          "initialShepherdTourState",
          "shepherdTourState",
          "tutorialStatus",
          "minimizeStatus",
        ],
        (result) => {
          const tourState = result.initialShepherdTourState;
          const tempshepherdTourState = result.shepherdTourState;
          const temptutorialStatus = result.tutorialStatus;
          const tempminimizeStatus = result.minimizeStatus;
          // Step 2: Clear all of chrome.storage.local
          chrome.storage.local.clear().then(() => {
            const restoreData = {};

            // Step 3: Restore tour states if they existed
            if (tourState !== undefined) {
              restoreData.initialShepherdTourState = tourState;
            }
            if (tempshepherdTourState !== undefined) {
              restoreData.shepherdTourState = tempshepherdTourState;
            }
            if (temptutorialStatus !== undefined) {
              restoreData.tutorialStatus = temptutorialStatus;
            }
            if (tempminimizeStatus !== undefined) {
              restoreData.minimizeStatus = tempminimizeStatus;
            }
            if (Object.keys(restoreData).length > 0) {
              chrome.storage.local.set(restoreData, () => {
                console.log("Preserved tour state(s) during logout.");
              });
            }

            // Step 4: Clear localStorage and sessionStorage
            completeLogout();

            // Step 5: Update UI
            document.getElementById("loginScreenLL").style.display = "block";
            document.getElementById("signOutScreenLL").style.display = "none";
            document.getElementById("signUpScreenLL").style.display = "none";
            statusDiv.innerText = "Sign out successful!";
          });
        }
      );
    } catch (error) {
      console.error("Error Signing Out:", error);
    }
  });

  function completeLogout() {
    // Remove cached auth token
    chrome.identity.getAuthToken({ interactive: false }, function (token) {
      if (token) {
        chrome.identity.removeCachedAuthToken({ token: token }, function () {
          // Revoke the token on Google's servers
          fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
        });
      }
    });

    // Clear local and session storage
    localStorage.clear();
    sessionStorage.clear();
  }

  //for strip intigation
  manageBtnLL.addEventListener("click", async function () {
    const email = document.getElementById(
      "loginScreenProfileEmailLL"
    ).innerText;
    const link = await getLink(email);

    if (link) {
      window.open(link, "_blank"); // Open in a new tab
    } else {
      console.error("No link returned");
    }
  });

  tutorialBtnLL.addEventListener("click", async function () {
    const link = await gettutorialLink();

    if (link) {
      window.open(link, "_blank"); // Open in a new tab
    } else {
      console.error("No link returned");
    }
  });

  // add event for SignOut
  GoogleSignInButton.addEventListener("click", async function () {
    try {
      ///////////// start /////////////
      // below code is purely for bringing the user select screen after logout. ref Dev document///
      chrome.identity.clearAllCachedAuthTokens(() => {
        //console.log("Logged out!");
      });
      let { userGoogleToken } = await chrome.storage.local.get([
        "userGoogleToken",
      ]);
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        "https://accounts.google.com/o/oauth2/revoke?token=" + userGoogleToken
      );
      xhr.send();
      ////////////// end ////////////

      const user = await chrome.identity.getAuthToken({ interactive: true });

      //console.log(chrome.identity.getAuthToken({ 'interactive': true }));

      const userInfo = await getUserSignInGoogle(user.token);

      //store the Google token so that it can be used to clearALLtokens, (selecting diffrent users)
      chrome.storage.local.set({ userGoogleToken: user.token }).then(() => {
        //console.log("Saved Google token!");
      });

      chrome.storage.local
        .set({
          userToken: userInfo.body.accessToken,
          userEmail: userInfo.body.user.eid,
          userId: userInfo.body.user.id,
          userName: userInfo.body.user.name,
          userCompanyId: userInfo.body.institute_id,
          enableblitzMode: userInfo.body.user.blitzmode,
          onboardingStatus: userInfo.body.user.onboardingStatus,
          enableGmail: true,
          enableAllWebsite: true,
          enableLinkedIn: true,
        })
        .then(() => {
          //console.log("Login Successfull!");
        });
      statusDiv.innerText = "Login Successfull!";
      //Change the scren to logged in
      document.getElementById("loginScreenLL").style.display = "none";
      document.getElementById("signOutScreenLL").style.display = "block";
      document.getElementById("loginScreenProfileNameLL").innerText =
        userInfo.body.user.name;
      document.getElementById("enableblitzMode").checked =
        userInfo.body.user.blitzmode;
      document.getElementById("loginScreenProfileEmailLL").innerText =
        userInfo.body.user.eid;
      if (!userInfo.body.user.onboardingStatus) {
        window.open("https://www.linkedin.com/in/me/", "_blank");
      }
      getPaymentType(userInfo.body.accessToken, userInfo.body.user.eid);
    } catch (error) {
      statusDiv.innerText = "Error: " + error.message;
    }
  });

  // add event for Login
  loginButton.addEventListener("click", async function () {
    try {
      const user = document.getElementById("emailLL").value;
      const key = document.getElementById("passwordLL").value;
      const userInfo = await getUserSignIn(user, key);

      chrome.storage.local
        .set({
          userToken: userInfo.body.accessToken,
          userEmail: userInfo.body.user.eid,
          userId: userInfo.body.user.id,
          userName: userInfo.body.user.name,
          userCompanyId: userInfo.body.user.institute_id,
          enableblitzMode: userInfo.body.user.blitzmode,
          onboardingStatus: userInfo.body.user.onboardingStatus,
          enableGmail: true,
          enableAllWebsite: true,
          enableLinkedIn: true,
        })
        .then(() => {
          //console.log("Login Successfull!");
        });
      statusDiv.innerText = "Login Successfull!";
      //Change the scren to logged in
      document.getElementById("loginScreenLL").style.display = "none";
      document.getElementById("signUpScreenLL").style.display = "none";
      document.getElementById("signOutScreenLL").style.display = "block";
      document.getElementById("loginScreenProfileNameLL").innerText =
        userInfo.body.user.name;
      document.getElementById("loginScreenProfileEmailLL").innerText =
        userInfo.body.user.eid;
      document.getElementById("enableblitzMode").checked =
        userInfo.body.user.blitzmode;
      if (!userInfo.body.user.onboardingStatus) {
        window.open("https://www.linkedin.com/in/me/", "_blank");
      }
      getPaymentType(userInfo.body.accessToken, userInfo.body.user.eid);
    } catch (error) {
      statusDiv.innerText = error.message;
    }
  });

  enableGmailButton.addEventListener("click", async function () {
    chrome.storage.local.set({ enableGmail: enableGmailButton.checked });
  });

  enableLinkedInButton.addEventListener("click", async function () {
    chrome.storage.local.set({ enableLinkedIn: enableLinkedInButton.checked });
  });

  enableEnableblitzModeButton.addEventListener("click", async function () {
    ChangeBlitzMode(enableEnableblitzModeButton.checked);
  });

  var floatContainer = document.getElementById("floatContainer");
  enableAllWebsiteButton.addEventListener("click", async function () {
    const isChecked = enableAllWebsiteButton.checked;

    // Update the storage with the checkbox state
    chrome.storage.local.set({
      enableAllWebsite: isChecked,
    });

    // Show or hide the floatContainer only if it exists
    if (floatContainer) {
      floatContainer.style.display = isChecked ? "block" : "none";
    }
  });
  /* ------------- utits ----------------------------*/

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validateName = (name) => {
    // name should hav minimum of two characters
    return String(name)
      .toLowerCase()
      .match(/^.{2,}$/);
  };

  const validateOTP = (otp) => {
    return String(email)
      .toLowerCase()
      .match(/^\d{6}$/);
  };

  async function generateOTP(email) {
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/api/auth/generateotpemail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );

    /*     if (!response.ok) {
      throw new Error(response.body);
    } */

    return await response.json();
  }

  async function getLink(email) {
    let { userToken } = await chrome.storage.local.get(["userToken"]);

    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({ email: email }),
      }
    );

    const result = await response.json(); // parse the JSON
    return result?.url;
  }
  async function gettutorialLink() {
    let { userToken } = await chrome.storage.local.get(["userToken"]);

    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/get-tutorial-link",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      }
    );

    const result = await response.json(); // parse the JSON
    return result?.link;
  }

  async function createNewAccount(name, email, password, otp) {
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/api/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eid: email,
          firstname: name,
          confirmpassword: password,
          otp: otp,
        }),
      }
    );

    if (!response.ok) {
      if (response.status == 401) {
        return { body: "Invalid OTP" };
      } else if (response.status == 402) {
        return { body: "User Already Registered. Please Sign In." };
      } else if (response.status == 404) {
        return { body: "Couldn't create account." };
      }
      //throw new Error('Error Creating Account');
    }
    return await response.json();
  }

  async function getUserSignIn(user, key) {
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/api/auth/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          eid: user,
          key: key,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Invalid Email or Password");
    }

    return await response.json();
  }

  async function getUserSignInGoogle(token) {
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/api/auth/google/signin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          googleToken: token,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("User not found");
    }

    return await response.json();
  }

  async function getUserSignUpGoogle(token) {
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/api/auth/google/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          googleToken: token,
        }),
      }
    );

    if (!response.ok) {
      if (response.status == 401) {
        return { body: "User Already Registered. Please Sign In." };
      } else if (response.status == 402) {
        return { body: "Invalid Google Token." };
      } else if (response.status == 404) {
        return { body: "Couldn't create account." };
      }
      //throw new Error('Error Creating Account');
    }
    return await response.json();
  }

  async function ChangeBlitzMode(status) {
    let { userToken } = await chrome.storage.local.get(["userToken"]);
    const response = await fetch(
      "https://betabackext-beta.leadlabs.app/api/update/blitzmode",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        body: JSON.stringify({
          status: status,
        }),
      }
    );

    const responseData = await response.json();
    if (responseData?.header === "success") {
      chrome.storage.local.set({
        enableblitzMode: responseData?.blitzmode,
      });
    }
  }
});

/* const apiKeyInput = document.getElementById('apiKeyInput');
const signatureDelimiterInput = document.getElementById('signatureDelimiter');
const editApiKeyButton = document.getElementById('editApiKeyButton');
const saveButton = document.getElementById('saveButton'); */

/* saveButton.addEventListener("click", () => {
  const apiKey = apiKeyInput.value;
  const signatureDelimiter = signatureDelimiterInput.value;
  chrome.storage.sync.set({ apiKey, signatureDelimiter }, () => {
    alert("API key and signature delimiter saved.");
    apiKeyInput.readOnly = true;
    apiKeyInput.type = 'password';
  });
});

document.getElementById("reviewButton").addEventListener("click", () => {
  const selectedStyles = Array.from(document.querySelectorAll('input[name="style"]:checked')).map(input => input.value);

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "reviewEmail", styles: selectedStyles });
  });
});

chrome.storage.sync.get(["apiKey", "signatureDelimiter"], result => {
  apiKeyInput.value = result.apiKey || '';

  if (result.signatureDelimiter) {
    signatureDelimiterInput.value = result.signatureDelimiter;
  }
});

editApiKeyButton.addEventListener('click', () => {
  apiKeyInput.readOnly = false;
  apiKeyInput.type = 'text';
  apiKeyInput.focus();
});
 */
