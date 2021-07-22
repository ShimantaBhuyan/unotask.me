
let loader = document.querySelector('.videoLoader');
let walkthroughVideo = document.getElementById("walkthroughVideo");
let navbar = document.getElementsByTagName("nav")[0];
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toastIcon = document.getElementById("toastIcon");

// loader for video player
const isVideoLoading = (isLoading) => {
    loader.style.display = isLoading ? 'block' : 'none';
}
isVideoLoading(true);
walkthroughVideo.addEventListener('canplaythrough', (event) => {
    isVideoLoading(false);
    walkthroughVideo.playbackRate = 1.5;
})

// show hide navbar on scroll
// window.onscroll = () => {
//     if (this.scrollY <= 10) {
//         navbar.className = ''
//     }
//     else {
//         navbar.className = 'navbar-scrolled'
//     }
// }

// handle email submit
let userEmailAddress = '';
let forms = Array.from(document.querySelectorAll(".getAccessForm"));
const setRegisteredUser = (email) => {
    let registeredUsers = window.localStorage.getItem('registeredList') ? JSON.parse(window.localStorage.getItem('registeredList')) : [];
    registeredUsers.push({ user: email });
    console.log(registeredUsers);
    window.localStorage.setItem('registeredList', JSON.stringify(registeredUsers));
}
const sendEmail = (emailId) => {
    var reqBody = {
        toEmail: emailId,
        subjectEmail: ""
    }
    console.log(reqBody);
    setRegisteredUser(emailId);
    fetch('https://sendgrid-function.vercel.app/api', {
        method: "POST",
        headers: {
            'Accept': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    }).then(response => {
        console.log(response);
        if(response.ok) {
            setRegisteredUser(emailId); 
            showToast("success", "Email successfully registered!");
        }
        else {
            showToast("error", `Error: ${response.statusText}`);
        }
    }).catch(err => {
        console.log(err);
        showToast("error", `Error: ${err}`);
    })
}
forms.map((form) => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let registeredUsers = window.localStorage.getItem('registeredList') ? JSON.parse(window.localStorage.getItem('registeredList')) : [];
        console.log(registeredUsers);
        console.log(e.target[0].value);
        console.log(!registeredUsers.some(usr => usr.user == e.target[0].value));
        if (e.target[0].value && (registeredUsers.length === 0 || !registeredUsers.some(usr => usr.user == e.target[0].value))) {
            userEmailAddress = e.target[0].value;
            sendEmail(userEmailAddress);
            showToast("success", "Email successfully registered!");
        }
        else if (!e.target[0].value) {
            showToast("error", "Empty email address!");
        }
        else {
            console.log("ALREADY SUBMITTED");
            showToast("info", "Email already registered!");
        }
    })
})

const showToast = (type, message) => {
    toast.classList.add("show");
    toastMessage.innerText = message;
    toastIcon.children[0].style.stroke = type === "success" ? "#4FAC2E" : (type === "info" ? "orange" : "red")
    toastIcon.children[1].style.stroke = type === "success" ? "#4FAC2E" : (type === "info" ? "orange" : "red")
    setTimeout(() => {
        if (toast.classList.contains("show"))
            toast.classList.remove("show");
    }, 4000)
}

const closeToast = () => {
    if (toast.classList.contains("show"))
        toast.classList.remove("show");
}

// tippy tooltip setup
tippy('.infoIcon', {
    content: 'Roadmap item',
});

// slideshow on mobile, on-click carousel in web
var indexValue = 0;
var progressPercents = ['200px', '570px', '775px', '100%'];
const carouselProgressBar = document.getElementById('carouselProgress');
const img = document.querySelectorAll(".carouselImage");
const indicators = document.querySelectorAll(".carouselIndicator");
const resetIndications = () => {
    var x
    for (x = 0; x < img.length; x++) {
        img[x].style.display = "none";
        if (indicators[x].classList.contains("activeCarousel"))
            indicators[x].classList.remove("activeCarousel");
        if (document.documentElement.clientWidth < 500) {
            indicators[x].style.display = "none";
        }
        else {
            indicators[x].style.display = "block";
        }
    }
}
const slideshowEngine = (ifKey = false, key = -1) => {
    resetIndications();
    if (ifKey && key !== -1) {
        img[key].style.display = "block";
        indicators[key].classList.add("activeCarousel");
        carouselProgressBar.style.width = progressPercents[key];
        if (document.documentElement.clientWidth < 500) {
            indicators[key].style.display = "block";
        }
    }
    else {
        indexValue++;
        if (indexValue > img.length) {
            indexValue = 1
        }
        img[indexValue - 1].style.display = "block";
        indicators[indexValue - 1].classList.add("activeCarousel");
        carouselProgressBar.style.width = progressPercents[indexValue - 1];
        if (document.documentElement.clientWidth < 500) {
            indicators[indexValue - 1].style.display = "block";
        }
    }
}
const slideshowOnClick = (key) => {
    const carouselIndicators = Array.from(document.querySelectorAll(".carouselIndicator"));
    console.log(carouselIndicators[key]);
    slideshowEngine(true, key);
}
const slideShow = () => {
    setTimeout(slideShow, 3000);
    slideshowEngine();
}
if (window.screen.width <= 500) {
    slideShow();
}
else {
    slideshowOnClick(0)
}