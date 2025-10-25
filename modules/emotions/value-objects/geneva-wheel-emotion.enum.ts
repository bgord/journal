// https://en.wikipedia.org/wiki/Geneva_drive
export enum GenevaWheelEmotion {
  joy = "joy",
  pleasure = "pleasure",
  pride = "pride",
  gratitude = "gratitude",
  admiration = "admiration",
  love = "love",
  relief = "relief",
  interest = "interest",
  hope = "hope",
  surprise_positive = "surprise_positive",
  anger = "anger",
  disgust = "disgust",
  contempt = "contempt",
  hate = "hate",
  sadness = "sadness",
  fear = "fear",
  shame = "shame",
  guilt = "guilt",
  boredom = "boredom",
  surprise_negative = "surprise_negative",
}

export const PositiveEmotions = [
  GenevaWheelEmotion.joy,
  GenevaWheelEmotion.pleasure,
  GenevaWheelEmotion.pride,
  GenevaWheelEmotion.gratitude,
  GenevaWheelEmotion.admiration,
  GenevaWheelEmotion.love,
  GenevaWheelEmotion.relief,
  GenevaWheelEmotion.interest,
  GenevaWheelEmotion.hope,
  GenevaWheelEmotion.surprise_positive,
];

export const NegativeEmotions = [
  GenevaWheelEmotion.anger,
  GenevaWheelEmotion.disgust,
  GenevaWheelEmotion.contempt,
  GenevaWheelEmotion.hate,
  GenevaWheelEmotion.sadness,
  GenevaWheelEmotion.fear,
  GenevaWheelEmotion.shame,
  GenevaWheelEmotion.guilt,
  GenevaWheelEmotion.boredom,
  GenevaWheelEmotion.surprise_negative,
];
