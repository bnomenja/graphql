import { showMainPage } from "./main.js"

const loginTemplate = `
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
                <button type="button" id="show-btn">🙈</button>
            </div>
        </div>
        <button type="submit" id="login-btn">sign-in</button>
    </form>
`

export const initLogin = () => {
    document.body.innerHTML = loginTemplate

    const showBtn = document.getElementById("show-btn")
    const loginBtn = document.getElementById("login-btn")
    const passwordInput = document.getElementById("password")
    const identiferInput = document.getElementById("identifier")
    const errorContainer = document.getElementById("error")

    const showOrHide = (e) => {
        e.preventDefault()

        if (passwordInput.type === "password") {
            passwordInput.type = "text"
            showBtn.textContent = "🙉"
        } else {
            passwordInput.type = "password"
            showBtn.textContent = "🙈"
        }
    }

    const Login = async (e) => {
        e.preventDefault()


        const nameOrEmail = identiferInput?.value
        const password = passwordInput?.value

        if (!nameOrEmail || !password) {
            errorContainer.textContent = "Please fill all the fields"
            errorContainer.style.display = "block"
            return
        }

        const payload = btoa(`${nameOrEmail}:${password}`)

        try {

            const resp = await fetch("https://learn.zone01oujda.ma/api/auth/signin", {
                method: "POST",
                headers: { "Authorization": `Basic ${payload}` },
            })


            if (!resp.ok) {
                errorContainer.textContent = "Invalid credentials"
                errorContainer.style.display = "block"
                return
            }

            const jwt = await resp.json()

            localStorage.setItem("jwt", jwt)

            showMainPage(jwt)

        } catch (err) {
            console.error(err)
        }
    }

    showBtn.addEventListener("click", showOrHide)
    loginBtn.addEventListener("click", Login)
}