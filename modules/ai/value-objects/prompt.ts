type PromptResultType = [{ role: "system"; content: string }, { role: "user"; content: string }];

export class Prompt {
  constructor(private readonly value: string) {}

  read(): PromptResultType {
    return [
      {
        role: "system",
        content: "You are a compassionate mental health coach providing short, practical advice.",
      },
      { role: "user", content: this.value },
    ];
  }
}
