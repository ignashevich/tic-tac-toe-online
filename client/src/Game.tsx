import React, { useEffect, useRef, useState } from 'react';
import { deepCopy } from './helpers/deepCopy';
import { winPatterns } from './winPatterns';
import { empty } from './helpers/empty';

export const Game = ({ peerConnection, receivedConnection }) => {
    const [state, setState] = useState([[], [], []]);
    const [currentPlayer, setCurrentPlayer] = useState('x');
    const [result, setResult] = useState(null);

    useEffect(() => {
        receivedConnection.on('data', function (receivedStateRaw) {
            const receivedState = JSON.parse(receivedStateRaw);
            setState(receivedState);
        });
    }, []);


    const onCellClick = (pos) => {
        if (!state[pos[0]][pos[1]] && !result) {

            let tempState = deepCopy(state);
            tempState[pos[0]][pos[1]] = currentPlayer;
            setState(tempState);
            peerConnection.send(JSON.stringify(tempState));
        }
    };

    useEffect(() => {
        winPatterns.forEach(pattern => {
            if (pattern.every((pos) => state[pos[0]][pos[1]] === currentPlayer)) {
                setResult(currentPlayer);
            }
        });
        if (!result && state.flat(2).filter(v => v).length === 9) {
            setResult('draw');
        }
        setCurrentPlayer((player) => player === 'o' ? 'x' : 'o');

    }, [state])

    return (
        <div>
            <div className="grid w-60 border h-60 grid-cols-3 grid-rows-3">
                { empty(3)
                    .map((_, ix) => empty(3)
                        .map((_, iy) => <div onClick={ () => onCellClick([ix, iy]) } className="border cursor-pointer grid place-content-center text-4xl">{ state[ix][iy] }</div>)) }
            </div>
            <div className="text-center mt-20 text-4xl">
                Result: { result ?? 'in progress' }
            </div>
        </div>
    );
};
