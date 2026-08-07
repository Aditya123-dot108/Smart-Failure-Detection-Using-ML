// Risk Engine
// Calculates startup risk scores

export function calculateRisk(project) {

    const {
        sector,
        businessModel,
        budgetLakh,
        competitors = 5
    } = project;

    let marketRisk = 50;
    let financialRisk = 50;
    let competitionRisk = 50;
    let technologyRisk = 50;
    let regulatoryRisk = 50;

    //--------------------------------------------------
    // Market Risk
    //--------------------------------------------------

    const growingSectors = [
        "AI",
        "Healthcare",
        "FinTech",
        "Cybersecurity",
        "Cloud",
        "EdTech"
    ];

    if (growingSectors.includes(sector)) {
        marketRisk = 25;
    } else {
        marketRisk = 55;
    }

    //--------------------------------------------------
    // Financial Risk
    //--------------------------------------------------

    if (budgetLakh >= 100) {
        financialRisk = 20;
    } else if (budgetLakh >= 50) {
        financialRisk = 35;
    } else if (budgetLakh >= 20) {
        financialRisk = 55;
    } else if (budgetLakh >= 10) {
        financialRisk = 75;
    } else {
        financialRisk = 90;
    }

    //--------------------------------------------------
    // Competition Risk
    //--------------------------------------------------

    if (competitors <= 2) {
        competitionRisk = 20;
    } else if (competitors <= 5) {
        competitionRisk = 40;
    } else if (competitors <= 10) {
        competitionRisk = 60;
    } else {
        competitionRisk = 85;
    }

    //--------------------------------------------------
    // Technology Risk
    //--------------------------------------------------

    if (businessModel === "SaaS") {
        technologyRisk = 30;
    } else if (businessModel === "AI") {
        technologyRisk = 55;
    } else if (businessModel === "Blockchain") {
        technologyRisk = 80;
    } else {
        technologyRisk = 45;
    }

    //--------------------------------------------------
    // Regulatory Risk
    //--------------------------------------------------

    switch (sector) {

        case "Healthcare":
            regulatoryRisk = 75;
            break;

        case "FinTech":
            regulatoryRisk = 80;
            break;

        case "Education":
            regulatoryRisk = 25;
            break;

        case "Retail":
            regulatoryRisk = 35;
            break;

        default:
            regulatoryRisk = 45;
    }

    //--------------------------------------------------
    // Overall Risk
    //--------------------------------------------------

    const overallRisk = Math.round(

        (
            marketRisk +
            financialRisk +
            competitionRisk +
            technologyRisk +
            regulatoryRisk
        ) / 5

    );

    //--------------------------------------------------
    // Category
    //--------------------------------------------------

    let category = "";

    if (overallRisk <= 35) {

        category = "Low";

    } else if (overallRisk <= 65) {

        category = "Medium";

    } else {

        category = "High";

    }

    //--------------------------------------------------
    // Confidence
    //--------------------------------------------------

    const confidence = Math.max(

        60,

        100 - Math.round(overallRisk / 2)

    );

    //--------------------------------------------------

    return {

        marketRisk,

        financialRisk,

        competitionRisk,

        technologyRisk,

        regulatoryRisk,

        overallRisk,

        category,

        confidence

    };

}