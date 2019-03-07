import React from 'react'
import styled from 'styled-components'
import { Logo } from './logo'

interface VinylProps {}

interface VinylState {
  playing: boolean
  trackName?: string
  trackDuration: number
  needleAngle: number
}

interface NeedleProps {
  angle: number
}

const discCount = 8

const VinylBox = styled.div`
  align-items: center;
  background: var(--color-black);
  display: flex;
  justify-content: center;
  padding: 2em;
  text-align: center;
`

const LogoContainer = styled.div`
  position: absolute;
  z-index: 1;
`

const RecordBox = styled.div`
  align-items: center;
  border-radius: 50%;
  display: flex;
  height: 50vw;
  justify-content: center;
  position: relative;
  text-align: center;
  width: 50vw;

  &.playing {
    animation: rotation 5s infinite linear;
  }
`

const RecordBaseStyles = `
  align-items: center;
  border: 1px solid black;
  border-radius: 50%;
  box-shadow: 0px 0px 1px var(--color-white), inset 0 0 0 100px rgba(0, 0, 0, .4);
  display: flex;
  justify-content: center;
  position: absolute;

  &.texture {
    background: linear-gradient(30deg, transparent 40%, rgba(42, 41, 40, .85) 40%) no-repeat 100% 0,
      linear-gradient(60deg, rgba(42, 41, 40, .85) 60%, transparent 60%) no-repeat 0 100%,
      repeating-radial-gradient(#2a2928, #2a2928 4px, #ada9a0 5px, #2a2928 6px);
    background-size: 50% 100%, 100% 50%, 100% 100%;
  }

  &:nth-child(1):after {
    background: var(--color-black);
    border: solid 1px #d9a388;
    border-radius: 50%;
    box-shadow: 0 0 0 35px var(--color-red), inset 0 0 0 35px var(--color-red);
    content: '';
    position: absolute;
    z-index: 1;
  }
`

const FancyText = styled.div`
  color: var(--color-red);
  display: flex;
  font-size: 3vw;
  font-variant: small-caps;
  justify-content: space-between;
  width: 95%;
  z-index: 1;
`

const Track = styled.div`
  color: var(--color-yellow);
  font-size: 0.6em;
  padding-bottom: 1em;
  text-align: center;
`

const Needle = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  transform-origin: 50% 34%;
  z-index: 1;
  transform: ${(props: NeedleProps) => `rotateZ(${props.angle}deg)`};
  transition-duration: 0.5s;

  .head {
    background: var(--color-white);
    clip-path: polygon(0 0, 100% 0%, 80% 100%, 20% 100%);
    height: 5vw;
    transform: translateX(-110%) translateY(-26%) rotateZ(20deg);
    width: 3vw;
  }

  .stick {
    background: var(--color-blue);
    height: 8vw;
    text-align: center;
    width: 1vw;

    &:nth-child(2) {
      height: 5vw;
    }

    &:nth-last-child(2) {
      transform: translateX(-140%) translateY(-6%) rotateZ(20deg);
    }
  }

  .axis {
    background: var(--color-white);
    border-radius: 50%;
    height: 3vw;
    width: 3vw;
  }

  .tail {
    background: var(--color-white);
    height: 5vw;
    width: 3vw;
  }
`

function generateRecordStyles(count: number): string {
  let styles: string[] = [
    `&:nth-child(1):after {
    height: ${100 / count}%;
    width: ${100 / count}%;
  }`
  ]
  Array.from(Array(discCount), (_, i) => {
    const size = ((count - i) * 100) / count
    styles.push(`&:nth-child(${i + 1}) {
      height: ${size}%;
      width: ${size}%;
    }`)
  })
  return styles.join('\n')
}

const Record = styled.div`
  ${RecordBaseStyles}${generateRecordStyles(discCount)}
`

export class Vinyl extends React.Component<VinylProps, VinylState> {
  private static readonly PLAY_INFO = 'Drop audio file to play'
  private static readonly NEEDLE_MAX_ANGLE = 55
  audio: any

  constructor(props: VinylProps) {
    super(props)
    this.audio = this.refs.audio
    this.state = {
      playing: false,
      trackName: Vinyl.PLAY_INFO,
      trackDuration: 0,
      needleAngle: 0
    }
    this.handleDrag = this.handleDrag.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.pause = this.pause.bind(this)
    this.timeChange = this.timeChange.bind(this)
    this.stop = this.stop.bind(this)
  }

  componentDidMount() {
    this.audio = this.refs.audio
  }

  handleDrag(e: any): void {
    e.stopPropagation()
    e.preventDefault()
  }

  handleDrop(e: any): void {
    e.preventDefault()
    const dataTransfer = e.dataTransfer
    if (dataTransfer.items) {
      for (const file of dataTransfer.items) {
        this.play(file.getAsFile())
      }
    } else {
      for (const file of dataTransfer.files) {
        this.play(file)
      }
    }
  }

  private play(file: File): void {
    this.audio.src = URL.createObjectURL(file)
    this.audio.addEventListener('loadedmetadata', () => {
      this.audio.play()
      this.setState({ playing: true, trackName: file.name, trackDuration: this.audio.duration })
    })
  }

  pause(): void {
    if (!this.state.trackDuration) return
    this.state.playing ? this.audio.pause() : this.audio.play()
    const playing = !this.state.playing
    this.setState({ playing })
  }

  timeChange(e: any): void {
    const curr = e.timeStamp / 10
    const percentage = Math.floor(curr / this.state.trackDuration)
    const needleAngle = 5 + (percentage * Vinyl.NEEDLE_MAX_ANGLE) / 100
    this.setState({ needleAngle })
  }

  stop(): void {
    this.setState({ playing: false, trackName: Vinyl.PLAY_INFO, needleAngle: 0 })
  }

  render() {
    return (
      <div>
        <VinylBox>
          <audio ref="audio" onTimeUpdate={this.timeChange} onEnded={this.stop} />
          <RecordBox
            className={this.state.playing ? 'playing' : ''}
            onDragOver={this.handleDrag}
            onDrop={this.handleDrop}
            onClick={this.pause}
          >
            {Array.from(Array(discCount), (_, i) => (
              <Record className="texture" key={i} />
            ))}
            <LogoContainer>
              <Logo size={50} />
            </LogoContainer>
            <FancyText>
              <div>Bhashkar</div>
              <div>Sharma</div>
            </FancyText>
          </RecordBox>
          <Needle angle={this.state.needleAngle}>
            <div className="tail" />
            <div className="stick" />
            <div className="axis" />
            <div className="stick" />
            <div className="stick" />
            <div className="head" />
          </Needle>
        </VinylBox>
        <Track>{this.state.trackName}</Track>
      </div>
    )
  }
}
