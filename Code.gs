var domainName = 'vti.com.vn';


var GroupSheetWidthArray = [100,300,300];
var GroupSheetHeaderArray = ["Type","Email","User Name"];
var GroupSheetFormat = new SheetFormat(GroupSheetHeaderArray,GroupSheetWidthArray);
var AllGroupSheetWidthArray = [300,300,50,300];
var AllGroupSheetHeaderArray = ["Group Name","Email","Member Counts","Link"];
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
}


function exportMailList(){
  //var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  //var allGroupsSheet = spreadSheet.getSheetByName("AllGroups");
  var spreadSheet = SpreadsheetApp.create("2018-12 VJP Mail List");
  allGroupsSheet = spreadSheet.insertSheet("AllGroups");
  var vjpGroups = getVJPGroups();
  var allUserList = listAllUsers();
  var allGroupList = listAllGroups();
  
  Logger.log(AllGroupSheetFormat.headerArray);
  AllGroupSheetFormat.applyFormat(allGroupsSheet);
  writeAllGroup(vjpGroups, allGroupsSheet);
  
  for (var i=0;i<vjpGroups.length;i++){
    group = vjpGroups[i];
    var groupSheet = spreadSheet.getSheetByName(group.name);
    if(groupSheet== null)
      groupSheet = spreadSheet.insertSheet(group.name);
    GroupSheetFormat.applyFormat(groupSheet);
    members = listAllMembers(group.email);
    for (var j=1; j<=members.length;j++){
      member = members[j];
      memberInfo = searchInList(member.email,allUserList,"primaryEmail");
      if(memberInfo != null){
        groupSheet.getRange(j+1,3).setValue(memberInfo.name.fullName);
        groupSheet.getRange(j+1,1).setValue("USER");
      } else {
        memberInfo = searchInList(member.email,allGroupList, "email");
        if (memberInfo != null) {
          groupSheet.getRange(j+1,3).setValue(memberInfo.name);
          groupSheet.getRange(j+1,1).setValue("GROUP");

        } 
      }
      groupSheet.getRange(j+1,2).setValue(member.email);
    }
    allGroupsSheet.getRange(i+2, 4).setValue('=HYPERLINK("#gid='+groupSheet.getSheetId()+'","'+group.name+'")');
  }
  
  
  //var oldSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  //var vjpOldGroup =  getGroupFromSheet (spreadSheet.getSheetByName("AllGroups"));
  //var oldAllUserList = 
}



function writeAllGroup (allGroups, allGroupsSheet){
   for (var i=0;i<allGroups.length;i++){
     group = allGroups[i];
     allGroupsSheet.getRange(i+2, 1).setValue(group.name);
     allGroupsSheet.getRange(i+2, 2).setValue(group.email);
     allGroupsSheet.getRange(i+2, 3).setValue(group.directMembersCount);
   }
}

function writeOneGroup (group, groupSheet){
  initGroupSheet(groupSheet);
  members = listAllMembers(group.email);
  for (var j=0; j<members.length;j++){
    member = members[j];
    memberInfo = searchInList(member.email,allUserList,"primaryEmail");
    if(memberInfo != null){
      groupSheet.getRange(j+1,3).setValue(memberInfo.name.fullName);
      groupSheet.getRange(j+1,1).setValue("USER");
    } else {
      memberInfo = searchInList(member.email,allGroupList, "email");
      if (memberInfo != null) {
        groupSheet.getRange(j+1,3).setValue(memberInfo.name);
        groupSheet.getRange(j+1,1).setValue("GROUP");
      } 
    }
    groupSheet.getRange(j+1,2).setValue(member.email);
  }
}

function getMailList() {
  var groups = GroupsApp.getGroups();
  Logger.log('You are a member of %s Google Groups.', groups.length);
   
}

function getVJPGroups(){
  var pageToken;
  var page;
  var groupList = [];
  do {
    page = AdminDirectory.Groups.list({
      domain: domainName ,
      pageToken: pageToken
    });
    //Logger.log(page);
    var groups = page.groups;
    //Logger.log(groups);

    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        if(group.email.indexOf("vjp")>-1){
          groupList.push(group);
          Logger.log('%s (%s)', group.name, group.email);
        }
      }
    } else {
      Logger.log('No groups found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return groupList;
}

function readVJPGroupsFromSheet(sheet){
  
}


/**
  * @desc  List all mail in a group
  * @param string groupKey 
  * @return array - array of all mail in group
*/
function listAllMembers(groupKey) {
  var pageToken;
  var page;
  var memberList = [];
  Logger.log(groupKey);
  do {
    page = AdminDirectory.Members.list(groupKey,{
      pageToken: pageToken
    });
    var members = page.members;
    if (members) {
      for (var i = 0; i < members.length; i++) {
        var member = members[i];
        memberList.push(member);
        Logger.log('%s (%s)', member.id, member.email);
      }
    } else {
      Logger.log('No users found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return memberList;
}

/**
  * @desc  List all users in a domain defined globally
  * @param none
  * @return array - array of all users in domain
*/
function listAllUsers() {
  var pageToken;
  var page;
  var userList=[];
  do {
    page = AdminDirectory.Users.list({
      domain: domainName ,
      orderBy: 'givenName',
      pageToken: pageToken
    });
    var users = page.users;
    if (users) {
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        userList.push(user);
        Logger.log('%s (%s)', user.name.fullName, user.primaryEmail);
      }
    } else {
      Logger.log('No users found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return userList;
}

function searchInList(element,elementList,searchIn){
  for (var i=0;i<elementList.length;i++)
    if(elementList[i][searchIn] == element)
      return elementList[i];
  return null;
}

/**
  * @desc  List all mail in a group
  * @param string groupKey 
  * @return array - array of all mail in group
*/
function listAllGroups() {
  var pageToken;
  var page;
  var groupList = [];
  do {
    page = AdminDirectory.Groups.list({
      domain: domainName,
      pageToken: pageToken
    });
    var groups = page.groups;
    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        groupList.push(groups[i]);
        Logger.log('%s (%s)', group.name, group.email);
      }
    } else {
      Logger.log('No groups found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return groupList;
}

