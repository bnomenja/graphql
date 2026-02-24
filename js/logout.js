import { initLogin } from "./login.js"

export const logout = () => {
    localStorage.removeItem("jwt")
    initLogin()
}
