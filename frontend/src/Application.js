/**
 * Created by dev on 17.01.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Command from './command/Command';
import CommandHistory from './CommandHistory';
import Document from './model/Document';

import GroupCommand from './command/GroupCommand';
import UngroupCommand from './command/UngroupCommand';
import DeleteElementCommand from './command/DeleteElementCommand';
import ChangeLineTypeCommand from './command/ChangeLineTypeCommand';
import ChangeElementsHeightCommand from './command/ChangeElementsHeightCommand';
import IntersectElementsCommand from './command/IntersectElementsCommand';
import ChangeTextCommand from './command/ChangeTextCommand';
import ChangeFontSizeCommand from './command/ChangeFontSizeCommand';
import MoveElementsCommand from './command/MoveElementsCommand';
import RotateElementsCommand from './command/RotateElementsCommand';
import MirrorElementsCommand from './command/MirrorElementsCommand';
import CopyDecorator from './command/CopyDecorator';
import ElementModificationCommand from './command/ElementModificationCommand';
import ChangeArcsRadiusCommand from './command/ChangeArcsRadiusCommand';
import ChangeLineLengthCommand from './command/ChangeLineLengthCommand';
import ChangeLineAngleCommand from './command/ChangeLineAngleCommand';
import ResizeElementsCommand from './command/ResizeElementsCommand';
import ChangeArcAngleCommand from './command/ChangeArcAngleCommand';
import TangentsArcsCommand from './command/TangentsArcsCommand';
import EraserNearElementsCommand from './command/EraserNearElements';
import RoundCornerCommand from "./command/Corner";
import ChangeBendRadiusCommand from "./command/ChangeBendRadiusCommand";
import DivideElementsCommand from "./command/DivideElements";
import ChangeFontCommand from "./command/ChangeFontCommand";
import SimplifyCommand from "./command/Simplify";

import PointerTool from './ui/2d/tool/PointerTool';

import CreatorTool from './ui/2d/tool/CreatorTool';
import EditLineTool from './ui/2d/tool/EditLineTool';
import MagnificationDecorator from './ui/2d/tool/decorators/MagnificationDecorator';
import MagnificationCreatorToolDecorator from './ui/2d/tool/decorators/MagnificationCreatorToolDecorator';
import MagnificationEditLineDecorator from './ui/2d/tool/decorators/MagnificationEditLineDecorator';
import MagnificationTransformerDecorator from './ui/2d/tool/decorators/MagnificationTransformerDecorator';

import Text from './model/elements/Text';
import FormatNotSupportedException from './file/FormatNotSupportedException';
import Observable from './Observable';
import FileNameModal from "./ui/modal/FileName";
import LineElement from "./model/elements/LineElement";
import Spline from "./model/elements/Spline";
import DocumentRendererBoard from './ui/2d/DocumentRedererBoard'
import TracingPaper from "./model/TracingPaper";
import AddElementCommand from "./command/AddElementCommand";

/**
 * The main application class is a facade for board
 * the class can generate events like as:
 * 1. selectElements - The event has data the data is a array of selected element
 * 2. clearSelectElements - the event will call when clear select elements
 * 3. updateSelectElements - the event will call when changed select elements
 * 4. openNewFile - the event will call when change or init currentDocument. The event has data the data is a new document
 *
 */
export default class Application extends Observable{


    /**
     *
     * @param {Config} config
     */
    constructor(config, board){
        super();

        /** @param {Document} */
        this._currentDocument = new Document();

        /** @param {CommandHistory} */
        this.commandHistory = new CommandHistory();

        /** @param {InteractiveBoard} */
        this._board = null;

        /** @type {Array.<GraphicElement>} */
        this.selectElements = [];

        /** @type {TracingPaper}*/
        this.tracingPaper = null;

        this.config = config;

        this._lastTool=null;

        this.saved = true;
        this.loaded = true;

        this.init(config, board);
    }

    init(config, board){
        this.board=board;
        this.magnificationMode = config.magnificationMode;

        let ppi = this.config.PPI;
        if(!ppi){
            ppi=90;
        }
        this.board.zoomToActualSize(ppi);

        setInterval(()=>{
            if(!this.saved && global.debug.enableAutoSaving) {
                /** @type {XmlFileLoader} */
                let fileloader = container.resolve('fileLoaderFactory', 'xml');
                let xml = fileloader.convertInXML(this.currentDocument);
                localStorage.setItem('backup', xml);
                this.saved=true;
            }
        },15000);
    }

