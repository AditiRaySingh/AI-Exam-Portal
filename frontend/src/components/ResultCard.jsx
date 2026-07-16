import "../styles/resultCard.css";

function ResultCard({
  title,
  date,
  percentage,
  marks
}) {

  const percent = parseFloat(percentage);

  return (

    <div className="dashboard-result-card">

      <div className="result-left">

        <div className="result-icon">
          📝
        </div>

        <div>

          <h3>{title}</h3>

          <p>
            Submitted on {date}
          </p>

        </div>

      </div>

      <div className="dashboard-result-right">

        <div className="score-box">

          <h2>{percentage}</h2>

          <span>{marks}</span>

        </div>

        <div
          className={
            percent >= 40
              ? "dashboard-badge pass"
              : "dashboard-badge fail"
          }
        >
          {percent >= 40 ? "Passed" : "Failed"}
        </div>

        <button className="dashboard-detail-btn">
          View Details
        </button>

      </div>

    </div>

  );

}

export default ResultCard;