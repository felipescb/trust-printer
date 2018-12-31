class Printer{
  constructor(){
    this.items = []
  }
  printLine(text){
    console.log(text)
    return this;
  }
  printImage(img){
    console.log(img)
    return this;
  }
  horizontalLine(){
    console.log('---------------------')
    return this;
  }
  print(cb){
    console.log('======================')
    console.log('Finished Printing!')
  }
}

['bold', 'big', 'small', 'inverse', 'left', 'center', 'right'].forEach((method) => Printer.prototype[method] = function(){
  return this;
} )


module.exports = Printer;