
function onDrag(x, y) {
    if (currentDraggingLine!=null) {
      var point = new DOMPoint(x, y);
      point = point.matrixTransform(svg.getScreenCTM().inverse());
      var isLeft = currentDraggingLine[1]==null;
  
      for (var i=0; i<12; i++) {
        if (isMouseSelectingLabel(point.x, point.y, i, isLeft)) {
          var position = getLabelConnectorPosition(i, isLeft);
  
          //Complete currentdraggingline
          if (isLeft) currentDraggingLine[1] = i;
          else currentDraggingLine[2] = i;
  
          if (!pencilMode && (!lastWasSnapped || position[1]!=currentDraggingLine[0].getAttribute('y2'))) {
            updateNumIntersections();
          }
  
          lastWasSnapped = true;
  
          //Reset
          if (isLeft) currentDraggingLine[1] = null;
          else currentDraggingLine[2] = null; 
  
          currentDraggingLine[0].setAttribute('x2', position[0]);
          currentDraggingLine[0].setAttribute('y2', position[1]);
          return;
        }
      }
  
      if (lastWasSnapped) {
        updateNumIntersections();
      }
      lastWasSnapped = false;
  
      currentDraggingLine[0].setAttribute("x2", point.x)
      currentDraggingLine[0].setAttribute("y2", point.y)
  
  
    }
  }

  function onDragStart(x, y) {
    for (var i=0; i<12; i++) {
      for (var j=0; j<2; j++) {
        var isLeft = j==0;
        if (isMouseSelectingLabel(x,y, i, isLeft)) {
  
          var lineID = getConnectedLine(i, isLeft)
  
          if (!pencilMode && lineID!=null) {
            lineEls[lineID][0].remove();
            lineEls.splice(lineID,1);
            updateNumIntersections();
          }
  
          var position = getLabelConnectorPosition(i, isLeft);
          var lineEl = addSVGElement('line', {"class":pencilMode ? "pencilLine" : "connectorLine", x1:position[0], y1:position[1], x2:position[0], y2:position[1]});
          if (isLeft) currentDraggingLine = [lineEl, i, null];
          else currentDraggingLine = [lineEl, null, i];
          return; 
          
  
        }
      }
    }
  }

  function onDragEnd() {
    if (currentDraggingLine!=null) {
  
      var x = currentDraggingLine[0].getAttribute('x2');
      var y = currentDraggingLine[0].getAttribute('y2');
      var isLeft = currentDraggingLine[1]==null;
  
      for (var i=0; i<12; i++) {
  
        if (isMouseSelectingLabel(x,y,i,isLeft)) {
  
        //Remove existing connections
          var connectedLineID = getConnectedLine(i, isLeft);
          if (!pencilMode && connectedLineID!=null) {           
            for (var j=0; j<lineEls.length; j++) {
              if (isLeft && lineEls[j][1]==i) {lineEls[j][0].remove(); lineEls.splice(j,1); break;}
              if (!isLeft && lineEls[j][2]==i) {lineEls[j][0].remove(); lineEls.splice(j,1); break;}
            }
          }
  
          var position = getLabelConnectorPosition(i, isLeft);
          currentDraggingLine[0].setAttribute('x2', position[0]);
          currentDraggingLine[0].setAttribute('y2', position[1]);
  
          //Add to lines
          if (!pencilMode) {
            if (isLeft) lineEls[lineEls.length] = [currentDraggingLine[0], i, currentDraggingLine[2]];
            else lineEls[lineEls.length] = [currentDraggingLine[0], currentDraggingLine[1], i];
    
            updateNumIntersections();
          } else {
            var left = currentDraggingLine[1]; var right = i;
            if (isLeft) {left = i; right = currentDraggingLine[2];}

            var found = false;
            for (var j=0; j<pencilLineEls.length; j++) {
              if (pencilLineEls[j][1] == left && pencilLineEls[j][2]==right) {
                pencilLineEls[j][0].remove();
                pencilLineEls.splice(j,1);
                found = true;
                currentDraggingLine[0].remove();
                break;
              }
            }

            if (!found) pencilLineEls[pencilLineEls.length] = [currentDraggingLine[0], left, right];
          }
          currentDraggingLine = null;
          return; 
        }
      }
  
      currentDraggingLine[0].remove();
    }
  
    currentDraggingLine = null;
  }

  function modeSwitchButtonPressed() {
    pencilMode = !pencilMode;
    var button = document.getElementById('modeSwitchButton');
    if (pencilMode)  {
      button.innerHTML = 'Pencil Mode';
      button.setAttribute('class','dashedButton');
    }
    else {
      document.getElementById('modeSwitchButton').innerHTML = 'Answer Mode';
      button.setAttribute('class','solidButton');
    }
  }

  function checkButtonPressed() {
    if (lineEls.length<11) {
      window.alert("Connect every clue before checking your answer." + (pencilMode ? "\n\nBe sure to use \"Answer Mode\" (solid lines instead of dashed pencil). Exit \"Penil Mode\" by pressing the top \"Pencil Mode\" label." : ""));
    } else {
      var incorrect = []
      lineEls.forEach((lineEl) => {
        var correct = false;
        for (var i=0; i<solution.length; i++) {
          if (lineEl[1]!=10 && solution[i][0]==lineEl[1] && solution[i][1]==lineEl[2]) correct = true;
          //Or... could be correct X
          if (lineEl[1]==10 && lineEl[2]==10 && numIntersections%2==0) correct = true;
          if (lineEl[1]==10 && lineEl[2]==9 && Number.isInteger(Math.sqrt(numIntersections))) correct = true;

        }
        if (!correct) incorrect.push([lineEl[0], lineEl[1], lineEl[2]])
      });

      incorrect.forEach((lineEl) => {
        lineEl[0].animate([{stroke: "red"}, {stroke:"black"}], {duration: 250,iterations: 10})
      });

      if (incorrect.length==0) {
        window.alert("Well done!")
      }
    }
  }