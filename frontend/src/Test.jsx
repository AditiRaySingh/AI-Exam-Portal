import CountUp from "react-countup";

export default function Test() {
  console.log("CountUp =", CountUp);

  return (
    <div>
      <h1>Test</h1>
      <CountUp end={100} />
    </div>
  );
}