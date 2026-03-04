import { setJwt } from "../utils/auth.js"
import { API_AUTH } from "../config.js"
import { showMainPage } from "./main.js"

const template = `
    <form class="login-container">
        <h1>Login</h1>

        <div class="error-container" id="error"></div>

        <div class="input-container">
            <label for="identifier">Email/Username:</label>
            <input type="text" id="identifier">
        </div>

        <div class="input-container">
            <label for="password">Password:</label>
            <div class="input-wrapper">
                <input type="password" id="password">
                <button type="button" id="show-btn" title="Show password">
                    <svg id="eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                </button>
            </div>
        </div>

        <button type="submit" id="login-btn">sign-in</button>
    </form>
`

const eyeOpen   = `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>`
const eyeClosed = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>`

export const initLogin = () => {
    document.body.innerHTML = template

    const showBtn        = document.getElementById("show-btn")
    const loginBtn       = document.getElementById("login-btn")
    const passwordInput  = document.getElementById("password")
    const identifierInput = document.getElementById("identifier")
    const errorContainer = document.getElementById("error")

    const showError = (msg) => {
        errorContainer.textContent = msg
        errorContainer.style.display = "block"
    }

    const showOrHide = (e) => {
        e.preventDefault()
        const icon = document.getElementById("eye-icon")

        if (passwordInput.type === "password") {
            passwordInput.type = "text"
            icon.innerHTML = eyeOpen
            showBtn.title = "Hide password"
        } else {
            passwordInput.type = "password"
            icon.innerHTML = eyeClosed
            showBtn.title = "Show password"
        }
    }

    const login = async (e) => {
        e.preventDefault()

        const nameOrEmail = identifierInput.value
        const password    = passwordInput.value

        if (!nameOrEmail || !password) {
            showError("Please fill all the fields")
            return
        }

        try {
            const resp = await fetch(API_AUTH, {
                method: "POST",
                headers: { "Authorization": `Basic ${btoa(`${nameOrEmail}:${password}`)}` }
            })

            if (!resp.ok) {
                showError("Invalid credentials")
                return
            }

            const jwt = await resp.json()
            setJwt(jwt)
            showMainPage()

        } catch (err) {
            console.error(err)
            showError("An error occurred, please try again")
        }
    }

    showBtn.addEventListener("click", showOrHide)
    loginBtn.addEventListener("click", login)
}