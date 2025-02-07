export const parseLeetcodeQuestionName = (name: string) => {
  if (name) {
    return name.split(" ").join("_");
  }
  return "";
};

export const parseLeetcodeQuestionNameToTitle = (name: string) => {
  if (name) {
    return name.replace(/_/g, " ");
  }
  return "";
};
