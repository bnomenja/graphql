export const getJwt = () => localStorage.getItem("jwt")

export const setJwt = (jwt) => localStorage.setItem("jwt", jwt)

export const removeJwt = () => localStorage.removeItem("jwt")