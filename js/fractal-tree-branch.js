/**
 * A fractal tree branch and the logic to grow and spawn children.
 * The heart of the tree is in the branch - Matt 2019
 *
 * @property {FractalTree} tree - The parent tree
 * @property {FractalTreeBranch | FractalTree} parent - The parent branch or tree if first branch
 * @property {FractalTreeBranch[]} children - Child branches (2 of them)
 * @property {Number} angle - Angle this branch grows at
 * @property {Number} len - Current length of this branch
 * @property {Number} age - Current age of this branch
 * @property {Position} startPoint - Where it starts = endPoint of the parent
 * @property {Position} endPoint - Where it ends, calculated from start, len, angle
 * @property {Boolean} stopped - This branch has been stopped, usually going below ground
 * @property {Boolean} dontBranch - Instructed not to branch anymore
 * @property {Number} generation - Distance from the seed in branches.
 * @property {Number} thickness - The branch thickness
 */
class FractalTreeBranch {
	/**
	 * Create a new tree branch
	 *
	 * @param {FractalTree} tree - The tree this branch grows on
	 * @param {FractalTreeBranch | FractalTree} parent - The parent branch or tree if first
	 * @param {Number} angle - The angle this branch grows at relative to ground at 0
	 */
	constructor(tree, parent, angle) {
		this.tree = tree;
		this.parent = parent;
		this.children = [];
		this.leaf = new FractalTreeLeaf(this.tree, this);
		this.angle = angle;
		this.len = 1;
		this.age = 0;
		this.startPoint = Object.assign({}, this.parent.endPoint);
		this.endPoint = Object.assign({}, this.startPoint);
		this.stopped = false;
		this.dontBranch = false;
		this.generation = this.parent.generation+1;
		this.thickness = 1;
	}
	/**
	 * Function to get the total length of all branches. Call it once on the
	 * first branch and it will call all its children.
	 *
	 * @returns {Number} A recursive total of the len and all childrens len
	 */
	get totalLength() {
		let l = parseInt(this.len);
		if(this.hasChildren) {
			l += parseInt(this.children[0].totalLength);
			l += parseInt(this.children[1].totalLength);
		}
		return l;
	}
	get isTreeFullyGrown() {
		if(this.hasChildren) {
			return ( ( this.isFullyGrown || this.stopped ) && this.children[0].isTreeFullyGrown && this.children[1].isTreeFullyGrown );
		} else {
			return ( this.isFullyGrown || this.stopped );
		}
	}
	/**
	 * Is the branch fully grown
	 *
	 * @returns {Boolean} True or false
	 */
	get isFullyGrown() {
		return ( this.age > 10 );	
	}
	/**
	 * Does this branch have any children yet
	 *
	 * @returns {Boolean} True or false
	 */
	get hasChildren() {
		return ( this.children.length > 0 );
	}
	/**
	 * Grow this branch, and if fully grown make 2 more 
	 */
	grow() {
		
				//if(myDNA.getValue("branchThickness") > 0) {
			// @todo - Branch class should handle thickness, not the rendering engine
		//	groundPaper.lineWidth = branch.age/myDNA.getValue("branchThickness");
		//}
		
		this.thickness += 0.1;
		this.thickness = Math.min(this.thickness, (this.parent.thickness/100)*80);		
		this.thickness = Math.max(this.thickness, 1);		

		if(this.generation > 4) this.leaf.grow();
		
		this.startPoint = Object.assign({}, this.parent.endPoint);
		/* Calculate the new endPoint of this branch */
		this.endPoint.x = this.startPoint.x + this.len * Math.cos(Math.PI * this.angle / 180.0);
		this.endPoint.y = this.startPoint.y + this.len * Math.sin(Math.PI * this.angle / 180.0);
		
		if(!this.stopped) {
			
			
			this.age += 1;
		
			/* Carry on growing after branching */
			if(this.tree.dna.getValue("continuousBranchGrowth") > 0 && !this.tree.isTreeFullyGrown) {
				this.len += this.tree.dna.getValue("continuousBranchGrowth")/3;
			}
		
			/**
			 * Check if we've gone below the grass, branches don't grow here
			 * @todo Stop branches going back towards the tree?
			 */
			if(this.endPoint.y > this.tree.startPoint.y - 50 && this.generation > 3) {
				this.stopped = true;
				this.dontBranch = true;
			}
		
			if(!this.isFullyGrown) {
				
				/* Grow this branch by the growth rate */
				this.len += this.tree.dna.getValue("branchGrowthRate");
			
			} else if(!this.hasChildren) {

				if(!this.dontBranch && this.tree.canGrowBranch) {
					
					/* Fully grown with no children, better make some */
						
					let a1 = this.tree.dna.getValue("branchAngle1");
					let a2 = this.tree.dna.getValue("branchAngle2");

					/* Check if we should apply a random value to Angle 1 */
					if(this.tree.dna.getValue("branchAngle1Random")==1) {
						a1 = Math.random()*(this.tree.dna.getValue("branchAngle1RandomTo")-this.tree.dna.getValue("branchAngle1RandomFrom")) 
							+ this.tree.dna.getValue("branchAngle1RandomFrom");
					}
					/* Check if we should apply a random value to Angle 2 */
					if(this.tree.dna.getValue("branchAngle2Random")==1) {
						a2 = Math.random()*(this.tree.dna.getValue("branchAngle2RandomTo")-this.tree.dna.getValue("branchAngle2RandomFrom")) 
							+ this.tree.dna.getValue("branchAngle2RandomFrom");
					}

					/* Make new branches at the calculated angles */
					this.tree.branches.push(new FractalTreeBranch(this.tree, this, this.angle+a1));
					this.children[0] = this.tree.branches[this.tree.branches.length-1];

					this.tree.branches.push(new FractalTreeBranch(this.tree, this, this.angle-a2));
					this.children[1] = this.tree.branches[this.tree.branches.length-1];

				}
			} 
		}
		if(this.hasChildren) {
			
			//if(!this.isFullyGrown) {

			/* Angle Change 
									<input type="checkbox" value="1" id="branchAngle1Change"> 
						<select id="branchAngle1ChangeDirection">
							<option value="1">Increase angle with age</option>
							<option value="0">Decrease angle with age</option>
						</select>
						by  
						<input id="branchAngle1ChangeValue" type="text" value="5"> 	*/
			
				if( this.tree.dna.getValue("branchAngle1Change") == 1 ) {
					if( this.tree.dna.getValue("branchAngle1ChangeDirection") == 1 ) {
						this.children[0].angle += this.tree.dna.getValue("branchAngle1ChangeValue")/5;
						this.children[1].angle -= this.tree.dna.getValue("branchAngle1ChangeValue")/5;
					} else {
						this.children[0].angle -= this.tree.dna.getValue("branchAngle1ChangeValue")/5;
						this.children[1].angle += this.tree.dna.getValue("branchAngle1ChangeValue")/5;
					}
				}
			//}
			
			/* Grow the existing children */
			this.children.forEach((branch)=>{
				branch.grow();
			});	
		}
	}
}