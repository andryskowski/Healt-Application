import React from 'react';
import './sass/App.sass';
import {Provider} from 'react-redux';

import store from '../../store/store'

const App = () => {
    return (
        <Provider>
        <div className="content">
            <div className="elementsFlex">
            <p>elo</p>
            </div>
        </div>
        </Provider>
    );
};

export default App;