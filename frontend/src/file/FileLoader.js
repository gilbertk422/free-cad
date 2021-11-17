/**
 * Copyright (c) 2019 Micro Logic Corp.
 */
import FileSaver from 'file-saver';
import GroupShapesHandler from "../model/handlers/GroupShapes";

export default class FileLoader {
    constructor() {
        this.fileSuffix = '.emsx';
    }

    /**
     * @param {File} file
     * @return {Promise}  - "then" has data, the data is {@class Document} object or false if no need to save
     */
    load(file){
        //todo: check if file isn't .emsx file
        return new Promise((resolve, reject)=>{
            if (!file) {
                reject('File is required parameter!');
            }
            var reader = new FileReader();
            reader.onload = (e)=> {
                var contents = e.target.result;
                if(this.validate(contents)) {
                    this.convertDataToDocument(contents).then(doc=>{
                        doc.fileName = file.name;
                        resolve(doc);
                    }); //todo: catch
                }
            };
            this.initRead(reader, file);
        });
    }

    /**
     * The method is necessary to choose the right type of reader.
     * In implementation the method must call reader.readAs...(file) function.
     * for example <code> reader.readAsText(file); </code> for reading text file.
     * @see{@link https://www.w3.org/TR/file-upload/#reading-a-file}
     * @param {FileReader} reader
     * @param {File} file
     */
    initRead(reader, file){
        throw new Exception('The method doesn\'t have implementation');
    }

    /**
     * @param {*} data - The format of the data depends on the format of the data when saving and reading the file.
     * @return {bool} - true if data is valid
     * @throws {InvalidDataFormatException}
     */
    validate(data){
        throw new Exception('The method doesn\'t have implementation');
    }


    /**
     * @param {*} data - The format of the data depends on the format of the data when saving and reading the file.
     * @return {Promise}  - "then" has data, the data is {@class Document} object or false if no need to save
     */
    convertDataToDocument(data){
        throw new Exception('The method doesn\'t have implementation');
    }

    /**
     * @param {Document} document
     * @return {Promise}
     */
    save(document) {
        gtag('event', 'Save', {
            'event_category': 'Web CAD'
        });
        return new Promise((resolve, reject)=>{
            this.getBlobData(document).then(data=>{
                if(this.validate(data)) {
                    let filename = document.fileName;
                    if(!document.fileName.toLowerCase().endsWith(this.fileSuffix.toLowerCase())){
                        filename+=this.fileSuffix;
                        document.fileName+=this.fileSuffix;
                    }
                    FileSaver.saveAs(data, filename);
                    resolve(true);
                }else{
                    resolve(false)
                }
            }).catch(function(error){
                reject(error);
            });
        });
    }

    /**
     * @param {Document} document
     * @return {Promise} - "then" has data, the data is {@class Blob} object or false if no need to save
     */
    getBlobData(document){
        throw new Exception('The method doesn\'t have implementation');
    }

}