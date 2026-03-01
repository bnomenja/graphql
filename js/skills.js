const createSkillSvg = (skills) => {
  const ns = "http://www.w3.org/2000/svg"

  const labelX = 0
  const barX = 20
  const barWidth = 70
  const barHeight = 4

  const rowHeight = 12
  const textOffsetY = 4
  const barOffsetY = 0

  const svgHeight = rowHeight * skills.length + 4

  const svg = document.createElementNS(ns, "svg")
  svg.setAttribute("viewBox", `0 0 100 ${svgHeight}`)
  svg.setAttribute("preserveAspectRatio", "xMinYMin meet")

  skills.forEach((skill, i) => {
    const rowY = rowHeight * i

    const name = skill.type.split("_")[1] + ":"
    const percent = skill.amount

    const text = document.createElementNS(ns, "text")
    text.setAttribute("x", labelX)
    text.setAttribute("y", rowY + textOffsetY)
    text.textContent = name
    text.classList.add("label")

    const barBg = document.createElementNS(ns, "rect")
    barBg.setAttribute("x", barX)
    barBg.setAttribute("y", rowY + barOffsetY)
    barBg.setAttribute("width", barWidth)
    barBg.setAttribute("height", barHeight)
    barBg.classList.add("bar-bg")

    const barValue = document.createElementNS(ns, "rect")
    barValue.setAttribute("x", barX)
    barValue.setAttribute("y", rowY + barOffsetY)
    barValue.setAttribute("width", (percent / 100) * barWidth)
    barValue.setAttribute("height", barHeight)
    barValue.classList.add("bar-value")

    svg.append(text, barBg, barValue)
  })

  return svg
}

const displaySkills = (skills) => {
  const dataCont = document.querySelector(".data-container")
  dataCont.innerHTML = ``
  const h1 = document.createElement("h1")
  h1.textContent = "Skills"

  const svgCont = document.createElement("div")
  svgCont.classList.add("skills-svg-container")

  const svg = createSkillSvg(skills)
  svgCont.append(svg)

  dataCont.append(h1, svgCont)
}

export const showSkills = async () => {
  const jwt = localStorage.getItem("jwt")

  const query = `
    query GetSkills {
      skills: transaction(
        where: { type: { _ilike: "%skill%" } }
        distinct_on: type
        order_by: [
          { type: asc }
          { amount: desc }
        ]
      ) {
        type
        amount
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

    const skills = res.data.skills

    displaySkills(skills)

  } catch (err) {
    console.error(err)
  }

}