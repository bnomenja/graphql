import { gql } from "../api/graphql.js"
import { clearView, getDataContainer, showLoading, showError } from "../utils/dom.js"

const QUERY = `
    query {
        skills: transaction(
            where: { type: { _ilike: "%skill%" } }
            distinct_on: type
            order_by: [{ type: asc }, { amount: desc }]
        ) {
            type
            amount
        }
    }
`

const buildSvg = (skills) => {
    const ns         = "http://www.w3.org/2000/svg"
    const barX       = 20
    const barWidth   = 70
    const barHeight  = 4
    const rowHeight  = 12
    const svgHeight  = rowHeight * skills.length + 4

    const svg = document.createElementNS(ns, "svg")
    svg.setAttribute("viewBox", `0 0 100 ${svgHeight}`)
    svg.setAttribute("preserveAspectRatio", "xMinYMin meet")

    skills.forEach((skill, i) => {
        const y       = rowHeight * i
        const name    = skill.type.split("_")[1] + ":"
        const percent = skill.amount

        const text = document.createElementNS(ns, "text")
        text.setAttribute("x", 0)
        text.setAttribute("y", y + 4)
        text.textContent = name
        text.classList.add("label")

        const barBg = document.createElementNS(ns, "rect")
        barBg.setAttribute("x", barX)
        barBg.setAttribute("y", y)
        barBg.setAttribute("width", barWidth)
        barBg.setAttribute("height", barHeight)
        barBg.classList.add("bar-bg")

        const barValue = document.createElementNS(ns, "rect")
        barValue.setAttribute("x", barX)
        barValue.setAttribute("y", y)
        barValue.setAttribute("width", (percent / 100) * barWidth)
        barValue.setAttribute("height", barHeight)
        barValue.classList.add("bar-value")

        svg.append(text, barBg, barValue)
    })

    return svg
}

export const showSkills = async () => {
    try {
        showLoading()
        const data   = await gql(QUERY)
        const skills = data.skills

        clearView()
        const container = getDataContainer()

        const h1 = document.createElement("h1")
        h1.textContent = "Skills"

        const svgCont = document.createElement("div")
        svgCont.classList.add("skills-svg-container")
        svgCont.appendChild(buildSvg(skills))

        container.append(h1, svgCont)
    } catch (err) {
        console.error(err)
        showError()
    }
}