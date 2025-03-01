export function Info(bestLabelId, levelLabelId) {
  this.bestLabel = document.getElementById(bestLabelId);
  this.levelLabel = document.getElementById(levelLabelId);

  this.setBestLevel = function (best, level) {
    this.bestLabel.innerHTML = best;
    this.levelLabel.innerHTML = level;
  };
}
