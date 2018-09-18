let points
// Clusters
let ks

// Amount of clusters
const K_AMOUNT = 4

let scoreLabel

function setup() {
  createCanvas(512, 512)

  points = []
  ks = []

  for (let i = 0; i < 30; i++) {
    points.push(Point.createRandom())
  }

  for (let i = 0; i < K_AMOUNT; i++) {
    ks.push(K.createRandom())
  }

  createP(
    'Click with the mouse to add points<br/>' +
      'Press any button to calculate one step'
  )

  scoreLabel = createP('Score: 0')

  // Initial calculation
  calculateClusters()

  // From the 'ui.js' file
  createUI()
}

function draw() {
  background(60)

  for (let k of ks) {
    fill(k.color)
    noStroke()

    for (let p of k.points) {
      stroke(80)
      line(k.toScreenX(), k.toScreenY(), p.toScreenX(), p.toScreenY())
    }

    for (let p of k.points) {
      stroke(60)
      p.draw()
    }

    fill(k.color)
    stroke(255)

    k.draw()
  }
}

let haveCalculated = true

function keyPressed() {
  if (!haveCalculated) {
    console.log('Calculating clusters')
    calculateClusters()
    haveCalculated = true
  } else {
    console.log('Moving Ks')
    moveClusters()
    haveCalculated = false
  }
}

function mousePressed() {
  addPoint()
}

function mouseDragged() {
  addPoint()
}

/**
 * Add a point at the position of the mouse
 */
function addPoint() {
  let x = map(mouseX, 0, width, -1, 1)
  let y = map(mouseY, height, 0, -1, 1)

  if (x > 1 || x < -1 || y > 1 || y < -1) {
    return
  }

  points.push(new Point(x, y))
  calculateClusters()
}

/**
 * Calculate which cluster (Ks) each point closest to
 */
function calculateClusters() {
  for (let k of ks) {
    k.points = []
  }

  for (let p of points) {
    let closestK
    let closestDistance = Infinity

    for (let k of ks) {
      let distance = dist(p.x, p.y, k.x, k.y)

      if (distance < closestDistance) {
        closestDistance = distance
        closestK = k
      }
    }

    if (closestK) {
      closestK.points.push(p)
    }
  }

  let formattedScore = Math.round(totalScore() * 10000) / 10000

  scoreLabel.html('Score: ' + formattedScore)
}

/**
 * Move each cluster (Ks) to the middle of its points
 */
function moveClusters() {
  for (k of ks) {
    let totalX = 0
    let totalY = 0

    if (k.points.length == 0) {
      continue
    }

    for (p of k.points) {
      totalX += p.x
      totalY += p.y
    }

    let averageX = totalX / k.points.length
    let averageY = totalY / k.points.length

    k.x = averageX
    k.y = averageY
  }
}

/**
 * Calculate clusters until they don't move anymore
 */
function finishClusters() {
  let prevScore

  while (prevScore !== totalScore()) {
    prevScore = totalScore()
    calculateClusters()
    moveClusters()
  }
}

// The total score calculated as the average distance,
// between the clusters and the points
function totalScore() {
  let sum = 0
  for (let k of ks) {
    sum += k.score()
  }

  return sum / ks.length
}
