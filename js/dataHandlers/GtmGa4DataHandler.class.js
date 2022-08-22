import BaseDataHandler from "./BaseDataHandler.class.js"

export default class GtmGa4DataHandler extends BaseDataHandler {
  constructor(){
    super();
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