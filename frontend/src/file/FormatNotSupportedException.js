/**
 * Created by dev on 14.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Exception from './../Exception';

export default class FormatNotSupportedException extends Exception{
    constructor(massage, data){
        super(massage, data);
    }
}