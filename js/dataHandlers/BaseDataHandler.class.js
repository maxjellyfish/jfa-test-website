export default class BaseDataHandler{
  constructor(target){
    this.target = target
  }

  transform(ob){
    console.error("transform Method not implemented")
  }

  push(ob){
    console.error("push Method not implemented")
  }

}