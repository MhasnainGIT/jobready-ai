import React from 'react';
import { Check, Star, Zap, Crown, Users } from 'lucide-react';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const PricingPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Basic',
            price: '₹0',
            credits: 1,
            usd: '~$0',
            description: 'Perfect for trying out our AI-powered tools',
            features: [
                '1 credit',
                'Access to resume analysis',
                'Basic grammar feedback',
                'Email support'
            ],
            icon: <Users className="w-6 h-6" />,
            buttonText: 'Get Started Free',
            buttonStyle: 'border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50',
            popular: false,
            planType: 'basic'
        },
        {
            name: 'Starter',
            price: '₹179',
            credits: 5,
            usd: '~$2.15',
            description: 'Ideal for job seekers who need occasional help',
            features: [
                '5 credits',
                'All Basic features',
                'Advanced skills matching',
                'Job description optimization',
                'Priority email support'
            ],
            icon: <Zap className="w-6 h-6" />,
            buttonText: 'Buy Starter',
            buttonStyle: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl',
            popular: true,
            planType: 'starter'
        },
        {
            name: 'Pro',
            price: '₹499',
            credits: 20,
            usd: '~$6',
            description: 'For serious job seekers and career changers',
            features: [
                '20 credits',
                'All Starter features',
                'Advanced AI feedback',
                'Industry-specific insights',
                'ATS optimization',
                'Priority chat support',
                'Weekly progress reports'
            ],
            icon: <Crown className="w-6 h-6" />,
            buttonText: 'Buy Pro',
            buttonStyle: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl',
            popular: false,
            planType: 'pro'
        }
    ];

    const features = [
        {
            title: 'AI-Powered Analysis',
            description: 'Advanced machine learning algorithms analyze your resume for grammar, structure, and content quality.'
        },
        {
            title: 'ATS Optimization',
            description: 'Ensure your resume passes Applicant Tracking Systems with our keyword optimization.'
        },
        {
            title: 'Industry Insights',
            description: 'Get tailored feedback based on your target industry and role requirements.'
        },
        {
            title: 'Interview Preparation',
            description: 'Practice with realistic questions and get AI-generated sample answers.'
        }
    ];

    const handlePayment = async (planType: string | null) => {
        if (planType === 'basic') {
            // Free plan: just redirect or show a message
            if (!isAuthenticated) {
                navigate('/signup');
            } else {
                navigate('/'); // or dashboard
            }
            return;
        }
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const orderRes = await fetch('/api/payments/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ planType })
            });
            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.message || 'Failed to create order');
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "JobReady AI",
                description: `Purchase ${planType} plan`,
                order_id: orderData.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch('/api/payments/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            order_id: response.razorpay_order_id,
                            payment_id: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            planType: planType
                        })
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyRes.ok) {
                        alert('Payment Successful!');
                    } else {
                        alert(verifyData.message || 'Payment verification failed');
                    }
                },
                prefill: {
                    name: "Your Name",
                    email: "your.email@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#3399cc"
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error: any) {
            console.error("Payment Error:", error);
            alert(error.message || "An error occurred during payment.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                        <Star className="w-4 h-4 mr-2" />
                        Simple, Transparent Pricing
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Choose Your Perfect Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Get job-ready faster with our AI-powered tools. No hidden fees, cancel anytime.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative p-8 ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''}`}
                            hover={!plan.popular}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            
                            <div className="text-center mb-8">
                                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                                    plan.popular 
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {plan.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-600 mb-4">{plan.description}</p>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                    <span className="text-gray-600 ml-2">{plan.usd}</span>
                                </div>
                                <div className="mb-2 text-blue-700 font-semibold">{plan.credits} credits</div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start">
                                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePayment(plan.planType)}
                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${plan.buttonStyle}`}
                            >
                                {plan.buttonText}
                            </button>
                        </Card>
                    ))}
                </div>

                {/* Features Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Why Choose JobReady AI?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Powerful features to accelerate your job search success
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="p-6" hover>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <Card className="p-12 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of professionals who've already improved their career prospects with JobReady AI
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all flex-1">
                            Start Free Trial
                        </button>
                        <button className="border-2 border-blue-200 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-500 transition-all flex-1">
                            Contact Sales
                        </button>
                    </div>
                </Card>

                {/* FAQ Section */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Can I upgrade or downgrade my plan?
                            </h3>
                            <p className="text-gray-600">
                                Yes, you can change your plan at any time. Changes take effect immediately, and we'll prorate any charges.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Do you offer refunds?
                            </h3>
                            <p className="text-gray-600">
                                We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Is my data secure?
                            </h3>
                            <p className="text-gray-600">
                                Absolutely. We use enterprise-grade encryption and never share your personal information with third parties.
                            </p>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Can I cancel anytime?
                            </h3>
                            <p className="text-gray-600">
                                Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;