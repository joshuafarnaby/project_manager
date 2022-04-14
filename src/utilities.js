export const generateUniqueID = () => {
  return Math.floor(Math.random() * 1000000000);
}

export const capitalise = (word) => word.substring(0, 1).toUpperCase() + word.substring(1);

export const getAllFormData = (formDataObj) => {
  const dataObj = {};

  for (let entry of formDataObj.entries()) {
    dataObj[entry[0]] = entry[1];
  }

  return dataObj
}

export const getAllLocalStorageKeys = () => {
  const keys = [];

  for (let i = 0; i < window.localStorage.length; i++) {
    keys.push(localStorage.key(i))
  }

  return keys
}