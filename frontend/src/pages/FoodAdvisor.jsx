import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, AlertTriangle, Apple } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import Input from '../components/ui/Input';

const FoodAdvisor = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock health condition from AI analysis
    const healthCondition = {
        condition: 'Type 2 Diabetes',
        restrictions: ['High sugar', 'Refined carbs', 'Saturated fats']
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setSearchResults({
                foodName: searchQuery,
                status: 'allowed', // 'allowed', 'limited', 'avoid'
                safeQuantity: '1 medium apple (150g)',
                calories: 95,
                carbs: 25,
                sugar: 19,
                fiber: 4,
                reasoning: 'Apples are a good source of fiber and have a low glycemic index. The natural sugars are balanced by fiber content, making them suitable for diabetics in moderation.',
                benefits: ['Rich in fiber', 'Low glycemic index', 'Contains antioxidants'],
                warnings: ['Monitor portion size', 'Avoid apple juice'],
                alternatives: ['Berries', 'Pears', 'Oranges']
            });
            setLoading(false);
        }, 1500);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'allowed':
                return <CheckCircle className="w-8 h-8 text-green-600" />;
            case 'limited':
                return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
            case 'avoid':
                return <XCircle className="w-8 h-8 text-red-600" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'allowed':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'limited':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'avoid':
                return 'bg-red-50 border-red-200 text-red-800';
            default:
                return 'bg-neutral-50 border-neutral-200 text-neutral-800';
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container-swiss py-6">
                    <h1 className="text-3xl font-semibold text-neutral-900 mb-1">Food Advisor</h1>
                    <p className="text-neutral-600">Check food compatibility with your health condition</p>
                </div>
            </div>

            {/* Health Condition Banner */}
            <div className="bg-primary-50 border-b border-primary-100">
                <div className="container-swiss py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                            <Apple className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-600">Analyzing for:</p>
                            <p className="font-semibold text-neutral-900">{healthCondition.condition}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="container-swiss py-8">
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search for food items (e.g., apple, rice, chicken)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            icon={<Search className="w-5 h-5" />}
                            className="flex-1"
                        />
                        <Button
                            variant="primary"
                            onClick={handleSearch}
                            loading={loading}
                            disabled={!searchQuery.trim()}
                        >
                            Analyze
                        </Button>
                    </div>
                </div>

                {/* Search Results */}
                {searchResults && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <Card>
                            <CardBody className="p-6">
                                {/* Status Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        {getStatusIcon(searchResults.status)}
                                        <div>
                                            <h2 className="text-2xl font-semibold text-neutral-900 capitalize">
                                                {searchResults.foodName}
                                            </h2>
                                            <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 border ${getStatusColor(searchResults.status)}`}>
                                                {searchResults.status === 'allowed' ? '✓ Safe to Consume' :
                                                    searchResults.status === 'limited' ? '⚠ Consume with Caution' :
                                                        '✗ Avoid'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Safe Quantity */}
                                {searchResults.safeQuantity && (
                                    <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
                                        <h3 className="font-semibold text-neutral-900 mb-2">Recommended Portion</h3>
                                        <p className="text-lg text-primary-600 font-medium">{searchResults.safeQuantity}</p>
                                    </div>
                                )}

                                {/* Nutritional Info */}
                                <div className="grid grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-3 bg-neutral-50 rounded-lg">
                                        <p className="text-2xl font-semibold text-neutral-900">{searchResults.calories}</p>
                                        <p className="text-sm text-neutral-600">Calories</p>
                                    </div>
                                    <div className="text-center p-3 bg-neutral-50 rounded-lg">
                                        <p className="text-2xl font-semibold text-neutral-900">{searchResults.carbs}g</p>
                                        <p className="text-sm text-neutral-600">Carbs</p>
                                    </div>
                                    <div className="text-center p-3 bg-neutral-50 rounded-lg">
                                        <p className="text-2xl font-semibold text-neutral-900">{searchResults.sugar}g</p>
                                        <p className="text-sm text-neutral-600">Sugar</p>
                                    </div>
                                    <div className="text-center p-3 bg-neutral-50 rounded-lg">
                                        <p className="text-2xl font-semibold text-neutral-900">{searchResults.fiber}g</p>
                                        <p className="text-sm text-neutral-600">Fiber</p>
                                    </div>
                                </div>

                                {/* Reasoning */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-neutral-900 mb-2">Why?</h3>
                                    <p className="text-neutral-700 leading-relaxed">{searchResults.reasoning}</p>
                                </div>

                                {/* Benefits */}
                                {searchResults.benefits && searchResults.benefits.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-neutral-900 mb-2">Benefits</h3>
                                        <ul className="space-y-2">
                                            {searchResults.benefits.map((benefit, index) => (
                                                <li key={index} className="flex items-center gap-2 text-neutral-700">
                                                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Warnings */}
                                {searchResults.warnings && searchResults.warnings.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold text-neutral-900 mb-2">Important Notes</h3>
                                        <ul className="space-y-2">
                                            {searchResults.warnings.map((warning, index) => (
                                                <li key={index} className="flex items-center gap-2 text-neutral-700">
                                                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                                                    {warning}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Alternatives */}
                                {searchResults.alternatives && searchResults.alternatives.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-neutral-900 mb-3">Healthier Alternatives</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {searchResults.alternatives.map((alt, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                                                >
                                                    {alt}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </motion.div>
                )}

                {/* Empty State */}
                {!searchResults && !loading && (
                    <div className="max-w-2xl mx-auto text-center py-12">
                        <Apple className="w-20 h-20 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-neutral-900 mb-2">Search for Food Items</h3>
                        <p className="text-neutral-600">
                            Enter any food item to check if it's safe for your health condition
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FoodAdvisor;
