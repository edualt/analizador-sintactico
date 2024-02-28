import { parserTable, terminalTokens } from "./gramatica.js";

function analyzeSyntax(inputList) {
    inputList.push("$");
    var stackHistory = "";
    var symbols = ["$", "S"];

    while (symbols.length > 0) {
        // sea X el simbolo de la cima de la pila
        var X = symbols[symbols.length - 1];
        // sea "a" el simbolo apuntado 
        var a = inputList[0];
        stackHistory += "Pila: [" + symbols + "]  -> " + a + "\n";

        if (isTerminal(X)) {
            if (X === a) {
                symbols.pop();
                inputList.shift();
            } else {
                return {
                    "success": false,
                    "stackHistory": stackHistory
                };
            }
        } else {
            try {
                if (parserTable[X][a] || (Array.isArray(parserTable[X][a]) && parserTable[X][a].length === 0)) {
                    symbols.pop();
                    symbols.push.apply(symbols, parserTable[X][a].slice().reverse());
                } else {
                    return {
                        "success": false,
                        "stackHistory": stackHistory
                    };
                }
            } catch (error) {
                return {
                    "success": false,
                    "stackHistory": stackHistory
                };
            }
        }
    }
    return { 
        "success": true,
        "stackHistory": stackHistory 
    };
}

function isTerminal(token) {
    return terminalTokens.has(token);
}

export { analyzeSyntax }