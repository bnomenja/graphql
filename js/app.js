import { getJwt, removeJwt } from "./utils/auth.js"
import { initLogin } from "./views/login.js"
import { showMainPage } from "./views/main.js"
import { showPersonnalInfo } from "./views/personalInfo.js"
import { showSkills } from "./views/skills.js"
import { showProgress } from "./views/progress.js"
import { showProjectRatio } from "./views/projectAudit.js"
import { debounce } from "./utils/debounce.js"

getJwt() ? showMainPage() : initLogin()

const routes = {
    "personnal-btn": showPersonnalInfo,
    "skills-btn": showSkills,
    "progress-btn": showProgress,
    "project-ratio-btn": showProjectRatio,
    "logout-btn": () => {
        removeJwt()
        initLogin()
    }
}

document.addEventListener("click", debounce(e => {
    e.preventDefault()
    const btn = e.target.closest("button")
    if (!btn) return
    routes[btn.id]?.()
}, 300))