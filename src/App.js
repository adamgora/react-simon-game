import React, {Component} from 'react';
import './App.css';

import sound1 from './sounds/simonSound1.mp3';
import sound2 from './sounds/simonSound2.mp3';
import sound3 from './sounds/simonSound3.mp3';
import sound4 from './sounds/simonSound4.mp3';

class App extends Component {
    constructor() {
        super();
        this.state = {
            gameQueue: [],
            answers: [],
            level: 0,
            intervalID: null,
            currentQueueItem: 0,
            activeButton: null,
            sounds: {
                1: sound1,
                2: sound2,
                3: sound3,
                4: sound4
            },
            soundPlaying: null,
            power: 0,
            started: 0,
            locked: 1,
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.unsetInterval();
    }

    lockBoard() {
        this.setState({locked: 1});
    }

    unlockBoard() {
        this.setState({locked: 0});
    }

    resetAnswers() {
        this.setState({answers: []});
    }

    /**
     * Turn game on/off
     */
    toggleGamePower() {
        this.setState({
            power: !this.state.power,
            started: 0
        });
    }

    /**
     * Start new game
     */

    startGame() {
        if (!this.state.power) {
            return false;
        }
        this.resetGame();
        this.move();
        this.setState({
            started: 1,
        });

    }

    /**
     * Reset game state
     */
    resetGame() {
        this.setState({
            gameQueue: [],
            level: 0,
        })
    }

    /**
     * Game move
     * Add sound to array and play all sounds queued
     */
    move() {
        this.drawNext();
        this.playQueue();
    }

    /**
     * Draws next element and adds it to game queue
     */
    drawNext() {
        const next = Math.floor(Math.random() * 4) + 1;
        const gameQueue = [...this.state.gameQueue];
        gameQueue.push(next);
        this.setState({gameQueue});
    }

    setInterval() {
        const intervalID = setInterval(this.playItem.bind(this), 500);
        this.setState({intervalID});
    }

    unsetInterval() {
        clearInterval(this.state.intervalID);
    }

    playQueue() {
        this.setState({currentQueueItem: 0});
        this.setInterval();
    }

    playItem() {
        this.playSound(this.state.currentQueueItem);
        this.highlightButton(this.state.currentQueueItem);
        this.setState({currentQueueItem: this.state.currentQueueItem + 1});
        if (this.state.currentQueueItem > this.state.gameQueue.length) {
            this.startUserTurn();
        }
    }

    playSound(index) {
        const soundIndex = this.state.gameQueue[index];
        this.setState({soundPlaying: this.state.sounds[soundIndex]}, function () {
            this.audioContainer.pause();
            this.audioContainer.load();
            this.audioContainer.play();
        })
    }

    highlightButton(index) {
        this.setState({
            activeButton: this.state.gameQueue[index]
        })
    }

    unhiglightButtons() {
        this.setState({
            activeButton: null
        })
    }

    startUserTurn() {
        this.unsetInterval();
        this.unhiglightButtons(null);
        this.unlockBoard();
        this.resetAnswers();
    }

    answer(button) {
        this.highlightButton(button);
    }

    render() {
        return (
            <div className="App">
                <button onClick={() => this.playQueue()}>Start test</button>
                <audio id="audio" ref={(audio) => {
                    this.audioContainer = audio;
                }}>
                    <source id="src_mp3" type="audio/mp3" src={this.state.soundPlaying}/>
                </audio>
                <div id="game-container">
                    <div
                        className={(this.state.activeButton == 1 ? 'active' : '') + " game-button btn-lt btn-green"}
                        onClick={() => this.answer(1)}></div>
                    <div
                        className={(this.state.activeButton == 2 ? 'active' : '') + " game-button btn-rt btn-red"}
                        onClick={() => this.answer(2)}></div>
                    <div
                        className={(this.state.activeButton == 3 ? 'active' : '') + " game-button btn-lb btn-yellow"}
                        onClick={() => this.answer(3)}></div>
                    <div
                        className={(this.state.activeButton == 4 ? 'active' : '') + " game-button btn-rb btn-blue"}
                        onClick={() => this.answer(4)}></div>
                    <div id="simon-center">
                        <div id="game-title">simon</div>
                        <div id="game-controls">
                            <div id="score">
                                <div id="score-display">{this.state.level}</div>
                                <div className="controls-desc">score</div>
                            </div>
                            <div id="start">
                                <div className={(this.state.started ? 'on' : 'off') + ' controls-led'}></div>
                                <button
                                    className={(this.state.started ? 'pressed' : '') + ' controls-button'}
                                    onClick={() => this.startGame()}
                                ></button>
                                <div className="controls-desc">start</div>
                            </div>
                            <div id="strict">
                                <div className="controls-led on"></div>
                                <button className="controls-button"></button>
                                <div className="controls-desc">strict</div>
                            </div>
                        </div>
                        <div id="game-on-switch">
                            <div id="switch-container" className={this.state.power ? 'on' : 'off'}>
                                <div className="toogle-text-on">on</div>
                                <div className="toggle" onClick={() => this.toggleGamePower()}></div>
                                <div className="toogle-text-off">off</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
