const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const { agenda, attendes, attendesLead, location, related, dateTime, notes, createFor } = req.body;
        
        // Create a new meeting
        const meeting = new MeetingHistory({
            agenda,
            attendes,
            attendesLead,
            location,
            related,
            dateTime,
            notes,
            createBy: req.user?.userId || createFor,
        });
        
        // Save the meeting to the database
        await meeting.save();
        res.status(200).json({ message: 'Meeting created successfully', meeting });
    } catch (error) {
        console.error('Failed to create meeting:', error);
        res.status(500).json({ error: 'Failed to create meeting' });
    }
}

const index = async (req, res) => {
    try {
        const query = { ...req.query, deleted: false };
        
        let meetings = await MeetingHistory.find(query)
            .populate('attendes')
            .populate('attendesLead')
            .populate('createBy')
            .sort({ timestamp: -1 });
            
        res.status(200).json({ meetings });
    } catch (error) {
        console.error('Failed to fetch meetings:', error);
        res.status(500).json({ error: 'Failed to fetch meetings' });
    }
}

const view = async (req, res) => {
    try {
        let meeting = await MeetingHistory.findOne({ _id: req.params.id, deleted: false })
            .populate('attendes')
            .populate('attendesLead')
            .populate('createBy');
            
        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }
        
        res.status(200).json(meeting);
    } catch (error) {
        console.error('Failed to fetch meeting:', error);
        res.status(500).json({ error: 'Failed to fetch meeting' });
    }
}

const deleteData = async (req, res) => {
    try {
        const meetingId = req.params.id;
        
        // Find the meeting
        const meeting = await MeetingHistory.findById(meetingId);
        
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        
        // Soft delete by setting deleted flag to true
        await MeetingHistory.updateOne({ _id: meetingId }, { $set: { deleted: true } });
        
        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        console.error('Failed to delete meeting:', error);
        res.status(500).json({ error: 'Failed to delete meeting' });
    }
}

const deleteMany = async (req, res) => {
    try {
        const meetingIds = req.body;
        
        if (!meetingIds || !Array.isArray(meetingIds) || meetingIds.length === 0) {
            return res.status(400).json({ message: 'No meeting IDs provided' });
        }
        
        // Soft delete multiple meetings
        const result = await MeetingHistory.updateMany(
            { _id: { $in: meetingIds } },
            { $set: { deleted: true } }
        );
        
        res.status(200).json({ 
            message: 'Meetings deleted successfully',
            count: result.modifiedCount
        });
    } catch (error) {
        console.error('Failed to delete meetings:', error);
        res.status(500).json({ error: 'Failed to delete meetings' });
    }
}

const update = async (req, res) => {
    try {
        const meetingId = req.params.id;
        const { agenda, attendes, attendesLead, location, related, dateTime, notes } = req.body;
        
        // Find the meeting
        const meeting = await MeetingHistory.findById(meetingId);
        
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        
        // Update meeting
        const updatedMeeting = await MeetingHistory.findByIdAndUpdate(
            meetingId,
            {
                agenda,
                attendes,
                attendesLead,
                location,
                related,
                dateTime,
                notes
            },
            { new: true }
        );
        
        res.status(200).json({ 
            message: 'Meeting updated successfully',
            meeting: updatedMeeting
        });
    } catch (error) {
        console.error('Failed to update meeting:', error);
        res.status(500).json({ error: 'Failed to update meeting' });
    }
}

module.exports = { add, index, view, deleteData, deleteMany, update }