    /**
     * @return {Document}
     */
    get currentDocument(){
        return this._currentDocument;
    }

    /**
     * @param {Document} document
     */
    set currentDocument(document){
        this.saved=false;
        this.loaded=false;
        localStorage.setItem('loaded', false);
        this._currentDocument=document;
        this.commandHistory = new CommandHistory();
        this.selectElements=[];
        this._changeTool(this._getToolInstance('Pointer'));
        this.board.document=document;
        let zoomed = this.board.zoomToFitScreen();
        if(!zoomed){
            let ppi = this.config.PPI;
            if(!ppi){
                ppi=90;
            }
            this.board.zoomToActualSize(ppi);
        }
        this._notifyHandlers('openNewFile', document)
        this.board.render();
    }

    /**
     * @param {InteractiveBoard} board
     */
    set board(board){
        this._board = board;
        board.setTool(this._getToolInstance('Pointer'));
        board.document=this.currentDocument;
    }

    /**
     * @return {InteractiveBoard}
     */
    get board(){
        return this._board;
    }

    set magnificationMode(val){
        this._magnificationMode=val;
        let tool=this.board.tool;
        if(!val && tool instanceof MagnificationDecorator){
            this._changeTool(tool.tool);
        }
        if(val){
            this._changeTool(tool);
        }
        this.config.magnificationMode=val;
    }

    /**
     * The method need for interface reflection flow
     * Pointer tool use the method
     * @param {Array.<GraphicElement>} elements
     */
    addSelectElements(elements){
        for(let element of elements){
            this.addSelectElement(element);
        }
        this._notifyHandlers('selectElements',elements);
    }

    /**
     * The method need for interface reflection flow
     * Pointer tool use the method
     * @param {GraphicElement} element
     */
    addSelectElement(element){
        for(let el of this.selectElements){
            if(el.compare(element)){
                return;
            }
        }
        this.selectElements.push(element);
    }

    selectAll(){
        if(this._board){
            this.setTool('Pointer');
            this.addSelectElements(this.currentDocument._elements);
            this._board.tool.selectElements(this.currentDocument._elements, false);
            this._board.render();
        }else{
            this.addSelectElements(this.currentDocument._elements);
        }
    }

    clearSelectElements(){
        if(this.selectElements.length>0) {
            this.selectElements.map(e => e._renderer.setFocus(false));
            if (this.selectElements.length == 1 && this.selectElements[0].typeName == 'Text' && this.selectElements[0].text == "") {
                this.undo(false);
            }
            this.selectElements = [];
            this._notifyHandlers('clearSelectElements');
        }
    }

