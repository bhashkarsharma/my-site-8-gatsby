import React from 'react'
import styled from 'styled-components'
import { Header } from '~components'
import { BaseTemplate } from '~templates'
import { Util } from '~util'

interface Particle {
  x: number
  y: number
  dx: number
  dy: number
}

interface ParticlesProps {}

interface ParticlesParams {
  count: number
  speed: number
  size: number
  maxDist: number
}

interface ParticlesState extends ParticlesParams {
  particles: Particle[]
  mouseDown?: { x: number; y: number }
}

const ParticleBox = styled.div`
  margin: auto;

  canvas {
    border: 1px solid;
  }
`

export default class Particles extends React.Component<ParticlesProps, ParticlesState> {
  private static readonly COLOR = 'rgb(0,0,0)'
  private static readonly LIMITS: ParticlesParams = {
    count: 200,
    speed: 100,
    size: 100,
    maxDist: 1000
  }
  canvas: any
  runningAnim = 0

  constructor(props: ParticlesProps) {
    super(props)
    this.canvas = this.refs.canvas
    this.state = { particles: [], count: 50, speed: 1, size: 5, maxDist: 150 }
    this.handleResize = this.handleResize.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  private handleResize(): void {
    this.canvas = this.refs.canvas
    this.canvas.width = this.canvas.parentElement.clientWidth
    this.canvas.height = window.innerHeight
    this.canvas.scrollIntoView()
    this.generateParticles()
    this.runningAnim = requestAnimationFrame(() => this.draw())
  }

  private posOrNeg(): number {
    return Util.getRand(2) * 2 - 1
  }

  private generateParticles(): void {
    const particles = []
    const dist = this.state.size * 2
    for (let i = 0; i < this.state.count; i++) {
      particles.push({
        x: Util.getRand(dist, this.canvas.width - dist),
        y: Util.getRand(dist, this.canvas.height - dist),
        dx: this.posOrNeg() * Util.getRand(1, this.state.speed),
        dy: this.posOrNeg() * Util.getRand(1, this.state.speed)
      })
    }
    this.setState({ particles })
  }

  private drawParticle(ctx: CanvasRenderingContext2D, particle: Particle): void {
    ctx.fillStyle = Particles.COLOR
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, this.state.size, 0, Math.PI * 2)
    ctx.fill()
  }

  private moveParticle(particle: Particle): void {
    particle.x += particle.dx
    particle.y += particle.dy
    if (this.checkCollision(particle.x, this.canvas.width)) {
      particle.dx *= -1
    }
    if (this.checkCollision(particle.y, this.canvas.height)) {
      particle.dy *= -1
    }
  }

  private checkCollision(v1: number, v2: number): boolean {
    const { size } = this.state
    return v1 >= v2 - size / 2 || v1 - size / 2 <= 0
  }

  private distParticles(a: Particle, b: Particle): number {
    return Math.hypot(b.x - a.x, b.y - a.y)
  }

  private drawConnection(ctx: CanvasRenderingContext2D, thickness: number, a: Particle, b: Particle): void {
    ctx.strokeStyle = Particles.COLOR
    ctx.lineWidth = thickness
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()
  }

  private drawConnections(ctx: CanvasRenderingContext2D): void {
    const { maxDist, particles } = this.state
    for (let i = 0; i < particles.length - 1; i++) {
      const p1 = particles[i]
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        if (Math.abs(p2.x - p1.x) < maxDist && Math.abs(p2.y - p1.y) < maxDist) {
          const dist = this.distParticles(p1, p2)
          if (dist <= maxDist) {
            const width = (this.state.size * (1 - dist / maxDist)) / 2
            this.drawConnection(ctx, width, p1, p2)
          }
        }
      }
    }
  }

  private drawMarkers(ctx: CanvasRenderingContext2D) {
    ctx.font = '20px Arial'
    const borderDist = 40
    ctx.fillText('Count', this.canvas.width / 2, borderDist)
    ctx.fillText('Length', this.canvas.width / 2, this.canvas.height - borderDist)
    ctx.rotate(Math.PI / 2)
    ctx.fillText('Speed', this.canvas.height / 2, -borderDist)
    ctx.fillText('Size', this.canvas.height / 2, -this.canvas.width + borderDist)
    ctx.rotate(-Math.PI / 2)
  }

  private draw(): void {
    const { particles } = this.state
    if (this.runningAnim) cancelAnimationFrame(this.runningAnim)
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawMarkers(ctx)
    particles.forEach((p) => this.drawParticle(ctx, p))
    this.drawConnections(ctx)
    particles.forEach((p) => this.moveParticle(p))
    this.runningAnim = requestAnimationFrame(() => this.draw())
  }

  private handleDrag(e: any): void {
    e.persist()
    switch (e.type) {
      case 'mousedown':
        this.setState({ mouseDown: { x: e.clientX, y: e.clientY } })
        break
      case 'mouseup':
        const mouseDown = this.state.mouseDown || { x: 0, y: 0 }
        const { x: startX, y: startY } = mouseDown
        const endX = e.clientX
        const endY = e.clientY
        this.onDragComplete(startX, startY, endX, endY)
        this.setState({ mouseDown: undefined })
        break
    }
  }

  private onDragComplete(startX: number, startY: number, endX: number, endY: number): void {
    const can = this.canvas
    const dx = endX - startX
    const dy = endY - startY
    let percentage = 0
    if (Math.abs(dx) > Math.abs(dy)) {
      percentage = Math.abs(dx / can.width)
      if (startY < can.height / 2) {
        this.handleParamsChange({ ...this.state, ...{ count: Math.ceil(Particles.LIMITS.count * percentage) } })
      } else {
        this.handleParamsChange({ ...this.state, ...{ maxDist: Math.ceil(Particles.LIMITS.maxDist * percentage) } })
      }
    } else {
      percentage = Math.abs(dy / can.height)
      if (startX < can.width / 2) {
        this.handleParamsChange({ ...this.state, ...{ speed: Math.ceil(Particles.LIMITS.speed * percentage) } })
      } else {
        this.handleParamsChange({ ...this.state, ...{ size: Math.ceil(Particles.LIMITS.size * percentage) } })
      }
    }
  }

  private handleParamsChange(params: ParticlesParams): void {
    this.setState(params, () => this.handleResize())
  }

  render() {
    return (
      <BaseTemplate>
        <Header headerText="Particles" logoSize="25" />
        <ParticleBox>
          <canvas ref="canvas" onMouseDown={this.handleDrag} onMouseUp={this.handleDrag} />
        </ParticleBox>
        <div className="row center-xs">Drag around the edges to play. Longer drag equals a higher value.</div>
      </BaseTemplate>
    )
  }
}
