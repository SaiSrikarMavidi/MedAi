import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Video, Calendar, Phone, MessageSquare, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import Input from '../components/ui/Input';

const DoctorConsultation = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('all');

    const specializations = [
        'All', 'General Physician', 'Cardiologist', 'Dermatologist',
        'Pediatrician', 'Psychologist', 'Orthopedic', 'Gynecologist'
    ];

    const doctors = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialization: 'General Physician',
            rating: 4.8,
            reviews: 234,
            experience: '12 years',
            availability: 'Available Now',
            distance: '2.3 km',
            consultationFee: '$50',
            image: null
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialization: 'Cardiologist',
            rating: 4.9,
            reviews: 456,
            experience: '15 years',
            availability: 'Next: 2:00 PM',
            distance: '3.1 km',
            consultationFee: '$80',
            image: null
        },
        {
            id: 3,
            name: 'Dr. Emily Rodriguez',
            specialization: 'Dermatologist',
            rating: 4.7,
            reviews: 189,
            experience: '8 years',
            availability: 'Available Now',
            distance: '1.5 km',
            consultationFee: '$60',
            image: null
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container-swiss py-6">
                    <h1 className="text-3xl font-semibold text-neutral-900 mb-1">Find a Doctor</h1>
                    <p className="text-neutral-600">Connect with qualified healthcare professionals</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container-swiss py-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by name or specialization..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search className="w-5 h-5" />}
                            />
                        </div>
                        <Button variant="outline" icon={<Filter className="w-5 h-5" />}>
                            Filters
                        </Button>
                    </div>

                    {/* Specialization Pills */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                        {specializations.map((spec) => (
                            <button
                                key={spec}
                                onClick={() => setSelectedSpecialization(spec.toLowerCase())}
                                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${selectedSpecialization === spec.toLowerCase()
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                    }`}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Doctors List */}
            <div className="container-swiss py-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {doctors.map((doctor, index) => (
                        <motion.div
                            key={doctor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card hover className="h-full">
                                <CardBody>
                                    {/* Doctor Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-semibold text-primary-600">
                                            {doctor.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-neutral-900">{doctor.name}</h3>
                                            <p className="text-sm text-neutral-600">{doctor.specialization}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium">{doctor.rating}</span>
                                                <span className="text-sm text-neutral-500">({doctor.reviews})</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Doctor Info */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{doctor.distance} away</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-neutral-600">Experience: {doctor.experience}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${doctor.availability.includes('Available')
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {doctor.availability}
                                            </span>
                                        </div>
                                        <div className="text-lg font-semibold text-primary-600">
                                            {doctor.consultationFee}
                                            <span className="text-sm text-neutral-500 font-normal"> / consultation</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <Button variant="primary" size="sm" icon={<Video className="w-4 h-4" />}>
                                            Video
                                        </Button>
                                        <Button variant="outline" size="sm" icon={<Phone className="w-4 h-4" />}>
                                            Call
                                        </Button>
                                        <Button variant="outline" size="sm" icon={<MessageSquare className="w-4 h-4" />}>
                                            Chat
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorConsultation;
