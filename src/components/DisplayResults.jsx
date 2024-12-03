import * as React from 'react';
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import styles from '../assets/css/DisplayResults.module.css';
import { FontAwesomeIcon, } from '@fortawesome/react-fontawesome';
import { faForward } from "@fortawesome/free-solid-svg-icons";

function DisplayResults({
    testStyle,
    testValue,
    difficulty,
    language,
    isTestRunning,
    wordCount,
    timeLeft,
    testCompleted,
    totalMistakes,
    liveWPM,
    liveAccuracy,
    wpmArray,
    accuracyArray,
}) {

    // random data for testing
    // wpmArray = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180];
    // accuracyArray = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];

    let checkHighScore = false;
    const chartRef = useRef(null);

    const xAxisData = wpmArray.map((_, index) => index +1); // Start from 1, skipping index 0

    const yMax = Math.max(...[...wpmArray, ...accuracyArray]); // Add some padding to the max value for y-axis
    const xMax = Math.max(...xAxisData);

    if (testStyle === 'time') {
        wpmArray = wpmArray.slice(1);
        accuracyArray = accuracyArray.slice(1);
    }
    if (wpmArray[wpmArray.length - 1] === 0 || wpmArray.length < 2) {
        return (
            <div className="text-center mt-24">
                <p className="text-4xl text-gray-500">No data to display</p>
                <div className='text-center mt-10'>
                    {/* next test button */}
                    <button
                        className='text-white font-bold py-2 px-4 rounded' onClick={() => {
                            window.location.reload();
                        }
                        }
                    >
                        <div className="group">
                            <a href="#" className="text-blue-600 hover:text-blue-800"><FontAwesomeIcon icon={faForward} className='text-3xl' /></a>
                            <span className="hidden group-hover:block text-sm text-gray-200">next test</span>
                        </div>
                    </button>
                </div>
            </div>

        )
    }

    // Initialize the chart using useEffect to ensure it only runs once after the component mounts
    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        // Create chart instance
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xAxisData,
                datasets: [
                    {
                        label: 'WPM',
                        data: wpmArray,
                        fill: true,
                        borderColor: '#34D399', // Teal green
                        tension: 0.2,
                        borderWidth: 2,
                    },
                    {
                        label: 'Accuracy',
                        data: accuracyArray,
                        fill: false,
                        borderColor: '#F59E0B', // Amber color
                        tension: 0.2,
                        borderWidth: 1,
                    }
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 12,
                            }
                        }
                    },
                    tooltip: {
                        enabled: true, // Make sure tooltip is enabled
                        backgroundColor: '#4B5563',
                        titleColor: '#FFFFFF',
                        bodyColor: '#FFFFFF',
                        callbacks: {
                            // Customize tooltip if needed
                            label: function (tooltipItem) {
                                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                            }
                        },
                    },
                },
                interaction: {
                    mode: 'index', // Tooltip will display when hovering over the points
                    intersect: false, // Allow tooltip to show even when not directly on a point
                },
                scales: {
                    x: {
                        beginAtZero: false,
                        max: testStyle === 'words' ? xMax : xMax,
                        ticks: {
                            font: {
                                size: 14,
                            },
                            stepSize: 3, // Show all x-axis labels (no skipping)
                        },
                        title: {
                            display: true,
                            text: 'Index Number',
                            font: {
                                size: 10,
                            }
                        }
                    },
                    y: {
                        beginAtZero: false,
                        max: yMax > 70 ? yMax : 70,
                        ticks: {
                            font: {
                                size: 14,
                            },
                            stepSize: 30, // Show all y-axis labels (no skipping)
                        },
                        title: {
                            display: true,
                            text: 'WPM & Accuracy',
                            font: {
                                size: 10,
                            }
                        }


                    }
                },
                elements: {
                    line: {
                        borderCapStyle: 'round',
                        borderJoinStyle: 'round',
                    }
                }
            }
        });

        return () => {
            chart.destroy();
        };
    }, [wpmArray, accuracyArray, xAxisData, yMax]);

    const storeData = () => {

        if (wpmArray[wpmArray.length - 1] === 0 || wpmArray.length < 2){
            return;
        }
        let selLang = language === "english-200" ? "easy" : language === "english-300" ? "medium" : "hard";
        const key = `${testStyle}-${testValue}-${selLang}`;

        // Retrieve existing data from localStorage
        let storedData = JSON.parse(localStorage.getItem("testResults")) || {}; // Get stored results or empty object

        // Check if the current test data is better than the stored one
        const currentWPM = wpmArray[wpmArray.length - 1];
        const currentAccuracy = accuracyArray[accuracyArray.length - 1];

        // Only update if the current WPM is greater than the stored one (optional logic, you can modify this condition)
        if (storedData[key] && storedData[key].liveWPM > currentWPM) {
            return; // Don't update if existing data is better
        }

        // Add or update the dictionary entry with the new test data
        storedData[key] = {
            testStyle: testStyle,
            testValue: testValue,
            testCompleted: testCompleted,
            totalMistakes: totalMistakes,
            liveWPM: currentWPM,
            liveAccuracy: currentAccuracy,
            difficulty: difficulty,
            language: language,
            wpmArray: wpmArray,
            accuracyArray: accuracyArray,
            dateTime: new Date().toLocaleString(),
        };

        // Store the updated dictionary in localStorage
        localStorage.setItem("testResults", JSON.stringify(storedData));
        console.log("Data stored successfully!");
        checkHighScore = true;
        confetti({
            angle: 90,                     // Launch angle in degrees (default 90)
            colors: ['#ff0000', '#00ff00', '#0000ff', '#fffff'],  // An array of color strings to use for the confetti (default blue, white, red)
            decay: 1,                   // How quickly the confetti slows down (default 0.9)
            gravity: 1.2,                  // How strongly gravity pulls the confetti (default 1)
            origin: { x: 0.5, y: 0.5 },    // Where to start firing the confetti (default is center)
            particleCount: 420,            // Number of particles (default 50)
            scalar: 0.9,                   // Scale factor for particle size (default 1)
            shapes: ['star', 'circle', 'square'],    // Shapes to use for the confetti (default is square and circle)
            spread: 360,                    // Spread of confetti (default 45 degrees)
            startVelocity: 15,             // Initial speed of confetti (default 45)
            ticks: 100,                    // Duration of the confetti movement (default 200)
            zIndex: 999                  // Layering, ensures the confetti stays on top (default 100)
        });

    };
    // totalMistakes = 10;


    return (
        <>
            <div className="lg:mt-24 mt-6 columns-1 lg:columns-2 m-auto">
                {/* Column 1: Display live WPM and accuracy */}
                <div className="text-center mb-8 lg:mb-0 lg:mt-6">
                    {/* Display live WPM */}
                    <div className="lg:text-6xl text-3xl text-gray-500  justify-center items-center">
                        <span>{wpmArray[wpmArray.length - 1]}</span>
                        <span className="text-2xl text-gray-500 mx-2 mr-4">WPM</span>

                        {/* Display live accuracy */}
                        {/* <div className="text-5xl text-gray-500 justify-center items-center mt-6"> */}
                        <span>{accuracyArray[accuracyArray.length - 1]}</span>
                        <span className="text-2xl text-gray-500 ml-2">ACC</span>
                    </div>
                    {/* Mistakes Display Section */}
                    <div className="text-center mx-auto mt-5 lg:text-4xl text-xl text-gray-500">
                        <span>{totalMistakes === 0 ? "" : totalMistakes}</span>
                        <span className="lg:text-2xl text-xl text-gray-500 mx-2 mr-4">{totalMistakes === 0 ? "No Mistakes" : "mistakes"}</span>
                    </div>
                    <div className="text-center mx-auto mt-5 lg:text-4xl text-2xl text-gray-500">
                        <span>{testValue}</span>
                        <span className="lg:text-2xl text-xl text-gray-500 mx-2 mr-4">{testStyle == "time" ? "seconds" : "words"}</span>
                    </div>
                    <div className="text-center mx-auto mt-5 lg:text-2xl text-xl text-gray-500">
                        <span>{(language === "english-200") ? "English Easy" : (language === "english-300") ? "English Medium" : "English Hard"}</span>
                    </div>
                    <span className="text-gray-500">language</span>

                </div>

                {/* Column 2: Display LineChart */}
                <div className="column-2 text-center">
                    {/* Add LineChart for WPM (and Accuracy on the same chart) */}
                    <div className="text-5xl text-gray-500 flex justify-center items-center mt-16">
                        <canvas ref={chartRef} className={`${styles.graph}`}></canvas>
                    </div>
                </div>
            </div>

            {/* <p>{wordCount}</p> */}

            {storeData()}
            <div className="text-center mt-10">
            {checkHighScore && <p className="justify-center items-center text-5xl mt-6 text-green-500 animate-blink z-0">New High Score!</p>}

            </div>
            <div className='text-center mt-10'>
                {/* next test button */}
                <button
                    className='text-white font-bold py-2 px-4 rounded' onClick={() => {
                        window.location.reload();
                    }
                    }
                >
                    <div className="group">
                        <a href="#" className="text-blue-600 hover:text-blue-800"><FontAwesomeIcon icon={faForward} className='text-3xl' /></a>
                        <span className="hidden group-hover:block text-sm text-gray-200">next test</span>
                    </div>
                </button>
            </div>


        </>
    );
}

export default DisplayResults;
