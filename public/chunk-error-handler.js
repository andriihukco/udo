// Chunk error handler script
(function () {
  // Store original error handler
  var originalErrorHandler = window.onerror;

  // Custom error handler
  window.onerror = function (message, source, lineno, colno, error) {
    // Check if it's a chunk loading error
    if (
      error &&
      (error.name === "ChunkLoadError" ||
        message.includes("Loading chunk") ||
        message.includes("failed") ||
        message.includes("timeout"))
    ) {
      console.log("Detected chunk loading error, attempting to recover...");

      // Clear cache in localStorage
      try {
        var keys = Object.keys(localStorage);
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].startsWith("next-")) {
            localStorage.removeItem(keys[i]);
          }
        }
      } catch (e) {
        console.error("Failed to clear localStorage cache:", e);
      }

      // Try to reload the page after a short delay
      setTimeout(function () {
        console.log("Reloading page to recover from chunk loading error...");
        window.location.reload(true); // Force reload from server
      }, 1000);

      return true; // Error handled
    }

    // Pass to original handler if not a chunk loading error
    if (originalErrorHandler) {
      return originalErrorHandler(message, source, lineno, colno, error);
    }

    return false; // Not handled
  };

  // Add event listener for unhandled rejections
  window.addEventListener("unhandledrejection", function (event) {
    if (
      event.reason &&
      (event.reason.name === "ChunkLoadError" ||
        (event.reason.message &&
          event.reason.message.includes("Loading chunk")) ||
        (event.reason.message && event.reason.message.includes("failed")) ||
        (event.reason.message && event.reason.message.includes("timeout")))
    ) {
      console.log("Detected chunk loading rejection, attempting to recover...");

      // Clear cache in localStorage
      try {
        var keys = Object.keys(localStorage);
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].startsWith("next-")) {
            localStorage.removeItem(keys[i]);
          }
        }
      } catch (e) {
        console.error("Failed to clear localStorage cache:", e);
      }

      // Try to reload the page after a short delay
      setTimeout(function () {
        console.log(
          "Reloading page to recover from chunk loading rejection..."
        );
        window.location.reload(true); // Force reload from server
      }, 1000);

      event.preventDefault(); // Prevent default handling
    }
  });

  console.log("Chunk error handler installed");
})();
