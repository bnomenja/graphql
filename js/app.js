import { initLogin } from "./login.js"
import { logout } from "./logout.js"
import { showMainPage } from "./main.js"
import { showProgress } from "./progress.js"
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

        case "progress-btn": {
            showProgress()
            break
        }

        case "logout-btn": {
            logout()
            break
        }
    }

})
