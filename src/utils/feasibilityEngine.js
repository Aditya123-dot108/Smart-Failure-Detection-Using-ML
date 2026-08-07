// Feasibility Engine

export function calculateFeasibility(project, risk) {

    const {
        sector,
        budgetLakh,
        competitors = 5,
        businessModel
    } = project;

    //----------------------------------------
    // Market Potential
    //----------------------------------------

    let marketScore = 70;

    if (
        sector === "AI" ||
        sector === "Healthcare" ||
        sector === "FinTech"
    ) {

        marketScore = 90;

    }

    //----------------------------------------
    // Financial Score
    //----------------------------------------

    let financialScore = 40;

    if (budgetLakh >= 100)
        financialScore = 95;

    else if (budgetLakh >= 50)
        financialScore = 80;

    else if (budgetLakh >= 20)
        financialScore = 65;

    else
        financialScore = 40;

    //----------------------------------------
    // Innovation Score
    //----------------------------------------

    let innovationScore = 60;

    if (businessModel === "AI")
        innovationScore = 95;

    else if (businessModel === "SaaS")
        innovationScore = 85;

    else if (businessModel === "Marketplace")
        innovationScore = 75;

    //----------------------------------------
    // Competition Score
    //----------------------------------------

    let competitionScore = 90;

    if (competitors >= 10)
        competitionScore = 40;

    else if (competitors >= 6)
        competitionScore = 60;

    else if (competitors >= 3)
        competitionScore = 75;

    //----------------------------------------
    // Risk Score
    //----------------------------------------

    const riskScore = 100 - risk.overallRisk;

    //----------------------------------------
    // Final Score
    //----------------------------------------

    const score = Math.round(

        (
            marketScore +
            financialScore +
            innovationScore +
            competitionScore +
            riskScore
        ) / 5

    );

    //----------------------------------------
    // Grade
    //----------------------------------------

    let grade = "";

    if (score >= 90)
        grade = "A+";

    else if (score >= 80)
        grade = "A";

    else if (score >= 70)
        grade = "B";

    else if (score >= 60)
        grade = "C";

    else
        grade = "D";

    //----------------------------------------
    // Verdict
    //----------------------------------------

    let verdict = "";

    if (score >= 85)
        verdict = "Highly Feasible";

    else if (score >= 70)
        verdict = "Promising";

    else if (score >= 55)
        verdict = "Needs Improvement";

    else
        verdict = "High Risk";

    //----------------------------------------
    // Investment
    //----------------------------------------

    const investment =
        score >= 70
            ? "Recommended"
            : "Not Recommended";

    //----------------------------------------
    // Launch Readiness
    //----------------------------------------

    const readiness =
        score >= 80
            ? "Ready for MVP"
            : "Needs More Validation";

    //----------------------------------------

    return {

        marketScore,

        financialScore,

        innovationScore,

        competitionScore,

        riskScore,

        score,

        grade,

        verdict,

        investment,

        readiness

    };

}