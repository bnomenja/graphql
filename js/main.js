export const showMainPage = (jwt) => {
    document.body.innerHTML= `
        <div class="main-container">
        <button id="logout-btn">logout</button>

        <div class="profile-container">
            <img src="profile.png" alt="pfp">

            <span>Welcome back, bnomenja !</span>

            <div class="options">

                <span>what do you wanna see today ?</span>
                <button type="button" id="personnal-btn">personnal info</button>
                <button type="button">skills</button>
                <button type="button">xp progression</button>
                <button type="button">project ratio</button>
            </div>


        </div>

        <div class="data-container">
        </div>

    </div>
    `
}