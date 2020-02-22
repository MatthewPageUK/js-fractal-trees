/**
 * The tree DNA, made up of many Genes (settings / values) with getter and
 * setters. Can read a DNA string and compress DNA strands
 *
 * @property {Array} genes - All settings / genes in this DNA strand
 * @property {Number} maxBranches - Maximum branches the tree can grow
 * @property {Number} branchAngle1Random - Angle 1 is random ( 1 or 0 )
 * @property {Number} branchAngle1 - Fixed Angle 1
 * @property {Number} branchAngle1RandomFrom - Random Angle 1 from
 * @property {Number} branchAngle1RandomTo - Random Angle 1 to
 * @property {Number} branchAngle1Change - Angle change over time ( 1 or 0 )
 * @property {Number} branchAngle1ChangeDirection - Angle change direction, increase or decrease
 * @property {Number} branchAngle1ChangeValue - Angle change value to add or subtract
 * @property {Number} branchAngle2Random
 * @property {Number} branchAngle2
 * @property {Number} branchAngle2RandomFrom
 * @property {Number} branchAngle2RandomTo
 * @property {Number} branchAngle2Change
 * @property {Number} branchAngle2ChangeDirection
 * @property {Number} branchAngle2ChangeValue
 * @property {Number} branchThickness - Value to determine how quickly the branch thickens
 * @property {Number} continuousBranchGrowth - Value of which branches carry on growing after brancing
 * @property {Number} branchGrowthRate - Growth rate of branches, how much per year.
 */
class FractalTreeDNA {
	/**
	 * Create a new DNA strand with some default settings
	 */
	constructor() {
		this.genes = [];
		this.genesMap = [];
		this.genes.push(new FractalTreeGene("maxBranches", 512, 5000, 15));
		this.genes.push(new FractalTreeGene("branchAngle1Random", 0, 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle1", 15, 150, -150));
		this.genes.push(new FractalTreeGene("branchAngle1RandomFrom", 5, 150, -150));
		this.genes.push(new FractalTreeGene("branchAngle1RandomTo", 30, 150, -150));
		this.genes.push(new FractalTreeGene("branchAngle1Change", 0, 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle1ChangeDirection", 0, 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle1ChangeValue", 2, 20, 0));
		this.genes.push(new FractalTreeGene("branchAngle2Random", 0, 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle2", 15, 150, -150));
		this.genes.push(new FractalTreeGene("branchAngle2RandomFrom", 5, 150, -150));
		this.genes.push(new FractalTreeGene("branchAngle2RandomTo", 30, 150, -150));
		this.genes.push(new FractalTreeGene("branchAngle2Change", 0, 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle2ChangeDirection", 0, 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle2ChangeValue", 2, 20, 0));
		this.genes.push(new FractalTreeGene("branchThickness", 0, 20, 0));
		this.genes.push(new FractalTreeGene("continuousBranchGrowth", 0, 20, 0));
		this.genes.push(new FractalTreeGene("branchGrowthRate", 5, 20, 2));		
		this.genes.forEach( (gene) => { this.genesMap[gene.name] = gene; } );
	}
	/**
	 * Is there randomness in this DNA, check values of settings that determine this
	 */
	get isRandom() {
		return ( this.getValue("branchAngle1Random")==1 || this.getValue("branchAngle2Random")==1 );
	}
	/**
	 * Get a value from the genes array
	 *
	 * @param {String} name - Name of the gene to get the value for
	 */
	getValue(name) {
		return parseInt(this.genesMap[name].value);
	}
	/**
	 * Set a value in the genes array
	 *
	 * @param {String} name - Name of the gene to get the value for
	 * @param {Number} value - Value to set
	 */
	setValue(name, value) {
		this.genesMap[name].setValue(parseInt(value));
	}
	/**
	 * Get the full DNA strand of all the values in the genes 
	 * Encode the value from each of the genes then return the full string
	 *
	 * @returns {String} The full DNA string in GTAC format
	 */
	get dnaStrand() {
		let strand = "";		
		this.genes.forEach((gene) => { strand += gene.dnaStrand; } );
		return strand;	
	}
	/**
	 * Read and import the settings from a DNA strand. Uncompress if needed, convert letters
	 * to numbers, extract the 6 digit blocks, convert from base 4 to base 10, update the genes
	 * ...phew
	 *
	 * @param {String} dnaStrand - The DNA strand to import in GTAC or GTAC compressed format
	 */
	readDNA(dnaStrand) {
		
		/* If the dnaStrand contains numbers it needs uncompressing */
		if(/[0-9]/.test(dnaStrand)) dnaStrand = this.uncompress(dnaStrand);
		
		/**
		 * From letters to numbers @todo make a map array 
		 * Each setting has a 6 digit block /.{1,6}/g
		 * Convert from base 4 to base 10 - return in an array of values
		 */
		let final = dnaStrand.replace(/G/g, "0").replace(/T/g, "1").replace(/A/g, "2")
						.replace(/C/g, "3").match(/.{1,6}/g).map(x => parseInt(x, 4).toString(10));
				
		/**
		 * Update the settings (in order - this is bad and open to mistakes..) 
		 */
		this.setValue("maxBranches", final[0]);
		this.setValue("branchAngle1Random", final[1]);
		this.setValue("branchAngle1", final[2]);
		this.setValue("branchAngle1RandomFrom", final[3]);
		this.setValue("branchAngle1RandomTo", final[4]);
		this.setValue("branchAngle1Change", final[5]);
		this.setValue("branchAngle1ChangeDirection", final[6]);
		this.setValue("branchAngle1ChangeValue", final[7]);
		this.setValue("branchAngle2Random", final[8]);
		this.setValue("branchAngle2", final[9]);
		this.setValue("branchAngle2RandomFrom", final[10]);
		this.setValue("branchAngle2RandomTo", final[11]);
		this.setValue("branchAngle2Change", final[12]);
		this.setValue("branchAngle2ChangeDirection", final[13]);
		this.setValue("branchAngle2ChangeValue", final[14]);
		this.setValue("branchThickness", final[15]);
		this.setValue("continuousBranchGrowth", final[16]);
		this.setValue("branchGrowthRate", final[17]);
	
	}
	/**
	 * Compress the string AAAACCCCTT becomes 5A4CTT
	 *
	 * @param {String} dna - The DNA string to compress
	 * @returns {String} The compressed DNA string
	 */
	compress(dna) {
		return dna.replace(/(.)\1{2,}/g, (match)=>{ 
  			return ( match.length + match.substring(0,1) );
		});
	}
	/**
	 * Uncompress the string 5A4CTT becomes AAAACCCCTT
	 *
	 * @param {String} dna - The DNA string to uncompress
	 * @returns {String} The uncompressed DNA string
	 */
	uncompress(dna) {
		return dna.replace(/([0-9]+)([A-Z])/g, (match, count, letter) => {
			return ( letter.repeat(count) );
		});
	}
}
