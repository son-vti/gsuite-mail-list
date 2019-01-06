function testFunction() {
  var user1 = {name : "nerd1", org: "dev"};
  var user1a = {name : "nerd1", org: "dev"};
  var user2 = {name : "nerd2", org: "dev"};
  var user3 = {name : "nerd3", org: "dev"};
  Logger.log(Utils.findDiff([user1,user3],[user1, user2]));
}

var Utils = new Object();
Utils.compareObjects = function(o1, o2){
  return (o1["Email"] == o2["Email"]);
}; 


Utils.findDiff = function (originList, changedList) {
  var addedList = changedList.filter(function(o1){
    // filter out (!) items in result2
    return !originList.some(function(o2){
      return Utils.compareObjects(o1,o2);          // assumes unique id
    });
  });
  
  var deletedList = originList.filter(function(o1){
    // filter out (!) items in result2
    return !changedList.some(function(o2){
      return Utils.compareObjects(o1,o2);          // assumes unique id
    });
  });
  var result = new Object();
  result.addedList = addedList;
  result.deletedList = deletedList;
  return result;
}

