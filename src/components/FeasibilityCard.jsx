export default function FeasibilityCard({ feasibility }) {

    if (!feasibility) return null;

    return (

        <div className="mt-8 rounded-2xl border border-cyan-500 bg-slate-900 p-6 shadow-xl">

            <h2 className="text-2xl font-bold mb-6">

                Startup Feasibility Assessment

            </h2>

            <div className="grid md:grid-cols-2 gap-6">

                <div>

                    <div className="text-6xl font-bold text-cyan-400">

                        {feasibility.score}%

                    </div>

                    <div className="mt-2 text-xl">

                        Grade :

                        <span className="text-green-400">

                            {" "}{feasibility.grade}

                        </span>

                    </div>

                    <div className="mt-2">

                        {feasibility.verdict}

                    </div>

                </div>

                <div className="space-y-3">

                    <div>

                        Market Score

                        <b className="float-right">

                            {feasibility.marketScore}

                        </b>

                    </div>

                    <div>

                        Financial Score

                        <b className="float-right">

                            {feasibility.financialScore}

                        </b>

                    </div>

                    <div>

                        Innovation Score

                        <b className="float-right">

                            {feasibility.innovationScore}

                        </b>

                    </div>

                    <div>

                        Competition Score

                        <b className="float-right">

                            {feasibility.competitionScore}

                        </b>

                    </div>

                    <div>

                        Risk Score

                        <b className="float-right">

                            {feasibility.riskScore}

                        </b>

                    </div>

                    <hr />

                    <div>

                        Investment

                        <b className="float-right text-green-400">

                            {feasibility.investment}

                        </b>

                    </div>

                    <div>

                        Launch Readiness

                        <b className="float-right text-cyan-400">

                            {feasibility.readiness}

                        </b>

                    </div>

                </div>

            </div>

        </div>

    );

}