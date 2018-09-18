function createUI() {
  let resetBtn = createButton('Clear points')
  resetBtn.mousePressed(() => {
    points = []
    calculateClusters()

    for (let k of ks) {
      k.points = []
    }
  })

  let randomizeClusters = () => {
    for (let k of ks) {
      k.x = random(-1, 1)
      k.y = random(-1, 1)
    }
  }

  let randomizeClustersBtn = createButton('Randomize Clusters')
  randomizeClustersBtn.mousePressed(() => {
    randomizeClusters()
  })

  let finishKs = createButton('Calculate Clusters')
  finishKs.mousePressed(() => {
    finishClusters()
  })

  let bestKs = createButton('Calculate best Ks over 100 tries')
  bestKs.mousePressed(() => {
    let bestScore = Infinity
    let bestClusterPositions = []

    for (let i = 0; i < 100; i++) {
      randomizeClusters()

      finishClusters()

      let score = totalScore()

      if (score < bestScore) {
        console.log('Found new best score at #' + i + ' score ' + bestScore)
        bestScore = score
        bestClusterPositions = []
        for (let k of ks) {
          bestClusterPositions.push({
            x: k.x,
            y: k.y,
          })
        }
      }
    }

    if (bestClusterPositions.length === 0) {
      return
    }

    for (let i = 0; i < ks.length; i++) {
      ks[i].x = bestClusterPositions[i].x
      ks[i].y = bestClusterPositions[i].y
    }
    calculateClusters()
  })

  createElement('br')

  createP('Add point between -1 and 1')
  createSpan('x:')
  let addX = createInput()
  createSpan(' y:')
  let addY = createInput()
  let addPoint = createButton('Add point')

  addPoint.mousePressed(() => {
    let x = Number(addX.value())
    let y = Number(addY.value())

    points.push(new Point(x, y))
    calculateClusters()
    addX.value('')
    addY.value('')
  })
}
