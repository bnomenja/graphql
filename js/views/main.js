import { gql } from "../api/graphql.js"
import { removeJwt } from "../utils/auth.js"
import { initLogin } from "./login.js"

const QUERY = `{
    user {
        login
        attrs
    }
}`

export const showMainPage = async () => {
    try {
        const data = await gql(QUERY)
        const { login, attrs } = data.user[0]

        document.body.innerHTML = `
            <div class="main-container">
                <button id="logout-btn" title="Logout">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                </button>

                <div class="profile-container">
                    <img src="${attrs.avatarUrl}" alt="pfp">
                    <span>Welcome back, ${login} !</span>

                    <div class="options">
                        <span>what do you wanna see today ?</span>
                        <button type="button" id="personnal-btn">personal info</button>
                        <button type="button" id="skills-btn">skills</button>
                        <button type="button" id="progress-btn">xp progression</button>
                        <button type="button" id="project-ratio-btn">project ratio</button>
                    </div>
                </div>

                <div class="data-container"></div>
            </div>
        `
    } catch (err) {
        console.error(err)
        removeJwt()
        initLogin()
    }
}