import React, { useState, useEffect, useRef } from "react";
import { easyWords, expertWords, masterWords } from "./words";
import TestWordTimer from "./TestWordTimer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight, faLanguage } from "@fortawesome/free-solid-svg-icons";
import TestScore from "./TestScore";

function TypingArea({ testStyle, testValue, difficulty, language, testCompleted, setTestCompleted, wordCount, setWordCount, timeLeft, setTimeLeft, mistakes, setMistakes, isTestRunning, setIsTestRunning, liveWPM, liveAccuracy, setLiveWPM, setLiveAccuracy, wpmArray, accuracyArray, setWpmArray, setAccuracyArray }) {
  const [words, setWords] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0); // Track character index
  const [charStatus, setCharStatus] = useState([]); // Track correctness of each character
  const [correctWords, setCorrectWords] = useState(0); // Track correct words
  const [isTimerStarted, setIsTimerStarted] = useState(false); // To track when the timer starts
  const containerRef = useRef(null); // Reference for the scrollable container
  const [timeInterval, setTimeInterval] = useState(null);  // Interval reference for timer
  const [typingFocus, setTypingFocus] = useState(false); // Track focus on typing area
  const [startTime, setStartTime] = useState(null); // To track when typing starts
  const [elapsedTime, setElapsedTime] = useState(0); // To track the time spent typing



  let selectedWords = [];

  // Shuffle Array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Get Words based on the selected language and difficulty
  const getWords = () => {
    if (language === "english-200") {
      selectedWords = easyWords;
    } else if (language === "english-300") {
      selectedWords = expertWords;
    } else if (language === "english-500") {
      selectedWords = masterWords;
    }

    selectedWords = shuffleArray(selectedWords);
    while (selectedWords.length < 1000) {
      selectedWords = selectedWords.concat(shuffleArray([...selectedWords]));
    }
    if (testStyle === "time") {
      setWords(selectedWords);
    } else if (testStyle === "words") {
      setWords(selectedWords.slice(0, testValue));
    }
  };

  // Restart the test
  const handleRestart = () => {
    clearInterval(timeInterval);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setCurrentInput("");
    setWordCount(0);
    setCorrectWords(0); // Reset correct words count
    setMistakes(0); // Reset mistakes count
    setCharStatus(words.map(() => []));
    setTestCompleted(false);
    setTimeLeft(testValue);
    setIsTestRunning(false);
    setIsTimerStarted(false);
    containerRef.current.scrollIntoView({ behavior: "smooth" });
    containerRef.current.focus();
    // shuffling the words again
    getWords();
    document.location.hash = "#typing-area";
    // remove focus from the button
    document.activeElement.blur();
  };

  // Initialize the test when settings change
  useEffect(() => {
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setCurrentInput("");
    setWordCount(0); // Reset word count when test settings change
    setCorrectWords(0); // Reset correct words count when settings change
    getWords();
    setCharStatus(selectedWords.map(() => []));
    setTestCompleted(false); // Reset the completion state when test settings change
    setTimeLeft(testValue);  // Reset timeLeft when the test starts
  }, [testStyle, testValue, difficulty, language]);

  // Stop the timer and mark the test as completed when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0) {
      const finalWPM = calculateWPM();
      const finalAccuracy = calculateAccuracy();
      setWpmArray((prevArray) => [...prevArray, finalWPM]);
      setAccuracyArray((prevArray) => [...prevArray, finalAccuracy]);
      console.log("WPM Array", wpmArray);
      console.log("Accuracy Array", accuracyArray);
      clearInterval(timeInterval);
      setTestCompleted(true);
    }
  }, [timeLeft, testCompleted]);

  // Handle Timer Start and countdown
  useEffect(() => {
    if (isTimerStarted && testStyle === "time" && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      setTimeInterval(interval); // Store interval reference to clear later
      return () => clearInterval(interval); // Clean up interval on unmount
    }
  }, [isTimerStarted, testStyle, timeLeft]);

  // Calculate WPM based on correct word completion for both time and word tests
  const calculateWPM = () => {
    let wpm = 0;
    if (testStyle === "time") {
      const timeInMinutes = (testValue - timeLeft) / 60;
      wpm = timeInMinutes > 0 ? Math.round(correctWords / timeInMinutes) : 0;
    } else if (testStyle === "words") {
      const timeInMinutes = elapsedTime / 60;
      wpm = timeInMinutes > 0 ? Math.round(correctWords / timeInMinutes) : 0;
    }
    setLiveWPM(wpm);
    return wpm;
  };


  // Calculate accuracy based on correct words vs total words
  const calculateAccuracy = () => {
    const accuracy = wordCount > 0 ? Math.round((correctWords / wordCount) * 100) : 0;
    setLiveAccuracy(accuracy);
    return accuracy;
  };

  // Store WPM and accuracy every word and final WPM on test completion
  useEffect(() => {
    if (wordCount > 0) {
      const wpm = calculateWPM();
      const accuracy = calculateAccuracy();
      setWpmArray((prevArray) => [...prevArray, wpm]); // Store WPM in array
      setAccuracyArray((prevArray) => [...prevArray, accuracy]); // Store accuracy in array
    }
  }, [wordCount, correctWords]);


  // Handle user input changes
  const handleKeyPress = (e) => {
    // Prevent the test from starting if the test has already been completed
    if (testCompleted) {
      return;
    }

    const key = e.key;
    // regex if key is not a letter or a number 


    if (!isTimerStarted && /^[a-zA-Z0-9 ]$/.test(key)) {
      setIsTimerStarted(true); // Start the timer when the user starts typing
    }

    // Don't start the test unless a valid key is pressed (e.g., space bar)
    if (!isTestRunning && key === " ") {
      setIsTestRunning(true); // Mark the test as running
      setStartTime(Date.now());
    }
    if (startTime) {
      // Calculate elapsed time as the difference between the current time and the start time
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); // Time in seconds
    }

    // Track mistakes for incorrect characters
    const currentWord = words[currentWordIndex];

    if (key === " ") {
      // if the user presses space again and again
      if (currentInput.trim() === "") {
        return;
      }

      const isCorrect = currentInput.trim() === currentWord;
      if (!isCorrect) {
        setMistakes((prevMistakes) => prevMistakes + 1); // Count this as a mistake for the whole word
      } else {
        setCorrectWords((prevCorrectWords) => prevCorrectWords + 1); // Count as a correct word
      }

      setCharStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[currentWordIndex] = currentInput.split("").map((char, index) => ({
          char,
          isCorrect: char === currentWord[index],
        }));
        return newStatus;
      });

      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      setCurrentCharIndex(0);
      setCurrentInput("");
      setWordCount((prevCount) => prevCount + 1); // Increment word count

      if (containerRef.current) {
        const currentWordElement = document.getElementById(`word-${currentWordIndex + 1}`);
        if (currentWordElement) {
          currentWordElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }

      // Check if test is complete (for word-based test)
      if (testStyle === "words" && wordCount + 1 === testValue) {
        setTestCompleted(true);
      }
    } else if (key === "Backspace") {
      setCurrentInput((prev) => prev.slice(0, -1));
      setCurrentCharIndex((prevIndex) => Math.max(prevIndex - 1, 0));

      if (words[currentWordIndex]) {
        const updatedCharStatus = [...charStatus];
        const currentWordStatus = updatedCharStatus[currentWordIndex] || [];
        currentWordStatus.pop();
        updatedCharStatus[currentWordIndex] = currentWordStatus;
        setCharStatus(updatedCharStatus);
      }
    } else if (key.length === 1) {
      setCurrentInput((prev) => prev + key);
      setCurrentCharIndex((prevIndex) => prevIndex + 1);

      if (words[currentWordIndex]) {
        const currentWord = words[currentWordIndex];
        const updatedCharStatus = [...charStatus];
        const currentWordStatus = updatedCharStatus[currentWordIndex] || [];
        currentWordStatus[currentCharIndex] = {
          char: key,
          isCorrect: currentWord[currentCharIndex] === key,
        };
        updatedCharStatus[currentWordIndex] = currentWordStatus;
        setCharStatus(updatedCharStatus);
      }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus(); // Focus on the typing area div
      setTypingFocus(true);
    }
  }, []);

  return (
    <>
      <div className="text-center text-xl font-bold mt-2 w-auto inline-block mx-auto flex items-center justify-center">
        <div className="group">
          <span className="text-gray-200"><FontAwesomeIcon icon={faLanguage} /> {language === "english-200" ? "english - easy" : language === "english-300" ? "english - medium" : "english - hard"}</span>
          <span className="hidden group-hover:block text-sm text-gray-500 absolute ">selected language</span>
        </div>
      </div>
      <div
        className="max-w-6xl mx-auto"
        onKeyDown={handleKeyPress}
        role="application" // Make the div focusable
        tabIndex={0} // Make the container focusable
        style={{ outline: "none" }}
        ref={containerRef}
      >
        <TestWordTimer
          testStyle={testStyle}
          testValue={testValue}
          isTestRunning={isTestRunning}
          wordCount={wordCount}
          timeLeft={timeLeft}
          testCompleted={testCompleted}
        />
        <div

          className="font-mono mb-4 lg:text-2xl text-xl text-justify overflow-hidden h-[8rem]"
          style={{ lineHeight: "2.5rem", letterSpacing: "0.1rem", userSelect: "none", outline: "none" }}
        >
          {words.map((word, wordIndex) => (
            <span
              key={wordIndex}
              id={`word-${wordIndex}`}
              className={`${wordIndex === currentWordIndex
                ? "px-1 rounded"
                : wordIndex < currentWordIndex
                  ? "text-gray-500"
                  : ""
                }`}
            >
              {word.split("").map((char, charIndex) => {
                const isCursor = wordIndex === currentWordIndex && charIndex === currentCharIndex;
                const isCorrect =
                  charStatus[wordIndex] &&
                  charStatus[wordIndex][charIndex] &&
                  charStatus[wordIndex][charIndex].isCorrect;
                const isIncorrect =
                  charStatus[wordIndex] &&
                  charStatus[wordIndex][charIndex] &&
                  !charStatus[wordIndex][charIndex].isCorrect;

                return (
                  <span
                    key={charIndex}
                    className={`${isCursor
                      ? (typingFocus ? "border-l-2 border-gray-500 text-[#6b7280] animate-borderblink" : "border-l-2 border-gray-500 text-[#6b7280]")
                      : isCorrect
                        ? "text-white"
                        : isIncorrect
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                  >
                    {char}
                  </span>
                );
              })}{" "}
            </span>
          ))}
        </div>
        <div className="z-1 flex h-20 items-center justify-between">
          <div>
            {(isTestRunning && typingFocus) ? "" : "Click on the typing area on the screen to start the test!"}
          </div>
          <div className="flex">
            <button
              onClick={handleRestart}
              className="font-bold py-2 px-4 rounded"
            >
              <FontAwesomeIcon icon={faRotateRight} className="mr-2 text-xl" style={{ outline: "none" }} />
            </button>
          </div>
        </div>
        <TestScore
          testStyle={testStyle}
          testValue={testValue}
          isTestRunning={isTestRunning}
          wordCount={wordCount}
          timeLeft={timeLeft}
          testCompleted={testCompleted}
          testMistakes={mistakes}
          liveAccuracy={calculateAccuracy()}
          liveWPM={calculateWPM()}
        />
      </div>
    </>
  );
}

export default TypingArea;
