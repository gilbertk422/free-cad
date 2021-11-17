/**
 * Created by dev on 20.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

/**
 * The abstract class need for render some data structure.
 * Implementations of the class are used in the {@class InteractiveBoard}
 *
 * Also, implementations of the class should use an instance of the {@class Board} for render the data structure.
 *
 * @interface
 */
export default class Renderable{

    /**
     * The method renders some data structure using an instance of the {@class Board} class.
     * @abstract
     */
    render(board){
        throw new Exception('The method doesn\'t have implementation.');
    }

}