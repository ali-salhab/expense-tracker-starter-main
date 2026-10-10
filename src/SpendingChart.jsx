import { useCallback, useState, useSyncExternalStore } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts'
import { formatCategory, formatMoney, formatShortMoney } from './format.js'

// Match the color tokens in index.css; SVG attributes can't read CSS variables.
const VIOLET = "#5B47B0";
const INK = "#1A2E26";
const GRAPHITE = "#5C6A64";
const RULE = "#DCE1DB";
const HOVER = "#E9ECE6";

const LABEL_FONT_SIZE = 13;
const LABEL_ANGLE = 40;
const LABEL_GAP = 8;

const labelCanvas = document.createElement("canvas").getContext("2d");
const measureLabel = (category) => {
  labelCanvas.font = `${LABEL_FONT_SIZE}px Archivo, system-ui, sans-serif`;
  return labelCanvas.measureText(formatCategory(category)).width;
};

// Angle the category labels when the widest one doesn't fit under its bar, and
// make room on the left for the first angled label, which hangs past its bar.
function getAxisLayout(data, chartWidth) {
  const bandWidth = chartWidth / data.length;
  const labelWidths = data.map(d => measureLabel(d.category));
  const widest = Math.max(...labelWidths);

  if (chartWidth === 0 || widest + LABEL_GAP <= bandWidth) {
    return { angle: 0, textAnchor: "middle", height: 30, leftMargin: 0 };
  }

  const radians = (LABEL_ANGLE * Math.PI) / 180;
  return {
    angle: -LABEL_ANGLE,
    textAnchor: "end",
    height: Math.ceil(widest * Math.sin(radians)) + 24,
    leftMargin: Math.max(0, Math.ceil(labelWidths[0] * Math.cos(radians) - bandWidth / 2) + LABEL_GAP),
  };
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const subscribeToReducedMotion = (onChange) => {
  reducedMotion.addEventListener("change", onChange);
  return () => reducedMotion.removeEventListener("change", onChange);
};

function SpendingChart({ transactions }) {
  const [chartWidth, setChartWidth] = useState(0);
  const reduceMotion = useSyncExternalStore(subscribeToReducedMotion, () => reducedMotion.matches);

  // Label layout depends on the chart's own width, not the viewport's: in the
  // two-column layout the chart can be narrower on a tablet than on a phone.
  const measureFrame = useCallback((node) => {
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setChartWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const totals = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });

  const data = Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  if (data.length === 0) {
    return (
      <section className="spending-chart">
        <h2>Spending by category</h2>
        <p className="chart-empty">No spending yet. Expenses you add will show up here by category.</p>
      </section>
    );
  }

  const axis = getAxisLayout(data, chartWidth);

  return (
    <section className="spending-chart">
      <h2>Spending by category</h2>
      <div className="chart-frame" ref={measureFrame}>
        <BarChart
          responsive
          style={{ width: "100%", height: "100%" }}
          data={data}
          margin={{ top: 24, right: 0, bottom: 0, left: axis.leftMargin }}
        >
          <XAxis
            dataKey="category"
            interval={0}
            axisLine={{ stroke: RULE }}
            tickLine={false}
            tickFormatter={formatCategory}
            angle={axis.angle}
            height={axis.height}
            tick={{ fill: GRAPHITE, fontSize: LABEL_FONT_SIZE, textAnchor: axis.textAnchor }}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: HOVER }}
            labelFormatter={formatCategory}
            formatter={(value) => [formatMoney(value), "Spent"]}
            contentStyle={{ border: "1px solid var(--rule)", borderRadius: 8, fontSize: "0.875rem" }}
            labelStyle={{ color: "var(--ink)", fontWeight: 600 }}
            itemStyle={{ color: "var(--ink)" }}
          />
          <Bar
            dataKey="amount"
            fill={VIOLET}
            barSize={24}
            radius={[4, 4, 0, 0]}
            isAnimationActive={!reduceMotion}
          >
            <LabelList dataKey="amount" position="top" formatter={formatShortMoney} fill={INK} fontSize={LABEL_FONT_SIZE} />
          </Bar>
        </BarChart>
      </div>
    </section>
  );
}

export default SpendingChart
