import React from 'react';

export const Login = ({ name, onSubmit, isSearching }) => {
    return (
        <div className="flex flex-col text-4xl">
            <label htmlFor="nickname">Your nickname: </label>
            <input value={ name.get() } onChange={ event => name.set(event.target.value) } className="p-2 mt-2 bg-primary border border-secondary border-4 rounded-2xl" id="nickname"
                   type="text"/>
            <button
                disabled={ isSearching.get() }
                onClick={ onSubmit }
                type="button"
                className="disabled:bg-gray-600 bg-secondary text-primary rounded-2xl mt-3 mb-2 p-2 py-3"
            >
                Ready
            </button>
        </div>
    );
};
