export const withLocalStorage = (objectToInteractWith, actionToDo) => {
  let returnObject = {}
  switch (actionToDo) {
    case 'save':
      Object.keys(objectToInteractWith).forEach(key => {
        localStorage.setItem(key, JSON.stringify(objectToInteractWith[key]))
      })
      break
    case 'load':
      Object.keys(objectToInteractWith).forEach(key => {
        const item = localStorage.getItem(key)
        if(item){
          returnObject[key] = JSON.parse(item)
        }else{
          returnObject[key] = objectToInteractWith[key]
        }
      })
      break
  }
  return returnObject
}