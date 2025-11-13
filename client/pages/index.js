import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AIChat = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("Ask for help...");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const res = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponse(formatResponse(data.response));
  };

  const formatResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
      .replace(/\* (.*?)\n/g, "<li>$1</li>"); // Convert * to list items
  };

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(response);
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported in this browser.");
    }
  };

  const handleStop = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) =>
      console.error("Speech Recognition Error:", event);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
    };

    recognition.start();
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage:
          "url('/img/back.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="card shadow-lg p-4 w-50">
        <h2 className="text-center text-success mb-4">Ask AI</h2>

        <form onSubmit={handleSubmit} className="mb-3">
          <div className="input-group mb-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your question..."
              className="form-control"
            />
            <button
              type="button"
              className={`btn ${isListening ? "btn-danger" : "btn-secondary"}`}
              onClick={startListening}
            >
              🎤
            </button>
          </div>
          <button type="submit" className="btn btn-success w-100">
            Ask AI
          </button>
        </form>

        <div className="mt-3">
          <h5 className="text-primary">AI Response:</h5>
          <div
            className="border p-3 bg-light rounded"
            dangerouslySetInnerHTML={{ __html: response }}
          ></div>
        </div>

        <button className="btn btn-primary mt-3 w-100" onClick={handleSpeak}>
          Speak
        </button>

        {isSpeaking && (
          <button className="btn btn-danger mt-2 w-100" onClick={handleStop}>
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default AIChat;
