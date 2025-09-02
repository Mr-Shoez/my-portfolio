//================================================================================================
// DOM Element References
//================================================================================================
const audio = document.getElementById("audioPlayer");
const loader = document.getElementById("preloader");
const settingContainer = document.getElementById("setting-container");
const visualModeContainer = document.getElementById("visualmodetogglebuttoncontainer");
const soundModeContainer = document.getElementById("soundtogglebuttoncontainer");
const body = document.body;
const mobileToggleMenu = document.getElementById("mobiletogglemenu");
const burgerBar1 = document.getElementById("burger-bar1");
const burgerBar2 = document.getElementById("burger-bar2");
const burgerBar3 = document.getElementById("burger-bar3");
const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll(".navbar .navbar-tabs .navbar-tabs-ul li");
const mobilenavLi = document.querySelectorAll(".mobiletogglemenu .mobile-navbar-tabs-ul li");
const backToTopButton = document.getElementById("backtotopbutton");
const pupils = document.getElementsByClassName("footer-pupil");

//================================================================================================
// General Functions
//================================================================================================

/**
 * Opens a URL in a new browser tab.
 * @param {string} url - The URL to open.
 */
function openURL(url) {
    window.open(url, "_blank");
}

//================================================================================================
// Settings, Sound, and Visual Mode
//================================================================================================

/**
 * Toggles the visibility of the settings menu.
 */
function settingtoggle() {
    settingContainer.classList.toggle("settingactivate");
    visualModeContainer.classList.toggle("visualmodeshow");
    soundModeContainer.classList.toggle("soundmodeshow");
}

/**
 * Plays or pauses the background audio based on the sound switch.
 */
function playpause() {
    const isSoundOn = document.getElementById("switchforsound").checked;
    if (isSoundOn) {
        audio.play();
    } else {
        audio.pause();
    }
}

/**
 * Toggles light/dark mode for the page.
 */
function visualmode() {
    body.classList.toggle("light-mode");
    document.querySelectorAll(".needtobeinvert").forEach(function(element) {
        element.classList.toggle("invertapplied");
    });
}

//================================================================================================
// Mobile Navigation Menu
//================================================================================================

/**
 * Toggles the mobile navigation menu and hamburger icon animation.
 */
function hamburgerMenu() {
    body.classList.toggle("stopscrolling");
    mobileToggleMenu.classList.toggle("show-toggle-menu");
    burgerBar1.classList.toggle("hamburger-animation1");
    burgerBar2.classList.toggle("hamburger-animation2");
    burgerBar3.classList.toggle("hamburger-animation3");
}

/**
 * Hides the mobile navigation menu when a menu item is clicked.
 */
function hidemenubyli() {
    body.classList.remove("stopscrolling");
    mobileToggleMenu.classList.remove("show-toggle-menu");
    burgerBar1.classList.remove("hamburger-animation1");
    burgerBar2.classList.remove("hamburger-animation2");
    burgerBar3.classList.remove("hamburger-animation3");
}


//================================================================================================
// Scroll-based Functionality
//================================================================================================

/**
 * Handles scroll events to update active navigation links and show/hide the back-to-top button.
 */
function handleScroll() {
    // Scrollspy for active navigation link
    let currentSection = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute("id");
        }
    });

    navLi.forEach((li) => {
        li.classList.remove("activeThistab");
        if (li.classList.contains(currentSection)) {
            li.classList.add("activeThistab");
        }
    });

    mobilenavLi.forEach((li) => {
        li.classList.remove("activeThismobiletab");
        if (li.classList.contains(currentSection)) {
            li.classList.add("activeThismobiletab");
        }
    });

    // Show/hide back-to-top button
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
}

/**
 * Scrolls the page to the top.
 */
function scrolltoTopfunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//================================================================================================
// Dynamic Project Loading
//================================================================================================

/**
 * Fetches project data from projects.json and populates the projects section.
 */
