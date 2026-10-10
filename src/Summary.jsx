import { formatMoney } from './format.js'

function Summary({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Round to cents so floating-point leftovers (0.30 - 0.10 - 0.20) don't read as overspending.
  const balance = Math.round((totalIncome - totalExpenses) * 100) / 100;
  const overspent = balance < 0;
  const figure = formatMoney(Math.abs(balance));

  let spentShare = 0;
  if (totalIncome > 0) {
    spentShare = Math.min(totalExpenses / totalIncome, 1);
  } else if (totalExpenses > 0) {
    spentShare = 1;
  }
  const isEmpty = totalIncome === 0 && totalExpenses === 0;

  return (
    <section className="balance">
      <p className="balance-label">
        {!overspent && <span className="swatch swatch-left" aria-hidden="true" />}
        {overspent ? "Overspent by" : "Left to spend"}
      </p>
      <p className="balance-figure" style={{ "--figure-chars": String(figure.length) }}>{figure}</p>

      <div
        className={isEmpty ? "meter meter-empty" : "meter"}
        role="img"
        aria-label={`${formatMoney(totalExpenses)} spent of ${formatMoney(totalIncome)} income`}
      >
        {spentShare > 0 && <span className="meter-spent" style={{ flexBasis: `${spentShare * 100}%` }} />}
        {spentShare < 1 && totalIncome > 0 && <span className="meter-left" />}
      </div>

      <div className="meter-legend">
        <span className="legend-item">
          <span className="swatch swatch-spent" aria-hidden="true" />
          <span><strong>{formatMoney(totalExpenses)}</strong> spent</span>
        </span>
        <span>of <strong>{formatMoney(totalIncome)}</strong> income</span>
      </div>
    </section>
  );
}

export default Summary
