import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            gameQueue: [],
            answers: [],
            level: 0,
            currentQueueItem: 0,
            activeButton: null,
            fqs: [300, 250, 200, 150],
            errorFrequency: 110,
            power: 0,
            started: 0,
            locked: 1,
            playingQueue: false,
            strictMode: false,
            infoButton: {
                text: 'Success!',
                buttonText: 'Next Level',
                buttonAction: this.upOneLevel,
                visible: false,
            }
        };
        this.maxLevel = 20;

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.oscillator = this.audioContext.createOscillator();
        this.biquadFilter = this.audioContext.createBiquadFilter();
        this.gainNode = this.audioContext.createGain();

        this.ErrorOscillator = this.audioContext.createOscillator();
        this.errorFilter = this.audioContext.createBiquadFilter();
        this.errorGain = this.audioContext.createGain();
    }

    componentDidMount() {
        this.oscillator.connect(this.biquadFilter);
        this.biquadFilter.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        this.oscillator.type = 'sine';
        this.gainNode.gain.value = 0;
        this.oscillator.start(0.0);

        this.ErrorOscillator.connect(this.errorFilter);
        this.errorFilter.connect(this.errorGain);
        this.errorGain.connect(this.audioContext.destination);
        this.ErrorOscillator.type = 'sine';
        this.ErrorOscillator.frequency.value = this.state.errorFrequency;
        this.errorGain.gain.value = 0;
        this.ErrorOscillator.start(0.0);
    }

    componentDidUpdate() {
        if (this.state.playingQueue) {
            this.playQueue();
        }
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
        this.resetGame().then(function () {
            this.move();
            this.hideInfoBar();
            this.resetInfoBar();
            this.setState({
                started: 1,
                level: 1
            });
        }.bind(this));

    }

    toggleStrictMode() {
        if (!this.state.power) {
            return false;
        }

        this.setState({
            strictMode: !this.state.strictMode,
        });
    }

    /**
     * Reset game state
     */
    resetGame() {
        return new Promise((resolve) => {
            this.setState({
                gameQueue: [],
                level: 1,
            }, () => resolve())
        });
    }

    /**
     * Game move
     * Add sound to array and play all sounds queued
     */
    move() {
        this.lockBoard();
        this.drawNext();
        this.playQueue();
    }

    upOneLevel() {
        this.hideInfoBar();
        this.setState({
            level: this.state.level + 1
        });
        this.move();
    }

    /**
     * Draws next element and adds it to game queue
     */
    drawNext() {
        const next = Math.floor(Math.random() * 3) + 1;
        const gameQueue = [...this.state.gameQueue];
        gameQueue.push(next);
        this.setState({gameQueue});
    }

    setInterval() {
        const intervalID = setInterval(
            function () {
                this.playItem(this.state.gameQueue[this.state.currentQueueItem]);
            }.bind(this),
            1000);
        this.setState({intervalID});
    }

    unsetInterval() {
        clearInterval(this.state.intervalID);
    }

    playQueue() {
        this.setState({currentQueueItem: 0});
        this.setInterval();
    }

    playItem(index) {
        this.playSound(index);
        this.highlightButton(index);
        setTimeout(function () {
            this.unhiglightButtons();
        }.bind(this), 500);
        this.setState({currentQueueItem: this.state.currentQueueItem + 1});
        if (this.state.currentQueueItem > this.state.gameQueue.length) {
            this.startUserTurn();
        }
    }

    playSound(index) {
        //const soundIndex = this.state.gameQueue[index];
        if (index === undefined) {
            return false;
        }
        this.oscillator.frequency.value = this.state.fqs[index];
        this.gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.5);
        this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
    }

    highlightButton(index) {
        this.setState({
            activeButton: index
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

        if (this.state.locked) {
            return false;
        }

        const answers = [...this.state.answers];
        answers.push(button);

        const lastAnswerIndex = answers.length - 1;

        if (button === this.state.gameQueue[lastAnswerIndex]) {
            this.highlightButton(this.state.gameQueue[lastAnswerIndex]);
            this.playSound(this.state.gameQueue[lastAnswerIndex]);
            this.setState({
                answers: answers
            });
            setTimeout(function () {
                this.unhiglightButtons();
            }.bind(this), 500);

            if (lastAnswerIndex === this.state.gameQueue.length - 1) {
                this.lockBoard();
                if (lastAnswerIndex === this.maxLevel - 1) {
                    this.showEndGameInfoBar();
                } else {
                    this.showInfoBar();
                }
            }

        } else {
            this.error();
        }
    }

    error() {
        this.errorGain.gain.value = 0.5;
        setTimeout(function () {
            this.errorGain.gain.value = 0;
            if (this.state.strictMode) {
                this.resetGame().then(function () {
                    this.move();
                }.bind(this));
            } else {
                this.resetAnswers();
                this.lockBoard();
                this.playQueue();
            }
        }.bind(this), 300);
    }

    showInfoBar() {
        this.setState({
            infoButton: {...this.state.infoButton, visible: true}
        });
    }

    hideInfoBar() {
        this.setState({
            infoButton: {...this.state.infoButton, visible: false}
        });
    }

    showEndGameInfoBar() {
        const infoButton = {...this.state.infoButton};
        infoButton.text = 'You won the whole game!';
        infoButton.buttonText = 'Restart';
        infoButton.buttonAction = this.startGame;
        infoButton.visible = true;

        this.setState({
            infoButton: {...this.state.infoButton, ...infoButton}
        });

    }

    resetInfoBar() {
        this.setState({
            infoButton: {
                ...this.state.infoButton, ...{
                    text: 'Success!',
                    buttonText: 'Next Level',
                    buttonAction: this.upOneLevel,
                }
            }
        });
    }

    render() {
        return (
            <div className="App">
                <div id="game-container">
                    {
                        this.state.infoButton.visible
                            ?
                            <div className="info">
                                <h1>{this.state.infoButton.text}</h1>
                                <button
                                    onClick={() => this.state.infoButton.buttonAction.call(this)}>{this.state.infoButton.buttonText}
                                </button>
                            </div>
                            :
                            null
                    }
                    <div
                        className={(this.state.activeButton === 0 ? 'active' : '') + " game-button btn-lt btn-green"}
                        onClick={() => this.answer(0)}></div>
                    <div
                        className={(this.state.activeButton === 1 ? 'active' : '') + " game-button btn-rt btn-red"}
                        onClick={() => this.answer(1)}></div>
                    <div
                        className={(this.state.activeButton === 2 ? 'active' : '') + " game-button btn-lb btn-yellow"}
                        onClick={() => this.answer(2)}></div>
                    <div
                        className={(this.state.activeButton === 3 ? 'active' : '') + " game-button btn-rb btn-blue"}
                        onClick={() => this.answer(3)}></div>
                    <div id="simon-center">
                        <div id="game-title">simon</div>
                        <div id="game-controls">
                            <div id="score">
                                <div id="score-display">{this.state.level}</div>
                                <div className="controls-desc">level</div>
                            </div>
                            <div id="start">
                                <div className={(this.state.started ? 'on' : 'off') + ' controls-led'}></div>
                                <button
                                    className={(this.state.started ? 'pressed' : '') + ' controls-button'}
                                    onClick={() => this.startGame()}
                                ></button>
                                <div className="controls-desc">{this.state.started ? 'restart' : 'start'}</div>
                            </div>
                            <div id="strict">
                                <div className={(this.state.strictMode ? 'on' : 'off') + ' controls-led'}></div>
                                <button
                                    className={(this.state.strictMode ? 'pressed' : '') + ' controls-button'}
                                    onClick={() => this.toggleStrictMode()}
                                ></button>
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
