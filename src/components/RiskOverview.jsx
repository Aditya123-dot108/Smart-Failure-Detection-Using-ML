export default function RiskOverview({ risk }) {

  if (!risk) return null;

  const risks = [
    {
      title: "Market Risk",
      value: risk.marketRisk ?? 30,
      color: "bg-green-500"
    },
    {
      title: "Financial Risk",
      value: risk.financialRisk ?? 45,
      color: "bg-yellow-500"
    },
    {
      title: "Competition Risk",
      value: risk.competitionRisk ?? 65,
      color: "bg-red-500"
    },
    {
      title: "Technology Risk",
      value: risk.technologyRisk ?? 35,
      color: "bg-cyan-500"
    },
    {
      title: "Regulatory Risk",
      value: risk.regulatoryRisk ?? 40,
      color: "bg-orange-500"
    }
  ];

  return (

    <div className="mt-8 rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold text-white">

            Risk Intelligence

          </h2>

          <p className="text-slate-400 text-sm">

            Automated project risk assessment

          </p>

        </div>

        <div className="text-right">

          <div className="text-4xl font-bold text-red-400">

            {risk.overallScore ?? 48}%

          </div>

          <div className="text-slate-400">

            Overall Risk

          </div>

        </div>

      </div>

      <div className="space-y-5">

        {risks.map(item => (

          <div key={item.title}>

            <div className="flex justify-between mb-2">

              <span className="font-medium">

                {item.title}

              </span>

              <span className="font-semibold">

                {item.value}%

              </span>

            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">

              <div

                className={`${item.color} h-3 transition-all duration-1000 rounded-full`}

                style={{

                  width: `${item.value}%`

                }}

              />

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}