/**
 * Randomly select two wrong answers (ensuring they don't match the correct answer),
 * add the correct answer and then shuffle the options.
 */
function generateOptions(correctAnswer: string, categories: string[]): string[] {
  // Get all expressions except the correct one.
  const otherOptions = categories.filter(expr => expr !== correctAnswer);

  // Shuffle the otherOptions array (Fisher–Yates algorithm).
  for (let i = otherOptions.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [otherOptions[i], otherOptions[j]] = [otherOptions[j], otherOptions[i]];
  }
  
  // Take the first two as wrong answers.
  const chosenWrong = otherOptions.slice(0, 2);
  
  // Create the options array including the correct answer.
  const options = [...chosenWrong, correctAnswer];
  
  // Shuffle the final options array.
  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}

export default generateOptions;