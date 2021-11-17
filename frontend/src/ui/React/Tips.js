/**
 * Copyright (c) 2019 Micro Logic Corp.
 *
 * Class needed for grouping tips
 */
export default class Tips{

    constructor(){

        this.tips = [];
        this.tips['group'] = "Group (Ctrl +G) </br> " +
            "Combine selected lines into a group to allow selection in </br>" +
            "one click. Hold the CTRL key; select multiple lines, then </br>" +
            "click this button. To select a series of connected lines </br>" +
            "in one step - hold SHIFT while clicking on one of the lines.";
        this.tips['ungroup'] = "Ungroup (Ctrl+U)</br>Separates a group into its component lines."
        this.tips['fitScreen'] = "Zoom to fit screen (=)</br>Set magnification to show the full design.";
        this.tips['actualSize'] = "Zoom actual size (1)</br>Show design in approximately real-life size.";
        this.tips['zoomTool'] = "Zoom</br>" +
            "To magnify a specific area, in workspace drag a rectangle </br>" +
            "around the area. To set center of magnification and increase </br>" +
            "magnification, click at desired new center of drawing. To set </br>" +
            "center of magnification and decrease magnification, right click </br>" +
            "at desired new center of drawing.";
        this.tips['delete'] = "Delete (Del)</br>" +
            "Removes lines in drawing. Click the selection (arrow) button.</br>" +
            "Then click the line to remove and then click this button.";
        this.tips['preferences'] = "Preferences (F2)</br> Set preference options such as inch/metric mode.";
        this.tips['toggle'] = "Inch / mm</br> Show all dimensions in inches or millimeters.";
        this.tips['intersect'] = "Intersect (Ctrl+I)</br> Split lines where they cross. First select one or more lines.";
        this.tips['3D'] = "3D Preview (Ctrl+R)</br> Show 3D view of the current design.</br> Use frequently while creating your design.";
        this.tips['price-analyze'] = "Price/Analyze (F9)</br> Check design validity and compute cost.";

        this.tips['select-tool'] = "Select</br>" +
            "Chooses a line to which you want to issue a command or make a change.</br>" +
            " Click on the line. To select multiple lines hold the CTRL key.</br> " +
            "To select connected lines hold the SHIFT key.";
        this.tips['line-tool'] = "Line</br> " +
            "Draws a straight line. Click at the start and end points. </br>" +
            "Hold the CTRL key while drawing for a precise 0, 15, 30 or </br> " +
            "45 deg angle. Press spacebar to restart line mode.";
        this.tips['spline-tool'] = "Spline</br>" +
            "Draws a special style of curve. In workarea click to specify</br> " +
            "start point of the curve. Click again at end point.</br>" +
            "Drag the control points to modify  the curve.";
        this.tips['rect-tool'] = "Rectangle</br>Draws a rectangle. </br>In workarea, click at opposite corners of the rectangle.";
        this.tips['circle-tool'] = "Circle</br> Draws a circle. In workarea, click at the center and circumference.";
        this.tips['freehand-tool'] = "Freehand</br> " +
            "Draws a freehand sketch.</br> " +
            "Click and hold mouse button while moving the mouse.</br>" +
            "Use the Node edit tool to modify.";
        this.tips['eraser-tool'] = "Eraser</br> " +
            "Use this essential tool to create most shapes.</br> " +
            "First draw overlapping circles, rectangles and </br>" +
            "straight lines. Then click this Eraser tool and </br>" +
            "click on the appropriate line segments to be erased.</br>" +
            "For example, try creating a “D” shape by drawing </br>" +
            "a vertical line through a circle and then erasing </br>" +
            "the appropriate line segments. Or try drawing a thick ”+” </br>" +
            "shape by first drawing overlapping vertical and horizontal</br>" +
            "rectangles and then erasing the internal segments.";
        this.tips['corner-tool'] = "Corner</br> " +
            "Rounds or chamfers sharp 2D corners.</br> " +
            "First select two or more lines that meet.";
        this.tips['text-tool'] = "Text</br> " +
            "Adds comment text to design.</br> " +
            "In workarea, click to specify starting point." +
            "Type the text and press Enter.";
        this.tips['line-edit-tool'] = "Line Edit</br>" +
            "Allows to move line endpoints to adjust a shape.</br> " +
            "In workarea click on the line.</br>" +
            "Drag the line or its endpoint to the desired location.";
        this.tips['ruler-tool'] = "Ruler </br> Measures a distance in the workspace.</br> Left-click on the start and end points to be measured.";
        this.tips['snap-tool'] = "Snap to lines</br> Places new or moved lines to meet key points on existing lines. </br>" +
            "It is generally recommended to keep snap mode active.";
        this.tips['help-tool'] = "Help </br> Mechanical drawing is easy if you know a few key methods.</br>" +
            " Click this button for help on these techniques.</br> For example, it is essential to know how to enter dimensions numerically,</br>" +
            " use the Eraser tool, use the snap feature,</br> nudge lines, and combine commands to draw needed shapes.";

        this.tips['numeric-radius'] = "Radius </br> Distance from the center of the arc to the edge.";
        this.tips['numeric-start-angle'] = "Start Angle </br> Angle of the line from the center to the most clockwise point of the arc.";
        this.tips['numeric-inside-angle'] = "Inside Angle </br> Angle of arc.";
        this.tips['numeric-diameter'] = "Diameter </br> Distance fully across the circle.";
        this.tips['numeric-horizontal-size'] = "Horizontal size</br> Width of imaginary rectangle enclosing the line.";
        this.tips['numeric-vertical-size'] = "Vertical size </br> Height of imaginary rectangle enclosing the line.";
        this.tips['numeric-line-length'] = "Length</br> Distance from the beginning of the line to the end.";
        this.tips['numeric-line-angle'] = "Line angle</br> Angle of the end point with respect to the start point.";
        this.tips['numeric-repeat'] = "Repeat</br>" +
            "When this button is pressed in, the nudge arrow buttons and the </br>" +
            "nudge rotation buttons will create copies of the selected shape.</br>" +
            "For example, to create 3 copies to the right of an existing shape,</br>" +
            "select the shape, press in this Repeat button and press the right </br>" +
            "arrow button or key 3 times.";
        this.tips['numeric-nudge'] = "Nudge selected line the specified distance.</br> " +
            "Hold the Alt key for faster nudging.</br> The state of Repeat button determines if lines are duplicated or simply moved.";
        this.tips['numeric-nudge-step'] = "Nudge step </br> " +
            "The distance an object will move when an arrow button or key is pressed.</br>" +
            " It is generally recommended to move an item by first dragging</br> " +
            "the item to a snap point on an existing line and then nudging.";
        this.tips['numeric-rotate-counterclockwise'] = "Rotate selected line Left (counterclockwise) </br>" +
            "The state of the Repeat button determines</br> if lines are duplicated or simply rotated.";
        this.tips['numeric-rotate-clockwise'] = "Rotate selected line Right (clockwise) </br>"+
            "The state of the Repeat button determines</br> if lines are duplicated or simply rotated.";
        this.tips['numeric-rotate-step'] = "Rotation step angle</br> The angle a selected line will rotate when you press</br>" +
            " a rotation nudge button or press the L or R keyboard keys.</br>You can set the center of rotation by dragging the center icon.</br>" +
            " Hold Ctrl key during rotation via mouse </br>to rotate in multiples of this angle.";
        this.tips['numeric-text-size'] = "Size</br> Font height.";
        this.tips['numeric-text'] = "Text</br> Text body.";
        this.tips['numeric-help'] = "Help</br> Shows how to use numeric values";
        this.tips['numeric-Z'] = "Z </br> Sets the thickness of the material</br>Use Air Inside for thru features.";
        this.tips['numeric-line-type'] = "Line type</br> Specifies whether the selected line is used</br> to specify the part shape, a bend, a comment, etc.";
        this.tips['numeric-bend-angle'] = "Bend angle </br> Positive values bend material towards</br> yourself from the 2D view. Negative values bend away.";
        this.tips['numeric-thread-select'] = "Nominal internal thread size.";
        this.tips['numeric-comment-type'] = "Choose this option to specify a comment.";
        this.tips['corner-radius'] = "<span>Radius of fillet.</span>";
        this.tips['tracing-paper'] = "Tracing paper</br> Use this tool for change size and position of tracing paper";
    }

    getTip(name){
        return '<span>'+this.tips[name]+'</span>';
    }
}