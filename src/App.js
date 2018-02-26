import React, {Component} from 'react';
import './App.css';

import sound0 from './sounds/simonSound1.mp3';
import sound1 from './sounds/simonSound2.mp3';
import sound2 from './sounds/simonSound3.mp3';
import sound3 from './sounds/simonSound4.mp3';

class App extends Component {
    constructor(){
        super();
        this.state = {

        }
    }

    playSound() {
        console.log(this.audioContainer);
        this.audioContainer.load();
        this.audioContainer.play();
    }
    render() {
        return (
            <div className="App">
                <audio id="audio" ref={(audio) => { this.audioContainer = audio; }}>
                    <source id="src_mp3" type="audio/mp3" src={sound1}/>
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
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
