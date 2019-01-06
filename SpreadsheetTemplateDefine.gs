var GroupSheetWidthArray = [100,300,300];
var GroupSheetHeaderArray = ["Type","Email","Name"];
var GroupSheetFormat = new SheetFormat(GroupSheetHeaderArray,GroupSheetWidthArray);
var AllGroupSheetWidthArray = [300,300,50,300];
var AllGroupSheetHeaderArray = ["Name","Email","Member Count","Link"];
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
      sheet.getRange(1,1,1,headerArray.length).setValues([this.headerArray]).setFontWeight("bold");
    }
  };
  this.startLineNumber = 2;
  
  this.writeWithFormat = function (sheet, data){
    this.applyFormat(sheet);
    for (var i=0; i<data.length; i++){
      for (var j=0; j<this.headerArray.length; j++){
        sheet.getRange(i+this.startLineNumber, j+1).setValue(data[i][this.headerArray[j]]);
      }
    }
    sheet.autoResizeColumns(1,this.headerArray.length);
  }
}


