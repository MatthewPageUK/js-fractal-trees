/**
 * The tree maker demo putting the FractalTree classes to use.
 */
class DemoTree {

	constructor(transparentBackground = false) {

		this.ground = document.getElementById("ground");
		this.groundPaper = ground.getContext("2d");
		this.ground.width = window.innerWidth;
		this.ground.height = window.innerHeight;
		this.hudBranches = document.getElementById('treeBranches');
		this.hudAge = document.getElementById('treeAge');
		this.hudLength = document.getElementById('treeLength');
		this.hudFPS = document.getElementById('FPS');
		this.dnaStrand = document.getElementById("dnaStrand");
		this.compressedStrand = document.getElementById("compressedStrand");
		this.urlParams = new URLSearchParams(window.location.search);
		this.urlDNA = this.urlParams.get('dna');
		this.loops = 0;
		this.looper = false;
		this.fps = 0;
		this.lastFrame = false;
		this.transparentBackground = transparentBackground;

		this.myDNA = new FractalTreeDNA();
		this.myTree = new FractalTree({x: ground.width/2-100, y: ground.height-20}, this.myDNA);
		this.settingsOpen('info');

		if(this.urlDNA) {
			this.myDNA.readDNA(this.urlDNA);
			this.settingsClose();
		}

		this.draw();
		this.play();
	}
	/**
	 * Share the Tree DNA
	 *
	 * @param {String} platform - The name of the platform to share it on
	 * @param {Object} button - The button that called this method
	 */
	share(platform, button) {
		let url = encodeURIComponent("http://mjp.co/js/trees/?dna="+this.myDNA.compress(this.myDNA.dnaStrand));
		switch (platform) {
			case 'twitter' :
				window.open(`https://twitter.com/intent/tweet?url=${url}`);
			break;
			case 'facebook' :
				window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
			break;
			case 'google' :
				window.open(`https://plus.google.com/share?url=${url}`);
			break;
			case 'reddit' :
				window.open(`http://www.reddit.com/submit?url=${url}`);
			break;
			case 'tumblr' :
				window.open(`http://www.tumblr.com/share/link?url=${url}`);
			break;
			case 'pinterest' :
				window.open(`https://pinterest.com/pin/create/bookmarklet/?url=${url}`);
			break;
			case 'digg' :
				window.open(`http://digg.com/submit?url=${url}`);
			break;
			case 'email' :
				url = "mailto:?subject="+encodeURIComponent("A Fractal Tree just for you...")+
							"&body="+encodeURIComponent("Here is a fractal tree for you to grow.\n\n")+url+"\n\n\n";
				window.location.href=url;

		}
		button.blur();
	}
	/**
	 * Close the settings popup
	 */
	settingsClose() {
		document.getElementById('settingsPopup').style.display = "none";
		document.querySelectorAll('button.settings').forEach((element)=>{ element.disabled = false; });
	}
	/**
	 * Open the settings popup and load the specified tab
	 */
	settingsOpen(tab, button) {
		document.querySelectorAll('button.settings').forEach((element)=>{ element.disabled = false; });
		try {
			button.disabled = true;
		} catch(e) { }
		document.getElementById('settingsPopup').style.display = "block";
		document.querySelectorAll(".panel").forEach((panel)=> { panel.style.display = "none"; });
		document.querySelector(".panel."+tab).style.display = "block";
	}
	/**
	 * Replant the seed, reset the tree and start growing again
	 */
	plantSeed() {
		this.stop();
		this.loops = 0;
		this.myTree = new FractalTree({x: ground.width/2-100, y: ground.height-20}, this.myDNA);
		this.settingsClose();
		this.play();
	}
	/**
	 * Save the canvas as an image - very much a test thing
	 */
	takePhoto() {
		this.stop();
		let img = ground.toDataURL("image/png;base64;").replace("image/png","image/octet-stream");
		window.open(img,"","width=700,height=700");
	}
	/**
	 * Send a single clock tick / animation loop
	 * All we need to do is tell the tree to grow a bit
	 */
	sendClockTick() {

		if(!this.lastFrame) {
			this.lastFrame = Date.now();
			this.fps = 0;
		}
		this.myTree.grow();
		this.draw();
		this.loops += 1;

		let delta = (Date.now() - this.lastFrame)/1000;
		this.lastFrame = Date.now();
		this.fps = 1/delta;
	}
	/**
	 * Play the animation by repeating calls to sendClockTick
	 */
	play() {
		this.looper = setInterval(()=>{ this.sendClockTick(); }, 100);
	}
	/**
	 * Stop the animation / loop
	 */
	stop() {
		clearInterval(this.looper);
		this.looper = false;
		this.draw();
	}
	/**
	 * Draw the tree and other displays
	 */
	draw() {

		/* Update the HUDs and on screen info */
		this.hudBranches.textContent = this.myTree.branches.length.toLocaleString();
		this.hudAge.textContent = this.myTree.age.toLocaleString();
		this.hudLength.textContent = this.myTree.branches[0].totalLength.toLocaleString();
		this.hudFPS.textContent = parseInt(this.fps);

		/* Change background colour and clear canva */
		if (! this.transparentBackground) {
			document.body.style.backgroundColor = `rgb(${Math.round(Math.min(this.loops*2, 255))},120,120)`;
		}
		this.groundPaper.clearRect(0, 0, this.ground.width, this.ground.height);

		this.groundPaper.fillStyle = "#fbbf24";
		this.groundPaper.strokeStyle = "#fbbf24";
		/* For all the branches, draw them */
		this.myTree.branches.forEach((branch)=>{
			this.groundPaper.beginPath();
			this.groundPaper.lineWidth = branch.thickness;
			this.groundPaper.moveTo(branch.startPoint.x, branch.startPoint.y);
			this.groundPaper.lineTo(branch.endPoint.x, branch.endPoint.y);
			this.groundPaper.stroke();
		});

		/* Draw all the leaves over the top of the branches */
		this.myTree.branches.forEach((branch)=>{
			if(branch.leaf.size > 2) {
				this.groundPaper.fillStyle = `rgba(${branch.leaf.colour.r},${branch.leaf.colour.g},${branch.leaf.colour.b}, 0.9)`;
				this.groundPaper.beginPath();
				/* Draw at end of branch, if falling add on the fall amount + sin wave */
				this.groundPaper.arc(branch.endPoint.x + ((Math.sin(branch.leaf.isFalling * Math.PI / 180))*20)+(branch.leaf.isFalling/5),
								branch.endPoint.y + ((branch.leaf.isFalling)?branch.leaf.isFalling:0), branch.leaf.size, 0, 2 * Math.PI);
				this.groundPaper.fill();
			}
		});

		/* Respawn the leaves */
		if(this.myTree.age % 250 === 0) {
			this.myTree.branches.forEach((branch)=>{
				branch.leaf = new FractalTreeLeaf(this.myTree, branch);
			});
		}

		/* Handle button states for Play Stop */
		if(this.looper) {
			document.getElementById("butStart").disabled = true;
			document.getElementById("butStop").disabled = false;
		} else {
			document.getElementById("butStart").disabled = false;
			document.getElementById("butStop").disabled = true;
		}
	}

}


