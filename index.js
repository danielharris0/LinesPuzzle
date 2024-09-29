var svg  = document.getElementsByTagName('svg')[0];
var svgNS = svg.getAttribute('xmlns');

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

const LABEL_WIDTH = 100;
const LABEL_HEIGHT = 50;
const DOT_RADIUS = 5;
const PADDING_X = 5;


const LABEL_VERTICAL_SPACING = 15;

var numIntersections = 0;

function updateNumIntersections() {

  var tempRemovedLine = null;

  if (currentDraggingLine!=null && currentDraggingLine[1]!=null && currentDraggingLine[2]!=null) {
    lineEls.push(currentDraggingLine);
    for (var i=0; i<lineEls.length-1; i++) {
      if (lineEls[i][1]==currentDraggingLine[1] || lineEls[i][2]==currentDraggingLine[2]) {
        tempRemovedLine = lineEls[i];
        lineEls.splice(i,1);
        break;
      }
    }
  }
  numIntersections = 0;

  /*
    Standard notation of a joint intersection:
      "Down L and Up R, any number of times, starting from (the highest point possible on the left), and the a corresponding point on the right"
        , where L and R are coprime
  */

  function standardiseIntersection(lineA, lineB) {
    var LTop= lineA; var LBottom = lineB; //LTop is the line of the two with the highest point on the left
    if (lineA[1] > lineB[1]) {LTop = lineB; LBottom = lineA; }

    var deltaL = LBottom[1] - LTop[1]; //positive deltaDownL
    var deltaR = LTop[2] - LBottom[2]; //positive deltaUpR

    //Euclid's algorithm to find highest common divisor
    var a = deltaL;
    var b = deltaR;
    while (b!=0){
      var temp = a % b;
      a = b;
      b = temp;
    }
    var hcd = a;

    deltaL/=hcd;
    deltaR/=hcd;

    var highestLeft = LTop[1];
    var lowestRight = LTop[2];
    while (highestLeft - deltaL >= 0 && lowestRight + deltaR <= 10) {
      highestLeft -= deltaL;
      lowestRight += deltaR;
    }
    
    return [deltaL, deltaR, highestLeft, lowestRight]
  }

  seenPairings = [];
  jointIntersections = [];

  for (var i=0; i<lineEls.length; i++) {
    for (var j=0; j<lineEls.length; j++) {
      var lineA = lineEls[i];
      var lineB = lineEls[j];

      if ( i!=j
        && lineA!=null && lineB!=null
        && !seenPairings.includes(j*12 + i)
        && ((lineA[1] < lineB[1] && lineA[2] > lineB[2]) || (lineA[1] > lineB[1] && lineA[2] < lineB[2]))
      ) {

        //Check not part of a joint intersection
        var jointIntersection = false;
        var standardisedIntersection = standardiseIntersection(lineA, lineB);
        for (var k=0; k<jointIntersections.length; k++) {
          var templateIntersection = jointIntersections[k];

          if (standardisedIntersection[0] == templateIntersection[0] && standardisedIntersection[1] == templateIntersection[1] && standardisedIntersection[2] == templateIntersection[2] && standardisedIntersection[3] == templateIntersection[3]) {
            jointIntersection = true;
            break;
          }
        }
        if (!jointIntersection) {
          numIntersections++;
          seenPairings.push(i*12 + j);
          jointIntersections.push (standardisedIntersection);
        }
      }
    }
  }
  XCounter.innerHTML = "X = " + numIntersections; 
  if (currentDraggingLine!=null && currentDraggingLine[1]!=null && currentDraggingLine[2]!=null) {
    lineEls.pop(); //remove the temp. added currentDraggingLine
    if (tempRemovedLine!=null) {
      lineEls.push(tempRemovedLine);
    }
  }
}

var clueEls = [];
var answerEls = [];
var lineEls = [];
var pencilLineEls = [];

var pencilMode = true;

var currentDraggingLine;

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
  if (isLeft) clueEls[i] = backgroundEl;
  else answerEls[i] = backgroundEl;

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

addSVGElement('rect', {x:"0", y:"0", width:"500", height:"920", "class":"background"});

function getLabelX(i, isLeft) {return isLeft ? 10 : 320; }
function getLabelY(i, isLeft) {return  5 + i * (LABEL_HEIGHT + LABEL_VERTICAL_SPACING); }

for (var i=0; i<12; i++) {
  if (clues[i]!='')   addLabel(getLabelX(i, true), getLabelY(i, true), clues[i], true, i);
  if (answers[i]!='') addLabel(getLabelX(i, false), getLabelY(i, false), answers[i], false, i);
}

var XCounter = addSVGElement('text', {"class":"xCounterText", x: 27 , y: 745 });
XCounter.innerHTML = "X = 0"; 

addSVGElement('text', {"class":"xCounterTextSubtitle", x: 0 , y: 767 }).innerHTML = "(num. intersections)"; 

var mouseDown = false;
addEventListener("mouseup", (event) => {
  mouseDown=false;
  onDragEnd();
});
addEventListener("mousedown", (event) => {mouseDown=true;});
addEventListener("mousemove", (event) => {
  if (mouseDown) onDrag(event.clientX, event.clientY);
});

addEventListener("pointerdown", (event) => {
  mouseDown=true;

  var point = new DOMPoint(event.clientX, event.clientY);
  point = point.matrixTransform(svg.getScreenCTM().inverse());

  onDragStart(point.x, point.y);
});
addEventListener("touchend", (event) => onDragEnd());
addEventListener("touchmove", (event) => {
  for (var i=0; i<event.touches.length; i++) {var touch = event.touches.item(i); onDrag(touch.clientX, touch.clientY); }
});



function getConnectedLine(i, isLeft) {
  for (var j=0; j<lineEls.length; j++) {
    var lineEl = lineEls[j];
    if ((isLeft && lineEl[1]==i) || (!isLeft && lineEl[2]==i)) return j;
  }
  return null;
}

var lastWasSnapped = false;


function isMouseSelectingLabel(x, y, i, isLeft) {
  var lX = getLabelX(i, isLeft); var lY = getLabelY(i, isLeft);
  if (isLeft)   return i>=0 && i<=10 && y >=lY - LABEL_VERTICAL_SPACING/2 && x <= lX + LABEL_WIDTH + PADDING_X + DOT_RADIUS*3 && y <= lY + LABEL_HEIGHT + LABEL_VERTICAL_SPACING/2;
  else return i>=1 && i<=11 && x >= lX - PADDING_X - DOT_RADIUS*3 && y >=lY - LABEL_VERTICAL_SPACING/2 && y <= lY + LABEL_HEIGHT + LABEL_VERTICAL_SPACING/2;

}

function getLabelConnectorPosition(i, isLeft) {
  if (isLeft) return [getLabelX(i, isLeft) + LABEL_WIDTH + PADDING_X + DOT_RADIUS, getLabelY(i, isLeft) + LABEL_HEIGHT/2]
  else return [getLabelX(i, isLeft) - DOT_RADIUS*2, getLabelY(i, isLeft) + LABEL_HEIGHT/2]
}



/*
- X counter
- dotted/final line toggle
- check button & reasons for wrong popup
- how to play button popup

*/