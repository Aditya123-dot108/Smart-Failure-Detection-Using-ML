import {
  TrendingUp,
  BarChart3,
  ShieldCheck,
  BadgeDollarSign
} from "lucide-react";

const cards = [
  {
    title: "STARTUP SCORE",
    value: "87%",
    status: "Excellent",
    color: "text-green-400",
    progress: 87,
    trend: "+4%",
    icon: TrendingUp,
    iconColor: "text-green-400"
  },
  {
    title: "MARKET POTENTIAL",
    value: "High",
    status: "+11.3%",
    color: "text-cyan-400",
    progress: 82,
    trend: "+6%",
    icon: BarChart3,
    iconColor: "text-cyan-400"
  },
  {
    title: "RISK LEVEL",
    value: "Low",
    status: "Safe",
    color: "text-green-400",
    progress: 24,
    trend: "-18%",
    icon: ShieldCheck,
    iconColor: "text-green-400"
  },
  {
    title: "INVESTMENT",
    value: "92%",
    status: "Ready",
    color: "text-yellow-400",
    progress: 92,
    trend: "+8%",
    icon: BadgeDollarSign,
    iconColor: "text-yellow-400"
  }
];

export default function KPICards() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="
            rounded-2xl
            border border-[#2C3245]
            bg-[#11151F]
            p-4
            transition-all
            duration-300
            hover:border-yellow-500/40
            hover:-translate-y-1
            hover:shadow-2xl
            "
          >

            <div className="flex justify-between items-start">

              <div>

                <div className="text-[12px] tracking-[4px] text-[#8088A5]">
                  {card.title}
                </div>

                <div className="mt-2 text-3xl font-bold text-white">
                  {card.value}
                </div>

                <div className={`mt-1 text-lg font-semibold ${card.color}`}>
                  {card.status}
                </div>

              </div>

              <div
                className="
                h-11
                w-11
                rounded-2xl
                bg-[#171B24]
                flex
                items-center
                justify-center
                "
              >
                <Icon
className={card.iconColor}
size={24}
/>
              </div>

            </div>

            <div className="mt-3">

              <div className="flex justify-between text-xs text-[#7E879E]">

                <span>Progress</span>

                <span>{card.progress}%</span>

              </div>

              <div className="mt-2 h-2 rounded-full bg-[#252B39]">

                <div
                  className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                  style={{ width: `${card.progress}%` }}
                />

              </div>

            </div>

            <div className="mt-3 flex justify-between">

              <span className="text-[#7E879E] text-xs">
                Last Updated
              </span>

              <span className={`${card.color} text-xs font-semibold`}>
                {card.trend}
              </span>

            </div>

          </div>

        );

      })}

    </div>
  );
}