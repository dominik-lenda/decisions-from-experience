
// Show an element
let showAndHide = function (clicked, elem) {
  const outcomesA = [...Array(50)].fill(0).concat([...Array(50).fill(4)])
  const outcomesB = [...Array(100)].fill(3)

  let randomA = outcomesA[Math.floor(Math.random() * outcomesA.length)];
  let randomB = outcomesB[Math.floor(Math.random() * outcomesB.length)];

  elem == document.getElementById('outcome_r') ?
    elem.innerHTML = randomA :
    elem.innerHTML = randomB
  console.log(clicked.style.pointerEvents = 'none')
  clicked.style.pointerEvents = 'none'
  elem.style.display = 'block';
  function hide() {
  clicked.style.pointerEvents = ''
  return elem.style.display = 'none'
    }
  setTimeout(hide, 1000)
};

