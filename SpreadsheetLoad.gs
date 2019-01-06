function AllGroupInfo(AllGroupList,AllGroupListInfo){
  this.allGroupList = AllGroupList;
  this.allGroupListInfo = AllGroupListInfo;
  this.compare = function allGroupInfo(){
    //This will return all the different element in two group
    var allGroupListDiff = new Object();
    return allGroupListDiff;
  };
  

}

function loadInfoFromSpreadsheet(){
  var s = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1FKLKuSo9sNqgdZzrORf6Bh9Fa9zsb3cPto43kM01i5M/edit");
  sheet = s.getSheetByName("AllGroups");
  var mailGroupList = loadSpreadsheet(sheet, AllGroupSheetFormat);
  var allGroupMailListInfo = new Object();
  allGroupMailListInfo["AllGroups"] = mailGroupList;
  for (var i=0;i<mailGroupList.length;i++){
    groupSheet = s.getSheetByName(mailGroupList[i]["Name"]);
    var groupMailList = loadSpreadsheet(groupSheet,GroupSheetFormat);
    allGroupMailListInfo[mailGroupList[i]["Name"]] = groupMailList;
  }
  Logger.log(allGroupMailListInfo);
  return allGroupMailListInfo;
}

function writeDiffToSpreadsheet(sheet, diff){
  for (var a in diff.addedList){
    var addedItem = diff.addedList[a]; 
    var appendRow = ["＋",addedItem["Email"], addedItem["Name"],"Added"];
    sheet.appendRow(appendRow);
    sheet.getRange(sheet.getLastRow(),1,1,appendRow.length).setFontColor("green").setFontStyle("italic");
  }
  
  for (var a in diff.deletedList){
    var deletedItem = diff.deletedList[a];
    var appendRow = ["－", deletedItem["Email"], deletedItem["Name"],"Deleted"];
    sheet.appendRow(appendRow);
    sheet.getRange(sheet.getLastRow(),1,1,appendRow.length).setFontColor("red").setFontStyle("italic");
  }
  sheet.autoResizeColumns(1, 4);
}

function loadSpreadsheet(sheet, sheetFormat) {
  var list = [];
  if (sheet.getLastRow()>sheetFormat.startLineNumber){
    var data = sheet.getRange(sheetFormat.startLineNumber,1,sheet.getLastRow()-sheetFormat.startLineNumber+1,sheet.getLastColumn()).getValues();
    for( var i=0;i<data.length;i++) {
      var obj = new Object();
      for (var j=0;j<sheetFormat.headerArray.length;j++){
        obj[sheetFormat.headerArray[j]] = data[i][j];
      }
      list[i] = obj; 
    }
  }
  return list;
}

function loadGroupMailListSpreadsheet() {
}
