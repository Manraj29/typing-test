import React from "react";

function TestWordTimer({ testStyle, testValue, isTestRunning, wordCount, timeLeft, testCompleted }) {
  return (
    <div className="mb-4">
      {testStyle === "time" ? (
        <div className="text-2xl text-white font-bold">
          {isTestRunning ? `${timeLeft}s` : `${timeLeft}s`}
        </div>
      ) : (
        <div className="text-2xl text-white font-bold">
          {testCompleted ? `` : `${wordCount} / ${testValue}`}
        </div>
      )}
    </div>
  );
}

export default TestWordTimer;
