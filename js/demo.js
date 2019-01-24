class DemoTree {
	
	constructor() {

		this.ground = document.getElementById("ground");
		this.groundPaper = ground.getContext("2d");
		this.ground.width = window.innerWidth;
		this.ground.height = window.innerHeight;
		this.hudBranches = document.getElementById('treeBranches');
		this.hudAge = document.getElementById('treeAge');
		this.hudLength = document.getElementById('treeLength');
		this.dnaStrand = document.getElementById("dnaStrand");
		this.compressedStrand = document.getElementById("compressedStrand");
		this.footer = document.getElementById("footer");
		this.urlParams = new URLSearchParams(window.location.search);
		this.urlDNA = this.urlParams.get('dna');
		this.loops = 0;
		this.looper = false;		
		this.myDNA = new FractalTreeDNA();
//		this.myObserver = new DemoObserver(this, document, this.myDNA);
		this.myTree = new FractalTree({x: ground.width/2-100, y: ground.height-20}, this.myDNA);
//		this.myDNA.setObserver(this.myObserver);
		this.settingsOpen('info');
		if(this.urlDNA) {
			this.myDNA.readDNA(this.urlDNA);
			this.settingsClose();
		}
		this.draw();
		this.play();
	}
	/**
	 * Close the settings popup
	 */
	settingsClose() {
		document.getElementById('settingsPopup').style.display = "none";
	}
	/**
	 * Open the settings popup and load the specified tab
	 */
	settingsOpen(tab) {
		document.getElementById('settingsPopup').style.display = "block";
		document.querySelectorAll(".settingsPanel").forEach((panel)=> { panel.style.display = "none"; });
		document.querySelector(".settingsPanel."+tab).style.display = "block";
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
	saveImage() {
		this.stop();
		let img = ground.toDataURL("image/png;base64;").replace("image/png","image/octet-stream");
		window.open(img,"","width=700,height=700");				
	}

		/* Rewrite the DNA strand 
		dnaStrand.textContent = myDNA.dnaStrand.replace(/(.{4})/g, '$1 ');
		compressedStrand.textContent = myDNA.compress(myDNA.dnaStrand); */

	/**
	 * Send a single clock tick / animation loop
	 * All we need to do is tell the tree to grow a bit
	 */
	sendClockTick() {
		this.myTree.grow();
		this.draw();
		this.loops += 1;
	}
	/**
	 * Play the animation by repeating calls to sendClockTick
	 */
	play() {
		this.looper = setInterval(()=>{ this.sendClockTick(); }, 100);
		this.footer.style.display = "none";
	}
	/**
	 * Stop the animation / loop
	 */
	stop() {
		clearInterval(this.looper);
		this.looper = false;
		this.draw();
		this.footer.style.display = "block";
	}
	/**
	 * Draw the tree and other displays
	 */
	draw() {

		/* Update the HUDs and on screen info */
		this.hudBranches.textContent = this.myTree.branches.length.toLocaleString();
		this.hudAge.textContent = this.myTree.age.toLocaleString();
		this.hudLength.textContent = this.myTree.branches[0].totalLength.toLocaleString();

		// DNA strings ????????

		/* Change background colour */
		this.groundPaper.fillStyle = `rgb(${Math.round(Math.min(this.loops*2, 255))},120,120)`;
		this.groundPaper.fillRect(0, 0, this.ground.width, this.ground.height);

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
		if(this.myTree.age == 300) {
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


