pragma solidity ^0.8.0;


struct Class {
    uint id;
    string name;
    uint at;
    uint noOfStudents;

    mapping(uint => bool) attendance;
}

contract AttendanceTracker {

    mapping(uint => Class) public classes;
    uint[] public classIds;

    function addClass(uint _id, string memory _name, uint _at, uint _noOfStudents) public {
        require(classes[_id].id == 0, "Class exists with this id");

        classes[_id].id = _id;
        classes[_id].name = _name;
        classes[_id].at = _at;
        classes[_id].noOfStudents = _noOfStudents;
        classIds.push(_id);
    }

    function getTotalClasses() public view returns (uint) {
        return classIds.length;
    }

    function markAttendance(uint _classId, uint _rollNo, bool _attendance) public {
        require(classes[_classId].id != 0, "Class doesn't exist with this id");
        classes[_classId].attendance[_rollNo] = _attendance;
    }

    function getAttendance(uint _classId, uint _rollNo) public view returns (bool) {
        require(classes[_classId].id != 0, "Class doesn't exist with this id");
        return classes[_classId].attendance[_rollNo];
    }

}