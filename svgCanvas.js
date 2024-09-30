function wrapText(text, maxWidth) {
    substrings = text.split(' ');
    var i = 0;
    var output = [];
    var current = "";
  
    var testEl = addSVGElement('text', {"class":"labelText"});
  
    while (i < substrings.length) {    
      if (current.length==0) {
        current = substrings[i];
        testEl.innerHTML = substrings[i] + ((i+1 < substrings.length) ? (' ' + substrings[i+1]) : '');
        i++;
      }
      else {
        if (testEl.getBBox().width > maxWidth) {
          testEl.innerHTML = current;
          output[output.length] = [current, testEl.getBBox()];
          current = '';
        }
        else {
          current = testEl.innerHTML;
          if (i+1 < substrings.length) testEl.innerHTML += ' ' + substrings[i+1];
          i++;
        }
      }
  
    }
    output[output.length] = [testEl.innerHTML,testEl.getBBox()];
    testEl.remove();    
    return output;
  }

function addLabel(x, y, text, isLeft, i) {
    var lines = wrapText(text,LABEL_WIDTH);
  
    var textHeight = 3;
    lines.forEach((line) => { textHeight += line[1].height-3; })
  
    var yTracker = y + (LABEL_HEIGHT-textHeight)/2 + lines[0][1].height*0.75;
    var firstTextEl; var lastTextEl;
  
    lines.forEach((line) => {
      var lineText = line[0]; var bBox = line[1];
      textEl = addSVGElement('text', {"class":"labelText", x:x + (LABEL_WIDTH-bBox.width)/2, y:yTracker});
      if (firstTextEl==null) firstTextEl = textEl;
      textEl.innerHTML = lineText;
      yTracker += bBox.height - 3;
    });
  
    backgroundEl = document.createElementNS(svgNS, 'rect');
  
    setAttributes(backgroundEl, {"class":"labelBackground", "x":x - PADDING_X, "y":y, "width":LABEL_WIDTH + PADDING_X*2, "height": LABEL_HEIGHT});
    svg.insertBefore(backgroundEl, firstTextEl);
  
    if (isLeft) addDot(x + LABEL_WIDTH + PADDING_X + DOT_RADIUS, y + LABEL_HEIGHT/2, true, i)
    else addDot(x - DOT_RADIUS*2, y + LABEL_HEIGHT/2, false, i)
  }
  
  
  function addDot(x,y,isLeft, i) {
    dotEl = addSVGElement('circle', {"class":"dot", cx:x, cy:y, r:DOT_RADIUS});
  }
  
  function addSVGElement(name, attrs ){
    var el = document.createElementNS(svgNS,name); //We need to add the elements to the same XML Namespace for SVG, otherwise they won't show up
    setAttributes(el, attrs);
    return svg.appendChild(el);
  }
  
  function setAttributes(el, attrs) {
    for (var attr in attrs)el.setAttribute(attr,attrs[attr]);
  }
  
function loadPuzzle(name) {

    //Reset globals
    puzzle = CONTENT[name];
    lineEls = [];
    pencilLineEls = [];
    currentDraggingLine = null;
    numAttempts = 0;
    inTutorial = false;

    document.getElementById('helpButton').innerHTML = "Help";
    document.getElementById('attemptsCounter').innerHTML = "Attempts: " + numAttempts;

    //Recreate svg elements
    svg.innerHTML = '';

    addSVGElement('rect', {x:"0", y:"0", width:"500", height:"920", "class":"background"});

    for (var i=0; i<puzzle.clues.length; i++) {
        if (puzzle.clues[i]!=null)   addLabel(getLabelX(i, true), getLabelY(i, true), puzzle.clues[i], true, i);
        if (puzzle.answers[i]!=null) addLabel(getLabelX(i, false), getLabelY(i, false), puzzle.answers[i], false, i);
    }
      
    if (puzzle.counter!=null) {
        XCounter = addSVGElement('text', {"class":"xCounterText", x: 27 , y: 745 });
        XCounter.innerHTML = "X = 0"; 
          
        addSVGElement('text', {"class":"xCounterTextSubtitle", x: 0 , y: 767 }).innerHTML = "(num. intersections)"; 
    }

}



  