import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { empty } from './helpers/empty';
import { deepCopy } from './helpers/deepCopy';
import { winPatterns } from './winPatterns';
import Peer from 'peerjs';
import { Game } from './Game';
import { Login } from './Login';
import { useValue } from './helpers/useValue';
import { findOpponent } from './api/findOpponent';

function App() {

    const name = useValue('');
    const id = useValue('');
    const isSearching = useValue(false);
    const isPeerConnected = useValue(false);
    const isMeConnected = useValue(false);
    const receivedConnection = useRef(null);
    const peerConnection = useRef(null);
    const [peer, setPeer] = useState(null);

    useEffect(() => {
        const _peer = new Peer();
        setPeer(_peer);
        _peer.on('open', function(peerId) {
            id.set(peerId);
        });
        _peer.on('connection', function (receivedConn) {
            receivedConnection.current = receivedConn;
            isMeConnected.set(true);
            console.log('someone connected');
            receivedConn.on('data', function (data) {
                console.log('received', data);
            });
        });
    }, []);



    const onSubmit = async () => {
        isSearching.set(true);
        const opponent = await findOpponent(id.get());
        const conn = peer.connect(opponent);
        conn.on('open', () => {
            peerConnection.current = conn;
            isPeerConnected.set(true);
            conn.send('hi!');
        });

        isSearching.set(false);
    };

    const isConnected = isMeConnected.get() && isPeerConnected.get();


    return (
        <div className="App">

            <main className="flex flex-col items-center my-20">
                { !isConnected && <Login isSearching={ isSearching } onSubmit={ onSubmit } name={ name }/> }
                { isSearching.get() && 'Searching for an opponent...' }
                { isConnected && <Game receivedConnection={receivedConnection.current}  peerConnection={peerConnection.current}/> }
            </main>
        </div>
    );
}

export default App;
