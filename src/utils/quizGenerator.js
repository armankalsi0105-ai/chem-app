export const generateQuizQuestions = (numQuestions, selectedLaws) => {
  const questions = [];

  // Helper to generate a random number within a range
  const randomRange = (min, max) => Number((Math.random() * (max - min) + min).toFixed(2));

  // Generate plausible wrong answers
  const generateOptions = (correctAnswer) => {
    const opts = new Set();
    opts.add(correctAnswer);

    while(opts.size < 4) {
      // Random mutations: +/- 10-30%, inverted, etc.
      const mutation = 1 + (Math.random() * 0.4 - 0.2); // 0.8x to 1.2x
      const wrong = Number((correctAnswer * mutation).toFixed(2));
      if (wrong !== correctAnswer && wrong > 0) opts.add(wrong);
    }
    return Array.from(opts).sort(() => Math.random() - 0.5);
  };

  for (let i = 0; i < numQuestions; i++) {
    // Pick a random law from the selected ones (fallback to Boyle if none selected somehow)
    const law = selectedLaws.length > 0
      ? selectedLaws[Math.floor(Math.random() * selectedLaws.length)]
      : "Boyle's Law";

    let questionText, correctAns, unit, explanation;

    if (law === "Boyle's Law") {
      const p1 = randomRange(1, 5);
      const v1 = randomRange(10, 50);
      const p2 = randomRange(1, 10);
      correctAns = Number(((p1 * v1) / p2).toFixed(2));
      unit = "L";
      questionText = `A gas occupies ${v1} L at a pressure of ${p1} atm. If the pressure is changed to ${p2} atm while temperature remains constant, what is the new volume?`;
      explanation = [
        "1. Identify Boyle's Law: P₁V₁ = P₂V₂",
        `2. Identify knowns: P₁=${p1}atm, V₁=${v1}L, P₂=${p2}atm`,
        `3. Rearrange for V₂: V₂ = (P₁V₁) / P₂`,
        `4. Substitute: V₂ = (${p1} * ${v1}) / ${p2}`,
        `5. Result: V₂ = ${correctAns} L`
      ];
    } else if (law === "Charles's Law") {
      const v1 = randomRange(10, 50);
      const t1 = randomRange(273, 373); // Kelvin
      const t2 = randomRange(273, 400); // Kelvin
      correctAns = Number(((v1 * t2) / t1).toFixed(2));
      unit = "L";
      questionText = `A gas has a volume of ${v1} L at ${t1} K. If the pressure is constant, what is the volume at ${t2} K?`;
      explanation = [
        "1. Identify Charles's Law: V₁/T₁ = V₂/T₂",
        `2. Identify knowns: V₁=${v1}L, T₁=${t1}K, T₂=${t2}K`,
        `3. Rearrange for V₂: V₂ = (V₁ * T₂) / T₁`,
        `4. Substitute: V₂ = (${v1} * ${t2}) / ${t1}`,
        `5. Result: V₂ = ${correctAns} L`
      ];
    } else if (law === "Ideal Gas Law") {
      const p = randomRange(1, 5);
      const v = randomRange(10, 50);
      const t = randomRange(273, 373);
      const r = 0.0821;
      correctAns = Number(((p * v) / (r * t)).toFixed(2));
      unit = "moles";
      questionText = `How many moles of gas are in a ${v} L container at ${p} atm and ${t} K? (Use R = 0.0821 L·atm/(mol·K))`;
      explanation = [
        "1. Identify Ideal Gas Law: PV = nRT",
        `2. Identify knowns: P=${p}atm, V=${v}L, T=${t}K, R=0.0821`,
        `3. Rearrange for n: n = (PV) / (RT)`,
        `4. Substitute: n = (${p} * ${v}) / (0.0821 * ${t})`,
        `5. Result: n = ${correctAns} moles`
      ];

    } else if (law === "Gay-Lussac's Law") {
      const p1 = randomRange(1, 5);
      const t1 = randomRange(273, 373);
      const t2 = randomRange(273, 400);
      correctAns = Number(((p1 * t2) / t1).toFixed(2));
      unit = "atm";
      questionText = `A gas has a pressure of ${p1} atm at ${t1} K. If the volume is constant, what is the pressure at ${t2} K?`;
      explanation = [
        "1. Identify Gay-Lussac's Law: P₁/T₁ = P₂/T₂",
        `2. Identify knowns: P₁=${p1}atm, T₁=${t1}K, T₂=${t2}K`,
        `3. Rearrange for P₂: P₂ = (P₁ * T₂) / T₁`,
        `4. Substitute: P₂ = (${p1} * ${t2}) / ${t1}`,
        `5. Result: P₂ = ${correctAns} atm`
      ];
    } else if (law === "Avogadro's Law") {
      const v1 = randomRange(10, 50);
      const n1 = randomRange(1, 5);
      const n2 = randomRange(2, 8);
      correctAns = Number(((v1 * n2) / n1).toFixed(2));
      unit = "L";
      questionText = `A ${v1} L sample of gas contains ${n1} moles. If the number of moles is increased to ${n2} at constant temperature and pressure, what is the new volume?`;
      explanation = [
        "1. Identify Avogadro's Law: V₁/n₁ = V₂/n₂",
        `2. Identify knowns: V₁=${v1}L, n₁=${n1}mol, n₂=${n2}mol`,
        `3. Rearrange for V₂: V₂ = (V₁ * n₂) / n₁`,
        `4. Substitute: V₂ = (${v1} * ${n2}) / ${n1}`,
        `5. Result: V₂ = ${correctAns} L`
      ];
    } else if (law === "Combined Gas Law") {
      const p1 = randomRange(1, 5);
      const v1 = randomRange(10, 50);
      const t1 = randomRange(273, 373);
      const p2 = randomRange(1, 10);
      const v2 = randomRange(10, 60);
      correctAns = Number(((p1 * v1 * t1) / (p2 * v2)).toFixed(2)); // Solving for T2 as an example
      unit = "K";
      questionText = `A gas occupies ${v1} L at ${p1} atm and ${t1} K. What is the temperature if the volume is changed to ${v2} L and pressure to ${p2} atm?`;
      explanation = [
        "1. Identify Combined Gas Law: (P₁V₁)/T₁ = (P₂V₂)/T₂",
        `2. Identify knowns: P₁=${p1}atm, V₁=${v1}L, T₁=${t1}K, P₂=${p2}atm, V₂=${v2}L`,
        `3. Rearrange for T₂: T₂ = (P₂ * V₂ * T₁) / (P₁ * V₁)`,
        `4. Substitute: T₂ = (${p2} * ${v2} * ${t1}) / (${p1} * ${v1})`,
        `5. Result: T₂ = ${correctAns} K`
      ];
    } else {

      // Fallback
      correctAns = 42;
      unit = "units";
      questionText = "Sample generated question due to unhandled law selection.";
      explanation = ["1. Unhandled law.", "2. Answer is 42."];
    }

    questions.push({
      id: i,
      law,
      questionText,
      options: generateOptions(correctAns),
      correctAnswer: correctAns,
      unit,
      explanation
    });
  }

  return questions;
};
