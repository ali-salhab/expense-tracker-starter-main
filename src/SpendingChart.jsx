import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts'

const formatDollars = (value) => `$${value}`;

function SpendingChart({ transactions }) {
  const totals = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });

  const data = Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="spending-chart">
      <h2>Spending by Category</h2>
      {data.length === 0 ? (
        <p className="chart-empty">No expenses yet.</p>
      ) : (
        <BarChart
          responsive
          style={{ width: "100%", height: 260 }}
          data={data}
          margin={{ top: 24, right: 0, bottom: 0, left: 0 }}
        >
          <XAxis
            dataKey="category"
            interval={0}
            axisLine={{ stroke: "#ddd" }}
            tickLine={false}
            tick={{ fill: "#555", fontSize: 13 }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "#f5f5f5" }}
            formatter={(value) => [formatDollars(value), "Spent"]}
            itemStyle={{ color: "#333" }}
          />
          <Bar dataKey="amount" fill="#2a78d6" barSize={24} radius={[4, 4, 0, 0]}>
            <LabelList dataKey="amount" position="top" formatter={formatDollars} fill="#333" fontSize={13} />
          </Bar>
        </BarChart>
      )}
    </div>
  );
}

export default SpendingChart
