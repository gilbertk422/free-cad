/**
 * Created by dev on 11.03.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Behavior from '../Behavior';
import Document from '../../model/Document';
import Text from '../../model/elements/Text';
import LineElement from "../../model/elements/LineElement";
import Bend from "../../model/line_types/Bend";
import CommentToSelf from "../../model/line_types/CommentToSelf";
import CommentToMachine from "../../model/line_types/CommentToMachine";
import Arc from "../../model/elements/Arc";

export default class ChangeFontLoader extends Behavior {

    /**
     * The method is main method of behavior. It's execute the operation
     * @param {ChangeFontCommand} command - the parameter need for edition the command state
     * @return {Promise} - the promise in resolve send result of execution behavior {true|false}
     */
    execute(command) {
        return new Promise((resolve, reject) => {
            /** @type {Font} */
            let font = container.resolve('fontManager').getFont(command.fontName);
            if (font instanceof Promise) {
                /** @type {ProgressBar} */
                let pb = container.resolve('progressBar');

                pb.setValue(45);
                pb.show("Font loading.");

                font.then(font => {
                    command.font = font;
                    pb.hide();
                    resolve(true);
                });
            } else if (font) {
                command.font = font;
                resolve(true);
            } else {
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Font not found!");
                resolve(false);
            }
        });
    }

}