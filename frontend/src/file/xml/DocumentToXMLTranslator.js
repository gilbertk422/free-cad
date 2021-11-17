import ShapeBuilder from "../../analyzer/ShapeBuilder";
import GraphicElement from "../../model/GraphicElement";
import Comment from "../../model/line_types/Comment";
import CommentsToMachinist from "../../model/line_types/CommentToMachine";
import ShapeTree from '../../model/elements/shape/ShapeTree'


export default class DocumentToXMLTranslator{

    constructor(document){
        this.document = document;
    }

    getXml(){
        let figures = [];
        let shapes = new ShapeBuilder(this.document).buildShapes();
        /** @type {Array.<ShapeTree>} */
        let shapeTrees = ShapeTree.buildTrees(shapes);
        for(let tree of shapeTrees){
            tree.calculate();
        }

        let savedElements = [];

        for(let shape of shapes){
            let height = 0;
            try {
                height = shape.height;
            }catch (e) {
                continue;
            }
            savedElements.push(...shape.elements);
            savedElements.push(...shape.bends);
            figures.push(this._createRegionByElements(shape.elements, height, shape.baseZ));
            if(shape.bends.length>0) {
                for(let bend of shape.bends) {
                    figures.push(this._createRegionByElements([bend], height, shape.baseZ));
                }
            }
        }

        let elements = this.document.getListSimpleElements().filter(el=>{
            for(let done of savedElements){
                if(done.compare(el)){
                    return false;
                }
            }
            return true;
        });
        for(let i=0; i<elements.length; i++){
            figures.push(
                '\t\t<Region BaseHeight="0" Z="'+(elements[i].height==GraphicElement.AirInside?"AirInside":elements[i].height)+'">\n'+
                '\t\t\t'+this._createMachineByLineType(elements[i].lineType)+'\n');


            let processing=this._convertElementToXmlProcessing(elements[i]);

            if(processing!=''){
                figures.push(
                    `\t\t\t<Processing>\n`+
                        processing+
                    `\t\t\t</Processing>\n`);
            }

            figures.push(
                    '\t\t\t<Contour>\n' +
                    this._convertElementToXml(elements[i]) +
                    '\t\t\t</Contour>\n' +
                    '\t\t</Region>');
        }

        let regions = figures.join("\n");

        let finishXml = "";
        /** @type {Finish} */
        let finish = container.resolve('config').finishes;
        if(finish){
            finishXml=`\t<Finishing>\n`;
            finishXml+=`\t\t<Method ID="${finish.id}" Name="${finish.name.replace('"', "&quot;")}" StandardColor="${finish.standardColor}" ${finish.specialColor?"SpecialColor=\""+finish.specialColor.value+"\"":""} />\n`;
            finishXml+=`\t</Finishing>\n`;
        }

        return '<?xml version="1.0"?>\n<eMachineShop3DObjects VersionId="1.1">\n\t<View Type="Top">\n'+regions+
            '\n\t</View>\n\t<QuantityOfParts Value="'+container.resolve('config').quantity+'"/>\n'+finishXml+'</eMachineShop3DObjects>';
    }

    _createRegionByElements(elements, height, baseZ=0){
        let region = `\t\t<Region BaseHeight="${baseZ}" Z="${height==GraphicElement.AirInside?'AirInside':height}">\n`;
        region+=`\t\t\t`+this._createMachineByLineType(elements[0].lineType)+`\n`;
        let processing = "";
        for(let el of elements){
            processing+=this._convertElementToXmlProcessing(el);
        }
        if(processing.length>0){
            region+=`\t\t\t<Processing>\n`;
            region+=processing;
            region+=`\t\t\t</Processing>\n`;
        }

        let contour = "";
        for(let el of elements){
            let xmlElement = this._convertElementToXml(el);
            contour+=xmlElement;
        }
        if(contour.length>0){
            region+=`\t\t\t<Contour>\n`;
            region+=contour;
            region+=`\t\t\t</Contour>\n`;
        }
        region+=`\t\t</Region>`;
        return region;
    }


    _convertElementToXmlProcessing(el){
        switch (el.typeName){
            case 'Line':
                if(el.lineType.name== 'Bend'){
                    return `\t\t\t\t<Bend Angle="${el.lineType.processing[0].angle}" Radius="${el.lineType.processing[0].radius}"/>\n`;
                }
            case 'Arc':
                if(el.lineType.name=="Thread"){
                    /**@type {Thread}*/
                    let p = el.lineType.processing[0];

                    let params =p.size;
                    if(p.type=="UN"){
                        params+=" (UNF)";
                    }

                    return `\t\t\t\t<Thread Parameters="${params}" Length="Maximal" Type="${p.type}"/>\n`;
                }
            default:
                return '';
        }
    }

    _convertElementToXml(el){
        switch (el.typeName){
            case 'Line':
                return `\t\t\t\t<Straight P1="${el.p1.x},${el.p1.y}" P2="${el.p2.x},${el.p2.y}"/>\n`;
            case 'Arc':
                if(el.startAngle==0 && el.endAngle==0) {
                    return `\t\t\t\t<Circle Center="${el._center.x},${el._center.y}" Radius="${el.radius}"/>\n`;
                }else {
                    return `\t\t\t\t<Arc Center="${el._center.x},${el._center.y}" Radius="${el.radius}" StartAngle="${el.startAngle}" IncAngle="${el.incrementAngle}"/>\n`;
                }
            case 'Spline':
                return `\t\t\t\t<Spline P1="${el._points[0].x},${el._points[0].y}" P2="${el._points[2].x},${el._points[2].y}" P3="${el._points[3].x},${el._points[3].y}" P4="${el._points[1].x},${el._points[1].y}"/>\n`;
            case 'Text':
                let fontName= "";
                if(el.lineType.name=="Auto"){
                    fontName = el.font.name;
                }
                return `\t\t\t\t<Text Position="${el.position.x},${el.position.y}" Height="${el.fontSize}" FontName="${fontName}" HFlip="0" VFlip="0" Angle="${el.angle}">${el.text}</Text>\n`;
            default:
                return "";
        }
        return "";
    }

    /**
     * @param {LineType} lineType
     * @return {string}
     * @private
     */
    _createMachineByLineType(lineType){
        if(lineType instanceof Comment){
            let CTM=0;
            if(lineType instanceof CommentsToMachinist){
                CTM=1;
            }
            return `<Machine Id="${lineType.id}" Name="${lineType.name}" CTM="${CTM}" LineType="${lineType.type}"/>`;
        }
        let name = lineType.name;
        if(lineType.name=="Thread"){
            name="Auto";
        }
        return `<Machine Id="${lineType.id}" Name="${name}"/>`;
    }

}