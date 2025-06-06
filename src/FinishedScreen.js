function FinishedScreen({ points, maxPossiblePoints,highscore }) {
  const percentage = (points / maxPossiblePoints) * 100;
  return (
    <>
      <p className="result">
        {`you scrored ${points} points! out of
        ${maxPossiblePoints} thats ${Math.ceil(percentage)}%`}
      </p>
      <p className="highscore">Highscore: {highscore}</p>
    </>
  );
}

export default FinishedScreen;
