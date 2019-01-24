/**
 * A fractal tree leaf, grows at the end of the branches.
 *
 * @property {FractalTree} tree - The tree
 * @property {FractalTreeBranch} branch - The branch that grew this leaf
 * @property {Number} age - The age of this leaf
 * @property {Number} size - Size this leaf has grown to
 * @property {Number} growthRate - How quickly the leaf grows
 * @property {Object} colour - Colour of the leaf (RGB)
 * @property {Number} isFalling - Has the leaf dropped off, and how far it is from the branch (how would a leaf know this?)
 * @property {Number} fallSpeed - The speed this leaf falls at
 * @property {Number} maxAge - Maximum age before the leaf dies
 */
class FractalTreeLeaf {
	/**
	 * Grow a new leaf.
	 *
	 * @property {FractalTree} tree - The tree
	 * @property {FractalTreeBranch} branch - The branch that grew this leaf
	 */
	constructor(tree, branch) {
		this.tree = tree;
		this.branch = branch;
		this.age = 0;
		this.size = 0;
		this.growthRate = 1;
		this.colour = { r: 0, g: 220, b: 0 };
		this.isFalling = 0;
		this.fallSpeed = 5+Math.random()*20
		this.maxAge = 65+Math.round(Math.random()*20);
	}
	/**
	 * Grow the leaf some more. Leaf growth and death logic in here.
	 */
	grow() {
		if(this.isFalling > 0) {
			this.isFalling += this.fallSpeed;
			this.fallSpeed += 0.1; // Gravity acceleration
		}
		this.age += 1;
		if(this.age < 15) {
			this.size += this.growthRate;
		} else if(this.age < 25) {
		
		} else if(this.age < 55) {
			this.colour = { r: Math.round(Math.min(this.colour.r+10, 200)), g: Math.round(Math.max(this.colour.g-5, 0)), b:0 };
			this.size -= this.growthRate/4;
		}
 		else if(this.age == this.maxAge) {
			this.isFalling = 1;		
		}
		else if(this.age == 100) {
			
		}
		if(this.size < 0) this.size = 0;
	}
}