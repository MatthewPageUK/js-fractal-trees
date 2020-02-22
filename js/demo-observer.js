/**
 * An observer for the Fractal Tree demo page. Sets up the DOM event listeners
 * and watches for changes in the DNA / Gene variables.
 *
 * @property {Object} dom - The 'document' instance
 * @property {FractalTreeDNA} dna - The DNA instance with all the settings
 * @property {DOMElement} dnaStrand - The DOM element containing the full DNA strand
 * @property {DOMElement} dnaCompressed - The DOM element containing the compressed DNA strand
 * @property {Interval} interval - The interval timer for the loop
 * @property {Object[]} observables - An array of observable genes / settings / variables, along with lastValue
 * @property {Object[]} - observablesMap - Array with lookup keys based on gene.name
 */
class DemoObserver {

	/**
	 * Make a new observer and setup the event listeners
	 *
 	 * @param {Object} dom - The 'document' instance
 	 * @param {FractalTreeDNA} dna - The DNA instance with all the settings
	 */
	constructor(dom, dna) {
		this.dom = dom;
		this.dna = dna;
		this.dnaStrand = document.getElementById("dnaStrand");
		this.dnaCompressed = document.getElementById("dnaCompressed");
		this.interval = false;
		this.observables = [];
		this.observablesMap = [];
		
		this.dna.genes.forEach((gene) => {

			/* Setup the DOM event listeners */
			let element = this.dom.getElementById(gene.name);
			element.addEventListener("change", ()=>{
				this.receiveUpdatedMessage("dom", element.id);
			});
			
			/* Add this gene to the observables list and map */
			this.observables.push( { gene: gene, lastValue: 0 } );
			this.observablesMap[gene.name] = this.observables[this.observables.length-1];
		});		
	}
	/**
	 * Start listening for changes in the obervables
	 *
	 * @param {Number} ms - Time between checks
	 */
	listen(ms) {
		this.interval = setInterval(()=>{ this.checkForChange(); } , ms);
	}
	/**
	 * Check the gene variables for changes 
	 */
	checkForChange() {
		this.observables.forEach( (observe) => {
			if(observe.lastValue != observe.gene.value) {
				this.receiveUpdatedMessage("dna", observe.gene.name);
			}
		});
	}
	/**
	 * Receive a message from the DOM or the DNA class about a setting update
	 *
	 * @param {String} from - dom or dna, source of the message
	 * @param {String} name - The name of the setting
	 */
	receiveUpdatedMessage(from, name) {	
		
		let domElement = this.dom.getElementById(name);
		let domValue = domElement.value;
		let dnaValue = this.dna.getValue(name);

		if(from == "dom") {
			
			/* Something in the DOM has been updated, update the DNA */
			if(domElement.type == "checkbox" || domElement.type == "radio") {
				this.dna.setValue(name, ((domElement.checked)?1:0));
			} else {
				this.dna.setValue(name, domValue);	
			}
			this.observablesMap[name].lastValue = this.dna.getValue(name);

		} else if(from == "dna") {

			/* Something in the DNA has been updated, update the DOM */
			this.observablesMap[name].lastValue = dnaValue;		
			if(domElement.type == "checkbox" || domElement.type == "radio") {
				domElement.checked = (dnaValue==1)?true:false;
			} else {
				domElement.value = dnaValue;
			}
		}
		/* Update the DNA string DOM elements */
		this.dnaStrand.textContent = this.dna.dnaStrand.replace(/(.{6})/g, '$1 ');
		this.dnaCompressed.innerHTML = `<a href="http://mjp.co/js/trees/?dna=${this.dna.compress(this.dna.dnaStrand)}">
			http://mjp.co/js/trees/?dna=${this.dna.compress(this.dna.dnaStrand)}</a>`;
		document.getElementById("maxBranchesDNA").textContent = `${this.dna.genesMap['maxBranches'].dnaStrand}`;
		document.getElementById("branchAngle1DNA").textContent = ` 
			${this.dna.genesMap['branchAngle1'].dnaStrand} ${this.dna.genesMap['branchAngle1Random'].dnaStrand} 
			${this.dna.genesMap['branchAngle1RandomFrom'].dnaStrand} ${this.dna.genesMap['branchAngle1RandomTo'].dnaStrand}`;
		// inc dec amoutn
		document.getElementById("branchAngle2DNA").textContent = ` 
			${this.dna.genesMap['branchAngle2'].dnaStrand} ${this.dna.genesMap['branchAngle2Random'].dnaStrand} 
			${this.dna.genesMap['branchAngle2RandomFrom'].dnaStrand} ${this.dna.genesMap['branchAngle2RandomTo'].dnaStrand}`;
	}
}
