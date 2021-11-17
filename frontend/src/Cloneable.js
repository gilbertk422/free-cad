/**
 * Created by dev on 19.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

/**
 * The interface is intended to describe classes with a complex data structure, to create a copy.
 *
 * @interface
 */
export default class Cloneable{

    /**
     * The method create copy of current object
     * @abstract
     * @return {Object}
     */
    copy(){
        throw new Exception('The method doesn\'n have implementation.');
    }

}