    /**
     * @param {Command} command
     * @return {Promise.<boolean>}
     */
    executeCommand(command){
        return new Promise(resolve=>{
            command.execute().then((res)=>{
                if(!res){
                    resolve(false);
                    return;
                }
                if(command.needSave){
                    this.saved=false;
                    this.loaded=false;
                    localStorage.setItem('loaded', false);
                    this.commandHistory.push(command);
                }
                if(this._board){
                    if(command.name == 'AddElementCommand'){
                        this.clearSelectElements();
                        if(command._element instanceof Spline){
                            this._changeTool(this._getToolInstance('EditLine'));
                        }else {
                            this._changeTool(this._getToolInstance('Pointer'));
                        }
                        this.board.tool.clearSelectElements(false);
                        this.board.tool.selectElements([command._element]);
                        this.addSelectElements([command._element]);
                    }

                    if(command instanceof ElementModificationCommand){
                        let elements = this.selectElements;
                        if(command instanceof ChangeTextCommand) {
                            this.board.tool.clearSelectElements(false);
                            this._notifyHandlers('updateSelectElements', this.selectElements);
                            this.board.tool.selectElements(elements, false);
                        }else if(command instanceof MoveElementsCommand){ //hack for performance. The nudge was too slow
                            this.board.tool.clearSelectElements(false);
                            this.board.tool.selectElements(elements, false);
                        }else if(command instanceof RotateElementsCommand){
                            let center = this.getRotateCenter();
                            this.board.tool.clearSelectElements(false);
                            this.board.tool.selectElements(elements, false);
                            if(center){
                                if(this.board.tool instanceof PointerTool){
                                    this.board.tool.transformer.center = center;
                                    this.board.tool.transformer._calculateRadius(center);
                                }else{
                                    this.board.tool._tool.transformer.center = center;
                                    this.board.tool._tool.transformer._calculateRadius(center);
                                }
                            }
                            this._notifyHandlers('updateSelectElements', this.selectElements);
                        }else{
                            if (command.isReplacedElements()) {
                                elements = command.getElements();
                                if (command.selectOneElement) {
                                    elements = [elements[0]];
                                }
                                
                                if (!(command instanceof EraserNearElementsCommand)) {
                                    this.board.tool.clearSelectElements();
                                    this.board.tool.selectElements(elements);
                                }

                                this.addSelectElements(elements);
                            }else{
                                if(command instanceof IntersectElementsCommand){
                                    container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature(
                                        "Selected line doesn't intersect othel lines.");
                                }
                            }
                            if(command instanceof ChangeLineTypeCommand || command instanceof ChangeFontCommand){
                                this._notifyHandlers('updateSelectElements', this.selectElements);
                            }
                        }
                    }
                    this._board.render();
                    resolve(true);
                }
            });
        });
    }

    /**
     * Redo command which was undo
     */
    redo(){
        if(this.commandHistory.hasRedo()){
            let command = this.commandHistory.getRedo();
            command.redo();
            this.saved=false;
            this.loaded=false;
            localStorage.setItem('loaded', false);
            this.clearSelectElements();
            this.commandHistory.push(command);
        }
        if(this._board){
            this._changeTool(this._getToolInstance('Pointer'));
            this.board.render();
        }
    }
    
    /**
     * The method need for revert last command
     * @param [clearSelect=true]
     */
    undo(clearSelect=true){
        let command = this.commandHistory.pop();
        if(command){
            command.undo();
            if(clearSelect) {
                this.clearSelectElements();
            }
            this.saved=false;
            this.loaded=false;
            localStorage.setItem('loaded', false);
        }

        if(this._board){
            this._changeTool(this._getToolInstance('Pointer'));
            this.board.render();
        }
    }
    
    setTool(name){
        if(!this._board){
            return false;
        }
        if(name=="TracingPaper" && !this.tracingPaper){
            setTimeout(()=>{
                container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("To use this tool, you first need to set the tracing paper. Use menu item File>Tracing paper.");
            },100);
            return false;
        }
        this.clearSelectElements();
        let tool = this._getToolInstance(name);
        this._changeTool(tool);

        return true;
    }

    useLastTool(){
        if(this.board.tool instanceof PointerTool || this.board.tool instanceof  MagnificationTransformerDecorator) {
            this.clearSelectElements();
            if(this.board.tool instanceof PointerTool) {
                this._lastTool.mousePosition = this.board.tool.mousePosition;
            }else{
                this._lastTool.mousePosition = this.board.tool.tool.mousePosition;
            }
            this._changeTool(this._lastTool);
        }else{
            this._changeTool(this._getToolInstance('Pointer'));
        }
        this.board.render();
    }

    _changeTool(tool){
        this.config.copymode=false;
        if(!(tool instanceof PointerTool)){
            this._lastTool=tool;
        }
        if(this._magnificationMode && !(tool instanceof MagnificationDecorator)){

            if(tool instanceof CreatorTool){
                tool = new MagnificationCreatorToolDecorator(this.currentDocument, tool);
            } else if(tool instanceof EditLineTool){
                tool = new MagnificationEditLineDecorator(this.currentDocument, tool);
            } else if(tool instanceof PointerTool){
                tool = new MagnificationTransformerDecorator(this.currentDocument, tool);
            }
        }
        this.board.setTool(tool);
        this.board.render();
        this._notifyHandlers('changeTool', tool);
    }

    _getToolInstance(name){
        return container.resolve('toolFactory', [name, this.currentDocument]);
    }

