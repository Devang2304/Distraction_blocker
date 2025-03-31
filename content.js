function isVideoPage() {
    return window.location.pathname.includes('/watch');
}

function applyBlockingStyle() {
    if(isVideoPage()){
        const styleElement = document.createElement('style');
        styleElement.textContent = `
      ytd-watch-next-secondary-results-renderer {
        display: none !important;
      }
      
      ytd-item-section-renderer {
        display: none !important;
      }
      
      .ytp-endscreen-content {
        display: none !important;
      }
      
      ytd-watch-flexy #primary {
        max-width: 100% !important;
        width: 100% !important;
      }
      
      ytd-watch-flexy #secondary {
        display: none !important;
      }
    `;
    document.head.appendChild(styleElement);
    console.log("Youtube Focus Mode Activated");
    }
}

applyBlockingStyle();

let lastUrl = location.href;
new MutationObserver(()=>{
    const url = location.href;
    if(url !== lastUrl){
        lastUrl = url;
        applyBlockingStyle();
        setTimeout(applyBlockingStyle, 500);
    }
}).observe(document, {subtree: true, childList: true});