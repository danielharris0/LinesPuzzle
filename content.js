const CONTENT = {
  tutorial : {
      numPossibleLines: 5,
      numLines : 3,
      hints : [
          "Draw a straight line from each clue (left) to an answer (right).",
          "First, use the \"Pencil Mode\" to mark all possible connections.",
          "Then switch to \"Asnwer Mode\", make your answer, and press Check."
      ],

      clues : [
          "Throws balls",
          "Tones",
          "Biker jacket",
        ],
        
        answers : [
          "pitches",
          "gets ripped",
          "hosts galas",
        ],
        
        clueSolutions : [
          [0,0], [0,2],
          [1,1], [1,0],
          [2,1]
        ]
  },

  puzzle1 : {
      numLines : 11,
      clues : [
          "Up for it",
        
          "You want to keep it level",
          "Sometimes ground",
          "Canines",
          "Follows",
          "Side of a coin",
        
          "Fruit of the ears",
          "Poker hand",
          "Way to hide evidence",
        
          "Owing nothing",
          "X",
        
          null,
        ],
        
        answers : [
          null,
        
          "head",
          "paving",
          "teeth",
          "hounds",
          "tails",
        
          "bury",
          "pair",
          "flush",
        
          "even",
          "square",
        
          "down",
        ],
        
        clueSolutions : [
          [0,11],
        
          [1,1], [1,2],
          [2,2], [2,3],
          [3,3], [3,4],
          [4,4], [4,5],
          [5,5], [5,1],
        
          [6,6], [6,7],
          [7,7], [7,8],
          [8,8], [8,6],
        
          [9,9], [9,10]
        ],

        counter : {id: 10, function: 'num intersections'},
        predicates : [
          {id: 9, function: (x) => {return x%2==0}},
          {id: 10, function: (x) => {return Number.isInteger(Math.sqrt(x))}}
        ]
        

  }
}