function shepherdInjection() {
  (function () {
    // Prevent multiple injections
    if (window.shepherdTourLoaded) {
      return;
    }
    window.shepherdTourLoaded = true;

    // Enhanced tour state management
    const TOUR_STORAGE_KEY = "shepherdTourState";
    const TOUR_STATES = {
      NOT_STARTED: "not_started",
      COMPLETED: "completed",
      SKIPPED: "skipped",
      DISMISSED: "dismissed",
    };

    // Chrome Storage Helper Functions
    function getTourState() {
      return new Promise((resolve) => {
        chrome.storage.local.get([TOUR_STORAGE_KEY], (result) => {
          resolve(result[TOUR_STORAGE_KEY] || null);
        });
      });
    }

    function setTourState(state) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [TOUR_STORAGE_KEY]: state }, () => {
          console.log(`Tour state set to: ${state}`);
          resolve();
        });
      });
    }

    // Check if tour should be shown
    async function shouldShowTour() {
      const tourState = await getTourState();
      return !tourState || tourState === TOUR_STATES.NOT_STARTED;
    }

    // Function to wait for elements to be available
    function waitForElement(selector, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }

        const observer = new MutationObserver((mutations, obs) => {
          const element = document.querySelector(selector);
          if (element) {
            obs.disconnect();
            resolve(element);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        setTimeout(() => {
          observer.disconnect();
          reject(
            new Error(`Element ${selector} not found within ${timeout}ms`)
          );
        }, timeout);
      });
    }

    // Function to initialize the tour
    async function initializeTour() {
      if (!window.Shepherd) {
        console.error("Shepherd.js not loaded");
        return;
      }

      // Early exit if tour shouldn't be shown
      if (!(await shouldShowTour())) {
        console.log("Tour already completed/skipped, not showing again");
        return;
      }

      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          scrollTo: { behavior: "smooth", block: "center" },
          cancelIcon: { enabled: true },
          modalOverlayOpeningPadding: 4,
          when: {
            show() {
              const attachTo = this.options.attachTo;
              if (attachTo && attachTo.element) {
                const element = document.querySelector(attachTo.element);
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }
            },
          },
        },
      });

      // Add steps 1
      try {
        await waitForElement("#profileCardLL", 60000);
        tour.addStep({
          id: "step1",
          title: "One Click Data Collection",
          text: "Organize 32+ signals from various sources in real-time with one click.",

          attachTo: {
            element: "#profileAnalysis",
            on: "left",
          },
          buttons: [
            {
              text: "Next",
              classes: "shepherd-button-primary",
              action: () => {
                previewSection("parsonaListingDetails");
                tour.next(); // Proceed to next step
              },
            },
          ],
        });
      } catch (error) {
        console.warn("Step 1 element not found:", error.message);
        tour.addStep({
          id: "step1",
          title: "One Click Data Collection",
          text: "Organize 32+ signals from various sources in real-time with one click.",
          buttons: [
            {
              text: "Next",
              classes: "shepherd-button-primary",
              action: () => {
                previewSection("parsonaListingDetails");
                tour.next();
              },
            },
          ],
        });
      }

      //step 2 for persona creation
      try {
        await waitForElement("#parsonaListing", 20000);
        tour.addStep({
          id: "step4",
          title: "Settings",
          text: "Customize all your personas, create custom signals, manage existing signals, custom messaging frameworks and billing.",
          attachTo: {
            element: "#parsonaListing",
            on: "left",
          },
          buttons: [
            {
              text: "Back",
              classes: "shepherd-button-secondary",
              action: () => {
                previewSection("profileAnalysisDetails");
                tour.back();
              },
            },
            {
              text: "Next",
              classes: "shepherd-button-primary",
              action: () => {
                previewSection("searchPrompt");
                tour.next();
              },
            },
          ],
        });
      } catch (error) {
        console.warn("Step 4 element not found:", error.message);
        tour.addStep({
          id: "step4",
          title: "Settings",
          text: "Customize all your personas, create custom signals, manage existing signals, custom messaging frameworks and billing.",
          buttons: [
            {
              text: "Back",
              classes: "shepherd-button-secondary",
              action: () => {
                previewSection("profileAnalysisDetails");
                tour.back();
              },
            },
            {
              text: "Next",
              classes: "shepherd-button-primary",
              action: () => {
                previewSection("searchPrompt");
                tour.next();
              },
            },
          ],
        });
      }

      //step 3 for AI serach creation
      try {
        await waitForElement("#search", 20000);
        tour.addStep({
          id: "step5",
          title: "AI Web Search",
          text: "Execute real-time web search or run custom search workflows with Perplexity without switching tabs.",
          attachTo: {
            element: "#search",
            on: "left",
          },
          buttons: [
            {
              text: "Back",
              classes: "shepherd-button-secondary",
              action: () => {
                previewSection("parsonaListingDetails");
                tour.back();
              },
            },
            {
              text: "Finish",
              classes: "shepherd-button-primary",
              action: async () => {
                await setTourState(TOUR_STATES.COMPLETED);
                previewSection("profileAnalysisDetails");
                tour.complete();
              },
            },
          ],
        });
      } catch (error) {
        console.warn("Step 5 element not found:", error.message);
        tour.addStep({
          id: "step5",
          title: "AI Web Search",
          text: "Execute real-time web search or run custom search workflows with Perplexity without switching tabs.",
          buttons: [
            {
              text: "Back",
              classes: "shepherd-button-secondary",
              action: () => {
                previewSection("parsonaListingDetails");
                tour.back();
              },
            },
            {
              text: "Finish",
              classes: "shepherd-button-primary",
              action: async () => {
                await setTourState(TOUR_STATES.COMPLETED);
                previewSection("profileAnalysisDetails");
                tour.complete();
              },
            },
          ],
        });
      }

      //step 4 for email generation
      // try {
      //   await waitForElement("#emailCreation", 20000);
      //   tour.addStep({
      //     id: "step6",
      //     title: "Message Co-Pilot",
      //     text: "One stop solution for custom messaging, follow-ups, and tuning existing messages based on buyer personality.",
      //     attachTo: {
      //       element: "#emailCreation",
      //       on: "left",
      //     },
      //     buttons: [
      //       {
      //         text: "Back",
      //         classes: "shepherd-button-secondary",
      //         action: () => {
      //           previewSection("emailCreationDetails");
      //           tour.back();
      //         },
      //       },

      //       {
      //         text: "Finish",
      //         classes: "shepherd-button-primary",
      //         action: async () => {
      //           await setTourState(TOUR_STATES.COMPLETED);
      //           previewSection("profileAnalysisDetails");
      //           tour.complete();
      //         },
      //       },
      //     ],
      //   });
      // } catch (error) {
      //   console.warn("Step 2 element not found:", error.message);
      //   tour.addStep({
      //     id: "step6",
      //     title: "Message Co-Pilot",
      //     text: "One stop solution for custom messaging, follow-ups, and tuning existing messages based on buyer personality.",
      //     buttons: [
      //       {
      //         text: "Back",
      //         classes: "shepherd-button-secondary",
      //         action: () => {
      //           previewSection("emailCreationDetails");
      //           tour.back();
      //         },
      //       },
      //       {
      //         text: "Finish",
      //         classes: "shepherd-button-primary",
      //         // action: async () => {
      //         //   await setTourState(TOUR_STATES.COMPLETED);
      //         //   tour.complete();
      //         // },
      //         action: () => {
      //           setTourState(TOUR_STATES.COMPLETED).then(() => {
      //             tour.complete();
      //           });
      //         },
      //       },
      //     ],
      //   });
      // }
      // Enhanced event handling
      tour.on("complete", async () => {
        console.log("Tour completed");
        await setTourState(TOUR_STATES.COMPLETED);
      });

      tour.on("cancel", async () => {
        console.log("Tour cancelled");
        // Only set to dismissed if not already skipped
        const currentState = await getTourState();
        if (currentState !== TOUR_STATES.SKIPPED) {
          await setTourState(TOUR_STATES.DISMISSED);
        }
      });

      // Handle when user clicks the X button or presses ESC
      tour.on("hide", async () => {
        const currentState = await getTourState();
        if (!currentState || currentState === TOUR_STATES.NOT_STARTED) {
          await setTourState(TOUR_STATES.DISMISSED);
        }
      });

      // Start the tour
      console.log("Starting Shepherd tour");
      tour.start();
    }

    // Reset function (for development/testing)
    function resetTour() {
      chrome.storage.local.remove([TOUR_STORAGE_KEY], () => {
        console.log("Tour state reset - tour will show on next page load");
      });
    }

    // Expose reset function globally for debugging
    window.resetShepherdTour = resetTour;

    // Main initialization
    async function init() {
      try {
        if (document.readyState === "loading") {
          await new Promise((resolve) => {
            document.addEventListener("DOMContentLoaded", resolve);
          });
        }

        // Wait for Shepherd to be available
        let attempts = 0;
        while (!window.Shepherd && attempts < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.Shepherd) {
          throw new Error("Shepherd.js failed to load");
        }

        await initializeTour();
      } catch (error) {
        console.error("Failed to initialize Shepherd tour:", error);
      }
    }

    // Start initialization
    init();
  })();

  function previewSection(sectionKey) {
    // Hide all tabcontent sections
    document.querySelectorAll(".tabcontent").forEach(function (div) {
      div.style.display = "none";
    });
    if (sectionKey === "companyDetailsBlock") {
      loadCompanyDetails("profileCardLL");
    }
    if (sectionKey === "parsonaListingDetails") {
      const parentElement = document.getElementById("parsonaListingDetails");
      if (parentElement) {
        const childElements = Array.from(parentElement.children);

        childElements.slice(0, -1).forEach(function (child) {
          child.style.display = "none";
        });

        const lastChild = childElements[childElements.length - 1];
        if (lastChild) {
          lastChild.style.display = "flex";
        }

        parentElement.style.display = "block";
      }
    } else {
      const target = document.getElementById(sectionKey);
      if (target) {
        target.style.display = "block";
      }
    }
  }
}
function initialShepherdInjection() {
  (function () {
    if (window.initialShepherdTourLoaded) return;
    window.initialShepherdTourLoaded = true;

    const TOUR_STORAGE_KEY = "initialShepherdTourState";
    const TOUR_STATES = {
      NOT_STARTED: "not_started",
      COMPLETED: "completed",
      SKIPPED: "skipped",
      DISMISSED: "dismissed",
    };

    function getTourState() {
      return new Promise((resolve) => {
        chrome.storage.local.get([TOUR_STORAGE_KEY], (result) => {
          resolve(result[TOUR_STORAGE_KEY] || null);
        });
      });
    }

    function setTourState(state) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [TOUR_STORAGE_KEY]: state }, () => {
          console.log(`Tour state set to: ${state}`);
          resolve();
        });
      });
    }

    function waitForElement(selector, timeout = 10000) {
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }

        const observer = new MutationObserver((mutations, obs) => {
          const element = document.querySelector(selector);
          if (element) {
            obs.disconnect();
            resolve(element);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        setTimeout(() => {
          observer.disconnect();
          reject(
            new Error(`Element ${selector} not found within ${timeout}ms`)
          );
        }, timeout);
      });
    }

    async function shouldShowTour() {
      const tourState = await getTourState();
      return !tourState || tourState === TOUR_STATES.NOT_STARTED;
    }

    async function initializeTour() {
      if (!window.Shepherd) {
        console.error("Shepherd.js not loaded");
        return;
      }

      if (!(await shouldShowTour())) {
        console.log(
          "Initial tour already completed/skipped, not showing again"
        );
        return;
      }

      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          scrollTo: { behavior: "smooth", block: "center" },
          cancelIcon: { enabled: true },
          modalOverlayOpeningPadding: 4,
          when: {
            show() {
              const attachTo = this.options.attachTo;
              if (attachTo && attachTo.element) {
                const element = document.querySelector(attachTo.element);
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }
            },
          },
        },
      });

      /*       try {
        await waitForElement("#analyseLL", 20000);
        tour.addStep({
          id: "init-step-1",
          title: "Analyze Content",
          text: "Click here to start analyzing the content before writing or commenting.",
          attachTo: {
            element: "#analyseLL",
            on: "bottom",
          },
          buttons: [
            {
              text: "Next",
              classes: "shepherd-button-primary",
              action: () => tour.next(),
            },
          ],
        });
      } catch (err) {
        console.warn("analyseLL not found:", err.message);
      } */

      /*       try {
        await waitForElement("#selfWrittenBtnLL", 10000);
        tour.addStep({
          id: "init-step-2",
          title: "Self-Written Option",
          text: "Use this to write your own content manually.",
          attachTo: {
            element: "#selfWrittenBtnLL",
            on: "top",
          },
          buttons: [
            {
              text: "Back",
              classes: "shepherd-button-secondary",
              action: () => tour.back(),
            },
            {
              text: "Next",
              classes: "shepherd-button-primary",
              action: () => tour.next(),
            },
          ],
        });
      } catch (err) {
        console.warn("selfWrittenBtnLL not found:", err.message);
      } */

      /*       try {
        await waitForElement("#writeCommentBtnLL", 10000);
        tour.addStep({
          id: "init-step-3",
          title: "Comment Generator",
          text: "Click here to generate a comment using AI.",
          attachTo: {
            element: "#writeCommentBtnLL",
            on: "top",
          },
          buttons: [
            {
              text: "Back",
              classes: "shepherd-button-secondary",
              action: () => tour.back(),
            },
            {
              text: "Next",
              classes: "shepherd-button-primary",
              action: () => tour.next(),
            },
          ],
        });
      } catch (err) {
        console.warn("writeCommentBtnLL not found:", err.message);
      } */

      try {
        await waitForElement("#getCanvas", 10000);
        tour.addStep({
          id: "init-step-4",
          title: "Introducing Canvas",
          text: "Canvas lets you run any complex workflow using perplexity, Claude, and GPT in one click.",
          attachTo: {
            element: "#getCanvas",
            on: "top",
          },
          buttons: [
            /*             {
              text: "Back",
              classes: "shepherd-button-secondary",
              action: () => tour.back(),
            }, */
            {
              text: "Nice, Got it!",
              classes: "shepherd-button-primary",
              // action: async () => {
              //   await setTourState(TOUR_STATES.COMPLETED);
              //   tour.complete();
              // },
              action: () => {
                setTourState(TOUR_STATES.COMPLETED).then(() => {
                  tour.complete();
                });
              },
            },
          ],
        });
      } catch (err) {
        console.warn("getCanvas not found:", err.message);
      }

      tour.on("complete", async () => {
        console.log("Initial Shepherd tour completed");
        await setTourState(TOUR_STATES.COMPLETED);
      });

      tour.on("cancel", async () => {
        const currentState = await getTourState();
        if (currentState !== TOUR_STATES.SKIPPED) {
          await setTourState(TOUR_STATES.DISMISSED);
        }
      });

      tour.on("hide", async () => {
        const currentState = await getTourState();
        if (!currentState || currentState === TOUR_STATES.NOT_STARTED) {
          await setTourState(TOUR_STATES.DISMISSED);
        }
      });

      console.log("Starting Initial Shepherd tour");
      tour.start();
    }

    function resetTour() {
      chrome.storage.local.remove([TOUR_STORAGE_KEY], () => {});
    }

    window.resetInitialShepherdTour = resetTour;
    async function init() {
      try {
        if (document.readyState === "loading") {
          await new Promise((resolve) => {
            document.addEventListener("DOMContentLoaded", resolve);
          });
        }

        // Wait for Shepherd to be available
        let attempts = 0;
        while (!window.Shepherd && attempts < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        if (!window.Shepherd) {
          throw new Error("Shepherd.js failed to load");
        }

        await initializeTour();
      } catch (error) {
        console.error("Failed to initialize Shepherd tour:", error);
      }
    }

    init();
  })();
}
