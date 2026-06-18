type Shape = {
    type: 'rect',
    x: number,
    y: number,
    width: number,
    height: number
} |
{
    type: 'circle',
    centerX: number,
    centerY: number,
    radius: number
}


export default function initDraw(canvas: HTMLCanvasElement) {
    
 
    const ctx = canvas.getContext('2d');
            
    let existingShape: Shape[] = []
            

            
            if (!ctx) {
                return;
            }
            
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let clicked = false;
            let startX = 0;
            let startY = 0;

            canvas.addEventListener('mousedown', (e) => {  
                clicked = true;
                startX = e.clientX;
                startY = e.clientY;
            } )

            canvas.addEventListener('mouseup', (e) => {  
                clicked = false;
                const width = e.clientX - startX;
                const height = e.clientY - startY;
                existingShape.push({
                    type: 'rect',
                    x: startX,
                    y: startY,
                    width: width,
                    height: height
                })
            } )
            
            canvas.addEventListener('mousemove', (e) => {  
                if (clicked) {
                    const width = e.clientX - startX;
                    const height = e.clientY - startY;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    clearCanvas(existingShape, ctx, canvas);
                    ctx.strokeStyle = 'rgb(255, 255, 255)';
                    ctx.strokeRect(startX, startY, width, height);
                }
            } )

        }
    

function clearCanvas(existingShape: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    existingShape.forEach(shape => {
        if (shape.type === 'rect') {
            ctx.strokeStyle = 'rgb(255, 255, 255)';
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } 
}  )     
}
    

 
 
 