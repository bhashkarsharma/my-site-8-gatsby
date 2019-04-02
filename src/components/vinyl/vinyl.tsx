import React from 'react'
import styled from 'styled-components'
import { Logo } from '../logo'
import { Needle } from './needle'
import { Record } from './record'

interface VinylProps {
  file?: any
}

interface VinylState {
  playing: boolean
  trackName?: string
  trackDuration: number
  needleAngle: number
}

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

const FancyText = styled.div`
  color: var(--color-red);
  display: flex;
  font-size: 3vw;
  font-variant: small-caps;
  justify-content: space-between;
  user-select: none;
  width: 95%;
  z-index: 1;
`

const TrackInfo = styled.div`
  color: var(--color-yellow);
  font-size: 0.6em;
  padding-bottom: 1em;
  text-align: center;
`

export class Vinyl extends React.Component<VinylProps, VinylState> {
  private static readonly DISC_COUNT = 8
  private static readonly PLAY_INFO = 'Drop audio file to play'
  private static readonly NEEDLE_MAX_ANGLE = 55
  private audio: any

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
    this.audioLoaded = this.audioLoaded.bind(this)
  }

  componentDidMount() {
    this.audio = this.refs.audio
    this.audio.addEventListener('error', (e: any) => console.log('error', e))
  }

  handleDrag(e: any): void {
    e.stopPropagation()
    e.preventDefault()
  }

  handleDrop(e: any): void {
    e.preventDefault()
    const dataTransfer = e.dataTransfer
    if (dataTransfer.items) {
      console.log(dataTransfer.items)
      for (const file of dataTransfer.items) {
        this.playFile(file.getAsFile())
      }
    } else {
      for (const file of dataTransfer.files) {
        this.playFile(file)
      }
    }
  }

  private playFile(file: File): void {
    this.audio.src = URL.createObjectURL(file)
    this.setState({ trackName: file.name })
    this.play()
  }

  private play(): void {
    this.audio.addEventListener('loadedmetadata', () => {
      this.audio.play()
      this.setState({ playing: true, trackDuration: this.audio.duration })
    })
  }

  pause(): void {
    if (!this.state.trackDuration) return
    this.state.playing ? this.audio.pause() : this.audio.play()
    const playing = !this.state.playing
    this.setState({ playing })
  }

  audioLoaded(e: any): void {
    this.play()
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
          <audio ref="audio" onTimeUpdate={this.timeChange} onEnded={this.stop} onCanPlay={this.audioLoaded}>
            Your browser does not support the audio element.
          </audio>
          <RecordBox
            className={this.state.playing ? 'playing' : ''}
            onDragOver={this.handleDrag}
            onDrop={this.handleDrop}
            onClick={this.pause}
          >
            {Array.from(Array(Vinyl.DISC_COUNT), (_, i) => (
              <Record className="texture" discCount={Vinyl.DISC_COUNT} key={i} />
            ))}
            <LogoContainer>
              <Logo size={50} />
            </LogoContainer>
            <FancyText>
              <div>Bhashkar</div>
              <div>Sharma</div>
            </FancyText>
          </RecordBox>
          <Needle angle={this.state.needleAngle} />
        </VinylBox>
        <TrackInfo>{this.state.trackName}</TrackInfo>
      </div>
    )
  }
}
