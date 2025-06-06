// import { Mic, StopCircle } from "lucide-react";
// import React, { useState, useRef, useEffect } from "react";

// const SpeechToTextButton = ({ onTranscript }) => {
//     const [isListening, setIsListening] = useState(false);
//     const recognitionRef = useRef(null);

//     useEffect(() => {
//         if ('webkitSpeechRecognition' in window) {
//             const SpeechRecognition = window.webkitSpeechRecognition;
//             recognitionRef.current = new SpeechRecognition();
//             recognitionRef.current.continuous = false;
//             recognitionRef.current.interimResults = false;
//             recognitionRef.current.lang = 'en-US';

//             recognitionRef.current.onresult = (event) => {
//                 const transcript = event?.results[0][0]?.transcript;
//                 onTranscript(transcript);
//             };

//             recognitionRef.current.onerror = (event) => {
//                 console.error("Speech recognition error", event?.error);
//                 setIsListening(false);
//             };

//             recognitionRef.current.onend = () => {
//                 setIsListening(false);
//             };
//         }
//     }, [onTranscript]);

//     const handleSpeechToText = () => {
//         if (isListening) {
//             recognitionRef.current.stop();
//             setIsListening(false);
//         } else {
//             recognitionRef.current.start();
//             setIsListening(true);
//         }
//     };

//     return (
//         <div className="w-100 flex flex-h-end">
//             <div>
//                 <button onClick={handleSpeechToText} className="speech-btn">
//                     {isListening ? <div className="flex"> <span className="m-r-10">Stop Listening</span> <div className="text-red"><StopCircle /></div></div> : <div className="flex"> <span className="m-r-10">Start Speaking</span> <div ><Mic /></div></div>}
//                 </button>
//             </div>

//         </div>

//     );
// };

// export default SpeechToTextButton;


import { Mic, StopCircle } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const SpeechToTextButton = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const Recognition = window.webkitSpeechRecognition;
    const recognition = new Recognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event?.results[0][0]?.transcript;
      onTranscript(transcript);
      console.log(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event?.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscript]);

  const handleSpeechToText = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

    setIsListening(!isListening);
  };

  return (
    <div className="w-100 flex flex-h-end">
            <div>
                <button onClick={handleSpeechToText} className="speech-btn">
                    {isListening ? <div className="flex"> <span className="m-r-10">Stop Listening</span> <div className="text-red"><StopCircle /></div></div> : <div className="flex"> <span className="m-r-10">Start Speaking</span> <div ><Mic /></div></div>}
                </button>
            </div>

        </div>
  );
};

export default SpeechToTextButton;
