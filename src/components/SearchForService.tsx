import React, { useState } from "react";
import "./SearchForService.css";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // defaults to process.env["OPENAI_API_KEY"]
});

interface Props {
  // other props...
  onSearch: (term: string) => void;
}

export const SearchForService = ({ onSearch }: Props): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const [secondInputValue, setSecondInputValue] = useState(""); // New state for the second input
  const [showPopup, setShowPopup] = useState(false); // New state for showing the popup
  const [completionMessage, setCompletionMessage] = useState(""); // New state for storing the completion message

  const fetchCompletion = async () => {
    if (secondInputValue) {
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            {role: "system", content: "You are an assistant for a bartering app. Your role is to help users craft polite and convincing proposals for trades. When given two inputs, the first being what the user wants (input1) and the second being what the user has to offer (input2), generate a friendly and persuasive message suggesting a trade to the other party. something like: 'hi i need input1, i have input2 to offer'."
            },
            { role: 'user', content: "input1: " + inputValue + "input2: " + secondInputValue },
          ],
          model: 'gpt-3.5-turbo',
        });
        setCompletionMessage(completion.choices[0].message.content || ""); // Store the completion message 
        setShowPopup(true); // Show the popup
        console.log(completion.choices[0].message.content)
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompletion();
  };
  const handleFiltering = (val: string) => {
    onSearch(val);
    setInputValue(val)
  };

  return (
    <div className={"search-for-service"}>
      <div className="input-container">
        <input 
          type="text" 
          className="text-wrapper" 
          placeholder="I want ..."
          value={inputValue}
          onChange={(e) => handleFiltering(e.target.value)}
        />
        <img
          className="vector"
          alt="Vector"
          src="https://generation-sessions.s3.amazonaws.com/1b66bd5cec3522c7f7a7221f76445de2/img/vector-16.svg"
        />
      </div>
      {inputValue && (
        <input 
          type="text" 
          className="text-wrapper" 
          placeholder="I have ..."
          value={secondInputValue}
          onChange={(e) => setSecondInputValue(e.target.value)}
        />
      )}
      <button className="submitbutton" type="submit" onClick={handleSubmit}>Message All</button>
      {showPopup && (
        <div className="popup">
          <div className="popup_inner">
            <h1>Copy and paste the following message to your friends:</h1>
            <p>{completionMessage}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};