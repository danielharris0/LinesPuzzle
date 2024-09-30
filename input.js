
function onDrag(x, y) {
    if (currentDraggingLine!=null) {
      var point = new DOMPoint(x, y);
      point = point.matrixTransform(svg.getScreenCTM().inverse());
      var isLeft = currentDraggingLine[1]==null;
  
      for (var i=0; i<puzzle.clues.length; i++) {
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
    for (var i=0; i<puzzle.clues.length; i++) {
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
  
      for (var i=0; i<puzzle.clues.length; i++) {
  
        if (isMouseSelectingLabel(x,y,i,isLeft)) {

          var L = i; var R = currentDraggingLine[2];
          if (!isLeft) {L = currentDraggingLine[1]; R= i;}

          if (inTutorial && !isTriviaCorrect(L,R)) {
            window.alert("===Tutorial===\n\"" + puzzle.answers[R] + "\" does not answer \"" + puzzle.clues[L] + "\"\n\nThis is not a possible connection.");
          } else {
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

              lineEls[lineEls.length] = [currentDraggingLine[0], L, R];
      
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
      }
  
      currentDraggingLine[0].remove();
    }
  
    currentDraggingLine = null;
  }

  function helpButtonPressed() {
    if (inTutorial ) {
      if (window.confirm("Sure you want to skip the tutorial?")) endTutorial();
    } else {
      startTutorial();
    }
  }

  function modeSwitchButtonPressed() {
    if (inTutorial && pencilMode && pencilLineEls.length!=puzzle.numPossibleLines) {
      window.alert("===Tutorial===\nYou have not marked all possible connections.\n\nThis tutorial will not let you progress until you do.")
    } else {
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
  }

  function isTriviaCorrect(l, r) {
    for (var i=0; i<puzzle.clueSolutions.length; i++) {
      var L = puzzle.clueSolutions[i][0]; var R = puzzle.clueSolutions[i][1];
      if (L==l && R==r)  return true;
    }
    return false;
  }

  function checkButtonPressed() {
    if (lineEls.length<puzzle.numLines) {
      window.alert("Connect every clue before checking your answer." + (pencilMode ? "\n\nBe sure to use \"Answer Mode\" (solid lines instead of dashed pencil). Exit \"Penil Mode\" by pressing the top \"Pencil Mode\" label." : ""));
    } else {

      if (!inTutorial && numAttempts==0) {
        if (!window.confirm("Are you sure you want to check your answers?\nThis will increase your attempts counter.")) return;
      }

      numAttempts++;

      document.getElementById('attemptsCounter').innerHTML = "Attempts: " + numAttempts;

      var incorrect = []
      lineEls.forEach((lineEl) => {

        var correct = false;

        if (puzzle.counter!=null && lineEl[1]==puzzle.counter.id) { //If line connects to the 'X' label
          for (var i=0; i<puzzle.predicates.length; i++) {
            if (lineEl[2] == puzzle.predicates[i].id && puzzle.predicates[i].function(numIntersections)) {
              correct = true;
              break;
            }
          }
        } else correct = isTriviaCorrect(lineEl[1], lineEl[2]); //Otherwise check normal trivia     

        if (!correct) incorrect.push([lineEl[0], lineEl[1], lineEl[2]])
      });

      incorrect.forEach((lineEl) => {
        lineEl[0].animate([{stroke: "red"}, {stroke:"black"}], {duration: 250,iterations: 10})
      });

      if (incorrect.length==0) {
        window.alert("Well done!")

        if (inTutorial) endTutorial();
      }
    }
  }