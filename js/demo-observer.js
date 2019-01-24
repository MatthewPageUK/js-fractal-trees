class DemoObserver {

	constructor(dom, dna) {
		this.dom = dom;
		this.dna = dna;
		
		/* Setup the DOM event listeners */
		this.dna.genes.forEach((gene) => {
			let element = document.getElementById(gene.name);
			element.addEventListener("change", ()=>{
				myDemo.myDNA.receiveUpdatedMessage("dom", element.id);
			});
		});
	}
	/**
	 * Receive a message from the DOM or the DNA class about a setting update
	 *
	 * @param {String} from - dom or dna, source of the message
	 * @param {String} name - The name of the setting
	 */
	receiveUpdatedMessage(from, name) {
		// console.log(`Update from ${from} for ${name}`);
		
		if(from == "dom") {	
			if(this.dna.geneMap[name].inputType == "checkbox") {
				this.dna.setValue(name, (this.dom.getElementById(name).checked)?1:0);
			} else {
				this.dna.setValue(name, this.dom.getElementById(name).value);			
			}
		} else if(from == "dna") {
			if(this.dna.geneMap[name].inputType == "checkbox") {
				this.dom.getElementById(name).checked = (this.dna.getValue(name)==1)?true:false;
			} else {
				this.dom.getElementById(name).value = this.dna.getValue(name);
			}		
		}
	}
}
