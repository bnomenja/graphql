import { initLogin } from "./login.js"
import { logout } from "./logout.js"
import { showMainPage } from "./main.js"
import { showPersonnalInfo } from "./userInfo.js"

const jwt = localStorage.getItem("jwt")

if (jwt) {
    showMainPage(jwt)
} else {
    initLogin()
}

document.addEventListener("click", e => {
    e.preventDefault()
    if (e.target.id === "personnal-btn") {
        showPersonnalInfo()
    }

    if (e.target.id === "logout-btn") {
        logout()
    }


})
