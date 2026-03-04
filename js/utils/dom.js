export const getDataContainer = () => document.querySelector(".data-container")

export const setView = (html) => {
    getDataContainer().innerHTML = html
}

export const clearView = () => {
    getDataContainer().innerHTML = ""
}

export const showLoading = () => {
    setView(`<span class="loading">Loading...</span>`)
}

export const showError = (msg = "Something went wrong") => {
    setView(`<span class="view-error">${msg}</span>`)
}