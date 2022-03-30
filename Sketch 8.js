let things = [];

let cloudDensity = 12;
let dropDensity = 128;
let windSpeed = 1;

class Cloud
{
	constructor(sizeX, sizeY, posX, posY)
	{
		this.sizeX = sizeX*(0.75+random(0.5));
		this.sizeY = sizeY*(0.75+random(0.5));
		this.color = color(100*(0.75+random(0.5)), 128);

		this.velX = windSpeed*(0.8+random(0.2));
		this.posX = posX;
		this.posY = posY;
		return 1;
	}
	draw()
	{
		noStroke(); fill(this.color);
		ellipse(this.posX, this.posY, this.sizeX, this.sizeY);
		return 1;
	}
	physics()
	{
		this.posX = this.posX +this.velX;
		if(this.posX-(this.sizeX*0.5) > windowWidth) return 0;
		else return 1;
	}
}

class Droplet
{
	constructor(size, posX, posY)
	{
		this.size = size*(0.75+random(0.5));
		this.posX = posX;
		this.posY = posY;

		this.velX = windSpeed*(2+random(1));
		this.velY = 16;
		return 1;
	}
	draw()
	{
		noStroke(); fill(255, 255);
		circle(this.posX, this.posY, this.size);
		return 1;
	}
	physics()
	{
		this.posX = this.posX +this.velX;
		this.posY = this.posY +this.velY;
		if(this.posX-(this.size*0.5) > windowWidth) return 0;
		if(this.posY-(this.size*0.5) > windowHeight) return 0;
		else return 1;
	}
}

function setup()
{	
	for(let i=0; i<cloudDensity; i++)
		things[i] = new Cloud(0.4*windowWidth, 0.1*windowWidth, (i/cloudDensity)*windowWidth*1.8, random(windowHeight)*0.1);

	for(let i=cloudDensity; i<cloudDensity+dropDensity; i++)
		things[i] = new Droplet(2, random(windowWidth), random(windowHeight));
	
	createCanvas(windowWidth, windowHeight);
	background(66, 82, 90);
}

function draw()
{
	if(random() < 0.01) background(255);
	else background(66, 82, 90, 128);

	for(let i=0; i<things.length; i++)
	{
		if(things[i].physics()) things[i].draw();
		// object is removed - reinitialize
		else
		{
			// removed object is a cloud - create a new one
			if(things[i].constructor.name == Cloud.name)
				things[i] = new Cloud(0.4*windowWidth, 0.1*windowWidth, -0.4*windowWidth, random(windowHeight)*0.1);
			
			// removed object is a droplet - create a new one
			if(things[i].constructor.name == Droplet.name)
				things[i] = new Droplet(2, random(windowWidth), 0);
		}
	}
}
