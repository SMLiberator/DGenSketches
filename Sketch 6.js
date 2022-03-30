let gravity = 0;
let bounce = 0.99;
let airDrag = 0.02;
let surfDrag = 0.01;

let things = [];
let ballDensity = 8;
let ballSizeMulti = 1;

let starDensity = 128;
let starSizeMulti = 1;
let starSpeedMulti = 0.3;

let clickOffX = 0;
let clickOffY = 0;
let holdTime = 0;
let isDrag = -1;

// object flags:
// 0x1	object is being dragged

class Star
{
	constructor(size, color, posX, posY, velX)
	{
		this.size = size*starSizeMulti;
		this.color = color;
		this.velX = velX*starSpeedMulti;
		this.posX = posX;
		this.posY = posY;
		return 1;
	}
	draw()
	{
		noStroke(0); fill(this.color);
		circle(this.posX, this.posY, this.size);
		return 1;
	}
	physics()
	{
		this.posX = this.posX +this.velX;
		if(this.posX-(this.size*0.5) > windowWidth) return 0;
		else return 1;
	}
}

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
			this.posX = this.size*0.5;			// force object position to screen
			this.velX = -this.velX*bounce;			// change speed perpendicular to direction of hit - bounce
			this.velY = this.velY*(1-surfDrag);		// reduce speed parallel to direction of hit - friction
		}
		if(this.posX+(this.size*0.5) > windowWidth)
		{
			// play hit sound relative to speed at moment of impact
			this.posX = windowWidth-(this.size*0.5);	// force object position to screen
			this.velX = -this.velX*bounce;			// change speed perpendicular to direction of hit - bounce
			this.velY = this.velY*(1-surfDrag);		// reduce speed parallel to direction of hit - friction
		}
		if(this.posY-(this.size*0.5) < 0)
		{
			// play hit sound relative to speed at moment of impact
			this.posY = this.size*0.5;			// force object position to screen
			this.velY = -this.velY*bounce;			// change speed perpendicular to direction of hit - bounce
			this.velX = this.velX*(1-surfDrag);		// reduce speed parallel to direction of hit - friction
		}
		if(this.posY+(this.size*0.5) > windowHeight)
		{
			// play hit sound relative to speed at moment of impact
			this.posY = windowHeight-(this.size*0.5);	// force object position to screen
			this.velY = -this.velY*bounce;			// change speed perpendicular to direction of hit - bounce
			this.velX = this.velX*(1-surfDrag);		// reduce speed parallel to direction of hit - friction
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
	for(let i=0; i<starDensity; i++)
		things[i] = new Star(1+random(2), color(128+random(128), 128+random(128), 128+random(128)), random(windowWidth), random(windowHeight), 1+random(2));

	for(let i=starDensity; i<starDensity+ballDensity; i++)
		things[i] = new Ball(30+random(30), 128+random(128), random(windowWidth), random(windowHeight));
	
	createCanvas(windowWidth, windowHeight);
	background(0);
}

function draw()
{
	if(isDrag == -2)
	{
		holdTime = holdTime+10;
		noStroke(); fill(255, holdTime);
		circle(mouseX, mouseY, holdTime);
	}
	
	background(0, 160);
	for(let i=0; i<things.length; i++)
	{
		if(things[i].physics()) things[i].draw();
		// object is removed - reinitialize
		else
		{
			// removed object is a ball - create a new one
			if(things[i].constructor.name == Ball.name)
				things[i] = new Ball(20+random(30), 128+random(128), random(windowWidth), random(windowHeight));
			
			// removed object is a star - create a new one
			if(things[i].constructor.name == Star.name)
				things[i] = new Star(1+random(2), 250+random(5), 0, random(windowHeight), 1+random(2));
		}
	}
}

function mousePressed()
{
	holdTime = 0;	isDrag = -2;
	// click detection - if we're clicking an object, drag it around
	for(let i=0; i<things.length && isDrag < 0; i++)
	{
		// we only want to affect the balls
		if(things[i].constructor.name == Ball.name)
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
}

function mouseReleased()
{
	// we're releasing the mouse - no longer dragging any objects.
	if(isDrag >= 0) things[isDrag].clearFlags(0x1);
	else	// explode
	{
		for(let i=0; i<things.length; i++)
		{
			// we only want to affect the balls
			if(things[i].constructor.name == Ball.name)
			{
				let distance = pow(mouseX-things[i].getPosX(), 2)+pow(mouseY-things[i].getPosY(), 2);
				if(distance < pow(holdTime*0.5, 2)+pow(things[i].getSize()*0.5, 2))
				{
					distance = sqrt(distance);
					let diffX = (-mouseX +things[i].getPosX());
					let diffY = (-mouseY +things[i].getPosY());
					things[i].addVelX(holdTime*0.1 * diffX/distance);
					things[i].addVelY(holdTime*0.1 * diffY/distance);
				}
			}
		}
	}
	holdTime = 0; isDrag = -1;
}
