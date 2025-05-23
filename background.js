// Predefined list of blocked keywords
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


chrome.runtime.onInstalled.addListener(function() {

  chrome.storage.sync.get({ keywordsInitialized: false }, function(data) {
    if (!data.keywordsInitialized) {
      chrome.storage.sync.set({
        blockedKeywords: defaultBlockedKeywords,
        enabled: true,
        keywordsInitialized: true
      }, function() {
        console.log("Distraction Blocker initialized with default settings");
      });
    }
  });
});


function postToTwitter() {
    const message = encodeURIComponent("I just disabled my Distraction Blocker extension because I couldn't resist the urge. I need to be more disciplined! 😅 #DistractionBlocker #SelfControl");
    const twitterUrl = `https://twitter.com/intent/tweet?text=${message}`;
    
    chrome.tabs.create({ url: twitterUrl }, (tab) => {

        setTimeout(() => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                    const tweetButton = document.querySelector('[data-testid="tweetButton"]');
                    if (tweetButton) {
                        tweetButton.click();
                    }
                }
            });
        }, 4000);
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "postToTwitter") {
        postToTwitter();
    }
});


chrome.runtime.onSuspend.addListener(() => {
    postToTwitter();
});


chrome.runtime.setUninstallURL('https://twitter.com/intent/tweet?text=' + 
    encodeURIComponent("I just uninstalled my Distraction Blocker extension because I couldn't resist the urge. I need to be more disciplined! 😅 #DistractionBlocker #SelfControl"));