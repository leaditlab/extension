
// Wait for the DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    const windowId = sessionStorage.getItem('chromeExtensionWindowId');

    if(windowId){
        // Select the <body> or other appropriate element
        const body = document.body;
        const html = document.documentElement;
    
        if (body) {
        // Manipulate the DOM safely
        body.style.display = 'none';
        html.style.setProperty('background-color', 'white', 'important');
        } else {
        console.error('Cannot find <body> element.');
        }
    }
  });