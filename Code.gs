var domainName = 'vti.com.vn';


function exportMailList(){
  //var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  //var allGroupsSheet = spreadSheet.getSheetByName("AllGroups");
  var spreadSheet = SpreadsheetApp.create("2019-1 VJP Mail List");
  var allGroupsSheet = spreadSheet.insertSheet("AllGroups");
  var diffSheet = spreadSheet.insertSheet("Diff");
  spreadSheet.deleteSheet(spreadSheet.getSheetByName("Sheet1"));
  var vjpGroups = getVJPGroups();
  var allUserList = listAllUsers();
  var allGroupList = listAllGroups();
  
  Logger.log(AllGroupSheetFormat.headerArray);
  allGroupInfo = mappingDataForAllGroup(vjpGroups);
  allGroupInfoList = new Object();
  allGroupInfoList["AllGroups"] = allGroupInfo;

  for (var i=0;i<vjpGroups.length;i++){
    var group = vjpGroups[i];
    var groupSheet = spreadSheet.getSheetByName(group.name);
    if(groupSheet== null){
      groupSheet = spreadSheet.insertSheet(group.name);
    }
    members = listAllMembers(group.email);
    var data = [];
    for (var j=0; j<members.length;j++){
      var obj = new Object();
      member = members[j];
      memberInfo = searchInList(member.email,allUserList,"primaryEmail");
      if(memberInfo != null){
        obj["Type"] = "USER";
        obj["Name"] = memberInfo.name.fullName;
      } else {
        memberInfo = searchInList(member.email,allGroupList, "email");
        if (memberInfo != null) {
          obj["Type"] = "GROUP";
          obj["Name"] = memberInfo.name;
        } 
      }
      obj["Email"] = member.email;
      data[j] = obj;
    }
    GroupSheetFormat.writeWithFormat(groupSheet, data);
    allGroupInfoList[group.name] = data;
    allGroupInfo[i]["Link"] = '=HYPERLINK("#gid='+groupSheet.getSheetId()+'","'+group.name+'")';
  }
  
  
  AllGroupSheetFormat.writeWithFormat(allGroupsSheet,allGroupInfo);
  
  oldAllGroupInfoList = loadInfoFromSpreadsheet();
  
  var allGroupDiff = Utils.findDiff( oldAllGroupInfoList["AllGroups"], allGroupInfoList["AllGroups"]);
  
  if(allGroupDiff.addedList.length + allGroupDiff.deletedList.length > 0){
    diffSheet.appendRow(["AllGroups"]);
    diffSheet.getRange(diffSheet.getLastRow(),1).setFontWeight("bold");
    writeDiffToSpreadsheet(diffSheet,allGroupDiff);
  }
  
  for (var groupName in allGroupInfoList){
    if(groupName != "AllGroups"){
      var group = allGroupInfoList[groupName];

      if (oldAllGroupInfoList[groupName]!= null){
        oldGroup = oldAllGroupInfoList[groupName];
      } else {
        oldGroup = [];
      }
      
      var groupDiff = Utils.findDiff(oldGroup,group);
      
      if(groupDiff.addedList.length + groupDiff.deletedList.length > 0){
        diffSheet.appendRow([groupName]);
        diffSheet.getRange(diffSheet.getLastRow(),1).setFontWeight("bold");
        writeDiffToSpreadsheet(diffSheet,groupDiff);
      }
    }
  }
  
  //var oldSpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  //var vjpOldGroup =  getGroupFromSheet (spreadSheet.getSheetByName("AllGroups"));
  //var oldAllUserList = 
}



function mappingDataForAllGroup (allGroups){
  var mappingList = []; 
  for (var i=0;i<allGroups.length;i++){
    var group = allGroups[i]; 
    var obj = new Object();
    obj["Name"] = group.name;
    obj["Email"] = group.email;
    obj["Member Count"] = group.directMembersCount;
    mappingList[i] = obj;
  }
  return mappingList;
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

