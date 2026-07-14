// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title HabitProof
/// @notice Tamper-proof habit streaks. Each user owns a set of habits;
///         checking in once per day extends a streak that no one but the
///         chain can reset. All state is public and verifiable.
contract HabitProof {
    struct Habit {
        string name;
        uint256 streak;
        uint256 count;
        uint256 lastCheckIn;
        uint256 createdAt;
        bool active;
    }

    /// @dev user => habitId => Habit
    mapping(address => mapping(uint256 => Habit)) public habits;
    /// @dev user => number of habits created
    mapping(address => uint256) public habitCount;

    event HabitCreated(
        address indexed user,
        uint256 indexed habitId,
        string name,
        uint256 timestamp
    );
    event CheckedIn(
        address indexed user,
        uint256 indexed habitId,
        uint256 streak,
        uint256 timestamp
    );

    /// @notice Create a new habit for the caller.
    function createHabit(string calldata name) external returns (uint256 habitId) {
        require(bytes(name).length > 0, "name required");
        habitId = habitCount[msg.sender];
        habits[msg.sender][habitId] = Habit({
            name: name,
            streak: 0,
            count: 0,
            lastCheckIn: 0,
            createdAt: block.timestamp,
            active: true
        });
        habitCount[msg.sender] = habitId + 1;
        emit HabitCreated(msg.sender, habitId, name, block.timestamp);
    }

    /// @notice Check in for today. Extends the streak if consecutive, else resets to 1.
    function checkIn(uint256 habitId) external {
        Habit storage h = habits[msg.sender][habitId];
        require(h.active, "no such habit");
        uint256 day = block.timestamp / 1 days;
        uint256 lastDay = h.lastCheckIn / 1 days;
        require(day > lastDay, "already checked in today");
        h.streak = (lastDay != 0 && day == lastDay + 1) ? h.streak + 1 : 1;
        h.count += 1;
        h.lastCheckIn = block.timestamp;
        emit CheckedIn(msg.sender, habitId, h.streak, block.timestamp);
    }
}
