function isYouTubeVideoPage() {
    return window.location.hostname.includes('youtube.com') && 
           window.location.pathname.includes('/watch');
}

function applyYouTubeBlockingStyle() {
    if(isYouTubeVideoPage()){
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
    console.log("YouTube Focus Mode Activated");
    }
}


const defaultBlockedKeywords = [
    // Adult content - General
    "porn", "xxx", "adult", "nsfw", "explicit", "sex", "sexual", "nude", "naked",
    "pornography", "erotic", "mature", "adult content", "adult site", "adult video",
    "adult material", "adult entertainment", "adult media", "adult web", "adult tube",
    "adult dating", "adult chat", "adult forum", "adult blog", "adult store",
    "adult shop", "adult toys", "adult products", "adult services", "adult industry",
    
    // Kissing related
    "kiss", "kissing", "make out", "making out", "french kiss", "french kissing",
    "deep kiss", "deep kissing", "tongue kiss", "tongue kissing", "passionate kiss",
    "passionate kissing", "romantic kiss", "romantic kissing", "smooch", "smooching",
    "peck", "pecking", "snog", "snogging", "necking", "neck", "neck kiss",
    "neck kissing", "ear kiss", "ear kissing", "lip lock", "lip locking",
    "lip kiss", "lip kissing", "mouth kiss", "mouth kissing", "soul kiss",
    "soul kissing", "wet kiss", "wet kissing", "spit swap", "spit swapping",
    "makeout session", "kissing session", "kiss and tell", "kiss cam",
    "kiss scene", "kissing scene", "kiss video", "kissing video",
    "kiss clip", "kissing clip", "kiss movie", "kissing movie",
    "kiss film", "kissing film", "kiss show", "kissing show",
    
    // Adult content - Specific terms
    "hentai", "ecchi", "doujinshi", "yaoi", "yuri", "lolicon", "shotacon",
    "bdsm", "fetish", "kink", "bondage", "domination", "submission",
    "escort", "prostitute", "hooker", "call girl", "massage parlor",
    "strip club", "strip tease", "lap dance", "peep show",
    "sex worker", "sex industry", "sex trade", "sex business",
    "sex shop", "sex store", "sex toys", "sex products",
    "sex chat", "sex dating", "sex forum", "sex blog",
    "sex video", "sex clip", "sex movie", "sex film",
    "sex scene", "sex act", "sex show", "sex performance",
    
    // Adult content - Websites
    "pornhub", "xvideos", "xnxx", "xhamster", "redtube", "youporn",
    "brazzers", "bangbros", "reality kings", "naughty america",
    "onlyfans", "chaturbate", "myfreecams", "streamate",
    "myfreecams", "bongacams", "stripchat", "cam4", "livejasmin",
    "adultfriendfinder", "ashleymadison", "seeking", "sugardaddy",
    "sugarbaby", "escort directory", "escort site", "escort service",
    
    // Adult content - Categories
    "amateur", "professional", "homemade", "webcam", "live cam",
    "streaming", "video chat", "private show", "custom content",
    "hardcore", "softcore", "lesbian", "gay", "bisexual",
    "transgender", "transsexual", "shemale", "ladyboy",
    "teen", "mature", "milf", "dildo", "vibrator",
    "sex doll", "fleshlight", "butt plug", "anal toy",
    "lingerie", "underwear", "bra", "panties", "stockings",
    "garter", "corset", "bikini", "swimsuit", "lingerie",
    
    // Adult content - Actions
    "masturbate", "masturbation", "jerk off", "jack off",
    "fingering", "oral", "anal", "vaginal", "penetration",
    "threesome", "orgy", "swinger", "swapping", "wife swap",
    "cuckold", "cuck", "bull", "hotwife", "stag", "vixen",
    
    // Adult content - Body parts
    "breast", "boob", "tit", "ass", "butt", "pussy", "vagina",
    "penis", "cock", "dick", "clit", "clitoris", "anus",
    "butthole", "nipple", "areola", "labia", "vulva",
    
    // Violence
    "violence", "gore", "blood", "death", "kill",
    
    // Hate speech
    "hate", "racist", "sexist", "homophobic", "antisemitic"
];


function checkForBlockedKeywords() {
    chrome.storage.sync.get({ 
        blockedKeywords: defaultBlockedKeywords,
        enabled: true
    }, function(data) {
        if (!data.enabled) {
            return;
        }
        
        if (data.blockedKeywords.length === 0) {
            return;
        }
        
        // Get page content and metadata
        const pageText = document.body.innerText.toLowerCase();
        const pageTitle = document.title.toLowerCase();
        const metaDescription = document.querySelector('meta[name="description"]')?.content?.toLowerCase() || '';
        const url = window.location.href.toLowerCase();
        
        // Check for keywords in different context
        const foundKeyword = data.blockedKeywords.find(keyword => {
            const lowerKeyword = keyword.toLowerCase();
            
            // Skip empty or invalid keywords
            if (!lowerKeyword || lowerKeyword.length < 3) {
                return false;
            }
            
            // Check if keyword is part of a larger word (to avoid false positives)
            const wordBoundary = new RegExp(`\\b${lowerKeyword}\\b`, 'i');
            
            // Check different contexts with different weights
            const inTitle = pageTitle.includes(lowerKeyword);
            const inMeta = metaDescription.includes(lowerKeyword);
            const inUrl = url.includes(lowerKeyword);
            const inContent = wordBoundary.test(pageText);
            
            // Block if keyword appears in title, meta description, or URL
            // For content, require multiple occurrences or specific context
            return inTitle || inMeta || inUrl || (inContent && pageText.split(lowerKeyword).length > 2);
        });
        
        if (foundKeyword) {
            blockPage(foundKeyword);
        }
    });
}

function blockPage(keyword) {
    
    const originalContent = document.documentElement.innerHTML;
    
    
    document.body.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: white;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
        ">
            <h1 style="color: #333; margin-bottom: 20px;">Page Blocked</h1>
            <p style="color: #666; max-width: 80%; text-align: center;">
                This page contains blocked content: "${keyword}"
            </p>
            <button id="unblockButton" style="
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #4285f4;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">Unblock for 5 minutes</button>
        </div>
    `;
    
    
    document.getElementById('unblockButton').addEventListener('click', function() {
        
        document.documentElement.innerHTML = originalContent;
        
        
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src) {
                const newScript = document.createElement('script');
                newScript.src = scripts[i].src;
                document.head.appendChild(newScript);
            }
        }
        
        
        setTimeout(function() {
            checkForBlockedKeywords();
        }, 5 * 60 * 1000); 
    });
}


function initialize() {
    
    if (window.location.hostname.includes('youtube.com')) {
        applyYouTubeBlockingStyle();
    }
    
    
    checkForBlockedKeywords();
}


initialize();


let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        initialize();
        setTimeout(initialize, 500); 
    }
}).observe(document, {subtree: true, childList: true});