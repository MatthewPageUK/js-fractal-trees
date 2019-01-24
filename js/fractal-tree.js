/**
 * A fractal tree demonstration
 *
 * @todo The start point and end points are really only used for rendering, not here.. ?
 *
 * @property {FractalTreeBranch[]} branches - Array of branches
 * @property {Position} startPoint - Where the seed landed
 * @property {Position} endPoint - The same place, acts like the first branch so we need an endPoint
 * @property {FractalTreeDNA} dna - The DNA or settings of this tree
 * @property {Number} generation - Simulate the branch generation (distance from seed)
 * @property {Number} age - Number of iterations we've done
 * @property {Number} thickness - Thickness of the trunk, passes to branches
 */
class FractalTree {
	/**
	 * Create a new tree 
	 *
	 * @param {Position} startPoint - where to start on the screen really, has not concept here
	 * @param {FractalTreeDNA} dna - The DNA instance for our settings
	 */
	constructor(startPoint, dna) {
		this.startPoint = {x: startPoint.x, y: startPoint.y};
		this.endPoint = {x: startPoint.x, y: startPoint.y};
		this.dna = dna;
		this.generation = 0;
		this.age = 0;
		this.thickness = 1;
		
		/* We start with no branches, just a little seed */
		this.branches = [];
		
		/* First one */
		this.branches.push(new FractalTreeBranch(this, this, -90));
	}
	/**
	 * Grow the tree a little bit, passes this call to the first branch which will pass it 
	 * to the children etc
	 *
	 * @returns {boolean} True of false if we did grow
	 */
	grow() {
		this.age += 1;
		this.thickness = Math.min(this.thickness+1, 30);		
		this.branches[0].grow(); 
		return true;
	}
	get isTreeFullyGrown() {
		return this.branches[0].isTreeFullyGrown;	
	}
	/**
	 * Can the tree grow another branch or has it reached the limit
	 *
	 * @returns {boolean} True of false if we can grow a branch
	 */
	get canGrowBranch() {
		return ( this.branches.length < this.dna.getValue("maxBranches") );
	}
}
