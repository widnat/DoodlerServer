export enum PresenterComponent {
    StartGame,
    CreateAssignment,
    FirstGuess,
    SecondGuess,
    Results
  }

  export enum PlayerComponent {
    JoinGame,
    CreateAssignmentDoodle,
    WaitingForOtherPlayers,
    PlayersFirstGuess,
    PlayersSecondGuess
  }

  export enum MessageType {
    GameIndex,
    AddPlayer,
    SubmitAssignmentDoodle,
    SubmitFirstGuess,
    SubmitSecondGuess,
    PlayerId,
    CreateDoodle,
    WaitingForOtherPlayers,
    MakeAGuess,
    ChooseYourAnswer
  }