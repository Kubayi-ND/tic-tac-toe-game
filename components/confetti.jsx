import confetti from "canvas-confetti";

// Function to trigger confetti when a player wins
export const triggerWinnerConfetti = async (winner) => {
  try {
    // Different colors for X and O players
    const colors = winner === 'X' 
      ? ['#ff6b6b', '#8dff33', '#33ffe0', '#e6ff33','#4ecdc4', '#da33ff', '#e6ff33','#ffd104'] // Red theme for X
      : ['#ff6b6b', '#8dff33', '#33ffe0', '#e6ff33','#4ecdc4', '#da33ff', '#e6ff33','#ffd104']; // Teal theme for O
    
    // Create multiple bursts of confetti for a more exciting effect
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 70,
          startVelocity: 30,
          gravity: 1.2,
          ticks: 400,
          origin: { 
            x: 0.2 + Math.random() * 0.6, // Random position between 0.2 and 0.8
            y: 0.2 + Math.random() * 0.4  // Random position between 0.2 and 0.6
          },
          colors: colors,
          shapes: ['square', 'circle'],
          scalar: 1
        });
      }, i * 300); // Stagger the confetti bursts
    }
  } catch (error) {
    console.error("Winner confetti error:", error);
  }
};
