import BaseDataHandler from "./BaseDataHandler.class.js"

export default class TeliumDataHandler extends BaseDataHandler {
  constructor(){
    window.dataLayer = window.dataLayer || []
  }

  // Override
  transform(ob){
    return ob
  }

  // Override
  push(ob){
    window.dataLayer.push(ob)
  }
}