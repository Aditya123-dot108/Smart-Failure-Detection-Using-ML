// SWOT Analysis Engine

export function generateSWOT(project) {

    const {
        sector,
        businessModel,
        budgetLakh,
        competitors = 5
    } = project;

    const strengths = [];
    const weaknesses = [];
    const opportunities = [];
    const threats = [];

    //----------------------------------
    // Budget
    //----------------------------------

    if (budgetLakh >= 50) {

        strengths.push("Strong initial funding");

    } else {

        weaknesses.push("Limited financial resources");

    }

    //----------------------------------
    // Sector
    //----------------------------------

    switch (sector) {

        case "Healthcare":

            strengths.push("Growing healthcare market");
            opportunities.push("Government digital health initiatives");
            threats.push("Strict healthcare regulations");
            break;

        case "FinTech":

            strengths.push("High demand for digital payments");
            opportunities.push("Rapid fintech adoption");
            threats.push("Banking compliance requirements");
            break;

        case "Education":

            strengths.push("Growing online education market");
            opportunities.push("Increasing digital learning");
            break;

        case "AI":

            strengths.push("High innovation potential");
            opportunities.push("Rapid AI adoption");
            break;

        default:

            opportunities.push("Emerging business opportunities");
    }

    //----------------------------------
    // Business Model
    //----------------------------------

    if (businessModel === "SaaS") {

        strengths.push("Highly scalable subscription model");

    }

    if (businessModel === "AI") {

        strengths.push("Advanced technology advantage");

    }

    if (businessModel === "Marketplace") {

        opportunities.push("Network effect growth potential");

    }

    //----------------------------------
    // Competition
    //----------------------------------

    if (competitors >= 8) {

        threats.push("Highly competitive market");
        weaknesses.push("Difficult customer acquisition");

    } else if (competitors >= 5) {

        threats.push("Moderate competition");

    } else {

        strengths.push("Less crowded market");

    }

    //----------------------------------
    // Default values
    //----------------------------------

    if (strengths.length === 0)
        strengths.push("Business has growth potential");

    if (weaknesses.length === 0)
        weaknesses.push("Requires continuous improvement");

    if (opportunities.length === 0)
        opportunities.push("Expanding market demand");

    if (threats.length === 0)
        threats.push("Changing market conditions");

    //----------------------------------

    return {

        strengths,
        weaknesses,
        opportunities,
        threats

    };

}