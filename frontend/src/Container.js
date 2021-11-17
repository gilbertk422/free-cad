/**
 * Created by dev on 26.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

// import 'core-js';
import {Container} from 'addict-ioc';
import Exception from './Exception'
import Helper from './Helper'

/**
 * For using container.resolve('token');
 */
const container = new Container();
global.container = container;

global.Exception = Exception;

global.Helper = Helper;

global.debug= {
    disableRollUp:false,
    disable3DBendAreas:false,
    showTextMetrics:false,
    enableAutoSaving:true
};


