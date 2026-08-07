export default function SWOTAnalysis({ swot }) {

    if (!swot) return null;

    const cards = [
        {
            title: "Strengths",
            color: "border-green-500",
            bg: "bg-green-500/10",
            text: "text-green-400",
            icon: "💪",
            items: swot.strengths
        },
        {
            title: "Weaknesses",
            color: "border-yellow-500",
            bg: "bg-yellow-500/10",
            text: "text-yellow-400",
            icon: "⚠️",
            items: swot.weaknesses
        },
        {
            title: "Opportunities",
            color: "border-blue-500",
            bg: "bg-blue-500/10",
            text: "text-blue-400",
            icon: "🚀",
            items: swot.opportunities
        },
        {
            title: "Threats",
            color: "border-red-500",
            bg: "bg-red-500/10",
            text: "text-red-400",
            icon: "🛡️",
            items: swot.threats
        }
    ];

    return (

        <div className="mt-8">

            <h2 className="text-2xl font-bold mb-6">
                SWOT Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {cards.map(card => (

                    <div
                        key={card.title}
                        className={`
                            rounded-2xl
                            border
                            ${card.color}
                            ${card.bg}
                            p-6
                            shadow-lg
                        `}
                    >

                        <h3
                            className={`
                                text-xl
                                font-semibold
                                mb-4
                                ${card.text}
                            `}
                        >
                            {card.icon} {card.title}
                        </h3>

                        <ul className="space-y-3">

                            {card.items.map((item, index) => (

                                <li
                                    key={index}
                                    className="flex items-start gap-2"
                                >

                                    <span className="text-green-400">
                                        ✔
                                    </span>

                                    <span>
                                        {item}
                                    </span>

                                </li>

                            ))}

                        </ul>

                    </div>

                ))}

            </div>

        </div>

    );

}