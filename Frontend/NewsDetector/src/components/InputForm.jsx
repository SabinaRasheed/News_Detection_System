import { useState } from 'react';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const InputForm = ({ onSubmit, loading }) => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('text');

  const handleSubmit = async () => {
    if (!text && !url && !file) {
      toast.error('Please provide input before analyzing!', {
        position: 'top-center', 
        autoClose: 2000, 
      });
      return;
    }

    onSubmit({ type: 'loading' });
    const formData = new FormData();
    let payload;

    if (mode === 'text') {
      payload = await fetch('http://localhost:5000/predict-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
    } else if (mode === 'url') {
      payload = await fetch('http://localhost:5000/predict-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
    } else if (mode === 'file') {
      formData.append('file', file);
      payload = await fetch('http://localhost:5000/predict-file', {
        method: 'POST',
        body: formData,
      });
    }

    const data = await payload.json();
    setTimeout(() => onSubmit(data), 1000);
  };

  return (
    <div className="relative">
      <div className="bg-white border border-rose-200 mt-4 p-8 shadow-2xl rounded-xl mx-auto space-y-6 transition-all max-w-screen-lg">
        <h1 className="text-3xl font-bold text-center text-rose-700">NewsDetector</h1>
        <p className="text-center text-base text-rose-400 mt-1">Choose your input method below.</p>

        <div className="flex justify-center gap-4">
          {['text', 'url', 'file'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                mode === m
                  ? 'bg-rose-500 text-white shadow'
                  : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
              }`}
              disabled={loading}
            >
              {m === 'text' ? 'Paste Text' : m === 'url' ? 'Enter URL' : 'Upload File'}
            </button>
          ))}
        </div>

        {mode === 'text' && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            rows="6"
            placeholder="Paste news text here..."
            disabled={loading}
          />
        )}
        {mode === 'url' && (
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-4 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            placeholder="Enter article URL..."
            disabled={loading}
          />
        )}
        {mode === 'file' && (
          <div className="flex flex-col items-center w-full">
            <input
              type="file"
              accept=".txt,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full p-2 border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              disabled={loading}
            />
            <span className="mt-2 text-rose-500 text-sm">Only .txt or .docx files supported</span>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-2 rounded-full font-semibold shadow-md transition-all"
            disabled={loading}
          >
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
