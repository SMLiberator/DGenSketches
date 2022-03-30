// Rectangle size
let rectSizeX = 60;
let rectSizeY = 30;

// Rectangle physics
let bounceFactor = 0.2;
let airDrag = 0.03;
let surfDrag = 0.1;
let gravity = 1;

let isUnderwater = 0;
let waterHardness = 0.1;
let waterDrag = 0.12;
let buoyancy = 2;

// Internal variables
let rectPosX = 0.5;
let rectPosY = 0.5;
let isDrag = 0;
let rectSpeedX = 0;
let rectSpeedY = 0;
let clickOffX = 0;
let clickOffY = 0;
let waterOffset = 0.7;

function setup()
{
	createCanvas(windowWidth, windowHeight);
	frameRate(60);
	
	rectPosX = windowWidth*rectPosX;
	rectPosY = windowHeight*rectPosY;
	waterOffset = windowHeight*waterOffset;
}

function draw()
{
	// create a sky-colored background but slightly transparent to simulate motion trails
	background(100, 160, 255, 160);
	
	// if we're dragging the rectangle, it's position and speed should be based on the mouse cursor's
	if(isDrag)
	{
		if(rectPosY+(rectSizeY*0.5) > waterOffset) isUnderWater = 1;
		else isUnderWater = 0;
			
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
		if(rectPosY+(rectSizeY*0.5) <= waterOffset)
		{
			rectSpeedX = rectSpeedX*(1-airDrag);
			rectSpeedY = rectSpeedY*(1-airDrag)+gravity;
			isUnderWater = 0;
		}
		else
		// we're inside water - add buoyancy and liquid friction
		{
			rectSpeedX = rectSpeedX*(1-waterDrag);
			if(!isUnderWater)
			{
				// lose speed due to impact with water, play splash sound
				rectSpeedY = rectSpeedY*(1-waterHardness);
			}
			rectSpeedY = rectSpeedY*(1-waterDrag)+gravity-buoyancy;
			isUnderWater = 1;
		}
		
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

	// draw rectangle based on new coordinates
	rectMode(CENTER);
	strokeWeight(1); stroke(0); fill(255);
	rect(rectPosX, rectPosY, rectSizeX, rectSizeY);
	
	// draw water
	rectMode(CORNER);
	strokeWeight(4); stroke(0, 0, 255); fill(60, 100, 255, 128);
	rect(0, waterOffset, windowWidth, windowHeight-waterOffset);
	
	// draw bubbles
	//strokeWeight(1);
	//if(isUnderWater) circle(rectPosX-(rectSizeX*0.5)+random()*rectSizeX, rectPosY-(rectSizeY*0.5)+random()*rectSizeY, 3+random()*7);
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