    /**
     * @param {string} fileFormat
     * @return {Promise.<boolean>}
     * @throws {FormatNotSupportedException}
     */
    saveAs(fileFormat){
        return new Promise((resolve, reject)=>{
            /** @var {FileLoader} */
            let fileLoader = container.resolve('fileLoaderFactory', fileFormat);

            new FileNameModal((name)=>{
                this.currentDocument.fileName=name;
                fileLoader.save(this.currentDocument).then(res=>{
                    if(res){
                        this.loaded=true;
                        localStorage.setItem('loaded', true);
                        this._notifyHandlers('openNewFile', this.currentDocument);
                        resolve(true);
                    }
                });
            }, ()=>{
                resolve(false);
            }).show();
        });
    }

    /**
     * @param {File} file
     * @throws {FormatNotSupportedException}
     */
    open(file){
        if (!file) {
            return;
        }
        let format  = file.name.split('.');
        format = format[format.length-1];

        /** @var {FileLoader} */
        let fileLoader = container.resolve('fileLoaderFactory', format);

        if(!fileLoader){
            container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Only *.emsx file format supported.");
        }else{
            fileLoader.load(file).then(data=>{
                if(data){
                    this.openDocument(data);
                }
            }); //todo: check exception
        }
    }

    openDocument(document){
        if(app.loaded){
            this.currentDocument=document;
        }else{
            container.resolve('confirm', [
                () => {
                    app.saveAs('xml').then(res=>{
                        if(res){
                            this.currentDocument=document;
                        }
                    });
                }, () => {
                    this.currentDocument=document;
                    app.loaded=true;
                    localStorage.setItem('loaded', true);
                },
                "Do you want to save the drawing before create new document?"
            ]);
        }
    }

    restore(){
        /** @type {XmlFileLoader} */
        let fileloader = container.resolve('fileLoaderFactory', 'xml');
        fileloader.convertDataToDocument(localStorage.getItem('backup')).then(doc=>{
            this.currentDocument = doc;
        });
    }

