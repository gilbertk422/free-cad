	/**
	 * Returns the position of the cursor.
	 *
	 * @param {event} event MouseEvent
	 * @param {object} element
	 *
     * @return { x: {number}, y: {number}}
	 */
    function mouseXY(event, element){
		var posx = 0;
		var posy = 0;

		//e = window.event;
		if (!event) var event = window.event;

		if (event.pageX || event.pageY) {
			posx = event.pageX;
			posy = event.pageY;
		}
		else if (event.clientX || event.clientY) {
			posx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = event.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
		}
  
		if (element) if (element != window){
			var box = element.getBoundingClientRect(); 
			posx -= parseInt(box.left) + parseInt(pageXOffset); // + parseInt(element.style.paddingLeft);
			posy -= parseInt(box.top) + parseInt(pageYOffset);  // + parseInt(element.style.paddingTop);
		}

		//console.log(posx + '|' + posy);
		
		return {
			x: posx,
			y: posy
		}
	}


	/**
	 * Convert 2 values to 2d point
	 * 
	 * @param {float} xp X-coordinate
	 * @param {float} yp Y-coordinate
	 * @returns {object} Point object
	 */
	function coord2D(xp, yp)
	{
	   return {x:xp, y:yp};
	}
	

	//*********************************************************
	function load(link, textdata){
	   var req = getXmlHttp();
	   var data = new FormData();
	   req.open('POST', link, true);
	     data.append("data", textdata);
	   req.send(data);
	
	   req.onreadystatechange = function()
	   {
		  if (req.readyState == 4)
		  {
			if (req.status == 200)
			{
			  //var A = req.responseText.split('|');
			}
		  }
	   }
	}
	

	  //***********************************************
	  function getXmlHttp(){
	  var xmlhttp;
	  try {
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	  } catch (e) {
		try {
		  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (E) {
		  xmlhttp = false;
		}
	  }
	  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
		xmlhttp = new XMLHttpRequest();
	  }
	  return xmlhttp;
	}

	
	
	/**
	 * Add scroll functionality.
	 *
	 * @param {object} Scroll.
	 */
	function addScrollWheel(Scroll){
	
		function addHandler(object, event, handler){
			if(object.addEventListener){
				object.addEventListener(event, handler, false);
			}	else if(object.attachEvent){
					object.attachEvent('on' + event, handler);
			}	else alert("Handler does not supported");
		}


			addHandler(window, 'DOMMouseScroll', wheel);
			addHandler(window, 'mousewheel', wheel);
			addHandler(document, 'mousewheel', wheel);


		//***********************************************
		function wheel(event){
			event = event || window.event;

			if (event.wheelDelta){
				delta = event.wheelDelta / 120;

				if (window.opera){
				delta = -delta;
				}
			}	else if(event.detail){
				delta = -event.detail / 3;
			}

			if (event.preventDefault){
				event.preventDefault();
			}	else{
				event.returnValue = false;
			}

				Scroll(delta);
			}
	}




	/**
	 * Creating the window element.
	 *
	 * @param {string} type.
	 * @param {object} parent.
	 *
	 * @return {object} unit.
	 */
	function element(type, parent){
	  var unit = document.createElement(type);
// unit.setAttribute( "id", "test" );

	  unit.type = type;
	  
	  if (parent) {parent.appendChild(unit)} else {document.body.appendChild(unit);}
	  unit.parent = parent;

	  unit.style.position = 'absolute';
	  //unit.style.overflow = 'hidden';

	  //unit.style.transition = '0.1s';
	  unit.onselectstart = function(){return false}
	  //unit.ondragstart = function(){return false}

	  //*******************************************************************************************************************************************************************
	  unit.imagename = function(src){
	    if (unit.type == 'img') if (src) unit.src = src;
	    return unit
	  }

	  //*******************************************************************************************************************************************************************
	  unit.size = function(width, height){
	    if (width) unit.width = width;
		if (height) unit.height = height;
	    if (width) unit.style.width = width + 'px';
		if (height) unit.style.height = height + 'px';
	    return unit
	  }

	  //*******************************************************************************************************************************************************************
	  unit.position = function(left, top){
		unit.style.position = 'absolute';
		
		if (left) unit.left = left;
		if (top)  unit.top = top;
		
		if (left) unit.style.left = left + 'px';
		if (top)  unit.style.top = top + 'px';
		return unit
	  }

	  //*******************************************************************************************************************************************************************
	  unit.background = function(background){ unit.style.background = background; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.margin = function(margin){unit.style.marginLeft = margin + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.paddingLeft = function(padding){ unit.style.paddingLeft = padding + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.padding = function(padding){ unit.style.padding = padding + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.lineHeight = function(lineHeight){ unit.lineHeight = lineHeight; unit.style.lineHeight = lineHeight + 'px';	return unit }
	  //*******************************************************************************************************************************************************************
	  unit.text = function(text, align, lineHeight){ unit.innerHTML = text; if (align) unit.style.textAlign = align; if (lineHeight) unit.style.lineHeight = unit.height + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.border = function(border){ unit.style.border = border; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.radius = function(radius){ unit.style.borderRadius = radius + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.shadow = function(shadow_par){ /*if (!shadow_par) shadow_par = '2px 2px 12px rgb(100, 100, 100)';*/ unit.style.boxShadow = shadow_par;  return unit }
	  //*******************************************************************************************************************************************************************
	  unit.cursor = function(cursor){ unit.style.cursor = cursor; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.order = function(order){ unit.style.zIndex = order; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.show = function(){
			if (unit.visible == true) return unit;
			unit.visible = true;
			unit.style.opacity = 1;
			unit.style.display = 'block';
			return unit
	  }
	  //*******************************************************************************************************************************************************************
	  unit.hide = function(){
			unit.visible = false;
			unit.style.opacity = 0;
			unit.style.display = 'none';
			return unit
	  }

	  //*******************************************************************************************************************************************************************
	  unit.fontStyle = function(fontsize, fontname, fontcolor, fontalign, fontweight){ 
			if (fontsize) unit.style.fontSize = fontsize + 'px';
			if (fontcolor) unit.style.color = fontcolor;
			if (fontname) unit.style.fontFamily = fontname;
			if (fontalign) unit.style.textAlign = fontalign;
			if (fontweight) unit.style.fontWeight = fontweight;
			return unit
	  }

	  //*******************************************************************************************************************************************************************
	  unit.pic = function(src, recall){
			unit.src = src;
			if (recall) unit.onload = recall;

			return unit;
		 }

	  //*******************************************************************************************************************************************************************
	  unit.transition = function(transition){ unit.style.transition = transition + 's'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.opacity = function(opacity){ unit.style.opacity = opacity; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.setColor = function(color){ unit.style.color = color; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.classname = function(className){ unit.className = className; return unit}
	  //*******************************************************************************************************************************************************************

	        //*********************************************************************
			
	    return unit;
    }
	
	
	
	/**
	 * Creating the element of the input type.
	 * 
	 * @param {string} ico Image.
	 * @param {object} parent.
	 *
	 * @return {object} unit. 
	 */
	function input(ico, parent){

	  var unit = document.createElement('input');

	  unit.parent = document.createElement('div');
	  unit.parent.appendChild(unit);

		if (!parent) parent = document.body;
		parent.appendChild(unit.parent);

		unit.style.position = 'absolute';
		unit.parent.style.position = 'absolute';

		if (ico){
			unit.img = document.createElement('img');
			unit.img.src = ico;
			unit.img.style.position = 'absolute';
			unit.img.style.left = "-24px";
				unit.img.style.height = "22px";
				unit.img.style.width = "22px";
			unit.parent.appendChild(unit.img);
		}


		//unit.onselectstart = function(){return false}
		//unit.ondragstart = function(){return false}

	  //*******************************************************************************************************************************************************************
	  unit.setsize = function(width, height){
	    if (width) unit.width = width;
		if (height) unit.height = height;
	    if (width) unit.style.width = width + 'px';
		if (height) unit.style.height = height + 'px';
		
			if (unit.img){
				//unit.img.style.height = height + "px";
				//unit.img.style.width = height + "px";
				//unit.width = width + height * 1.2;
				//unit.style.width = unit.width + 'px';
			}
	    return unit
	  }

	  //*******************************************************************************************************************************************************************
	  unit.position = function(left, top){
		unit.style.position = 'absolute';
		if (left) unit.parent.style.left = left + 'px';
		if (top)  unit.parent.style.top = top + 'px';
		return unit
	  }

	  //*******************************************************************************************************************************************************************
	  unit.background = function(background){ unit.style.background = background; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.margin = function(margin){unit.style.marginLeft = margin + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.padding = function(padding){ unit.style.paddingLeft = padding + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.lineHeight = function(lineHeight){ unit.lineHeight = lineHeight; unit.style.lineHeight = lineHeight + 'px';	return unit }
	  //*******************************************************************************************************************************************************************
	  unit.text = function(text){ unit.innerHTML = text; unit.style.lineHeight = unit.height + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.border = function(border){ unit.style.border = border; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.radius = function(radius){ unit.style.borderRadius = radius + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.shadow = function(shadow_par){ /*if (!shadow_par) shadow_par = '2px 2px 12px rgb(100, 100, 100)';*/ unit.style.boxShadow = shadow_par;  return unit }
	  //*******************************************************************************************************************************************************************
	  unit.cursor = function(cursor){ unit.style.cursor = cursor; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.order = function(order){ unit.style.zIndex = order; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.show = function(){
			if (unit.visible == true) return unit;
			unit.visible = true;
			unit.style.opacity = 1;
			unit.style.display = 'block';
			return unit
	  }
	  //*******************************************************************************************************************************************************************
	  unit.hide = function(){
			unit.visible = false;
			unit.style.opacity = 0;
			unit.style.display = 'none';
			return unit
	  }
	  //*******************************************************************************************************************************************************************
	  unit.fontStyle = function(fontsize, fontname, fontcolor, fontalign){ 
			if (fontsize) unit.style.fontSize = fontsize + 'px';
			if (fontcolor) unit.style.color = fontcolor;
			if (fontname) unit.style.fontFamily = fontname;
			if (fontalign) unit.style.textAlign = fontalign;
			return unit
	  }
	  //*******************************************************************************************************************************************************************
	  unit.transition = function(transition){ unit.style.transition = transition + 's'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.opacity = function(opacity){ unit.style.opacity = opacity; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.setColor = function(color){ unit.style.color = color; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.classname = function(className){ unit.className = className; return unit}  
	  //*******************************************************************************************************************************************************************

	        //*********************************************************************
			unit.padding(4);
			unit.setsize(125, 15);
			
	    return unit;
    }


	
	
	/**
	 * Creating the element of the select type.
	 * 
	 * @param {string} ico.
	 * @param {object} parent.
	 *
	 * @return {onject} unit. 
	 */
	function select(ico, parent){

	  var unit = document.createElement('select');

	  unit.parent = document.createElement('div');
	  unit.parent.appendChild(unit);

		if (!parent) parent = document.body;
		parent.appendChild(unit.parent);

		unit.style.position = 'absolute';
		unit.parent.style.position = 'absolute';


		if (ico){
			unit.img = document.createElement('img');
			unit.img.src = ico;
			unit.img.style.position = 'absolute';
			unit.img.style.left = "-24px";
				unit.img.style.height = "22px";
				unit.img.style.width = "22px";
			unit.parent.appendChild(unit.img);
		}

		//unit.onselectstart = function(){return false}
		//unit.ondragstart = function(){return false}


	  	//*********************************************
		unit.add_option = function(A) {
			for (var n = 0; n < A.length; n++){
				var op = document.createElement('option');
				//op.value = op.options.length;
				op.innerHTML = A[n];
				unit.appendChild(op);
			}
		}


	  //*******************************************************************************************************************************************************************
	  unit.setsize = function(width, height){
	    if (width) unit.width = width;
		if (height) unit.height = height;
	    if (width) unit.style.width = width + 'px';
		if (height) unit.style.height = height + 'px';
		
			if (unit.img){
				//unit.img.style.height = height + "px";
				//unit.img.style.width = height + "px";
				//unit.width = width + height * 1.2;
				//unit.style.width = unit.width + 'px';
			}
	    return unit
	  }

	  //*******************************************************************************************************************************************************************
	  unit.position = function(left, top){
		unit.style.position = 'absolute';
		if (left) unit.parent.style.left = left + 'px';
		if (top)  unit.parent.style.top = top + 'px';
		return unit
	  }

	  //*******************************************************************************************************************************************************************
	  unit.background = function(background){ unit.style.background = background; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.margin = function(margin){unit.style.marginLeft = margin + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.padding = function(padding){ unit.style.paddingLeft = padding + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.lineHeight = function(lineHeight){ unit.lineHeight = lineHeight; unit.style.lineHeight = lineHeight + 'px';	return unit }
	  //*******************************************************************************************************************************************************************
	  unit.text = function(text){ unit.innerHTML = text; unit.style.lineHeight = unit.height + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.border = function(border){ unit.style.border = border; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.radius = function(radius){ unit.style.borderRadius = radius + 'px'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.shadow = function(shadow_par){ /*if (!shadow_par) shadow_par = '2px 2px 12px rgb(100, 100, 100)';*/ unit.style.boxShadow = shadow_par;  return unit }
	  //*******************************************************************************************************************************************************************
	  unit.cursor = function(cursor){ unit.style.cursor = cursor; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.order = function(order){ unit.style.zIndex = order; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.show = function(){
			if (unit.visible == true) return unit;
			unit.visible = true;
			unit.style.opacity = 1;
			unit.style.display = 'block';
			return unit
	  }
	  //*******************************************************************************************************************************************************************
	  unit.hide = function(){
			unit.visible = false;
			unit.style.opacity = 0;
			unit.style.display = 'none';
			return unit
	  }
	  //*******************************************************************************************************************************************************************
	  unit.fontStyle = function(fontsize, fontname, fontcolor, fontalign){ 
			if (fontsize) unit.style.fontSize = fontsize + 'px';
			if (fontcolor) unit.style.color = fontcolor;
			if (fontname) unit.style.fontFamily = fontname;
			if (fontalign) unit.style.textAlign = fontalign;
			return unit
	  }
	  //*******************************************************************************************************************************************************************
	  unit.transition = function(transition){ unit.style.transition = transition + 's'; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.opacity = function(opacity){ unit.style.opacity = opacity; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.setColor = function(color){ unit.style.color = color; return unit }
	  //*******************************************************************************************************************************************************************
	  unit.classname = function(className){ unit.className = className; return unit}  
	  //*******************************************************************************************************************************************************************

	        //*********************************************************************
			unit.padding(4);
			unit.setsize(125, 21);
			
	    return unit;
    }
	