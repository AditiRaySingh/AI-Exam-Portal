import "../styles/resultCard.css";

function ResultCard({
 title,
 date,
 percentage,
 marks
}){

 return(

  <div className="result-card">

   <div>

    <h3>
      {title}
    </h3>

    <p>
      Submitted
      {date}
    </p>

   </div>

   <div className="result-right">

    <div>

     <h2>
      {percentage}
     </h2>

     <p>
      {marks}
     </p>

    </div>

    <span
     className="badge"
    >
      Passed
    </span>

    <button
     className="detail-btn"
    >
      View Details
    </button>

   </div>

  </div>
 );
}

export default ResultCard;