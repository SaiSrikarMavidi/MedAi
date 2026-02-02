import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, Check, X, Plus, Bell } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardBody, CardHeader } from '../components/ui/Card';

const MedicineReminder = () => {
    const [reminders, setReminders] = useState([
        {
            id: 1,
            medicineName: 'Amoxicillin',
            dosage: '500mg',
            frequency: '3 times daily',
            timing: ['8:00 AM', '2:00 PM', '8:00 PM'],
            duration: '7 days',
            startDate: '2026-02-01',
            taken: [true, true, false],
            nextDose: '8:00 PM'
        },
        {
            id: 2,
            medicineName: 'Vitamin D3',
            dosage: '1000 IU',
            frequency: 'Once daily',
            timing: ['9:00 AM'],
            duration: '30 days',
            startDate: '2026-01-15',
            taken: [true],
            nextDose: 'Tomorrow 9:00 AM'
        },
        {
            id: 3,
            medicineName: 'Aspirin',
            dosage: '75mg',
            frequency: 'Once daily',
            timing: ['7:00 AM'],
            duration: 'Ongoing',
            startDate: '2025-12-01',
            taken: [true],
            nextDose: 'Tomorrow 7:00 AM'
        }
    ]);

    const markAsTaken = (id, index) => {
        setReminders(reminders.map(reminder => {
            if (reminder.id === id) {
                const newTaken = [...reminder.taken];
                newTaken[index] = true;
                return { ...reminder, taken: newTaken };
            }
            return reminder;
        }));
    };

    const markAsSkipped = (id, index) => {
        setReminders(reminders.map(reminder => {
            if (reminder.id === id) {
                const newTaken = [...reminder.taken];
                newTaken[index] = false;
                return { ...reminder, taken: newTaken };
            }
            return reminder;
        }));
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container-swiss py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold text-neutral-900 mb-1">Medicine Reminders</h1>
                            <p className="text-neutral-600">Track your medication schedule</p>
                        </div>
                        <Button variant="primary" icon={<Plus className="w-5 h-5" />}>
                            Add Reminder
                        </Button>
                    </div>
                </div>
            </div>

            {/* Today's Schedule */}
            <div className="container-swiss py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Today's Schedule</h2>
                    <div className="grid gap-4">
                        {reminders.map((reminder, index) => (
                            <motion.div
                                key={reminder.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card>
                                    <CardBody>
                                        <div className="flex items-start gap-4">
                                            {/* Medicine Icon */}
                                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Pill className="w-6 h-6 text-primary-600" />
                                            </div>

                                            {/* Medicine Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-lg text-neutral-900">{reminder.medicineName}</h3>
                                                        <p className="text-sm text-neutral-600">{reminder.dosage} • {reminder.frequency}</p>
                                                    </div>
                                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                                        {reminder.duration}
                                                    </span>
                                                </div>

                                                {/* Timing Pills */}
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {reminder.timing.map((time, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${reminder.taken[idx]
                                                                    ? 'bg-green-50 border-green-200'
                                                                    : 'bg-white border-neutral-300'
                                                                }`}
                                                        >
                                                            <Clock className="w-4 h-4 text-neutral-600" />
                                                            <span className="text-sm font-medium">{time}</span>
                                                            {reminder.taken[idx] && (
                                                                <Check className="w-4 h-4 text-green-600" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Next Dose Info */}
                                                <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
                                                    <Bell className="w-4 h-4" />
                                                    <span>Next dose: <strong>{reminder.nextDose}</strong></span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    {reminder.timing.map((time, idx) => (
                                                        !reminder.taken[idx] && (
                                                            <div key={idx} className="flex gap-2">
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    icon={<Check className="w-4 h-4" />}
                                                                    onClick={() => markAsTaken(reminder.id, idx)}
                                                                >
                                                                    Taken
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    icon={<X className="w-4 h-4" />}
                                                                    onClick={() => markAsSkipped(reminder.id, idx)}
                                                                >
                                                                    Skip
                                                                </Button>
                                                            </div>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Weekly Overview */}
                <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Weekly Overview</h2>
                    <Card>
                        <CardBody>
                            <div className="grid grid-cols-7 gap-2">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                    <div key={day} className="text-center">
                                        <div className="text-sm font-medium text-neutral-600 mb-2">{day}</div>
                                        <div className={`w-full h-24 rounded-lg flex items-center justify-center ${index === 2 ? 'bg-primary-100 border-2 border-primary-600' : 'bg-neutral-100'
                                            }`}>
                                            <div className="text-center">
                                                <div className="text-2xl font-semibold text-neutral-900">{index + 1}</div>
                                                <div className="text-xs text-neutral-600 mt-1">
                                                    {index < 2 ? '100%' : index === 2 ? '67%' : '-'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MedicineReminder;
