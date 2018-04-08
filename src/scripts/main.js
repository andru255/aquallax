//b-slide--article-banner
var sticky = document.getElementsByClassName("b-sticky")[0];
var splash = document.getElementsByClassName("b-splash")[0];
var splashInner = document.getElementsByClassName("b-splash__inner")[0];
var mainContainer = document.getElementsByClassName("b-main-container")[0];

/*utils*/
function getWindowSize() {
    var width = window.innerWidth
        || window.documentElement.clientWidth
        || document.body.clientWidth;
    var height = window.innerHeight
        || window.documentElement.clientHeight
        || document.body.clientHeight;

    return {
        "width": width,
        "height": height
    };
}

/*gets the window height and resize the first banner*/
function applyStylesToElement(target, rules) {
    var strRules = "";
    for (var rule in rules) {
        strRules += [rule, ":", rules[rule], ";"].join("");
    }
    target.setAttribute("style", strRules);
}

function resizeSplashAndMainBlock(){
    applyStylesToElement(splash, {
        "height": getWindowSize().height + "px"
    });
    applyStylesToElement(mainContainer, {
        "margin-top": getWindowSize().height + "px"
    });
};
resizeSplashAndMainBlock();

window.addEventListener("resize", function(){
    resizeSplashAndMainBlock();
});

/*sticky header*/

/* switching class */
var stickyDefaultClass = sticky.className;
var stickyFixedClass = [ stickyDefaultClass, "--fixed" ].join("");
function classNameSwitchStickyBar(){
    var mainTopPosition = mainContainer.getBoundingClientRect().top;
    if (mainTopPosition < 0) {
        sticky.className = [stickyDefaultClass, stickyFixedClass].join(" ");
    } else {
        sticky.className = stickyDefaultClass;
    }
}
/* splash fadeout onscroll animation */
function fadeOutSplashContent(){
    var mainTopPosition = mainContainer.getBoundingClientRect().top;
    var windowHeight = getWindowSize().height;
    var visible = windowHeight - (windowHeight - mainTopPosition);
    var percent = ( visible * 100 ) / windowHeight;
    var opacity =  percent / 100;

    console.log("percent", percent);
    console.log("opacity", opacity);

    applyStylesToElement(splashInner, {
        "opacity": opacity,
        "-webkit-transform": percent > 80 ? "translate3d(0, " + percent + "px, 0)": ""
    });
    //"-webkit-transform": "translate3d(0, " + percent +"px, 0)"
}

window.addEventListener("scroll", function(){
    classNameSwitchStickyBar();
    fadeOutSplashContent();
});