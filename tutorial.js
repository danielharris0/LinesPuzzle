var inTutorial;

function endTutorial() {
    loadPuzzle('puzzle1');
    window.alert("Final Tips:\n\n- Erase a pencil line by drawing back over it in pencil\n- Press Help to return to the tutorial")
}

function startTutorial() {
    loadPuzzle('tutorial');
    inTutorial = true;

    document.getElementById('helpButton').innerHTML = "Skip";

    addSVGElement('rect', {"class":"tutorialBox", x: 5 , y: 250, width: 420, height:470 });
    addSVGElement('text', {"class":"tutorialText", x: 390 , y: 270, style:'font-size:0.6em' }).innerHTML = "V0.8"; 


    addSVGElement('text', {"class":"tutorialTitle", x: 20 , y: 300 }).innerHTML = "Practice Puzzle!"; 
    addSVGElement('text', {"class":"tutorialText", x: 20 , y: 340 }).innerHTML = "Goal: Connect each clue (left) to an answer (right)."; 
    
    const asideStyle = 'font-style: italic; font-size: 0.9em; font-weight: 400';
    
    addSVGElement('text', {"class":"tutorialText", x: 20 , y: 370, style:'font-weight:400; font-size:0.95em'  }).innerHTML = "It helps to pencil in your candidate lines first."; 
    addSVGElement('text', {"class":"tutorialText", x: 20 , y: 450, style:'font-weight:400; font-size: 0.9em'  }).innerHTML = "Practice the pencil tool with this practice puzzle."; 
    addSVGElement('text', {"class":"tutorialText", x: 40 , y: 470, style:asideStyle  }).innerHTML = "Or skip it with the top-left button."; 

    const gap = 75;
    
    addSVGElement('line', {"class":"dividingLine", x1: 20 , y1: 490, x2: 410, y2: 490});

    addSVGElement('text', {"class":"tutorialText", x: 20 , y: 520, style:'font-size:0.9em' }).innerHTML = "Practice Puzzle Step-By-Step:"; 

    addSVGElement('text', {"class":"tutorialTextSmall", x: 20 , y: gap + 480 }).innerHTML = "1. Draw ALL connections you think are possible."; 
    addSVGElement('text', {"class":"tutorialTextSmall", x: 20 , y:gap + 500, style:'font-size: 0.9em; font-weight: 400' }).innerHTML = "(some clues may have more than one possible answer)"; 
    
    
    addSVGElement('text', {"class":"tutorialTextSmall", x: 20 , y: gap +530 }).innerHTML = "2. Switch to Answer Mode.";
    addSVGElement('text', {"class":"tutorialTextSmall", x: 20 , y: gap +550, style:'font-size: 0.9em; font-weight: 400' }).innerHTML = "(top-middle button)"; 
    
    
    addSVGElement('text', {"class":"tutorialTextSmall", x: 20 , y: gap +580 }).innerHTML = "3. Draw over your dashed pencil lines."; 
    addSVGElement('text', {"class":"tutorialTextSmall", x: 20 , y: gap +600, style:'font-size: 0.9em; font-weight: 400' }).innerHTML = "(match each clue to exactly one answer)"; 
    
    addSVGElement('text', {"class":"tutorialTextSmall", x: 20 , y: gap + 630, style:'font-style: italic; font-weight: 400' }).innerHTML = "Check your answer to progress to the main puzzle."; 
}

startTutorial();