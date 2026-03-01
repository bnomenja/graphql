import { initLogin } from "./login.js"
import { logout } from "./logout.js"
import { showMainPage } from "./main.js"
import { showSkills } from "./skills.js"
import { showPersonnalInfo } from "./userInfo.js"

const jwt = localStorage.getItem("jwt")

if (jwt) {
    showMainPage(jwt)
} else {
    initLogin()
}

document.addEventListener("click", e => {
    e.preventDefault()

    switch (e.target.id) {
        case "personnal-btn": {
            showPersonnalInfo()
            break
        }

        case "skills-btn": {
            showSkills()
            break
        }

        case "logout-btn": {
            logout()
            break
        }
    }

})
