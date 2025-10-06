//global variables
const board = document.getElementById("board")
let cells
const hits = document.querySelector("#hitsScore")
const misses = document.querySelector("#missesScore")
const totalShots = document.querySelector("#totalShotsScore")
const restartBtn = document.querySelector(".restart")
let total = 0
const gridSize = 10
const totalCells = gridSize * gridSize
const occupied = []
let totalEnemies = 0
let currentHits = 0

//make the board
for (let row = 0; row < gridSize; row++) {
  for (let col = 0; col < gridSize; col++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cell.dataset.row = row
    cell.dataset.col = col
    board.appendChild(cell)
  }
}
cells = document.querySelectorAll(".cell")

//enemies used (the ships but not really)
const enemyImages = [
  {
    name: "rudinn",
    url: "https://static.wikia.nocookie.net/deltarune/images/b/ba/Enemy_battle_idle.gif",
    size: 5,
  },
  { name: "head-hathy", url: "https://i.redd.it/ryi2iexz8i9f1.gif", size: 3 },
  {
    name: "jigsawry",
    url: "https://static.wikia.nocookie.net/deltarune/images/e/e3/Jigsawry_battle_idle.gif",
    size: 4,
  },
  {
    name: "c.round",
    url: "https://static.wikia.nocookie.net/deltarune/images/a/ad/C._Round_battle_idle.gif",
    size: 2,
  },
  {
    name: "lancer",
    url: "https://static.wikia.nocookie.net/deltarune/images/8/88/Lancer_battle_bike.gif",
    size: 1,
  },
]

//winning friends gifs
const winFriends = [
  {
    name: "kris",
    url: "https://media.tenor.com/EZoelqBNmvMAAAAj/kris-deltarune.gif",
  },
  {
    name: "susie",
    url: "https://media.tenor.com/HUchjwxC10EAAAAM/susie-dance.gif",
  },
  {
    name: "ralsei",
    url: "https://media.tenor.com/mdd8OkBaBZ8AAAAM/dance-ralsei.gif",
  },
]
//original friends
const oriFriends = [
  {
    url: "https://i.redd.it/aixfg4crubs71.gif",
    alt: "kris",
  },
  {
    url: "https://media.tenor.com/4m75eCG1dM8AAAAj/susie-deltarune.gif",
    alt: "susie",
  },
  {
    url: "https://i.redd.it/1k9yt75c24p71.gif",
    alt: "ralsei",
  },
]
//original king
const originalKing = {
  url: "https://i.redd.it/c0hgr1hgknu91.gif",
  alt: "king",
}
//explosion sound
const exploSound = new Audio("sounds/explosion.mp3")
exploSound.volume = 0.6

//trying to do an effect when HIT
const explosion =
  "https://www.spriters-resource.com/media/asset_icons/159/162192.gif"

const toIndex = (row, col) => {
  return row * gridSize + col
}
//winner sound
const winSound = new Audio("sounds/you_win.mp3")
winSound.volume = 0.6

//winner function
const winState = () => {
  const friendImgs = document.querySelectorAll(".ourFriends img")
  const kingLoses = document.querySelector(".kingSide img")
  winFriends.forEach((friend, i) => {
    if (friendImgs[i]) {
      friendImgs[i].src = friend.url
      friendImgs[i].alt = friend.name
    }
  })
  kingLoses.src =
    "https://static.wikia.nocookie.net/deltarune/images/f/f3/King_battle_weakened.png"

  //win msg
  const winMessage = document.createElement("p")
  winMessage.textContent = "You did it! You saved us!"
  winMessage.style.fontFamily = "'Press Start 2P', system-ui"
  winMessage.style.color = "aliceblue"
  winMessage.style.fontSize = "30px"
  winMessage.style.lineHeight = "30px"
  winMessage.style.alignContent = "center"
  winMessage.style.textAlign = "center"
  winMessage.style.padding = "6px"
  winMessage.style.textShadow =
    "-1px -1px 0 rgb(84, 182, 248), 1px -1px 0 rgb(84, 182, 248), -1px 1px 0 rgb(84, 182, 248), 1px 1px 0 rgb(84, 182, 248)"
  winMessage.style.gridArea = "2/ 1/ 3/ 3"
  winMessage.style.border = "2px solid rgb(63, 56, 192)"
  winMessage.style.backgroundColor = "black"

  document.body.appendChild(winMessage)

  winSound.currentTime = 0
  winSound.play()
}

