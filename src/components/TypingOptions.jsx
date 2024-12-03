import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faKeyboard } from "@fortawesome/free-solid-svg-icons";

function TypingOptions({ selectedOption, setSelectedOption, selectedValue, setSelectedValue }) {

    const timeOptions = [15, 30, 60, 120];
    const wordsOptions = [10, 25, 50, 100];

    const options = selectedOption === "time" ? timeOptions : wordsOptions;

    // Set the default value to the first option when `selectedOption` changes
    // useEffect(() => {
    //     setSelectedValue(options[0]);
    // }, [selectedOption]);

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    const handleValueChange = (value) => {
        setSelectedValue(value);
    };

    return (
        <div className="max-w-2xl mx-auto lg:my-12 my-6">
            <div className="bg-[#171a25] px-2 flex flex-col sm:flex-row justify-between items-center rounded-lg text-sm">
                {/* Buttons to toggle between Time and Words */}
                <div className="flex bg-[#171a25] text-center flex">
                    <button
                        onClick={() => handleOptionChange("time")}
                        className={`p-2 rounded ${
                            selectedOption === "time"
                                ? ""
                                : "text-[#454864] hover:text-white"
                        } flex items-center`}
                    >
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        time
                    </button>
                    <button
                        onClick={() => handleOptionChange("words")}
                        className={`p-2 font-bold rounded ${
                            selectedOption === "words"
                                ? ""
                                : "text-[#454864] hover:text-white"
                        } flex items-center`}
                    >
                        <FontAwesomeIcon icon={faKeyboard} className="mr-2" />
                        words
                    </button>
                </div>
                <hr className="border-[#454864] w-full sm:w-1/2" />
                {/* Options for time/words */}
                <div className="flex bg-[#171a25]">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleValueChange(option)}
                            className={`p-2 font-extrabold  ${
                                selectedValue === option
                                    ? ""
                                    : "bg-[#171a25] text-[#454864] hover:text-white"
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Display selected value */}
            {/* <div className="text-center text-white mt-4">
                {selectedOption === "time"
                    ? `selected Time: ${selectedValue} seconds`
                    : `selected Words: ${selectedValue} words`}
            </div> */}
            <br />
        </div>
    );
}

export default TypingOptions;
