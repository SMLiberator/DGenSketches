let z = true;
let c = 0;

function setup()
{
	createCanvas(windowWidth, windowHeight);
	frameRate(60);
}

function draw()
{
	background(c);
	let x = mouseX-(windowWidth/2); if(x < 0) x = -x;
	let y = mouseY-(windowHeight/2); if(y < 0) y = -y;

	if(z) c = c+1; else c = c-1;
	if(c > 256 || c < 0) z = !z;

	fill(color(256-c, 256-c, 256-c)); noStroke();
	ellipse(windowWidth/2, windowHeight/2, x*2, y*2);
}
