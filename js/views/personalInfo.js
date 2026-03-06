import { gql } from "../api/graphql.js"
import { setView, showLoading, showError } from "../utils/dom.js"

const QUERY = `{
    user {
        attrs
        login
        campus
        auditRatio
    labels(where: {labelName: {_ilike: "c%"}}) {
      labelName
  }
    }
    level: transaction(
        where: { type: { _eq: "level" } }
        order_by: { id: desc }
        limit: 1
    ) {
        amount
    }
    totalXp: transaction_aggregate(
        where: {
            _and: [
                { type: { _eq: "xp" } }
                { event: { object: { name: { _eq: "Module" } } } }
            ]
        }
    ) {
        aggregate {
            sum { amount }
        }
    }
}`

const formatUser = (data) => {
    const u     = data.user[0]
    const promo = u.labels[0].labelName.split("_")


    return {
        nickname:  u.login,
        firstname: u.attrs.firstName,
        lastname:  u.attrs.lastName,
        email:     u.attrs.email,
        campus:    u.campus,
        totalXp:   `${Math.round(data.totalXp.aggregate.sum.amount / 1000)} kB`,
        level:     data.level[0].amount,
        ratio:     Math.round(u.auditRatio * 10) / 10,
        cohort:    promo[0].split("")[1],
        joinDate:  new Date(`${promo[1]}${promo[2]}${promo[3]}`).toLocaleDateString()
    }
}

const renderRow = (label, value) => `
    <span class="info-label">${label}</span>
    <span class="info-value">${value}</span>
`

export const showPersonnalInfo = async () => {
    try {
        showLoading()
        const data = await gql(QUERY)
        const user = formatUser(data)

        setView(`
            <div class="personnal-info">
                <h1>Personal Info</h1>
                <div class="info-grid">
                    ${renderRow("Username",     user.nickname)}
                    ${renderRow("Firstname",    user.firstname)}
                    ${renderRow("Lastname",     user.lastname)}
                    ${renderRow("Email",        user.email)}
                    ${renderRow("Member since", user.joinDate)}
                    ${renderRow("Cohort",       user.cohort)}
                    ${renderRow("Audit ratio",  user.ratio)}
                    ${renderRow("Total XP",     user.totalXp)}
                    ${renderRow("Level",        user.level)}
                </div>
            </div>
        `)
    } catch (err) {
        console.error(err)
        showError()
    }
}