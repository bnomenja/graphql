export const showMainPage = async (jwt) => {
    const query = `
    {
      user{
        login
        attrs
        }
    }
    `
    let data
    try {
        const resp = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql",{
            method : "POST",
            headers : {"Authorization" : `Bearer ${jwt}`},
            body : JSON.stringify({query})
        })

        const res = await resp.json()

        data = res.data.user[0]
        
    }catch(err) {
        console.error(err)
    }


    document.body.innerHTML= `
        <div class="main-container">
        <button id="logout-btn">logout</button>

        <div class="profile-container">
            <img src="${data.attrs.avatarUrl}" alt="pfp">

            <span>Welcome back, ${data.login} !</span>

            <div class="options">

                <span>what do you wanna see today ?</span>
                <button type="button" id="personnal-btn">personnal info</button>
                <button type="button" id="skills-btn">skills</button>
                <button type="button">xp progression</button>
                <button type="button">project ratio</button>
            </div>


        </div>

        <div class="data-container">
        </div>

    </div>
    `
}