import React, { useRef } from "react";
import Confetti from "react-canvas-confetti";

const ConfettiComponent = ({ trigger }) => {
  const confettiRef = useRef(null);

  const makeShot = () => {
    confettiRef.current &&
      confettiRef.current({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
      });
  };

  // Trigger confetti when the `trigger` prop changes
  React.useEffect(() => {
    if (trigger) {
      makeShot();
    }
  }, [trigger]);

  return (
    <Confetti
      ref={(instance) => (confettiRef.current = instance)}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
    />
  );
};

export default ConfettiComponent;
