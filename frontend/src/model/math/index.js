/**
 *
 */

import Trigonometric from './Trigonometric'
import ClosedFigure from './ClosedFigure'
import Line from './Line'
import Vector from './Vector'
import Matrix from './Matrix'
import IncidenceMatrix from './IncidenceMatrix'
import PolyLine from './PolyLine'
import Rect from './Rect'
import Point from './Point'
import Triangle from './Triangle'
import Extremum from './Extremum'


const module = {
    Trigonometric,
    ClosedFigure,
    Vector,
    Rect,
    PolyLine,
    Point,
    Matrix,
    Line,
    IncidenceMatrix,
    Triangle,
    Extremum
};


container.registerObject('math', module);


global.Modules = {
    Math:module
};

module.exports = module;

console.log("Finish Math Module registration");