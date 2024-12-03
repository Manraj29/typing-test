import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { useState } from "react";
import styles from "../assets/css/TypingTest.module.css";
import TypingOptions from "./TypingOptions";
import TypingArea from "./TypingArea";
import DisplayResults from "./DisplayResults";
import Footer from "./Footer";


function TypingTest() {

    function getTestSettings() {
        const testSettings = localStorage.getItem('testSettings');
        return testSettings ? JSON.parse(testSettings) : {
            testStyle: 'time',
            testValue: 15,
            difficulty: 'easy',
            language: 'english-200',
        };

    }

    const initialSettings = getTestSettings();
    const [settings, setSettings] = useState(initialSettings);

    const [testStyle, setTestStyle] = useState(settings.testStyle);
    const [testValue, setTestValue] = useState(settings.testValue);
    const [difficulty, setDifficulty] = useState(settings.difficulty);
    const [language, setLanguage] = useState(settings.language);
    const [testCompleted, setTestCompleted] = useState(false);
    const [liveWPM, setLiveWPM] = useState(0);
    const [liveAccuracy, setLiveAccuracy] = useState(0);
    // array for storing a test all wpm
    const [wpmArray, setWpmArray] = useState([]);
    // array for storing a test all accuracy
    const [accuracyArray, setAccuracyArray] = useState([]);

    const saveSettingsToLocalStorage = (updatedSettings) => {
        localStorage.setItem('testSettings', JSON.stringify(updatedSettings));
    };

    // Update localStorage whenever settings change
    useEffect(() => {
        saveSettingsToLocalStorage(settings);
    }, [settings]);

    // Function to handle changes in settings
    const handleSettingChange = (key, value) => {
        const updatedSettings = { ...settings, [key]: value };
        setSettings(updatedSettings);
    };

    const [wordCount, setWordCount] = useState(0); // Track the number of words typed

    const [isTestRunning, setIsTestRunning] = useState(false); // Track if the test has started


    // Timer state for time-based test
    const [timeLeft, setTimeLeft] = useState(testValue);  // For time-based tests

    const [mistakes, setMistakes] = useState(0); // Track the number of mistakes

    // if it is the first test, 
    return (
        <>
            <div className="mx-auto max-w-6xl px-4 sm:px-4 lg:py-6">

                <Navbar
                    selectedDifficulty={settings.difficulty}
                    setSelectedDifficulty={(value) => handleSettingChange('difficulty', value)}
                    selectedLang={settings.language}
                    setSelectedLang={(value) => handleSettingChange('language', value)}
                    testStyle={settings.testStyle}
                    testValue={settings.testValue}
                    testCompleted={testCompleted}
                    totalMistakes={mistakes}
                    liveWPM={liveWPM}
                    liveAccuracy={liveAccuracy}
                />

                {testCompleted ? (
                    <div>
                        <DisplayResults
                            testStyle={settings.testStyle}
                            testValue={settings.testValue}
                            difficulty={settings.difficulty}
                            language={settings.language}
                            testCompleted={testCompleted}
                            isTestRunning={isTestRunning}
                            wordCount={wordCount}
                            timeLeft={timeLeft}
                            totalMistakes={mistakes}
                            liveWPM={liveWPM}
                            liveAccuracy={liveAccuracy}
                            wpmArray={wpmArray}
                            accuracyArray={accuracyArray}
                        />
                    </div>
                ) : (
                    <div>
                        <TypingOptions
                            selectedOption={settings.testStyle}
                            setSelectedOption={(value) => handleSettingChange('testStyle', value)}
                            selectedValue={settings.testValue}
                            setSelectedValue={(value) => handleSettingChange('testValue', value)}
                            difficulty={settings.difficulty}
                            language={settings.language}
                        />
                        <TypingArea
                            testStyle={settings.testStyle}
                            testValue={settings.testValue}
                            difficulty={settings.difficulty}
                            language={settings.language}
                            testCompleted={testCompleted}
                            setTestCompleted={setTestCompleted}
                            wordCount={wordCount}
                            setWordCount={setWordCount}
                            timeLeft={timeLeft}
                            setTimeLeft={setTimeLeft}
                            mistakes={mistakes}
                            setMistakes={setMistakes}
                            isTestRunning={isTestRunning}
                            setIsTestRunning={setIsTestRunning}
                            liveWPM={liveWPM}
                            liveAccuracy={liveAccuracy}
                            setLiveWPM={setLiveWPM}
                            setLiveAccuracy={setLiveAccuracy}
                            wpmArray={wpmArray}
                            setWpmArray={setWpmArray}
                            accuracyArray={accuracyArray}
                            setAccuracyArray={setAccuracyArray}
                        />
                    </div>
                )}


            </div>
            {/* fix footer to bottom */}
            <br />
            <div className="fixed bottom-0 w-full">
                <Footer />
            </div>
        </>
    );
}

export default TypingTest;