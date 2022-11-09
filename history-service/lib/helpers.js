import { EXPERIENCE_LEVEL } from "./constants.js"

export const calculateUserExperienceLevel = (points) => {
  if (points > 1200) {
    return EXPERIENCE_LEVEL.elite
  } else if (points > 600) {
    return EXPERIENCE_LEVEL.expert
  } else if (points > 200) {
    return EXPERIENCE_LEVEL.novice
  } else {
    return EXPERIENCE_LEVEL.beginner
  }
}