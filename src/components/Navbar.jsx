import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";

function Navbar({ selectedDifficulty, setSelectedDifficulty, selectedLang, setSelectedLang, testStyle, testValue, testCompleted, totalMistakes, liveWPM, liveAccuracy }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTheme, setSelectedTheme] = useState("dark");
	const [showRecord, setShowRecord] = useState(false);
	const [selectedOptions, setSelectedOptions] = useState({
		language: "english-200",
		testStyle: "time-15",
	});

	const setOptions = (options) => {
		setSelectedOptions(options);
		// console.log(options);

	};

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleDifficultyChange = (event) => {
		setSelectedDifficulty(event.target.value);
		// alert(`Selected difficulty: ${event.target.value}`);
	};

	const handleThemeChange = (event) => {
		setSelectedTheme(event.target.value);
		// alert(`Selected theme: ${event.target.value}`);
	};

	const handleLangChange = (event) => {
		setSelectedLang(event.target.value);
		// if (event.target.value === "english-200") {
		// 	alert(`Selected language: English - Easy`);
		// }
		// else if (event.target.value === "english-300") {
		// 	alert(`Selected language: English - Medium`);
		// }
		// else if (event.target.value === "english-500") {
		// 	alert(`Selected language: English - Hard`);
		// }

		// alert(`Selected language: ${event.target.value}`);
	}
	let selLang = "";
	if (selectedOptions.language === "english-200") {
		selLang = "easy";
	} else if (selectedOptions.language === "english-300") {
		selLang = "medium";
	}
	else {
		selLang = "hard";
	}

	const displayRecord = () => {
		// Retrieve the dictionary of all test results from localStorage
		const storedData = JSON.parse(localStorage.getItem("testResults")) || {}; // Get stored results or empty object

		if (!localStorage.getItem("testResults")) {
			return (
				<div className="bg-[#171a25] mt-4">
					<p className="text-xl bg-[#171a25]">No records found</p>
				</div>
			);
		}
		else {
			const key = `${selectedOptions.testStyle}-${selLang}`;
			// console.log(key);

			if (!storedData[key]) {
				return (
					<div className="bg-[#171a25] mt-4">
						<p className="text-xl bg-[#171a25] ">No records found for this test</p>
					</div>
				);
			}

			const record = storedData[key]; // Get the record for the current test style and value
			// Destructure the record data
			const {
				liveWPM,
				liveAccuracy,
				testStyle,
				testValue,
				testCompleted,
				totalMistakes,
				difficulty,
				language,
				dateTime,
			} = record;
			// console.log(language);

			if (selectedOptions.language === language) {
				// console.log("Language is the same");

				// Format the date and time
				const date = new Date(dateTime);
				// const formattedDate = date.toLocaleDateString();
				// convert date into 04th December 2021 format
				const options = { year: 'numeric', month: 'long', day: '2-digit' };
				const formattedDate = date.toLocaleDateString('en-GB', options);
				// console.log(formattedDate);

				const hour = date.getHours();
				const minute = date.getMinutes();

				// convert time into 12:30 PM format
				const formattedTime = `${hour % 12 || 12}:${minute < 10 ? "0" : ""}${minute} ${hour >= 12 ? "pm" : "am"}`;
				// console.log(formattedTime);
				return (
					<div className=" bg-[#171a25]">
						<p className="text-2xl bg-[#171a25]">WPM: <span className="bg-[#171a25] font-bold">{liveWPM}</span></p>
						<p className="text-2xl bg-[#171a25]">Accuracy: <span className="bg-[#171a25] font-bold">{liveAccuracy}</span></p>
						{/* {testStyle === "time" ? (
							<p className="text-xl bg-[#171a25]">Test Time: {testValue} seconds</p>
						) : (
							<p className="text-xl bg-[#171a25]">Test Words: {testValue} words</p>
						)} */}
						{totalMistakes > 0 ? (
							<p className="text-xl bg-[#171a25]">Mistakes: {totalMistakes}</p>
						) : (
							""
						)}

						{/* <p className="text-xl bg-[#171a25]">Difficulty: {difficulty === "easy" ? "Easy" : difficulty === "expert" ? "Expert" : "Master"}</p> */}
						<p className="text-xl bg-[#171a25]">Date: {formattedDate}</p>
						<p className="text-xl bg-[#171a25]">Time: {formattedTime}</p>
					</div>
				);
			}
			else {
				return (
					<div className="bg-[#171a25]">
						<p className="text-xl bg-[#171a25]">No records found</p>
					</div>
				);
			}
		}
	};

	const resetAll = () => {
		let confirmb = confirm("Are you sure you want to delete all records?")
		if (!confirmb) {
			return;
		}
		localStorage.clear();
		alert("All records deleted successfully!");
		window.location.reload();
	};

	const deleteRecords = () => {
		// Retrieve the dictionary of all test results from localStorage
		const storedData = JSON.parse(localStorage.getItem("testResults")) || {}; // Get stored results or empty object

		if (!localStorage.getItem("testResults")) {
			alert("No records found to delete");
		}
		else {
			const key = `${selectedOptions.testStyle}-${selLang}`;
			// alert(key);
			// console.log(key);

			if (!storedData[key]) {
				alert("No record found for this test to delete");
			}
			else {
				delete storedData[key];
				localStorage.setItem("testResults", JSON.stringify(storedData));
				alert("Record deleted successfully!");
			}
		}
		window.location.reload();
	};


	return (
		<>
			<nav>
				<div>
					<div className="relative flex h-20 items-center justify-between">
						<div className="flex flex-1 items-center">
							<h1 className="text-3xl font-bold">Typing Test</h1>
						</div>

						<div className="flex items-center">
							<button
								type="button"
								className="relative rounded-full"
								onClick={toggleModal} // Open the modal when clicked
							>
								<FontAwesomeIcon className="text-white text-xl" icon={faGear} />
							</button>
						</div>
					</div>
				</div>
			</nav>

			{isModalOpen && (
				<div className="modal-overlay fixed inset-0 bg-gray-700 z-40 bg-opacity-50 flex items-center justify-center">
					<div className="modal-content bg-[#171a25] text-[#454864] p-6 rounded-lg w-96">
						<h2 className="text-xl font-bold mb-4 bg-[#171a25]">Settings</h2>
						<hr className="my-4 border-[#454864]" />
						{/* <div className="mb-4">
							<label className="block text-sm font-medium bg-[#171a25]">Select Difficulty</label>
							<select
								className="py-2 bg-[#171a25] w-full"
								value={selectedDifficulty}
								onChange={handleDifficultyChange}
							>
								<option value="easy">easy</option>
								<option value="expert">expert</option>
								<option value="master">master</option>
							</select>
						</div> */}

						{/* <div className="mb-4 bg-[#171a25]">
							<label className="block text-sm font-medium bg-[#171a25]">Select Theme</label>
							<select
								className="py-2 w-full bg-[#171a25]"
								value={selectedTheme}
								onChange={handleThemeChange}
							>
								<option value="dark">dark</option>
								<option value="current">current</option>
								<option value="light">light</option>
								<option value="pink">pink</option>
							</select>
						</div> */}

						<div className="mb-4 bg-[#171a25]">
							<label className="block text-sm font-medium bg-[#171a25]">Change Language</label>
							<select
								className="py-2 w-full bg-[#171a25]"
								value={selectedLang}
								onChange={handleLangChange}
							>
								<option value="english-200">english-easy</option>
								<option value="english-300">english-medium</option>
								<option value="english-500">english-hard</option>
							</select>
						</div>

						<hr className="my-4 border-[#454864]" />

						{/* Mode and Highest WPM */}
						<div className="text-center bg-[#171a25]">
							<p className="bg-[#171a25] font-bold">✨RECORD ALERT✨</p>
							<div className=" flex-row items-center bg-[#171a25] mx-auto text-center">
								<select
									className="py-2 w-50 bg-[#171a25] mr-4"
									value={selectedOptions.language}
									onChange={(e) => setOptions({ ...selectedOptions, language: e.target.value })}
								>
									<option disabled value="easy">Select Language</option>
									<option value="english-200">english-easy</option>
									<option value="english-300">english-medium</option>
									<option value="english-500">english-hard</option>
								</select>
								<select
									className="py-2 w-50 bg-[#171a25]"
									value={selectedOptions.testStyle}
									onChange={(e) => setOptions({ ...selectedOptions, testStyle: e.target.value })}
								>
									<option disabled value="time">Style -  Time</option>
									<option value="time-15">15 seconds</option>
									<option value="time-30">30 seconds</option>
									<option value="time-60">60 seconds</option>
									<option value="time-120">120 seconds</option>
									<option disabled value="time">Style - Words</option>
									<option value="words-10">10 words</option>
									<option value="words-25">25 words</option>
									<option value="words-50">50 words</option>
									<option value="words-100">100 words</option>
								</select>
							</div>
							{/* <button className="mt-4 text-white text-xl rounded-md p-2 border text-[#FFFF00] pointer mb-3 hover:text-white" onClick={() => setShowRecord(!showRecord)}>
								{showRecord ? displayRecord() : "Show Record"}
							</button> */}
							{displayRecord()}
						</div>
						<hr className="my-4 border-[#454864]" />
						<button className="mt-4 px-4 text-[#FF0000] text-xl rounded-md w-full  hover:text-white" onClick={deleteRecords}>
							Delete Records
						</button>
						<hr className="mx-16 my-1 border-[#454864]" />
						<button className="mt-2 text-[#FF0000] text-xl rounded-md w-full  hover:text-white" onClick={resetAll}>
							Reset all
						</button>

						<button
							className="mt-4 px-4 py-2 text-white text-3xl rounded-md w-full  hover:text-white"
							onClick={toggleModal}
						>
							<FontAwesomeIcon className="ml-2 bg-[#171a25]" icon={faXmark} />
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export default Navbar;
