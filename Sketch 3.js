// Rectangle size
let rectSizeX = 60;
let rectSizeY = 30;

// Rectangle physics
let bounceFactor = 0.2;
let airDrag = 0.03;
let surfDrag = 0.08;
let gravity = 1;

// Internal variables
let rectPosX = 0;
let rectPosY = 0;
let isDrag = 0;
let rectSpeedX = 0;
let rectSpeedY = 0;
let clickOffX = 0;
let clickOffY = 0;

function setup()
{
	createCanvas(windowWidth, windowHeight);
	frameRate(60);
	
	rectPosX = windowWidth*0.5;
	rectPosY = windowHeight*0.5;
}

function draw()
{
	background(100);
	
	// if we're dragging the rectangle, it's position and speed should be based on the mouse cursor's
	if(isDrag)
	{
		// speed equals last position - new position
		rectSpeedX = (mouseX-clickOffX)-rectPosX;
		rectSpeedY = (mouseY-clickOffY)-rectPosY;
		
		// new position equals that of the cursor minus the offset from where we clicked
		rectPosX = mouseX-clickOffX;
		rectPosY = mouseY-clickOffY;
	}
	else // otherwise, it's based on physics alone
	{
		// new speed equals last speed, reduced by air friction, plus gravity.
		rectSpeedX = rectSpeedX*(1-airDrag);
		rectSpeedY = rectSpeedY*(1-airDrag)+gravity;
		
		// new position equals last position plus its speed in each direction
		rectPosX = rectPosX +rectSpeedX;
		rectPosY = rectPosY +rectSpeedY;
	}
	
	// collision detection - if rectangle edges go beyond screen space we have a collision
	if(rectPosX-(rectSizeX*0.5) < 0)
	{
		// play hit sound relative to speed at moment of impact
		rectPosX = rectSizeX*0.5;									// force rectangle position to screen
		rectSpeedX = -rectSpeedX*bounceFactor;		// change speed perpendicular to direction of hit - bounce
		rectSpeedY = rectSpeedY*(1-surfDrag);			// reduce speed parallel to direction of hit - friction
	}
	if(rectPosX+(rectSizeX*0.5) > windowWidth)
	{
		// play hit sound relative to speed at moment of impact
		rectPosX = windowWidth-(rectSizeX*0.5);		// force rectangle position to screen
		rectSpeedX = -rectSpeedX*bounceFactor;		// change speed perpendicular to direction of hit - bounce
		rectSpeedY = rectSpeedY*(1-surfDrag);			// reduce speed parallel to direction of hit - friction
	}
	if(rectPosY-(rectSizeY*0.5) < 0)
	{
		// play hit sound relative to speed at moment of impact
		rectPosY = rectSizeY*0.5;									// force rectangle position to screen
		rectSpeedY = -rectSpeedY*bounceFactor;		// change speed perpendicular to direction of hit - bounce
		rectSpeedX = rectSpeedX*(1-surfDrag);			// reduce speed parallel to direction of hit - friction
	}
	if(rectPosY+(rectSizeY*0.5) > windowHeight)
	{
		// play hit sound relative to speed at moment of impact
		rectPosY = windowHeight-(rectSizeY*0.5);		// force rectangle position to screen
		rectSpeedY = -rectSpeedY*bounceFactor;		// change speed perpendicular to direction of hit - bounce
		rectSpeedX = rectSpeedX*(1-surfDrag);			// reduce speed parallel to direction of hit - friction
	}

	rectMode(CENTER);
	rect(rectPosX, rectPosY, rectSizeX, rectSizeY);		// draw rectangle based on new coordinates
}

function mousePressed()
{
	// click detection - if we're clicking inside the rectangle, drag it around
	if((mouseX > rectPosX-(rectSizeX*0.5) && mouseX < rectPosX+(rectSizeX*0.5)) && (mouseY > rectPosY-(rectSizeY*0.5) && mouseY < rectPosY+(rectSizeY*0.5)))
	{
		// we should keep track of where exactly we're clicking inside the rectangle
		clickOffX = mouseX-rectPosX;
		clickOffY = mouseY-rectPosY;
		isDrag = 1;
	}
}

function mouseReleased()
{
	// we're releasing the mouse - no longer dragging the rectangle.
	isDrag = 0;
}
