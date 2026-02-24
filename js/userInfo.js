export const showPersonnalInfo = () => {
    const jwt = localStorage.getItem("jwt")

    document.querySelector(".data-container").innerHTML = `
            <div class="personnal-info">
                <h2>Personal Info</h2>

                <div class="info-grid">
                    <span class="info-label">Username</span>
                    <span class="info-value">bnomenja</span>

                    <span class="info-label">Firstname</span>
                    <span class="info-value">BEMAMORY</span>

                    <span class="info-label">Lastname</span>
                    <span class="info-value">Nomenjanahary Luciano Loïc</span>

                    <span class="info-label">Member since</span>
                    <span class="info-value">2024-01-15</span>

                    <span class="info-label">Cohort</span>
                    <span class="info-value">5</span>

                    <span class="info-label">Audit ratio</span>
                    <span class="info-value">3.1</span>

                    <span class="info-label">Total XP</span>
                    <span class="info-value">142 380 kb</span>
                </div>
            </div>
`
}