    appZoomToActualSize(){
        let ppi = this.config.PPI;
        if(!ppi){
            container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Please calibrate your screen. " +
                "Draw a five-inch line and zoom so it measures the same with a ruler. Select the line. Choose Edit | Preferences | Calibrate.");
        }else{
            this.board.zoomToActualSize(ppi);
        }
    }

    screenCalibrate(){
        if(this.selectElements.length==1 && this.selectElements[0] instanceof LineElement) {
            /** @type {LineElement} */
            let line = this.selectElements[0];

            let p1 = this.board._convertToLocalCoordinateSystem(line.p1);
            let p2 = this.board._convertToLocalCoordinateSystem(line.p2);
            let pixels = Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
            let ppi = pixels/5;
            this.config.PPI = ppi;
            container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Calibration completed.");
        }else{
            container.resolve('confirmChangeArcToSplinesDialog').modalNonWorkFeature("Please select a straight line.");
        }
    }

    setTracingPaper(){
        Helper.openFile().then((file)=>{
            if (!file) {
                return;
            }

            // if(file.type.match('image.*')) {
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (evt)=> {
                    console.log(evt);
                    if (evt.target.readyState == FileReader.DONE) {
                        let img = new Image();
                        img.onload = () => {
                            this.tracingPaper = new TracingPaper(img);
                            if(this.currentDocument._elements.length>0) {
                                let ext = this.currentDocument.getExtremum();
                                this.tracingPaper.position = ext.toRect()._p1;
                            }
                            this.board.tracingPaper = this.tracingPaper;
                            this.setTool('TracingPaper');
                        };
                        img.src = evt.target.result;
                    }
                }

            // } else {
            //     alert("not an image");
            // }

        });
    }
    //<editor-fold desc="decorate methods">

    // <editor-fold desc="help functions">

        getRotateCenter(){
            let center = null;
            let transformer = null;
            let changeCenter = false;
            if(this.board.tool instanceof PointerTool){
                transformer = this.board.tool.transformer;
                changeCenter=true;
            }else if(this.board.tool instanceof MagnificationTransformerDecorator){
                transformer = this.board.tool._tool.transformer;
                changeCenter=true;
            }
            if(changeCenter){
                center = transformer.center;
            }
            return center;
        }
    // </editor-fold>

    addElement(element){
        this.executeCommand(new AddElementCommand(app.currentDocument, element, this.tracingPaper==null));
    }
    group(){
        this.executeCommand(new GroupCommand(app.currentDocument, app.selectElements));
    }

    ungroup(){
        this.executeCommand(new UngroupCommand(app.currentDocument, app.selectElements));
    }

    simplify(){
        this.executeCommand(new SimplifyCommand(app.currentDocument, app.selectElements));
    }

    /**
     * @param angle
     */
    rotateSelected(angle, center=null){
        if(!center){
            center = this.getRotateCenter();
        }
        console.log(angle, center);
        this.executeCommand(new RotateElementsCommand(app.currentDocument, app.selectElements, angle, center));
    }

    deleteSelected(){
        if(this.board){
            this._changeTool(this._getToolInstance('Pointer'));
        }
        this.executeCommand(new DeleteElementCommand(this.currentDocument, this.selectElements));
        this.clearSelectElements();
    }

    setElementsHeight(height){
        this.executeCommand(new ChangeElementsHeightCommand(app.currentDocument, app.selectElements, height));
    }

    /**
     *
     * @param {number} x
     * @param {number} y
     */
    moveSelected(x,y){
        this.executeCommand(new MoveElementsCommand(app.currentDocument, app.selectElements.slice(), x,y));
    }

    /**
     * @param {axisX|axisY} axis
     */
    mirrorSelected(axis){
        this.executeCommand(new MirrorElementsCommand(this.currentDocument, this.selectElements, axis));
    }

    /**
     * @param {LineType} lineType
     */
    setElementsLineType(lineType){
        this.executeCommand(new ChangeLineTypeCommand(app.currentDocument, app.selectElements, lineType));
    }

    /**
     * @param {number} x
     * @param {number} y
     */
    copyMoveSelected(x,y){
        this.pasteElements(this.selectElements, x, y);
    }

    /**
     * @param angle
     */
    copyRotateSelected(angle, center=null){
        if(!center){
            center = this.getRotateCenter();
        }
        let rotateCommand = new RotateElementsCommand(app.currentDocument, [], angle, center);
        let command = new CopyDecorator(app.currentDocument, app.selectElements.slice(), rotateCommand);
        this.executeCommand(command);
    }

    /**
     *
     * @param {Array.<GraphicElement>} elements
     * @param {number} x
     * @param {number} y
     * @return {Promise<boolean>}
     */
    pasteElements(elements, x, y){
        return new Promise(resolve=>{
            let moveCommand = new MoveElementsCommand(app.currentDocument, [], x, y);
            let command = new CopyDecorator(app.currentDocument, elements, moveCommand);
            this.executeCommand(command).then(res=>{
                resolve(res);
            });
        });
    }

    /**
     * @param {string} text
     * @throws {Exception} -if selected a few elements or if currently selected element isn't text element
     */
    setTextForSelectedElement(text){
        this.executeCommand(new ChangeTextCommand(app.currentDocument, this.selectElements, text));
    }

    /**
     * @param {number} fontSize
     * @throws {Exception} -if selected elements aren't only text element
     */
    setFontSizeForSelectedElement(fontSize){
        this.executeCommand(new ChangeFontSizeCommand(app.currentDocument, this.selectElements, fontSize));
    }

    changeFont(fontName){
        this.executeCommand(new ChangeFontCommand(app.currentDocument, this.selectElements, fontName));
    }

    intersectSelectedElements(){
        if(this.selectElements.length==0){
            //todo: message "For intersecting select element"
            return;
        }
        this.executeCommand(new IntersectElementsCommand(this.currentDocument, this.selectElements));
    }

    /**
     * @param {number} radius - new radius of circles is millimeters
     * @throws {Exception} - if selected not only circles
     */
    setRadiusForSelectedElements(radius){
        this.executeCommand(new ChangeArcsRadiusCommand(this.currentDocument, this.selectElements, radius));
    }

    /**
     * @param {number} length - new length of line is millimeters
     * @throws {Exception} - if selected not only single line
     */
    setLineLengthElement(length){
        this.executeCommand(new ChangeLineLengthCommand(this.currentDocument, this.selectElements, length));
    }

    /**
     *
     * @param {number} angle - new line angle
     * @throw {Exception} - if selected not only line elements
     */
    setLineAngleElement(angle){
        this.executeCommand(new ChangeLineAngleCommand(this.currentDocument, this.selectElements, angle));
    }

    /**
     *
     * @param {number} width - new width
     * @param {number} height - new height
     * @param {boolean} convertCircleToSplines - if is true all Ars will be transformation to list of splines,
     *  if is false and selected some Arc then will be throw Exception
     * @throw {Exception} - if list of resizing elements contain any Arc and flag convertCircleToSplines is false
     */
    setSelectedElementsSize(width, height, convertCircleToSplines=true){
        let extrenum = this.currentDocument.getExtrenum(this.selectElements);

        let oldWidth = extrenum.max.x- extrenum.min.x;
        let oldHeight = extrenum.max.y- extrenum.min.y;

        /** @type {Vector} */
        let vector =new (container.resolve('math')).Vector(width-oldWidth, height-oldHeight);

        let command = new ResizeElementsCommand(this.currentDocument, this.selectElements, vector
                    , ResizeElementsCommand.CONTROL_POINT_X.right, ResizeElementsCommand.CONTROL_POINT_Y.top, convertCircleToSplines);

        this.executeCommand(command);
    }

    /**
     *
     * @param {number} startAngle - the new start angle. Can be null if insideAngle isn't null
     * @param {number} insideAngle - the new inside angle. Can be null if insideAngle isn't null
     */
    setArcAngles(startAngle, insideAngle){
        this.executeCommand(new ChangeArcAngleCommand(this.currentDocument, this.selectElements, insideAngle, startAngle));
    }

    tangentsSelectedArcs(){
        this.executeCommand(new TangentsArcsCommand(this.currentDocument, this.selectElements));
    }

    divideSelectElement(countParts=2){
        this.executeCommand(new DivideElementsCommand(this.currentDocument, Document.toSimpleListElements(this.selectElements), countParts));
    }

    corner(){
        this.executeCommand(new RoundCornerCommand(this.currentDocument, this.selectElements));
    }

    priceAnalyze(){
        container.resolve('analyzer', this.currentDocument).analyze().then(res=>{
            if(!res){
                return;
            }
            let address = this.config.shippingRequisites.address;

            if(address.country.length==0 || address.zipCode.length==0){
                let win = container.resolve('zipCodeWindow', [
                        ()=>{
                            let sr = this.config.shippingRequisites;
                            let data = win.data;
                            sr.address.country=data.country;
                            sr.address.zipCode=data.zipCode;
                            this.config.shippingRequisites=sr;
                            //todo: add an intermediate layer (remove the dependence of the proposal on the React components)
                            store.dispatch({ type: "OPEN_PRICE", payload: true });
                        },
                        function(){}
                    ]
                );
                win.show();
            }else{
                //todo: add an intermediate layer (remove the dependence of the proposal on the React components)
                store.dispatch({ type: "OPEN_PRICE", payload: true });
            }
        });
    }

    print(){
        let board = new DocumentRendererBoard();
        board.setSize(1000,800);
        board.document = this.currentDocument.getSnapshot();
        for(let el of board.document._elements){
            el._renderer.resetConfig();
            el.generateNewId();
        }
        board.zoomToFitScreen();

        var dataUrl = board.canvas.toDataURL(); //attempt to save base64 string to server using this var

        let windowContent = '<!DOCTYPE html>';
        windowContent += '<html>';
        windowContent += '<head><title>'+this.currentDocument.fileName+" eMachineShop"+'</title></head>';
        windowContent += '<body>';
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '</body>';
        windowContent += '</html>';

        const printWin = window.open('', '', 'width=' + screen.availWidth/2 + ',height=' + screen.availHeight/1.5);
        printWin.document.open();
        printWin.document.write(windowContent);

        printWin.document.addEventListener('load', function() {
            printWin.focus();
            printWin.print();
            printWin.document.close();
            printWin.close();
        }, true);
    }

    /**
     * @param {number} radius
     */
    changeBendRadius(radius){
        this.executeCommand(new ChangeBendRadiusCommand(this.currentDocument, radius));
    }

    //</editor-fold>
}