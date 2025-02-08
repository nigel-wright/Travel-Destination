// Add an item to a local storage array
export const addToLocalStorageArray = (key, item) => {
    // Get the existing array from local storage, or initialize an empty array if it doesn't exist
    let existingArray = JSON.parse(localStorage.getItem(key)) || [];
  
    // Add the new item to the array
    existingArray.push(item);
  
    // Save the updated array back to local storage
    localStorage.setItem(key, JSON.stringify(existingArray));
  }

export const addToLocalStorage = (key, item) => {
  let existing = JSON.parse(localStorage.getItem(key)) || ""
  if (existing) {
    console.warn(`${key} already exists in localStorage.`);
    return;
  }

  localStorage.setItem(key, JSON.stringify(item))
}

export const adminCheck = (user) => {
  if (user.isAdmin) {
    console.log("Is an admin!")
    return true;
  }
  return false;
}

export const verifyCheck = (user) => {
  if (user.isVerified) {
    console.log("Is verified!")
    return true;
  }
  return false;
}

const api = {
  addToLocalStorageArray,
  adminCheck, 
  verifyCheck,
  addToLocalStorage,
};


export default api;