export default function AIExecutiveSummary({ summary }) {

    if (!summary) return null;

    return (

        <div className="mt-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl">

            <div className="flex items-center gap-3 mb-6">

                <div className="text-4xl">

                    🤖

                </div>

                <div>

                    <h2 className="text-2xl font-bold text-white">

                        AI Executive Summary

                    </h2>

                    <p className="text-slate-400">

                        Automatically generated startup analysis

                    </p>

                </div>

            </div>

            <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-6">

                <p className="leading-8 text-slate-200 text-lg">

                    {summary}

                </p>

            </div>

        </div>

    );

}