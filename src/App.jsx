import React, { useEffect, useState } from "react";
import { Editor, loader } from "@monaco-editor/react";
import "./index.css";
import { analyzeSyntax } from "./utils/index";

loader.init().then((monaco) => {
  monaco.languages.register({ id: "lando" });

  monaco.languages.setMonarchTokensProvider("lando", { tokenizer });

  monaco.languages.registerCompletionItemProvider("lando", landoCompletion);

  monaco.editor.defineTheme("myCoolTheme", landoTheme);
});

function App() {
  const [currentWord, setCurrentWord] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [history, setHistory] = useState("");

  const separar_elementos = (inputString) => {
    var elements = ["function", "(", ")", "boolean", "var", "string", ";", ":"];
    var outputList = [];
    var currentWord = "";

    for (var i = 0; i < inputString.length; i++) {
      var char = inputString[i];
      if (char === " ") {
        if (currentWord !== "") {
          if (elements.includes(currentWord)) {
            outputList.push(currentWord);
          } else {
            outputList.push(...currentWord.split(""));
          }
          currentWord = "";
        }
      } else if (elements.includes(char)) {
        if (currentWord !== "") {
          if (elements.includes(currentWord)) {
            outputList.push(currentWord);
          } else {
            outputList.push(...currentWord.split(""));
          }
          currentWord = "";
        }
        outputList.push(char);
      } else {
        currentWord += char;
      }
    }

    if (currentWord !== "") {
      if (elements.includes(currentWord)) {
        outputList.push(currentWord);
      } else {
        outputList.push(...currentWord.split(""));
      }
    }

    return outputList;
  };

  const handleClick = () => {
    var code = currentWord.replace(/\r/g, "");

    const inputList = separar_elementos(code);

    const response = analyzeSyntax(inputList);

    console.log(response.stackHistory);

    if (response.success) {
      setType("success");
      setHistory(response.stackHistory);
    } else {
      setType("error");
      setHistory(response.stackHistory);
    }
  };

  return (
    <div>
      <h1>Gramatica 12</h1>
      <p id={`${type}-text`}>{message}</p>
      <pre className="text-white">{history}</pre>

      <Editor
        height="70vh"
        theme="vs-dark"
        language="lando"
        onChange={(value) => setCurrentWord(value)}
        options={{
          fontSize: 20,
          minimap: {
            enabled: false,
          },
          scrollbar: {
            vertical: "hidden",
          },
        }}
      />
      <div className="right">
        <button onClick={() => handleClick()}>Verificar sintaxis</button>
      </div>
    </div>
  );
}

export default App;
