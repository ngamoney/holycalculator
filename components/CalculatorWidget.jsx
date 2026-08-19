"use client";

import { useState } from "react";

export default function CalculatorWidget() {
  const [isDeg, setIsDeg] = useState(true);
  const [display, setDisplay] = useState("");
  const [parts, setParts] = useState([]);
  const [lastAnswer, setLastAnswer] = useState(0);
  const [memory, setMemory] = useState(0);

  const deg2rad = (x) => (x * Math.PI) / 180;
  const rad2deg = (x) => (x * 180) / Math.PI;

  const getTrig = (degMode) => ({
    sin: (x) => Math.sin(degMode ? deg2rad(x) : x),
    cos: (x) => Math.cos(degMode ? deg2rad(x) : x),
    tan: (x) => Math.tan(degMode ? deg2rad(x) : x),
    asin: (x) => (degMode ? rad2deg(Math.asin(x)) : Math.asin(x)),
    acos: (x) => (degMode ? rad2deg(Math.acos(x)) : Math.acos(x)),
    atan: (x) => (degMode ? rad2deg(Math.atan(x)) : Math.atan(x)),
  });

  const factorial = (n) => {
    n = Math.round(n);
    if (n < 0) return NaN;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  };

  const handleKey = (key) => {
    if (key === "C") {
      setDisplay("");
      setParts([]);
      return;
    }
    if (key === "back") {
      setDisplay((prev) => prev.slice(0, -1));
      setParts((prev) => prev.slice(0, -1));
      return;
    }
    if (key === "=") {
      try {
        const jsExpr = parts.join("");
        const trig = getTrig(isDeg);
        const fn = new Function(
          "trig",
          "factorial",
          "PI",
          "E",
          "return (" + jsExpr + ")"
        );
        const result = fn(trig, factorial, Math.PI, Math.E);
        if (typeof result === "number" && isFinite(result)) {
          const rounded = Number(result.toFixed(8));
          setLastAnswer(rounded);
          setDisplay(rounded.toString());
          setParts([rounded.toString()]);
        }
      } catch (err) {
        /* invalid expression, ignore */
      }
      return;
    }
    let dispVal = key;
    let codeVal = key;
    if (key === "/") {
      dispVal = "÷";
      codeVal = "/";
    } else if (key === "*") {
      dispVal = "×";
      codeVal = "*";
    } else if (key === "-") {
      dispVal = "−";
      codeVal = "-";
    } else if (key === "%") {
      dispVal = "%";
      codeVal = "/100";
    }
    setDisplay((prev) => prev + dispVal);
    setParts((prev) => [...prev, codeVal]);
  };

  const handleFn = (fnName) => {
    const labels = {
      sin: "sin",
      cos: "cos",
      tan: "tan",
      asin: "sin⁻¹",
      acos: "cos⁻¹",
      atan: "tan⁻¹",
    };
    if (fnName === "pow") {
      setDisplay((prev) => prev + "^");
      setParts((prev) => [...prev, "**"]);
    } else if (fnName === "sqrt") {
      setDisplay((prev) => prev + "√(");
      setParts((prev) => [...prev, "Math.sqrt("]);
    } else if (fnName === "ln") {
      setDisplay((prev) => prev + "ln(");
      setParts((prev) => [...prev, "Math.log("]);
    } else if (fnName === "log") {
      setDisplay((prev) => prev + "log(");
      setParts((prev) => [...prev, "Math.log10("]);
    } else if (labels[fnName]) {
      setDisplay((prev) => prev + labels[fnName] + "(");
      setParts((prev) => [...prev, `trig.${fnName}(`]);
    }
  };

  const handleConst = (c) => {
    if (c === "pi") {
      setDisplay((prev) => prev + "π");
      setParts((prev) => [...prev, "PI"]);
    } else if (c === "e") {
      setDisplay((prev) => prev + "e");
      setParts((prev) => [...prev, "E"]);
    } else if (c === "ans") {
      setDisplay((prev) => prev + lastAnswer);
      setParts((prev) => [...prev, String(lastAnswer)]);
    } else if (c === "rnd") {
      const r = Number(Math.random().toFixed(4));
      setDisplay((prev) => prev + r);
      setParts((prev) => [...prev, String(r)]);
    }
  };

  const handlePost = (p) => {
    if (p === "sq") {
      setDisplay((prev) => prev + "²");
      setParts((prev) => [...prev, "**2"]);
    } else if (p === "cube") {
      setDisplay((prev) => prev + "³");
      setParts((prev) => [...prev, "**3"]);
    } else if (p === "inv") {
      setDisplay((prev) => "1/(" + prev + ")");
      setParts((prev) => ["1/(", ...prev, ")"]);
    } else if (p === "fact") {
      setDisplay((prev) => prev + "!");
      setParts((prev) => ["factorial(", ...prev, ")"]);
    } else if (p === "pm") {
      setDisplay((prev) => "-(" + prev + ")");
      setParts((prev) => ["-(", ...prev, ")"]);
    }
  };

  const handleMem = (m) => {
    if (m === "add") {
      setMemory((prev) => prev + lastAnswer);
    } else if (m === "sub") {
      setMemory((prev) => prev - lastAnswer);
    } else if (m === "recall") {
      setDisplay((prev) => prev + memory);
      setParts((prev) => [...prev, String(memory)]);
    }
  };

  return (
    <div className="calc-widget">
      <div className="calc-top">
        <div className="calc-mode">SCIENTIFIC</div>
        <div className="deg-toggle">
          <button
            type="button"
            className={isDeg ? "active" : ""}
            onClick={() => setIsDeg(true)}
          >
            DEG
          </button>
          <button
            type="button"
            className={!isDeg ? "active" : ""}
            onClick={() => setIsDeg(false)}
          >
            RAD
          </button>
        </div>
      </div>

      <div className="calc-display">
        <div className="calc-expr">{display || "\u00A0"}</div>
        <div className="calc-value">{display === "" ? "0" : display}</div>
      </div>

      <div className="calc-keys">
        {/* Row 1: Top Clear / Grouping */}
        <button type="button" onClick={() => handleKey("C")} className="mem" style={{ color: "#F87171" }}>
          AC
        </button>
        <button type="button" onClick={() => handleKey("back")} className="mem">
          ⌫
        </button>
        <button type="button" onClick={() => handleKey("(")} className="fn">
          (
        </button>
        <button type="button" onClick={() => handleKey(")")} className="fn">
          )
        </button>
        <button type="button" onClick={() => handleKey("%")} className="op">
          %
        </button>

        {/* Row 2: Trig & Division */}
        <button type="button" onClick={() => handleFn("sin")} className="fn">
          sin
        </button>
        <button type="button" onClick={() => handleFn("cos")} className="fn">
          cos
        </button>
        <button type="button" onClick={() => handleFn("tan")} className="fn">
          tan
        </button>
        <button type="button" onClick={() => handleConst("pi")} className="fn">
          π
        </button>
        <button type="button" onClick={() => handleKey("/")} className="op">
          ÷
        </button>

        {/* Row 3: Inverse Trig & Multiplication */}
        <button type="button" onClick={() => handleFn("asin")} className="fn">
          sin⁻¹
        </button>
        <button type="button" onClick={() => handleFn("acos")} className="fn">
          cos⁻¹
        </button>
        <button type="button" onClick={() => handleFn("atan")} className="fn">
          tan⁻¹
        </button>
        <button type="button" onClick={() => handleConst("e")} className="fn">
          e
        </button>
        <button type="button" onClick={() => handleKey("*")} className="op">
          ×
        </button>

        {/* Row 4: Logs, Roots, Powers & Subtraction */}
        <button type="button" onClick={() => handleFn("ln")} className="fn">
          ln
        </button>
        <button type="button" onClick={() => handleFn("log")} className="fn">
          log
        </button>
        <button type="button" onClick={() => handleFn("sqrt")} className="fn">
          √
        </button>
        <button type="button" onClick={() => handleFn("pow")} className="fn">
          xʸ
        </button>
        <button type="button" onClick={() => handleKey("-")} className="op">
          −
        </button>

        {/* Row 5: Powers, Fractions, Factorial & Addition */}
        <button type="button" onClick={() => handlePost("sq")} className="fn">
          x²
        </button>
        <button type="button" onClick={() => handlePost("cube")} className="fn">
          x³
        </button>
        <button type="button" onClick={() => handlePost("inv")} className="fn">
          1/x
        </button>
        <button type="button" onClick={() => handlePost("fact")} className="fn">
          n!
        </button>
        <button type="button" onClick={() => handleKey("+")} className="op">
          +
        </button>

        {/* Row 6: Numbers 7-9 & Memory */}
        <button type="button" onClick={() => handleKey("7")}>
          7
        </button>
        <button type="button" onClick={() => handleKey("8")}>
          8
        </button>
        <button type="button" onClick={() => handleKey("9")}>
          9
        </button>
        <button type="button" onClick={() => handleMem("add")} className="mem">
          M+
        </button>
        <button type="button" onClick={() => handleMem("recall")} className="mem">
          MR
        </button>

        {/* Row 7: Numbers 4-6 & Memory/Ans */}
        <button type="button" onClick={() => handleKey("4")}>
          4
        </button>
        <button type="button" onClick={() => handleKey("5")}>
          5
        </button>
        <button type="button" onClick={() => handleKey("6")}>
          6
        </button>
        <button type="button" onClick={() => handleMem("sub")} className="mem">
          M−
        </button>
        <button type="button" onClick={() => handleConst("ans")} className="mem">
          Ans
        </button>

        {/* Row 8: Numbers 1-3 & Signs/RND */}
        <button type="button" onClick={() => handleKey("1")}>
          1
        </button>
        <button type="button" onClick={() => handleKey("2")}>
          2
        </button>
        <button type="button" onClick={() => handleKey("3")}>
          3
        </button>
        <button type="button" onClick={() => handlePost("pm")} className="mem">
          ±
        </button>
        <button type="button" onClick={() => handleConst("rnd")} className="mem">
          RND
        </button>

        {/* Row 9: 0, Decimal & Equal Button */}
        <button type="button" onClick={() => handleKey("0")}>
          0
        </button>
        <button type="button" onClick={() => handleKey(".")}>
          .
        </button>
        <button
          type="button"
          onClick={() => handleKey("=")}
          className="eq"
          style={{ gridColumn: "span 3" }}
        >
          =
        </button>
      </div>

      <div className="calc-note">
        Complete scientific functions • Instant calculation
      </div>
    </div>
  );
}
