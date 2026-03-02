export const showProgress = async () => {
  const jwt = localStorage.getItem("jwt")

  const query = `
 {
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
    path
    createdAt
  }

  user {
    events(limit: 1) {
      cohorts {
        labelName
      }
    }
  }
}
`;

  try {
    const resp = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
      method: "POST",
      headers: { "Authorization": `Bearer ${jwt}` },
      body: JSON.stringify({ query })
    })

    const res = await resp.json()

    const transaction = res.data.transaction
    const cohortInfo = res.data.user[0].events[0].cohorts[0].labelName.split("_")
    const startTime = new Date(`${cohortInfo[1]}${cohortInfo[2]}${cohortInfo[3]}`).getTime()

    buildGraph(formatdata({ transaction, startTime }))

  } catch (err) {
    console.log(err)
  }
}

function formatdata(data) {
  const start = data.startTime
  const gainByDay = {}

  for (const tx of data.transaction) {
    const day = Math.floor((new Date(tx.createdAt).getTime() - start) / (24 * 60 * 60 * 1000))
    gainByDay[day] = (gainByDay[day] || 0) + tx.amount
  }

  let total = 0
  return Object.entries(gainByDay)
    .sort((a, b) => a[0] - b[0])
    .map(([day, amount]) => {
      total += amount
      return [Number(day), total]
    })
}

function buildGraph(data) {
  const H = 350
  const W = 700
  const PAD = 30
  const innerW = W - PAD * 2
  const innerH = H - PAD * 2

  const series = data.length && data[0][0] === 0 ? data : [[0, 0], ...data]

  const max = [
    series[series.length - 1][0],
    series[series.length - 1][1]
  ]

  const lastDay = series[series.length - 1][0]
  const lastXP = series[series.length - 1][1]

  const projectX = v => PAD + innerW * v / max[0]
  const projectY = v => PAD + innerH * (1 - v / max[1])

  const points = series.map(([date, xp]) =>
    `${projectX(date)},${projectY(xp)}`
  ).join(" ")

  const ns = "http://www.w3.org/2000/svg"

  const svg = document.createElementNS(ns, "svg")
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`)
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet")

  const axisY = document.createElementNS(ns, "line")
  axisY.setAttribute("x1", PAD)
  axisY.setAttribute("y1", PAD)
  axisY.setAttribute("x2", PAD)
  axisY.setAttribute("y2", H - PAD)
  axisY.setAttribute("class", "graph-axis")

  const axisX = document.createElementNS(ns, "line")
  axisX.setAttribute("x1", PAD)
  axisX.setAttribute("y1", H - PAD)
  axisX.setAttribute("x2", W - PAD)
  axisX.setAttribute("y2", H - PAD)
  axisX.setAttribute("class", "graph-axis")

  const polyline = document.createElementNS(ns, "polyline")
  polyline.setAttribute("points", points)
  polyline.setAttribute("class", "graph-line")

  svg.append(axisY, axisX, polyline)

  let tooltip = document.querySelector(".graph-tooltip")
  if (!tooltip) {
    tooltip = document.createElement("div")
    tooltip.className = "graph-tooltip"
    document.body.appendChild(tooltip)
  }

  series.forEach(([date, xp], i) => {
    const x = projectX(date)
    const y = projectY(xp)
    const gain = i === 0 ? xp : xp - series[i - 1][1]

    const dot = document.createElementNS(ns, "circle")
    dot.setAttribute("cx", x)
    dot.setAttribute("cy", y)
    dot.setAttribute("class", "graph-point")

    dot.addEventListener("mouseenter", () => {
      tooltip.textContent = `Day ${date} — +${gain} XP`
      tooltip.style.display = "block"
    })

    dot.addEventListener("mousemove", e => {
      tooltip.style.left = e.clientX + 10 + "px"
      tooltip.style.top = e.clientY + 10 + "px"
    })

    dot.addEventListener("mouseleave", () => {
      tooltip.style.display = "none"
    })

    svg.appendChild(dot)
  })

  const labelX = document.createElementNS(ns, "text")
  labelX.setAttribute("x", W / 2)
  labelX.setAttribute("y", H - 6)
  labelX.setAttribute("text-anchor", "middle")
  labelX.setAttribute("class", "graph-label")
  labelX.textContent = "Time (days)"

  const labelY = document.createElementNS(ns, "text")
  labelY.setAttribute("x", 12)
  labelY.setAttribute("y", H / 2)
  labelY.setAttribute("text-anchor", "middle")
  labelY.setAttribute("transform", `rotate(-90 12 ${H / 2})`)
  labelY.setAttribute("class", "graph-label")
  labelY.textContent = "Cumulative XP"

  const totalXPText = document.createElementNS(ns, "text")
  totalXPText.setAttribute("x", PAD * 3)
  totalXPText.setAttribute("y", PAD )
  totalXPText.setAttribute("text-anchor", "end")
  totalXPText.setAttribute("class", "graph-label")
  totalXPText.textContent = `${lastXP} B`

  const todayText = document.createElementNS(ns, "text")
  todayText.setAttribute("x", W)
  todayText.setAttribute("y", H - PAD - 4)
  todayText.setAttribute("text-anchor", "end")
  todayText.setAttribute("class", "graph-label")
  todayText.textContent = `Day ${lastDay}`

  svg.append(labelX, labelY, totalXPText, todayText)
  const h1 = document.createElement("h1")
  h1.textContent = "XP progression"

  const container = document.querySelector(".data-container")
  container.innerHTML = ""
  container.append(h1, svg)
}