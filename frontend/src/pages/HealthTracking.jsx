import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Droplet, Moon, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../components/ui/Button';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';

const HealthTracking = () => {
    const [metrics, setMetrics] = useState({
        bloodPressure: { systolic: '', diastolic: '' },
        bloodSugar: '',
        weight: '',
        sleep: '',
        symptoms: ''
    });

    // Mock data for charts
    const bloodPressureData = [
        { date: 'Jan 28', systolic: 125, diastolic: 82 },
        { date: 'Jan 29', systolic: 122, diastolic: 80 },
        { date: 'Jan 30', systolic: 128, diastolic: 84 },
        { date: 'Jan 31', systolic: 120, diastolic: 78 },
        { date: 'Feb 1', systolic: 118, diastolic: 76 },
        { date: 'Feb 2', systolic: 121, diastolic: 79 },
    ];

    const bloodSugarData = [
        { date: 'Jan 28', value: 105 },
        { date: 'Jan 29', value: 98 },
        { date: 'Jan 30', value: 110 },
        { date: 'Jan 31', value: 95 },
        { date: 'Feb 1', value: 102 },
        { date: 'Feb 2', value: 99 },
    ];

    const handleInputChange = (field, value) => {
        setMetrics({ ...metrics, [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting metrics:', metrics);
        // TODO: Save to backend
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container-swiss py-6">
                    <h1 className="text-3xl font-semibold text-neutral-900 mb-1">Health Tracking</h1>
                    <p className="text-neutral-600">Monitor your daily health metrics and recovery progress</p>
                </div>
            </div>

            <div className="container-swiss py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Input Form */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-neutral-900">Log Today's Metrics</h2>
                            </CardHeader>
                            <CardBody>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Blood Pressure */}
                                    <div>
                                        <label className="label">Blood Pressure (mmHg)</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Systolic"
                                                value={metrics.bloodPressure.systolic}
                                                onChange={(e) => handleInputChange('bloodPressure', {
                                                    ...metrics.bloodPressure,
                                                    systolic: e.target.value
                                                })}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Diastolic"
                                                value={metrics.bloodPressure.diastolic}
                                                onChange={(e) => handleInputChange('bloodPressure', {
                                                    ...metrics.bloodPressure,
                                                    diastolic: e.target.value
                                                })}
                                            />
                                        </div>
                                    </div>

                                    {/* Blood Sugar */}
                                    <Input
                                        label="Blood Sugar (mg/dL)"
                                        type="number"
                                        placeholder="Enter value"
                                        value={metrics.bloodSugar}
                                        onChange={(e) => handleInputChange('bloodSugar', e.target.value)}
                                        icon={<Droplet className="w-5 h-5" />}
                                    />

                                    {/* Weight */}
                                    <Input
                                        label="Weight (kg)"
                                        type="number"
                                        step="0.1"
                                        placeholder="Enter weight"
                                        value={metrics.weight}
                                        onChange={(e) => handleInputChange('weight', e.target.value)}
                                        icon={<Activity className="w-5 h-5" />}
                                    />

                                    {/* Sleep */}
                                    <Input
                                        label="Sleep Duration (hours)"
                                        type="number"
                                        step="0.5"
                                        placeholder="Hours slept"
                                        value={metrics.sleep}
                                        onChange={(e) => handleInputChange('sleep', e.target.value)}
                                        icon={<Moon className="w-5 h-5" />}
                                    />

                                    {/* Symptoms */}
                                    <div>
                                        <label className="label">Symptoms / Notes</label>
                                        <textarea
                                            className="input resize-none"
                                            rows="3"
                                            placeholder="Any symptoms or notes..."
                                            value={metrics.symptoms}
                                            onChange={(e) => handleInputChange('symptoms', e.target.value)}
                                        />
                                    </div>

                                    <Button type="submit" variant="primary" className="w-full">
                                        Save Metrics
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Column - Charts and Insights */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardBody className="text-center">
                                    <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                    <p className="text-2xl font-semibold text-neutral-900">121/79</p>
                                    <p className="text-sm text-neutral-600">BP (mmHg)</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                                        Normal
                                    </span>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody className="text-center">
                                    <Droplet className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                    <p className="text-2xl font-semibold text-neutral-900">99</p>
                                    <p className="text-sm text-neutral-600">Sugar (mg/dL)</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                                        Normal
                                    </span>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody className="text-center">
                                    <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                                    <p className="text-2xl font-semibold text-neutral-900">72.5</p>
                                    <p className="text-sm text-neutral-600">Weight (kg)</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                                        -0.5kg
                                    </span>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody className="text-center">
                                    <Moon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                                    <p className="text-2xl font-semibold text-neutral-900">7.5</p>
                                    <p className="text-sm text-neutral-600">Sleep (hrs)</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                                        Good
                                    </span>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Blood Pressure Chart */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-neutral-900">Blood Pressure Trend</h3>
                            </CardHeader>
                            <CardBody>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={bloodPressureData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                                        <XAxis dataKey="date" stroke="#737373" />
                                        <YAxis stroke="#737373" />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="systolic" stroke="#0ea5e9" strokeWidth={2} name="Systolic" />
                                        <Line type="monotone" dataKey="diastolic" stroke="#10b981" strokeWidth={2} name="Diastolic" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card>

                        {/* Blood Sugar Chart */}
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-semibold text-neutral-900">Blood Sugar Trend</h3>
                            </CardHeader>
                            <CardBody>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={bloodSugarData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                                        <XAxis dataKey="date" stroke="#737373" />
                                        <YAxis stroke="#737373" />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} name="Blood Sugar" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardBody>
                        </Card>

                        {/* AI Insights */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary-600" />
                                    <h3 className="text-lg font-semibold text-neutral-900">AI Recovery Insights</h3>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium text-green-900">Great Progress!</p>
                                            <p className="text-sm text-green-700">Your blood pressure has been consistently in the normal range for the past 5 days.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium text-blue-900">Sleep Quality Improving</p>
                                            <p className="text-sm text-blue-700">You're averaging 7.5 hours of sleep, which is excellent for recovery.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                                        <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium text-yellow-900">Recommendation</p>
                                            <p className="text-sm text-yellow-700">Consider monitoring your blood sugar levels after meals to identify patterns.</p>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthTracking;
