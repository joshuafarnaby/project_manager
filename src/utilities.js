export const generateUniqueID = () => {
  return Math.floor(Math.random() * 1000000000);
}

export const capitalise = (word) => word.substring(0, 1).toUpperCase() + word.substring(1);
