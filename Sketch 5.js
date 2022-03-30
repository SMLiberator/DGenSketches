let gravity = 1;
let bounce = 0.99;
let airDrag = 0.02;
let surfDrag = 0.01;

let things = [];
let ballCount = 8;
let ballSizeMulti = 1;

let clickOffX = 0;
let clickOffY = 0;
let isDrag = -1;

// object flags:
// 0x1	object is being dragged

class Ball
{
	constructor(size, color, posX, posY)
	{
		this.size = size*ballSizeMulti;
		this.color = color;
		
		this.flags = 0x0;
		this.posX = posX;
		this.posY = posY;
		this.velX = 0;
		this.velY = 0;
		return 1;
	}
	draw()
	{
		strokeWeight(1); stroke(0); fill(this.color);
		circle(this.posX, this.posY, this.size);
		return 1;
	}
	physics()
	{
		if(this.flags & 0x1)
		{
			// speed equals last position - new position
			this.velX = (mouseX-clickOffX)-this.posX;
			this.velY = (mouseY-clickOffY)-this.posY;

			// new position equals that of the cursor minus the offset from where we clicked
			this.posX = mouseX-clickOffX;
			this.posY = mouseY-clickOffY;
		}
		else
		{
			// update speed and position
			this.velX = this.velX*(1-airDrag);
			this.velY = this.velY*(1-airDrag)+gravity;
			this.posX = this.posX +this.velX;
			this.posY = this.posY +this.velY;
		}
		
		// test collisions
		if(this.posX-(this.size*0.5) < 0)
		{
			// play hit sound relative to speed at moment of impact
			this.posX = this.size*0.5;									// force rectangle position to screen
			this.velX = -this.velX*bounce;		// change speed perpendicular to direction of hit - bounce
			this.velY = this.velY*(1-surfDrag);			// reduce speed parallel to direction of hit - friction
		}
		if(this.posX+(this.size*0.5) > windowWidth)
		{
			// play hit sound relative to speed at moment of impact
			this.posX = windowWidth-(this.size*0.5);		// force rectangle position to screen
			this.velX = -this.velX*bounce;		// change speed perpendicular to direction of hit - bounce
			this.velY = this.velY*(1-surfDrag);			// reduce speed parallel to direction of hit - friction
		}
		if(this.posY-(this.size*0.5) < 0)
		{
			// play hit sound relative to speed at moment of impact
			this.posY = this.size*0.5;									// force rectangle position to screen
			this.velY = -this.velY*bounce;		// change speed perpendicular to direction of hit - bounce
			this.velX = this.velX*(1-surfDrag);			// reduce speed parallel to direction of hit - friction
		}
		if(this.posY+(this.size*0.5) > windowHeight)
		{
			// play hit sound relative to speed at moment of impact
			this.posY = windowHeight-(this.size*0.5);		// force rectangle position to screen
			this.velY = -this.velY*bounce;		// change speed perpendicular to direction of hit - bounce
			this.velX = this.velX*(1-surfDrag);			// reduce speed parallel to direction of hit - friction
		}
		return 1;
	}
	setFlags(flags)
	{
		this.flags = this.flags|flags;
		return this.flags;
	}
	clearFlags(flags)
	{
		this.flags = this.flags^(this.flags&flags);
		return this.flags;
	}
	getFlags()
	{
		return this.flags;
	}
	setSize(size)
	{
		let retVal = this.size;
		this.size = size;
		return retVal;
	}
	getSize()
	{
		return this.size;
	}
	setColor(color)
	{
		let retVal = this.color;
		this.color = color;
		return retVal;
	}
	getColor()
	{
		return this.color;
	}
	setVelX(velX)
	{
		let retVal = this.velX;
		this.velX = velX;
		return retVal;
	}
	setVelY(velY)
	{
		let retVal = this.velY;
		this.velY = velY;
		return retVal;
	}
	addVelX(velX)
	{
		this.velX = this.velX+velX;
		return this.velX;
	}
	addVelY(velY)
	{
		this.velY = this.velY+velY;
		return this.velY;
	}
	getVelX()
	{
		return this.velX;
	}
	getVelY()
	{
		return this.velY;
	}
	setPosX(velX)
	{
		let retVal = this.posX;
		this.posX = posX;
		return retVal;
	}
	setPosY(velY)
	{
		let retVal = this.posY;
		this.posY = posY;
		return retVal;
	}
	getPosX()
	{
		return this.posX;
	}
	getPosY()
	{
		return this.posY;
	}
}

function setup()
{
	for(let i=0; i<ballCount; i++)
		things[i] = new Ball(40+random(40), random(255), random(windowWidth), random(windowHeight));
	
	createCanvas(windowWidth, windowHeight);
	background(100, 160, 255);
}

function draw()
{
	background(100, 160, 255, 160);
	for(let i=0; i<things.length; i++)
	{
		things[i].physics();
		things[i].draw();
	}
}

function mousePressed()
{
	isDrag = -1;
	// click detection - if we're clicking an object, drag it around
	for(let i=0; i<things.length && isDrag < 0; i++)
	{
		if(pow(mouseX-things[i].getPosX(), 2)+pow(mouseY-things[i].getPosY(), 2) < pow(things[i].getSize()*0.5, 2))
		{
			// we should keep track of where exactly we're clicking the object
			clickOffX = mouseX-things[i].getPosX();
			clickOffY = mouseY-things[i].getPosY();
			things[i].setFlags(0x1);
			isDrag = i;
		}
	}
}

function mouseReleased()
{
	// we're releasing the mouse - no longer dragging any objects.
	if(isDrag >= 0) things[isDrag].clearFlags(0x1);
	isDrag = -1;
}
