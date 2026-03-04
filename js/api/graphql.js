import { API_GRAPHQL } from "../config.js"

export const gql = async (query) => {
    const jwt = localStorage.getItem("jwt")

    const resp = await fetch(API_GRAPHQL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${jwt}` },
        body: JSON.stringify({ query })
    })

    const res = await resp.json()

    if (res.errors) throw new Error(res.errors[0].message)

    return res.data
}