import { Header } from '@components/header'
import { Direction, Food, Snake, Wall } from '@components/lab'
import { LabTemplate } from '@templates/lab'
import { BrickAnimationGallery, BrickGame, Point, UserEvent, Util } from '@util/index'
import React from 'react'

interface SnakeGameProps {}

interface SnakeGameState {
  started: boolean
  paused: boolean
  snake?: Snake
  foods: Food[]
  wall: Wall[]
  score: number
  speed: number
  lives: number
}

export default class SnakeGame extends React.Component<SnakeGameProps, SnakeGameState> {
  private static readonly DEFAULT_LIVES = 3
  private static readonly DEFAULT_SPEED = 250
  private static readonly FASTEST_SPEED = 10
  private static readonly SPEED_STEP = 10
  private static readonly SCORE_STEP = 20
  private static readonly DEFAULT_RES = 25
  private static readonly MAX_SIZE = 30
  private static readonly MIN_SIZE = 10
  private static readonly KILL_ANIMATION_DELAY = 60
  private lastEvent: Point | null
  private brickSize = 25
  private rows = 0
  private cols = 0
  private timeout = 0
  private canvas: any
  private brickGame: BrickGame | null

  constructor(props: SnakeGameProps) {
    super(props)
    this.lastEvent = null
    this.brickGame = null
    this.canvas = this.refs.canvas
    this.state = {
      started: false,
      paused: false,
      score: 0,
      speed: SnakeGame.DEFAULT_SPEED,
      lives: SnakeGame.DEFAULT_LIVES,
      snake: undefined,
      foods: [],
      wall: []
    }
    this.handleResize = this.handleResize.bind(this)
    this.handleTouch = this.handleTouch.bind(this)
    this.handleKey = this.handleKey.bind(this)
    this.start = this.start.bind(this)
    this.onKill = this.onKill.bind(this)
    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.end = this.end.bind(this)
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    document.addEventListener('keydown', this.handleKey)
    this.start(true)
  }

  componentWillUnmount() {
    this.clearTimer()
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('keydown', this.handleKey)
  }

  start(reset: boolean): void {
    const snake = this.createSnake()
    const foods = [this.createFood(snake)]
    let state = {
      started: true,
      paused: false,
      snake,
      foods
    }
    if (reset) {
      state = { ...state, ...{ score: 0, speed: SnakeGame.DEFAULT_SPEED, lives: SnakeGame.DEFAULT_LIVES } }
    }
    this.setState(state, () => this.draw())
  }

  pause(): void {
    this.setState({ paused: true }, () => this.clearTimer())
  }

  play(): void {
    this.setState({ paused: false }, () => this.draw())
  }

  end(): void {
    this.setState({ started: false, paused: false })
    this.drawKillAnimation(() => this.drawEndAnimation())
  }

  private clearTimer(): void {
    clearTimeout(this.timeout)
    this.timeout = 0
  }

  private draw(): void {
    const bg = this.brickGame
    const { snake, foods } = this.state
    if (this.timeout) this.clearTimer()

    if (bg && snake && foods.length) {
      bg.clearScreen(this.rows, this.cols)
      snake.draw(bg)
      snake.move()

      const eaten: number[] = []

      foods.forEach((f: Food, ix: number) => {
        f.draw(bg)
        if (SnakeGame.checkCollision(snake, f)) {
          this.onEat()
          snake.grow()
          eaten.push(ix)
        }
      })

      eaten.forEach((ix: number) => {
        foods.splice(ix)
        foods.push(this.createFood(snake))
      })

      this.setState({ foods })
    }

    const { started, paused } = this.state

    if (started && !paused) {
      this.timeout = setTimeout(() => this.draw(), this.state.speed)
    } else {
      this.clearTimer()
    }
  }

  private static checkCollision(snake: Snake, item: Food & Wall): boolean {
    const markers: any = {}
    snake.points.forEach((point: Point) => {
      const dpx = markers[point.x] || {}
      dpx[point.y] = true
      markers[point.x] = dpx
    })
    for (const point of item.points) {
      const dpx = markers[point.x] || {}
      if (dpx[point.y]) {
        return true
      }
    }
    return false
  }

