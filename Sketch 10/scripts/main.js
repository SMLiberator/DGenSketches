// array for thing creation
let thingLimit = 256;
let starDensity = 128;
let things = [];

// gameplay variables
let score = 0;
let shipsDestroyed = 0;
let shipsPassed = 0;
let difficulty = 1;
let isMute = true;

// variables for assets
let crowSpr;
let crowFire;
let crowExpl;
let crowHurt;
	
let tiebSpr;
let tieiSpr;
let tiefSpr;
let tiebFire;
let tiebExpl;
let tiebHurt;

// load assets before startup
function preload()
{
	// player ship assets
	crowSpr = loadImage('assets/crow.png');
	crowFire = loadSound('assets/crow-fire.mp3');
	crowExpl = loadSound('assets/crow-expl.mp3');
	crowHurt = loadSound('assets/crow-hurt.mp3');
	
	// enemy ship assets
	tiebSpr = loadImage('assets/tieb.png');
	tieiSpr = loadImage('assets/tiei.png');
	tiefSpr = loadImage('assets/tief.png');
	tiebFire = loadSound('assets/tieb-fire.mp3');
	tiebExpl = loadSound('assets/tieb-expl.mp3');
	tiebHurt = loadSound('assets/tieb-hurt.mp3');
	
	// prevent too many sounds from playing at once
	crowFire.playMode('restart');
	crowExpl.playMode('restart');
	crowHurt.playMode('restart');
	tiebFire.playMode('restart');
	tiebExpl.playMode('restart');
	tiebHurt.playMode('restart');
}

function setup()
{
	createCanvas(windowWidth, windowHeight);
	soundFormats('mp3');
	angleMode(DEGREES);
	background(16);
	
	// create player ship
	things[0] = new PlayerShip(100, 0);
	
	// create starfield
	for(let i=thingLimit; i<thingLimit+starDensity; i++)
		things[i] = new Star(random(windowWidth), random(windowHeight));
}

function draw()
{
	// draw background
	background(16, 200);
	
	// draw starfield
	for(let i=thingLimit; i<thingLimit+starDensity; i++)
	{
		if(things[i] != null)
		{
			if(things[i].physics()) things[i].draw();
			else things[i] = new Star(windowWidth+3, random(windowHeight));
		}
	}
	
	// create new enemy ship
	if(random() < 0.01)
	{
		for(let i=1; i<thingLimit; i++)
		{
			if(things[i] == null)
			{
				things[i] = new EnemyShip(windowWidth+30, 10+random(windowHeight-20));
				if(random() < 0.5)	// tie fighter
				{
					things[i].sprite = tiefSpr;
					things[i].vel = 3*(difficulty);
					things[i].health = 40;
					things[i].fireTime = 70;
					things[i].firePower = 15;
				}
				else if(random() < 0.5)	// tie interceptor
				{
					things[i].sprite = tieiSpr;
					things[i].vel = 4*(difficulty);
					things[i].health = 20;
					things[i].fireTime = 40;
					things[i].firePower = 10;
				}
				else	// tie bomber
				{
					things[i].sprite = tiebSpr;
					things[i].vel = 2*(difficulty);
					things[i].health = 60;
					things[i].fireTime = 100;
					things[i].firePower = 20;
				}
				i = thingLimit;
			}
		}
	}
	
	// handle objects and physics
	for(let i=0; i<thingLimit; i++)
	{
		if(things[i] != null)
		{
			if(things[i].physics())
			{
				for(let j=i+1; j<thingLimit; j++)
				{
					if(things[j] != null) things[i].collides(things[j]);
				}
				things[i].AI();
				things[i].draw();
			}
			else things[i] = null;
		}
	}
	noStroke(); rectMode(CORNERS);

	// draw health bar
	if(things[0] != null)
	{
		if(things[0].health > 25 || millis()%1000 < 500)
		{
			fill(color(255, 0, 0));
			rect(0, windowHeight*(1-(things[0].health/100)), 20, windowHeight);
		}
	}
	
	// draw mute button
	if(isMute) fill(color(255, 0, 0)); else fill(color(0, 255, 0));
	rect(windowWidth-60, windowHeight-60, windowWidth-30, windowHeight-30);
	
	// draw text overlay
	textSize(16); fill(255); textAlign(RIGHT);
	text('score', windowWidth-100, 28);
	text('destroyed', windowWidth-100, 58);
	text('lost', windowWidth-100, 88);
			 
	textSize(24);
	text(floor(score), windowWidth-30, 30);
	text(shipsDestroyed, windowWidth-30, 60);
	text(shipsPassed, windowWidth-30, 90);
}

// clicking mouse
function mousePressed()
{
	// clicked sound button - toggle mute mode
	if(mouseX > windowWidth-60 && mouseX < windowWidth-30 && mouseY > windowHeight-60 && mouseY < windowHeight-30)
	{
		isMute = !isMute;
		return 1;
	}
	// player is dead - respawn
	if(things[0] == null)
	{
		things[0] = new PlayerShip(100, 0);
		return 1;
	}
	// player is alive and valid
	if(things[0].fireWait > 0) return 0;

	// create projectile - search for free thing slots...
	for(let i=1; i<thingLimit; i++)
	{
		if(things[i] == null)
		{
			if(!isMute) crowFire.play();
			things[i] = new Bullet(things[0], things[0].firePower, 10, color(255, 255, 0), color(255, 0, 0));
			things[0].fireWait = things[0].fireTime;
			i = thingLimit;
		}
	}
}
