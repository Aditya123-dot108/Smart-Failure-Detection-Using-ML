export function generateAISummary(data) {

    const {
        feasibility,
        risk,
        market,
        swot
    } = data;

    let summary = "";

    if (feasibility.score >= 80) {

        summary +=
            "This startup demonstrates excellent business potential. ";

    }
    else if (feasibility.score >= 60) {

        summary +=
            "This startup has promising market potential but requires strategic improvements. ";

    }
    else {

        summary +=
            "The project requires significant improvements before investment. ";

    }

    if (risk.overallLevel === "LOW") {

        summary +=
            "Overall project risk is low. ";

    }
    else if (risk.overallLevel === "MEDIUM") {

        summary +=
            "Overall project risk is moderate. ";

    }
    else {

        summary +=
            "Overall project risk is high. ";

    }

    summary +=
        `The estimated Serviceable Obtainable Market is ₹${market.som.toFixed(2)} Cr. `;

    summary +=
        `Major strength: ${swot.strengths[0]}. `;

    summary +=
        `Primary weakness: ${swot.weaknesses[0]}. `;

    summary +=
        `Best opportunity: ${swot.opportunities[0]}. `;

    summary +=
        `Biggest threat: ${swot.threats[0]}. `;

    if (feasibility.score >= 75) {

        summary +=
            "Recommendation: Proceed with MVP launch.";

    }
    else {

        summary +=
            "Recommendation: Improve business model before launch.";

    }

    return summary;

}