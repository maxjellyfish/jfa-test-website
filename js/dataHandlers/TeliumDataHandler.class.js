import BaseDataHandler from "./BaseDataHandler.class.js"

export default class TeliumDataHandler extends BaseDataHandler {
  
  // Override
  transform(ob){
    return ob
  }

  // Override
  push(ob){
    // implement this!
  }
}