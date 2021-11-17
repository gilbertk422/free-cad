/**
 * Created by dev on 20.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import BoardExtension from './../BoardExtension';

/**
 * @inheritDoc
 */
export default class InteractiveBoardExtension extends BoardExtension{
    /**
     * @inheritDoc
     * @param {InteractiveBoard} board
     */
    constructor(board){
        super(board);
    }

    /**
     * The method must only change current object state.
     *
     * @param {{x:number,y:number}} position
     */
    mouseMove(position){
        throw new Exception('The method doesn\'t have implementation.');
    }
}
