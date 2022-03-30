// this handles the star objects that will be rendered as the background.

class Star
{
	constructor(posX, posY)
	{
		this.size = 1+random(2);
		this.color = color(128+random(128), 128+random(128), 128+random(128));
		this.velX = (0.3+random(0.7))*difficulty;

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
		this.posX = this.posX -this.velX;
		if(this.posX-(this.size*0.5) < 0) return 0;
		else return 1;
	}
}
