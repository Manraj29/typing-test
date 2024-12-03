import React from "react";

function TestScore({ liveWPM, liveAccuracy, testMistakes }) {

    return (
        <div className="lg:mt-16 mt-4 text-center m-auto justify-between">
            <div className="text-center mx-auto text-6xl text-gray-500 ">
                {/* display live WPM each time render */}
                {liveWPM} <span className="text-2xl text-gray-500">wpm</span> &nbsp;

                {liveAccuracy} <span className="text-2xl text-gray-500">acc</span>
            </div>
            <br />
            <div className="text-center mx-auto text-4xl text-gray-500">
                {testMistakes} <span className="text-2xl text-gray-500">mistake/s</span>
            </div>
        </div>
    );
}
export default TestScore;