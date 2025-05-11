import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Credits() {
  const name = "Sabina Rasheed";
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let typingSpeed = isDeleting ? 50 : 120;

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setText(name.substring(0, text.length - 1));
      } else {
        setText(name.substring(0, text.length + 1));
      }

      if (!isDeleting && text === name) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting]);

  return (
    <motion.div
      className="text-center mt-10 text-sm sm:text-base px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="inline-block bg-white/30 backdrop-blur-md rounded-xl px-4 py-2 shadow-md text-neutral-700">
        Credits : {" "}
        <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent font-semibold">
          {text}
        </span>
        <span style={{ animation: 'blink 1s infinite' }}>|</span>
      </div>

      <style>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
}
