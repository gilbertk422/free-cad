import Renderable from "../ui/2d/Renderable";

export default class TracingPaper extends Renderable{

    /**
     * @param {Image} image
     */
    constructor(image){
        super();

        this.image=image;

        this.position = new(container.resolve('math').Point)();

        this.width = this.image.width/3.5;

        this.height = this.image.height/3.5;
    }

    /**
     * The method renders some data structure using an instance of the {@class Board} class.
     * @param {Board} board
     * @abstract
     */
    render(board){
        board.drawImage(this.image, this.position, this.width, this.height, 0.5);
    }

    /**
     * @returns {Extremum}
     */
    getExtremum(){
        return new (container.resolve('math')).Extremum(this.position.x, this.position.y-this.height, this.position.x+this.width, this.position.y);
    }
}