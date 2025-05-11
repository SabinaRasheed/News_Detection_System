import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const SUSPICIOUS_WORD_EXPLANATIONS = {
  "shocking": "Overly dramatic language used to provoke emotions.",
  "exposed": "Suggests hidden or secretive information is being revealed, often sensationalized.",
  "secret": "Used to create intrigue and imply exclusivity.",
  "truth": "Often misused to mislead the reader.",
  "you won’t believe": "Clickbait phrase meant to trigger curiosity.",
  "disaster": "Exaggerates events to induce panic.",
  "busted": "Sensational term implying wrongdoing.",
  "revealed": "Frequently used in misleading headlines.",
  "scandal": "Used to spark controversy.",
  "viral": "Implies content is widely shared regardless of authenticity.",
  "conspiracy": "Implies intentional suppression of information.",
  "explosive": "Used to describe content with exaggerated shock value.",
  "mind-blowing": "Exaggerates the significance of the content to attract attention.",
  "unbelievable": "Used to make information seem extraordinary and sensational.",
  "exclusive": "Implied rarity to make information seem more valuable or intriguing.",
  "shocking footage": "Used to sensationalize ordinary events with a dramatic label.",
  "revealing": "Intended to suggest something hidden is being uncovered.",
  "debunked": "Often used to give the impression that something has been conclusively proven false, when it may not be.",
  "bombshell": "A term meant to imply major revelations with high drama.",
  "uncovered": "Implying something has been intentionally hidden, even if it hasn't.",
  "untold": "Implies the story hasn't been shared, creating a sense of mystery.",
  "controversial": "Used to make something appear more important or contentious than it really is.",
  "game-changing": "Exaggerates the impact of a piece of news or information.",
  "unmasked": "Implying that someone or something is finally revealed after hiding, often with a dramatic effect.",
  "shockingly": "Adjective meant to emphasize the supposed outrageousness of an event or detail.",
  "hoax": "Intended to undermine credibility, often used without proper evidence.",
  "exclusive footage": "Creates the illusion of rare, unseen material, which may not be the case."
};


const ResultPanel = ({ result, loading }) => {
  if (!result && !loading) return null;

  const {
    text = '',
    label,
    confidence = 0,
    word_count = 0,
    suspicious_words = [],
    explanation = ''
  } = result || {};

  const isReal = label === "Real";
  const confidencePercent = Math.round(confidence * 100);

  const highlightSuspiciousWords = (text) => {
    let updated = text;
    suspicious_words.forEach((word) => {
      const explanation = SUSPICIOUS_WORD_EXPLANATIONS[word.toLowerCase()] || "Commonly used in misleading or fake content.";
      const tooltipMarkup = `<mark class='bg-rose-200 font-semibold px-1 rounded cursor-help' data-tooltip-id='main-tooltip' data-tooltip-content='${explanation}'>${word}</mark>`;
      const re = new RegExp(`\\b${word}\\b`, "gi");
      updated = updated.replace(re, tooltipMarkup);
    });
    return updated;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="relative p-6 bg-white rounded-lg shadow space-y-4 min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10 rounded-lg">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-amber-500 h-10 w-10 animate-spin"></div>
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-800">Extracted Text</h3>
        <p
          className="text-sm text-gray-700 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: highlightSuspiciousWords(text) }}
        />
        <Tooltip id="main-tooltip" effect="solid" place="top" />
        <p className="text-sm text-gray-500">Word Count: {word_count}</p>
      </div>

      {!loading && (
        <motion.div
          className="p-6 bg-white rounded-lg shadow space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-lg font-bold text-gray-800">Prediction</h3>
          <motion.div
            className={`text-lg font-semibold ${isReal ? "text-amber-600" : "text-rose-600"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {isReal ? "✅ Real" : "❌ Fake"}
          </motion.div>

          <motion.div
            className="w-24 h-24 mx-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <CircularProgressbar
              value={confidencePercent}
              text={`${confidencePercent}%`}
              styles={buildStyles({
                pathColor: isReal ? "#d97706" : "#e11d48",
                textColor: isReal ? "#d97706" : "#e11d48",
                trailColor: "#f3f4f6",
              })}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="font-medium text-gray-700">Suspicious Words:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {suspicious_words.length > 0 ? (
                suspicious_words.map((word, i) => (
                  <span
                    key={i}
                    data-tooltip-id="main-tooltip"
                    data-tooltip-content={
                      SUSPICIOUS_WORD_EXPLANATIONS[word.toLowerCase()] ||
                      "Commonly used in misleading or fake content."
                    }
                    className="bg-yellow-200 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded cursor-help"
                  >
                    {word}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-700">None detected</p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="font-medium text-gray-700 mb-1">Explanation:</p>
            <Typewriter
              words={[explanation]}
              loop={1}
              cursor
              cursorStyle="|"
              typeSpeed={40}
              deleteSpeed={30}
              delaySpeed={1000}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ResultPanel;
