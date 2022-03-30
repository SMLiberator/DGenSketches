let	isDrag = 0;
let	cursorX = 0;
let	cursorY = 0;

const	cutX = 6;
const	cutY = 3;
const	cutZ = 8;

function setup()
{
	createCanvas(windowWidth, windowHeight);
	frameRate(60);
}

function draw()
{
	const windowX = windowWidth/cutX;
	const windowY = windowHeight/cutY;

	background(100);
	ellipseMode(CENTER);
	noStroke();
	
	if(isDrag)
	{
		cursorX = mouseX;
		cursorY = mouseY;
	}

	for(i=0; i<cutX; i=i+1) for(j=0; j<cutY; j=j+1) for(k=0; k<cutZ; k=k+1)
	{
		if(!k || k == cutZ*.5)
		{
			fill(color(255, 128*isDrag, 128*isDrag));
			ellipse((cursorX+k*(windowX/cutZ))%windowX + windowX*i, (cursorY+k*(windowY/cutZ))%windowY + windowY*j, 15, 15);
		}
		else
		{
			fill(color(255, 255, 255));
			ellipse((cursorX-k*(windowX/cutZ))%windowX + windowX*i, (cursorY+k*(windowY/cutZ))%windowY + windowY*j, 10, 10);
			ellipse((cursorX+k*(windowX/cutZ))%windowX + windowX*i, (cursorY+k*(windowY/cutZ))%windowY + windowY*j, 10, 10);
		}
	}
}

function mousePressed()
{
	isDrag = 1;
}

function mouseReleased()
{
	isDrag = 0;
}