//placing enemies on the board
const placeEnemy = (enemy) => {
  let placed = false

  while (!placed) {
    const ori = Math.random() < 0.5 ? "H" : "V"
    let maxRow
    let maxCol
    if (ori === "H") {
      maxRow = gridSize
      maxCol = gridSize - enemy.size
    } else {
      maxRow = gridSize - enemy.size
      maxCol = gridSize
    }

    const row = Math.floor(Math.random() * maxRow)
    const col = Math.floor(Math.random() * maxCol)

    const indi = []

    //check collision
    let canPlace = true
    for (let i = 0; i < enemy.size; i++) {
      let r = row
      let c = col
      if (ori === "H") {
        c += i
      } else {
        r += i
      }

      const index = toIndex(r, c)

      //check if occupied
      if (
        index >= cells.length ||
        cells[index].classList.contains("occupied")
      ) {
        canPlace = false
        break
      }
      indi.push(index)
    }
    //place
    if (canPlace) {
      indi.forEach((index) => {
        //place img
        const img = document.createElement("img")
        img.src = enemy.url
        img.style.width = "30px"
        img.style.height = "30px"
        img.style.objectFit = "cover"
        img.style.display = "none"
        img.alt = enemy.name

        cells[index].classList.add("occupied")
        cells[index].appendChild(img)
      })
      placed = true
    }
  }
}

//placing
enemyImages.forEach((enemy) => {
  placeEnemy(enemy)
  totalEnemies += enemy.size
})

//cell clicker
cells.forEach((cell, i) => {
  cell.addEventListener("click", () => {
    if (cell.classList.contains("clicked")) {
      return
    }

    //total shots counter
    total += 1
    totalShots.textContent = total

    cell.classList.add("clicked")

    //if hit
    if (cell.classList.contains("occupied")) {
      cell.classList.add("hit")
      hits.textContent = parseInt(hits.textContent) + 1
      currentHits += 1

      //check if all enemies are hit
      if (currentHits === totalEnemies) {
        winState()
      }
      //show enemy
      const img = cell.querySelector("img")
      if (img) {
        img.style.display = "block"
      }

      //trying explosion here
      const explode = document.createElement("img")
      explode.src = explosion
      explode.style.position = "absolute"
      explode.style.top = "0"
      explode.style.left = "0"
      explode.style.width = "30px"
      explode.style.height = "30px"
      explode.style.pointerEvents = "none"
      explode.style.alignContent = "center"

      //play the sound
      exploSound.currentTime = 0
      exploSound.play()
      //clear after explosion
      cell.appendChild(explode)

      //remove explosion
      setTimeout(() => {
        explode.remove()
      }, 2000)
    } else {
      //if miss
      misses.textContent = parseInt(misses.textContent) + 1
      cell.textContent = "X"
    }
  })
})

//reset button
restartBtn.addEventListener("click", () => {
  //reset the variables
  total = 0
  currentHits = 0
  totalEnemies = 0
  hits.textContent = 0
  misses.textContent = 0
  totalShots.textContent = 0

  //clearing the board
  cells.forEach((cell) => {
    cell.classList.remove("occupied", "clicked", "hit")
    cell.textContent = "" //removes "X"
    cell.innerHTML = ""
  })

  //put the enemies again
  enemyImages.forEach((enemy) => {
    placeEnemy(enemy)
    totalEnemies += enemy.size
  })

  //hide winner msg
  const winMsg = document.querySelector("p")
  if (winMsg) {
    winMsg.remove()
  }

  //return our friends stance to idle
  const friendsImgs = document.querySelectorAll(".ourFriends img")
  friendsImgs.forEach((img, i) => {
    if (oriFriends[i]) {
      img.src = oriFriends[i].url
      img.alt = oriFriends[i].alt
    }
  })

  const kingImg = document.querySelector(".kingSide img")
  if (kingImg) {
    kingImg.src = originalKing.url
    kingImg.alt = originalKing.alt
  }
})
