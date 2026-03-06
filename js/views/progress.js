import { gql } from "../api/graphql.js"
import { clearView, getDataContainer, showLoading, showError } from "../utils/dom.js"

const QUERY = `{
    transaction(
        where: {
            _and: [
                { type: { _eq: "xp" } }
                { event: { object: { name: { _eq: "Module" } } } }
            ]
        }
        order_by: { createdAt: asc }
    ) {
        amount
        createdAt
    }
    user {
        labels(where: {labelName: {_ilike: "c%"}}) {
      labelName
      }
    }
}`

const formatData = (transactions, startTime) => {
    const gainByDay = {}

    for (const tx of transactions) {
        const day = Math.floor((new Date(tx.createdAt).getTime() - startTime) / 86400000)
        gainByDay[day] = (gainByDay[day] || 0) + tx.amount
    }

    let total = 0
    return Object.entries(gainByDay)
        .sort(([a], [b]) => a - b)
        .map(([day, amount]) => {
            total += amount
            return [Number(day), total]
        })
}

const buildGraph = (data) => {
    const W      = 700
    const H      = 350
    const PAD    = 30
    const innerW = W - PAD * 2
    const innerH = H - PAD * 2
    const ns     = "http://www.w3.org/2000/svg"

    const series  = data[0]?.[0] === 0 ? data : [[0, 0], ...data]
    const lastDay = series.at(-1)[0]
    const lastXP  = series.at(-1)[1]

    const px = v => PAD + innerW * v / lastDay
    const py = v => PAD + innerH * (1 - v / lastXP)

    const points = series.map(([d, xp]) => `${px(d)},${py(xp)}`).join(" ")

    const svg = document.createElementNS(ns, "svg")
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`)
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet")

    // Axes
    const axisY = document.createElementNS(ns, "line")
    axisY.setAttribute("x1", PAD); axisY.setAttribute("y1", PAD)
    axisY.setAttribute("x2", PAD); axisY.setAttribute("y2", H - PAD)
    axisY.setAttribute("class", "graph-axis")

    const axisX = document.createElementNS(ns, "line")
    axisX.setAttribute("x1", PAD);     axisX.setAttribute("y1", H - PAD)
    axisX.setAttribute("x2", W - PAD); axisX.setAttribute("y2", H - PAD)
    axisX.setAttribute("class", "graph-axis")

    // Line
    const polyline = document.createElementNS(ns, "polyline")
    polyline.setAttribute("points", points)
    polyline.setAttribute("class", "graph-line")

    svg.append(axisY, axisX, polyline)

    // Tooltip
    const tooltip = document.createElement("div")
    tooltip.className = "graph-tooltip"
    document.body.appendChild(tooltip)

    // Points
    series.forEach(([day, xp], i) => {
        const gain = i === 0 ? xp : xp - series[i - 1][1]

        const dot = document.createElementNS(ns, "circle")
        dot.setAttribute("cx", px(day))
        dot.setAttribute("cy", py(xp))
        dot.setAttribute("class", "graph-point")

        dot.addEventListener("mouseenter", () => {
            tooltip.textContent = `Day ${day} — +${gain} XP`
            tooltip.style.display = "block"
        })
        dot.addEventListener("mousemove", e => {
            tooltip.style.left = `${e.clientX + 10}px`
            tooltip.style.top  = `${e.clientY + 10}px`
        })
        dot.addEventListener("mouseleave", () => {
            tooltip.style.display = "none"
        })

        svg.appendChild(dot)
    })

    // Labels
    const makeLabel = (x, y, text, anchor, transform = "") => {
        const el = document.createElementNS(ns, "text")
        el.setAttribute("x", x); el.setAttribute("y", y)
        el.setAttribute("text-anchor", anchor)
        el.setAttribute("class", "graph-label")
        if (transform) el.setAttribute("transform", transform)
        el.textContent = text
        return el
    }

    svg.append(
        makeLabel(W / 2, H - 6,       "Time (days)",    "middle"),
        makeLabel(12,    H / 2,        "Cumulative XP",  "middle", `rotate(-90 12 ${H / 2})`),
        makeLabel(PAD * 3, PAD,        `${lastXP} B`,    "end"),
        makeLabel(W - PAD, H - PAD - 4, `Day ${lastDay}`, "end")
    )

    return svg
}

export const showProgress = async () => {
    try {
        showLoading()
        const data      = await gql(QUERY)
        console.log(data)
        const cohort    = data.user[0].labels[0].labelName.split("_")
        const startTime = new Date(`${cohort[1]}${cohort[2]}${cohort[3]}`).getTime()
        const series    = formatData(data.transaction, startTime)

        clearView()
        const container = getDataContainer()

        const h1 = document.createElement("h1")
        h1.textContent = "XP Progression"

        container.append(h1, buildGraph(series))
    } catch (err) {
        console.error(err)
        showError()
    }
}