// Changing colors on input type range track
document.querySelectorAll('input[type="range"]').forEach((input) => {
  const updateTrack = () => {
    const min = parseFloat(input.min) || 0;
    const max = parseFloat(input.max) || 100;
    const value = parseFloat(input.value);
    const ratio = Math.min(Math.max((value - min) / (max - min), 0), 1);
    const val = ratio * 100;

    input.style.backgroundImage = `linear-gradient(to right, #2575fc 0%, #0034cf ${val}%, #a0a0c0 ${val}%, #a0a0c0 100%)`;
  };
  input.addEventListener('input', updateTrack);
  updateTrack();
});
