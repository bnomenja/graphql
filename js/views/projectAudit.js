import { gql } from "../api/graphql.js"
import { setView, showLoading, showError } from "../utils/dom.js"

const QUERY = `{
    user {
        succeeded: audits_aggregate(where: { closureType: { _eq: succeeded } }) {
            aggregate { count }
        }
        failed: audits_aggregate(where: { closureType: { _eq: failed } }) {
            aggregate { count }
        }
    }
}`

const buildDonut = ({ pass, fail }) => {
    const r     = 90
    const cx    = 150
    const cy    = 150
    const size  = 300
    const circ  = 2 * Math.PI * r
    const total = pass + fail
    const arc   = (pass / total) * circ

    const percentPass = ((pass / total) * 100).toFixed(1)
    const percentFail = (100 - percentPass).toFixed(1)

    return `
        <h1>Project audited ratio</h1>

        <div class="ratio-wrapper">
            <svg class="ratio-svg" viewBox="0 0 ${size} ${size}">
                <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" class="arc-fail" stroke-width="30"/>
                <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" class="arc-pass" stroke-width="30"
                    stroke-dasharray="${arc} ${circ}"
                    transform="rotate(-90 ${cx} ${cy})"/>
            </svg>

            <div class="legend">
                <div class="legend-item">
                    <div class="legend-square legend-pass"></div>
                    <span>Pass (${pass}) — ${percentPass}%</span>
                </div>
                <div class="legend-item">
                    <div class="legend-square legend-fail"></div>
                    <span>Fail (${fail}) — ${percentFail}%</span>
                </div>
            </div>
        </div>
    `
}

export const showProjectRatio = async () => {
    try {
        showLoading()
        const data = await gql(QUERY)
        const pass = data.user[0].succeeded.aggregate.count
        const fail = data.user[0].failed.aggregate.count

        if (!pass && !fail) {
            setView("<h1>No audits yet</h1>")
            return
        }

        setView(buildDonut({ pass, fail }))
    } catch (err) {
        console.error(err)
        showError()
    }
}