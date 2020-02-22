/**
 * Fractal Tree DNA Gene - basically a setting.
 *
 * @property {String} name - The name and DOM id of this setting / gene
 * @property {number} value - The value currently assigned
 * @property {number} maxValue - Maximum value that can be set, over this default to max
 * @property {number} minValue - Minimum value that can be set, over below default to min
 * @property {String} dnaCode - The DNA code string for this gene
 * @author Matthew Page <work@mjp.co>
 */
class FractalTreeGene {
	/**
	 * Make a new gene and assign its properties
	 *
	 * @param {String} name - The name and DOM id of this setting / gene
	 * @param {number} value - The value currently assigned
	 * @param {number} max - Maximum value that can be set, over this default to max
	 * @param {number} min - Minimum value that can be set, over below default to min
	 */
	constructor(name, value, max, min) {
		this.name = name;
		this.maxValue = max;
		this.minValue = min;
		this.value = this.maxmin(value);
	}
	/**
	 * Set the gene value, first check its within max or min and adjust if needed
	 *
	 * @param {number} v - The value to set
	 */
	setValue(v) {
		this.value = parseInt(this.maxmin(v));
	}
	/**
	 * Quick max / min function to get the value or it's max / min value 
	 *
	 * @property {number} v - The input value
	 * @returns {number} The corrected value
	 */
	maxmin(v) {
		return Math.max(Math.min(v, this.maxValue), this.minValue);
	}
	/**
	 * Read the gene value and convert to a 6 character DNA strand. 
	 * Convert number to base 4, pad to 6, convert the numbers to letters G,T,A or C
	 *
	 * @returns {String} The value after the conversion eg. GAACTT
	 */
	get dnaStrand() {
		return this.value.toString(4).padStart(6, '0').replace(/0/g, "G")
				.replace(/1/g, "T").replace(/2/g, "A").replace(/3/g, "C");
	}
}