function loadProjects() {
    const projectList = document.getElementById("project-list");

    const createGithubButton = (githubLink) => {
        if (!githubLink) return "";
        return `
            <a href="${githubLink}" target="_blank" class="github-redirect" aria-label="Visit project on GitHub">
                <img src="src/svg/github.svg" alt="github redirect button" />
            </a>`;
    };

    fetch("projects.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then((projects) => {
            projects.forEach((project) => {
                const projectBoxHTML = `
                    <div data-aos="fade-up" class="project-box-wrapper">
                        <div class="project-box project-box2">
                            <div class="info-div">
                                <img src="${project.favicon}" alt="${project.altFavicon}" class="faviconforProject" />
                                <article class="ProjectHeading">${project.title}</article>
                                <p class="ProjectDescription">${project.description}</p>
                                <div class="project-buttons">
                                    ${createGithubButton(project.githubLink)}
                                    <a href="${project.liveLink}" target="_blank" class="cta" aria-label="Visit ${project.title} Live">
                                        <span>Live view</span>
                                        <svg viewBox="0 0 13 10" height="10px" width="15px">
                                            <path d="M1,5 L11,5"></path>
                                            <polyline points="8 1 12 5 8 9"></polyline>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div class="image-div">
                                <img src="${project.previewImage}" alt="${project.altPreview}" />
                            </div>
                        </div>
                    </div>`;
                projectList.insertAdjacentHTML("beforeend", projectBoxHTML);
            });
            // Refresh AOS to detect and animate the newly added project elements
            setTimeout(() => AOS.refresh(), 500);
        })
        .catch((error) => {
            console.error("Failed to fetch and load projects:", error);
            projectList.innerHTML = "<p style='color: white; text-align: center;'>Failed to load projects.</p>";
        });
}

//================================================================================================
// Scroll-triggered Button Animation
//================================================================================================

/**
 * Observes the CV and Certificate buttons and animates them when they enter the viewport.
 */
function initializeButtonObserver() {
    const resumeBtn = document.getElementById("resume-btn");
    const certificateBtn = document.getElementById("certificate-btn");

    if (!resumeBtn || !certificateBtn) return; // Exit if buttons aren't found

    const observerOptions = {
        root: null, // Use the viewport as the container
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the button is visible
    };

    const buttonObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the element is intersecting (on screen)
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            } 
            // If the element is NOT intersecting (off screen)
            else {
                entry.target.classList.remove("is-visible");
            }
        });
    }, observerOptions);

    // Start observing the two buttons
    buttonObserver.observe(resumeBtn);
    buttonObserver.observe(certificateBtn);
}


//================================================================================================
// Custom Cursor and Footer Avatar Animation
//================================================================================================

function initializeAnimations() {
    // Custom Cursor
    const cursorInner = document.getElementById("cursor-inner");
    const cursorOuter = document.getElementById("cursor-outer");
    const links = document.querySelectorAll("a,label,button");

    document.addEventListener("mousemove", function(e) {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorInner.style.left = `${posX}px`;
        cursorInner.style.top = `${posY}px`;
        cursorOuter.animate({
            left: `${posX}px`,
            top: `${posY}px`,
        }, {
            duration: 500,
            fill: "forwards"
        });
    });

    links.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            cursorInner.classList.add("hover");
            cursorOuter.classList.add("hover");
        });
        link.addEventListener("mouseleave", () => {
            cursorInner.classList.remove("hover");
            cursorOuter.classList.remove("hover");
        });
    });


    // Footer Avatar Eye Movement
    const pupilsArr = Array.from(pupils);
    const pupilStartPoint = -10;
    const pupilRangeX = 20;
    const pupilRangeY = 15;
    let mouseXEndPoint = window.innerWidth;
    let mouseYEndPoint = window.innerHeight;
    let mouseXRange = mouseXEndPoint - 0;

    const moveEyes = (e) => {
        let fracXValue = e.clientX / mouseXRange;
        let fracYValue = e.clientY / mouseYEndPoint;
        let pupilX = pupilStartPoint + fracXValue * pupilRangeX;
        let pupilY = pupilStartPoint + fracYValue * pupilRangeY;
        pupilsArr.forEach((pupil) => {
            pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        });
    };

    const resizeWindow = () => {
        mouseXEndPoint = window.innerWidth;
        mouseYEndPoint = window.innerHeight;
        mouseXRange = mouseXEndPoint - 0;
    };

    window.addEventListener("mousemove", moveEyes);
    window.addEventListener("resize", resizeWindow);
}


//================================================================================================
// Event Listeners and Initialization
//================================================================================================

// Fires when the initial HTML document has been completely loaded and parsed
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Animate On Scroll (AOS) library
    AOS.init();
    
    // Load projects dynamically
    loadProjects();

    // Initialize cursor and eye animations
    initializeAnimations();

    // Hide preloader and show welcome message after everything is loaded
    window.addEventListener("load", function() {
        loader.style.display = "none";
        document.querySelector(".hey").classList.add("popup");
    });
});

// Attach scroll listener to the window
window.addEventListener("scroll", handleScroll);

// Disable context menu on images to prevent saving
document.addEventListener("contextmenu", function(e) {
    if (e.target.nodeName === "IMG") {
        e.preventDefault();
    }
}, false);

// Developer Console Message
console.log(
    "%c Designed and Developed by Mosa Moleleki ",
    "background-image: linear-gradient(90deg,#8000ff,#6bc5f8); color: white;font-weight:900;font-size:1rem; padding:20px;"
);