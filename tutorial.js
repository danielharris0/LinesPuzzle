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
    addSVGElement('text', {"class":"tutorialText", x: 390 , y: 270, style:'font-size:0.6em' }).innerHTML = "V0.6"; 


    addSVGElement('text', {"class":"tutorialTitle", x: 20 , y: 300 }).innerHTML = "Welcome!"; 
    addSVGElement('text', {"class":"tutorialText", x: 20 , y: 340 }).innerHTML = "This is a word puzzle."; 
    addSVGElement('text', {"class":"tutorialText", x: 20 , y: 360 }).innerHTML = "Goal: Connect each clue (left) to one answer (right)."; 
    
    const asideStyle = 'font-style: italic; font-size: 0.9em; font-weight: 400';
    
    addSVGElement('text', {"class":"tutorialText", x: 20 , y: 410, style:asideStyle  }).innerHTML = "Skip this tutorial with the top-left button."; 

    addSVGElement('line', {"class":"dividingLine", x1: 20 , y1: 450, x2: 410, y2: 450});
    
    const gap = 45;

    addSVGElement('text', {"class":"tutorialText", x: 20 , y: gap + 460 }).innerHTML = "1. Draw ALL connections you think are possible."; 
    addSVGElement('text', {"class":"tutorialText", x: 20 , y:gap + 480, style:'font-size: 0.9em; font-weight: 400' }).innerHTML = "(some clues may have more than one possible answer)"; 
    
    
    addSVGElement('text', {"class":"tutorialText", x: 20 , y: gap +520 }).innerHTML = "2. Switch to Answer Mode.";
    addSVGElement('text', {"class":"tutorialText", x: 20 , y: gap +540, style:'font-size: 0.9em; font-weight: 400' }).innerHTML = "(top-middle button)"; 
    
    
    addSVGElement('text', {"class":"tutorialText", x: 20 , y: gap +580 }).innerHTML = "3. Draw over your dashed pencil lines."; 
    addSVGElement('text', {"class":"tutorialText", x: 20 , y: gap +600, style:'font-size: 0.9em; font-weight: 400' }).innerHTML = "(match each clue to exactly one answer)"; 
    
    addSVGElement('text', {"class":"tutorialText", x: 20 , y: gap + 660, style:asideStyle }).innerHTML = "Check your answer to progress to the main puzzle."; 
}

startTutorial();