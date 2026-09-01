const generatePropertyId = ({ society, block, plotNumber }) => {
  const societyCode =
    society === "Gulberg Residencia"
      ? "GR"
      : society === "Gulberg Greens"
        ? "GG"
        : "GP";

  const blockCode = block
    ? block.toUpperCase()
    : "NA";

  const plotCode = plotNumber
    ? String(plotNumber).replace(/\D/g, "").padStart(5, "0")
    : Date.now().toString().slice(-5);

  return `${societyCode}-${blockCode}-${plotCode}`;
};

export default generatePropertyId;