  private onEat(): void {
    const { score, speed } = this.state
    let newSpeed = speed
    if (speed > SnakeGame.FASTEST_SPEED && score > 0 && score % SnakeGame.SCORE_STEP === 0) {
      newSpeed = speed - SnakeGame.SPEED_STEP
    }
    this.setState({ score: score + Food.SCORE, speed: newSpeed })
  }

  private onKill(): void {
    const lives = this.state.lives
    if (lives > 1) {
      this.setState({ paused: true, lives: lives - 1 })
      this.drawKillAnimation(this.start)
    } else {
      this.end()
    }
  }

  private drawKillAnimation(callback: Function): void {
    if (this.brickGame) {
      this.brickGame.drawAnimation(
        BrickAnimationGallery.wipeScreen(this.rows, this.cols, SnakeGame.KILL_ANIMATION_DELAY),
        callback,
        true,
        this.cols,
        this.rows
      )
    }
  }

  private drawEndAnimation(callback?: Function): void {
    if (this.brickGame) {
      this.brickGame.clearScreen(this.rows, this.cols)
      this.brickGame.drawString('score', 2, 2)
      this.brickGame.drawString(this.state.score.toString(), 5, 10)
    }
  }

  private createSnake(): Snake {
    return new Snake(
      { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) },
      this.rows,
      this.cols,
      this.onKill,
      Direction.LEFT
    )
  }

  private createFood(snake: Snake): Food {
    let food = new Food({ x: Util.getRand(this.cols), y: Util.getRand(this.rows) })
    while (SnakeGame.checkCollision(snake, food)) {
      food = new Food({ x: Util.getRand(this.cols), y: Util.getRand(this.rows) })
    }
    return food
  }

  handleResize(): void {
    this.canvas = this.refs.canvas
    const width = this.canvas.parentElement.clientWidth
    const height = window.innerHeight
    const size = Math.floor(Math.min(width, height) / SnakeGame.DEFAULT_RES)
    this.brickSize = Math.max(Math.min(size, SnakeGame.MAX_SIZE), SnakeGame.MIN_SIZE)
    this.rows = Math.floor(height / this.brickSize)
    this.cols = Math.floor(width / this.brickSize)

    this.canvas.width = this.cols * this.brickSize
    this.canvas.height = this.rows * this.brickSize
    this.canvas.scrollIntoView()

    this.brickGame = new BrickGame(this.canvas.getContext('2d'), this.brickSize)
  }

  handleTouch(e: any): void {
    const { point, event } = Util.normalizeMouseTouchEvents(e)

    if (event === UserEvent.START) {
      this.lastEvent = point
    } else {
      const mouseDown = this.lastEvent || { x: 0, y: 0 }
      const swipe = Util.getSwipe(mouseDown, point)

      if (swipe.x) {
        this.handleDirection(swipe.x > 0 ? Direction.RIGHT : Direction.LEFT)
      } else if (swipe.y) {
        this.handleDirection(swipe.y < 0 ? Direction.UP : Direction.DOWN)
      } else {
        this.state.started ? (this.state.paused ? this.play() : this.pause()) : this.start(true)
      }

      this.lastEvent = null
    }
  }

  handleKey(e: any): void {
    const keyMap = new Map<string, Direction>()
    keyMap.set('ArrowUp', Direction.UP)
    keyMap.set('ArrowDown', Direction.DOWN)
    keyMap.set('ArrowLeft', Direction.LEFT)
    keyMap.set('ArrowRight', Direction.RIGHT)
    const direction = keyMap.get(e.key)
    if (direction) {
      e.preventDefault()
      this.handleDirection(direction)
    }
  }

  handleDirection(direction: Direction): void {
    this.state.snake ? this.state.snake.move(direction) : ''
  }

  render() {
    return (
      <LabTemplate>
        <Header headerText="Snake" logoSize={25} />
        <div className="center-xs">
          <canvas
            ref="canvas"
            onMouseDown={this.handleTouch}
            onMouseUp={this.handleTouch}
            onTouchStart={this.handleTouch}
            onTouchEnd={this.handleTouch}
          />
        </div>
      </LabTemplate>
    )
  }
}
