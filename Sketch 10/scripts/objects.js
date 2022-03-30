// this file stores movable/interactive objects in the game.
// every object has "AI", "physics", "collides" and "draw" methods, which are called every frame.
// AI() is used by enemy ships to handle firing and by the player ship to handle weapon/armor recovery.
// physics() handles movement and whether the object should exist - if returns 0, object is not drawn and is removed from objects array.
// collides() detects and handles collision to another object, and is only called if physics() returns positive.
// draw() renders the object to screen, and is also only called if physics() returns positive.

// player ship
class PlayerShip
{
	constructor(posX, posY)
	{
		this.sprite = crowSpr;
		this.parent = this;
		this.posX = posX;
		this.posY = posY;

		this.vel = 0;
		this.health = 100;
		this.sizeX = 60;
		this.sizeY = 30;
		this.rotAng = 0;
		
		this.fireWait = 0;
		this.fireTime = 10;
		this.firePower = 20;
		return 1;
	}
	AI()
	{
		if(this.health <= 0) return -1;
		this.fireWait = max(this.fireWait-1, 0);
		this.health = min(this.health+0.01, 100);
		return -1;
	}
	physics()
	{
		if(this.health <= 0) return 0;
		this.rotAng = max(min((mouseY-this.posY)*0.2, 45), -45);
		this.posY = this.posY*0.95+mouseY*0.05;
		return 1;
	}
	draw()
	{
		push();
		translate(this.posX, this.posY); rotate(this.rotAng);
		image(this.sprite, -this.sizeX, -this.sizeY, this.sizeX*2, this.sizeY*2);
		pop();

		return 1;
	}
	collides(object)
	{
		if(object == this || object == null) return 0;
		if(object.constructor.name == Explosion.name) return 0;
		if(object.parent == this.parent) return 0;
		
		let retVal = ((this.posX-this.sizeX < object.posX+object.sizeX) && (this.posX+this.sizeX > object.posX-object.sizeX) && (this.posY+this.sizeY > object.posY-object.sizeY) && (this.posY-this.sizeY < object.posY+object.sizeY));
		if(retVal)
		{
			if(object.constructor.name == PlayerShip.name || object.constructor.name == EnemyShip.name)
			{
				this.damage(object, object.health);
				object.damage(this, this.health);
			}
			if(object.constructor.name == Bullet.name)
			{
				this.damage(object, object.damage);
				object.destroy();
			}
		}
		return retVal;
	}
	damage(object, damage)
	{
		this.health = this.health-damage;
		if(this.health <= 0)
		{
			// damage dealer is player - kills + 1
			if(object.parent == things[0])
			{
				score = score +10*difficulty;
				difficulty = difficulty +0.01;
				shipsDestroyed++;
			}
			else if(this == things[0]) score = score -200*difficulty;
			this.destroy();
		}
		return this.health;
	}
	destroy()
	{
		this.health = 0;
		for(let i=1; i<thingLimit; i++)
		{
			if(things[i] == null)
			{
				things[i] = new Explosion(this, 10);
				return i;
			}
		}
		return -1;
	}
	remove()
	{
		this.health = 0;
		return 1;
	}
}

// enemy ship, mostly based on player's but with extra AI
class EnemyShip extends PlayerShip
{
	AI()
	{
		if(this.health <= 0 || this.posX > windowWidth) return -1;	// do nothing if we're dead or off screen
		if(this.fireWait <= 0 && things[0] != null)	// fire only if weapon is not on cooldown and player ship exists
		{
			if(random() < 0.005 || (things[0].posY+80 > this.posY && things[0].posY-80 < this.posY))	// fire either at random or when player is close enough
			{
				for(let i=1; i<thingLimit; i++)	// seek free thing slots
				{
					if(things[i] == null)
					{
						if(!isMute) tiebFire.play();
						things[i] = new Bullet(this, this.firePower*difficulty, -5*difficulty, color(200, 255, 0), color(0, 255, 0));
						this.fireWait = this.fireTime;
						return i;
					}
				}
			}
		}
		this.fireWait = max(this.fireWait-1, 0);
		return -1;
	}
	physics()
	{
		if(this.health <= 0) return 0;
		this.posX = this.posX-this.vel;
		
		// enemy ship goes offscreen
		if(this.posX < 0+this.sizeX)
		{
			score = score -difficulty*20;
			shipsPassed++;
			return 0;
		}
		return 1;
	}
}

// ship weapons
class Bullet
{
	constructor(parent, damage, vel, color, glow)
	{
		this.parent = parent;
		this.damage = damage;
		this.color = color;
		this.glow = glow;
		this.vel = vel;
		
		this.posX = parent.posX;
		this.posY = parent.posY;
		this.rotAng = parent.rotAng;
		this.sizeX = 6;
		this.sizeY = 2;
		return 1;
	}
	collides(object)
	{
		if(object == this) return 0;
		if(object.constructor.name == Explosion.name) return 0;
		if(object.parent == this.parent) return 0;

		let retVal = ((this.posX-this.sizeX < object.posX+object.sizeX) && (this.posX+this.sizeX > object.posX-object.sizeX) && (this.posY+this.sizeY > object.posY-object.sizeY) && (this.posY-this.sizeY < object.posY+object.sizeY));
		if(retVal)
		{
			if(object.constructor.name == this.constructor.name)
			{
				if(object.parent == things[0] || this.parent == things[0]) score = score + difficulty*2;
				object.destroy();
			}
			else object.damage(this, this.damage);
			this.destroy();
		}
		return retVal;
	}
	physics()
	{
		if(this.damage <= 0) return 0;

		// follow correct bullet trajectory
		this.posX = this.posX + this.vel * cos(this.rotAng);
		this.posY = this.posY + this.vel * sin(this.rotAng);

		if(this.posX+10 > windowWidth || this.posX-10 < 0 || this.posY-10 < 0 || this.posY+10 > windowHeight) return 0;
		else return 1;
	}
	AI()
	{
		return -1;
	}
	draw()
	{
		push();
		strokeWeight(1); stroke(this.glow); fill(this.color);
		translate(this.posX, this.posY); rotate(this.rotAng);
		rectMode(CENTER); rect(0, 0, this.sizeX*2, this.sizeY*2);
		pop();
		
		return 1;
	}
	destroy()
	{
		this.damage = 0;
		for(let i=1; i<thingLimit; i++)
		{
			if(things[i] == null)
			{
				things[i] = new Explosion(this, 3);
				return i;
			}
		}
		return -1;
	}
	remove()
	{
		this.damage = 0;
		return 1;
	}
}

// impact explosions
class Explosion
{
	constructor(parent, size)
	{
		this.parent = parent;
		this.size = size;
		this.posX = parent.posX;
		this.posY = parent.posY;

		// play explosion sounds
		if(!isMute)
		{
			if(this.parent.constructor.name == Bullet.name)
			{
				if(this.parent.parent == things[0]) tiebHurt.play();
				else crowHurt.play();
			}
			else
			{
				if(this.parent == things[0]) crowExpl.play();
				else tiebExpl.play();
			}
		}
		this.timer = 0;
		return 1;
	}
	AI()
	{
		return -1;
	}
	draw()
	{
		noStroke(0); fill(color(256, 256, 128, 512/(1+this.timer)));
		circle(this.posX, this.posY, (this.timer+1)*this.size);
	}
	physics()
	{
		this.timer++;
		return this.timer < 25;
	}
	collides()
	{
		return 0;
	}
	destroy()
	{
		this.timer = 25;
		return 1;
	}
	remove()
	{
		this.timer = 25;
		return 1;
	}
}
