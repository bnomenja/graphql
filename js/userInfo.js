const generateUserObject = (data) => {
    const user = {}

    user.nickname = data.user[0].login
    user.firstname = data.user[0].attrs.firstName
    user.lastname = data.user[0].attrs.lastName
    user.campus = data.user[0].campus
    user.totalXp = String( Math.round(data.totalXp.aggregate.sum.amount / 1000)) + " kB"
    user.level = data.level[0].amount
    user.ratio = Math.round(data.user[0].auditRatio * 10) / 10

    const promo = data.user[0].events[0].cohorts[0].labelName.split("_")
    user.cohort = promo[0].split("")[1]
    user.joinDate = new Date(`${promo[1]}${promo[2]}${promo[3]}`).toLocaleDateString()

    return user
}

const displayPersonnalInfo = (user) => {
        document.querySelector(".data-container").innerHTML = `
                <div class="personnal-info">
                    <h2>Personal Info</h2>

                    <div class="info-grid">
                        <span class="info-label">Username</span>
                        <span class="info-value">${user.nickname}</span>

                        <span class="info-label">Firstname</span>
                        <span class="info-value">${user.firstname}</span>

                        <span class="info-label">Lastname</span>
                        <span class="info-value">${user.lastname}</span>

                        <span class="info-label">Member since</span>
                        <span class="info-value">${user.joinDate}</span>

                        <span class="info-label">Cohort</span>
                        <span class="info-value">${user.cohort}</span>

                        <span class="info-label">Audit ratio</span>
                        <span class="info-value">${user.ratio}</span>

                        <span class="info-label">Total XP</span>
                        <span class="info-value">${user.totalXp}</span>

                        <span class="info-label">Current level:</span>
                        <span class="info-value">${user.level}</span>

                    </div>
                </div>
    `
}

export const showPersonnalInfo = async () => {
    const jwt = localStorage.getItem("jwt")

    const query = `
{
  user {
    attrs
    login
    campus
    auditRatio
    events(limit: 1) {
      cohorts {
        labelName
      }
    }
  },
  
  level: transaction(
    where: {type: {_eq: "level"}}
    order_by: {id: desc}
    limit: 1
  ) {
    amount
  }

  totalXp: transaction_aggregate(
    where: {
      _and: [
        { type: { _eq: "xp" } },
        { event: { object: { name: { _eq: "Module" } } } }
      ]
    }
  ) {
    aggregate {
      sum {
        amount
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

        const result = await resp.json()

        const data = result.data

        const user = generateUserObject(data)

        displayPersonnalInfo(user)

    } catch (err) {
        console.log(err)
    }
}