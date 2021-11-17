/**
 * Created by dev on 26.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */


import { jsdom } from 'jsdom';
import 'mock-local-storage'
const doc = jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;

global.ENV='test';

Object.keys(window).forEach((key) => {
    if (!(key in global)) {
        global[key] = window[key];
    }
});