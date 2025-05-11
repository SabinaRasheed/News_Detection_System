import { useState } from "react";
import InputForm from "./components/InputForm";
import ResultPanel from "./components/ResultPanel";
import Credits from "./components/Credits";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    if (data.type === "loading") {
      setLoading(true);
      setResult(null);
    } else {
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <>
      <div className="bg-rose-500 fixed top-0 left-0 w-full p-4 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center">
            🔍 NewsDetector
          </h1>
        </div>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-100 py-10 px-4">
        <div className="p-6 max-w-5xl mx-auto space-y-10">
          <InputForm onSubmit={handleSubmit} loading={loading} />
          <ResultPanel result={result} loading={loading} />
          <Credits />
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default App;
