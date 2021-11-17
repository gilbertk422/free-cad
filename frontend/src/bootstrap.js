import MobileDetect from 'mobile-detect';


/**
 * Created by dev on 26.02.19.
 * Copyright (c) 2019 Micro Logic Corp.
 */

import Exception from './Exception'
import Config from './Config'
import AppBoard from './ui/2d/AppBoard'
import IdGenerator from './model/IdGenerator'
import ConfirmChangeArcToSplinesDialog from './ModalWindows'
import Application from './Application'
import LineTool from './ui/2d/tool/creator/LineTool'
import RectTool from './ui/2d/tool/creator/RectTool'
import CircleTool from './ui/2d/tool/creator/CircleTool'
import SplineTool from './ui/2d/tool/creator/SplineTool'
import ZoomTool from './ui/2d/tool/ZoomTool'
import EraserTool from './ui/2d/tool/EraserTool'
import TracingPaperTool from "./ui/2d/tool/TracingPaper";
// import FreehandTool from "./ui/2d/tool/creator/FreehandTool";
import RulerTool from './ui/2d/tool/creator/RulerTool'
import TextTool from './ui/2d/tool/creator/TextTool'
import EditLineTool from './ui/2d/tool/EditLineTool'
import PointerTool from './ui/2d/tool/PointerTool'
import PngFileLoader from './file/PngFileLoader'
import XmlFileLoader from './file/XmlFileLoader'
import FormatNotSupportedException from './file/FormatNotSupportedException'

import ErrorModelAnalyzer from './analyzer/analyzers/ErrorModelAnalyzer'

import ExpertNoticeUi from './ui/modal/ExpertNotice'
import CornerWindow from './ui/modal/Corner'
import DivideWindow from './ui/modal/Divide'
import Confirmation from './ui/modal/Confirmation'
import Tips from './ui/React/Tips'
import LocalStorageBuffer from './Buffer/LocalStorageBuffer'
import ThreeDView from './ui/modal/3DView'
import ProgressBarImpl from './ui/React/contractImplementations/ProgressBarImpl'
import AutoLineType from './model/line_types/Auto'
import CommentToSelfLineType from './model/line_types/CommentToSelf'
import TextRenderer from './ui/2d/renderer/TextRenderer'
import SplineRenderer from './ui/2d/renderer/SplineRenderer'
import LineRenderer from './ui/2d/renderer/LineRenderer'
import GroupRenderer from './ui/2d/renderer/GroupRenderer'
import ArcRenderer from './ui/2d/renderer/ArcRenderer'
import ZipCode from './ui/modal/ZipCode'
import DragTool from './ui/2d/tool/DragTool'
import FontManager from "./model/elements/text/FontManager";
import SimplifyWindow from "./ui/modal/Simplify";


console.log('Start bootstrap')

/**
 * @param {string} name
 * @param {Document} doc
 */
const toolFactoryMethod = (name, doc) => {
    switch (name) {
        case 'Drag':
            return new DragTool(doc)
        case 'Line':
            return new LineTool(doc)
        case 'Rectangle':
            return new RectTool(doc)
        case 'Circle':
            return new CircleTool(doc)
        case 'Spline':
            return new SplineTool(doc)
        case 'Zoom':
            return new ZoomTool(doc)
        case 'Eraser':
            return new EraserTool(doc)
        // case 'Freehand':
        //     return new FreehandTool(doc);
        case 'Ruler':
            return new RulerTool(doc)
        case 'Text':
            return new TextTool(doc)
        case 'EditLine':
            return new EditLineTool(doc)
        case 'TracingPaper':
            return  new TracingPaperTool(doc, container.resolve('app').tracingPaper);
        default:
            return new PointerTool(doc)
    }
}

/**
 * @param {string} formatName - without point
 * @return {FileLoader}
 * @throws FormatNotSupportedException
 */
const fileLoaderFactoryMethod = (formatName) => {
    let fileLoader
    switch (formatName.toLowerCase()) {
        case 'png':
            fileLoader = new PngFileLoader()
            break
        case 'xml':
        case 'emsx':
            fileLoader = new XmlFileLoader()
            break
        default:
            return null
    }
    return fileLoader
}

const lineTypeFactoryMethod = (config, element, createWithTool = false) => {

    let lt = config.lineType.copy()

    if (!createWithTool) {
        return new AutoLineType()
    }
    switch (element.typeName) {
        case 'Group':
            if (lt.name == 'Bend' || lt.name == 'Thread') {
                return new AutoLineType()
            }
            break
        case 'Arc':
            if (lt.name == 'Bend') {
                return new AutoLineType()
            }
            break
        case 'Text':
            return new CommentToSelfLineType()
    }
    return lt
}

const rendererFactoryMethod = (element) => {
    switch (element.typeName) {
        case 'Text':
            return new TextRenderer(element)
        case 'Spline':
            return new SplineRenderer(element)
        case 'Line':
            return new LineRenderer(element)
        case 'Group':
            return new GroupRenderer(element)
        case 'Arc':
            return new ArcRenderer(element)
    }

    throw new Exception('Renderer for this parameters is undefined!', [element])
}
container.register('config', Config).singleton()
container.registerObject('mobileDetector', new MobileDetect(window.navigator.userAgent)).singleton()
// container.registerObject('mobileDetector', { mobile: () => null }).singleton()
container.register('mainBoard', AppBoard).singleton()
container.register('elementIdGenerator', IdGenerator).singleton()
container.register('commandIdGenerator', IdGenerator).singleton()
container.register('confirmChangeArcToSplinesDialog', ConfirmChangeArcToSplinesDialog).singleton()
container.register('app', Application).dependencies('config', 'mainBoard').singleton()
container.register('buffer', LocalStorageBuffer).dependencies('app').singleton()
container.register('3dView', ThreeDView).dependencies('mainBoard', 'app')
container.register('tips', Tips).singleton()
container.register('progressBar', ProgressBarImpl).singleton()
container.registerFactory('toolFactory', toolFactoryMethod)
container.registerFactory('fileLoaderFactory', fileLoaderFactoryMethod)

container.registerFactory('rendererFactory', rendererFactoryMethod)
container.registerFactory('lineTypeFactory', lineTypeFactoryMethod).dependencies('config')
container.register('cornerWindow', CornerWindow)
container.register('divideWindow', DivideWindow)
container.register('simplifyWindow', SimplifyWindow)
container.register('zipCodeWindow', ZipCode)
container.register('expertNotice', ExpertNoticeUi)
container.register('fontManager', FontManager).singleton();

container.register('confirm', Confirmation)
container.register('analyzer', ErrorModelAnalyzer)

container.validateDependencies()

if (ENV != 'test') {
    global.app = container.resolve('app')
}
if(ENV == 'production'){
    container.resolve('config').copymode=false;
}

