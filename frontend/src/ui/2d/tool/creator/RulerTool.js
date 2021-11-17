/**
 * Created by dev on 07.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import LineTool from './LineTool';

import CommentToSelf from '../../../../model/line_types/CommentToSelf';
import Comment from "../../../../model/line_types/Comment";

export default class RulerTool extends LineTool{
    constructor(document){
        super(document);
        this.name="Ruler"
    }
    createElement(point){
        let line = super.createElement(point);
        line.lineType = new CommentToSelf();
        line.lineType.type=Comment.TYPE_DIMENSION;
        return line;
    }
}