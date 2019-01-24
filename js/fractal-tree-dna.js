/**
 * The tree DNA, plus settings and routines to convert to them and from
 * the DNA code.
 *
 * @property {Array} genes - All settings / genes in this DNA strand
 * @property {Number} maxBranches - Maximum branches the tree can grow
 * @property {Number} branchAngle1TypeFixed - Angle 1 is fixed ( 1 or 0 )
 * @property {Number} branchAngle1TypeRandom - Angle 1 is random ( 1 or 0 )
 * @property {Number} branchAngle1 - Fixed Angle 1
 * @property {Number} branchAngle1RandomFrom - Random Angle 1 from
 * @property {Number} branchAngle1RandomTo - Random Angle 1 to
 * @property {Number} branchAngle1Change - Angle change over time ( 1 or 0 )
 * @property {Number} branchAngle1ChangeDirection - Angle change direction, increase or decrease
 * @property {Number} branchAngle1ChangeValue - Angle change value to add or subtract
 * @property {Number} branchAngle2TypeFixed - See Angle 1
 * @property {Number} branchAngle2TypeRandom
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
	 * Create a new DNA thing with some default settings
	 */
	constructor() {
		this.genes = [];
		this.geneMap = [];
		this.genes.push(new FractalTreeGene("maxBranches", 512, "number", 50000, 15));
		this.genes.push(new FractalTreeGene("branchAngle1TypeFixed", 1, "checkbox", 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle1TypeRandom", 0, "checkbox", 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle1", 15, "number", 150, -150));
		this.genes.push(new FractalTreeGene("branchAngle1RandomFrom", 5, "number", 150, -150));
		this.genes.push(new FractalTreeGene("branchAngle1RandomTo", 30, "number", 150, -150));
		this.genes.push(new FractalTreeGene("branchAngle1Change", 0, "checkbox", 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle1ChangeDirection", 0, "select", 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle1ChangeValue", 2, "number", 20, 0));
		this.genes.push(new FractalTreeGene("branchAngle2TypeFixed", 1, "checkbox", 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle2TypeRandom", 0, "checkbox", 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle2", 15, "number", 150, -150));
		this.genes.push(new FractalTreeGene("branchAngle2RandomFrom", 5, "number", 150, -150));
		this.genes.push(new FractalTreeGene("branchAngle2RandomTo", 30, "number", 150, -150));
		this.genes.push(new FractalTreeGene("branchAngle2Change", 0, "checkbox", 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle2ChangeDirection", 0, "select", 1, 0));
		this.genes.push(new FractalTreeGene("branchAngle2ChangeValue", 2, "number", 20, 0));
		this.genes.push(new FractalTreeGene("branchThickness", 0, "number", 20, 0));
		this.genes.push(new FractalTreeGene("continuousBranchGrowth", 0, "number", 20, 0));
		this.genes.push(new FractalTreeGene("branchGrowthRate", 5, "number", 20, 2));		
		this.genes.forEach( (gene) => { this.geneMap[gene.name] = gene; } );
		this.observer = false;
	}
	/**
	 * Set the observer for all the genes 
	 *
	 * @param {DemoObserver} observer - An observer class (expects receiveUpdatedMessage(source,name) )
	 */
	setObserver(observer) {
		this.observer = observer;
		this.genes.forEach((gene)=>{ gene.observer = this.observer; });	
	}
	/**
	 * Is there randomness in this DNA, check values of settings that determine this
	 */
	get isRandom() {
		return ( this.getValue("branchAngle1TypeRandom")==1 || this.getValue("branchAngle2TypeRandom")==1 );
	}
	/**
	 * Get a value from the genes array
	 *
	 * @param {String} name - Name of the gene to get the value for
	 */
	getValue(name) {
		return parseInt(this.geneMap[name].value);
	}
	/**
	 * Set a value in the genes array
	 *
	 * @param {String} name - Name of the gene to get the value for
	 * @param {Number} value - Value to set
	 */
	setValue(name, value) {
console.log(`Set value ${name} , ${value}`);
		this.geneMap[name].setValue(parseInt(value));
	}
	/**
	 * Get the full DNA strand of all the values in the genes 
	 * Encode the value from each of the genes then return the full string
	 *
	 * @returns {String} The full DNA string in GTAC format
	 */
	get dnaStrand() {
		let strand = "";		
		this.genes.forEach((gene) => { strand += gene.code; } );
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
		 * Convert from base 4 to base 10 
		 */
		let final = dnaStrand.replace(/G/g, "0").replace(/T/g, "1").replace(/A/g, "2")
						.replace(/C/g, "3").match(/.{1,6}/g)
						.map(x => parseInt(x, 4).toString(10));
				
		/**
		 * Update the settings (in order - this is bad and open to mistakes..) 
		 */
		this.setValue("maxBranches", final[0]);
		this.setValue("branchAngle1TypeFixed", final[1]);
		this.setValue("branchAngle1TypeRandom", final[2]);
		this.setValue("branchAngle1", final[3]);
		this.setValue("branchAngle1RandomFrom", final[4]);
		this.setValue("branchAngle1RandomTo", final[5]);
		this.setValue("branchAngle1Change", final[6]);
		this.setValue("branchAngle1ChangeDirection", final[7]);
		this.setValue("branchAngle1ChangeValue", final[8]);
		this.setValue("branchAngle2TypeFixed", final[9]);
		this.setValue("branchAngle2TypeRandom", final[10]);
		this.setValue("branchAngle2", final[11]);
		this.setValue("branchAngle2RandomFrom", final[12]);
		this.setValue("branchAngle2RandomTo", final[13]);
		this.setValue("branchAngle2Change", final[14]);
		this.setValue("branchAngle2ChangeDirection", final[15]);
		this.setValue("branchAngle2ChangeValue", final[16]);
		this.setValue("branchThickness", final[17]);
		this.setValue("continuousBranchGrowth", final[18]);
		this.setValue("branchGrowthRate", final[19]);
	
	}
	/**
	 * Compress the string AAAACCCCTT becomes 5A4CTT
	 *
	 * @param {String} dna - The DNA string to compress
	 * @returns {String} The compressed DNA string
	 */
	compress(dna) {
		return dna.replace(/(.)\1{2,}/g, (match)=>{ 
  			return match.length + match.substring(0,1);
		});
	}
	/**
	 * Uncompress the string 5A4CTT becomes AAAACCCCTT
	 *
	 * @param {String} dna - The DNA string to uncompress
	 * @returns {String} The uncompressed DNA string
	 */
	uncompress(dna) {
		return dna.replace(/([0-9]+)([A-Z])/g, (match, p1, p2) => {
			return p2.repeat(p1);
		});
	}
}
