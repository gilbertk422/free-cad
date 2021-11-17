

export default class Utils{

    /**
     * @param bendLine
     * @return {number} 0|180
     */
    static getVectorCoefficient(bendLine, shapeCenter){
        let center = bendLine._line.perpendicularPoint(shapeCenter);

        /** @type {Line} */
        let line = new (container.resolve('math')).Line(center, shapeCenter);

        let normal = line.toVector();
        let normalAngle = new (container.resolve('math')).Vector(1).getAngle(normal);

        let rotateCoefficient = 0;

        if(bendLine.p1.x<bendLine.p2.x){
            if(bendLine.p1.y>bendLine.p2.y){
                if(normalAngle>=0 && normalAngle<=90){
                    console.info("case 2");
                    rotateCoefficient=180;
                }else{
                    console.info("case 6");
                }
            }else if(bendLine.p1.y<bendLine.p2.y){
                if(normalAngle<=180 && normalAngle >=90){
                    console.info("case 1");
                    rotateCoefficient=180;
                }else{
                    console.info("case 5");
                }
            }else{
                if(Helper.Math.equals(normalAngle, 90)){
                    console.info("case 10");
                    rotateCoefficient=180;
                }else{
                    console.info("case 13");
                }
            }
        }else if(bendLine.p1.x>bendLine.p2.x){
            if(bendLine.p1.y>bendLine.p2.y){
                if(normalAngle>=90 && normalAngle <=180){
                    console.info("case 7");
                }else{
                    console.info("case 3");
                    rotateCoefficient=180;
                }
            }else if(bendLine.p1.y<bendLine.p2.y){
                if(normalAngle>=0 && normalAngle <=90){
                    console.info("case 8");
                }else{
                    console.info("case 4");
                    rotateCoefficient=180;
                }
            }else{
                if(Helper.Math.equals(normalAngle, 90)){
                    console.info("case 15");
                }else{
                    console.info("case 12");
                    rotateCoefficient=180;
                }
            }
        }else {
            if(bendLine.p1.y>bendLine.p2.y){
                if(Helper.Math.equals(normalAngle, 180)){
                    console.info("case 14");
                }else{
                    rotateCoefficient=180;
                    console.info("case 11");
                }
            }else {
                if(Helper.Math.equals(normalAngle, 180)){
                    console.info("case 9");
                    rotateCoefficient=180;
                }else{
                    console.info("case 16");
                }
            }
        }

        return rotateCoefficient;
    }

}