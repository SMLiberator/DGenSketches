let bounce = 0.99;
let drag = 0.01;

let things = [];
let ballCount = 15;
let ballSizeMulti = 1;

let holdTime = -1;

// object flags:
// 0x1	object is being dragged
// 0x2	object collides with world
// 0x4	object collides with other objects
// 0x8	object is destroyed if leaves world
// 0x10	object is recreated upon destruction

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
			this.velX = this.velX*(1-drag);
			this.velY = this.velY*(1-drag);
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
			}
			if(this.posX+(this.size*0.5) > windowWidth)
			{
				// play hit sound relative to speed at moment of impact
				this.posX = windowWidth-(this.size*0.5);	// force object position to screen
				this.velX = -this.velX*bounce;			// change speed perpendicular to direction of hit - bounce
			}
			if(this.posY-(this.size*0.5) < 0)
			{
				// play hit sound relative to speed at moment of impact
				this.posY = this.size*0.5;			// force object position to screen
				this.velY = -this.velY*bounce;			// change speed perpendicular to direction of hit - bounce
			}
			if(this.posY+(this.size*0.5) > windowHeight)
			{
				// play hit sound relative to speed at moment of impact
				this.posY = windowHeight-(this.size*0.5);	// force object position to screen
				this.velY = -this.velY*bounce;			// change speed perpendicular to direction of hit - bounce
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
	things[0] = new Ball(40, 256, windowWidth*0.25, windowHeight*0.5);

	//for(let i=1; i<ballCount; i++)
	things[1] = new Ball(40, color(random(256), random(256), random(256)), windowWidth*0.75, windowHeight*0.5);
	
	createCanvas(windowWidth, windowHeight);
	background(16, 128, 32);
}

function draw()
{
	if(holdTime >= 0)
	{
		holdTime = holdTime+10;
		noStroke(); fill(255, holdTime);
		circle(mouseX, mouseY, holdTime);
	}
	
	background(16, 128, 32, 180);
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
		}
	}
}

function mousePressed()
{
	holdTime = 0;
}

function mouseReleased()
{
	if(holdTime < 1) return;
	let distance = pow(mouseX-things[0].getPosX(), 2)+pow(mouseY-things[0].getPosY(), 2);
	if(distance < pow(holdTime*0.5, 2)+pow(things[0].getSize()*0.5, 2))
	{
		distance = sqrt(distance);
		let diffX = things[0].getPosX() -mouseX;
		let diffY = things[0].getPosY() -mouseY;
		things[0].addVelX(holdTime/things[0].getSize() * diffX/distance);
		things[0].addVelY(holdTime/things[0].getSize() * diffY/distance);
	}
	holdTime = -1;
}
