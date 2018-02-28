import React, {Component} from 'react';
import './App.css';

import sound1 from './sounds/simonSound1.mp3';
import sound2 from './sounds/simonSound2.mp3';
import sound3 from './sounds/simonSound3.mp3';
import sound4 from './sounds/simonSound4.mp3';

class App extends Component {
    constructor(){
        super();
        this.state = {
            gameQueue: [1, 2, 3, 4, 1, 2, 3, 4],
            level: 0,
            intervalID: null,
            currentQueueItem: 0,
            sounds: {
                1: sound1,
                2: sound2,
                3: sound3,
                4: sound4
            },
            soundPlaying: null
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.unsetInterval();
    }

    setInterval() {
        const intervalID = setInterval(this.playItem.bind(this), 1000);
        this.setState({intervalID});
    }

    unsetInterval() {
        clearInterval(this.state.intervalID);
    }

    pushNextToQueue(next) {
        const gameQueue = [...this.state.gameQueue];
        gameQueue.push(next);
        this.setState({gameQueue});
    }

    startGame() {
        this.drawNext();
    }

    playQueue() {
        this.setState({ currentQueueItem: 0 });
        this.setInterval();
    }

    playItem() {
        this.playSound(this.state.currentQueueItem);
        this.setState({ currentQueueItem: this.state.currentQueueItem + 1 });
        if(this.state.currentQueueItem > 5) {
            this.unsetInterval();
        }
    }

    drawNext() {
        const next = this.random();
        this.pushNextToQueue(next);
    }

    random() {
        return Math.floor(Math.random() * 4) + 1;
    }

    playSound(index) {
        const soundIndex = this.state.gameQueue[index];
        this.setState({ soundPlaying: this.state.sounds[soundIndex] },function(){
            this.audioContainer.pause();
            this.audioContainer.load();
            this.audioContainer.play();
        })
    }

    render() {
        return (
            <div className="App">
                <button onClick={()=>this.playQueue()}>Start test</button>
                <audio id="audio" ref={(audio) => { this.audioContainer = audio; }}>
                    <source id="src_mp3" type="audio/mp3" src={this.state.soundPlaying}/>
                </audio>
                <div id="game-container">
                    <div className="game-button btn-lt btn-green"></div>
                    <div className="game-button btn-rt btn-red"></div>
                    <div className="game-button btn-lb btn-yellow"></div>
                    <div className="game-button btn-rb btn-blue"></div>
                    <div id="simon-center">
                        <div id="game-title">simon</div>
                        <div id="game-controls">
                            <div id="score">
                                <div id="score-display">20</div>
                                <div className="controls-desc">score</div>
                            </div>
                            <div id="start">
                                <div className="controls-led off"></div>
                                <button className="controls-button"></button>
                                <div className="controls-desc">start</div>
                            </div>
                            <div id="strict">
                                <div className="controls-led on"></div>
                                <button className="controls-button"></button>
                                <div className="controls-desc">strict</div>
                            </div>
                        </div>
                        <div id="game-on-switch">
                            <div id="switch-container">
                                <div className="toogle-text-on">on</div>
                                <div className="toggle"></div>
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
