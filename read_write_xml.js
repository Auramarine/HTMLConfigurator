
var boxes = [];

/**
 *  Verify is needed in the readXML
 */
function verify() 
{ 
	// 0 Object is not initialized 
	// 1 Loading object is loading data 
	// 2 Loaded object has loaded data 
	// 3 Data from object can be worked with 
	// 4 Object completely initialized 
	if (xmlDocMS.readyState != 4) 
	{ 
	return false; 
	} 
}

/**
 * Read the source XML
 */
function readXML(xml, firefox, contents) {
	console.log("Read XML");
					
	var xmlDoc;
	
	if (contents) {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString(contents,"text/xml");
	} else if (firefox === true) {
		xmlDoc = xml.responseXML;
	} else {		
		xmlDoc = xml.documentElement;
	}
	
	//process node values
	var step;
	for (step = 0; step < xmlDoc.getElementsByTagName("box").length; step++) {
		
		//read element details
		var element = xmlDoc.getElementsByTagName("box")[step];
		//populate the data
		var title = element.getElementsByTagName("question")[0].childNodes[0].nodeValue;
		console.log(title);
		var id = element.getElementsByTagName("id")[0].childNodes[0].nodeValue;
		var button1 = element.getElementsByTagName("button1")[0].childNodes[0].nodeValue;
		if (button1 === "blank") {
			button1 = null;
		}
		var button2 = element.getElementsByTagName("button2")[0].childNodes[0].nodeValue;
		if (button2 === "blank") {
			button2 = null;
		}
		var goto1 = element.getElementsByTagName("goto1")[0].childNodes[0].nodeValue;
		if (goto1 === "blank") {
			goto1 = null;
		}
		var goto2 = element.getElementsByTagName("goto2")[0].childNodes[0].nodeValue;
		if (goto2 === "blank") {
			goto2 = null;
		}
		var x = element.getElementsByTagName("x")[0].childNodes[0].nodeValue;
		if (x === "blank") {
			x = "";
		}
		var y = element.getElementsByTagName("y")[0].childNodes[0].nodeValue;
		if (y === "blank") {
			y = "";
		}

		//save element to the array
		var sel = {getid:id, getquestion:title, getbutton1:button1, getbutton2:button2, 
			getgoto1:goto1, getgoto2:goto2, getx:x, gety:y };
		boxes.push(sel);
	}
	
	console.log("Done read XML");
	
	//return the whole as string
	if (xml) {
		if (firefox === false) {
			return xml.xml
		}
		return new XMLSerializer().serializeToString(xmlDoc.documentElement);
	}
}

/**
 * Save the XML by first using the XMLWriter and then by invoking a save dialog
 */
function saveXML() {
	/*
	*	Create XML
	*/
	console.log("Create XML");
	
	var xw = new XMLWriter('UTF-8');
	xw.formatting = 'indented';//add indentation and newlines
	xw.indentChar = ' ';//indent with spaces
	xw.indentation = 2;//add 2 spaces per level
	
	xw.writeStartDocument( );
	//xw.writeDocType('"items.dtd"');
	xw.writeStartElement( 'boxes' );
	
	//loop all the boxes to the xml
	var i;
	for (i = 0; i < boxes.length; i++) {
		if (boxes[i].getquestion && boxes[i].getid) {
			xw.writeStartElement('box');
				xw.writeElementString('question', boxes[i].getquestion);
				xw.writeElementString('id', boxes[i].getid);
				
				if (boxes[i].getgoto1) {
					xw.writeElementString('goto1', boxes[i].getgoto1);
				}
				else {
					xw.writeElementString('goto1', "blank");
				}
				if (boxes[i].getgoto2) {
					xw.writeElementString('goto2', boxes[i].getgoto2);
				}
				else {
					xw.writeElementString('goto2', "blank");
				}
				if (boxes[i].getbutton1) {
					xw.writeElementString('button1', boxes[i].getbutton1);
				}
				else {
					xw.writeElementString('button1', "blank");
				}
				if (boxes[i].getbutton2) {
					xw.writeElementString('button2', boxes[i].getbutton2);
				}
				else {
					xw.writeElementString('button2', "blank");
				}
				if (boxes[i].getx) {
					xw.writeElementString('x', boxes[i].getx + "");
				}
				else {
					xw.writeElementString('x', "blank");
				}
				if (boxes[i].gety) {
					xw.writeElementString('y', boxes[i].gety + "");
				}
				else {
					xw.writeElementString('y', "blank");
				}
			xw.writeEndElement();
		}
	}
		
	xw.writeEndDocument();
	
	var xml = xw.flush(); //generate the xml string
	xw.close();//clean the writer
	xw = undefined;//don't let visitors use it, it's closed
	
	var file = new Blob([xml], {
		type: 'text/plain'
	});
	
	console.log("Done XML");

	/*
	*	Save XML
	*/
	console.log("Save XML");
	var fileFullName = 'source.xml';
	if (!file) {
		throw 'Blob object is required.';
	}

	if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
		return navigator.msSaveOrOpenBlob(file, fileFullName);
	} else if (typeof navigator.msSaveBlob !== 'undefined') {
		return navigator.msSaveBlob(file, fileFullName);
	}

	var hyperlink = document.createElement('a');
	hyperlink.href = URL.createObjectURL(file);
	hyperlink.download = fileFullName;

	hyperlink.style = 'display:none;opacity:0;color:transparent;';
	(document.body || document.documentElement).appendChild(hyperlink);

	if (typeof hyperlink.click === 'function') {
		hyperlink.click();
	} else {
		hyperlink.target = '_blank';
		hyperlink.dispatchEvent(new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true
		}));
	}

	(window.URL || window.webkitURL).revokeObjectURL(hyperlink.href);
					
	console.log("Done save");
}