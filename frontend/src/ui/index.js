/**
 * Copyright (c) 2019 Micro Logic Corp.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import App from './React/App'

if(ENV!='test' && ENV !='development') {
    Sentry.init({dsn: "https://e3dbb4d2145c4fc4919cf909554f50c6@sentry.io/1826686"});
}
ReactDOM.render(
    <App/>,
    document.getElementById('app')
);

if (localStorage.getItem('loaded') == 'false') {
    /** @type {Confirmation} */
    // let confirm = container.resolve('confirm', [
    //     () => {
            app.restore()
            console.log('restore')
        // }, () => {
        //     app.loaded = true
        //     localStorage.setItem('loaded', true)
        //     console.log('Not restore')
        // },
        // 'The last session was interrupted. Do you want to restore the data?'
    // ])
}
window.onbeforeunload = function (e) {
    if (!app.loaded) {
        return 'Do you want to save the drawing before  exit?'
    }
}
