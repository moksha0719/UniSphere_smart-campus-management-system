import { Request, Response, NextFunction } from 'express';
import { timetableService } from '../services/timetable.service';

export class TimetableController {
  /**
   * GET /api/v1/timetable/my-schedule
   * Returns schedule for the logged in user.
   */
  async getMySchedule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const schedule = await timetableService.getMySchedule({
        role: user.role,
        studentProfileId: user.studentProfileId,
        lecturerProfileId: user.lecturerProfileId,
      });

      res.status(200).json({
        success: true,
        data: schedule,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to load timetable',
      });
    }
  }

  /**
   * GET /api/v1/timetable/rooms
   * Lists all active rooms for scheduling.
   */
  async listRooms(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rooms = await timetableService.getAllRooms();
      res.status(200).json({
        success: true,
        data: rooms,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to load rooms',
      });
    }
  }

  /**
   * POST /api/v1/timetable/slots
   * Proposes a new timetable slot with 3-tier conflict validation.
   */
  async createSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slot = await timetableService.createSlot(req.body);
      res.status(201).json({
        success: true,
        message: 'Timetable slot scheduled successfully without conflicts.',
        data: slot,
      });
    } catch (error: any) {
      // Return 409 Conflict if conflict detected, or 400 for bad input
      const isClash = error.message.includes('Clash') || error.message.includes('Conflict');
      res.status(isClash ? 409 : 400).json({
        success: false,
        message: error.message || 'Failed to create slot',
      });
    }
  }

  /**
   * DELETE /api/v1/timetable/slots/:slotId
   * Deletes a timetable slot.
   */
  async deleteSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slotId } = req.params;
      await timetableService.deleteSlot(slotId);
      res.status(200).json({
        success: true,
        message: 'Timetable slot removed successfully.',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete slot',
      });
    }
  }
}

export const timetableController = new TimetableController();
