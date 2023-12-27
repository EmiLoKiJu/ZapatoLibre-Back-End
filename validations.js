function thisString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function thisNumber(value) {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
}

function thisIntWith0(value) {
  return typeof value === 'number' && !isNaN(value) && Number.isInteger(value) && value >= 0;
}

function thisInt(value) {
  return thisIntWith0(value) && value > 0;
}

module.exports = {
  thisString,
  thisNumber,
  thisIntWith0,
  thisInt,
};
