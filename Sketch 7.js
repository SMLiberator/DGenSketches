let gravity = 0;
let bounce = 0.99;
let airDrag = 0.02;
let surfDrag = 0.01;

let things = [];
let ballCount = 16;
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
// 0x2	object collides with world
// 0x4	object collides with other objects
// 0x8	object is destroyed if leaves world
// 0x10	object is recreated upon destruction

class Star
{
	constructor(size, color, posX, posY, velX)
	{
		this.size = size*starSizeMulti;
		this.color = color;

		this.flags = 0x18;
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
		if(this.flags&0x8 && this.posX-(this.size*0.5) > windowWidth) return 0;
		else return 1;
	}
	collides(object)
	{
		return 0;
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
}

class Ball
{
	constructor(size, color, posX, posY)
	{
		this.size = size*ballSizeMulti;
		this.color = color;

		this.flags = 0x1E;
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
		// object is being dragged
		if(this.flags&0x1)
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
		
		// test object-to-world collisions
		if(this.flags&0x2)
		{
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
		}
		else if(this.flags&0x8)
		{
			if(this.posX+(this.size*0.5) < 0) return 0;
			if(this.posY+(this.size*0.5) < 0) return 0;
			if(this.posX-(this.size*0.5) > windowWidth) return 0;
			if(this.posY-(this.size*0.5) > windowHeight) return 0;
		}
		return 1;
	}
	collides(object)
	{
		if(object == this) return 0;
		if(!(object.getFlags()&0x4) || !(this.flags&0x4)) return 0;

		// attempt prediction of object position at next frame
		//let distance = pow(this.posX-object.getPosX(), 2)+pow(this.posY-object.getPosY(), 2);
		let distance = pow((this.posX+this.velX)-(object.getPosX()+object.getVelX()), 2)+pow((this.posY+this.velY)-(object.getPosY()+object.getVelY()), 2);

		let retVal = (distance < pow((this.size+object.getSize())*0.5, 2));
		if(retVal)
		{
			// play hit sound relative to speed at moment of impact
			distance = (this.size+object.getSize())*0.5;
			let diffX = (object.getPosX() -this.posX)/distance;
			let diffY = (object.getPosY() -this.posY)/distance;

			let thisVelX = this.velX; let thisVelY = this.velY;
			this.addVelX(abs(this.velX-object.getVelX()) * (object.getSize()/(object.getSize()+this.size)) * -diffX);
			this.addVelY(abs(this.velY-object.getVelY()) * (object.getSize()/(object.getSize()+this.size)) * -diffY);
			object.addVelX(abs(object.getVelX()-thisVelX) * (this.size/(object.getSize()+this.size)) * diffX);
			object.addVelY(abs(object.getVelY()-thisVelY) * (this.size/(object.getSize()+this.size)) * diffY);
		}
		return retVal;
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

	for(let i=starDensity; i<starDensity+ballCount; i++)
		things[i] = new Ball(20+random(60), color(random(256), random(256), random(256)), random(windowWidth), random(windowHeight));
	
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
		if(things[i].physics())
		{
			// object collides with other objects
			if(things[i].getFlags()&0x4)
			{
				for(let j=i+1; j<things.length; j++)
				{
					if(things[j].getFlags()&0x4) things[i].collides(things[j]);
				}
			}
			things[i].draw();
		}
		// object is removed - reinitialize
		else if(things[i].getFlags()&0x10)
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
					let diffX = things[i].getPosX() -mouseX;
					let diffY = things[i].getPosY() -mouseY;
					things[i].addVelX(holdTime/things[i].getSize() * diffX/distance);
					things[i].addVelY(holdTime/things[i].getSize() * diffY/distance);
				}
			}
		}
	}
	holdTime = 0;	isDrag = -1;
}
