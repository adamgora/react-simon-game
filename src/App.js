import React, {Component} from 'react';
import './App.css';

import sound1 from './sounds/simonSound1.mp3';

class App extends Component {
    playSound() {
        console.log(this.audioContainer);
        this.audioContainer.load();
        this.audioContainer.play();
    }
    render() {
        return (
            <div className="App">
                <button onClick={() => this.playSound()}>Click sound</button>
                <audio id="audio" ref={(audio) => { this.audioContainer = audio; }}>
                    <source id="src_mp3" type="audio/mp3" src={sound1}/>
                </audio>
            </div>
        );
    }
}

export default App;
