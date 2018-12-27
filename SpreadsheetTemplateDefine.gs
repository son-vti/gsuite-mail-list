var GroupSheetWidthArray = [100,300,300];
var GroupSheetHeaderArray = ["Type","Email","User Name"];
var GroupSheetFormat = new SheetFormat(GroupSheetHeaderArray,GroupSheetWidthArray);
var AllGroupSheetWidthArray = [300,300,50,300];
var AllGroupSheetHeaderArray = ["Group Name","Email","Member Count","Link"];
var AllGroupSheetFormat = new SheetFormat(AllGroupSheetHeaderArray,AllGroupSheetWidthArray);

function SheetFormat(headerArray,widthArray) {
  this.headerArray = headerArray;
  this.widthArray = widthArray;
  this.applyFormat = function (sheet){
    if(widthArray != null){
      for (var i=0; i<this.widthArray.length;i++){
        sheet.setColumnWidth(i+1,this.widthArray[i]);
      };
    }
    if (this.headerArray != null){
      for (var i=0; i<this.headerArray.length;i++){
        sheet.getRange(1,i+1).setValue(this.headerArray[i]);
      }
    }
  };
  
  this.readWithFormat = function (sheet){
    sheet = SpreadsheetApp.create("");
    var i = 0;
    while (sheet.getRange(2,i)!=null){
      
    }
     
  }
}



