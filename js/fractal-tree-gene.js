/**
 * Fractal Tree DNA Gene - basically a setting. Linked to an HTML Dom element
 *
 * @todo - Detach from DOM element, it's only applicable when used in a DOM 
 * environment, nothing to do with the Gene itself.
 *
 * @property {String} name - The name and DOM id of this setting / gene
 * @property {number} value - The value currently assigned
 * @property {String} inputType - Type of input. number | checkbox | select
 * @property {number} maxValue - Maximum value that can be set, over this default to max
 * @property {number} minValue - Minimum value that can be set, over below default to min
 * @property {Object} domElement - The DOM element, needs to be moved from this class
 * @property {String} dnaCode - The DNA code string for this gene
 * @property {Observer} observer - Optional observer script to ineract with DOM
 * @author Matthew Page <work@mjp.co>
 */
class FractalTreeGene {
	/**
	 * Make a new gene and assign its properties
	 *
	 * @param {String} name - The name and DOM id of this setting / gene
	 * @param {number} value - The value currently assigned
	 * @param {String} type - Type of input. number | checkbox | select
	 * @param {number} max - Maximum value that can be set, over this default to max
	 * @param {number} min - Minimum value that can be set, over below default to min
	 */
	constructor(name, value, type, max, min) {
		this.name = name;
		this.value = value;
		this.inputType = type;
		this.maxValue = max;
		this.minValue = min;
		this.observer = false;
	}
	/**
	 * Set the gene value, first check its within max or min and adjust if needed
	 *
	 * @param {number} v - The value to set
	 */
	setValue(v) {
		v = Math.max(Math.min(v, this.maxValue), this.minValue);
		this.value = parseInt(v);
		if(this.observer) this.observer.receiveUpdatedMessage("dna", this.name);
	}
	/**
	 * Read a gene value and convert to a 6 character DNA strand. 
	 * Convert number to base 4, pad to 6, convert the numbers to letters G,T,A or C
	 *
	 * @param {String} name - Name of the gene to get the value from for conversion
	 */
	get code() {
		return this.value.toString(4).padStart(6, '0').replace(/0/g, "G")
				.replace(/1/g, "T").replace(/2/g, "A").replace(/3/g, "C");
	}
}