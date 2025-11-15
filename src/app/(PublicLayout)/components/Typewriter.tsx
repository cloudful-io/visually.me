"use client";
import React, { useState, useEffect } from "react";

const Typewriter: React.FC<{ messages: string[]; speed?: number; delay?: number }> = ({
  messages,
  speed = 80,          // typing speed
  delay = 2000,        // time before next message starts
}) => {
  const [text, setText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = messages[messageIndex];

    if (charIndex < current.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + current[charIndex]);
        setCharIndex(charIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      // Wait, then move to next message
      const timeout = setTimeout(() => {
        setText("");
        setCharIndex(0);
        setMessageIndex((i) => (i + 1) % messages.length);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, messageIndex, messages, speed, delay]);

  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {text}
      <span style={{ borderRight: "2px solid", marginLeft: 2 }} />
    </span>
  );
};

export default Typewriter;
